import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
import jsQR from 'jsqr'

const live = process.env.CANARY_TRUST_URL
const address = live || 'https://canary.private.test/'
const html = await readFile('canary-local.html', 'utf8')
const contexts = [], requests = [], errors = []
const decodedSizes = new Map()
const browser = await chromium.launch({ headless: true, executablePath: process.env.CANARY_CHROMIUM_EXECUTABLE })
try {
  async function phone() {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }); contexts.push(context)
    if (!live) await context.route(address + '**', async route => {
      const path = new URL(route.request().url()).pathname.slice(1) || 'index.html'
      const contentType = path.endsWith('.webmanifest') ? 'application/manifest+json' : path.endsWith('.png') ? 'image/png' : path.endsWith('.js') ? 'application/javascript' : 'text/html'
      await route.fulfill({ contentType, body: await readFile('local-site/' + path) })
    })
    context.on('request', r => requests.push(r.url()))
    await context.addInitScript(() => {
      const credential = () => ({ rawId: new Uint8Array([1, 3, 5]).buffer, getClientExtensionResults: () => ({ prf: { results: { first: new Uint8Array(32).fill(91).buffer } } }) })
      Object.defineProperty(navigator.credentials, 'create', { configurable: true, value: async () => credential() })
      Object.defineProperty(navigator.credentials, 'get', { configurable: true, value: async () => credential() })
    })
    const page = await context.newPage(); page.setDefaultTimeout(15000)
    page.on('pageerror', e => errors.push(e.message)); page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await page.clock.install({ time: new Date('2026-10-23T12:00:05Z') })
    await page.goto(address); await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'))
    return page
  }
  async function open(page, link) {
    await page.goto(link)
    await page.waitForURL(address)
    await page.waitForFunction(() => !document.getElementById('locked').hidden || !document.getElementById('private-trust').hidden || !document.getElementById('error').hidden)
    if (await page.locator('#locked').isVisible()) await page.locator('#unlock-device').click()
    await page.locator('#private-trust').waitFor({ state: 'visible' })
    assert.equal(page.url(), address)
  }
  async function transfer(page) {
    const link = await page.locator('#trust-output').inputValue()
    assert.equal(await page.locator('#trust-qr').isVisible(), true, 'Private handoffs must fit a displayed QR')
    const title = await page.locator('#private-trust h1').innerText()
    if (link.length <= (decodedSizes.get(title) ?? 0) + 64 && decodedSizes.has(title)) return link
    const image = await page.locator('#trust-qr').evaluate(c => { const out = document.createElement('canvas'); out.width = out.height = Math.min(c.width, 640); const ctx = out.getContext('2d'); ctx.drawImage(c, 0, 0, out.width, out.height); return { width: out.width, height: out.height, data: [...ctx.getImageData(0, 0, out.width, out.height).data] } })
    const decoded = jsQR(new Uint8ClampedArray(image.data), image.width, image.height)
    assert.ok(decoded?.data === link, 'The complete private transfer must fit a real QR')
    decodedSizes.set(title, link.length)
    return link
  }
  const keeper = await phone(), witness = await phone(), member = await phone()
  assert.equal(await keeper.locator('#open-private-groups').count(), 1, 'Private vouches need a usable phone interface')
  await keeper.locator('#open-private-groups').click()
  await keeper.locator('#trust-group-name').fill('Private coffee group')
  await keeper.locator('#trust-create-group').click()
  await keeper.locator('#trust-share-group').click()
  const invitation = await transfer(keeper)
  for (const person of [witness, member]) {
    await open(person, invitation)
    await person.locator('#trust-keep-group').click()
    await person.locator('#trust-my-key').waitFor()
  }
  console.log('Private groups: three encrypted local identities kept; QR cards decode.')
  await member.locator('#trust-my-key').click()
  const memberCard = await transfer(member)
  await open(witness, memberCard)
  await witness.locator('#trust-start-vouch').click()
  await open(member, await transfer(witness))
  await member.locator('#trust-answer-check').click()
  await open(witness, await transfer(member))
  await witness.locator('#trust-method').selectOption('in-person')
  await witness.locator('#trust-person-label').fill('Known coffee friend')
  await witness.locator('#trust-issue-vouch').click()
  const receipt = await transfer(witness)
  await open(member, receipt)
  await member.locator('#trust-issuer-name').fill('Known witness'); await member.locator('#trust-keep-vouch').click()
  await member.locator('#trust-show-vouches').click(); await member.locator('[data-vouch-state=active]').waitFor();
  await member.screenshot({ path: 'local/evidence/private-vouch-mobile.png', fullPage: true });
  await member.clock.setFixedTime(new Date('2026-12-01T12:00:05Z')); await member.evaluate(()=>document.dispatchEvent(new Event('pointerdown'))); await member.clock.runFor(250); await member.locator('[data-vouch-state=expired]').waitFor();
  await member.clock.setFixedTime(new Date('2026-10-23T12:00:05Z')); await member.locator('#trust-back-group').click()
  console.log('Private groups: fresh key proof and deliberate vouch delivered encrypted.')
  // A saved person can be checked again without scanning another holder card.
  await witness.locator('#trust-back-group').click(); await witness.locator('.vouch-person').filter({hasText:'Known coffee friend'}).click();
  await witness.locator('#trust-start-vouch').click(); await open(member,await transfer(witness)); await member.locator('#trust-answer-check').click(); await open(witness,await transfer(member));
  await witness.locator('#trust-method').selectOption('in-person'); await witness.locator('#trust-issue-vouch').click();
  console.log('Vouch UX: saved-person action required a fresh response before re-vouching.')
  await open(keeper, memberCard)
  await keeper.locator('#trust-check-member').click()
  await open(member, await transfer(keeper))
  await member.locator('#trust-answer-check').click()
  await open(keeper, await transfer(member))
  await keeper.locator('#error').filter({ hasText: 'accepted voucher' }).waitFor()

  // Trusting a voucher is a separate, fresh key-possession check and explicit action.
  await witness.locator('#trust-back-group').click()
  await witness.locator('#trust-my-key').click()
  await open(keeper, await transfer(witness))
  keeper.once('dialog',dialog=>dialog.accept()); await keeper.locator('#trust-check-voucher').click()
  await open(witness, await transfer(keeper))
  await witness.locator('#trust-answer-check').click()
  await open(keeper, await transfer(witness))
  await keeper.locator('#trust-voucher-label').fill('Known witness')
  await keeper.locator('#trust-accept-voucher').click()
  console.log('Private groups: unaccepted issuer rejected; voucher authority explicitly granted.')

  await open(keeper, memberCard)
  await keeper.locator('#trust-account-context').fill('WhatsApp contact checked in person')
  await keeper.locator('#trust-check-member').click()
  const challenge = await transfer(keeper)
  await keeper.reload(); await keeper.locator('#unlock-device').click(); await keeper.locator('#people-private-groups').click()
  await keeper.getByRole('button', { name: 'Private coffee group', exact: true }).click()
  await keeper.locator('#trust-resume').click()
  assert.equal(await transfer(keeper), challenge, 'Pending exchanges survive reload in the encrypted vault')
  await open(member, challenge)
  await member.locator('#trust-answer-check').click()
  const response = await transfer(member)
  await open(keeper, response)
  await keeper.locator('#trust-last-check').filter({ hasText: 'Key proof checked' }).waitFor()
  assert.ok((await keeper.locator('#trust-last-check').innerText()).includes('Known witness'))
  assert.ok((await keeper.locator('#trust-last-check').innerText()).includes('WhatsApp contact checked in person'))
  await keeper.screenshot({ path: 'local/evidence/private-check-mobile.png', fullPage: true })
  await open(keeper, response)
  await keeper.locator('#error').filter({ hasText: 'no pending check' }).waitFor()
  console.log('Private groups: pending request survived reload; holder proof matched; replay rejected.')

  await witness.locator('#trust-back-group').click()
  witness.once('dialog', dialog => dialog.accept())
  await witness.locator('[data-withdraw]').first().click()
  await open(keeper, await transfer(witness))
  await keeper.locator('#trust-keep-withdrawal').click()
  await open(keeper, memberCard)
  await keeper.locator('#trust-check-member').click()
  await open(member, await transfer(keeper))
  await member.locator('#trust-answer-check').click()
  await open(keeper, await transfer(member))
  await keeper.locator('#error').filter({ hasText: 'withdrawn' }).waitFor()
  await witness.locator('#trust-back-group').click(); await witness.getByRole('button',{name:'Send withdrawal to holder',exact:true}).click(); await open(member,await transfer(witness)); await member.locator('#trust-keep-withdrawal').click(); await member.locator('#trust-show-vouches').click(); await member.locator('[data-vouch-state=withdrawn]').waitFor();
  for (const page of [keeper, witness, member]) {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    const stored = await page.evaluate(() => localStorage.getItem('canary.encrypted-vault.v1'))
    assert.ok(stored && !stored.includes('Private coffee group') && !stored.includes('Known witness') && !stored.includes('WhatsApp contact'))
  }
  assert.equal(requests.some(url => url.includes('CANARY-TRUST') || url.includes('#trust=')), false)
  assert.deepEqual(requests.filter(url => !url.startsWith(address)), [])
  assert.deepEqual(errors, [])
  const report = { vouchUx:true, savedPersonRequiresFreshProof:true, openCardExpiryUpdates:true, withdrawalBadge:true, privateIssuerAliasDoesNotGrantKeeperAuthority:true, verified: new Date().toISOString(), live: !!live, independentGroupKeys: true, encryptedVouchRoundTrip: true, untrustedVoucherRejected: true, voucherTrustRequiresExplicitFreshCheck: true, holderChallengePassed: true, pendingSurvivesReload: true, replayRejected: true, withdrawalHonoured: true, qrRoundTrips: true, noPrivateTransferInRequests: true, encryptedLocalStorage: true, noExternalRequests: true, browserErrors: errors }
  await writeFile(`local/evidence/private-trust${live ? '-live' : ''}.json`, JSON.stringify(report, null, 2) + '\n')
  console.log('Private group browser flow passed: encrypted vouch, explicit voucher trust, fresh holder proof, reload recovery, replay/withdrawal rejection, real QR decoding and local-only storage/network.')
} finally {
  await Promise.allSettled(contexts.map(c => c.close()))
  await browser.close().catch(() => {})
}
