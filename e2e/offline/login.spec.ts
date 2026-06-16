// e2e/offline/login.spec.ts — Login screen tests
import { test, expect } from '../fixtures.js'
import { loginOffline } from '../helpers.js'

test.describe('Login screen', () => {
  test('shows login screen with no prior state', async ({ cleanPage: page }) => {
    await expect(page.locator('.lock-screen')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'CANARY' })).toBeVisible()
    await expect(page.locator('#offline-form')).toBeVisible()
    await expect(page.locator('#login-signet')).toBeVisible()
    await expect(page.locator('#login-nsec')).toHaveCount(0)
    await expect(page.locator('#nsec-login-form')).toHaveCount(0)
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

  test('relay manager can disable, set read-only, add, and delete relays', async ({ cleanPage: page }) => {
    await page.locator('.login-details__summary', { hasText: 'Relays' }).click()

    const writeRow = page.locator('.login-relay-item', { hasText: 'relay.trotters.cc' })
    await expect(writeRow.locator('.login-relay-toggle')).toHaveText('On')
    await expect(writeRow.locator('.login-relay-mode')).toHaveValue('readwrite')

    await writeRow.locator('.login-relay-mode').selectOption('read')
    await expect(writeRow.locator('.login-relay-mode')).toHaveValue('read')

    await writeRow.locator('.login-relay-toggle').click()
    await expect(writeRow.locator('.login-relay-toggle')).toHaveText('Off')

    await page.fill('#login-relay-input', 'wss://relay.example.com')
    await page.click('#login-relay-add')
    const customRow = page.locator('.login-relay-item', { hasText: 'relay.example.com' })
    await expect(customRow).toBeVisible()
    await expect(customRow.locator('.login-relay-mode')).toHaveValue('readwrite')
    await customRow.locator('.login-relay-delete').click()
    await expect(customRow).toHaveCount(0)
  })

  test('secure invite link shows invite-aware Signet login', async ({ cleanPage: page }) => {
    await page.goto('/#j/0123456789abcdef0123456789abcdef')

    await expect(page.locator('.lock-screen')).toBeVisible()
    await expect(page.locator('.lock-screen__hint')).toHaveText('Secure group invitation')
    await expect(page.locator('.login-invite__label')).toHaveText('Secure invite')
    await expect(page.locator('.login-invite__title')).toHaveText('You have been invited to a CANARY group')
    await expect(page.getByText('Sign in with Signet to request the group key over relays.')).toBeVisible()
    await expect(page.locator('#login-signet')).toHaveText('Join with Signet')
    await expect(page.getByText('Use Signet to keep your key in your signer while CANARY joins the group.')).toBeVisible()
    await expect(page.locator('#login-nsec')).toHaveCount(0)
    await expect(page.locator('#nsec-login-form')).toHaveCount(0)
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
