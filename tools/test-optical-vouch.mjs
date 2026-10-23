import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {chromium} from 'playwright'
const live=process.env.CANARY_OPTICAL_URL,address=live||'https://vouch.optical.test/',browser=await chromium.launch({headless:true,executablePath:process.env.CANARY_CHROMIUM_EXECUTABLE})
const contexts=[],errors=[],requests=[]
let decodedFrames=0
try{
 async function device(){
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});contexts.push(context)
  if(!live)await context.route(address+'**',async route=>{const file=new URL(route.request().url()).pathname.slice(1)||'index.html';await route.fulfill({contentType:file.endsWith('.png')?'image/png':file.endsWith('.webmanifest')?'application/manifest+json':'text/html',body:await readFile('local-site/'+file)})})
  context.on('request',r=>requests.push(r.url()))
  await context.addInitScript(()=>{
   const credential=()=>({rawId:new Uint8Array([19,8,4]).buffer,getClientExtensionResults:()=>({prf:{results:{first:new Uint8Array(32).fill(71).buffer}}})})
   Object.defineProperty(navigator.credentials,'create',{configurable:true,value:async()=>credential()});Object.defineProperty(navigator.credentials,'get',{configurable:true,value:async()=>credential()})
  })
  const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message))
  await page.clock.install({time:new Date('2026-10-23T12:00:05Z')});await page.goto(address);await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'));return page
 }
 async function readMoving(reader,source,start){
  const first=await source.locator('#optical-qr').evaluate(c=>c.toDataURL('image/png').split(',')[1])
  await reader.evaluate(async encoded=>{
   const image=await createImageBitmap(new Blob([Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))],{type:'image/png'}));
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;window.qrFixture=canvas;canvas.getContext('2d').drawImage(image,0,0);image.close()
   Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async()=>{const stream=canvas.captureStream(0);window.qrFixtureTracks=stream.getTracks();return stream}})
  },first)
  await start();await reader.locator('#optical-video').waitFor()
  for(let n=0;n<260;n++){
   const frame=await source.locator('#optical-qr').evaluate(c=>c.toDataURL('image/png').split(',')[1])
   await reader.evaluate(async encoded=>{const image=await createImageBitmap(new Blob([Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))],{type:'image/png'}));const c=window.qrFixture;c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);image.close();window.qrFixtureTracks[0].requestFrame()},frame)
   await new Promise(resolve=>setTimeout(resolve,25));await reader.clock.runFor(180);decodedFrames++
   if(!await reader.locator('#optical').isVisible()){
    assert.equal(await reader.evaluate(()=>window.qrFixtureTracks.every(t=>t.readyState==='ended')),true);return
   }
   await source.clock.runFor(500)
  }
  throw new Error('Moving QR did not complete within two bounded cycles')
 }
 async function acceptVideo(page,name){await page.locator('#connect-name').fill(name);await page.locator('#connect-known').check();await page.locator('#connect-form button').click();await page.locator('#connect-share').waitFor()}
 async function home(page){await page.locator('.brand').click();await page.locator('#people').waitFor()}
 const a=await device(),b=await device();console.log('Optical fixture: new-person setup')
 await a.locator('#remote-start').click();await acceptVideo(a,'Video friend');await a.locator('#connect-optical').click()
 await readMoving(b,a,()=>b.locator('#optical-read-welcome').click());await b.locator('#connect-start').waitFor();await acceptVideo(b,'Other video friend');await b.locator('#connect-optical').click()
 await readMoving(a,b,()=>a.locator('#optical-scan-reply').click());await a.locator('#paired').waitFor()
 await b.locator('#optical-next').click();await b.locator('#paired').waitFor()
 assert.equal(await a.locator('#exchange-reference').innerText(),await b.locator('#exchange-reference').innerText())
 for(const page of [a,b])await page.locator('#confirm-pair').click()
 assert.equal(await a.locator('#say').innerText(),await b.locator('#hear').innerText())
 assert.equal(await a.locator('#check-choice-duress').isVisible(),true)
 await a.locator('#call-speak').click();assert.equal(await a.locator('#say').isVisible(),true);assert.equal(await a.locator('#signal').isVisible(),true);assert.equal(await a.locator('#check-choices').isVisible(),false)
 await home(a)
 const other=await device();console.log('Optical fixture: encrypted device copy')
 // Receiving request travels towards the source, encrypted copy travels back.
 await other.locator('#setup-options').evaluate(el=>el.open=true);await other.locator('#devices-welcome').click();await other.locator('#device-start-receive').click();await other.locator('#device-show-request-qr').click()
 await a.locator('#add-person').click();await readMoving(a,other,()=>a.locator('#optical-read-welcome').click());await a.locator('#device-make-copy').click();await a.locator('#device-show-copy-qr').click()
 const copyCode=await a.locator('#optical-copy-code').innerText()
 await readMoving(other,a,()=>other.locator('#optical-next').click());await other.locator('#device-codes-match').waitFor();assert.equal(await other.locator('#device-code').innerText(),copyCode)
 await other.locator('#device-codes-match').check();await other.locator('#device-import-people').click();await other.locator('#device-receiver-done').click();assert.deepEqual(await other.locator('.person-card strong').allTextContents(),['Video friend'])
 // Reverse direction retains the source, existing pair and device unlock.
 await a.locator('#optical-next').click();await a.locator('#device-finish-send').click();await a.locator('#device-sender-done').click()
 console.log('Optical fixture: reverse device copy');const before=await a.evaluate(()=>JSON.parse(localStorage.getItem('canary.encrypted-vault.v1')))
 await a.locator('#devices-people').click();await a.locator('#device-start-receive').click();await a.locator('#device-show-request-qr').click()
 await other.locator('#add-person').click();await readMoving(other,a,()=>other.locator('#optical-read-welcome').click());await other.locator('#device-make-copy').click();await other.locator('#device-show-copy-qr').click()
 await readMoving(a,other,()=>a.locator('#optical-next').click());await a.locator('#device-codes-match').check();await a.locator('#device-import-people').click();await a.locator('#device-receiver-done').click()
 const after=await a.evaluate(()=>JSON.parse(localStorage.getItem('canary.encrypted-vault.v1')))
 assert.equal(after.id,before.id);assert.deepEqual(after.device,before.device);assert.deepEqual(await a.locator('.person-card strong').allTextContents(),['Video friend'])
 for(const page of [a,b,other])assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
 assert.deepEqual(errors,[]);assert.deepEqual(requests.filter(url=>!url.startsWith(address)),[])
 await writeFile(live?'local/evidence/optical-transfer-live.json':'local/evidence/optical-transfer.json',JSON.stringify({verified:new Date().toISOString(),address,publicOfferAndEncryptedReply:true,fixedComparison:true,originalWordProfile:true,ownDuressVisibleInSpeak:true,animatedReceivingRequest:true,animatedEncryptedPeopleCopy:true,reverseDirection:true,duplicateMergeAndUnlockPreserved:true,actualQrPixelsThroughCameraDecoder:true,fixtureFrames:decodedFrames,cameraProvider:'local canvas stream; not physical video-call acceptance',credentialProvider:'PRF stub; real local encryption',noExtraNetwork:true,browserErrors:errors},null,2)+'\n')
 console.log('Moving QR passed: actual QR pixels through local camera decoder, public offer/encrypted reply, fixed comparison and encrypted people copying in both directions. Camera and credential providers are fixtures.')
}finally{await Promise.allSettled(contexts.map(c=>c.close()));await browser.close()}
