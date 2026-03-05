// e2e/protocol/member-picker.spec.ts
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, addSimulatedMember } from '../helpers.js'

test.describe('Member picker', () => {
  test('2 members: verify call starts directly', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Pair')
    await addSimulatedMember(page)
    // With 2 members and 1 other, call should start directly (no picker)
    await page.click('#hero-call-btn')
    await expect(page.locator('.call-verify')).toBeVisible({ timeout: 3000 })
  })

  test.fixme('3+ members: picker modal shown', async () => {})
  test.fixme('picker: selecting member starts call with that member', async () => {})
})
