import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import jsQR from 'jsqr'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

const live = process.env.CANARY_MOBILE_URL
const address = live || 'https://canary.mobile.test/'
const root = resolve(import.meta.dirname, '..')
const contexts = [], requests = [], errors = []
const password = 'test-only orchard copper lantern ferry'
const scratch = await mkdtemp(join(tmpdir(), 'canary-mobile-'))
let browser, server
const html = await readFile(join(root, 'canary-local.html'), 'utf8')
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CANARY_CHROMIUM_EXECUTABLE })
  async function phone(url = address, { prf = true, init = true, viewport = { width: 390, height: 844 }, serviceWorkers = live ? 'allow' : 'block' } = {}) {
    const context = await browser.newContext({ viewport, acceptDownloads: true, serviceWorkers }); contexts.push(context)
    if (!live) await context.route(address + '**', async route => {
      const file = new URL(route.request().url()).pathname.slice(1) || 'index.html'
      const type = file.endsWith('.png') ? 'image/png' : file.endsWith('.webmanifest') ? 'application/manifest+json' : file.endsWith('.js') ? 'application/javascript' : 'text/html'
      await route.fulfill({ contentType: type, body: await readFile(join(root, 'local-site', file)) })
    })
    context.on('request', r => requests.push({ method: r.method(), url: r.url() }))
    if (init) await context.addInitScript(supported => {
      const credential = () => ({ rawId: new Uint8Array([1, 4, 9]).buffer, getClientExtensionResults: () => supported ? { prf: { results: { first: new Uint8Array(32).fill(82).buffer } } } : {} })
      Object.defineProperty(navigator.credentials, 'create', { configurable: true, value: async () => credential() })
      Object.defineProperty(navigator.credentials, 'get', { configurable: true, value: async () => credential() })
    }, prf)
    const page = await context.newPage(); page.setDefaultTimeout(10000)
    page.on('pageerror', e => errors.push(e.message)); page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await page.clock.install({ time: new Date('2026-10-23T12:00:05Z') })
    await page.goto(url); await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'))
    return page
  }
  const visible = (page, selector) => page.locator(selector).waitFor({ state: 'visible' })
  async function unlock(page) {
    if (await page.locator('#unlock-device').isVisible()) await page.locator('#unlock-device').click()
    else { await page.locator('#unlock-password').fill(password); await page.locator('#unlock-form button').click() }
    await visible(page, '#people')
  }
  async function background(page) {
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
    await visible(page, '#locked')
    assert.equal(await page.locator('#say').textContent(), '—')
    assert.equal(await page.locator('#connect-output').inputValue(), '')
    assert.equal(await page.locator('#people-list').textContent(), '')
    await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: false }))
  }
  async function fillPassphrase(page) {
    await visible(page, '#vault-create'); await page.locator('#new-password').fill(password); await page.locator('#confirm-password').fill(password); await page.locator('#create-submit').click()
  }
  async function qrLink(page) {
    const c = await page.locator('#pair-qr').evaluate(c => ({ width: c.width, height: c.height, data: [...c.getContext('2d').getImageData(0, 0, c.width, c.height).data] }))
    const decoded = jsQR(new Uint8ClampedArray(c.data), c.width, c.height)
    assert.ok(decoded?.data); return decoded.data
  }
  async function screenshot(page, file, words = false) {
    // Never persist generated secrets or words in visual evidence.
    if (words) await page.evaluate(() => { for (const [id,text] of [['say','gentle river'],['hear','copper dawn'],['signal','—'],['exchange-reference','1234 abcd 5678']]) document.getElementById(id).textContent = text })
    await page.screenshot({ path: join(root, 'local/evidence', file), fullPage: true })
  }
  const a = await phone()
  await screenshot(a, 'mobile-home.png')
  await a.setViewportSize({ width: 1100, height: 1000 }); await screenshot(a, 'desktop-home.png'); await a.setViewportSize({ width: 390, height: 844 })
  await a.locator('#install-welcome').click(); await visible(a, '#install-guide')
  await a.locator('#install-iphone').click(); assert.equal(await a.locator('#install-steps-iphone').isVisible(), true)
  await screenshot(a, 'mobile-install.png'); await a.locator('#install-back').click()
  // In-person: encrypt the maker's progress before showing any secret QR.
  await a.locator('#welcome-spoken-check').click(); await a.locator('#create').click(); await visible(a, '#pair-setup')
  const link = await qrLink(a)
  assert.ok(link.startsWith(address + '#pair='))
  const makerRecord = await a.evaluate(() => localStorage.getItem('canary.encrypted-vault.v1'))
  assert.ok(makerRecord); assert.equal(makerRecord.includes(link.split(':').at(-1)), false)
  const scanner = await phone()
  const frame = await a.locator('#pair-qr').evaluate(c => ({width:c.width,height:c.height,data:[...c.getContext('2d').getImageData(0,0,c.width,c.height).data]}))
  await scanner.evaluate(qr => {
    const canvas=document.createElement('canvas');canvas.width=qr.width;canvas.height=qr.height
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data),qr.width,qr.height),0,0)
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async constraints=>{
      window.testConstraints=constraints;const stream=canvas.captureStream(0);window.testTracks=stream.getTracks()
      canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data),qr.width,qr.height),0,0);stream.getVideoTracks()[0].requestFrame();return stream
    }})
  },frame)
  await scanner.locator('#welcome-spoken-check').click(); await scanner.locator('#show-join').click(); await scanner.clock.runFor(500); await visible(scanner,'#paired')
  assert.equal(await scanner.evaluate(()=>window.testConstraints.audio),false)
  assert.equal(await scanner.evaluate(()=>window.testTracks.every(t=>t.readyState==='ended')),true)
  const b = await phone(link)
  await visible(b, '#paired'); assert.equal(b.url(), address)
  await a.locator('#finish-exchange').click()
  const code = await a.locator('#exchange-reference').innerText()
  assert.equal(code, await b.locator('#exchange-reference').innerText())
  assert.equal(await a.locator('#say').innerText(), await b.locator('#hear').innerText())
  assert.equal(await b.locator('#say').innerText(), await a.locator('#hear').innerText())
  await a.locator('#quick-name').fill('Friend B'); await a.locator('#confirm-pair').click()
  await b.locator('#quick-name').fill('Friend A'); await b.locator('#keep-person').click(); await visible(b, '#confirm-pair'); await b.locator('#confirm-pair').click()
  for (const page of [a,b]) { assert.equal(await page.locator('#keep-card').isVisible(), false); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true) }
  // Panic path: reload -> device unlock -> one named person -> words/check.
  await a.reload(); await visible(a, '#locked'); await unlock(a); await a.locator('.person-card').filter({ hasText: 'Friend B' }).click()
  assert.equal(await a.locator('#pair-title').innerText(), 'Friend B')
  await a.setViewportSize({width:390,height:720})
  assert.equal(await a.evaluate(() => document.getElementById('open-check').getBoundingClientRect().bottom <= innerHeight), true, 'Quick check control must fit a smaller phone viewport')
  await a.setViewportSize({width:390,height:844})
  await screenshot(a, 'mobile-quick-check.png', true)
  // Regenerate the true words before checking.
  await a.clock.runFor(30000); await a.clock.setFixedTime(new Date('2026-10-23T12:00:36Z')); await b.clock.setFixedTime(new Date('2026-10-23T12:00:36Z')); await a.clock.runFor(250); await b.clock.runFor(250)
  await a.locator('#duress > summary').click(); await a.clock.runFor(250)
  const say = await a.locator('#say').innerText(), duress = await a.locator('#signal').innerText()
  await b.locator('#open-check').click()
  for (const [input,expected] of [[say,'normal words match'],[duress,'private signal matches'],['not valid','Pause.']]) {
    await b.locator('#heard-input').fill(input); await b.locator('#check-form button').click(); await b.locator('#check-result').filter({ hasText: expected }).waitFor()
  }
  await background(a); await unlock(a)
  // Recipient-encrypted remote setup, saved before leaving for a chat.
  await a.locator('#add-person').click(); await a.locator('#remote-start').click(); await a.locator('#connect-name').fill('Remote friend'); await a.locator('#connect-known').check(); await a.locator('#connect-form button').click(); await visible(a, '#connect-share')
  const offer = await a.locator('#connect-output').inputValue()
  await background(a); await unlock(a); await a.locator('#pending-connections .person-card').click()
  assert.equal(await a.locator('#connect-output').inputValue(), offer)
  const c = await phone(offer)
  await visible(c, '#connect-start'); assert.equal(c.url(), address)
  await c.locator('#connect-name').fill('Old friend'); await c.locator('#connect-known').check(); await c.locator('#connect-form button').click(); await visible(c, '#connect-share')
  const reply = await c.locator('#connect-output').inputValue()
  await background(c); await unlock(c); await c.locator('.person-card').click(); await c.locator('#resend-reply').click()
  assert.equal(await c.locator('#connect-output').inputValue(), reply)
  await a.reload(); await a.goto(reply); await visible(a, '#locked'); await a.locator('#unlock-device').click(); await visible(a, '#paired')
  await c.locator('#connect-read-code').click()
  for (const page of [a,c]) { await page.clock.setFixedTime(new Date('2026-10-23T12:00:36Z')); await page.clock.runFor(250) }
  assert.equal(await a.locator('#exchange-reference').innerText(), await c.locator('#exchange-reference').innerText())
  assert.equal(await a.locator('#say').innerText(), await c.locator('#hear').innerText())
  for (const page of [a,c]) { await page.locator('#confirm-pair').click(); await page.locator('#keep-card').waitFor({ state: 'hidden' }) }
  const wrongBrowser = await phone(reply); await wrongBrowser.locator('#error').filter({ hasText: 'no saved invitation' }).waitFor(); assert.equal(await wrongBrowser.evaluate(() => localStorage.length), 0)
  await a.goto(reply); await a.locator('#error').filter({ hasText: 'No matching invitation' }).waitFor()
  // Passphrase fallback, wrong-password refusal, portable backup/recovery.
  const d = await phone(address, { prf: false })
  await d.locator('#welcome-spoken-check').click(); await d.locator('#create').click(); await fillPassphrase(d); await visible(d, '#pair-setup'); await d.locator('#finish-exchange').click(); await d.locator('#quick-name').fill('Passphrase friend'); await d.locator('#confirm-pair').click(); await d.locator('.home').filter({ visible: true }).click()
  await d.locator('#vault-settings > summary').click(); const download = d.waitForEvent('download'); await d.locator('#backup').click(); const backupPath = join(scratch, 'backup.json'); await (await download).saveAs(backupPath)
  const backup = await readFile(backupPath,'utf8'); assert.equal(backup.includes('Passphrase friend'), false); assert.equal(JSON.parse(backup).device, undefined)
  await d.reload(); await d.locator('#unlock-password').fill('incorrect'); await d.locator('#unlock-form button').click(); await d.locator('#error').filter({ hasText: 'Could not unlock' }).waitFor(); await unlock(d)
  const recovered = await phone(); await recovered.locator('#restore-file').setInputFiles(backupPath); await visible(recovered, '#locked'); await unlock(recovered); await recovered.locator('.person-card').filter({ hasText:'Passphrase friend' }).click(); await visible(recovered,'#say')
  // Storage failures never claim successful pairing/progress.
  const failed = await phone(); await failed.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage unavailable') } }); await failed.locator('#welcome-spoken-check').click(); await failed.locator('#create').click(); await failed.locator('#error').filter({ hasText:'Storage unavailable' }).waitFor(); assert.equal(await failed.locator('#pair-setup').isVisible(), false)
  // Late native credential/camera callbacks cannot revive a manually locked app.
  const late = await phone()
  await late.evaluate(() => Object.defineProperty(navigator.credentials,'create',{configurable:true,value:()=>new Promise(resolve=>{window.finishCredential=resolve})}))
  await late.locator('#welcome-spoken-check').click(); await late.locator('#create').click(); await late.waitForFunction(()=>!!window.finishCredential); await late.locator('#lock').click()
  await late.evaluate(()=>window.finishCredential({rawId:new Uint8Array([1,4,9]).buffer,getClientExtensionResults:()=>({prf:{results:{first:new Uint8Array(32).fill(82).buffer}}})}))
  await late.waitForFunction(()=>!document.body.hasAttribute('aria-busy'))
  assert.equal(await late.locator('#welcome').isVisible(),true);assert.equal(await late.evaluate(()=>localStorage.length),0)
  await late.evaluate(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=20;window.lateStream=canvas.captureStream(0)
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:()=>new Promise(resolve=>{window.finishCamera=resolve})})
  })
  await late.locator('#welcome-spoken-check').click(); await late.locator('#show-join').click();await late.waitForFunction(()=>!!window.finishCamera);await late.locator('#scan-stop').click();await late.evaluate(()=>window.finishCamera(window.lateStream));await late.waitForFunction(()=>window.lateStream.getTracks().every(t=>t.readyState==='ended'))
  // A standalone download still runs without a server or install step.
  if (!live) {
    const file = await phone(pathToFileURL(join(root, 'canary-local.html')).href)
    await file.locator('#welcome-spoken-check').click(); await file.locator('#create').click(); await fillPassphrase(file); await visible(file, '#pair-setup'); await file.locator('#finish-exchange').click(); await file.locator('#confirm-pair').click(); await visible(file, '#say')
    assert.equal(await file.locator('#say').isVisible(), true)
  }
  // Exercise actual service-worker install and offline reload, locally and live.
  let offlineUrl = address
  if (!live) {
    server = createServer(async (request,response) => {
      const path = new URL(request.url,'http://localhost').pathname.slice(1) || 'index.html'
      if (!['index.html','manifest.webmanifest','sw.js','icon-192.png','icon-512.png','apple-touch-icon.png'].includes(path)) { response.writeHead(404);response.end();return }
      response.setHeader('Content-Type',path.endsWith('.js')?'application/javascript':path.endsWith('.png')?'image/png':path.endsWith('.webmanifest')?'application/manifest+json':'text/html')
      response.end(await readFile(join(root,'local-site',path)))
    })
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
    offlineUrl = `http://127.0.0.1:${server.address().port}/`
  }
  const offline = await phone(offlineUrl,{serviceWorkers:'allow'})
  await offline.waitForFunction(()=>!!navigator.serviceWorker.controller, { polling: 100 }, { timeout: 15000 })
  await offline.locator('#welcome-spoken-check').click(); await offline.locator('#create').click(); await visible(offline,'#pair-setup'); await offline.locator('#finish-exchange').click(); await offline.locator('#confirm-pair').click(); await offline.context().setOffline(true); await offline.reload(); await visible(offline,'#locked'); await unlock(offline); await offline.locator('.person-card').click(); await visible(offline,'#say')
  const cacheKeys=await offline.evaluate(async()=>{const keys=[];for(const name of await caches.keys())for(const request of await (await caches.open(name)).keys())keys.push(request.url);return keys})
  assert.ok(cacheKeys.length === 5); assert.equal(cacheKeys.some(url=>url.includes('#')||url.includes('connect=')||url.includes('pair=')),false)
  console.log('Actual service worker installed; offline reload/unlock/words passed. Cache contains only five public shell files.')
  assert.equal(requests.some(r=>r.method !== 'GET'),false)
  assert.equal(requests.some(r=>/#|CANARY-LOCAL|connect=|trust=/.test(r.url)),false)
  assert.deepEqual(requests.filter(r=>!r.url.startsWith(address)&&!r.url.startsWith('http://127.0.0.1:')&&!r.url.startsWith('file:')),[])
  assert.deepEqual(errors,[])
  const report={ verified:new Date().toISOString(),address,deviceUnlock:'PRF stub, not physical biometrics',mobilePanicPath:true,publicInviteEncryptedReply:true,encryptedProgressSurvivesBackgroundAndReload:true,replyReplayRejected:true,passphraseFallbackAndRecovery:true,offlineShell:true,physicalPhoneAcceptance:false,browserErrors:errors,standaloneDownload:!live,appRequests:requests.filter(r=>!r.url.startsWith('file:')).map(r=>({method:r.method,path:new URL(r.url).pathname})) }
  await writeFile(join(root,'local/evidence',live?'mobile-live.json':'mobile-journey.json'),JSON.stringify(report,null,2)+'\n')
  console.log('Mobile setup, quick check, normal/duress/mismatch, remote exchange/resume/replay, lock, fallback and recovery passed.')
} finally {
  for (const context of contexts) await context.close()
  if(browser)await browser.close()
  if(server)await new Promise(resolve=>server.close(resolve))
  await rm(scratch,{recursive:true,force:true})
}
