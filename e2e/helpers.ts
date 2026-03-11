// e2e/helpers.ts — Reusable test actions for CANARY demo app
import { type Page, expect } from '@playwright/test'

// ── Login flows ──────────────────────────────────────────────

/** Login as offline user with the given display name. */
export async function loginOffline(page: Page, name: string): Promise<void> {
  await page.fill('#offline-name', name)
  await page.click('#offline-form button[type="submit"]')
  await page.waitForSelector('#sidebar', { timeout: 5000 })
  await dismissNsecBackup(page)
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

/** Dismiss the nsec backup modal if it appears after login. */
async function dismissNsecBackup(page: Page): Promise<void> {
  const skipBtn = page.locator('#recovery-phrase-skip')
  if (await skipBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skipBtn.click()
    await expect(page.locator('#recovery-phrase-modal')).not.toHaveAttribute('open', '', { timeout: 2000 })
  }
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
  // Set relay mode BEFORE opening modal so the app's in-memory state is correct
  if (options?.mode === 'offline') {
    // Clear all relay fields to force offline mode
    await page.addInitScript(() => {
      const raw = localStorage.getItem('canary:settings')
      const settings = raw ? JSON.parse(raw) : {}
      settings.defaultRelays = []
      settings.defaultReadRelays = []
      settings.defaultWriteRelays = []
      localStorage.setItem('canary:settings', JSON.stringify(settings))
    })
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
  } else if (options?.mode === 'online') {
    // Ensure at least one relay exists (don't overwrite if already seeded)
    await page.addInitScript(() => {
      const raw = localStorage.getItem('canary:settings')
      const settings = raw ? JSON.parse(raw) : {}
      if (!settings.defaultRelays?.length) {
        settings.defaultRelays = ['wss://relay.trotters.cc/']
      }
      localStorage.setItem('canary:settings', JSON.stringify(settings))
    })
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
  }

  await page.click('#create-group-btn')
  await page.waitForSelector('#app-modal[open]', { timeout: 3000 })

  await page.fill('[name="name"]', name)

  if (options?.myName) {
    const myNameInput = page.locator('[name="myname"]')
    if (await myNameInput.isVisible()) {
      await myNameInput.fill(options.myName)
    }
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

/** Click the Invite button and extract the binary invite URL + confirm code via the QR path. */
export async function createInvite(page: Page): Promise<{ inviteUrl: string; confirmCode: string }> {
  const heroInvite = page.locator('#hero-invite-btn')
  const membersInvite = page.locator('#invite-btn')

  if (await heroInvite.isVisible()) {
    await heroInvite.click()
  } else {
    await membersInvite.click()
  }

  await page.waitForSelector('#invite-modal[open]', { timeout: 3000 })

  // Use the QR path which embeds the full payload + confirm code
  await page.click('#invite-qr-path')
  await page.waitForSelector('.qr-container', { timeout: 3000 })

  // Read the invite URL from the data-url attribute on the QR container
  const inviteUrl = await page.locator('.qr-container').getAttribute('data-url')
  if (!inviteUrl) throw new Error('Could not extract invite URL from QR container data-url')

  // Read the confirm code (shown as plain text below the QR)
  const confirmCode = await page.evaluate(() => {
    const modal = document.getElementById('invite-modal')
    if (!modal) return ''
    const paragraphs = modal.querySelectorAll('p')
    for (const p of paragraphs) {
      const text = p.textContent?.trim() ?? ''
      // Confirm code is space-separated words, all lowercase
      if (/^[a-z]+(?: [a-z]+)*$/.test(text) && text.split(' ').length >= 2) return text
    }
    return ''
  })
  if (!confirmCode) throw new Error('Could not read confirm code from invite modal')

  await page.click('#invite-done-btn').catch(() => page.click('#invite-close-btn'))
  return { inviteUrl, confirmCode }
}

/**
 * Accept an invite by navigating to its #inv/ URL (binary invite).
 * The joiner sees a `#binary-join-modal` where they enter the confirmation words.
 */
export async function acceptInviteViaLink(
  page: Page,
  inviteUrl: string,
  confirmCode: string,
  loginName?: string,
): Promise<void> {
  // Capture any alert dialogs (e.g. from validation errors)
  let alertMessage = ''
  const dialogHandler = async (dialog: import('@playwright/test').Dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  }
  page.on('dialog', dialogHandler)

  // Navigate to the invite URL (contains #inv/<base64url>)
  const hash = new URL(inviteUrl).hash
  await page.goto(`/${hash}`)

  // If not logged in, the login screen appears first
  const loginScreen = page.locator('.lock-screen')
  if (await loginScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await loginOffline(page, loginName ?? 'Invitee')
  }

  // The binary join modal should appear
  await page.waitForSelector('#binary-join-modal[open]', { timeout: 5000 })
  await page.fill('#binary-join-confirm', confirmCode)
  await page.click('#binary-join-accept')

  // Wait for modal to close (successful join)
  await page.waitForSelector('#binary-join-modal:not([open])', { state: 'attached', timeout: 5000 })

  page.off('dialog', dialogHandler)

  if (alertMessage) {
    throw new Error(`Invite acceptance failed: ${alertMessage}`)
  }
}

/**
 * Accept an invite by navigating to its #inv/ URL (simulates QR scan).
 * Same as acceptInviteViaLink since both use the binary invite format now.
 */
export async function acceptInviteViaQR(
  page: Page,
  inviteUrl: string,
  confirmCode: string,
  loginName?: string,
): Promise<void> {
  return acceptInviteViaLink(page, inviteUrl, confirmCode, loginName)
}

/**
 * Accept a sync-state update via the #sync/ deep link.
 */
export async function acceptSyncViaLink(
  page: Page,
  payload: string,
  confirmCode: string,
  loginName?: string,
): Promise<void> {
  const encodedPayload = encodeURIComponent(payload)

  let alertMessage = ''
  const dialogHandler = async (dialog: import('@playwright/test').Dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  }
  page.on('dialog', dialogHandler)

  await page.goto(`/#sync/${encodedPayload}`)

  const loginScreen = page.locator('.lock-screen')
  if (await loginScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await loginOffline(page, loginName ?? 'Member')
  }

  await page.waitForSelector('#app-modal[open]', { timeout: 5000 })
  await page.fill('[name="code"]', confirmCode)
  await page.click('#modal-form button[type="submit"]')
  await page.waitForSelector('#app-modal:not([open])', { state: 'attached', timeout: 5000 })

  page.off('dialog', dialogHandler)

  if (alertMessage) {
    throw new Error(`Sync acceptance failed: ${alertMessage}`)
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
  // Use evaluate to dispatch a proper PointerEvent with clientX set to
  // the left side of the button (normal word, not duress).
  const word = await page.evaluate(() => {
    const btn = document.getElementById('hero-reveal-btn')
    if (!btn) return ''
    const rect = btn.getBoundingClientRect()
    // Dispatch pointerdown on the left quarter (normal word)
    btn.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: rect.left + rect.width * 0.25,
      clientY: rect.top + rect.height / 2,
      isPrimary: true,
    }))
    const wordEl = document.getElementById('hero-word')
    const text = wordEl?.textContent?.trim() ?? ''
    btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    return text
  })
  return word
}

/** Type a word in the verify panel and click Verify. Returns the result status. */
export async function verifyWord(
  page: Page,
  word: string,
): Promise<'valid' | 'duress' | 'invalid'> {
  // Select the first available member in the dropdown (if present)
  const memberSelect = page.locator('#verify-member')
  if (await memberSelect.count() > 0) {
    const options = memberSelect.locator('option[value]:not([value=""])')
    const firstValue = await options.first().getAttribute('value')
    if (firstValue) await memberSelect.selectOption(firstValue)
  }

  await page.fill('#verify-input', word)
  await page.click('#verify-btn')

  const resultEl = page.locator('#verify-result')
  await expect(resultEl).not.toBeHidden({ timeout: 3000 })

  const classes = await resultEl.getAttribute('class') ?? ''
  if (classes.includes('verify-result--valid')) return 'valid'
  if (classes.includes('verify-result--duress')) return 'duress'
  return 'invalid'
}

// ── Persistence ──────────────────────────────────────────────

/**
 * Wait for the debounced persistence write to flush to localStorage.
 * The app debounces writes with 100ms + async encryption. This waits
 * until `canary:groups` contains at least one group entry.
 */
export async function waitForPersist(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const raw = localStorage.getItem('canary:groups')
      if (!raw) return false
      const groups = JSON.parse(raw)
      return Object.keys(groups).length > 0
    },
    { timeout: 3000 },
  )
}

// ── Member management ────────────────────────────────────────

/**
 * Add a simulated member directly via localStorage, then reload
 * so the app picks up the change.
 * Replaces the removed #add-member-btn with a programmatic equivalent.
 */
export async function addSimulatedMember(page: Page): Promise<void> {
  // Wait for debounced state to flush to localStorage with at least one group
  await waitForPersist(page)

  // Read the active group name before reload so we can re-select it
  const activeGroupName = await page.locator('.group-list__item--active .group-list__name').textContent()

  // Generate the fake pubkey in Node and inject via addInitScript so the
  // member is added to localStorage before app JS runs on reload.
  const fakePubkey = Array.from(
    { length: 32 },
    () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'),
  ).join('')

  await page.addInitScript((pubkey: string) => {
    const raw = localStorage.getItem('canary:groups')
    if (!raw) return
    const groups = JSON.parse(raw)
    const groupId = Object.keys(groups)[0]
    if (!groupId) return
    const group = groups[groupId]
    group.members = [...group.members, pubkey]
    localStorage.setItem('canary:groups', JSON.stringify(groups))
  }, fakePubkey)

  await page.reload()
  await page.waitForSelector('#sidebar', { timeout: 5000 })
  // Re-select the group to make it active
  if (activeGroupName) {
    await page.click(`.group-list__item:has-text("${activeGroupName.trim()}")`)
    await page.waitForSelector(`.group-list__item--active:has-text("${activeGroupName.trim()}")`)
  }
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
  // Wait for the active state to update on the button (confirms re-render)
  await page.waitForSelector(`[data-enc="${format}"].segmented__btn--active`, { timeout: 2000 })
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

/** Read the active group's state from localStorage. */
export async function getGroupState(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('canary:groups')
    if (!raw) return {}
    const groups = JSON.parse(raw)
    const stateRaw = localStorage.getItem('canary:state')
    const activeId = stateRaw ? JSON.parse(stateRaw).activeGroupId : null
    if (!activeId) {
      // fallback: use first group
      const keys = Object.keys(groups)
      return keys.length > 0 ? groups[keys[0]] : {}
    }
    return groups[activeId] ?? {}
  })
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

// ── Warning toast tracking ───────────────────────────────────

/**
 * Start tracking warning toasts via MutationObserver.
 * Call BEFORE the action you want to monitor.
 */
export async function startTrackingWarningToasts(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as any).__canaryWarningToasts = []
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.classList?.contains('toast--warning')) {
            (window as any).__canaryWarningToasts.push(node.textContent?.trim() ?? '')
          }
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

/** Assert no warning toasts appeared since tracking started. */
export async function assertNoWarningToasts(page: Page): Promise<void> {
  const warnings: string[] = await page.evaluate(() => (window as any).__canaryWarningToasts ?? [])
  if (warnings.length > 0) {
    throw new Error(`Unexpected warning toast(s): ${warnings.join(', ')}`)
  }
}
