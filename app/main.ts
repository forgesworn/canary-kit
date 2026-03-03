// app/main.ts — CANARY demo app entry point
// Renders the app shell: header + sidebar + main content area.

import './styles/tokens.css'
import './styles/theme.css'
import './styles/layout.css'
import './styles/components.css'

import {
  initStorage,
  restoreState,
  unlockAndRestoreState,
  hasPinSalt,
  readSettingsOnly,
  clearPinKey,
  enablePin,
  disablePin,
} from './storage.js'
import { getState, subscribe, update } from './state.js'
import { renderHeader } from './components/header.js'
import { renderSidebar } from './components/sidebar.js'
import { showModal } from './components/modal.js'
import { createNewGroup } from './actions/groups.js'
import { renderWelcome } from './panels/welcome.js'
import { renderHero } from './panels/hero.js'
import { renderDuress } from './panels/duress.js'
import { renderVerify } from './panels/verify.js'
import { renderMembers } from './panels/members.js'
import { renderBeacons } from './panels/beacons.js'
import { renderLiveness } from './panels/liveness.js'
import { renderSettings } from './panels/settings.js'
import { renderCallSimulation, destroyCallSimulation } from './views/call-simulation.js'
import { acceptInvite } from './invite.js'
import type { PresetName } from 'canary-kit'

// ── Storage bootstrap ──────────────────────────────────────────
// Subscribe first (before restoring) so all state changes are persisted.
initStorage()

// ── Apply restored theme immediately ──────────────────────────
// Read settings from raw localStorage without triggering a full state restore,
// so we can apply the theme before any UI is shown (avoids flash).
const _earlySettings = readSettingsOnly()
if (_earlySettings.theme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light')
} else {
  document.documentElement.removeAttribute('data-theme')
}

// ── Auto-lock ──────────────────────────────────────────────────

let _autoLockTimer: ReturnType<typeof setTimeout> | null = null

function resetAutoLockTimer(): void {
  if (_autoLockTimer !== null) {
    clearTimeout(_autoLockTimer)
    _autoLockTimer = null
  }

  const { settings } = getState()
  if (!settings.pinEnabled || settings.autoLockMinutes <= 0) return

  _autoLockTimer = setTimeout(() => {
    clearPinKey()
    showLockScreen()
  }, settings.autoLockMinutes * 60 * 1000)
}

function startAutoLock(): void {
  document.addEventListener('pointerdown', resetAutoLockTimer, { passive: true })
  document.addEventListener('keydown', resetAutoLockTimer, { passive: true })
  resetAutoLockTimer()
}

function stopAutoLock(): void {
  document.removeEventListener('pointerdown', resetAutoLockTimer)
  document.removeEventListener('keydown', resetAutoLockTimer)
  if (_autoLockTimer !== null) {
    clearTimeout(_autoLockTimer)
    _autoLockTimer = null
  }
}

// ── Lock screen ────────────────────────────────────────────────

function showLockScreen(): void {
  stopAutoLock()

  const app = document.getElementById('app')!
  app.innerHTML = `
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">Enter your PIN to unlock</p>
      <input
        type="password"
        class="input lock-screen__input"
        id="pin-input"
        inputmode="numeric"
        maxlength="8"
        autofocus
        placeholder="••••"
      >
      <p class="lock-screen__error" id="pin-error" hidden>Incorrect PIN. Try again.</p>
      <button class="btn btn--primary lock-screen__btn" id="pin-submit">Unlock</button>
    </div>
  `

  const pinInput = document.getElementById('pin-input') as HTMLInputElement
  const pinError = document.getElementById('pin-error') as HTMLParagraphElement
  const pinSubmit = document.getElementById('pin-submit') as HTMLButtonElement

  async function attemptUnlock(): Promise<void> {
    const pin = pinInput.value.trim()
    if (pin.length < 4) {
      pinError.textContent = 'PIN must be at least 4 digits.'
      pinError.hidden = false
      pinInput.focus()
      return
    }

    pinSubmit.disabled = true
    pinSubmit.textContent = 'Unlocking…'
    pinError.hidden = true

    try {
      await unlockAndRestoreState(pin)
      // Success: build the full app shell and start auto-lock.
      ensureLocalIdentity()
      buildShell()
      const header = document.getElementById('header')
      if (header) renderHeader(header)
      wireSidebarToggle()
      checkInviteFragment()
      render()
      subscribe(render)
      startAutoLock()
      wireGlobalEvents()
    } catch {
      pinError.textContent = 'Incorrect PIN. Try again.'
      pinError.hidden = false
      pinInput.value = ''
      pinInput.focus()
      pinSubmit.disabled = false
      pinSubmit.textContent = 'Unlock'
    }
  }

  pinSubmit.addEventListener('click', () => { void attemptUnlock() })
  pinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') void attemptUnlock()
  })

  // Focus the input after the DOM settles.
  requestAnimationFrame(() => pinInput.focus())
}

// ── App shell HTML ─────────────────────────────────────────────

function buildShell(): void {
  const root = document.getElementById('app')
  if (!root) throw new Error('Missing #app mount point')

  root.innerHTML = `
    <header class="header" id="header"></header>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <div class="layout" id="groups-view">
      <aside class="sidebar" id="sidebar"></aside>

      <main class="content" id="content">
        <div id="welcome-container"></div>
        <div id="hero-container"></div>
        <div id="duress-container"></div>
        <div id="duress-alert-banner" hidden></div>
        <div class="panels-grid">
          <div id="verify-container"></div>
          <div id="members-container"></div>
          <div id="beacon-container"></div>
        </div>
        <div id="liveness-container"></div>
        <div id="settings-container"></div>
      </main>
    </div>

    <div id="call-demo-view" hidden>
      <main class="content" style="max-width: 100%;">
        <div id="call-simulation-container"></div>
      </main>
    </div>
  `
}

// ── Sidebar toggle (mobile) ────────────────────────────────────

function wireSidebarToggle(): void {
  const hamburger = document.getElementById('hamburger')
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')

  if (!hamburger || !sidebar || !overlay) return

  function openSidebar(): void {
    sidebar!.classList.add('sidebar--open')
    overlay!.classList.add('sidebar-overlay--visible')
    hamburger!.setAttribute('aria-expanded', 'true')
  }

  function closeSidebar(): void {
    sidebar!.classList.remove('sidebar--open')
    overlay!.classList.remove('sidebar-overlay--visible')
    hamburger!.setAttribute('aria-expanded', 'false')
  }

  hamburger.setAttribute('aria-expanded', 'false')

  hamburger.addEventListener('click', () => {
    const isOpen = sidebar!.classList.contains('sidebar--open')
    if (isOpen) {
      closeSidebar()
    } else {
      openSidebar()
    }
  })

  overlay.addEventListener('click', () => {
    closeSidebar()
  })

  // Close sidebar when a group is selected (so content is visible on mobile).
  sidebar.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-group-id]')
    if (target) closeSidebar()
  })
}

// ── Render loop ────────────────────────────────────────────────

/** Re-render all reactive components from current state. */
function render(): void {
  const { view } = getState()

  const groupsView = document.getElementById('groups-view')
  const callDemoView = document.getElementById('call-demo-view')

  if (groupsView) groupsView.hidden = view !== 'groups'
  if (callDemoView) callDemoView.hidden = view !== 'call-demo'

  // Re-render header (tab active state)
  const header = document.getElementById('header')
  if (header) renderHeader(header)

  if (view === 'groups') {
    destroyCallSimulation()

    const welcome = document.getElementById('welcome-container')
    if (welcome) renderWelcome(welcome)

    const sidebar = document.getElementById('sidebar')
    if (sidebar) renderSidebar(sidebar)

    const hero = document.getElementById('hero-container')
    if (hero) renderHero(hero)

    const duress = document.getElementById('duress-container')
    if (duress) renderDuress(duress)

    const verify = document.getElementById('verify-container')
    if (verify) renderVerify(verify)

    const members = document.getElementById('members-container')
    if (members) renderMembers(members)

    const beacons = document.getElementById('beacon-container')
    if (beacons) void renderBeacons(beacons)

    const liveness = document.getElementById('liveness-container')
    if (liveness) renderLiveness(liveness)

    const settings = document.getElementById('settings-container')
    if (settings) renderSettings(settings)
  } else if (view === 'call-demo') {
    const callContainer = document.getElementById('call-simulation-container')
    if (callContainer) renderCallSimulation(callContainer)
  }
}

// ── Modal: create group ────────────────────────────────────────

const PRESET_DESCRIPTIONS: Record<PresetName, string> = {
  'family': 'Single word, weekly rotation. For family and friends.',
  'field-ops': 'Two words, daily rotation. For journalism and activism.',
  'enterprise': 'Two words, 48-hour rotation. For larger teams.',
}

function showCreateGroupModal(): void {
  const presetOptions = (['family', 'field-ops', 'enterprise'] as PresetName[])
    .map(
      (p) =>
        `<option value="${p}">${p}</option>`,
    )
    .join('')

  const content = `
    <h2 class="modal__title">New Group</h2>
    <label class="input-label">
      <span>Group name</span>
      <input
        class="input"
        type="text"
        name="name"
        placeholder="e.g. Family, Field Team Alpha"
        required
        autofocus
      />
    </label>
    <label class="input-label">
      <span>Threat profile</span>
      <select class="input" name="preset">
        ${presetOptions}
      </select>
    </label>
    <p id="preset-description" class="modal__preset-desc">${PRESET_DESCRIPTIONS['family']}</p>
    <div class="modal__actions">
      <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
      <button type="submit" class="btn btn--primary">Create</button>
    </div>
  `

  showModal(content, (formData) => {
    const name = (formData.get('name') as string | null)?.trim() ?? ''
    const preset = (formData.get('preset') as PresetName | null) ?? 'family'
    if (!name) return
    const { identity } = getState()
    createNewGroup(name, preset, identity?.pubkey)
  })

  // Wire Cancel button (after the dialog is in the DOM).
  requestAnimationFrame(() => {
    const cancelBtn = document.getElementById('modal-cancel-btn')
    cancelBtn?.addEventListener('click', () => {
      const dialog = document.getElementById('app-modal') as HTMLDialogElement | null
      dialog?.close()
    })

    // Live-update preset description when the select changes.
    const presetSelect = document.querySelector<HTMLSelectElement>('#app-modal select[name="preset"]')
    const descEl = document.getElementById('preset-description')
    presetSelect?.addEventListener('change', () => {
      const selected = presetSelect.value as PresetName
      if (descEl) descEl.textContent = PRESET_DESCRIPTIONS[selected] ?? ''
    })
  })
}

// ── URL fragment invite check ───────────────────────────────────

/**
 * If the URL hash is `#join/<base64payload>`, trigger the join modal
 * with the payload pre-filled and clear the fragment so it does not
 * linger in the browser history.
 */
function checkInviteFragment(): void {
  const hash = window.location.hash
  if (!hash.startsWith('#join/')) return
  const payload = decodeURIComponent(hash.slice(6))
  window.location.hash = ''
  document.dispatchEvent(
    new CustomEvent('canary:join-group', { detail: { payload } }),
  )
}

// ── Global event listeners ──────────────────────────────────────

function wireGlobalEvents(): void {
  // Fired by the sidebar's "New Group" button.
  document.addEventListener('canary:create-group', () => {
    showCreateGroupModal()
  })

  document.addEventListener('canary:join-group', (evt) => {
    const prefill = (evt as CustomEvent<{ payload?: string }>).detail?.payload ?? ''

    showModal(`
      <h2 class="modal__title">Join Group</h2>
      <label class="input-label">Invite String
        <textarea name="payload" class="input" rows="3" placeholder="Paste the invite string here" required>${prefill}</textarea>
      </label>
      <label class="input-label">Confirmation Code
        <input name="code" class="input" placeholder="6-character code" maxlength="6">
      </label>
      <div class="modal__actions">
        <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
        <button type="submit" class="btn btn--primary">Join</button>
      </div>
    `, (form) => {
      try {
        const payload = form.get('payload') as string
        const code = form.get('code') as string
        const data = acceptInvite(payload.trim(), code.trim() || undefined)

        const id = crypto.randomUUID()
        const appGroup = {
          ...data,
          id,
          name: data.groupName,
          nostrEnabled: false,
          relays: [],
          encodingFormat: 'words' as const,
          usedInvites: [data.nonce],
          livenessInterval: data.rotationInterval,
          livenessCheckins: {},
          tolerance: 1,
          createdAt: Math.floor(Date.now() / 1000),
        }
        const groups = { ...getState().groups, [id]: appGroup }
        update({ groups, activeGroupId: id })

        const dialog = document.getElementById('app-modal') as HTMLDialogElement | null
        dialog?.close()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid invite'
        alert(message)
      }
    })

    requestAnimationFrame(() => {
      document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
        const dialog = document.getElementById('app-modal') as HTMLDialogElement | null
        dialog?.close()
      })
    })
  })

  // Fired by the settings panel PIN toggle.
  document.addEventListener('canary:pin-enable', (evt) => {
    const pin = (evt as CustomEvent<{ pin: string }>).detail?.pin
    if (!pin) return
    void enablePin(pin).then(() => {
      update({ settings: { ...getState().settings, pinEnabled: true } })
      startAutoLock()
    })
  })

  document.addEventListener('canary:pin-disable', () => {
    void disablePin().then(() => {
      update({ settings: { ...getState().settings, pinEnabled: false } })
      stopAutoLock()
    })
  })

  document.addEventListener('canary:lock', () => {
    clearPinKey()
    showLockScreen()
  })
}

// ── Local identity ────────────────────────────────────────────
// Generate a random 64-hex pubkey so demo features (duress, beacons,
// liveness) work without a NIP-07 extension.  Persisted via state.

function ensureLocalIdentity(): void {
  let { identity } = getState()
  if (!identity?.pubkey) {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    const pubkey = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    identity = { pubkey, displayName: 'You' }
    update({ identity })
  }

  // Ensure the local identity is a member of all existing groups
  // (groups created before local identity was introduced).
  const { groups } = getState()
  for (const [id, group] of Object.entries(groups)) {
    if (!group.members.includes(identity!.pubkey)) {
      const members = [...group.members, identity!.pubkey]
      const updated = { ...groups, [id]: { ...group, members } }
      update({ groups: updated })
    }
  }
}

// ── Bootstrap ──────────────────────────────────────────────────

function init(): void {
  if (hasPinSalt()) {
    // PIN is set — show lock screen. State will be restored after unlock.
    showLockScreen()
  } else {
    // No PIN — restore state directly and boot the app.
    restoreState()
    ensureLocalIdentity()
    buildShell()

    if (window.location.hash === '#call') {
      update({ view: 'call-demo' })
    }

    checkInviteFragment()

    const header = document.getElementById('header')
    if (header) renderHeader(header)

    wireSidebarToggle()
    render()
    subscribe(render)
    wireGlobalEvents()
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
