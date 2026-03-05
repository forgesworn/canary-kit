// e2e/offline/invite-flow.spec.ts — Invite creation and acceptance (two users)
import { test, expect } from '../fixtures.js'
import {
  loginOffline, createGroup, createInvite, acceptInviteViaLink,
  acceptInviteViaModal, getJoinToken, getDisplayedWord, getGroupNames,
} from '../helpers.js'

test.describe('Invite flow (offline)', () => {
  test('create invite shows QR, confirmation words, and copy buttons', async ({ twoUsers: { pageA } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Test Group')

    await pageA.click('#hero-invite-btn')
    await expect(pageA.locator('#invite-modal[open]')).toBeVisible()
    await expect(pageA.locator('.qr-container')).toBeVisible()

    // Confirmation words should be 3 lowercase words separated by hyphens
    const confirmText = await pageA.locator('.confirm-code__value').textContent()
    expect(confirmText).toBeTruthy()
    const words = confirmText!.split('-')
    expect(words).toHaveLength(3)
    words.forEach(w => {
      expect(w).toMatch(/^[a-z]+$/)
    })

    await expect(pageA.locator('#invite-copy-link')).toBeVisible()
    await expect(pageA.locator('#invite-copy-text')).toBeVisible()

    await pageA.click('#invite-close-btn')
  })

  test('User B opens invite link, logs in, joins successfully', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Family')

    const { payload, confirmCode } = await createInvite(pageA)
    await acceptInviteViaLink(pageB, payload, confirmCode, 'Bob')

    // Both should see a group called "Family"
    const groupsB = await getGroupNames(pageB)
    expect(groupsB).toContain('Family')
  })

  test('both users see same verification word after join', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Shared')

    const { payload, confirmCode } = await createInvite(pageA)
    await acceptInviteViaLink(pageB, payload, confirmCode, 'Bob')

    const wordA = await getDisplayedWord(pageA)
    const wordB = await getDisplayedWord(pageB)
    expect(wordA).toBeTruthy()
    expect(wordA).toBe(wordB)
  })

  test('wrong confirm code shows error', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Guarded')

    const { payload } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')

    // Open join modal manually
    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]', { timeout: 3000 })

    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', 'XXXX-XXXX-XXXX')

    // Set up dialog handler BEFORE click (alert() blocks synchronously)
    let alertMessage = ''
    pageB.once('dialog', async (dialog) => {
      alertMessage = dialog.message()
      await dialog.accept()
    })
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForTimeout(500)
    expect(alertMessage).toContain('onfirmation')
  })

  test('replayed invite nonce is rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'OneShot')

    const { payload, confirmCode } = await createInvite(pageA)

    // First accept works
    await acceptInviteViaLink(pageB, payload, confirmCode, 'Bob')
    // Ensure any join-confirm-modal is fully dismissed before second attempt
    await pageB.waitForSelector('#join-confirm-modal:not([open])', { state: 'attached', timeout: 3000 }).catch(() => {})

    // Set up dialog handler for the replay rejection
    let alertMessage = ''
    pageB.once('dialog', async (dialog) => {
      alertMessage = dialog.message()
      await dialog.accept()
    })

    // Open join modal for second attempt
    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]', { timeout: 3000 })

    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', confirmCode)

    // Second accept with same nonce should be rejected
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForTimeout(500)
    expect(alertMessage).toContain('already been used')
  })

  test('after joining, joiner sees confirmation screen with word and QR', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Creator')
    await createGroup(pageA, 'Ack Test')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Alice')
    // Accept invite manually (not via helper) so we can inspect the join-confirm-modal
    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]', { timeout: 3000 })
    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', confirmCode)
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

    // Join confirmation modal should appear
    await expect(pageB.locator('#join-confirm-modal[open]')).toBeVisible({ timeout: 3000 })
    // Should show a word
    const word = await pageB.locator('#join-word-value').textContent()
    expect(word).toBeTruthy()
    expect(word!.trim()).toMatch(/^[a-z]+$/)
    // Should have QR container
    await expect(pageB.locator('#join-ack-qr')).toBeVisible()
    // Should have copy link button
    await expect(pageB.locator('#join-ack-copy')).toBeVisible()

    // Close it
    await pageB.click('#join-confirm-done')
    await expect(pageB.locator('#join-confirm-modal[open]')).not.toBeVisible()
  })

  test('join confirmation copy link produces valid #ack/ URL', async ({ twoUsers: { pageA, pageB, contextB } }) => {
    await loginOffline(pageA, 'Creator')
    await createGroup(pageA, 'Link Test')
    const { payload, confirmCode } = await createInvite(pageA)

    await loginOffline(pageB, 'Alice')
    // Grant clipboard permissions
    await contextB.grantPermissions(['clipboard-read', 'clipboard-write'])

    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]', { timeout: 3000 })
    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', confirmCode)
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

    await expect(pageB.locator('#join-confirm-modal[open]')).toBeVisible({ timeout: 3000 })
    await pageB.click('#join-ack-copy')
    await pageB.waitForTimeout(200)

    const clipboardText = await pageB.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('#ack/')

    await pageB.click('#join-confirm-done')
  })
})
