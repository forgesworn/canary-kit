// e2e/offline/beacons.spec.ts — Beacon panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Beacons panel', () => {
  test('beacon panel shows "Map unavailable offline" without relay connection', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Offline Group', { mode: 'offline' })
    // Beacon panel is always rendered but shows offline message when relay is unreachable
    await expect(page.locator('#beacon-container')).toContainText('Map unavailable offline')
  })

  test('beacon panel visible for online groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Online Group', { mode: 'online' })
    await expect(page.locator('#beacon-container')).not.toBeHidden()
  })
})
