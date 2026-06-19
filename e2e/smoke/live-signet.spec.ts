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
    const nostrConnectQr = page.locator('#signet-login-nc-qr')
    const copyButton = page.locator('#signet-login-dialog [data-action="copy"]')

    await expect(nostrConnectQr).toBeVisible()
    await expect(nostrConnectUri).toBeVisible()
    await expect(copyButton).toBeVisible()
    await expect
      .poll(async () => nostrConnectUri.inputValue(), { message: 'nostrconnect URI should be generated' })
      .toMatch(/^nostrconnect:\/\/[0-9a-f]{64}\?.*relay=/)

    const qrBox = await nostrConnectQr.boundingBox()
    const uriBox = await nostrConnectUri.boundingBox()
    expect(qrBox).not.toBeNull()
    expect(uriBox).not.toBeNull()
    expect(uriBox!.y).toBeGreaterThan(qrBox!.y + qrBox!.height - 1)

    const parsed = new URL(await nostrConnectUri.inputValue())
    expect(parsed.searchParams.getAll('relay').every(relay => /^wss?:\/\//.test(relay))).toBe(true)

    await copyButton.click()
    await expect(copyButton).toHaveText(/Copied|URI selected/)
  })
})
