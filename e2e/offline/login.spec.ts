// e2e/offline/login.spec.ts — Login screen tests
import { test, expect } from '../fixtures.js'
import { loginOffline, loginWithNsec, loginWithDemo } from '../helpers.js'

// Demo account nsec for testing (Alice)
const ALICE_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'

test.describe('Login screen', () => {
  test('shows login screen with no prior state', async ({ cleanPage: page }) => {
    await expect(page.locator('.lock-screen')).toBeVisible()
    await expect(page.locator('text=CANARY')).toBeVisible()
    await expect(page.locator('#offline-form')).toBeVisible()
  })

  test('offline start creates identity and shows main app', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await expect(page.locator('#sidebar')).toBeVisible()
    await expect(page.locator('#create-group-btn')).toBeVisible()
  })

  test('offline start sets display name', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    // Identity badge should show the name
    await expect(page.locator('.identity-badge__name')).toHaveText('Alice')
  })

  test('nsec login with valid key creates identity', async ({ cleanPage: page }) => {
    await loginWithNsec(page, ALICE_NSEC)
    await expect(page.locator('#sidebar')).toBeVisible()
  })

  test('nsec login with invalid key shows error', async ({ cleanPage: page }) => {
    // Listen for the alert dialog
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Invalid nsec')
      await dialog.accept()
    })
    await page.fill('#login-nsec', 'not-a-real-nsec')
    await page.click('#nsec-login-form button[type="submit"]')
  })

  test('can retry login after invalid nsec error', async ({ cleanPage: page }) => {
    // First attempt with invalid nsec — existing test verifies the alert appears
    page.once('dialog', async dialog => await dialog.accept())
    await page.fill('#login-nsec', 'not-a-real-nsec')
    await page.click('#nsec-login-form button[type="submit"]')
    await page.waitForTimeout(300)

    // The login screen should still be visible (not crashed)
    await expect(page.locator('.lock-screen')).toBeVisible()

    // Should be able to use offline login as fallback
    await loginOffline(page, 'Fallback')
    await expect(page.locator('#sidebar')).toBeVisible()
  })

  test('demo account button loads correct identity', async ({ cleanPage: page }) => {
    await loginWithDemo(page, 'Alice')
    await expect(page.locator('.identity-badge__name')).toHaveText('Alice')
  })

  test('preserves #inv/ hash through offline login flow', async ({ cleanPage: page }) => {
    // Navigate to a URL with a binary invite hash (fake payload — too short to decode)
    await page.goto('/#inv/dGVzdA==')
    // Should show login screen (no identity yet)
    await expect(page.locator('.lock-screen')).toBeVisible()
    // Login
    await loginOffline(page, 'Invitee')
    // After login, checkInviteFragment should process the hash (and clear it).
    // The hash is cleared by checkInviteFragment regardless of whether the invite is valid.
    await page.waitForFunction(() => !window.location.hash.startsWith('#inv/'), { timeout: 5000 })
  })
})
