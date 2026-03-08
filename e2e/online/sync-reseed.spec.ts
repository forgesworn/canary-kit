// e2e/online/sync-reseed.spec.ts — Reseed propagation
import { test, expect } from '../fixtures.js'
import { loginWithNsec, createGroup, createInvite, openSettings, seedRelayUrl, getDisplayedWord } from '../helpers.js'

const ALICE_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'
const BOB_NSEC = 'nsec1hszs2j8elt78kq6ewresrxfallpc6qvf0p33usgy9ujdkgu0mcesd4qryw'

test.describe('Online sync: reseed', () => {
  test('reseed propagates to other members', async ({ browser, mockRelay }) => {
    const relayUrl = mockRelay.url
    const baseURL = 'http://localhost:5173'

    // Setup: Alice creates group, Bob joins
    const ctxA = await browser.newContext({ baseURL })
    const pageA = await ctxA.newPage()
    await seedRelayUrl(pageA, relayUrl)
    await pageA.goto('/')
    await loginWithNsec(pageA, ALICE_NSEC)
    await createGroup(pageA, 'Rekey Test', { mode: 'online' })

    // Wait for Alice's relay connection to be established
    await expect(pageA.locator('#relay-status')).toBeVisible({ timeout: 5000 })

    const { inviteUrl, confirmCode } = await createInvite(pageA)

    const ctxB = await browser.newContext({ baseURL })
    const pageB = await ctxB.newPage()
    await seedRelayUrl(pageB, relayUrl)
    await pageB.goto('/')
    await loginWithNsec(pageB, BOB_NSEC)

    // Accept invite via binary join URL
    const hash = new URL(inviteUrl).hash
    await pageB.goto(`http://localhost:5173/${hash}`)
    await pageB.waitForSelector('#binary-join-modal[open]', { timeout: 5000 })
    await pageB.fill('#binary-join-confirm', confirmCode)
    await pageB.click('#binary-join-accept')
    await pageB.waitForSelector('#binary-join-modal:not([open])', { state: 'attached', timeout: 5000 })

    // Wait for Bob's relay connection to be fully established
    await expect(pageB.locator('#relay-status')).toBeVisible({ timeout: 5000 })
    // Extra time for WebSocket subscription to be fully active
    await pageB.waitForTimeout(1000)

    // Both should now see the same word
    const wordBefore = await getDisplayedWord(pageA)

    // Alice reseeds
    await openSettings(pageA)
    pageA.once('dialog', async (d) => await d.accept())
    await pageA.click('#reseed-btn')
    await pageA.waitForTimeout(1000)

    const wordAfterA = await getDisplayedWord(pageA)
    expect(wordAfterA).not.toBe(wordBefore)

    // Wait for propagation
    await pageB.waitForTimeout(5000)

    // Bob should now show the new word (same as Alice)
    const wordAfterB = await getDisplayedWord(pageB)
    expect(wordAfterB).toBe(wordAfterA)

    await ctxA.close()
    await ctxB.close()
  })
})
