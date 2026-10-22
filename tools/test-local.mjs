import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdtemp, mkdir, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const scratch = await mkdtemp(join(tmpdir(), 'canary-local-check-'))
const engine = process.env.CANARY_BROWSER === 'webkit' ? webkit : chromium
const browser = await engine.launch({
  headless: true,
  ...(process.env.CANARY_CHROMIUM_EXECUTABLE && engine === chromium
    ? { executablePath: process.env.CANARY_CHROMIUM_EXECUTABLE } : {}),
}).catch(async error => {
  await rm(scratch, { recursive: true, force: true })
  throw error
})
const context = await browser.newContext({ offline: true, acceptDownloads: true, viewport: { width: 1100, height: 1000 } })
const network = []
const errors = []
context.on('request', request => { if (/^https?:|^wss?:/.test(request.url())) network.push(request.url()) })
context.on('page', page => {
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
})
const url = pathToFileURL(resolve(root, 'canary-local.html')).href
const startTime = new Date('2026-10-22T12:00:05Z')
const expectText = async (page, selector, value) => {
  await page.locator(selector).filter({ hasText: value }).waitFor()
}
async function open(path = url) {
  const page = await context.newPage()
  await page.clock.install({ time: startTime })
  await page.goto(path)
  await page.locator('#create').waitFor({ state: 'attached' })
  return page
}
async function activate(page) {
  await page.bringToFront()
  if (await page.locator('#resume').isVisible()) await page.locator('#resume').click()
}
async function save(page, button, filename) {
  await activate(page)
  if (!(await page.locator('#share').evaluate(el => el.open))) await page.locator('#share > summary').click()
  const download = page.waitForEvent('download')
  await page.locator(button).click()
  const result = await download
  const path = join(scratch, filename)
  await result.saveAs(path)
  return path
}

try {
  const first = await open()
  assert.equal(await first.locator('#start').isVisible(), true)
  const evidence = resolve(root, 'local/evidence')
  await mkdir(evidence, { recursive: true })
  if (engine === chromium) {
    await first.screenshot({ path: join(evidence, 'desktop.png'), fullPage: true })
    await first.setViewportSize({ width: 380, height: 844 })
    assert.equal(await first.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    await first.screenshot({ path: join(evidence, 'mobile.png'), fullPage: true })
    await first.setViewportSize({ width: 1100, height: 1000 })
  }
  await first.locator('#create').click()
  await first.locator('#say').filter({ hasNotText: '—' }).waitFor()
  const a = await first.locator('#say').innerText()
  const b = await first.locator('#hear').innerText()
  assert.notEqual(a, b)
  assert.equal(a.split(' ').length, 2)
  await first.locator('#setup-details > summary').click()
  await first.waitForFunction(() => document.getElementById('setup-words').textContent.trim().split(' ').length === 12)
  const setup = await first.locator('#setup-words').innerText()
  assert.equal(setup.split(' ').length, 12)
  const reference = await first.locator('#reference').innerText()

  const second = await open()
  await second.locator('#show-join').click()
  await second.locator('#setup-input').fill('not a valid secret')
  await second.locator('#join-form button').click()
  assert.equal(await second.locator('#paired').isVisible(), false)
  await second.locator('#setup-input').fill(setup)
  await second.locator('#join-form button').click()
  await expectText(second, '#say', b)
  assert.equal(await second.locator('#hear').innerText(), a)
  assert.equal(await second.locator('#reference').innerText(), reference)
  assert.equal(await second.locator('#setup-input').inputValue(), '')

  const ownPath = await save(first, '#save-mine', 'my-private.html')
  const theirPath = await save(first, '#save-theirs', 'their-private.html')
  const myHtml = await readFile(ownPath, 'utf8')
  const theirHtml = await readFile(theirPath, 'utf8')
  assert.ok(myHtml.includes('"role":"first"'))
  assert.ok(theirHtml.includes('"role":"second"'))
  assert.ok(myHtml.includes(setup))

  const savedA = await open(pathToFileURL(ownPath).href)
  await expectText(savedA, '#say', a)
  assert.equal(await savedA.locator('#share').evaluate(el => el.open), false)
  await savedA.locator('#duress > summary').click()
  await savedA.waitForFunction(() => document.getElementById('signal').textContent !== '—')
  const signal = await savedA.locator('#signal').innerText()
  assert.notEqual(signal, a)
  const savedB = await open(pathToFileURL(theirPath).href)
  await expectText(savedB, '#say', b)
  assert.equal(await savedB.locator('#hear').innerText(), a)
  await savedB.locator('#check > summary').click()
  await savedB.locator('#heard-input').fill(signal)
  await savedB.locator('#check-form button').click()
  await expectText(savedB, '#check-result', 'private signal matches')
  assert.equal(await savedB.locator('#heard-input').inputValue(), '')
  await savedB.locator('#heard-input').fill(a)
  await savedB.locator('#check-form button').click()
  await expectText(savedB, '#check-result', 'normal words match')
  await savedB.locator('#heard-input').fill(b)
  await savedB.locator('#check-form button').click()
  await expectText(savedB, '#check-result', 'do not match')
  await savedB.clock.runFor(30_000)
  assert.notEqual(await savedB.locator('#say').innerText(), b)
  await expectText(savedB, '#check-result', 'Words have changed')

  await savedB.locator('#pause').click()
  assert.equal(await savedB.locator('#word-area').isVisible(), false)
  assert.equal(await savedB.locator('#share').isVisible(), false)
  await savedB.locator('#resume').click()
  assert.equal(await savedB.locator('#word-area').isVisible(), true)
  await savedB.setViewportSize({ width: 380, height: 844 })
  assert.equal(await savedB.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await savedB.locator('#leave').click()
  assert.equal(await savedB.locator('#start').isVisible(), true)
  assert.equal(await savedB.locator('#say').innerText(), '—')
  assert.deepEqual(await context.cookies(), [])
  assert.equal(await savedB.evaluate(() => localStorage.length), 0)
  assert.deepEqual(network, [], 'The offline tool must make no network requests')
  assert.deepEqual(errors, [], 'The standalone file must not have browser/CSP errors')
  console.log(`${engine.name()}: offline setup, pairing, both private exports, rotation, normal/duress checks, echo rejection, privacy and mobile layout passed. No network requests.`)
} finally {
  await context.close()
  await browser.close()
  await rm(scratch, { recursive: true, force: true })
}
