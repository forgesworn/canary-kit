import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import jsQR from 'jsqr'
import { writeFile } from 'node:fs/promises'
const url = 'https://canary-words.cocoacod256.chatgpt.site/'
const requests = [], errors = [], contexts = []
const browser = await chromium.launch({ headless: true, executablePath: process.env.CANARY_CHROMIUM_EXECUTABLE })
try {
  async function device(address = url) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    contexts.push(context)
    context.on('request', request => requests.push({ method: request.method(), url: request.url() }))
    const page = await context.newPage()
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await page.clock.install({ time: new Date('2026-10-23T12:00:05Z') })
    const response = await page.goto(address)
    assert.equal(response.status(), 200)
    assert.equal(await page.evaluate(() => isSecureContext && !!crypto.subtle), true)
    return page
  }
  const maker = await device()
  assert.equal(await maker.locator('#welcome').isVisible(), true)
  assert.equal(await maker.locator('#hosting-note').isVisible(), false)
  assert.equal(await maker.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await maker.screenshot({ path: 'local/evidence/live-mobile.png', fullPage: true })
  await maker.setViewportSize({ width: 1100, height: 1000 })
  await maker.screenshot({ path: 'local/evidence/live-desktop.png', fullPage: true })
  await maker.setViewportSize({ width: 390, height: 844 })
  await maker.locator('#create').click()
  const qr = await maker.locator('#pair-qr').evaluate(canvas => ({ width: canvas.width, height: canvas.height, data: [...canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data] }))
  const link = jsQR(new Uint8ClampedArray(qr.data), qr.width, qr.height).data
  assert.ok(link.startsWith(url + '#pair=CANARY-LOCAL:1:'))
  const receiver = await device(link)
  await receiver.locator('#paired').waitFor({ state: 'visible' })
  assert.equal(receiver.url(), url)
  assert.equal(await receiver.evaluate(() => window.canaryIncoming), undefined)
  await maker.locator('#finish-exchange').click()
  assert.equal(await maker.locator('#say').innerText(), await receiver.locator('#hear').innerText())
  assert.equal(await maker.locator('#hear').innerText(), await receiver.locator('#say').innerText())
  for (const page of [maker, receiver]) assert.equal(await page.evaluate(() => localStorage.length), 0)
  assert.equal(requests.some(r => r.url.includes('CANARY-LOCAL') || r.url.includes('#pair=')), false)
  assert.deepEqual(requests.filter(r => !r.url.startsWith(url)), [])
  assert.deepEqual(errors, [])
  const report = { url, verified: new Date().toISOString(), unauthenticated: true, secureContext: true, normalCameraLinkOpenedInFreshBrowser: true, matchedWords: true, fragmentRemoved: true, noSecretInRequests: true, noPairPersistedBeforeKeep: true, browserErrors: errors, cookies: (await contexts[0].cookies()).map(cookie => ({ name: cookie.name, domain: cookie.domain, secure: cookie.secure, sameSite: cookie.sameSite })), requests: requests.map(r => ({ method: r.method, path: new URL(r.url).pathname })) }
  await writeFile('local/evidence/live-browser.json', JSON.stringify(report, null, 2) + '\n')
  console.log('Live HTTPS: anonymous access, secure context, normal-camera QR link opening in a fresh browser, matching words, fragment removal, no secret in requests and no pair persistence before Keep passed. No browser/CSP errors or external application requests. Physical iPhone scanning remains owner acceptance.')
} finally {
  for (const context of contexts) await context.close()
  await browser.close()
}
