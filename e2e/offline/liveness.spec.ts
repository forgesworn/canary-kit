// e2e/offline/liveness.spec.ts — Liveness panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Liveness panel', () => {
  test('liveness panel visible with check-in controls', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Test Group')
    // Liveness panel is always rendered with check-in controls
    await expect(page.locator('#liveness-container')).toBeVisible()
    await expect(page.locator('#liveness-container')).toContainText('Check-in interval')
  })

  test('liveness panel visible for online groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Online Group', { mode: 'online' })
    await expect(page.locator('#liveness-container')).not.toBeHidden()
  })
})
