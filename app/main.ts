// app/main.ts — CANARY demo app entry point
// Renders the app shell: header + sidebar + main content area.

import './styles/fonts.css'
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
  flushPersist,
} from './storage.js'
import { getState, subscribe, update, updateGroup } from './state.js'
import { renderHeader } from './components/header.js'
import { renderSidebar } from './components/sidebar.js'
import { showModal } from './components/modal.js'
import { createNewGroup } from './actions/groups.js'
import { groupMode } from './types.js'
import { renderWelcome } from './panels/welcome.js'
import { renderHero } from './panels/hero.js'
import { renderDuress } from './panels/duress.js'
import { renderVerify } from './panels/verify.js'
import { renderMembers, showInviteModal } from './panels/members.js'
import { renderBeacons, handleIncomingBeacon } from './panels/beacons.js'
import { renderLiveness } from './panels/liveness.js'
import { renderSettings } from './panels/settings.js'
import { renderCallSimulation, destroyCallSimulation } from './views/call-simulation.js'
import { showCallVerify } from './components/call-verify.js'
import { assertRemoteInviteToken, decryptWelcomeEnvelope } from './crypto/remote-invite.js'
import { sendJoinRequest } from './nostr/invite-relay.js'
import { resolveSigner, hasNip07 } from './nostr/signer.js'
import { DEMO_ACCOUNTS } from './demo-accounts.js'
import { decode as nip19decode, nsecEncode } from 'nostr-tools/nip19'
import { getPublicKey } from 'nostr-tools/pure'
import { hexToBytes } from 'canary-kit/crypto'
import { broadcastAction, ensureTransport, subscribeToAllGroups, teardownSync } from './sync.js'
import { showToast } from './components/toast.js'
import { showDuressAlert } from './components/duress-alert.js'
import { escapeHtml } from './utils/escape.js'
import { base64ToJson } from './utils/base64.js'
import type { AppIdentity } from './types.js'

/** Allow wss:// relays, plus ws:// only for localhost development. */
function isAllowedRelayUrl(url: string): boolean {
  if (url.startsWith('wss://')) return true
  if (url.startsWith('ws://')) {
    try {
      const parsed = new URL(url)
      return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '[::1]'
    } catch { return false }
  }
  return false
}

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
  teardownSync()

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
        autocomplete="off"
        placeholder="••••••"
      >
      <p class="lock-screen__error" id="pin-error" hidden>Incorrect PIN. Try again.</p>
      <button class="btn btn--primary lock-screen__btn" id="pin-submit">Unlock</button>
    </div>
  `

  const pinInput = document.getElementById('pin-input') as HTMLInputElement
  const pinError = document.getElementById('pin-error') as HTMLParagraphElement
  const pinSubmit = document.getElementById('pin-submit') as HTMLButtonElement

  let _failCount = 0
  const DELAYS = [0, 1000, 2000, 5000, 15000, 30000]

  async function attemptUnlock(): Promise<void> {
    const pin = pinInput.value.trim()
    if (pin.length < 6) {
      pinError.textContent = 'PIN must be at least 6 digits.'
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
      render()
      subscribe(scheduleRender)
      startAutoLock()
      wireGlobalEvents()
      // Must come AFTER wireGlobalEvents so the 'canary:join-group' listener is registered
      checkInviteFragment()
      window.addEventListener('hashchange', () => checkInviteFragment())
      void bootSync()
    } catch {
      _failCount++
      const delay = DELAYS[Math.min(_failCount, DELAYS.length - 1)]
      pinError.textContent = delay > 0
        ? `Incorrect PIN. Wait ${delay / 1000}s before retrying.`
        : 'Incorrect PIN. Try again.'
      pinError.hidden = false
      pinInput.value = ''
      pinSubmit.disabled = true
      pinSubmit.textContent = 'Unlock'
      if (delay > 0) {
        setTimeout(() => {
          pinSubmit.disabled = false
          pinInput.focus()
        }, delay)
      } else {
        pinSubmit.disabled = false
        pinInput.focus()
      }
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
let _renderPending = false
function scheduleRender(): void {
  if (_renderPending) return
  _renderPending = true
  requestAnimationFrame(() => {
    _renderPending = false
    render()
  })
}

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

    const activeGroup = getState().groups[getState().activeGroupId ?? '']
    const isOnline = activeGroup ? groupMode(activeGroup) === 'online' : false

    const beacons = document.getElementById('beacon-container')
    if (beacons) {
      if (isOnline) {
        beacons.hidden = false
        void renderBeacons(beacons)
      } else {
        beacons.hidden = true
        beacons.innerHTML = ''
      }
    }

    const liveness = document.getElementById('liveness-container')
    if (liveness) {
      if (isOnline) {
        liveness.hidden = false
        renderLiveness(liveness)
      } else {
        liveness.hidden = true
        liveness.innerHTML = ''
      }
    }

    const settings = document.getElementById('settings-container')
    if (settings) renderSettings(settings)
  } else if (view === 'call-demo') {
    const callContainer = document.getElementById('call-simulation-container')
    if (callContainer) renderCallSimulation(callContainer)
  }
}

// ── Modal: create group ────────────────────────────────────────

function showCreateGroupModal(): void {
  const { identity } = getState()
  const knownName = identity?.displayName && identity.displayName !== 'You' ? identity.displayName : ''

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
    ${!knownName ? `
    <label class="input-label">
      <span>Your name</span>
      <input
        class="input"
        type="text"
        name="myname"
        placeholder="e.g. Alice"
      />
    </label>
    ` : ''}
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
    const myName = knownName || (formData.get('myname') as string | null)?.trim() || ''
    const activePresetBtn = document.querySelector<HTMLButtonElement>('.segmented__btn.segmented__btn--active[data-preset]')
    const preset = (activePresetBtn?.dataset.preset ?? 'family') as 'family' | 'field-ops' | 'enterprise' | 'event'
    const groupId = createNewGroup(name, preset, identity?.pubkey)
    if (myName && identity?.pubkey) {
      const group = getState().groups[groupId]
      if (group) {
        updateGroup(groupId, { memberNames: { ...group.memberNames, [identity.pubkey]: myName } })
      }
    }
    const newGroup = getState().groups[groupId]
    if (newGroup && groupMode(newGroup) === 'online' && newGroup.relays?.length) {
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
 * Check URL hash for invite/ack fragments and dispatch accordingly.
 * Only seedless `#remote/` and `#ack/` are supported — legacy seed-bearing
 * `#join/`, `#scan/`, `#sync/` handlers have been removed.
 */
function checkInviteFragment(): void {
  const hash = window.location.hash
  if (hash.startsWith('#ack/')) {
    let token: string
    try {
      token = decodeURIComponent(hash.slice(5))
    } catch {
      console.warn('[canary] Malformed ack fragment — ignoring.')
      window.location.hash = ''
      return
    }
    window.location.hash = ''
    document.dispatchEvent(
      new CustomEvent('canary:confirm-member', { detail: { token } }),
    )
  } else if (hash.startsWith('#remote/')) {
    let tokenPayload: string
    try {
      tokenPayload = decodeURIComponent(hash.slice(8))
    } catch {
      console.warn('[canary] Malformed remote invite fragment — ignoring.')
      window.location.hash = ''
      return
    }
    window.location.hash = ''
    showRemoteJoinScreen(tokenPayload)
  }
}

// ── Remote join screen (joiner side) ────────────────────────────

function acceptWelcomeEnvelope(
  envelope: string,
  token: { adminPubkey: string; inviteId: string },
  dialog: HTMLDialogElement,
): void {
  const { identity } = getState()
  if (!identity?.pubkey || !identity?.privkey) return

  const welcome = decryptWelcomeEnvelope({
    envelope,
    joinerPrivkey: identity.privkey,
    adminPubkey: token.adminPubkey,
    expectedInviteId: token.inviteId,
  })

  // Build AppGroup from welcome payload
  const id = welcome.groupId
  const { groups: existingGroups } = getState()
  const members = new Set<string>(welcome.members)
  members.add(identity.pubkey)
  const memberNames: Record<string, string> = { ...(welcome.memberNames ?? {}) }
  if (identity.displayName && identity.displayName !== 'You') {
    memberNames[identity.pubkey] = identity.displayName
  }

  const relays = [...(welcome.relays ?? [])]
  const hasRelays = relays.length > 0

  const appGroup = {
    id,
    name: welcome.groupName,
    seed: welcome.seed,
    members: Array.from(members),
    memberNames,
    nostrEnabled: hasRelays,
    relays,
    wordlist: welcome.wordlist,
    wordCount: welcome.wordCount,
    counter: welcome.counter,
    usageOffset: welcome.usageOffset,
    rotationInterval: welcome.rotationInterval,
    encodingFormat: welcome.encodingFormat,
    usedInvites: [] as string[],
    latestInviteIssuedAt: 0,
    beaconInterval: welcome.beaconInterval,
    beaconPrecision: welcome.beaconPrecision,
    duressMode: 'immediate' as const,
    livenessInterval: welcome.rotationInterval,
    livenessCheckins: {} as Record<string, number>,
    tolerance: welcome.tolerance,
    createdAt: Math.floor(Date.now() / 1000),
    admins: [...welcome.admins],
    epoch: welcome.epoch,
    consumedOps: [] as string[],
  }

  const groups = { ...existingGroups, [id]: appGroup }
  update({ groups, activeGroupId: id })
  flushPersist()

  // Boot relay sync and announce
  if (hasRelays && identity) {
    void ensureTransport(relays, id).then(() => {
      broadcastAction(id, {
        type: 'member-join',
        pubkey: identity.pubkey,
        displayName: identity.displayName && identity.displayName !== 'You' ? identity.displayName : undefined,
        timestamp: Math.floor(Date.now() / 1000),
        epoch: welcome.epoch,
        opId: crypto.randomUUID(),
      })
    })
  }

  dialog.close()
  showToast(`Joined ${welcome.groupName}`, 'success')
}

function showRemoteJoinScreen(tokenPayload: string): void {
  try {
    let parsed: unknown
    try {
      parsed = base64ToJson(tokenPayload)
    } catch {
      throw new Error('Invalid invite — could not decode token.')
    }

    assertRemoteInviteToken(parsed)

    const token = parsed
    const { identity, settings } = getState()
    if (!identity?.pubkey || !identity?.privkey) {
      showToast('No local identity — create or import one first.', 'error')
      return
    }

    const shortAdmin = `${token.adminPubkey.slice(0, 8)}\u2026${token.adminPubkey.slice(-4)}`
    const relays = settings.defaultRelays

    let dialog = document.getElementById('remote-join-modal') as HTMLDialogElement | null
    if (!dialog) {
      dialog = document.createElement('dialog')
      dialog.id = 'remote-join-modal'
      dialog.className = 'modal'
      document.body.appendChild(dialog)
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog!.close()
      })
    }

    const d = dialog
    let cleanupRelay = () => {}

    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">Remote Invite</h2>
        <p class="invite-hint">You've been invited to <strong>${escapeHtml(token.groupName)}</strong> by <code>${escapeHtml(shortAdmin)}</code></p>

        <p class="invite-hint" id="remote-join-relay-status" style="color: var(--verified); font-weight: 500;">${relays.length > 0 ? 'Connecting to relay...' : ''}</p>

        <div style="margin: 1rem 0;">
          <p class="invite-hint" style="font-weight: 500;">Or send this join code manually:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;">
            <code style="font-size: 0.75rem; word-break: break-all; max-width: 80%;">${escapeHtml(identity.pubkey)}</code>
            <button class="btn btn--sm" id="remote-join-copy-pubkey" type="button">Copy</button>
          </div>
        </div>

        <div style="margin: 1rem 0;">
          <p class="invite-hint">Paste the welcome message they send you:</p>
          <input class="input" id="remote-join-welcome-input" type="text" placeholder="Paste welcome message here..." autocomplete="off" style="font-family: monospace; font-size: 0.85rem;">
          <p class="invite-hint" id="remote-join-error" style="color: var(--duress); display: none;"></p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="remote-join-cancel" type="button">Cancel</button>
          <button class="btn btn--primary" id="remote-join-accept" type="button">Join</button>
        </div>
      </div>
    `

    // Auto-exchange over relay if relays are available
    if (relays.length > 0) {
      void ensureTransport(relays).then(() => {
        const statusEl = d.querySelector('#remote-join-relay-status')
        if (statusEl) statusEl.textContent = 'Waiting for admin to send group key...'

        cleanupRelay = sendJoinRequest({
          inviteId: token.inviteId,
          adminPubkey: token.adminPubkey,
          relays,
          onWelcome(envelope) {
            try {
              acceptWelcomeEnvelope(envelope, token, d)
            } catch (err) {
              if (statusEl) {
                statusEl.textContent = 'Auto-join failed — paste welcome message manually.'
                statusEl.style.color = 'var(--duress)'
              }
            }
          },
          onError(msg) {
            if (statusEl) {
              statusEl.textContent = msg
              statusEl.style.color = 'var(--duress)'
            }
          },
        })
      })
    }

    d.querySelector<HTMLButtonElement>('#remote-join-copy-pubkey')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      try {
        await navigator.clipboard.writeText(identity.pubkey)
        btn.textContent = 'Copied!'
        setTimeout(() => { btn.textContent = 'Copy' }, 1500)
      } catch { /* clipboard may be blocked */ }
    })

    d.querySelector<HTMLButtonElement>('#remote-join-cancel')?.addEventListener('click', () => { cleanupRelay(); d.close() })

    d.querySelector<HTMLButtonElement>('#remote-join-accept')?.addEventListener('click', async () => {
      const input = d.querySelector<HTMLInputElement>('#remote-join-welcome-input')
      const errorEl = d.querySelector<HTMLElement>('#remote-join-error')
      const envelope = (input?.value ?? '').replace(/[^A-Za-z0-9=+/]/g, '')

      if (!envelope) {
        if (errorEl) { errorEl.textContent = 'Please paste the welcome message.'; errorEl.style.display = '' }
        return
      }

      try {
        cleanupRelay()
        acceptWelcomeEnvelope(envelope, token, d)
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err instanceof Error ? err.message : 'Failed to decrypt welcome message.'
          errorEl.style.display = ''
        }
      }
    })

    d.showModal()
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Invalid remote invite.', 'error')
  }
}


// ── Global event listeners ──────────────────────────────────────

function wireGlobalEvents(): void {
  // Fired by the sidebar's "New Group" button.
  document.addEventListener('canary:create-group', () => {
    showCreateGroupModal()
  })

  document.addEventListener('canary:show-invite', (evt) => {
    const { groupId } = (evt as CustomEvent).detail
    const { groups } = getState()
    const group = groups[groupId]
    if (!group) return
    showInviteModal(group)
  })

  document.addEventListener('canary:confirm-member', (evt) => {
    const { identity, groups, activeGroupId } = getState()
    if (!activeGroupId || !identity?.pubkey) return
    const group = groups[activeGroupId]
    if (!group || !group.admins.includes(identity.pubkey)) return

    const token = (evt as CustomEvent<{ token?: string }>).detail?.token ?? ''
    import('./panels/members.js').then(({ showConfirmMemberModal }) => {
      showConfirmMemberModal(token)
    })
  })

  document.addEventListener('canary:verify-call', (evt) => {
    const { groupId, pubkey } = (evt as CustomEvent).detail
    showCallVerify(groupId, pubkey)
  })

  // Fired by the settings panel PIN toggle.
  document.addEventListener('canary:pin-enable', (evt) => {
    const pin = (evt as CustomEvent<{ pin: string }>).detail?.pin
    if (!pin || pin.length < 6) return
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
      if (import.meta.env.DEV) console.info(`[canary] Beacon from ${sender.slice(0, 8)}…`)
      handleIncomingBeacon(sender, message.lat, message.lon, message.accuracy ?? 20000, message.timestamp)
    } else if (message.type === 'duress-alert') {
      // Use subject (person under duress) if available, fall back to sender
      const duressPubkey = message.subject || sender
      showDuressAlert(duressPubkey, groupId, message.lat != null ? { lat: message.lat, lon: message.lon } : undefined, message.timestamp)
    }
  })

  // Re-sync when identity changes (e.g. nsec login from header popover)
  document.addEventListener('canary:resync', () => void bootSync())
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

  // Boot-time auto-insertion of local identity into groups was removed.
  // It violated the authority model (I1) — only admins may add members.
  // Groups missing the local identity require a fresh invite to rejoin.
}

// ── Relay sync boot ────────────────────────────────────────────

async function bootSync(): Promise<void> {
  const { groups, identity, settings } = getState()

  const groupCount = Object.keys(groups).length
  const hasPrivkey = !!identity?.privkey
  if (import.meta.env.DEV) console.warn('[canary:boot] bootSync — groups:', groupCount, 'identity:', identity?.pubkey?.slice(0, 8) ?? 'none', 'privkey:', hasPrivkey ? 'yes' : 'NO')

  // Collect unique relays from all groups + default relays
  const allRelays = new Set<string>()
  for (const group of Object.values(groups)) {
    if (import.meta.env.DEV) console.warn('[canary:boot]   group', group.id.slice(0, 8), 'mode:', groupMode(group), 'relays:', JSON.stringify(group.relays), 'members:', group.members.length)
    for (const relay of group.relays) {
      allRelays.add(relay)
    }
  }
  // Include default relays so profile fetch works even with no groups
  for (const relay of settings.defaultRelays) {
    allRelays.add(relay)
  }
  if (allRelays.size === 0) {
    console.warn('[canary:boot] No relays found — sync disabled')
    if (groupCount > 0) {
      showToast(`Sync disabled — ${groupCount} group(s), no relays configured`, 'warning', 5000)
    }
    return
  }

  if (!hasPrivkey) {
    console.warn('[canary:boot] No privkey — sync disabled')
    showToast('Sync disabled — no private key', 'warning', 5000)
    return
  }

  console.warn('[canary:boot] Connecting to relays:', Array.from(allRelays))
  await ensureTransport(Array.from(allRelays))
  subscribeToAllGroups()
  showToast(`Syncing via ${allRelays.size} relay(s)`, 'success', 2000)

  // Fetch the user's own kind 0 profile (name + avatar)
  const { fetchOwnProfile } = await import('./nostr/profiles.js')
  fetchOwnProfile()

  // Re-render now that pool is connected — fetchProfiles needs a live pool
  scheduleRender()

  // Start heartbeat AFTER groups are registered (not inside ensureTransport)
  const { startLivenessHeartbeat } = await import('./components/liveness.js')
  startLivenessHeartbeat()
}

// ── Login screen ──────────────────────────────────────────────

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function showNsecBackupModal(privkeyHex: string): void {
  const nsec = nsecEncode(hexToBytes(privkeyHex))

  let dialog = document.getElementById('nsec-backup-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'nsec-backup-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
  }

  const d = dialog
  d.innerHTML = `
    <div class="modal__form" style="max-width: 400px;">
      <h2 class="modal__title">Back up your secret key</h2>
      <p class="invite-hint">We created a Nostr keypair for you. Save your <strong>nsec</strong> somewhere safe — it's the only way to log back in on another device or if you clear your browser.</p>
      <code style="font-size: 0.7rem; word-break: break-all; display: block; background: var(--bg); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border); margin: 1rem 0; user-select: all;">${escapeHtml(nsec)}</code>
      <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Do not share this with anyone.</p>
      <div class="modal__actions" style="gap: 0.5rem;">
        <button class="btn btn--primary" id="nsec-backup-copy" type="button">Copy nsec</button>
        <button class="btn" id="nsec-backup-done" type="button">I've saved it</button>
      </div>
    </div>
  `

  d.querySelector('#nsec-backup-copy')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement
    try {
      await navigator.clipboard.writeText(nsec)
      btn.textContent = 'Copied!'
      setTimeout(() => { btn.textContent = 'Copy nsec' }, 2000)
    } catch { /* clipboard may be blocked */ }
  })

  d.querySelector('#nsec-backup-done')?.addEventListener('click', () => d.close())

  d.showModal()
}

function showLoginScreen(): void {
  const app = document.getElementById('app')!

  const demoButtons = DEMO_ACCOUNTS.map(a => `
    <button class="btn login-screen__demo" data-nsec="${escapeHtml(a.nsec)}" data-name="${escapeHtml(a.name)}" type="button">
      <strong>${escapeHtml(a.name)}</strong> <span style="color: var(--text-muted); font-weight: 400;">${escapeHtml(a.bio)}</span>
    </button>
  `).join('')

  app.innerHTML = `
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">Deepfake-proof identity verification</p>

      <div style="width: 100%; max-width: 360px; margin-top: 1.5rem;">

        <div style="background: var(--bg-raised); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
          <p class="input-label__text" style="margin-bottom: 0.5rem;">Quick Start</p>
          <p class="settings-hint" style="margin-bottom: 0.5rem;">No Nostr account needed. Enter your name to get started.</p>
          <form id="offline-form" autocomplete="off" style="display: flex; gap: 0.375rem;">
            <input class="input" type="text" id="offline-name" placeholder="Enter your name" required style="flex: 1; font-size: 0.875rem; padding: 0.5rem;" />
            <button class="btn btn--primary" type="submit">Go</button>
          </form>
        </div>

        <div style="background: var(--bg-raised); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
          <p class="input-label__text" style="margin-bottom: 0.5rem;">Connect with Nostr</p>
          <p class="settings-hint" style="margin-bottom: 0.5rem;">Sync groups across devices via relays.</p>

          <form id="nsec-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem;">
            <input class="input" type="password" id="login-nsec" placeholder="nsec1..." autocomplete="off" style="width: 100%; font-size: 0.875rem; padding: 0.5rem;" />
            <button class="btn btn--primary" type="submit">Login with nsec</button>
          </form>

          ${hasNip07() ? `
            <button class="btn" id="login-nip07" type="button" style="width: 100%; margin-top: 0.5rem;">Use Browser Extension</button>
          ` : ''}

          <details style="margin-top: 0.75rem;">
            <summary class="settings-hint" style="cursor: pointer; user-select: none;">Relays</summary>
            <div style="margin-top: 0.375rem;">
              <ul id="login-relay-list" style="list-style: none; padding: 0; margin: 0 0 0.375rem 0;">
                ${getState().settings.defaultRelays.map((url, i) => `
                  <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
                    <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${escapeHtml(url)}</span>
                    <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${i}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
                  </li>
                `).join('')}
              </ul>
              <div style="display: flex; gap: 0.25rem;">
                <input class="input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" style="flex: 1; font-size: 0.75rem; padding: 0.375rem;" />
                <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              </div>
            </div>
          </details>
        </div>

        <div style="border-top: 1px solid var(--border); margin: 1rem 0; padding-top: 0.75rem;">
          <p class="input-label__text" style="margin-bottom: 0.375rem;">Demo accounts</p>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            ${demoButtons}
          </div>
        </div>

      </div>
    </div>
  `

  // Quick Start — generate key silently, just ask for a name
  app.querySelector<HTMLFormElement>('#offline-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = app.querySelector<HTMLInputElement>('#offline-name')
    const name = input?.value.trim()
    if (!name) {
      input?.focus()
      return
    }
    await ensureLocalIdentity()
    const { identity } = getState()
    if (identity) update({ identity: { ...identity, displayName: name } })
    await bootApp()

    // Show backup prompt for newly created keys
    if (identity?.privkey) {
      showNsecBackupModal(identity.privkey)
    }
  })

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

  // ── Relay list editor on login screen ─────────────────────────
  function rerenderRelayList(): void {
    const list = app.querySelector<HTMLUListElement>('#login-relay-list')
    if (!list) return
    const relays = getState().settings.defaultRelays
    list.innerHTML = relays.map((url, i) => `
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${escapeHtml(url)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${i}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join('')
    wireRelayRemoveButtons()
  }

  function wireRelayRemoveButtons(): void {
    app.querySelectorAll<HTMLButtonElement>('.login-relay-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.relayIndex)
        const relays = [...getState().settings.defaultRelays]
        relays.splice(idx, 1)
        update({ settings: { ...getState().settings, defaultRelays: relays } })
        rerenderRelayList()
      })
    })
  }

  wireRelayRemoveButtons()

  app.querySelector('#login-relay-add')?.addEventListener('click', () => {
    const input = app.querySelector<HTMLInputElement>('#login-relay-input')
    const url = input?.value.trim()
    if (!url || !isAllowedRelayUrl(url)) return
    const relays = [...getState().settings.defaultRelays]
    if (!relays.includes(url)) {
      relays.push(url)
      update({ settings: { ...getState().settings, defaultRelays: relays } })
      rerenderRelayList()
    }
    if (input) input.value = ''
  })

  app.querySelector('#login-relay-input')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      e.preventDefault()
      app.querySelector<HTMLButtonElement>('#login-relay-add')?.click()
    }
  })

}

async function bootApp(): Promise<void> {
  buildShell()

  if (window.location.hash === '#call') {
    update({ view: 'call-demo' })
  }

  const header = document.getElementById('header')
  if (header) renderHeader(header)

  wireSidebarToggle()
  render()
  subscribe(scheduleRender)
  wireGlobalEvents()

  // Must come AFTER wireGlobalEvents so the 'canary:join-group' listener is registered
  checkInviteFragment()
  window.addEventListener('hashchange', () => checkInviteFragment())

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
