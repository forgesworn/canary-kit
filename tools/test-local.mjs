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
    if (await page.locator('#locked').isVisible()) {
      await page.locator('#unlock-password').fill(password)
      await page.locator('#unlock-form button').click()
      await visible(page, '#people')
    }
  }
  async function create(page) {
    await page.locator('#setup-device').click()
    await page.locator('#new-password').fill(password)
    await page.locator('#confirm-password').fill(password)
    await page.locator('#vault-create-form button').click()
    await visible(page, '#people')
  }
  async function savePerson(page, label) {
    await page.locator('#person-name').fill(label)
    await page.locator('#reference-confirmed').check()
    await page.locator('#save-person-form button').click()
    await visible(page, '#paired')
    await page.locator('#say').filter({ hasNotText: '—' }).waitFor()
  }
  const evidence = resolve(root, 'local/evidence')
  await mkdir(evidence, { recursive: true })
  const a = await newDevice()
  await a.screenshot({ path: join(evidence, 'mobile.png'), fullPage: true })
  assert.equal(await a.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await a.setViewportSize({ width: 1100, height: 1000 })
  await a.screenshot({ path: join(evidence, 'desktop.png'), fullPage: true })
  await a.setViewportSize({ width: 390, height: 844 })
  await create(a)
  await a.screenshot({ path: join(evidence, 'vault-mobile.png'), fullPage: true })
  await a.locator('#add-person').click()
  await a.locator('#create').click()
  await visible(a, '#pair-setup')
  const reference = await a.locator('#setup-reference').innerText()
  await a.locator('#setup-details > summary').click()
  await a.waitForFunction(() => document.getElementById('setup-words').textContent.trim().split(' ').length === 12)
  const setup = await a.locator('#setup-words').innerText()
  const qr = await a.locator('#pair-qr').evaluate(canvas => ({ width: canvas.width, height: canvas.height, data: [...canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data] }))
  const decoded = jsQR(new Uint8ClampedArray(qr.data), qr.width, qr.height)
  assert.ok(decoded?.data.startsWith('CANARY-LOCAL:1:'))

  const b = await newDevice()
  await create(b)
  await b.locator('#add-person').click()
  await b.locator('#show-join').click()
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
  await b.locator('#scan-start').click()
  await b.clock.runFor(500)
  await visible(b, '#pair-setup')
  assert.equal(await b.locator('#setup-reference').innerText(), reference)
  assert.equal(await b.evaluate(() => window.testConstraints.audio), false)
  assert.equal(await b.evaluate(() => window.testTracks.every(track => track.readyState === 'ended')), true)
  await savePerson(b, 'Friend A')
  const bSay = await b.locator('#say').innerText()
  const bHear = await b.locator('#hear').innerText()
  await savePerson(a, 'Friend B')
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
  await visible(a, '#locked')
  assert.equal(await a.locator('#people-list').innerText(), '')
  await a.locator('#unlock-password').fill('incorrect passphrase')
  await a.locator('#unlock-form button').click()
  await a.locator('#error').filter({ hasText: 'Could not unlock' }).waitFor()
  assert.equal(await a.evaluate(() => localStorage.getItem('canary.encrypted-vault.v1')), stored)
  await unlock(a)
  await a.locator('.person-card').click()
  assert.equal(await a.locator('#say').innerText(), aSay)
  await a.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
  await visible(a, '#locked')
  assert.equal(await a.locator('#say').innerText(), '—')
  assert.equal(await a.locator('#pair-title').innerText(), 'Our words.')
  await a.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: false }))
  await unlock(a)
  await a.clock.runFor(300_001)
  await visible(a, '#locked')

  await b.locator('.home').filter({ visible: true }).click()
  await b.locator('#add-person').click()
  await b.locator('#show-join').click()
  // A late camera permission grant after cancellation must not leave a camera
  // running or reopen pairing. This is a separate pending-permission stream.
  await b.evaluate(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: () => new Promise(resolve => { window.lateCamera = resolve }) })
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 20
    window.lateStream = canvas.captureStream(0)
    window.lateTracks = window.lateStream.getTracks()
  })
  await b.locator('#scan-start').click()
  await b.locator('#scan-stop').click()
  await b.evaluate(() => window.lateCamera(window.lateStream))
  await b.waitForFunction(() => window.lateTracks.every(track => track.readyState === 'ended'))
  await b.locator('#manual-join > summary').click()
  await b.locator('#setup-input').fill(setup.split(' ').map(word => word.slice(0, 4)).join(' '))
  await b.locator('#join-form button').click()
  await visible(b, '#pair-setup')
  assert.equal(await b.locator('#setup-reference').innerText(), reference)

  const recovered = await newDevice()
  await recovered.locator('#restore-file').setInputFiles(backupPath)
  await visible(recovered, '#locked')
  await unlock(recovered)
  await recovered.locator('.person-card').click()
  assert.equal(await recovered.locator('#say').innerText(), aSay)

  // The same clean file remains executable without a host or installation.
  const file = await newDevice(pathToFileURL(resolve(root, 'canary-local.html')).href)
  await create(file)
  await file.locator('#vault-settings > summary').click()
  assert.equal(await file.locator('#enable-device').isVisible(), false)
  assert.equal(await file.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.deepEqual(requests.filter(address => !address.startsWith(url)), [], 'No external requests are allowed')
  assert.deepEqual(errors, [], 'No browser or CSP errors are allowed')
  console.log('Chromium: QR pairing through a canvas-fed camera, camera shutdown, four-letter setup, encrypted persistence/backups/recovery, wrong-password rejection, normal/duress checks, rotation, echo rejection, reload/background/idle locking and mobile/desktop/file layouts passed. No external network requests.')
} finally {
  for (const context of contexts) await context.close()
  await browser?.close()
  if (server) await new Promise(resolve => server.close(resolve))
  await rm(scratch, { recursive: true, force: true })
}
