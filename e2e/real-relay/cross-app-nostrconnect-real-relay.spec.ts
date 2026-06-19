import { test, expect, type Page } from '@playwright/test'

const SIGNET_BASE_URL = process.env.SIGNET_BASE_URL ?? 'https://mysignet.app'
const REAL_RELAY_URL = process.env.NOSTRCONNECT_REAL_RELAY?.trim() || 'wss://relay.primal.net'
const DEFAULT_PIN = '123456'

async function enterPin(page: Page, pin = DEFAULT_PIN): Promise<void> {
  for (const digit of pin) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }
}

async function createSignetIdentity(page: Page): Promise<void> {
  await page.goto(SIGNET_BASE_URL)
  await page.getByRole('button', { name: 'I already have a Signet' }).click()
  await page.getByRole('button', { name: /12 backup words/ }).click()
  await page
    .getByPlaceholder('word1 word2 word3 ...')
    .fill('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Use my real name' }).click()
  await page.getByPlaceholder('Your name or nickname').fill('Canary Real Relay Signer')
  await page.getByRole('button', { name: 'Restore My Signet' }).click()
  await page.getByRole('button', { name: 'Set up now' }).click()
  await page.getByRole('button', { name: /6-digit PIN/ }).click()
  await enterPin(page)
  await enterPin(page)
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByText('Canary Real Relay Signer').waitFor({ state: 'visible', timeout: 60_000 })
}

async function unlockWithPin(page: Page): Promise<void> {
  const pinSwitch = page.getByRole('button', { name: 'Use PIN instead' })
  const keypadOne = page.getByRole('button', { name: '1', exact: true })
  await Promise.race([
    pinSwitch.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined),
    keypadOne.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined),
  ])
  if (await pinSwitch.isVisible().catch(() => false)) {
    await pinSwitch.click()
  }
  await keypadOne.waitFor({ state: 'visible', timeout: 10_000 })
  await enterPin(page)
}

async function confirmRealNameIfPrompted(page: Page): Promise<void> {
  await page
    .getByRole('button', { name: /Yes, (use|connect with) my real-name identity/ })
    .click({ timeout: 8_000 })
    .catch(() => {})
}

test.describe('Canary and Signet production NostrConnect real-relay smoke', () => {
  test.setTimeout(180_000)

  test('pairs deployed Canary with deployed Signet through a public relay and restores NIP-44', async ({ browser, page }) => {
    await page.addInitScript((relayUrl) => {
      if (!sessionStorage.getItem('canary-real-relay-nostrconnect-seeded')) {
        localStorage.clear()
        sessionStorage.setItem('canary-real-relay-nostrconnect-seeded', '1')
      }
      ;(window as Window & { __CANARY_SIGNET_TEST_RELAYS__?: string[] }).__CANARY_SIGNET_TEST_RELAYS__ = [relayUrl]
    }, REAL_RELAY_URL)

    const signetContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const signetPage = await signetContext.newPage()

    try {
      await createSignetIdentity(signetPage)

      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.locator('#login-signet').click()
      await expect(page.locator('#signet-login-dialog')).toBeVisible()

      await page.locator('#signet-login-dialog button[data-choice="nostrconnect"]').click()
      await expect(page.locator('#signet-login-nc-status')).toContainText('Waiting for signer to connect')

      const uriInput = page.locator('#signet-login-nc-uri')
      const copyButton = page.locator('#signet-login-dialog [data-action="copy"]')
      await expect(uriInput).toBeVisible()
      await expect(copyButton).toBeVisible()
      await copyButton.click()
      await expect(copyButton).toHaveText(/Copied|URI selected/)

      const uri = await uriInput.inputValue()
      expect(uri).toContain(`relay=${encodeURIComponent(REAL_RELAY_URL)}`)

      const connectUrl = new URL('/', SIGNET_BASE_URL)
      connectUrl.searchParams.set('nostrconnect', uri)
      await signetPage.goto(connectUrl.toString())
      await unlockWithPin(signetPage)
      await expect(signetPage.getByRole('heading', { name: 'Connection Request' })).toBeVisible({ timeout: 20_000 })
      await expect(signetPage.getByText('CANARY', { exact: false }).first()).toBeVisible()
      await expect(signetPage.getByText(REAL_RELAY_URL, { exact: false })).toBeVisible()

      await confirmRealNameIfPrompted(signetPage)
      await signetPage.getByRole('button', { name: 'Approve' }).click()
      await expect(signetPage.getByText('Connected!')).toBeVisible({ timeout: 45_000 })

      await expect(page.locator('#signet-login-dialog')).toBeHidden({ timeout: 45_000 })
      await expect(page.locator('#sidebar')).toBeVisible({ timeout: 20_000 })

      await page.waitForFunction(() => {
        const raw = localStorage.getItem('canary:identity')
        if (!raw) return false
        const identity = JSON.parse(raw) as { pubkey?: string } | null
        return /^[0-9a-f]{64}$/.test(identity?.pubkey ?? '')
      })
      const identity = await page.evaluate(() => JSON.parse(localStorage.getItem('canary:identity') ?? 'null') as {
        pubkey?: string
        signerMethod?: string
        signerType?: string
      } | null)
      expect(identity).toMatchObject({
        signerMethod: 'bunker',
        signerType: 'nip07',
      })
      expect(identity?.pubkey).toMatch(/^[0-9a-f]{64}$/)

      await page.reload()
      await page.waitForFunction(() => !!(window as Window & {
        Signet?: { restoreSession?: unknown }
      }).Signet?.restoreSession)

      const restoredRoundTrip = await page.evaluate(async () => {
        const signet = (window as Window & {
          Signet?: {
            restoreSession: () => Promise<{
              pubkey: string
              signer: {
                nip44?: {
                  encrypt: (peer: string, plaintext: string) => Promise<string>
                  decrypt: (peer: string, ciphertext: string) => Promise<string>
                }
              }
            } | null>
          }
        }).Signet
        const session = await signet?.restoreSession()
        if (!session?.signer.nip44) return null
        const ciphertext = await session.signer.nip44.encrypt(session.pubkey, 'production-real-relay-secret')
        return session.signer.nip44.decrypt(session.pubkey, ciphertext)
      })
      expect(restoredRoundTrip).toBe('production-real-relay-secret')
    } finally {
      await signetContext.close()
    }
  })
})
