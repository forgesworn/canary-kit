import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import jsQR from 'jsqr'
import { readFile,writeFile } from 'node:fs/promises'

const live=process.env.CANARY_MEET_URL,address=live||'https://canary.offline.test/'
const contexts=[],requests=[],sockets=[],errors=[]
const browser=await chromium.launch({headless:true,executablePath:process.env.CANARY_CHROMIUM_EXECUTABLE})
try{
 async function device(viewport={width:390,height:844},url=address,camera=true){
  const context=await browser.newContext({viewport,acceptDownloads:true,serviceWorkers:live?'allow':'block'});contexts.push(context)
  if(!live)await context.route(address+'**',async route=>{
   const file=new URL(route.request().url()).pathname.slice(1)||'index.html'
   await route.fulfill({contentType:file.endsWith('.js')?'application/javascript':file.endsWith('.png')?'image/png':file.endsWith('.webmanifest')?'application/manifest+json':'text/html',body:await readFile('local-site/'+file)})
  })
  context.on('request',r=>requests.push(r.url()))
  await context.addInitScript(camera=>{
   const credential=()=>({rawId:new Uint8Array([3,7,12]).buffer,getClientExtensionResults:()=>({prf:{results:{first:new Uint8Array(32).fill(72).buffer}}})})
   Object.defineProperty(navigator.credentials,'create',{configurable:true,value:async()=>credential()});Object.defineProperty(navigator.credentials,'get',{configurable:true,value:async()=>credential()})
   window.cameraCanvas=document.createElement('canvas');window.cameraCanvas.width=window.cameraCanvas.height=640;window.cameraStreams=[];window.cameraCalls=[]
   Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async constraints=>{
    window.cameraCalls.push(constraints)
    if(!camera)throw new DOMException('No camera','NotFoundError')
    const stream=window.cameraCanvas.captureStream(0);window.cameraStreams.push(stream);return stream
   }})
  },camera)
  const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));page.on('websocket',ws=>sockets.push(ws.url()))
  await page.clock.install({time:new Date('2026-10-23T12:00:05Z')});await page.goto(url);await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'))
  if(live)await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{polling:100},{timeout:15000})
  return page
 }
 async function pixels(page){return page.locator('#meet-qr').evaluate(c=>{
  const bytes=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let raw=''
  for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192))
  return{width:c.width,height:c.height,data:btoa(raw)}
 })}
 async function decode(page){const p=await pixels(page),decoded=jsQR(new Uint8ClampedArray(Buffer.from(p.data,'base64')),p.width,p.height);assert.ok(decoded?.data);return decoded.data}
 async function feed(page,source,mirror=false){
  const frame=await pixels(source)
  await page.waitForFunction(()=>window.cameraStreams.length>0)
  await page.evaluate(({frame,mirror})=>{
   const source=document.createElement('canvas');source.width=frame.width;source.height=frame.height
   const pixels=Uint8ClampedArray.from(atob(frame.data),c=>c.charCodeAt(0))
   source.getContext('2d').putImageData(new ImageData(pixels,frame.width,frame.height),0,0)
   const canvas=window.cameraCanvas;canvas.width=canvas.height=640;const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,640,640)
   if(mirror){ctx.translate(640,0);ctx.scale(-1,1)}ctx.drawImage(source,0,0,640,640)
   for(const stream of window.cameraStreams)for(const track of stream.getVideoTracks())if(track.readyState==='live')track.requestFrame()
  },{frame,mirror});await page.clock.runFor(800)
 }
 async function words(page){await page.locator('#meet-words').waitFor();return page.locator('#meet-words').innerText()}
 async function save(page,name){await page.locator('#meet-name').fill(name);await page.locator('#meet-save').click();await page.locator('#say').waitFor()}
 async function unlock(page){await page.locator('#unlock-device').click();await page.locator('#people').waitFor()}
 const phone=await device(),desktop=await device({width:1120,height:920})
 // Both browsers have the shell. Browser networking is disabled from this point.
 await phone.context().setOffline(true);await desktop.context().setOffline(true)
 for(const page of [phone,desktop]){await page.locator('#create').click();await page.locator('#meet-qr').waitFor()}
 const ownPhone=await decode(phone),ownDesktop=await decode(desktop)
 assert.ok(ownPhone.includes('#meet=CANARY-MEET:1:'));assert.ok(ownDesktop.includes('#meet='))
 // A camera pause never replaces or expires the saved connection.
 for(const page of [phone,desktop]){
  await page.clock.fastForward(61_000);await page.locator('#meet-read-again').waitFor()
  assert.equal(await page.evaluate(()=>window.cameraStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))),true)
 }
 assert.equal(await decode(phone),ownPhone);assert.equal(await decode(desktop),ownDesktop)
 for(const page of [phone,desktop])await page.locator('#meet-read-again').click()
 // Never reveal our nonce until the peer pin is actually persisted.
 await phone.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('Commit storage failed')}})
 await feed(phone,desktop);await phone.locator('#error').filter({hasText:'Commit storage failed'}).waitFor()
 assert.equal(await decode(phone),ownPhone);assert.equal(await phone.locator('#meet-words').count(),0)
 await phone.evaluate(()=>Storage.prototype.setItem=window.originalSetItem)
 // A reads first and keeps exactly its original public code for the slower device.
 await feed(phone,desktop);await phone.locator('#meet h1').filter({hasText:'Keep facing'}).waitFor();assert.ok((await decode(phone)).startsWith(ownPhone+':'))
 await feed(desktop,phone,true);await words(desktop);await feed(phone,desktop);await words(phone)
 const comparison=await words(phone);assert.equal(await words(desktop),comparison);assert.equal(comparison.split(' ').length,4)
 for(const page of [phone,desktop]){
  assert.equal(await page.evaluate(()=>window.cameraCalls.every(c=>c.audio===false&&c.video.facingMode.ideal==='user')),true)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
 }
 // Backgrounding clears camera/DOM but preserves the same encrypted matched state.
 await phone.locator('#lock').click();await phone.locator('#locked').waitFor();assert.equal(await phone.locator('#meet').textContent(),'')
 await unlock(phone);await phone.locator('.person-card').filter({hasText:'New person'}).click();assert.equal(await words(phone),comparison);assert.ok((await decode(phone)).startsWith(ownPhone+':'))
 await phone.locator('#meet-words').evaluate(el=>el.textContent='copper lantern meadow river');await phone.screenshot({path:'local/evidence/offline-meet-phone.png',fullPage:true})
 await desktop.locator('#meet-words').evaluate(el=>el.textContent='copper lantern meadow river');await desktop.screenshot({path:'local/evidence/offline-meet-desktop.png',fullPage:true})
 await save(phone,'Desktop friend');await save(desktop,'Phone friend');assert.equal(await phone.locator('#say').innerText(),await desktop.locator('#hear').innerText())
 for(const page of [phone,desktop])assert.equal(await page.evaluate(()=>window.cameraStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))),true)
 await phone.locator('.brand').click();await phone.locator('#add-person').click()
 assert.equal(await phone.locator('#create').isVisible(),true);assert.equal(await phone.locator('#setup-options').evaluate(el=>el.open),false);assert.equal(await phone.evaluate(()=>scrollY),0)
 console.log('Offline Connect: front-camera QR in both directions, mirrored frame, slower peer, fixed comparison, encrypted resume and reciprocal call words passed.')
 // A desktop with no camera can receive a public reply file; no secret is transferred.
 const noCamera=await device({width:1120,height:920},address,false);await noCamera.context().setOffline(true);await noCamera.locator('#create').click();await noCamera.locator('#meet-camera-state').filter({hasText:'Camera unavailable'}).waitFor()
 const link=await decode(noCamera),other=await device({width:390,height:844},link)
 assert.equal(other.url(),address);await other.context().setOffline(true);await other.locator('#meet-accept').click();await other.locator('#meet-qr').waitFor()
 await other.locator('#meet details > summary').click();const download=other.waitForEvent('download');await other.locator('#meet-export').click();const exported=await download
 const stream=await exported.createReadStream();const chunks=[];for await(const chunk of stream)chunks.push(chunk);const contents=Buffer.concat(chunks)
 assert.ok(contents.toString().startsWith('CANARY-MEET:1:'));assert.ok(contents.length<400)
 await noCamera.locator('#meet details > summary').click();await noCamera.locator('#meet-file').setInputFiles({name:'vouch-public-code.txt',mimeType:'text/plain',buffer:contents});await words(noCamera);await feed(other,noCamera);assert.equal(await words(noCamera),await words(other))
 await save(noCamera,'Phone with file');await save(other,'Desktop without camera')
 assert.equal(await noCamera.locator('#say').innerText(),await other.locator('#hear').innerText())
 // A permission grant arriving after Lock cannot restart camera capture.
 const late=await device();await late.evaluate(()=>Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:()=>new Promise(resolve=>{window.finishCamera=resolve})}))
 await late.locator('#create').click();await late.waitForFunction(()=>!!window.finishCamera);await late.locator('#lock').click();await late.evaluate(()=>{const stream=window.cameraCanvas.captureStream(0);window.lateStream=stream;window.finishCamera(stream)})
 await late.waitForFunction(()=>window.lateStream.getTracks().every(t=>t.readyState==='ended'));assert.equal(await late.locator('#meet').textContent(),'')
 assert.deepEqual(sockets,[]);assert.deepEqual(errors,[]);assert.equal(requests.some(url=>url.includes('#meet=')||url.includes('CANARY-MEET')),false);assert.deepEqual(requests.filter(url=>!url.startsWith(address)),[])
 const report={verified:new Date().toISOString(),live:!!live,fullyOfflineAfterShellLoaded:true,publicCardsOnly:true,noSetupClockDeadline:true,cameraPauseResumesSameConnection:true,commitPersistedBeforeNonceReveal:true,automaticFrontCameraExchange:true,mirroredFrameRead:true,ownCodeRemainsForSlowerPeer:true,matchedStateSurvivesLock:true,fixedFourWords:true,reciprocalSpokenWords:true,nextPersonOpensConnect:true,cameraLessDesktopPublicFile:true,lateCameraGrantStopped:true,noWebSockets:true,noExternalRequests:true,credentialProvider:'PRF stub',physicalPhoneAcceptance:false,physicalWebcamAcceptance:false,browserErrors:errors}
 await writeFile(`local/evidence/offline-meet${live?'-live':''}.json`,JSON.stringify(report,null,2)+'\n')
 console.log('Offline Connect passed, including camera-less public-file fallback and stopped late camera permission. Physical optics/PRF remain unqualified.')
}finally{await Promise.allSettled(contexts.map(c=>c.close()));await browser.close()}
