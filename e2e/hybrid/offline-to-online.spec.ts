// e2e/hybrid/offline-to-online.spec.ts — Hybrid: offline group gains relay
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, seedRelayUrl } from '../helpers.js'

test.describe('Hybrid: offline to online', () => {
  test('group created without relay works offline, gains online features when relay added', async ({
    cleanPage: page,
    mockRelay,
  }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Hybrid Group', { mode: 'offline' })

    // Verify offline — beacon container hidden
    await expect(page.locator('#beacon-container')).toBeHidden()
    await expect(page.locator('#liveness-container')).toBeHidden()

    // Add relay to the group's relays array (not just settings) and reload
    await page.addInitScript((relayUrl: string) => {
      const raw = localStorage.getItem('canary:groups')
      if (!raw) return
      const groups = JSON.parse(raw)
      for (const g of Object.values(groups) as Array<{ relays?: string[] }>) {
        g.relays = [relayUrl]
      }
      localStorage.setItem('canary:groups', JSON.stringify(groups))
    }, mockRelay.url)
    await seedRelayUrl(page, mockRelay.url)
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    await page.click('.group-list__item:has-text("Hybrid Group")')
    await page.waitForSelector('.group-list__item--active:has-text("Hybrid Group")')

    // Now online — beacon and liveness containers should be visible
    await expect(page.locator('#beacon-container')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('#liveness-container')).toBeVisible({ timeout: 5000 })
  })
})
