// e2e/protocol/dms.spec.ts — Dead man's switch / liveness monitoring tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, addSimulatedMember, getGroupState, waitForPersist } from '../helpers.js'

test.describe("Dead man's switch", () => {
  test('heartbeat interval is configurable', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'DMS Test', { mode: 'online' })
    await waitForPersist(page)

    // A default interval should already be set in state
    const before = await getGroupState(page)
    expect(typeof before.livenessInterval).toBe('number')
    expect(before.livenessInterval as number).toBeGreaterThan(0)

    // Click the 4-hour interval picker button
    await page.click('[data-liveness-interval="14400"]')
    await page.waitForTimeout(300)

    const after = await getGroupState(page)
    expect(after.livenessInterval).toBe(14400)
  })

  test('absent member (never checked in) shows grey status', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'DMS Grey Test')

    // Add a simulated member who has never checked in
    await addSimulatedMember(page)

    // That member has no check-in record — the liveness dot should be grey
    await expect(page.locator('.liveness-dot--grey').first()).toBeVisible({ timeout: 3000 })
  })

  test('overdue member shows red status after interval exceeded', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'DMS Red Test')

    // Add a simulated member so there is someone to show as overdue
    await addSimulatedMember(page)

    // Wait for the group to be persisted before we patch it
    await waitForPersist(page)

    // Inject a stale check-in (2 hours ago) and set the liveness interval to 1 hour,
    // so that member is unambiguously overdue (>1.25× interval threshold).
    // The patch is applied via addInitScript so it takes effect before the next reload.
    await page.addInitScript(() => {
      const groupsRaw = localStorage.getItem('canary:groups')
      const identityRaw = localStorage.getItem('canary:identity')
      if (!groupsRaw) return

      const groups = JSON.parse(groupsRaw) as Record<string, {
        members: string[]
        livenessCheckins?: Record<string, number>
        livenessInterval?: number
      }>
      const identity = identityRaw ? JSON.parse(identityRaw) as { pubkey?: string } : null
      const ownPubkey = identity?.pubkey ?? ''

      const groupId = Object.keys(groups)[0]
      if (!groupId) return
      const group = groups[groupId]

      // Find the simulated member (any member that is not ourselves)
      const other = group.members.find((m) => m !== ownPubkey)
      if (!other) return

      const twoHoursAgo = Math.floor(Date.now() / 1000) - 7200
      group.livenessCheckins = { ...(group.livenessCheckins ?? {}), [other]: twoHoursAgo }
      // 1-hour interval → member who last checked in 2 hours ago is past the 1.25× red threshold
      group.livenessInterval = 3600

      localStorage.setItem('canary:groups', JSON.stringify(groups))
    })

    // Reload so the app reads the patched state
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    await page.click('.group-list__item:has-text("DMS Red Test")')
    await page.waitForSelector('.group-list__item--active:has-text("DMS Red Test")')

    // The overdue member should be shown with a red traffic-light dot
    await expect(page.locator('.liveness-dot--red').first()).toBeVisible({ timeout: 5000 })
  })

  test('member approaching deadline shows amber status', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'DMS Amber Test')

    await addSimulatedMember(page)
    await waitForPersist(page)

    // Inject a check-in that is 90% of the interval ago (amber = >75% but <125% of interval).
    // Use a 2-hour interval and set last check-in to 100 minutes ago (~83% of interval).
    await page.addInitScript(() => {
      const groupsRaw = localStorage.getItem('canary:groups')
      const identityRaw = localStorage.getItem('canary:identity')
      if (!groupsRaw) return

      const groups = JSON.parse(groupsRaw) as Record<string, {
        members: string[]
        livenessCheckins?: Record<string, number>
        livenessInterval?: number
      }>
      const identity = identityRaw ? JSON.parse(identityRaw) as { pubkey?: string } : null
      const ownPubkey = identity?.pubkey ?? ''

      const groupId = Object.keys(groups)[0]
      if (!groupId) return
      const group = groups[groupId]

      const other = group.members.find((m) => m !== ownPubkey)
      if (!other) return

      // For amber: elapsed must be > interval but ≤ interval×1.25
      // Use 1-hour interval (3600s) with check-in 70 minutes ago (4200s).
      // elapsed/interval = 4200/3600 = 1.167, which is > 1.0 and ≤ 1.25 → amber
      const seventyMinutesAgo = Math.floor(Date.now() / 1000) - 4200
      group.livenessCheckins = { ...(group.livenessCheckins ?? {}), [other]: seventyMinutesAgo }
      group.livenessInterval = 3600

      localStorage.setItem('canary:groups', JSON.stringify(groups))
    })

    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    await page.click('.group-list__item:has-text("DMS Amber Test")')
    await page.waitForSelector('.group-list__item--active:has-text("DMS Amber Test")')

    await expect(page.locator('.liveness-dot--amber').first()).toBeVisible({ timeout: 5000 })
  })

  test('recently checked-in member shows green status', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'DMS Green Test')

    await addSimulatedMember(page)
    await waitForPersist(page)

    // Inject a recent check-in (30 seconds ago) with a 1-hour interval — solidly green
    await page.addInitScript(() => {
      const groupsRaw = localStorage.getItem('canary:groups')
      const identityRaw = localStorage.getItem('canary:identity')
      if (!groupsRaw) return

      const groups = JSON.parse(groupsRaw) as Record<string, {
        members: string[]
        livenessCheckins?: Record<string, number>
        livenessInterval?: number
      }>
      const identity = identityRaw ? JSON.parse(identityRaw) as { pubkey?: string } : null
      const ownPubkey = identity?.pubkey ?? ''

      const groupId = Object.keys(groups)[0]
      if (!groupId) return
      const group = groups[groupId]

      const other = group.members.find((m) => m !== ownPubkey)
      if (!other) return

      const thirtySecondsAgo = Math.floor(Date.now() / 1000) - 30
      group.livenessCheckins = { ...(group.livenessCheckins ?? {}), [other]: thirtySecondsAgo }
      group.livenessInterval = 3600 // 1-hour interval — 30s ago is well within green range

      localStorage.setItem('canary:groups', JSON.stringify(groups))
    })

    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    await page.click('.group-list__item:has-text("DMS Green Test")')
    await page.waitForSelector('.group-list__item--active:has-text("DMS Green Test")')

    await expect(page.locator('.liveness-dot--green').first()).toBeVisible({ timeout: 5000 })
  })

  test.fixme('DMS trigger: duress alert auto-sent when member goes dark', async () => {
    // Automatic duress alert on a missed check-in is not yet implemented.
    // The current liveness system only presents visual traffic-light indicators
    // in the liveness panel (#liveness-list).
    //
    // Implementing auto-send would require a background timer that:
    //   1. Periodically compares each member's last check-in timestamp against
    //      the group's livenessInterval.
    //   2. Broadcasts a duress-alert sync message when the threshold is exceeded.
    //   3. Ensures the alert is not re-sent on every timer tick (de-dup).
    //
    // When implemented, the E2E test would:
    //   - Set a very short interval and stale check-in on a simulated member.
    //   - Wait for the timer to fire.
    //   - Assert that a duress-alert event appears on the mock relay.
  })
})
