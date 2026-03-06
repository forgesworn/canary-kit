// e2e/hybrid/online-to-offline.spec.ts — Hybrid: online group loses relay
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, seedRelayUrl, getDisplayedWord } from '../helpers.js'

test.describe('Hybrid: online to offline', () => {
  test('verification still works after losing relay', async ({
    cleanPage: page,
    mockRelay,
  }) => {
    // Start online
    await seedRelayUrl(page, mockRelay.url)
    await page.goto('/')
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Hybrid Group', { mode: 'online' })

    // Verify online features visible
    await expect(page.locator('#beacon-container')).toBeVisible({ timeout: 5000 })

    // Stop the relay
    await mockRelay.stop()

    // Verification still works (local crypto, not relay-dependent)
    const word = await getDisplayedWord(page)
    expect(word.length).toBeGreaterThan(0)
  })
})
