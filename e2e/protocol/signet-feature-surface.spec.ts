// e2e/protocol/signet-feature-surface.spec.ts — Canary's Signet conformance surface
import { test, expect } from '../fixtures.js'

const TEST_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'

test.describe('Signet feature surface', () => {
  test('exposes every Canary-enabled Signet method with power-user fallbacks behind Advanced', async ({ cleanPage: page }) => {
    await page.evaluate(() => {
      const pubkey = 'a'.repeat(64)
      ;(window as Window & { nostr?: unknown }).nostr = {
        getPublicKey: async () => pubkey,
        signEvent: async (event: Record<string, unknown>) => ({
          ...event,
          pubkey,
          id: 'b'.repeat(64),
          sig: 'c'.repeat(128),
        }),
        nip44: {
          encrypt: async (_peer: string, plaintext: string) => plaintext,
          decrypt: async (_peer: string, ciphertext: string) => ciphertext,
        },
      }
    })
    await page.locator('#login-signet').click()

    const dialog = page.locator('#signet-login-dialog')
    await expect(dialog).toBeVisible()

    await expect(dialog.locator('button[data-choice="local-signet"]')).toBeVisible()
    await expect(dialog.locator('button[data-choice="remote-signet"]')).toBeVisible()
    await expect(dialog.locator('button[data-choice="nip07"]')).toBeVisible()
    await expect(dialog.locator('button[data-choice="nostrconnect"]')).toBeVisible()

    await expect(dialog.locator('button[data-choice="amber"]')).toHaveCount(0)
    await expect(dialog.locator('button[data-choice="bunker"]')).toHaveCount(0)
    await expect(dialog.locator('button[data-choice="nsec"]')).toHaveCount(0)

    await dialog.locator('button[data-action="advanced"]').click()
    await expect(dialog.locator('button[data-choice="bunker"]')).toBeVisible()
    await expect(dialog.locator('button[data-choice="nsec"]')).toBeVisible()
    await expect(dialog.locator('button[data-choice="nostrconnect"]')).toBeVisible()
  })

  test('keeps nsec fallback in memory and out of Signet session storage', async ({ cleanPage: page }) => {
    await page.locator('#login-signet').click()
    const dialog = page.locator('#signet-login-dialog')
    await expect(dialog).toBeVisible()

    await dialog.locator('button[data-action="advanced"]').click()
    await dialog.locator('button[data-choice="nsec"]').click()
    await dialog.locator('#signet-login-nsec-input').fill(TEST_NSEC)
    await dialog.locator('button[data-action="connect"]').click()

    await expect(page.locator('#sidebar')).toBeVisible({ timeout: 10_000 })

    const signetKeys = await page.evaluate(() =>
      Object.keys(localStorage)
        .filter(key => key.startsWith('signet:login.'))
        .sort(),
    )
    expect(signetKeys).not.toContain('signet:login.pubkey')
    expect(signetKeys).not.toContain('signet:login.method')
    expect(signetKeys).not.toContain('signet:login.authEvent')
  })
})
