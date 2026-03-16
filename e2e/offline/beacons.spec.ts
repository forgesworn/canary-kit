// e2e/offline/beacons.spec.ts — Beacon panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, switchGroup } from '../helpers.js'

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

  test('switching groups clears beacon positions from previous group', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')

    // Create two online groups
    await createGroup(page, 'Group A', { mode: 'online' })
    await createGroup(page, 'Group B', { mode: 'online' })

    // Inject a fake beacon position into Group A's lastPositions.
    // Use a 64-char hex string as a plausible pubkey.
    const fakePubkey = 'aa'.repeat(32)

    // Read the group IDs from the live app state first, then use addInitScript
    // to inject lastPositions before the app JS runs on the next reload.
    // Using addInitScript (not page.evaluate) avoids a race where the app's
    // debounced persist could overwrite the localStorage write before reload.
    const groupIds = await page.evaluate(() => {
      const raw = localStorage.getItem('canary:groups')
      if (!raw) return []
      return Object.keys(JSON.parse(raw))
    })
    // Group A is the first created group (insertion order)
    const groupAId = groupIds[0]

    await page.addInitScript(
      ({ gid, pk }) => {
        const raw = localStorage.getItem('canary:groups')
        if (!raw) return
        const groups = JSON.parse(raw)
        if (!groups[gid]) return
        groups[gid].lastPositions = {
          [pk]: { lat: 51.5, lon: -0.1, geohash: 'gcpvj', precision: 5, timestamp: Math.floor(Date.now() / 1000) },
        }
        localStorage.setItem('canary:groups', JSON.stringify(groups))
      },
      { gid: groupAId, pk: fakePubkey },
    )

    // Reload so the app starts with the pre-injected lastPositions, then switch to Group A
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    await switchGroup(page, 'Group A')

    // The beacon list should show Group A's position (truncated pubkey)
    await expect(page.locator('#beacon-list')).toContainText('aaaaaaaa')

    // Switch to Group B — should NOT show Group A's beacon
    await switchGroup(page, 'Group B')
    await expect(page.locator('#beacon-list')).not.toContainText('aaaaaaaa')
  })
})
