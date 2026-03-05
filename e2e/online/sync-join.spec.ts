// e2e/online/sync-join.spec.ts — Two-user sync via mock relay
import { test, expect } from '../fixtures.js'
import { loginWithNsec, createGroup, createInvite, seedRelayUrl } from '../helpers.js'

// Use demo account nsecs for deterministic keys
const ALICE_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'
const BOB_NSEC = 'nsec1hszs2j8elt78kq6ewresrxfallpc6qvf0p33usgy9ujdkgu0mcesd4qryw'

test.describe('Online sync: join', () => {
  test('User A creates online group, User B joins via invite and relay', async ({
    browser,
    mockRelay,
  }) => {
    const relayUrl = mockRelay.url
    const baseURL = 'http://localhost:5173'

    // User A: create context, seed relay, login, create online group
    const ctxA = await browser.newContext({ baseURL })
    const pageA = await ctxA.newPage()
    await seedRelayUrl(pageA, relayUrl)
    await pageA.goto('/')
    await loginWithNsec(pageA, ALICE_NSEC)
    await createGroup(pageA, 'Synced Team', { mode: 'online' })

    // Give sync a moment to connect
    await pageA.waitForTimeout(1000)

    // User A creates invite
    const { payload, confirmCode } = await createInvite(pageA)

    // User B: create context, seed relay, login, accept invite
    const ctxB = await browser.newContext({ baseURL })
    const pageB = await ctxB.newPage()
    await seedRelayUrl(pageB, relayUrl)
    await pageB.goto('/')
    await loginWithNsec(pageB, BOB_NSEC)

    // Capture any errors from invite acceptance
    let alertMessage = ''
    pageB.on('dialog', async (dialog) => {
      alertMessage = dialog.message()
      await dialog.accept()
    })

    // Accept invite via modal
    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]')
    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', confirmCode)
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

    // Fail fast if invite acceptance showed an error
    if (alertMessage) {
      throw new Error(`Invite acceptance failed: ${alertMessage}`)
    }

    // Both should see the group
    await expect(pageB.locator('.group-list__name')).toHaveText('Synced Team')

    // Wait for sync event to propagate
    await pageB.waitForTimeout(2000)

    await ctxA.close()
    await ctxB.close()
  })
})
