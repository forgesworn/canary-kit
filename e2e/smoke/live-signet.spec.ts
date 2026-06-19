import { test, expect } from '@playwright/test'

test.describe('Canary Signet production smoke', () => {
  test('exposes the NostrConnect login surface', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveTitle(/CANARY/)
    await expect(page.locator('#login-signet')).toBeVisible({ timeout: 15_000 })

    await page.locator('#login-signet').click()
    await expect(page.locator('#signet-login-dialog')).toBeVisible()

    const nostrConnectChoice = page.locator('#signet-login-dialog button[data-choice="nostrconnect"]')
    await expect(nostrConnectChoice).toBeVisible()
    await nostrConnectChoice.click()

    await expect(page.locator('#signet-login-nc-status')).toContainText('Waiting for signer to connect')

    const nostrConnectUri = page.locator('#signet-login-nc-uri')
    await expect(nostrConnectUri).toBeVisible()
    await expect
      .poll(async () => nostrConnectUri.inputValue(), { message: 'nostrconnect URI should be generated' })
      .toMatch(/^nostrconnect:\/\/[0-9a-f]{64}\?.*relay=/)
  })
})
