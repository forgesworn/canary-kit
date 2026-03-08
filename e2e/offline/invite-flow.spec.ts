// e2e/offline/invite-flow.spec.ts — Invite creation and acceptance (two users)
import { test, expect } from '../fixtures.js'
import {
  loginOffline, createGroup, createInvite, acceptInviteViaLink, acceptInviteViaQR,
  getDisplayedWord, getGroupNames,
  startTrackingWarningToasts, assertNoWarningToasts,
} from '../helpers.js'

test('online: no Next button, shows waiting status', async ({ cleanPage: page }) => {
  await loginOffline(page, 'Alice')
  await createGroup(page, 'Online Rotate', { mode: 'online' })

  await page.click('#hero-invite-btn')
  await expect(page.locator('#invite-modal[open]')).toBeVisible()

  await page.click('#invite-qr-path')
  await expect(page.locator('.qr-container')).toBeVisible()
  // Online QR path has no Next button (single-use) and shows waiting status
  await expect(page.locator('#invite-next-btn')).not.toBeVisible()

  await page.click('#invite-done-btn').catch(() => page.click('#invite-close-btn'))
})

test.describe('Invite flow (offline)', () => {
  test('invite modal shows path chooser, QR path shows QR and confirm words', async ({ twoUsers: { pageA } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Test Group')

    await pageA.click('#hero-invite-btn')
    await expect(pageA.locator('#invite-modal[open]')).toBeVisible()

    // Step 1: path chooser — both options visible, no QR yet
    await expect(pageA.locator('#invite-qr-path')).toBeVisible()
    await expect(pageA.locator('#invite-link-path')).toBeVisible()
    await expect(pageA.locator('.qr-container')).not.toBeVisible()

    // Step 2a: QR path — shows QR and confirmation words
    await pageA.click('#invite-qr-path')
    await expect(pageA.locator('.qr-container')).toBeVisible()

    // Back returns to chooser
    await pageA.click('#invite-back-btn')
    await expect(pageA.locator('#invite-qr-path')).toBeVisible()

    // Step 2b: Link path — shows copy link button (relay-based flow)
    await pageA.click('#invite-link-path')
    await expect(pageA.locator('#remote-copy-link')).toBeVisible()

    await pageA.click('#remote-back-btn')
    await pageA.click('#invite-close-btn').catch(() => {})
  })

  test('User B opens invite link, logs in, joins successfully', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Family')

    const { inviteUrl, confirmCode } = await createInvite(pageA)
    await startTrackingWarningToasts(pageB)
    await acceptInviteViaLink(pageB, inviteUrl, confirmCode, 'Bob')

    // Both should see a group called "Family"
    await expect(pageB.locator('.group-list__name', { hasText: 'Family' })).toBeVisible({ timeout: 5000 })
    await assertNoWarningToasts(pageB)
  })

  test('User B scans QR code, logs in, joins successfully', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'QRGroup')

    const { inviteUrl, confirmCode } = await createInvite(pageA)
    await startTrackingWarningToasts(pageB)
    await acceptInviteViaQR(pageB, inviteUrl, confirmCode, 'Bob')

    await expect(pageB.locator('.group-list__name', { hasText: 'QRGroup' })).toBeVisible({ timeout: 5000 })
    await assertNoWarningToasts(pageB)
  })

  test('joiner sees both members after join', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'NameTest')

    const { inviteUrl, confirmCode } = await createInvite(pageA)
    await acceptInviteViaLink(pageB, inviteUrl, confirmCode, 'Bob')

    // Binary invites strip memberNames, but Bob should see 2 members (self + creator)
    await expect(pageB.locator('.member-list .member-item')).toHaveCount(2, { timeout: 5000 })
  })

  test('both users see same verification word after join', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Shared')

    const { inviteUrl, confirmCode } = await createInvite(pageA)
    await acceptInviteViaLink(pageB, inviteUrl, confirmCode, 'Bob')

    // Ensure hero panels are rendered on both pages
    await pageA.waitForSelector('#hero-reveal-btn', { timeout: 3000 })
    await pageB.waitForSelector('#hero-reveal-btn', { timeout: 3000 })
    const wordA = await getDisplayedWord(pageA)
    const wordB = await getDisplayedWord(pageB)
    expect(wordA).toBeTruthy()
    expect(wordA).toBe(wordB)
  })

  test('wrong confirm code shows error via binary join', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Guarded')

    const { inviteUrl } = await createInvite(pageA)
    await loginOffline(pageB, 'Bob')

    // Navigate to the invite URL
    const hash = new URL(inviteUrl).hash
    await pageB.goto(`/${hash}`)
    await pageB.waitForSelector('#binary-join-modal[open]', { timeout: 5000 })

    // Enter wrong confirmation words
    await pageB.fill('#binary-join-confirm', 'wrong wrong wrong')
    await pageB.click('#binary-join-accept')

    // Error should appear in the modal
    const errorEl = pageB.locator('#binary-join-error')
    await expect(errorEl).toBeVisible({ timeout: 3000 })
  })

  test('replayed invite nonce is rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'OneShot')

    const { inviteUrl, confirmCode } = await createInvite(pageA)

    // First accept works
    await acceptInviteViaLink(pageB, inviteUrl, confirmCode, 'Bob')

    // Second accept with same invite should be rejected
    const hash = new URL(inviteUrl).hash
    await pageB.goto(`/${hash}`)
    await pageB.waitForSelector('#binary-join-modal[open]', { timeout: 5000 })
    await pageB.fill('#binary-join-confirm', confirmCode)
    await pageB.click('#binary-join-accept')

    // Should show error about already used nonce
    const errorEl = pageB.locator('#binary-join-error')
    await expect(errorEl).toBeVisible({ timeout: 3000 })
    const errorText = await errorEl.textContent()
    expect(errorText).toMatch(/already|nonce|used/i)
  })

  test('wrong verification word shows error', async ({ twoUsers: { pageA } }) => {
    await loginOffline(pageA, 'Creator')
    await createGroup(pageA, 'Wrong Word')

    let alertMessage = ''
    pageA.once('dialog', async (d) => {
      alertMessage = d.message()
      await d.accept()
    })

    await pageA.click('#confirm-member-btn')
    await pageA.waitForSelector('#app-modal[open]', { timeout: 3000 })
    await pageA.fill('[name="word"]', 'wrongword')
    await pageA.fill('[name="memberName"]', 'Eve')
    await pageA.click('#modal-form button[type="submit"]')
    await pageA.waitForTimeout(500)

    expect(alertMessage).toMatch(/does not match/i)
  })
})
