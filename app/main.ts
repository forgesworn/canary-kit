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
import { getState, subscribe, update, updateGroup } from './state.js'
import { renderHeader, updateRelayStatus } from './components/header.js'
import { renderSidebar } from './components/sidebar.js'
import { showModal } from './components/modal.js'
import { createNewGroup } from './actions/groups.js'
import { renderWelcome } from './panels/welcome.js'
import { renderHero } from './panels/hero.js'
import { renderDuress } from './panels/duress.js'
import { renderVerify } from './panels/verify.js'
import { renderMembers, showInviteModal } from './panels/members.js'
import { renderBeacons } from './panels/beacons.js'
import { renderLiveness } from './panels/liveness.js'
import { renderSettings } from './panels/settings.js'
import { renderCallSimulation, destroyCallSimulation } from './views/call-simulation.js'
import { showCallVerify } from './components/call-verify.js'
import { acceptInvite, createInvite } from './invite.js'
import { resolveSigner, hasNip07 } from './nostr/signer.js'
import { DEMO_ACCOUNTS } from './demo-accounts.js'
import { decode as nip19decode } from 'nostr-tools/nip19'
import { getPublicKey } from 'nostr-tools/pure'
import { broadcastAction, ensureTransport, subscribeToAllGroups, teardownSync } from './sync.js'
import { showDuressAlert } from './components/duress-alert.js'
import type { AppIdentity } from './types.js'

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
      await ensureLocalIdentity()
      buildShell()
      const header = document.getElementById('header')
      if (header) renderHeader(header)
      wireSidebarToggle()
      checkInviteFragment()
      window.addEventListener('hashchange', () => checkInviteFragment())
      render()
      subscribe(render)
      startAutoLock()
      wireGlobalEvents()
      void bootSync()
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
        </div>
        <div id="beacon-container"></div>
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

function showCreateGroupModal(): void {
  const content = `
    <h2 class="modal__title">New Group</h2>
    <label class="input-label">
      <span>What's your group called?</span>
      <input
        class="input"
        type="text"
        name="name"
        placeholder="e.g. Family, Field Team"
        required
        autofocus
      />
    </label>
    <label class="input-label">
      <span>Your name</span>
      <input
        class="input"
        type="text"
        name="myname"
        placeholder="e.g. Alice"
      />
    </label>
    <fieldset class="segmented" style="margin-top: 0.5rem;">
      <legend class="input-label__text" style="margin-bottom: 0.25rem;">Preset</legend>
      <button type="button" class="segmented__btn segmented__btn--active" data-preset="family">Family</button>
      <button type="button" class="segmented__btn" data-preset="field-ops">Field Ops</button>
      <button type="button" class="segmented__btn" data-preset="enterprise">Enterprise</button>
      <button type="button" class="segmented__btn" data-preset="event">Event</button>
    </fieldset>
    <div class="modal__actions">
      <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
      <button type="submit" class="btn btn--primary">Create</button>
    </div>
  `

  showModal(content, (formData) => {
    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return
    const myName = (formData.get('myname') as string | null)?.trim() ?? ''
    const activeBtn = document.querySelector<HTMLButtonElement>('.segmented__btn.segmented__btn--active[data-preset]')
    const preset = (activeBtn?.dataset.preset ?? 'family') as 'family' | 'field-ops' | 'enterprise' | 'event'
    const { identity } = getState()
    const groupId = createNewGroup(name, preset, identity?.pubkey)
    if (myName && identity?.pubkey) {
      const group = getState().groups[groupId]
      if (group) {
        updateGroup(groupId, { memberNames: { ...group.memberNames, [identity.pubkey]: myName } })
      }
    }
    const newGroup = getState().groups[groupId]
    if (newGroup?.relays?.length) {
      void ensureTransport(newGroup.relays, groupId)
    }
  })

  requestAnimationFrame(() => {
    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
      (document.getElementById('app-modal') as HTMLDialogElement | null)?.close()
    })
    // Preset segmented control
    document.querySelectorAll<HTMLButtonElement>('.segmented__btn[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.segmented__btn[data-preset]').forEach(b => b.classList.remove('segmented__btn--active'))
        btn.classList.add('segmented__btn--active')
      })
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
      <label class="input-label">Your name
        <input name="myname" class="input" placeholder="e.g. Alice">
      </label>
      <label class="input-label">Confirmation Code
        <input name="code" class="input" placeholder="6-character code" maxlength="6" required>
      </label>
      <div class="modal__actions">
        <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
        <button type="submit" class="btn btn--primary">Join</button>
      </div>
    `, (form) => {
      try {
        const payload = form.get('payload') as string
        const code = form.get('code') as string
        const myName = (form.get('myname') as string | null)?.trim() ?? ''
        const data = acceptInvite(payload.trim(), code.trim() || undefined)

        // Use the shared group ID from the invite so relay sync events match
        const id = data.groupId ?? crypto.randomUUID()
        const hasRelays = (data.relays?.length ?? 0) > 0

        // Add our own pubkey to the members list
        const { identity } = getState()
        const members = [...(data.members ?? [])]
        if (identity?.pubkey && !members.includes(identity.pubkey)) {
          members.push(identity.pubkey)
        }

        const memberNames: Record<string, string> = {}
        if (myName && identity?.pubkey) {
          memberNames[identity.pubkey] = myName
        }

        const appGroup = {
          ...data,
          id,
          name: data.groupName,
          members,
          memberNames,
          nostrEnabled: hasRelays,
          relays: data.relays ?? [],
          encodingFormat: (data.encodingFormat ?? 'words') as 'words' | 'pin' | 'hex',
          usedInvites: [data.nonce],
          livenessInterval: data.rotationInterval,
          livenessCheckins: {},
          tolerance: data.tolerance ?? 1,
          createdAt: Math.floor(Date.now() / 1000),
        }
        const groups = { ...getState().groups, [id]: appGroup }
        update({ groups, activeGroupId: id })

        // Boot relay sync for this group and announce ourselves
        if (hasRelays && identity) {
          void ensureTransport(data.relays!, id).then(() => {
            broadcastAction(id, {
              type: 'member-join',
              pubkey: identity.pubkey,
              timestamp: Math.floor(Date.now() / 1000),
            })
          })
        }

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

  document.addEventListener('canary:show-invite', (evt) => {
    const { groupId } = (evt as CustomEvent).detail
    const { groups } = getState()
    const group = groups[groupId]
    if (!group) return
    const { payload, confirmCode } = createInvite(group)
    showInviteModal(payload, confirmCode)
  })

  document.addEventListener('canary:verify-call', (evt) => {
    const { groupId, pubkey } = (evt as CustomEvent).detail
    showCallVerify(groupId, pubkey)
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

  // Handle incoming sync messages for beacon/duress side effects.
  document.addEventListener('canary:sync-message', (evt) => {
    const { groupId, message, sender } = (evt as CustomEvent).detail
    if (message.type === 'beacon') {
      console.info(`[canary] Beacon from ${sender.slice(0, 8)}…: ${message.lat}, ${message.lon}`)
    } else if (message.type === 'duress-alert') {
      showDuressAlert(sender, groupId, message.lat != null ? { lat: message.lat, lon: message.lon } : undefined)
    }
  })
}

// ── Local identity ────────────────────────────────────────────
// Always generates a local keypair. NIP-07 is opt-in via settings.

async function ensureLocalIdentity(): Promise<void> {
  let { identity } = getState()

  const resolved = await resolveSigner({
    pubkey: identity?.pubkey ?? '',
    privkey: identity?.privkey,
  })

  const newIdentity: AppIdentity = {
    pubkey: resolved.pubkey,
    privkey: resolved.privkey,
    displayName: identity?.displayName ?? 'You',
    signerType: 'local',
  }

  if (!identity || identity.pubkey !== newIdentity.pubkey) {
    update({ identity: newIdentity })
  }

  // Ensure the local identity is a member of all existing groups
  // (groups created before local identity was introduced).
  const { groups } = getState()
  for (const [id, group] of Object.entries(groups)) {
    if (!group.members.includes(newIdentity.pubkey)) {
      const members = [...group.members, newIdentity.pubkey]
      const updated = { ...groups, [id]: { ...group, members } }
      update({ groups: updated })
    }
  }
}

// ── Relay sync boot ────────────────────────────────────────────

async function bootSync(): Promise<void> {
  const { groups } = getState()

  // Collect unique relays from all groups
  const allRelays = new Set<string>()
  for (const group of Object.values(groups)) {
    for (const relay of group.relays) {
      allRelays.add(relay)
    }
  }
  if (allRelays.size === 0) return

  await ensureTransport(Array.from(allRelays))
  subscribeToAllGroups()
}

// ── Login screen ──────────────────────────────────────────────

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function showLoginScreen(): void {
  const app = document.getElementById('app')!

  const demoButtons = DEMO_ACCOUNTS.map(a => `
    <button class="btn login-screen__demo" data-nsec="${a.nsec}" data-name="${a.name}" type="button">
      <strong>${a.name}</strong> <span style="color: var(--text-muted); font-weight: 400;">${a.bio}</span>
    </button>
  `).join('')

  app.innerHTML = `
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">Deepfake-proof identity verification</p>

      <div style="width: 100%; max-width: 320px; margin-top: 1.5rem;">
        <p class="input-label__text" style="margin-bottom: 0.375rem;">Login with nsec</p>
        <form id="nsec-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem;">
          <input class="input" type="password" id="login-nsec" placeholder="nsec1..." style="width: 100%; font-size: 0.875rem; padding: 0.5rem;" />
          <button class="btn btn--primary" type="submit">Login</button>
        </form>

        ${hasNip07() ? `
          <button class="btn" id="login-nip07" type="button" style="width: 100%; margin-top: 0.5rem;">Use Browser Extension</button>
        ` : ''}

        <div style="border-top: 1px solid var(--border); margin: 1rem 0; padding-top: 0.75rem;">
          <p class="input-label__text" style="margin-bottom: 0.375rem;">Demo accounts</p>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            ${demoButtons}
          </div>
        </div>

        <button class="btn" id="login-generate" type="button" style="width: 100%; margin-top: 0.25rem;">Generate New Key</button>
      </div>
    </div>
  `

  // nsec form submit
  app.querySelector<HTMLFormElement>('#nsec-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = app.querySelector<HTMLInputElement>('#login-nsec')
    const nsec = input?.value.trim()
    if (!nsec) return
    try {
      const decoded = nip19decode(nsec)
      if (decoded.type !== 'nsec') { alert('Not a valid nsec.'); return }
      const privkeyBytes = decoded.data as Uint8Array
      const privkey = bytesToHex(privkeyBytes)
      const pubkey = getPublicKey(privkeyBytes)
      update({ identity: { pubkey, privkey, signerType: 'local', displayName: 'You' } })
      await bootApp()
    } catch { alert('Invalid nsec format.') }
  })

  // Demo account buttons
  app.querySelectorAll<HTMLButtonElement>('.login-screen__demo').forEach(btn => {
    btn.addEventListener('click', async () => {
      const nsec = btn.dataset.nsec!
      const name = btn.dataset.name!
      const decoded = nip19decode(nsec)
      const privkeyBytes = (decoded.data as Uint8Array)
      const privkey = bytesToHex(privkeyBytes)
      const pubkey = getPublicKey(privkeyBytes)
      update({ identity: { pubkey, privkey, signerType: 'local', displayName: name } })
      await bootApp()
    })
  })

  // NIP-07 extension
  app.querySelector('#login-nip07')?.addEventListener('click', async () => {
    try {
      const pubkey = await (window as any).nostr.getPublicKey()
      update({ identity: { pubkey, signerType: 'nip07', displayName: 'You' } })
      await bootApp()
    } catch { alert('Extension rejected the request.') }
  })

  // Generate new key
  app.querySelector('#login-generate')?.addEventListener('click', async () => {
    await ensureLocalIdentity()
    await bootApp()
  })
}

async function bootApp(): Promise<void> {
  buildShell()

  if (window.location.hash === '#call') {
    update({ view: 'call-demo' })
  }

  checkInviteFragment()
  window.addEventListener('hashchange', () => checkInviteFragment())

  const header = document.getElementById('header')
  if (header) renderHeader(header)

  wireSidebarToggle()
  render()
  subscribe(render)
  wireGlobalEvents()
  void bootSync()
}

// ── Bootstrap ──────────────────────────────────────────────────

async function init(): Promise<void> {
  if (hasPinSalt()) {
    // PIN is set — show lock screen. State will be restored after unlock.
    showLockScreen()
  } else {
    // No PIN — restore state directly.
    restoreState()
    const { identity } = getState()

    if (!identity?.pubkey) {
      // No identity — show login screen instead of auto-generating
      showLoginScreen()
    } else {
      // Existing identity — boot straight in
      await bootApp()
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { void init() })
} else {
  void init()
}
