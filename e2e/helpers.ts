// e2e/helpers.ts — Reusable test actions for CANARY demo app
import { type Page, expect } from '@playwright/test'

// ── Login flows ──────────────────────────────────────────────

/** Login as offline user with the given display name. */
export async function loginOffline(page: Page, name: string): Promise<void> {
  await page.fill('#offline-name', name)
  await page.click('#offline-form button[type="submit"]')
  await page.waitForSelector('#sidebar', { timeout: 5000 })
}

/** Login with an nsec key. */
export async function loginWithNsec(page: Page, nsec: string): Promise<void> {
  await page.fill('#login-nsec', nsec)
  await page.click('#nsec-login-form button[type="submit"]')
  await page.waitForSelector('#sidebar', { timeout: 5000 })
}

/** Login using a named demo account button. */
export async function loginWithDemo(page: Page, name: string): Promise<void> {
  await page.click(`.login-screen__demo[data-name="${name}"]`)
  await page.waitForSelector('#sidebar', { timeout: 5000 })
}

// ── Group lifecycle ──────────────────────────────────────────

/** Create a new group via the modal. Returns after group appears in sidebar. */
export async function createGroup(
  page: Page,
  name: string,
  options?: {
    preset?: 'family' | 'field-ops' | 'enterprise' | 'event'
    mode?: 'offline' | 'online'
    myName?: string
  },
): Promise<void> {
  await page.click('#create-group-btn')
  await page.waitForSelector('#app-modal[open]', { timeout: 3000 })

  await page.fill('[name="name"]', name)

  if (options?.myName) {
    const myNameInput = page.locator('[name="myname"]')
    if (await myNameInput.isVisible()) {
      await myNameInput.fill(options.myName)
    }
  }

  if (options?.mode) {
    await page.click(`.segmented__btn[data-mode="${options.mode}"]`)
  }

  if (options?.preset) {
    await page.click(`.segmented__btn[data-preset="${options.preset}"]`)
  }

  await page.click('#modal-form button[type="submit"]')
  // Wait for modal to close and group to appear
  await page.waitForSelector(`.group-list__name:has-text("${name}")`, { timeout: 3000 })
}

/** Click a group in the sidebar to make it active. */
export async function switchGroup(page: Page, name: string): Promise<void> {
  await page.click(`.group-list__item:has-text("${name}")`)
  await page.waitForSelector(`.group-list__item--active:has-text("${name}")`)
}

/** Get all group names from the sidebar. */
export async function getGroupNames(page: Page): Promise<string[]> {
  return page.locator('.group-list__name').allTextContents()
}

// ── Invite flow ──────────────────────────────────────────────

/** Click the Invite button and extract payload + confirm code from the modal. */
export async function createInvite(page: Page): Promise<{ payload: string; confirmCode: string }> {
  const heroInvite = page.locator('#hero-invite-btn')
  const membersInvite = page.locator('#invite-btn')

  if (await heroInvite.isVisible()) {
    await heroInvite.click()
  } else {
    await membersInvite.click()
  }

  await page.waitForSelector('#invite-modal[open]', { timeout: 3000 })

  const confirmCode = await page.locator('.confirm-code__value').textContent()
  if (!confirmCode) throw new Error('Could not read confirm code from invite modal')

  // Read payload from data attribute (more reliable than clipboard)
  const payload = await page.locator('#invite-modal').getAttribute('data-payload')
  if (!payload) throw new Error('Could not read invite payload from modal')

  await page.click('#invite-close-btn')
  return { payload, confirmCode }
}

/** Accept an invite via the join modal (not via URL). */
export async function acceptInviteViaModal(
  page: Page,
  payload: string,
  confirmCode: string,
): Promise<void> {
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
  })
  await page.waitForSelector('#app-modal[open]', { timeout: 3000 })

  await page.fill('[name="payload"]', payload)
  await page.fill('[name="code"]', confirmCode)
  await page.click('#modal-form button[type="submit"]')
  await page.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

  // Dismiss join confirmation modal if it appears (backward compatibility)
  const joinConfirmModal = page.locator('#join-confirm-modal[open]')
  if (await joinConfirmModal.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.click('#join-confirm-done')
    await page.waitForSelector('#join-confirm-modal:not([open])', { state: 'attached', timeout: 2000 }).catch(() => {})
  }
}

/** Accept an invite by navigating to the invite URL hash. */
export async function acceptInviteViaLink(
  page: Page,
  payload: string,
  confirmCode: string,
  loginName?: string,
): Promise<void> {
  const encodedPayload = encodeURIComponent(payload)

  // Capture any alert dialogs (e.g. from validation errors)
  let alertMessage = ''
  const dialogHandler = async (dialog: import('@playwright/test').Dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  }
  page.on('dialog', dialogHandler)

  await page.goto(`/#join/${encodedPayload}`)

  // If not logged in, the login screen appears first
  const loginScreen = page.locator('.lock-screen')
  if (await loginScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await loginOffline(page, loginName ?? 'Invitee')
  }

  // The join modal should appear with payload pre-filled
  await page.waitForSelector('#app-modal[open]', { timeout: 5000 })
  await page.fill('[name="code"]', confirmCode)

  const nameInput = page.locator('#app-modal [name="myname"]')
  if (await nameInput.isVisible().catch(() => false)) {
    await nameInput.fill(loginName ?? 'Invitee')
  }

  await page.click('#modal-form button[type="submit"]')
  await page.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

  // Dismiss join confirmation modal if it appears (backward compatibility)
  const joinConfirmModal = page.locator('#join-confirm-modal[open]')
  if (await joinConfirmModal.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.click('#join-confirm-done')
    await page.waitForSelector('#join-confirm-modal:not([open])', { state: 'attached', timeout: 2000 }).catch(() => {})
  }

  // Clean up dialog handler to avoid interfering with subsequent dialog expectations
  page.off('dialog', dialogHandler)

  if (alertMessage) {
    throw new Error(`Invite acceptance failed: ${alertMessage}`)
  }
}

/** After accepting an invite, read the join confirmation word and ack URL. */
export async function getJoinToken(page: Page): Promise<{ word: string; ackUrl: string }> {
  await page.waitForSelector('#join-confirm-modal[open]', { timeout: 3000 })
  const word = await page.locator('#join-word-value').textContent()
  if (!word) throw new Error('Could not read join word from confirmation modal')

  // Read the ack URL by clicking copy and reading clipboard
  // NOTE: clipboard may not work in all test environments — use the QR container as fallback
  await page.click('#join-ack-copy')
  // Small wait for clipboard to be written
  await page.waitForTimeout(200)
  const ackUrl = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '')

  await page.click('#join-confirm-done')
  await page.waitForSelector('#join-confirm-modal:not([open])', { state: 'attached', timeout: 2000 }).catch(() => {})
  return { word: word.trim(), ackUrl }
}

/** Accept an invite via the join modal and return the join token info. */
export async function acceptInviteAndGetToken(
  page: Page,
  payload: string,
  confirmCode: string,
): Promise<{ word: string; ackUrl: string }> {
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
  })
  await page.waitForSelector('#app-modal[open]', { timeout: 3000 })

  await page.fill('[name="payload"]', payload)
  await page.fill('[name="code"]', confirmCode)
  await page.click('#modal-form button[type="submit"]')
  await page.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

  // Now the join-confirm-modal should appear
  return getJoinToken(page)
}

// ── Verification ─────────────────────────────────────────────

/** Hold the reveal button and read the verification word. */
export async function getDisplayedWord(page: Page): Promise<string> {
  const revealBtn = page.locator('#hero-reveal-btn')
  await revealBtn.dispatchEvent('pointerdown')
  await page.waitForTimeout(100)

  const word = await page.locator('#hero-word').textContent()

  await revealBtn.dispatchEvent('pointerup')
  return word?.trim() ?? ''
}

/** Type a word in the verify panel and click Verify. Returns the result status. */
export async function verifyWord(
  page: Page,
  word: string,
): Promise<'valid' | 'duress' | 'invalid'> {
  await page.fill('#verify-input', word)
  await page.click('#verify-btn')

  const resultEl = page.locator('#verify-result')
  await expect(resultEl).not.toBeHidden({ timeout: 3000 })

  const classes = await resultEl.getAttribute('class') ?? ''
  if (classes.includes('verify-result--valid')) return 'valid'
  if (classes.includes('verify-result--duress')) return 'duress'
  return 'invalid'
}

// ── Settings ─────────────────────────────────────────────────

/** Open the settings drawer if it's closed. */
export async function openSettings(page: Page): Promise<void> {
  const body = page.locator('#settings-body')
  if (await body.isHidden()) {
    await page.click('#settings-toggle')
    await expect(body).toBeVisible()
  }
}

/** Change the encoding format in settings. */
export async function setEncodingFormat(
  page: Page,
  format: 'words' | 'pin' | 'hex',
): Promise<void> {
  await openSettings(page)
  await page.click(`[data-enc="${format}"]`)
}

// ── Sync ─────────────────────────────────────────────────────

/** Inject a relay URL into localStorage settings before the app loads. */
export async function seedRelayUrl(page: Page, relayUrl: string): Promise<void> {
  await page.addInitScript((url: string) => {
    const raw = localStorage.getItem('canary:settings')
    const settings = raw ? JSON.parse(raw) : {}
    settings.defaultRelays = [url]
    localStorage.setItem('canary:settings', JSON.stringify(settings))
  }, relayUrl)
}

/** Wait for sync to propagate (simple timeout-based). */
export async function waitForSync(page: Page, timeoutMs = 2000): Promise<void> {
  await page.waitForTimeout(timeoutMs)
}

// ── Console error tracking ───────────────────────────────────

/** Set up console error tracking. Returns the errors array. */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}
