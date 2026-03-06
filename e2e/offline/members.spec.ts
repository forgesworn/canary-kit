// e2e/offline/members.spec.ts — Members panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, addSimulatedMember } from '../helpers.js'

test.describe('Members panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Team')
  })

  test('shows "You" for local identity', async ({ cleanPage: page }) => {
    await expect(page.locator('.member-item__pubkey:text("You")')).toBeVisible()
  })

  test('admin sees remove buttons', async ({ cleanPage: page }) => {
    await expect(page.locator('.member-item__remove')).toBeVisible()
  })

  test('adding a member increases member count', async ({ cleanPage: page }) => {
    const countBefore = await page.locator('.member-item').count()
    await addSimulatedMember(page)
    const countAfter = await page.locator('.member-item').count()
    expect(countAfter).toBe(countBefore + 1)
  })

  test('remove member triggers confirm and removes', async ({ cleanPage: page }) => {
    // Add a member first
    await addSimulatedMember(page)
    const countBefore = await page.locator('.member-item').count()

    // Click remove on the second member (not "You")
    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })
    const removeButtons = page.locator('.member-item__remove')
    // Click the last remove button (the added member, not self)
    await removeButtons.last().click()

    await page.waitForTimeout(300) // state update + re-render
    const countAfter = await page.locator('.member-item').count()
    expect(countAfter).toBe(countBefore - 1)
  })

  test('remove member auto-opens invite modal', async ({ cleanPage: page }) => {
    await addSimulatedMember(page)

    // Click remove on the added member (last remove button)
    page.once('dialog', async dialog => await dialog.accept())
    await page.locator('.member-item__remove').last().click()
    await page.waitForTimeout(500)

    // The invite/share-state modal should auto-open after member removal
    await expect(page.locator('#invite-modal[open]')).toBeVisible({ timeout: 3000 })
  })

  test('invite button opens invite modal', async ({ cleanPage: page }) => {
    await page.click('#invite-btn')
    await expect(page.locator('#invite-modal[open]')).toBeVisible()
  })
})
