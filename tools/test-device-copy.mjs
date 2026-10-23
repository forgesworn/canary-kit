import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import jsQR from 'jsqr'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
const root=resolve(import.meta.dirname,'..'), live=process.env.CANARY_DEVICE_URL
const address=live||'https://canary.device.test/'
const contexts=[],requests=[],errors=[],scratch=await mkdtemp(join(tmpdir(),'canary-device-copy-'))
const browser=await chromium.launch({headless:true,executablePath:process.env.CANARY_CHROMIUM_EXECUTABLE})
const password='test-only desktop copper orchard lantern'
try {
  async function device({desktop=false,prf=true}={}) {
    const context=await browser.newContext({viewport:desktop?{width:1100,height:900}:{width:390,height:844},acceptDownloads:true,serviceWorkers:live?'allow':'block'});contexts.push(context)
    if(!live)await context.route(address+'**',async route=>{
      const file=new URL(route.request().url()).pathname.slice(1)||'index.html'
      await route.fulfill({contentType:file.endsWith('.webmanifest')?'application/manifest+json':file.endsWith('.js')?'application/javascript':file.endsWith('.png')?'image/png':'text/html',body:await readFile(join(root,'local-site',file))})
    })
    context.on('request',r=>requests.push({method:r.method(),url:r.url()}))
    await context.addInitScript(supported=>{
      const credential=()=>({rawId:new Uint8Array([2,3,9]).buffer,getClientExtensionResults:()=>supported?{prf:{results:{first:new Uint8Array(32).fill(61).buffer}}}:{}})
      Object.defineProperty(navigator.credentials,'create',{configurable:true,value:async()=>credential()})
      Object.defineProperty(navigator.credentials,'get',{configurable:true,value:async()=>credential()})
    },prf)
    const page=await context.newPage();page.setDefaultTimeout(12000)
    page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text())})
    await page.clock.install({time:new Date('2026-10-23T12:00:05Z')});await page.goto(address);await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'))
    return page
  }
  const visible=(p,id)=>p.locator(id).waitFor({state:'visible'})
  async function unlock(page) {
    if(await page.locator('#unlock-device').isVisible())await page.locator('#unlock-device').click()
    else{await page.locator('#unlock-password').fill(password);await page.locator('#unlock-form button').click()}
    await visible(page,'#people')
  }
  async function person(page,name) {
    if(await page.locator('#people').isVisible())await page.locator('#add-person').click()
    await page.locator('#welcome-spoken-check').click();await page.locator('#create').click()
    if(await page.locator('#vault-create').isVisible()){await page.locator('#new-password').fill(password);await page.locator('#confirm-password').fill(password);await page.locator('#create-submit').click()}
    await visible(page,'#pair-setup');await page.locator('#finish-exchange').click();await page.locator('#quick-name').fill(name);await page.locator('#confirm-pair').click();await page.locator('.home').filter({visible:true}).click();await visible(page,'#people')
  }
  async function request(page) {
    if(await page.locator('#people').isVisible())await page.locator('#devices-people').click()
    else await page.locator('#devices-welcome').click()
    await page.locator('#device-start-receive').click();await visible(page,'#device-request-qr')
    const image=await page.locator('#device-request-qr').evaluate(c=>({width:c.width,height:c.height,data:[...c.getContext('2d').getImageData(0,0,c.width,c.height).data]}))
    const decoded=jsQR(new Uint8ClampedArray(image.data),image.width,image.height)
    assert.ok(decoded?.data.startsWith(address+'#device='),'Public receiving request must fit a real QR')
    return decoded.data
  }
  async function giveRequest(page,link) {
    await page.reload();await page.goto(link);await page.waitForURL(address)
    assert.equal(page.url(),address,'Device fragment must be removed before the app handles it')
    await visible(page,'#device-unlock-source');await page.locator('#device-unlock-source').click();await page.locator('#unlock-device').click();await visible(page,'#device-make-copy')
  }
  async function download(page,file) {
    const event=page.waitForEvent('download');await page.locator('#device-download-file').click();const path=join(scratch,file);await (await event).saveAs(path);return path
  }
  async function background(page) {
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))})
    await visible(page,'#locked');assert.equal(await page.locator('#devices').textContent(),'')
    await page.evaluate(()=>Object.defineProperty(document,'hidden',{configurable:true,value:false}));await unlock(page)
  }
  const source=await device(),destination=await device({desktop:true,prf:false})
  await person(source,'Alice');await person(source,'Bob');await person(destination,'Desktop friend')
  const original=await destination.evaluate(()=>JSON.parse(localStorage.getItem('canary.encrypted-vault.v1')))
  const link=await request(destination)
  await destination.screenshot({path:join(root,'local/evidence/device-receive-desktop.png'),fullPage:true})
  // Exercise the phone's actual in-app scanner, with a local canvas stream.
  const frame=await destination.locator('#device-request-qr').evaluate(c=>({width:c.width,height:c.height,data:[...c.getContext('2d').getImageData(0,0,c.width,c.height).data]}))
  await source.evaluate(qr=>{
    const canvas=document.createElement('canvas');canvas.width=qr.width;canvas.height=qr.height;canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data),qr.width,qr.height),0,0)
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async()=>{const stream=canvas.captureStream(0);window.deviceScanTracks=stream.getTracks();canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data),qr.width,qr.height),0,0);stream.getVideoTracks()[0].requestFrame();return stream}})
    Object.defineProperty(navigator,'canShare',{configurable:true,value:data=>data.files?.[0]?.type==='application/json'})
    Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.sharedCopy=await data.files[0].text();Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))}})
  },frame)
  await source.locator('#devices-people').click();await source.locator('#device-start-send').click();await source.locator('#device-scan').click();await source.clock.runFor(750);await visible(source,'#device-make-copy')
  assert.equal(await source.evaluate(()=>window.deviceScanTracks.every(t=>t.readyState==='ended')),true)
  await source.locator('.device-person').filter({hasText:'Bob'}).locator('input').uncheck()
  await source.locator('#device-make-copy').click();await visible(source,'#device-code')
  const code=await source.locator('#device-code').innerText(),first=await download(source,'first.json'),ciphertext=await readFile(first,'utf8')
  for(const value of ['Alice','Bob','Desktop friend',password])assert.equal(ciphertext.includes(value),false)
  await source.locator('#device-share-file').click();await visible(source,'#locked');assert.equal(await source.locator('#devices').textContent(),'');assert.equal(await source.evaluate(()=>window.sharedCopy),ciphertext)
  await source.evaluate(()=>Object.defineProperty(document,'hidden',{configurable:true,value:false}));await unlock(source);await source.locator('#devices-people').click();await source.locator('#device-resume-send').click()
  assert.equal(await source.locator('#device-code').innerText(),code)
  const resend=await download(source,'resend.json');assert.equal(await readFile(resend,'utf8'),ciphertext,'Backgrounding must resume the exact same encrypted copy/code')
  // File import decrypts locally, but nothing is committed until code confirmation.
  const before=await destination.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1'))
  await destination.locator('#device-copy-file').setInputFiles(first);await visible(destination,'#device-codes-match');assert.equal(await destination.locator('#device-code').innerText(),code)
  assert.equal(await destination.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1')),before)
  await destination.locator('#device-import-people').click();assert.equal(await destination.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1')),before)
  // A backgrounded preview must clear names, then resume receiving and reopen the file.
  await background(destination);await destination.locator('#devices-people').click();await destination.locator('#device-resume-receive').click();await destination.locator('#device-copy-file').setInputFiles(first);await visible(destination,'#device-codes-match')
  await destination.locator('#device-codes-match').check()
  // Failure must preserve both the original vault and its unconsumed receiving key.
  await destination.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('Storage unavailable')}})
  await destination.locator('#device-import-people').click();await destination.locator('#error').filter({hasText:'Storage unavailable'}).waitFor();assert.equal(await destination.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1')),before)
  await destination.evaluate(()=>{Storage.prototype.setItem=window.originalSet;delete window.originalSet})
  await destination.locator('#device-import-people').click();await visible(destination,'#device-receiver-done');await destination.locator('#device-receiver-done').click()
  assert.deepEqual((await destination.locator('.person-card strong').allTextContents()).sort(),['Alice','Desktop friend'])
  const after=await destination.evaluate(()=>JSON.parse(localStorage.getItem('canary.encrypted-vault.v1')))
  assert.equal(after.id,original.id);assert.deepEqual(after.password,original.password);assert.deepEqual(after.device,original.device)
  // Source retains its people; no automatic move or destination passphrase sharing.
  await source.locator('#device-back').click();assert.deepEqual((await source.locator('.person-card strong').allTextContents()).sort(),['Alice','Bob'])
  // Finish a second copy with one duplicate and one new person; destination name wins.
  await destination.locator('.person-card').filter({hasText:'Alice'}).click();await destination.locator('#person-details > summary').click();await destination.locator('#person-name').fill('My Alice');await destination.locator('#rename-form button').click();await destination.locator('.home').filter({visible:true}).click()
  const secondLink=await request(destination);await giveRequest(source,secondLink);await source.locator('#device-make-copy').click();await visible(source,'#device-code');const second=await download(source,'second.json')
  await destination.locator('#device-copy-file').setInputFiles(second);await visible(destination,'#device-codes-match');assert.ok((await destination.locator('#devices').innerText()).includes('1 to add · 1 already here'))
  // Evidence uses fixture names and a dummy comparison code.
  await source.evaluate(()=>{document.getElementById('device-code').textContent='1234 abcd 5678'});await source.screenshot({path:join(root,'local/evidence/device-send-mobile.png'),fullPage:true})
  await destination.evaluate(()=>{document.getElementById('device-code').textContent='1234 abcd 5678'});await destination.screenshot({path:join(root,'local/evidence/device-import-desktop.png'),fullPage:true})
  await destination.locator('#device-codes-match').check();await destination.locator('#device-import-people').click();await destination.locator('#device-receiver-done').click();assert.deepEqual((await destination.locator('.person-card strong').allTextContents()).sort(),['Bob','Desktop friend','My Alice'])
  await destination.reload();await unlock(destination);assert.deepEqual((await destination.locator('.person-card strong').allTextContents()).sort(),['Bob','Desktop friend','My Alice'])
  // A consumed request cannot be reused: importing into the next request rejects the old file.
  await request(destination);const pending=await destination.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1'));await destination.locator('#device-copy-file').setInputFiles(second);await destination.locator('#error').filter({hasText:'different device request'}).waitFor();assert.equal(await destination.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1')),pending)
  for(const page of [source,destination])assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
  assert.equal(requests.some(r=>r.method!=='GET'||/#|device=|device-request|device-copy/.test(r.url)),false);assert.deepEqual(requests.filter(r=>!r.url.startsWith(address)),[]);assert.deepEqual(errors,[])
  await writeFile(join(root,'local/evidence',live?'device-copy-live.json':'device-copy.json'),JSON.stringify({verified:new Date().toISOString(),address,publicQrDecoded:true,selectedPeopleOnly:true,encryptedRecipientCopy:true,exactResumeAfterBackground:true,previewRequiresCodeConfirmation:true,storageFailurePreservesOriginal:true,mergeKeepsNamesAndUnlock:true,requestConsumed:true,sourcePreserved:true,peopleSurviveReload:true,noSecretInRequests:true,physicalPhoneAcceptance:false,credentialProvider:'PRF stub and real passphrase encryption',browserErrors:errors},null,2)+'\n')
  console.log('Device copy passed: QR, recipient encryption, exact resume, selection, comparison, safe merge, unchanged unlock, storage-failure recovery, replay rejection and source preservation.')
}finally{
  for(const context of contexts)await context.close();await browser.close();await rm(scratch,{recursive:true,force:true})
}
