import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import jsQR from 'jsqr'
import { mkdtemp, mkdir, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer } from 'node:http'

const root = resolve(import.meta.dirname, '..')
const scratch = await mkdtemp(join(tmpdir(), 'canary-vault-check-'))
const password = 'test-only copper orchard lantern ferry'
const contexts = []
const requests = []
const errors = []
let browser, server

try {
  const html = await readFile(resolve(root, 'canary-local.html'))
  server = createServer((request, response) => {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()')
    response.end(html)
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${server.address().port}/`
  browser = await chromium.launch({ headless: true, ...(process.env.CANARY_CHROMIUM_EXECUTABLE ? { executablePath: process.env.CANARY_CHROMIUM_EXECUTABLE } : {}) })

  async function newDevice(address = url) {
    const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 844 } })
    contexts.push(context)
    context.on('request', request => { if (/^https?:|^wss?:/.test(request.url())) requests.push(request.url()) })
    const page = await context.newPage()
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.clock.install({ time: new Date('2026-10-22T12:00:05Z') })
    await page.goto(address)
    return page
  }
  const visible = (page, selector) => page.locator(selector).waitFor({ state: 'visible' })
  async function unlock(page) {
    if (await page.locator('#welcome').isVisible()) await page.locator('#your-people').click()
    if (await page.locator('#locked').isVisible()) {
      await page.locator('#unlock-password').fill(password)
      await page.locator('#unlock-form button').click()
      await visible(page, '#people')
    }
  }
  async function passphraseSave(page) {
    await page.locator('#keep-person').click()
    await visible(page, '#vault-create')
    await page.locator('#new-password').fill(password)
    await page.locator('#confirm-password').fill(password)
    await page.locator('#vault-create-form button').click()
    await page.locator('#save-state').filter({ hasText: 'Saved encrypted' }).waitFor()
  }
  async function rename(page, label) {
    await page.locator('#person-details > summary').click()
    await page.locator('#person-name').fill(label)
    await page.locator('#rename-form button').click()
    await page.locator('#pair-title').filter({ hasText: label }).waitFor()
  }
  async function stubPrf(page, supported = true) {
    await page.evaluate(supported => {
      const credential = () => ({ rawId: new Uint8Array([1, 2, 3]).buffer, getClientExtensionResults: () => supported ? { prf: { results: { first: new Uint8Array(32).fill(77).buffer } } } : {} })
      Object.defineProperty(navigator.credentials, 'create', { configurable: true, value: async () => credential() })
      Object.defineProperty(navigator.credentials, 'get', { configurable: true, value: async () => credential() })
    }, supported)
  }
  const evidence = resolve(root, 'local/evidence')
  await mkdir(evidence, { recursive: true })
  const a = await newDevice()
  await a.screenshot({ path: join(evidence, 'mobile.png'), fullPage: true })
  assert.equal(await a.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await a.setViewportSize({ width: 1100, height: 1000 })
  await a.screenshot({ path: join(evidence, 'desktop.png'), fullPage: true })
  await a.setViewportSize({ width: 390, height: 844 })
  await a.locator('#create').click()
  await visible(a, '#pair-setup')
  const reference = await a.locator('#setup-reference').innerText()
  await a.locator('#setup-details > summary').click()
  await a.waitForFunction(() => document.getElementById('setup-words').textContent.trim().split(' ').length === 12)
  const setup = await a.locator('#setup-words').innerText()
  const qr = await a.locator('#pair-qr').evaluate(canvas => ({ width: canvas.width, height: canvas.height, data: [...canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data] }))
  const decoded = jsQR(new Uint8ClampedArray(qr.data), qr.width, qr.height)
  assert.ok(decoded?.data.startsWith('CANARY-LOCAL:1:'))

  // A QR may occupy only part of a real camera frame. The full-frame 640px
  // reduction used to lose these original pixels; the centre retry must find it.
  const distant = await newDevice()
  await distant.evaluate(qr => {
    const source = document.createElement('canvas'); source.width = qr.width; source.height = qr.height
    source.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data), qr.width, qr.height), 0, 0)
    const frame = document.createElement('canvas'); frame.width = 1280; frame.height = 720
    const ctx = frame.getContext('2d'); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 1280, 720)
    ctx.imageSmoothingEnabled = false; ctx.drawImage(source, 580, 300, 120, 120)
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: async () => {
      const stream = frame.captureStream(0)
      ctx.drawImage(source, 580, 300, 120, 120); stream.getVideoTracks()[0].requestFrame()
      return stream
    } })
  }, qr)
  await distant.locator('#show-join').click()
  await distant.clock.runFor(500)
  await visible(distant, '#paired')
  assert.equal(await distant.locator('#reference').innerText(), reference)
  await distant.close()

  const b = await newDevice()
  // Feed the QR displayed by the other device through a real canvas-backed
  // MediaStream. No physical camera is opened and no frame is retained.
  await b.evaluate(qr => {
    const canvas = document.createElement('canvas'); canvas.width = qr.width; canvas.height = qr.height
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data), qr.width, qr.height), 0, 0)
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: async constraints => {
      window.testConstraints = constraints
      const stream = canvas.captureStream(0)
      window.testTracks = stream.getTracks()
      canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(qr.data), qr.width, qr.height), 0, 0)
      stream.getVideoTracks()[0].requestFrame()
      return stream
    } })
  }, qr)
  await b.locator('#show-join').click()
  await b.clock.runFor(500)
  await visible(b, '#paired')
  assert.equal(await b.locator('#reference').innerText(), reference)
  assert.equal(await b.evaluate(() => window.testConstraints.audio), false)
  assert.equal(await b.evaluate(() => window.testTracks.every(track => track.readyState === 'ended')), true)
  assert.equal(await b.evaluate(() => localStorage.length), 0, 'Scanning must work before creating any vault')
  await b.locator('#save-state').filter({ hasText: 'Here for now' }).waitFor()
  const bSay = await b.locator('#say').innerText()
  const bHear = await b.locator('#hear').innerText()
  await a.locator('#finish-exchange').click()
  await visible(a, '#paired')
  assert.equal(await a.evaluate(() => localStorage.length), 0, 'Showing a QR must not persist its secret')
  const aSay = await a.locator('#say').innerText()
  const aHear = await a.locator('#hear').innerText()
  assert.equal(aSay, bHear)
  assert.equal(aHear, bSay)
  await a.locator('#duress > summary').click()
  await a.waitForFunction(() => document.getElementById('signal').textContent !== '—')
  const signal = await a.locator('#signal').innerText()
  await b.locator('#check > summary').click()
  for (const [input, expected] of [[signal, 'private signal matches'], [aSay, 'normal words match'], [bSay, 'do not match']]) {
    await b.locator('#heard-input').fill(input)
    await b.locator('#check-form button').click()
    await b.locator('#check-result').filter({ hasText: expected }).waitFor()
  }
  await b.clock.runFor(30_000)
  assert.notEqual(await b.locator('#say').innerText(), bSay)
  await b.locator('#check-result').filter({ hasText: 'Words have changed' }).waitFor()
  assert.equal(await b.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)

  // Only keeping asks for storage protection. A signature-only provider must
  // fall back to a passphrase and must never write an unprotected vault.
  await stubPrf(a, false)
  await passphraseSave(a)
  await rename(a, 'Friend B')
  await stubPrf(b)
  await b.locator('#keep-person').click()
  await b.locator('#save-state').filter({ hasText: 'Saved encrypted' }).waitFor()
  const deviceRecord = await b.evaluate(() => JSON.parse(localStorage.getItem('canary.encrypted-vault.v1')))
  assert.equal(deviceRecord.password, undefined, 'Device encryption must not require a custom passphrase')
  assert.ok(deviceRecord.device)
  await rename(b, 'Friend A')
  await b.locator('.home').filter({ visible: true }).click()
  await b.locator('#vault-settings > summary').click()
  assert.equal(await b.locator('#backup').isVisible(), false, 'Do not export an unrecoverable device-only backup')
  await b.reload()
  await b.locator('#your-people').click()
  assert.equal(await b.locator('#unlock-form').isVisible(), false)
  await stubPrf(b)
  await b.locator('#unlock-device').click()
  await visible(b, '#people')
  assert.equal(await b.locator('.person-card strong').innerText(), 'Friend A')
  await b.locator('#vault-settings > summary').click()
  await b.locator('#add-recovery').click()
  await b.locator('#new-password').fill(password)
  await b.locator('#confirm-password').fill(password)
  await b.locator('#create-submit').click()
  await visible(b, '#backup')
  await b.locator('#vault-settings > summary').click()
  await b.screenshot({ path: join(evidence, 'vault-mobile.png'), fullPage: true })
  await b.locator('#add-person').click()

  const stored = await a.evaluate(() => localStorage.getItem('canary.encrypted-vault.v1'))
  for (const secret of [setup, 'Friend B', password]) assert.equal(stored.includes(secret), false)
  await a.locator('.home').filter({ visible: true }).click()
  await a.locator('#vault-settings > summary').click()
  // A signature-only authenticator must not produce a fake "device enabled" state.
  await a.evaluate(() => Object.defineProperty(navigator.credentials, 'create', { configurable: true, value: async () => ({ rawId: new Uint8Array([1]).buffer, getClientExtensionResults: () => ({}) }) }))
  await a.locator('#enable-device').click()
  await a.locator('#error').filter({ hasText: 'not supported' }).waitFor()
  assert.equal(await a.evaluate(() => JSON.parse(localStorage.getItem('canary.encrypted-vault.v1')).device), undefined)
  const download = a.waitForEvent('download')
  await a.locator('#backup').click()
  const backupPath = join(scratch, 'encrypted-backup.json')
  await (await download).saveAs(backupPath)
  const backup = await readFile(backupPath, 'utf8')
  assert.equal(backup.includes(setup), false)
  assert.equal(backup.includes('Friend B'), false)
  assert.equal(JSON.parse(backup).device, undefined)

  await a.reload()
  await visible(a, '#welcome')
  await a.locator('#your-people').click()
  assert.equal(await a.locator('#people-list').innerText(), '')
  await a.locator('#unlock-password').fill('incorrect passphrase')
  await a.locator('#unlock-form button').click()
  await a.locator('#error').filter({ hasText: 'Could not unlock' }).waitFor()
  assert.equal(await a.evaluate(() => localStorage.getItem('canary.encrypted-vault.v1')), stored)
  await unlock(a)
  await a.locator('.person-card').click()
  assert.equal(await a.locator('#say').innerText(), aSay)
  await a.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
  await visible(a, '#welcome')
  assert.equal(await a.locator('#say').innerText(), '—')
  assert.equal(await a.locator('#pair-title').innerText(), 'Our words.')
  await a.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: false }))
  await unlock(a)
  await a.clock.runFor(300_001)
  await visible(a, '#welcome')
  // A late camera permission grant after cancellation must not leave a camera
  // running or reopen pairing. This is a separate pending-permission stream.
  await b.evaluate(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: () => new Promise(resolve => { window.lateCamera = resolve }) })
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 20
    window.lateStream = canvas.captureStream(0)
    window.lateTracks = window.lateStream.getTracks()
  })
  await b.locator('#show-join').click()
  await b.locator('#scan-stop').click()
  await b.evaluate(() => window.lateCamera(window.lateStream))
  await b.waitForFunction(() => window.lateTracks.every(track => track.readyState === 'ended'))
  await b.locator('#manual-join > summary').click()
  await b.locator('#setup-input').fill(setup.split(' ').map(word => word.slice(0, 4)).join(' '))
  await b.locator('#join-form button').click()
  await visible(b, '#paired')
  assert.equal(await b.locator('#reference').innerText(), reference)
  // Keeping a fresh pair in an existing locked vault must preserve the pending
  // exchange across unlock and retain its other saved people.
  await b.locator('#lock').click()
  await b.locator('#create').click()
  await b.locator('#finish-exchange').click()
  await b.locator('#keep-person').click()
  await visible(b, '#locked')
  await b.locator('#unlock-device').click()
  await b.locator('#save-state').filter({ hasText: 'Saved encrypted' }).waitFor()
  await b.locator('.home').filter({ visible: true }).click()
  assert.equal(await b.locator('.person-card').count(), 2)

  const recovered = await newDevice()
  await recovered.locator('#restore-file').setInputFiles(backupPath)
  await visible(recovered, '#locked')
  await unlock(recovered)
  await recovered.locator('.person-card').click()
  assert.equal(await recovered.locator('#say').innerText(), aSay)

  // The same clean file remains executable without a host or installation.
  const file = await newDevice(pathToFileURL(resolve(root, 'canary-local.html')).href)
  await file.locator('#create').click()
  await file.locator('#finish-exchange').click()
  await passphraseSave(file)
  await file.locator('.home').filter({ visible: true }).click()
  await file.locator('#vault-settings > summary').click()
  assert.equal(await file.locator('#enable-device').isVisible(), false)
  assert.equal(await file.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  // Unsaved words must disappear on backgrounding, even without a vault.
  const transient = await newDevice()
  await transient.locator('#create').click()
  await transient.locator('#finish-exchange').click()
  await transient.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
  await visible(transient, '#welcome')
  assert.equal(await transient.locator('#say').innerText(), '—')
  assert.equal(await transient.evaluate(() => localStorage.length), 0)
  await transient.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: false }))
  await transient.locator('#create').click()
  await transient.locator('#finish-exchange').click()
  // Failed persistence must not claim saved or erase the unsaved words.
  await stubPrf(transient)
  await transient.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage unavailable') } })
  const unsavedWords = await transient.locator('#say').innerText()
  await transient.locator('#keep-person').click()
  await transient.locator('#error').filter({ hasText: 'Storage unavailable' }).waitFor()
  assert.equal(await transient.locator('#say').innerText(), unsavedWords)
  assert.equal(await transient.locator('#save-state').innerText(), 'Here for now. Keep this pair before you leave.')
  assert.equal(await transient.evaluate(() => localStorage.length), 0)
  await transient.clock.runFor(300_001)
  await visible(transient, '#welcome')
  assert.equal(await transient.locator('#say').innerText(), '—')
  // A device prompt that finishes after locking must not restore the pair or
  // write a vault. Header lock remains usable while the native prompt is pending.
  const late = await newDevice()
  await late.locator('#create').click()
  await late.locator('#finish-exchange').click()
  await late.evaluate(() => Object.defineProperty(navigator.credentials, 'create', { configurable: true, value: () => new Promise(resolve => { window.finishDevice = resolve }) }))
  await late.locator('#keep-person').click()
  await late.waitForFunction(() => !!window.finishDevice)
  await late.locator('#lock').click()
  await late.evaluate(() => window.finishDevice({ rawId: new Uint8Array([1]).buffer, getClientExtensionResults: () => ({ prf: { results: { first: new Uint8Array(32).fill(77).buffer } } }) }))
  await late.waitForFunction(() => !document.body.hasAttribute('aria-busy'))
  await visible(late, '#welcome')
  assert.equal(await late.locator('#say').innerText(), '—')
  assert.equal(await late.evaluate(() => localStorage.length), 0)
  assert.deepEqual(requests.filter(address => !address.startsWith(url)), [], 'No external requests are allowed')
  assert.deepEqual(errors, [], 'No browser or CSP errors are allowed')
  console.log('Chromium: no-form/no-vault pairing, transient clearing, device-only keeping and recovery, pending-pair unlock, failed-storage preservation; QR pairing through a canvas-fed camera, camera shutdown, four-letter setup, encrypted persistence/backups/recovery, wrong-password rejection, normal/duress checks, rotation, echo rejection, reload/background/idle locking and mobile/desktop/file layouts passed. No external network requests.')
} finally {
  for (const context of contexts) await context.close()
  await browser?.close()
  if (server) await new Promise(resolve => server.close(resolve))
  await rm(scratch, { recursive: true, force: true })
}
