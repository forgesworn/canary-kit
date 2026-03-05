// e2e/protocol/invite-security.spec.ts — Invite security and tamper-resistance
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, createInvite } from '../helpers.js'

test.describe('Invite security', () => {
  // Helper: attempt to join with a (possibly tampered) payload and capture the alert
  async function attemptJoin(
    page: import('@playwright/test').Page,
    payload: string,
    confirmCode: string,
  ): Promise<string> {
    let alertMessage = ''
    page.once('dialog', async (d) => {
      alertMessage = d.message()
      await d.accept()
    })

    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await page.waitForSelector('#app-modal[open]', { timeout: 3000 })
    await page.fill('[name="payload"]', payload)
    await page.fill('[name="code"]', confirmCode)
    await page.click('#modal-form button[type="submit"]')
    await page.waitForTimeout(500)
    return alertMessage
  }

  // Helper: tamper with a payload field and re-encode
  function tamperPayload(base64Payload: string, overrides: Record<string, unknown>): string {
    const raw = JSON.parse(atob(base64Payload))
    Object.assign(raw, overrides)
    return btoa(JSON.stringify(raw))
  }

  test('tampered payload (modified seed) — signature invalid', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Tamper Seed')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const tampered = tamperPayload(payload, { seed: 'f'.repeat(64) })
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    expect(msg).toMatch(/signature|tampered|do not match/i)
  })

  test('tampered payload (modified members) — signature invalid', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Tamper Members')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const raw = JSON.parse(atob(payload))
    raw.members = [...raw.members, 'c'.repeat(64)]
    const tampered = btoa(JSON.stringify(raw))
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    expect(msg).toMatch(/signature|tampered|do not match/i)
  })

  test('invite from non-admin pubkey rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Non Admin')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    // Change inviterPubkey to a non-admin key (must still be 64 hex chars)
    const raw = JSON.parse(atob(payload))
    raw.inviterPubkey = 'd'.repeat(64)
    const tampered = btoa(JSON.stringify(raw))
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    expect(msg).toMatch(/admin|inviter/i)
  })

  test('expired invite rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Expired')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const raw = JSON.parse(atob(payload))
    raw.expiresAt = Math.floor(Date.now() / 1000) - 1
    raw.issuedAt = raw.expiresAt - 100
    const tampered = btoa(JSON.stringify(raw))
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    // Signature check fires first (expiresAt/issuedAt changed), or expiry check
    expect(msg).toMatch(/expired|signature|tampered/i)
  })

  test('future invite (>5min clock skew) rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Future')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const raw = JSON.parse(atob(payload))
    raw.issuedAt = Math.floor(Date.now() / 1000) + 600 // 10 min in future
    raw.expiresAt = raw.issuedAt + 604800
    const tampered = btoa(JSON.stringify(raw))
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    // Signature check fires first (issuedAt/expiresAt changed), or clock skew check
    expect(msg).toMatch(/future|signature|tampered/i)
  })

  test('wrong protocol version rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Version')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const tampered = tamperPayload(payload, { protocolVersion: 99 })
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    expect(msg).toMatch(/version/i)
  })

  test('missing inviterPubkey rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Missing Pubkey')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const raw = JSON.parse(atob(payload))
    delete raw.inviterPubkey
    const tampered = btoa(JSON.stringify(raw))
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    expect(msg).toMatch(/inviterPubkey/i)
  })

  test('missing inviterSig rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Admin')
    await createGroup(pageA, 'Missing Sig')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')
    const raw = JSON.parse(atob(payload))
    delete raw.inviterSig
    const tampered = btoa(JSON.stringify(raw))
    const msg = await attemptJoin(pageB, tampered, confirmCode)
    expect(msg).toMatch(/inviterSig/i)
  })
})
