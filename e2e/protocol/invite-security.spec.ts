// e2e/protocol/invite-security.spec.ts — Invite tampering and security tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, createInvite } from '../helpers.js'
import type { BrowserContext } from '@playwright/test'

/** Decode the binary invite from a #inv/ URL. */
function decodeInviteUrl(url: string): Uint8Array {
  const hash = new URL(url).hash
  const b64 = hash.replace('#inv/', '')
  // base64url → base64
  const base64 = b64.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/** Re-encode binary invite to a #inv/ URL. */
function encodeInviteUrl(bytes: Uint8Array, baseUrl: string): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  const b64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const origin = new URL(baseUrl).origin
  return `${origin}/#inv/${b64url}`
}

/** Try to accept a tampered invite — expects failure (alert or modal stays open). */
async function expectInviteRejection(
  page: import('@playwright/test').Page,
  inviteUrl: string,
  confirmCode: string,
  loginName: string,
): Promise<string> {
  let alertMessage = ''
  const dialogHandler = async (dialog: import('@playwright/test').Dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  }
  page.on('dialog', dialogHandler)

  const hash = new URL(inviteUrl).hash
  await page.goto(`/${hash}`)

  const loginScreen = page.locator('.lock-screen')
  if (await loginScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.fill('#offline-name', loginName)
    await page.click('#offline-form button[type="submit"]')
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    // Dismiss nsec backup prompt if shown
    const skipBtn = page.locator('#recovery-phrase-skip')
    if (await skipBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await skipBtn.click()
    }
  }

  // The binary join modal should appear (or the app catches the error before showing it)
  const modal = page.locator('#binary-join-modal[open]')
  const modalVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false)

  if (modalVisible) {
    await page.fill('#binary-join-confirm', confirmCode)
    await page.click('#binary-join-accept')
    // Allow time for validation to complete
    await page.waitForTimeout(1000)
  }

  page.off('dialog', dialogHandler)
  return alertMessage
}

test.describe('Invite security', () => {
  test('tampered payload (modified seed) — signature invalid', async ({ browser }) => {
    const baseURL = 'http://localhost:5173'
    const ctxA = await browser.newContext({ baseURL })
    let ctxB: BrowserContext | undefined
    try {
      const pageA = await ctxA.newPage()
      await pageA.goto('/')
      await loginOffline(pageA, 'Alice')
      await createGroup(pageA, 'Security Test')
      const { inviteUrl, confirmCode } = await createInvite(pageA)

      // Tamper with the seed (bytes 1–32) — flipping any bit invalidates the Schnorr signature
      const bytes = decodeInviteUrl(inviteUrl)
      bytes[1] ^= 0xff
      const tamperedUrl = encodeInviteUrl(bytes, inviteUrl)

      ctxB = await browser.newContext({ baseURL })
      const pageB = await ctxB.newPage()
      await pageB.goto('/')

      const alertMsg = await expectInviteRejection(pageB, tamperedUrl, confirmCode, 'Bob')
      // Either an alert was shown or the modal remains open — both indicate rejection
      const modalStillOpen = await pageB.locator('#binary-join-modal[open]').isVisible().catch(() => false)
      expect(alertMsg || modalStillOpen).toBeTruthy()
    } finally {
      await ctxB?.close().catch(() => {})
      await ctxA.close().catch(() => {})
    }
  })

  test('tampered payload (modified members) — signature invalid', async ({ browser }) => {
    const baseURL = 'http://localhost:5173'
    const ctxA = await browser.newContext({ baseURL })
    let ctxB: BrowserContext | undefined
    try {
      const pageA = await ctxA.newPage()
      await pageA.goto('/')
      await loginOffline(pageA, 'Alice')
      await createGroup(pageA, 'Security Test')
      const { inviteUrl, confirmCode } = await createInvite(pageA)

      // Tamper with the first member pubkey byte (member data starts after byte 177)
      // Layout: ...byte 176 (protocolVersion), byte 177 (memberCount), bytes 178+ (member pubkeys)
      const bytes = decodeInviteUrl(inviteUrl)
      const memberStart = 178 // first byte of the first member pubkey
      if (memberStart < bytes.length) {
        bytes[memberStart] ^= 0xff
      }
      const tamperedUrl = encodeInviteUrl(bytes, inviteUrl)

      ctxB = await browser.newContext({ baseURL })
      const pageB = await ctxB.newPage()
      await pageB.goto('/')

      const alertMsg = await expectInviteRejection(pageB, tamperedUrl, confirmCode, 'Bob')
      const modalStillOpen = await pageB.locator('#binary-join-modal[open]').isVisible().catch(() => false)
      expect(alertMsg || modalStillOpen).toBeTruthy()
    } finally {
      await ctxB?.close().catch(() => {})
      await ctxA.close().catch(() => {})
    }
  })

  test('wrong confirm code is rejected', async ({ browser }) => {
    const baseURL = 'http://localhost:5173'
    const ctxA = await browser.newContext({ baseURL })
    let ctxB: BrowserContext | undefined
    try {
      const pageA = await ctxA.newPage()
      await pageA.goto('/')
      await loginOffline(pageA, 'Alice')
      await createGroup(pageA, 'Security Test')
      const { inviteUrl } = await createInvite(pageA)

      ctxB = await browser.newContext({ baseURL })
      const pageB = await ctxB.newPage()
      await pageB.goto('/')

      // Supply an entirely wrong confirm code — the CANARY word check should fail
      const alertMsg = await expectInviteRejection(pageB, inviteUrl, 'wrong code here', 'Bob')
      const modalStillOpen = await pageB.locator('#binary-join-modal[open]').isVisible().catch(() => false)
      expect(alertMsg || modalStillOpen).toBeTruthy()
    } finally {
      await ctxB?.close().catch(() => {})
      await ctxA.close().catch(() => {})
    }
  })

  test('tampered version byte is rejected', async ({ browser }) => {
    const baseURL = 'http://localhost:5173'
    const ctxA = await browser.newContext({ baseURL })
    let ctxB: BrowserContext | undefined
    try {
      const pageA = await ctxA.newPage()
      await pageA.goto('/')
      await loginOffline(pageA, 'Alice')
      await createGroup(pageA, 'Security Test')
      const { inviteUrl } = await createInvite(pageA)

      // Set the outer version byte (byte 0) to an unsupported value
      const bytes = decodeInviteUrl(inviteUrl)
      bytes[0] = 99
      const tamperedUrl = encodeInviteUrl(bytes, inviteUrl)

      ctxB = await browser.newContext({ baseURL })
      const pageB = await ctxB.newPage()
      await pageB.goto('/')
      await loginOffline(pageB, 'Bob')

      // Track any console errors from the app
      const consoleErrors: string[] = []
      pageB.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
      })

      // The app shows a toast error when the version byte is invalid,
      // because unpackInvite() throws before the join modal is created.
      const hash = new URL(tamperedUrl).hash
      await pageB.goto(`/${hash}`)
      await pageB.waitForTimeout(1500)

      // The join modal should NOT be open (the error is caught before it renders)
      const modalVisible = await pageB.locator('#binary-join-modal[open]').isVisible().catch(() => false)
      expect(modalVisible).toBe(false)

      // Verify no group was created for Bob — the sidebar should still show no groups
      const groupCount = await pageB.locator('.group-list__item').count()
      expect(groupCount).toBe(0)
    } finally {
      await ctxB?.close().catch(() => {})
      await ctxA.close().catch(() => {})
    }
  })

  test.fixme('invite signed by non-admin pubkey is rejected', async () => {
    // Requires crafting a fully valid binary invite signed by a second keypair
    // whose pubkey is NOT in the group's admins list.
    // The Schnorr signature would verify correctly, but the pubkey check would
    // then fail — assertInvitePayload() confirms inviterPubkey is an admin.
    // This scenario requires re-signing the canonical payload with a different
    // private key, which cannot be done from outside the browser context.
    // Covered at unit-test level in group.test.ts / verify.test.ts.
  })

  test.fixme('expired invite is rejected', async () => {
    // Requires setting bytes 172–175 (expiresAt, big-endian uint32) to a past
    // Unix timestamp, then re-signing the canonical payload.
    // Without access to the admin's private key, any edit to the payload
    // invalidates the Schnorr signature before the expiry check is reached,
    // so the test would conflate signature failure with expiry failure.
    // Covered at unit-test level; could be promoted to E2E once a
    // test-signing helper is exposed via the app's debug API.
  })

  test.fixme('future invite (clock skew > 300 s) is rejected', async () => {
    // Requires setting bytes 168–171 (issuedAt, big-endian uint32) to
    // now + 600 to exceed the 300 s tolerance, then re-signing.
    // Same re-signing constraint as the expiry test above.
    // Covered at unit-test level.
  })

  test.fixme('zeroed inviterPubkey is rejected', async () => {
    // Requires zeroing bytes 33–64 (inviterPubkey) and re-signing so that
    // assertInvitePayload() reaches the pubkey validation rather than failing
    // on the Schnorr signature first.
    // Without a test-signing helper this cannot be crafted from outside
    // the browser; covered at unit-test level.
  })

  test.fixme('missing inviterSig is rejected', async () => {
    // Requires crafting a binary payload with zeroed bytes 65–128 (inviterSig).
    // schnorr.verify() would return false for an all-zero signature, but
    // assertInvitePayload() validates the sig length first — zeroing the bytes
    // does not change the length, so this would reach schnorr.verify() and
    // fail as a bad-signature case rather than as a missing-sig case.
    // Covered at unit-test level.
  })
})
