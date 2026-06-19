// app/main.ts — CANARY demo app entry point
// Renders the app shell: header + sidebar + main content area.

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/theme.css'
import './styles/layout.css'
import './styles/components.css'

import type { NostrConnectStatus } from 'signet-login'
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
import { getState, subscribe, update, updateGroup, clearSensitiveState } from './state.js'
import { renderHeader } from './components/header.js'
import { renderSidebar } from './components/sidebar.js'
import { showModal } from './components/modal.js'
import { createNewGroup } from './actions/groups.js'
import { groupMode, allRelaysForGroup, dedupeRelays, WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY } from './types.js'
import { renderWelcome } from './panels/welcome.js'
import { renderHero } from './panels/hero.js'
import { renderVerify } from './panels/verify.js'
import { renderMembers, showInviteModal } from './panels/members.js'
import { renderBeacons, handleIncomingBeacon, cleanupBeacons } from './panels/beacons.js'
import { renderLiveness } from './panels/liveness.js'
import { renderSettings } from './panels/settings.js'
import { renderCallSimulation, destroyCallSimulation } from './views/call-simulation.js'
import { renderIdentities } from './views/identities.js'
import { showCallVerify } from './components/call-verify.js'
import { assertRemoteInviteToken, decodeWelcomePayload, decryptWelcomeEnvelope } from './crypto/remote-invite.js'
import { sendJoinRequest, fetchInviteToken } from './nostr/invite-relay.js'
import { resolveSigner } from './nostr/signer.js'
import { broadcastAction, ensureTransport, subscribeToAllGroups, teardownSync } from './sync.js'
import { fetchVault, fetchVaultNip07, publishVault, publishVaultNip07, mergeVaultGroups, subscribeToVault, unsubscribeFromVault } from './nostr/vault.js'
import { initPersonas, initPersonasFromTree, destroyPersonas } from './persona.js'
import { findById } from './persona-tree.js'
import { fetchPersonaProfiles, publishPersonaProfile } from './nostr/profiles.js'
import {
  CANARY_NOSTR_CONNECT_TIMEOUT_MS,
  canUseIdentitySigner,
  decryptWithSignet,
  getSignetNostrConnectRelays,
  identitySignerLabel,
  isExternalSignerIdentity,
  signInWithSignet,
} from './nostr/signet.js'
import { showToast } from './components/toast.js'
import { showDuressAlert } from './components/duress-alert.js'
import { escapeHtml } from './utils/escape.js'
import { base64ToJson, base64urlToJson, base64urlToBytes, jsonToBase64 } from './utils/base64.js'
import { unpackInvite } from './utils/binary-invite.js'
import { acceptInvite, isInviteConsumed, consumeInvite } from './invite.js'
import type { AppGroup, AppIdentity } from './types.js'

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

function preserveMnemonic(nextIdentity: AppIdentity, previousIdentity: AppIdentity | null | undefined): AppIdentity {
  if (previousIdentity?.pubkey === nextIdentity.pubkey && previousIdentity.mnemonic) {
    return { ...nextIdentity, mnemonic: previousIdentity.mnemonic }
  }
  return nextIdentity
}

type LoginRelayMode = 'off' | 'read' | 'readwrite'

const BUNDLED_LOGIN_RELAYS = dedupeRelays([DEFAULT_WRITE_RELAY, ...WELL_KNOWN_READ_RELAYS])

function cleanRelaySettingsList(urls: readonly string[] | undefined): string[] {
  return dedupeRelays((urls ?? []).filter(isAllowedRelayUrl))
}

function knownLoginRelays(settings = getState().settings): string[] {
  const known = settings.knownRelays === undefined ? BUNDLED_LOGIN_RELAYS : settings.knownRelays
  return dedupeRelays([
    ...cleanRelaySettingsList(known),
    ...cleanRelaySettingsList(settings.defaultRelays),
    ...cleanRelaySettingsList(settings.defaultReadRelays),
    ...cleanRelaySettingsList(settings.defaultWriteRelays),
  ])
}

function relayMode(url: string, settings = getState().settings): LoginRelayMode {
  const read = cleanRelaySettingsList(settings.defaultReadRelays).includes(url)
  const write = cleanRelaySettingsList(settings.defaultWriteRelays).includes(url)
  if (read && write) return 'readwrite'
  if (read) return 'read'
  return 'off'
}

function setLoginRelayMode(url: string, mode: LoginRelayMode): void {
  const normalised = dedupeRelays([url])[0] ?? url
  const settings = getState().settings
  const knownRelays = dedupeRelays([...knownLoginRelays(settings), normalised])
  const readRelays = cleanRelaySettingsList(settings.defaultReadRelays).filter((relay) => relay !== normalised)
  const writeRelays = cleanRelaySettingsList(settings.defaultWriteRelays).filter((relay) => relay !== normalised)

  if (mode === 'read' || mode === 'readwrite') {
    readRelays.push(normalised)
  }
  if (mode === 'readwrite') {
    writeRelays.push(normalised)
  }

  const nextWriteRelays = dedupeRelays(writeRelays)
  update({
    settings: {
      ...settings,
      knownRelays,
      defaultRelays: nextWriteRelays,
      defaultReadRelays: dedupeRelays(readRelays),
      defaultWriteRelays: nextWriteRelays,
    },
  })
}

function deleteLoginRelay(url: string): void {
  const settings = getState().settings
  const knownRelays = knownLoginRelays(settings).filter((relay) => relay !== url)
  const defaultReadRelays = cleanRelaySettingsList(settings.defaultReadRelays).filter((relay) => relay !== url)
  const defaultWriteRelays = cleanRelaySettingsList(settings.defaultWriteRelays).filter((relay) => relay !== url)
  update({
    settings: {
      ...settings,
      knownRelays,
      defaultRelays: defaultWriteRelays,
      defaultReadRelays,
      defaultWriteRelays,
    },
  })
}

function resetLoginRelays(): void {
  update({
    settings: {
      ...getState().settings,
      knownRelays: BUNDLED_LOGIN_RELAYS,
      defaultRelays: [DEFAULT_WRITE_RELAY],
      defaultReadRelays: dedupeRelays([...WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY]),
      defaultWriteRelays: [DEFAULT_WRITE_RELAY],
    },
  })
}

function shortRelayUrl(url: string): string {
  return url.replace(/^wss?:\/\//, '').replace(/\/$/, '')
}

function relaysFromNostrConnectUri(uri: string): string[] {
  try {
    const parsed = new URL(uri)
    const relays = parsed.searchParams.getAll('relay').filter((relay) => /^wss?:\/\//.test(relay))
    return dedupeRelays(relays)
  } catch {
    return []
  }
}

function signetDiagnosticState(status: string): string {
  const normalised = status.toLowerCase()
  if (normalised.includes('connected') || normalised.includes('signed in')) return 'Connected'
  if (normalised.includes('selected')) return 'URI ready'
  if (normalised.includes('error') || normalised.includes('failed') || normalised.includes('could not') || status.startsWith('✗')) {
    return 'Relay or signer error'
  }
  return 'Waiting for signer'
}

function signetDiagnosticStateFromStatus(status: NostrConnectStatus): string {
  switch (status.type) {
    case 'uri-created': return 'URI ready'
    case 'relay-connecting': return 'Connecting relay'
    case 'relay-connected': return 'Relay connected'
    case 'signer-seen': return 'Signer seen'
    case 'request-sent': return status.method === 'connect' ? 'Confirming signer' : 'Signer request sent'
    case 'response-received': return status.phase === 'pairing' ? 'Signer approved' : 'Signer responded'
    case 'timeout': return 'Timed out'
    case 'error': return 'Relay or signer error'
  }
}

function signetDiagnosticMessageFromStatus(status: NostrConnectStatus): string {
  switch (status.type) {
    case 'uri-created':
      return 'NostrConnect URI ready. Scan or copy it into Signet.'
    case 'relay-connecting':
      return 'Connecting to NostrConnect relay.'
    case 'relay-connected':
      return `Connected to relay${status.relay ? ` ${shortRelayUrl(status.relay)}` : ''}. Waiting for signer approval.`
    case 'signer-seen':
      return 'Signer event received. Verifying approval.'
    case 'request-sent':
      return status.method === 'connect'
        ? 'Signer approved. Confirming the NIP-46 connection.'
        : `Sent ${status.method ?? 'NIP-46'} request to signer.`
    case 'response-received':
      return status.phase === 'pairing'
        ? 'Signer approval received. Preparing signer session.'
        : `Signer responded${status.method ? ` to ${status.method}` : ''}.`
    case 'timeout':
      return status.message ? `Timed out: ${status.message}` : 'Timed out waiting for signer.'
    case 'error':
      return status.message ? `Error: ${status.message}` : 'NostrConnect failed.'
  }
}

function focusAndSelectUri(input: HTMLInputElement | HTMLTextAreaElement): void {
  input.focus()
  input.select()
  input.setSelectionRange(0, input.value.length)
}

async function copyNostrConnectUri(input: HTMLInputElement | HTMLTextAreaElement): Promise<'copied' | 'selected'> {
  const uri = input.value
  try {
    if (!uri) throw new Error('empty-uri')
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(uri)
      return 'copied'
    }
    focusAndSelectUri(input)
    if (typeof document.execCommand === 'function' && document.execCommand('copy')) {
      return 'copied'
    }
  } catch {
    // Fall through to manual selection.
  }
  focusAndSelectUri(input)
  return 'selected'
}

function wireSignetNostrConnectDiagnostics(): { onStatus: (status: NostrConnectStatus) => void; stop: () => void } {
  const startedAt = Date.now()
  let stopped = false
  let intervalId: number | undefined
  let latestStatus: NostrConnectStatus | null = null

  const onStatus = (status: NostrConnectStatus): void => {
    latestStatus = status
    sync()
  }

  const sync = (): void => {
    if (stopped) return

    const dialog = document.querySelector<HTMLElement>('#signet-login-dialog')
    const statusEl = dialog?.querySelector<HTMLElement>('#signet-login-nc-status')
    const uriInput = dialog?.querySelector<HTMLInputElement | HTMLTextAreaElement>('#signet-login-nc-uri')
    if (!dialog || !statusEl || !uriInput) return

    let panel = dialog.querySelector<HTMLElement>('#canary-signet-diagnostics')
    if (!panel) {
      panel = document.createElement('section')
      panel.id = 'canary-signet-diagnostics'
      panel.className = 'signet-diagnostics'
      panel.setAttribute('aria-live', 'polite')
      panel.setAttribute('aria-label', 'NostrConnect diagnostics')
      const anchor = uriInput.parentElement ?? statusEl
      anchor.insertAdjacentElement('afterend', panel)
    }

    const uri = uriInput.value.trim()
    const relays = relaysFromNostrConnectUri(uri)
    const fallbackRelays = getSignetNostrConnectRelays()
    const statusRelays = latestStatus?.relays.filter((relay) => /^wss?:\/\//.test(relay)) ?? []
    const displayedRelays = statusRelays.length > 0 ? statusRelays : (relays.length > 0 ? relays : fallbackRelays)
    const statusText = latestStatus
      ? signetDiagnosticMessageFromStatus(latestStatus)
      : (statusEl.textContent?.trim() || 'Waiting for signer to connect')
    const stateText = latestStatus ? signetDiagnosticStateFromStatus(latestStatus) : signetDiagnosticState(statusText)
    const timeoutMs = latestStatus?.timeoutMs ?? CANARY_NOSTR_CONNECT_TIMEOUT_MS
    const remainingSeconds = Math.max(0, Math.ceil((timeoutMs - (Date.now() - startedAt)) / 1000))
    const timeoutText = remainingSeconds > 0
      ? `${remainingSeconds}s request window`
      : 'Request may have expired'
    const renderKey = JSON.stringify([
      latestStatus?.type,
      latestStatus?.phase,
      latestStatus?.method,
      latestStatus?.relay,
      statusText,
      stateText,
      timeoutText,
      displayedRelays,
    ])
    if (panel.dataset.renderKey === renderKey) return
    panel.dataset.renderKey = renderKey

    panel.innerHTML = `
      <div class="signet-diagnostics__header">
        <span class="signet-diagnostics__label">NostrConnect diagnostics</span>
        <strong class="signet-diagnostics__state" data-diagnostic="state">${escapeHtml(stateText)}</strong>
      </div>
      <dl class="signet-diagnostics__grid">
        <div>
          <dt>Message</dt>
          <dd data-diagnostic="message">${escapeHtml(statusText)}</dd>
        </div>
        <div>
          <dt>Timeout</dt>
          <dd data-diagnostic="timeout">${escapeHtml(timeoutText)}</dd>
        </div>
      </dl>
      <div class="signet-diagnostics__relays">
        <span>Relays in this URI</span>
        <ul data-diagnostic="relay-list">
          ${displayedRelays.map((relay) => `<li data-diagnostic-relay title="${escapeHtml(relay)}">${escapeHtml(shortRelayUrl(relay))}</li>`).join('')}
        </ul>
      </div>
      <div class="signet-diagnostics__actions">
        <button class="btn btn--ghost btn--sm" data-action="canary-copy-nostrconnect" type="button">Copy URI</button>
        <button class="btn btn--ghost btn--sm" data-action="canary-retry-nostrconnect" type="button">Retry</button>
      </div>
      <p class="signet-diagnostics__hint">
        If Signet cannot reach a relay, use Retry to mint a fresh URI or copy the URI into the signer manually.
      </p>
    `

    panel.querySelector<HTMLButtonElement>('[data-action="canary-copy-nostrconnect"]')?.addEventListener('click', async (event) => {
      const button = event.currentTarget as HTMLButtonElement
      const result = await copyNostrConnectUri(uriInput)
      button.textContent = result === 'copied' ? 'Copied' : 'URI selected'
      window.setTimeout(() => {
        if (button.isConnected) button.textContent = 'Copy URI'
      }, 1500)
    })

    panel.querySelector<HTMLButtonElement>('[data-action="canary-retry-nostrconnect"]')?.addEventListener('click', () => {
      dialog.querySelector<HTMLButtonElement>('[data-action="back"]')?.click()
      window.setTimeout(() => {
        document.querySelector<HTMLButtonElement>('#signet-login-dialog button[data-choice="nostrconnect"]')?.click()
      }, 80)
    })
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true })
  intervalId = window.setInterval(sync, 1000)
  sync()

  const stop = (): void => {
    stopped = true
    observer.disconnect()
    if (intervalId !== undefined) window.clearInterval(intervalId)
  }
  return { onStatus, stop }
}

function renderLoginRelayRows(): string {
  const relays = knownLoginRelays()
  if (relays.length === 0) {
    return '<li class="login-relay-empty">No relays configured.</li>'
  }

  return relays.map((url) => {
    const mode = relayMode(url)
    const enabled = mode !== 'off'
    const selectValue = mode === 'read' ? 'read' : 'readwrite'
    return `
      <li class="login-relay-item" data-relay-row="${escapeHtml(url)}">
        <button class="login-relay-toggle" data-relay-toggle="${escapeHtml(url)}" type="button" aria-pressed="${enabled}">${enabled ? 'On' : 'Off'}</button>
        <span class="login-relay-url" title="${escapeHtml(url)}">${escapeHtml(shortRelayUrl(url))}</span>
        <select class="input login-relay-mode" data-relay-mode="${escapeHtml(url)}" aria-label="Relay mode for ${escapeHtml(shortRelayUrl(url))}" ${enabled ? '' : 'disabled'}>
          <option value="readwrite"${selectValue === 'readwrite' ? ' selected' : ''}>Read/write</option>
          <option value="read"${selectValue === 'read' ? ' selected' : ''}>Read</option>
        </select>
        <button class="btn btn--ghost btn--sm login-relay-delete" data-relay-delete="${escapeHtml(url)}" type="button" aria-label="Delete relay">×</button>
      </li>
    `
  }).join('')
}

interface LoginInviteContext {
  label: string
  title: string
  hint: string
  signetButton: string
  quickStartHint: string
}

function loginInviteContext(hash = window.location.hash): LoginInviteContext | null {
  if (hash.startsWith('#j/')) {
    const inviteId = hash.slice(3)
    if (!/^[0-9a-f]{32}$/.test(inviteId)) return null
    return {
      label: 'Secure invite',
      title: 'You have been invited to a CANARY group',
      hint: 'Sign in with Signet to request the group key over relays.',
      signetButton: 'Join with Signet',
      quickStartHint: 'No Nostr account needed. Enter your name to create a local identity and continue joining.',
    }
  }

  if (hash.startsWith('#remote/')) {
    let tokenPayload = hash.slice(8)
    try {
      tokenPayload = decodeURIComponent(tokenPayload)
    } catch {
      // Base64url invite tokens are already URL-safe.
    }

    try {
      const token = base64urlToJson(tokenPayload)
      assertRemoteInviteToken(token)
      return {
        label: 'Remote invite',
        title: `Join ${token.groupName}`,
        hint: 'Sign in with Signet to decrypt the welcome message and add this group.',
        signetButton: 'Join with Signet',
        quickStartHint: 'No Nostr account needed. Enter your name to create a local identity and continue joining.',
      }
    } catch {
      return {
        label: 'Remote invite',
        title: 'You have been invited to a CANARY group',
        hint: 'Sign in with Signet to continue joining.',
        signetButton: 'Join with Signet',
        quickStartHint: 'No Nostr account needed. Enter your name to create a local identity and continue joining.',
      }
    }
  }

  if (hash.startsWith('#inv/')) {
    try {
      const invite = unpackInvite(base64urlToBytes(hash.slice(5)))
      return {
        label: 'In-person invite',
        title: `Join ${invite.groupName}`,
        hint: 'Sign in first, then enter the confirmation words from the admin.',
        signetButton: 'Continue with Signet',
        quickStartHint: 'No Nostr account needed. Enter your name to create a local identity and continue joining.',
      }
    } catch {
      return {
        label: 'In-person invite',
        title: 'You have been invited to a CANARY group',
        hint: 'Sign in first, then enter the confirmation words from the admin.',
        signetButton: 'Continue with Signet',
        quickStartHint: 'No Nostr account needed. Enter your name to create a local identity and continue joining.',
      }
    }
  }

  return null
}

let _loginHashRefreshWired = false

function wireLoginHashRefresh(): void {
  if (_loginHashRefreshWired) return
  _loginHashRefreshWired = true
  window.addEventListener('hashchange', () => {
    if (getState().identity?.pubkey) return
    if (!document.querySelector('.login-panel')) return
    showLoginScreen()
  })
}

function staleGroupStateError(
  existingGroup: AppGroup | undefined,
  incoming: { epoch?: number; counter?: number; latestInviteIssuedAt?: number },
): string | null {
  if (!existingGroup) return null

  if (typeof incoming.epoch === 'number' && incoming.epoch < existingGroup.epoch) {
    return 'This invite is older than the group state already stored on this device.'
  }

  if (
    typeof incoming.latestInviteIssuedAt === 'number'
    && existingGroup.latestInviteIssuedAt > 0
    && incoming.latestInviteIssuedAt < existingGroup.latestInviteIssuedAt
  ) {
    return 'A newer invite has already been accepted for this group on this device.'
  }

  if (
    typeof incoming.epoch === 'number'
    && incoming.epoch === existingGroup.epoch
    && typeof incoming.counter === 'number'
    && incoming.counter < existingGroup.counter
  ) {
    return 'This invite would roll the group back to an older counter.'
  }

  return null
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
  if (!settings.pinEnabled || settings.autoLockMinutes <= 0 || !hasPinSalt()) return

  _autoLockTimer = setTimeout(async () => {
    await flushPersist()
    destroyPersonas()
    clearPinKey()
    clearSensitiveState()
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
      // Derive persona keys from identity — restore from vault or init fresh
      {
        const { identity, personas: vaultPersonas } = getState()
        if (identity?.privkey) {
          if (Object.keys(vaultPersonas).length > 0) {
            initPersonasFromTree(identity, vaultPersonas)
          } else {
            initPersonas(identity)
          }
        }
      }
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
      // Non-blocking: fetch kind 0 profiles for all personas
      fetchPersonaProfiles().catch(() => {})
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
        <div id="duress-alert-banner" hidden></div>
        <div id="members-container"></div>
        <div id="verify-container"></div>
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

    <div id="identities-view" style="display:none"></div>

    <footer class="app-footer" id="app-footer">
      <button class="app-footer__sync" id="footer-sync-btn">Sync Groups</button>
      <span class="app-footer__sep">&middot;</span>
      <span class="app-footer__version">CANARY v${__APP_VERSION__}</span>
    </footer>
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
  const identitiesView = document.getElementById('identities-view')

  if (groupsView) groupsView.hidden = view !== 'groups'
  if (callDemoView) callDemoView.hidden = view !== 'call-demo'
  if (identitiesView) identitiesView.style.display = view === 'identities' ? '' : 'none'

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
        cleanupBeacons()
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
  } else if (view === 'identities') {
    destroyCallSimulation()
    const identitiesContainer = document.getElementById('identities-view')
    if (identitiesContainer) renderIdentities(identitiesContainer)
  }
}

// ── Modal: create group ────────────────────────────────────────

function showCreateGroupModal(): void {
  const { identity, personas, activePersonaId } = getState()
  const knownName = identity?.displayName && identity.displayName !== 'You' ? identity.displayName : ''

  const personaList = Object.values(personas)
  const personaOptions = personaList.length > 0
    ? personaList.map(p => {
        const sel = p.id === activePersonaId ? ' selected' : ''
        return `<option value="${escapeHtml(p.id)}"${sel}>${escapeHtml(p.name)}</option>`
      }).join('')
    : '<option value="">—</option>'

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
    <label class="input-label" style="margin-top: 0.5rem;">
      <span>Persona</span>
      <select class="input" name="persona">${personaOptions}</select>
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
    const myName = knownName || (formData.get('myname') as string | null)?.trim() || ''
    const selectedPersona = (formData.get('persona') as string | null)?.trim() || ''
    const activePresetBtn = document.querySelector<HTMLButtonElement>('.segmented__btn.segmented__btn--active[data-preset]')
    const preset = (activePresetBtn?.dataset.preset ?? 'family') as 'family' | 'field-ops' | 'enterprise' | 'event'
    const groupId = createNewGroup(name, preset, identity?.pubkey, selectedPersona)
    if (myName && identity?.pubkey) {
      const group = getState().groups[groupId]
      if (group) {
        updateGroup(groupId, { memberNames: { ...group.memberNames, [identity.pubkey]: myName } })
      }
    }
    const newGroup = getState().groups[groupId]
    if (newGroup && groupMode(newGroup) === 'online' && allRelaysForGroup(newGroup).length > 0) {
      void ensureTransport(newGroup.readRelays ?? [], newGroup.writeRelays ?? [], groupId)
    }
    publishVaultNow()
    // Frictionless notification prompt after first group
    import('./push.js').then(({ shouldPromptForNotifications, shouldPromptAddToHomeScreen, isMacSafari, subscribeToPush, registerWithPushServer }) => {
      if (shouldPromptAddToHomeScreen()) {
        // iOS Safari outside PWA — push is impossible, guide user
        setTimeout(() => {
          showAddToHomeScreenPrompt()
        }, 1500)
        return
      }
      if (isMacSafari() && !('Notification' in window)) {
        console.info('[canary:push] Mac Safari without notification support — skipping prompt')
        return
      }
      if (!shouldPromptForNotifications()) return
      setTimeout(() => {
        showNotificationPrompt(async () => {
          try {
            const sub = await subscribeToPush()
            if (!sub) {
              console.warn('[canary:push] subscribeToPush returned null — permission denied or unavailable')
              return
            }
            const { hashGroupTag } = await import('canary-kit/sync')
            const { groups: g } = getState()
            const pushGroups = Object.values(g).map(gr => ({ tagHash: hashGroupTag(gr.id), livenessInterval: gr.livenessInterval }))
            await registerWithPushServer(sub, pushGroups)
            console.info('[canary:push] Registered with push server, groups:', pushGroups.length)
            showToast('Notifications enabled', 'success')
          } catch (err) {
            console.error('[canary:push] Registration failed:', err)
            showToast('Failed to enable notifications', 'error')
          }
        })
      }, 1500) // slight delay so the group creation toast shows first
    }).catch((err) => console.error('[canary:push] Import failed:', err))
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
  } else if (hash.startsWith('#inv/')) {
    const b64url = hash.slice(5)
    window.location.hash = ''
    showBinaryJoinScreen(b64url)
  } else if (hash.startsWith('#j/')) {
    const inviteId = hash.slice(3)
    window.location.hash = ''
    if (/^[0-9a-f]{32}$/.test(inviteId)) {
      showRelayJoinScreen(inviteId)
    } else {
      showToast('Invalid invite link.', 'error')
    }
  } else if (hash.startsWith('#remote/')) {
    // Token is base64url-encoded (URL-safe, no percent-encoding needed).
    // Also try decodeURIComponent for backwards compat with older percent-encoded links.
    let tokenPayload = hash.slice(8)
    try {
      tokenPayload = decodeURIComponent(tokenPayload)
    } catch {
      // Already decoded or base64url — use as-is
    }
    window.location.hash = ''
    showRemoteJoinScreen(tokenPayload)
  }
}

// ── Binary QR join screen (joiner side) ─────────────────────────

function showBinaryJoinScreen(b64url: string): void {
  try {
    const bytes = base64urlToBytes(b64url)
    const invite = unpackInvite(bytes)

    const { identity } = getState()
    if (!identity?.pubkey) {
      showToast('No local identity — create or import one first.', 'error')
      return
    }

    let dialog = document.getElementById('binary-join-modal') as HTMLDialogElement | null
    if (!dialog) {
      dialog = document.createElement('dialog')
      dialog.id = 'binary-join-modal'
      dialog.className = 'modal'
      document.body.appendChild(dialog)
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog!.close()
      })
    }

    const d = dialog
    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">Join ${escapeHtml(invite.groupName)}</h2>
        <p class="invite-hint">Invited by <code>${escapeHtml(invite.inviterPubkey.slice(0, 8))}\u2026</code></p>
        <p class="invite-hint">Ask the admin to read you the 3 confirmation words.</p>

        <label class="input-label">Confirmation words
          <input class="input" id="binary-join-confirm" type="text" placeholder="e.g. apple river castle" autocomplete="off">
        </label>
        <p class="invite-hint" id="binary-join-error" style="color: var(--duress); display: none;"></p>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="binary-join-cancel" type="button">Cancel</button>
          <button class="btn btn--primary" id="binary-join-accept" type="button">Join</button>
        </div>
      </div>
    `

    d.querySelector<HTMLButtonElement>('#binary-join-cancel')?.addEventListener('click', () => d.close())
    d.querySelector<HTMLButtonElement>('#binary-join-accept')?.addEventListener('click', () => {
      const confirmInput = d.querySelector<HTMLInputElement>('#binary-join-confirm')
      const errorEl = d.querySelector<HTMLElement>('#binary-join-error')
      const words = confirmInput?.value.trim() ?? ''

      if (!words) {
        if (errorEl) { errorEl.textContent = 'Please enter the confirmation words.'; errorEl.style.display = '' }
        return
      }

      try {
        // acceptInvite validates confirmation code, signature, and expiry.
        // Re-encode to base64 since acceptInvite expects that format.
        const payload = jsonToBase64(invite)
        const validated = acceptInvite(payload, words)

        // Replay protection — reject already-consumed nonces
        if (isInviteConsumed(validated.groupId, validated.nonce)) {
          throw new Error('This invite has already been used.')
        }

        // Build AppGroup from the validated invite
        const id = validated.groupId
        const { groups: existingGroups } = getState()
        const staleError = staleGroupStateError(existingGroups[id], {
          epoch: validated.epoch,
          counter: validated.counter,
          latestInviteIssuedAt: validated.issuedAt,
        })
        if (staleError) {
          throw new Error(staleError)
        }
        const members = new Set(validated.members)
        members.add(identity!.pubkey)

        const settings = getState().settings
        const writeRelays = validated.relays.length > 0
          ? validated.relays
          : (settings.defaultWriteRelays?.length ? [...settings.defaultWriteRelays] : [DEFAULT_WRITE_RELAY])
        const readRelays = Array.from(new Set([
          ...(settings.defaultReadRelays?.length ? settings.defaultReadRelays : WELL_KNOWN_READ_RELAYS),
          ...writeRelays,
        ]))
        const hasRelays = writeRelays.length > 0

        const appGroup = {
          id,
          name: validated.groupName,
          seed: validated.seed,
          members: Array.from(members),
          memberNames: validated.memberNames ?? {},
          nostrEnabled: hasRelays,
          relays: validated.relays,
          readRelays,
          writeRelays,
          wordlist: validated.wordlist,
          wordCount: validated.wordCount,
          counter: validated.counter,
          usageOffset: validated.usageOffset,
          rotationInterval: validated.rotationInterval,
          encodingFormat: validated.encodingFormat,
          usedInvites: [validated.nonce],
          latestInviteIssuedAt: validated.issuedAt,
          beaconInterval: validated.beaconInterval,
          beaconPrecision: validated.beaconPrecision,
          duressMode: 'immediate' as const,
          livenessInterval: validated.rotationInterval,
          livenessCheckins: {} as Record<string, number>,
          tolerance: validated.tolerance,
          personaId: getState().activePersonaId ?? '',
          createdAt: Math.floor(Date.now() / 1000),
          admins: [...validated.admins],
          epoch: validated.epoch,
          consumedOps: [] as string[],
        }

        const groups = { ...existingGroups, [id]: appGroup }
        update({ groups, activeGroupId: id })
        consumeInvite(id, validated.nonce)
        flushPersist()
        publishVaultNow()

        // Boot relay sync if available
        if (hasRelays && identity) {
          void ensureTransport(readRelays, writeRelays, id).then(() => {
            broadcastAction(id, {
              type: 'member-join',
              pubkey: identity!.pubkey,
              displayName: identity!.displayName && identity!.displayName !== 'You' ? identity!.displayName : undefined,
              timestamp: Math.floor(Date.now() / 1000),
              epoch: validated.epoch,
              opId: crypto.randomUUID(),
            })
          })
        }

        d.close()
        showToast(`Joined ${validated.groupName}`, 'success')
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err instanceof Error ? err.message : 'Failed to join group.'
          errorEl.style.display = ''
        }
      }
    })

    d.showModal()
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Invalid QR invite.', 'error')
  }
}

// ── Remote join screen (joiner side) ────────────────────────────

async function acceptWelcomeEnvelope(
  envelope: string,
  token: { adminPubkey: string; inviteId: string },
  dialog: HTMLDialogElement,
): Promise<void> {
  const { identity } = getState()
  if (!identity?.pubkey) return

  const welcome = identity.privkey
    ? decryptWelcomeEnvelope({
        envelope,
        joinerPrivkey: identity.privkey,
        adminPubkey: token.adminPubkey,
        expectedInviteId: token.inviteId,
      })
    : isExternalSignerIdentity(identity)
      ? await (async () => {
          const plaintext = await decryptWithSignet(identity, token.adminPubkey, envelope, { interactive: true })
          return decodeWelcomePayload(plaintext, token.inviteId)
        })()
      : null

  if (!welcome) {
    throw new Error('No local key or Signet signer — cannot decrypt welcome message.')
  }

  // Build AppGroup from welcome payload
  const id = welcome.groupId
  const { groups: existingGroups } = getState()
  const staleError = staleGroupStateError(existingGroups[id], {
    epoch: welcome.epoch,
    counter: welcome.counter,
  })
  if (staleError) {
    throw new Error(staleError)
  }
  const members = new Set<string>(welcome.members)
  members.add(identity.pubkey)
  const memberNames: Record<string, string> = { ...(welcome.memberNames ?? {}) }
  if (identity.displayName && identity.displayName !== 'You') {
    memberNames[identity.pubkey] = identity.displayName
  }

  const legacyRelays = [...(welcome.relays ?? [])]
  // Incoming relays from the admin are treated as write relays.
  // Add well-known public relays for reading.
  const writeRelays = legacyRelays.length > 0 ? legacyRelays : [DEFAULT_WRITE_RELAY]
  const readRelays = Array.from(new Set([...WELL_KNOWN_READ_RELAYS, ...writeRelays]))
  const hasRelays = writeRelays.length > 0

  const appGroup = {
    id,
    name: welcome.groupName,
    seed: welcome.seed,
    members: Array.from(members),
    memberNames,
    nostrEnabled: hasRelays,
    relays: legacyRelays,
    readRelays,
    writeRelays,
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
    personaId: getState().activePersonaId ?? '',
    createdAt: Math.floor(Date.now() / 1000),
    admins: [...welcome.admins],
    epoch: welcome.epoch,
    consumedOps: [] as string[],
  }

  const groups = { ...existingGroups, [id]: appGroup }
  update({ groups, activeGroupId: id })
  flushPersist()
  publishVaultNow()

  // Boot relay sync and announce
  if (hasRelays && identity) {
    void ensureTransport(readRelays, writeRelays, id).then(() => {
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

// ── Relay-based online join screen (joiner side, #j/<inviteId>) ──

function showRelayJoinScreen(inviteId: string): void {
  const { identity, settings } = getState()
  if (!identity?.pubkey || !canUseIdentitySigner(identity)) {
    showToast('No local identity — create or import one first.', 'error')
    return
  }

  const readRelays = Array.from(new Set([...WELL_KNOWN_READ_RELAYS, ...(settings.defaultWriteRelays ?? [])]))
  const writeRelays = settings.defaultWriteRelays ?? [DEFAULT_WRITE_RELAY]

  let dialog = document.getElementById('relay-join-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'relay-join-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog!.close()
    })
  }

  const d = dialog
  d.innerHTML = `
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `

  let cleanupFetch = () => {}
  let cleanupJoin = () => {}

  d.querySelector<HTMLButtonElement>('#relay-join-cancel')?.addEventListener('click', () => {
    cleanupFetch()
    cleanupJoin()
    d.close()
  })

  d.showModal()

  // Fetch the invite token from relay
  void ensureTransport(readRelays, writeRelays).then(() => {
    cleanupFetch = fetchInviteToken({
      inviteId,
      readRelays,
      onToken(token) {
        try {
          assertRemoteInviteToken(token)
        } catch (err) {
          const statusEl = d.querySelector('#relay-join-status')
          if (statusEl) {
            statusEl.textContent = err instanceof Error ? err.message : 'Invalid invite token.'
            ;(statusEl as HTMLElement).style.color = 'var(--duress)'
          }
          return
        }

        // Token found — proceed with relay handshake
        const tokenRelays = token.relays?.length ? token.relays : writeRelays
        const joinWriteRelays = tokenRelays
        const joinReadRelays = Array.from(new Set([...WELL_KNOWN_READ_RELAYS, ...tokenRelays]))

        const statusEl = d.querySelector('#relay-join-status')
        if (statusEl) statusEl.textContent = `Joining ${token.groupName}...`

        void ensureTransport(joinReadRelays, joinWriteRelays).then(() => {
          cleanupJoin = sendJoinRequest({
            inviteId: token.inviteId,
            adminPubkey: token.adminPubkey,
            readRelays: joinReadRelays,
            writeRelays: joinWriteRelays,
            async onWelcome(envelope) {
              try {
                await acceptWelcomeEnvelope(envelope, token, d)
              } catch {
                if (statusEl) {
                  statusEl.textContent = 'Failed to join — welcome message could not be decrypted.'
                  ;(statusEl as HTMLElement).style.color = 'var(--duress)'
                }
              }
            },
            onError(msg) {
              if (statusEl) {
                statusEl.textContent = msg
                ;(statusEl as HTMLElement).style.color = 'var(--duress)'
              }
            },
          })
        })
      },
      onError(msg) {
        const statusEl = d.querySelector('#relay-join-status')
        if (statusEl) {
          statusEl.textContent = msg
          ;(statusEl as HTMLElement).style.color = 'var(--duress)'
        }
      },
    })
  })
}

function showRemoteJoinScreen(tokenPayload: string): void {
  try {
    let parsed: unknown
    try {
      // Try base64url first (new format), fall back to standard base64 (legacy)
      parsed = base64urlToJson(tokenPayload)
    } catch {
      try {
        parsed = base64ToJson(tokenPayload)
      } catch {
        throw new Error('Invalid invite — could not decode token.')
      }
    }

    assertRemoteInviteToken(parsed)

    const token = parsed
    const { identity, settings } = getState()
    if (!identity?.pubkey || !canUseIdentitySigner(identity)) {
      showToast('No local identity — create or import one first.', 'error')
      return
    }

    const shortAdmin = `${token.adminPubkey.slice(0, 8)}\u2026${token.adminPubkey.slice(-4)}`
    // Use relays from the token (admin's relays) as write relays so both sides publish to the same relay.
    // Add well-known relays for reading. Fall back to local defaults if the token has no relays (legacy).
    const tokenRelays = token.relays?.length ? token.relays : settings.defaultWriteRelays
    const writeRelays = tokenRelays
    const readRelays = Array.from(new Set([...WELL_KNOWN_READ_RELAYS, ...tokenRelays]))
    const relays = Array.from(new Set([...readRelays, ...writeRelays]))

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
      void ensureTransport(readRelays, writeRelays).then(() => {
        const statusEl = d.querySelector<HTMLElement>('#remote-join-relay-status')
        if (statusEl) statusEl.textContent = 'Waiting for admin to send group key...'

        cleanupRelay = sendJoinRequest({
          inviteId: token.inviteId,
          adminPubkey: token.adminPubkey,
          readRelays,
          writeRelays,
          async onWelcome(envelope) {
            try {
              await acceptWelcomeEnvelope(envelope, token, d)
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
        await acceptWelcomeEnvelope(envelope, token, d)
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

  // ── Identity view events ──────────────────────────────────────

  document.addEventListener('canary:shamir-split', () => {
    import('./components/shamir-modal.js').then(({ showShamirModal }) => {
      showShamirModal()
    })
  })

  document.addEventListener('canary:verify-proof', () => {
    import('./components/linkage-proof.js').then(({ showVerifyProofModal }) => {
      showVerifyProofModal()
    })
  })

  document.addEventListener('canary:open-recovery-root-modal', () => {
    import('./components/recovery-root-modal.js').then(({ showRecoveryRootModal }) => {
      showRecoveryRootModal()
    })
  })

  document.addEventListener('canary:create-recovery-root', async (evt) => {
    const name = ((evt as CustomEvent<{ name?: string }>).detail?.name ?? '').trim()
    if (!name) {
      alert('Please enter a name for the new mnemonic-backed root.')
      return
    }

    const { generateMnemonic } = await import('@scure/bip39')
    const { wordlist } = await import('@scure/bip39/wordlists/english.js')
    const { restoreFromMnemonic } = await import('./mnemonic.js')
    const mnemonic = generateMnemonic(wordlist)
    const { root, defaultPersona } = restoreFromMnemonic(mnemonic)
    const privkey = bytesToHex(defaultPersona.identity.privateKey)
    const pubkey = bytesToHex(defaultPersona.identity.publicKey)
    defaultPersona.identity.privateKey.fill(0)
    root.destroy()

    teardownSync()
    update({
      identity: { pubkey, privkey, mnemonic, signerType: 'local', displayName: name },
      groups: {},
      personas: {},
      activeGroupId: null,
      activePersonaId: null,
    })
    document.dispatchEvent(new CustomEvent('canary:resync'))
    render()
    showRecoveryPhraseModal(mnemonic)
  })

  document.addEventListener('canary:restore-recovery-root', async (evt) => {
    const phrase = ((evt as CustomEvent<{ mnemonic?: string }>).detail?.mnemonic ?? '').trim().replace(/\s+/g, ' ')
    if (!phrase) {
      alert('Please paste a recovery phrase first.')
      return
    }

    const words = phrase.split(/\s+/)
    if (words.length !== 12) {
      alert('Recovery phrase must be exactly 12 words.')
      return
    }

    try {
      const { validateMnemonic, restoreFromMnemonic } = await import('./mnemonic.js')
      const { wordlist } = await import('@scure/bip39/wordlists/english.js')
      if (!validateMnemonic(phrase, wordlist)) {
        alert('Invalid recovery phrase. Please check your words and try again.')
        return
      }

      const { root, defaultPersona } = restoreFromMnemonic(phrase)
      const privkey = bytesToHex(defaultPersona.identity.privateKey)
      const pubkey = bytesToHex(defaultPersona.identity.publicKey)
      defaultPersona.identity.privateKey.fill(0)
      root.destroy()

      teardownSync()
      update({
        identity: { pubkey, privkey, mnemonic: phrase, signerType: 'local', displayName: 'You' },
        groups: {},
        personas: {},
        activeGroupId: null,
        activePersonaId: null,
      })
      document.dispatchEvent(new CustomEvent('canary:resync'))
      render()
    } catch {
      alert('Invalid recovery phrase.')
    }
  })

  document.addEventListener('canary:export-persona', (evt) => {
    const { personaId } = (evt as CustomEvent<{ personaId: string }>).detail
    const { personas } = getState()
    const found = findById(personas, personaId)
    if (!found) return
    import('./components/export-modal.js').then(({ showExportModal }) => {
      showExportModal(found.persona)
    })
  })

  document.addEventListener('canary:prove-ownership', (evt) => {
    const { personaId } = (evt as CustomEvent<{ personaId: string }>).detail
    import('./components/linkage-proof.js').then(({ showProveOwnershipModal }) => {
      showProveOwnershipModal(personaId)
    })
  })

  document.addEventListener('canary:archive-persona', (evt) => {
    const { personaId } = (evt as CustomEvent<{ personaId: string }>).detail
    const { personas } = getState()
    const found = findById(personas, personaId)
    if (!found) return
    // Deep update: set archived flag in the persona tree
    function deepArchive(tree: Record<string, any>, id: string): Record<string, any> {
      const result: Record<string, any> = {}
      for (const [k, p] of Object.entries(tree)) {
        if (p.id === id) {
          result[k] = { ...p, archived: true }
        } else if (p.children && Object.keys(p.children).length > 0) {
          result[k] = { ...p, children: deepArchive(p.children, id) }
        } else {
          result[k] = p
        }
      }
      return result
    }
    update({ personas: deepArchive(personas, personaId) as any })
    showToast(`Archived "${found.persona.name}"`, 'success')
  })

  document.addEventListener('canary:rotate-persona', (evt) => {
    const { personaId } = (evt as CustomEvent<{ personaId: string }>).detail
    import('./persona.js').then(({ rotatePersona }) => {
      const { personas } = getState()
      const found = findById(personas, personaId)
      if (!found) return
      const rotated = rotatePersona(personaId, found.persona.index)
      // Deep update: replace persona in tree
      // For now, only handle top-level
      if (personas[personaId]) {
        update({ personas: { ...personas, [personaId]: rotated } })
      }
      showToast(`Rotated "${found.persona.name}" to index ${rotated.index}`, 'success')
    })
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
    destroyPersonas()
    clearPinKey()
    showLockScreen()
  })

  // Handle incoming sync messages for beacon/duress side effects.
  document.addEventListener('canary:sync-message', (evt) => {
    const { groupId, message, sender } = (evt as CustomEvent).detail
    const { activeGroupId } = getState()
    if (message.type === 'beacon') {
      // Only process beacons for the currently active group
      if (groupId !== activeGroupId) return
      if (import.meta.env.DEV) console.info(`[canary] Beacon from ${sender.slice(0, 8)}…`)
      handleIncomingBeacon(sender, message.lat, message.lon, message.accuracy ?? 20000, message.timestamp)
    } else if (message.type === 'duress-alert') {
      // Use subject (person under duress) if available, fall back to sender
      const duressPubkey = message.subject || sender
      // Never show duress overlay on the subject's own device — an attacker
      // watching their screen must not learn that duress was detected.
      const { identity: localIdentity } = getState()
      if (localIdentity?.pubkey === duressPubkey) return
      showDuressAlert(duressPubkey, groupId, message.lat != null ? { lat: message.lat, lon: message.lon } : undefined, message.timestamp)
    } else if (message.type === 'duress-clear') {
      document.dispatchEvent(new CustomEvent('canary:duress-clear', {
        detail: { subject: message.subject, clearedBy: sender, groupId },
      }))
    }
  })

  // Re-sync when identity changes (e.g. nsec login from header popover)
  document.addEventListener('canary:resync', () => void bootSync())

  // Publish a persona's kind 0 profile to relays (fired from settings panel)
  document.addEventListener('canary:publish-persona-profile', async (e) => {
    const { personaId } = (e as CustomEvent).detail
    const persona = getState().personas[personaId]
    if (!persona) return
    await publishPersonaProfile(persona)
  })

  // Immediate vault publish requested (e.g. after word rotation)
  document.addEventListener('canary:vault-publish-now', () => publishVaultNow())

  // Manual vault sync triggered from sidebar
  document.addEventListener('canary:sync-vault', () => void manualVaultSync())

  // On background: flush vault to relay so other devices can pick up changes.
  // On foreground: reconnect relay + fetch vault to catch up on any state
  // changes from other devices while this tab was suspended.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Mobile browsers kill tabs without beforeunload — flush local storage
      // synchronously (guaranteed) and publish vault to relay (best-effort).
      flushPersist()
      publishVaultNow()
      return
    }
    console.info('[canary:boot] App foregrounded — reconnecting and syncing vault')
    unsubscribeFromVault()
    teardownSync()
    import('./nostr/connect.js').then(({ disconnectRelays }) => {
      disconnectRelays()
      void bootSync()
    })
  })
}

// ── Local identity ────────────────────────────────────────────
// Always generates a local keypair. Signet is opt-in via the login/account UI.

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
    update({ identity: preserveMnemonic(newIdentity, identity) })
  }

  // Boot-time auto-insertion of local identity into groups was removed.
  // It violated the authority model (I1) — only admins may add members.
  // Groups missing the local identity require a fresh invite to rejoin.
}

// ── Live vault watcher ─────────────────────────────────────────

function startLiveVaultSync(): void {
  const { identity } = getState()
  if (!identity?.pubkey) return

  const decrypt = identity.privkey
    ? async (ct: string) => {
        const { decryptVault } = await import('./nostr/vault.js')
        return decryptVault(ct, identity.privkey!, identity.pubkey)
      }
    : isExternalSignerIdentity(identity)
      ? async (ct: string) => {
          try {
            return await decryptWithSignet(identity, identity.pubkey, ct, { interactive: false })
          } catch { return null }
        }
      : null

  if (!decrypt) return

  subscribeToVault(identity.pubkey, decrypt, (vaultGroups, _count) => {
    const { groups: localGroups } = getState()
    const merged = mergeVaultGroups(localGroups, vaultGroups, getState().deletedGroupIds)
    const newCount = Object.keys(merged).length - Object.keys(localGroups).length
    const changed = newCount > 0 || Object.entries(merged).some(([id, g]) => {
      const local = localGroups[id]
      if (!local) return true
      return g.epoch !== local.epoch || g.counter !== local.counter
    })
    if (changed) {
      update({ groups: merged })
      flushPersist()
      if (newCount > 0) {
        showToast(`${newCount} new group(s) synced from another device`, 'success')
      } else {
        showToast('Groups updated from another device', 'success', 2000)
      }
    }
  })
}

// ── Relay sync boot ────────────────────────────────────────────

async function bootSync(): Promise<void> {
  const { groups, identity, settings } = getState()

  const groupCount = Object.keys(groups).length
  const hasPrivkey = !!identity?.privkey
  if (import.meta.env.DEV) console.warn('[canary:boot] bootSync — groups:', groupCount, 'identity:', identity?.pubkey?.slice(0, 8) ?? 'none', 'privkey:', hasPrivkey ? 'yes' : 'NO')

  // Collect unique read and write relays from all groups + defaults
  const rawRead: string[] = []
  const rawWrite: string[] = []
  for (const group of Object.values(groups)) {
    if (import.meta.env.DEV) console.warn('[canary:boot]   group', group.id.slice(0, 8), 'mode:', groupMode(group), 'read:', JSON.stringify(group.readRelays), 'write:', JSON.stringify(group.writeRelays), 'members:', group.members.length)
    rawRead.push(...(group.readRelays ?? []))
    rawWrite.push(...(group.writeRelays ?? []))
    // Migration fallback: include legacy relays
    rawRead.push(...(group.relays ?? []))
    rawWrite.push(...(group.relays ?? []))
  }
  // Include default relays so profile fetch works even with no groups
  rawRead.push(...(settings.defaultReadRelays ?? settings.defaultRelays))
  rawWrite.push(...(settings.defaultWriteRelays ?? settings.defaultRelays))
  const allReadRelays = dedupeRelays(rawRead)
  const allWriteRelays = dedupeRelays(rawWrite)
  const totalRelays = dedupeRelays([...allReadRelays, ...allWriteRelays]).length
  if (totalRelays === 0) {
    console.warn('[canary:boot] No relays found — sync disabled')
    if (groupCount > 0) {
      showToast(`Sync disabled — ${groupCount} group(s), no relays configured`, 'warning', 5000)
    }
    return
  }

  const hasExternalSigner = isExternalSignerIdentity(identity)
  if (!hasPrivkey && !hasExternalSigner) {
    console.warn('[canary:boot] No privkey and no Signet signer — sync disabled')
    showToast('Sync disabled — no private key', 'warning', 5000)
    return
  }

  console.warn('[canary:boot] Read relays:', allReadRelays, 'Write relays:', allWriteRelays)

  if (hasPrivkey) {
    // Full sync: transport + subscriptions + liveness heartbeat
    await ensureTransport(allReadRelays, allWriteRelays)

    // Wait for relay connections before vault fetch — without this,
    // subscribeMany silently returns no results because WebSockets aren't open.
    const { waitForConnection } = await import('./nostr/connect.js')
    await waitForConnection()
    console.info('[canary:vault] Relay connections ready, fetching vault...')

    // Vault sync: always fetch and merge — catches up on state changes from
    // other devices (counter-advance, member changes, etc.)
    try {
      const vaultData = await fetchVault(identity!.privkey!, identity!.pubkey)
      const vaultGroups = vaultData?.groups
      console.info('[canary:vault] Vault fetch result:', vaultGroups ? `${Object.keys(vaultGroups).length} group(s)` : 'null')
      if (vaultGroups && Object.keys(vaultGroups).length > 0) {
        const { groups: localGroups } = getState()
        const merged = mergeVaultGroups(localGroups, vaultGroups, getState().deletedGroupIds)
        // Check if anything actually changed
        const localKeys = Object.keys(localGroups).sort().join(',')
        const mergedKeys = Object.keys(merged).sort().join(',')
        const stateChanged = localKeys !== mergedKeys || Object.entries(merged).some(([id, g]) => {
          const local = localGroups[id]
          if (!local) return true
          return g.epoch !== local.epoch || g.counter !== local.counter || g.usageOffset !== local.usageOffset || g.members.length !== local.members.length
        })
        if (stateChanged) {
          update({ groups: merged })
          const newGroupCount = Object.keys(merged).length - Object.keys(localGroups).length
          if (newGroupCount > 0) {
            showToast(`Restored ${newGroupCount} group(s) from vault`, 'success')
          } else {
            showToast('Synced from vault', 'success', 1500)
          }
        }
      }
      // Merge vault persona metadata onto derived personas
      if (vaultData?.personas && Object.keys(vaultData.personas).length > 0) {
        const { personas: currentPersonas } = getState()
        const updated = { ...currentPersonas }
        for (const [id, vaultP] of Object.entries(vaultData.personas)) {
          if (updated[id]) {
            updated[id] = { ...updated[id], ...vaultP, npub: updated[id].npub }
          } else {
            updated[id] = vaultP
          }
        }
        update({ personas: updated })
      }
    } catch (err) {
      console.warn('[canary:vault] Vault fetch failed:', err)
    }

    subscribeToAllGroups()
    startLiveVaultSync()
    showToast(`Syncing via ${totalRelays} relay(s)`, 'success', 2000)

    // Auto-register for push notifications if previously granted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      import('./push.js').then(async ({ getExistingSubscription, registerWithPushServer }) => {
        const sub = await getExistingSubscription()
        if (sub) {
          const { hashGroupTag } = await import('canary-kit/sync')
          const pushGroups = Object.values(groups).map(g => ({
            tagHash: hashGroupTag(g.id),
            livenessInterval: g.livenessInterval,
          }))
          await registerWithPushServer(sub, pushGroups)
          console.info('[canary:push] Re-registered with push server, groups:', pushGroups.length)
        } else {
          console.warn('[canary:push] Permission granted but no existing subscription found')
        }
      }).catch((err) => console.error('[canary:push] Re-registration failed:', err))
    }
  } else if (hasExternalSigner) {
    // Signet: relay connection + vault sync via external signer
    const { connectRelays, waitForConnection } = await import('./nostr/connect.js')
    connectRelays(allReadRelays, allWriteRelays)

    // Vault sync via Signet NIP-44
    try {
      await waitForConnection()
      console.info('[canary:vault] Signet vault sync starting...')
      const vaultData = await fetchVaultNip07(identity.pubkey, identity, { interactive: false })
      const vaultGroups = vaultData?.groups
      console.info('[canary:vault] Signet vault result:', vaultGroups ? `${Object.keys(vaultGroups).length} group(s)` : 'null')
      if (vaultGroups && Object.keys(vaultGroups).length > 0) {
        const { groups: localGroups } = getState()
        const merged = mergeVaultGroups(localGroups, vaultGroups, getState().deletedGroupIds)
        const stateChanged = Object.keys(merged).length !== Object.keys(localGroups).length ||
          Object.entries(merged).some(([id, g]) => {
            const local = localGroups[id]
            if (!local) return true
            return g.epoch !== local.epoch || g.counter !== local.counter
          })
        if (stateChanged) {
          update({ groups: merged })
          const newGroupCount = Object.keys(merged).length - Object.keys(localGroups).length
          if (newGroupCount > 0) {
            showToast(`Restored ${newGroupCount} group(s) from vault`, 'success')
          } else {
            showToast('Synced from vault', 'success', 1500)
          }
        }
      }
      // Merge vault persona metadata (external signers have no local derivation keys).
      if (vaultData?.personas && Object.keys(vaultData.personas).length > 0) {
        const { personas: currentPersonas } = getState()
        const updated = { ...currentPersonas }
        for (const [id, vaultP] of Object.entries(vaultData.personas)) {
          if (updated[id]) {
            updated[id] = { ...updated[id], ...vaultP, npub: updated[id].npub }
          } else {
            updated[id] = vaultP
          }
        }
        update({ personas: updated })
      }
    } catch (err) {
      console.warn('[canary:vault] Signet vault sync failed:', err)
    }

    startLiveVaultSync()
    showToast(`Connected to ${totalRelays} relay(s)`, 'success', 2000)
  } else {
    // No privkey and no Signet signer — minimal relay connection
    const { connectRelays } = await import('./nostr/connect.js')
    connectRelays(allReadRelays, allWriteRelays)
    showToast(`Connected to ${totalRelays} relay(s)`, 'success', 2000)
  }

  // Fetch the user's own kind 0 profile (name + avatar)
  const { fetchOwnProfile } = await import('./nostr/profiles.js')
  fetchOwnProfile()

  // Re-render now that pool is connected — fetchProfiles needs a live pool
  scheduleRender()

  if (hasPrivkey) {
    // Start heartbeat AFTER groups are registered (not inside ensureTransport)
    const { startLivenessHeartbeat } = await import('./components/liveness.js')
    startLivenessHeartbeat()
  }
}

// ── Login screen ──────────────────────────────────────────────

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function showRecoveryPhraseModal(mnemonic: string): void {
  const words = mnemonic.split(' ')

  let dialog = document.getElementById('recovery-phrase-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'recovery-phrase-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
  }

  const d = dialog
  d.textContent = ''

  const form = document.createElement('div')
  form.className = 'modal__form'
  form.style.maxWidth = '420px'

  const title = document.createElement('h2')
  title.className = 'modal__title'
  title.textContent = 'Back up your recovery phrase'
  form.appendChild(title)

  const hint = document.createElement('p')
  hint.className = 'invite-hint'
  hint.textContent = "Write these words down in order. They're the only way to recover your account."
  form.appendChild(hint)

  const grid = document.createElement('div')
  grid.className = 'recovery-grid'
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;'

  words.forEach((word, i) => {
    const cell = document.createElement('div')
    cell.style.cssText = 'border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;'
    const num = document.createElement('span')
    num.style.cssText = 'color:var(--text-muted);font-size:0.7rem;'
    num.textContent = `${i + 1}. `
    const w = document.createElement('span')
    w.style.fontWeight = '500'
    w.textContent = word
    cell.append(num, w)
    grid.appendChild(cell)
  })
  form.appendChild(grid)

  const warning = document.createElement('p')
  warning.className = 'invite-hint'
  warning.style.cssText = 'color:var(--duress);font-weight:500;'
  warning.textContent = 'Do not share these words with anyone.'
  form.appendChild(warning)

  const actions = document.createElement('div')
  actions.className = 'modal__actions'
  actions.style.gap = '0.5rem'

  const copyBtn = document.createElement('button')
  copyBtn.id = 'recovery-phrase-copy'
  copyBtn.className = 'btn btn--primary'
  copyBtn.type = 'button'
  copyBtn.textContent = 'Copy words'
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(mnemonic)
      copyBtn.textContent = 'Copied!'
      setTimeout(() => { copyBtn.textContent = 'Copy words' }, 2000)
      setTimeout(() => { navigator.clipboard.writeText('').catch(() => {}) }, 30_000)
    } catch { /* clipboard may be blocked */ }
  })

  const skipBtn = document.createElement('button')
  skipBtn.id = 'recovery-phrase-skip'
  skipBtn.className = 'btn'
  skipBtn.type = 'button'
  skipBtn.textContent = 'Skip for now'
  skipBtn.addEventListener('click', () => d.close())

  actions.append(copyBtn, skipBtn)
  form.appendChild(actions)
  d.appendChild(form)

  d.showModal()
}

function showLoginScreen(): void {
  const app = document.getElementById('app')!
  const inviteContext = loginInviteContext()
  wireLoginHashRefresh()

  app.innerHTML = `
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">${inviteContext ? 'Secure group invitation' : 'Deepfake-proof identity verification'}</p>

      <div class="login-panel">
        ${inviteContext ? `
          <section class="login-invite">
            <p class="login-invite__label">${escapeHtml(inviteContext.label)}</p>
            <p class="login-invite__title">${escapeHtml(inviteContext.title)}</p>
            <p class="settings-hint">${escapeHtml(inviteContext.hint)}</p>
          </section>
        ` : ''}

        <div class="login-options">
          <section class="login-card login-card--featured">
            <div>
              <p class="input-label__text">${inviteContext ? 'Join with Nostr' : 'Connect with Nostr'}</p>
              <p class="settings-hint">${inviteContext ? 'Use Signet to keep your key in your signer while CANARY joins the group.' : 'Sync groups across devices via relays.'}</p>
            </div>
            <button class="btn btn--primary login-card__action" id="login-signet" type="button">${escapeHtml(inviteContext?.signetButton ?? 'Sign in with Signet')}</button>
          </section>

          <section class="login-card">
            <div>
              <p class="input-label__text">Quick Start</p>
              <p class="settings-hint">${escapeHtml(inviteContext?.quickStartHint ?? 'No Nostr account needed. Enter your name to get started.')}</p>
            </div>
            <form id="offline-form" class="login-inline-form" autocomplete="off">
              <input class="input login-inline-form__input" type="text" id="offline-name" placeholder="Enter your name" required />
              <button class="btn btn--primary" type="submit">Start</button>
            </form>
          </section>
        </div>

        <details class="login-card login-details">
          <summary class="login-details__summary">Recover Account</summary>
          <div class="login-details__body">
            <div class="login-tabs">
              <button id="tab-recovery-phrase" type="button" class="btn btn--ghost btn--sm login-tabs__btn login-tabs__btn--active">Recovery Phrase</button>
              <button id="tab-shamir-shares" type="button" class="btn btn--ghost btn--sm login-tabs__btn">Shamir Shares</button>
            </div>

            <div id="panel-recovery-phrase">
              <p class="settings-hint">Paste your 12-word recovery phrase to restore your account.</p>
              <form id="mnemonic-login-form" class="login-stack-form" autocomplete="off">
                <textarea class="input login-secret-input" id="login-mnemonic" placeholder="Enter your 12 recovery words..." rows="3"></textarea>
                <button class="btn btn--primary" type="submit">Recover account</button>
              </form>
            </div>

            <div id="panel-shamir-shares" style="display: none;">
              <p class="settings-hint">Paste Shamir shares one at a time to reconstruct your recovery phrase.</p>
              <div class="login-stack-form">
                <textarea class="input login-secret-input" id="shamir-share-input" placeholder="Paste a Shamir share (word list)..." rows="3"></textarea>
                <button class="btn btn--primary" id="shamir-add-share" type="button">Add share</button>
                <p class="settings-hint login-status-text" id="shamir-status"></p>
                <ul id="shamir-share-list" class="login-share-list"></ul>
                <button class="btn btn--primary" id="shamir-recover" type="button" disabled>Recover</button>
              </div>
            </div>
          </div>
        </details>

        <details class="login-card login-details">
          <summary class="login-details__summary">Relays</summary>
          <div class="login-details__body">
            <p class="settings-hint login-relay-label">Choose which relays CANARY reads from and writes to.</p>
            <ul id="login-relay-list" class="login-relay-list">
              ${renderLoginRelayRows()}
            </ul>
            <div class="login-relay-add">
              <input class="input login-relay-add__input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" />
              <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              <button class="btn btn--ghost btn--sm" id="login-relay-reset" type="button">Reset</button>
            </div>
            <p class="settings-hint login-status-text" id="login-relay-status"></p>
          </div>
        </details>

      </div>
    </div>
  `

  // Quick Start — generate key silently, just ask for a name
  // Quick Start — generate mnemonic, derive keypair, show backup
  app.querySelector<HTMLFormElement>('#offline-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = app.querySelector<HTMLInputElement>('#offline-name')
    const name = input?.value.trim()
    if (!name) {
      input?.focus()
      return
    }

    // Generate mnemonic and derive personal identity via nsec-tree
    const { generateMnemonic } = await import('@scure/bip39')
    const { wordlist } = await import('@scure/bip39/wordlists/english.js')
    const { restoreFromMnemonic } = await import('./mnemonic.js')
    const mnemonic = generateMnemonic(wordlist)
    const { root, defaultPersona } = restoreFromMnemonic(mnemonic)
    const privkey = Array.from(defaultPersona.identity.privateKey, b => b.toString(16).padStart(2, '0')).join('')
    const pubkey = Array.from(defaultPersona.identity.publicKey, b => b.toString(16).padStart(2, '0')).join('')
    root.destroy()

    update({
      identity: { pubkey, privkey, mnemonic, signerType: 'local', displayName: name },
    })

    await bootApp()

    // Publish kind 0 so other members can discover this user's name
    const { publishKind0 } = await import('./nostr/profiles.js')
    publishKind0(name, privkey)

    // Show recovery phrase backup modal
    showRecoveryPhraseModal(mnemonic)
  })

  // Recovery phrase form submit
  app.querySelector<HTMLFormElement>('#mnemonic-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const textarea = app.querySelector<HTMLTextAreaElement>('#login-mnemonic')
    const phrase = textarea?.value.trim()
    if (!phrase) return

    const words = phrase.split(/\s+/)
    if (words.length !== 12) {
      alert('Recovery phrase must be exactly 12 words.')
      return
    }

    try {
      const { validateMnemonic, restoreFromMnemonic } = await import('./mnemonic.js')
      const { wordlist } = await import('@scure/bip39/wordlists/english.js')
      if (!validateMnemonic(phrase, wordlist)) {
        alert('Invalid recovery phrase. Please check your words and try again.')
        return
      }

      const { root, defaultPersona } = restoreFromMnemonic(phrase)
      const privkey = Array.from(defaultPersona.identity.privateKey, b => b.toString(16).padStart(2, '0')).join('')
      const pubkey = Array.from(defaultPersona.identity.publicKey, b => b.toString(16).padStart(2, '0')).join('')
      root.destroy()
      update({
        identity: { pubkey, privkey, mnemonic: phrase, signerType: 'local', displayName: 'You' },
      })

      await bootApp()
    } catch {
      alert('Invalid recovery phrase.')
    }
  })

  // ── Recovery tab switching ───
  const tabPhrase = app.querySelector<HTMLButtonElement>('#tab-recovery-phrase')!
  const tabShamir = app.querySelector<HTMLButtonElement>('#tab-shamir-shares')!
  const panelPhrase = app.querySelector<HTMLDivElement>('#panel-recovery-phrase')!
  const panelShamir = app.querySelector<HTMLDivElement>('#panel-shamir-shares')!

  tabPhrase.addEventListener('click', () => {
    panelPhrase.style.display = ''
    panelShamir.style.display = 'none'
    tabPhrase.classList.add('login-tabs__btn--active')
    tabShamir.classList.remove('login-tabs__btn--active')
  })

  tabShamir.addEventListener('click', () => {
    panelPhrase.style.display = 'none'
    panelShamir.style.display = ''
    tabShamir.classList.add('login-tabs__btn--active')
    tabPhrase.classList.remove('login-tabs__btn--active')
  })

  // ── Shamir share recovery ───
  type CollectedShare = import('@forgesworn/shamir-words').ShamirShare
  const collectedShares: CollectedShare[] = []
  let shamirThreshold = 0

  function updateShamirUI(): void {
    const statusEl = app.querySelector<HTMLParagraphElement>('#shamir-status')!
    const listEl = app.querySelector<HTMLUListElement>('#shamir-share-list')!
    const recoverBtn = app.querySelector<HTMLButtonElement>('#shamir-recover')!

    listEl.textContent = ''
    for (let i = 0; i < collectedShares.length; i++) {
      const li = document.createElement('li')
      li.className = 'settings-hint'
      li.style.cssText = 'font-size: 0.75rem; padding: 0.125rem 0;'
      li.textContent = `Share ${i + 1} added`
      listEl.appendChild(li)
    }

    if (collectedShares.length === 0) {
      statusEl.textContent = ''
      recoverBtn.disabled = true
    } else if (collectedShares.length < shamirThreshold) {
      const remaining = shamirThreshold - collectedShares.length
      statusEl.textContent = `Share ${collectedShares.length} added. Need ${remaining} more.`
      recoverBtn.disabled = true
    } else {
      statusEl.textContent = 'Ready to recover!'
      recoverBtn.disabled = false
    }
  }

  app.querySelector<HTMLButtonElement>('#shamir-add-share')?.addEventListener('click', async () => {
    const textarea = app.querySelector<HTMLTextAreaElement>('#shamir-share-input')!
    const text = textarea.value.trim()
    if (!text) return

    try {
      const { wordsToShare } = await import('@forgesworn/shamir-words')
      const words = text.split(/\s+/)
      const share = wordsToShare(words)

      // Check for duplicate share ID
      if (collectedShares.some(s => s.id === share.id)) {
        alert(`Share ${share.id} has already been added.`)
        return
      }

      // Set or validate threshold
      if (collectedShares.length === 0) {
        shamirThreshold = share.threshold
      } else if (share.threshold !== shamirThreshold) {
        alert(`Threshold mismatch: expected ${shamirThreshold}, got ${share.threshold}. Shares must be from the same set.`)
        return
      }

      collectedShares.push(share)
      textarea.value = ''
      updateShamirUI()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Invalid share. Please check the words and try again.')
    }
  })

  app.querySelector<HTMLButtonElement>('#shamir-recover')?.addEventListener('click', async () => {
    if (collectedShares.length < shamirThreshold) return

    try {
      const { reconstructSecret } = await import('@forgesworn/shamir-words')
      const secretBytes = reconstructSecret(collectedShares, shamirThreshold)
      const phrase = new TextDecoder().decode(secretBytes)

      // Validate the reconstructed mnemonic
      const { validateMnemonic, restoreFromMnemonic } = await import('./mnemonic.js')
      const { wordlist } = await import('@scure/bip39/wordlists/english.js')
      if (!validateMnemonic(phrase, wordlist)) {
        alert('Reconstructed phrase is not a valid mnemonic. Please check your shares.')
        return
      }

      const { root, defaultPersona } = restoreFromMnemonic(phrase)
      const privkey = Array.from(defaultPersona.identity.privateKey, b => b.toString(16).padStart(2, '0')).join('')
      const pubkey = Array.from(defaultPersona.identity.publicKey, b => b.toString(16).padStart(2, '0')).join('')
      root.destroy()
      update({
        identity: { pubkey, privkey, mnemonic: phrase, signerType: 'local', displayName: 'You' },
      })

      await bootApp()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reconstruct secret from shares.')
    }
  })

  // Signet login
  app.querySelector('#login-signet')?.addEventListener('click', async () => {
    const diagnostics = wireSignetNostrConnectDiagnostics()
    try {
      const currentIdentity = getState().identity
      const signedIn = await signInWithSignet({
        theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
        displayNameFallback: currentIdentity?.displayName ?? 'You',
        onNostrConnectStatus: diagnostics.onStatus,
      })
      if (!signedIn) return
      update({ identity: preserveMnemonic(signedIn, currentIdentity) })
      await bootApp()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Signet rejected the request.')
    } finally {
      diagnostics.stop()
    }
  })

  // ── Relay list editor on login screen ───
  function rerenderRelayList(): void {
    const list = app.querySelector<HTMLUListElement>('#login-relay-list')
    if (!list) return
    list.innerHTML = renderLoginRelayRows()
    wireRelayControls()
  }

  function setRelayStatus(message: string): void {
    const status = app.querySelector<HTMLParagraphElement>('#login-relay-status')
    if (status) status.textContent = message
  }

  function wireRelayControls(): void {
    app.querySelectorAll<HTMLButtonElement>('[data-relay-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.relayToggle
        if (!url) return
        const nextMode: LoginRelayMode = relayMode(url) === 'off' ? 'readwrite' : 'off'
        setLoginRelayMode(url, nextMode)
        setRelayStatus(nextMode === 'off' ? `Disabled ${shortRelayUrl(url)}.` : `Enabled ${shortRelayUrl(url)}.`)
        rerenderRelayList()
      })
    })

    app.querySelectorAll<HTMLSelectElement>('[data-relay-mode]').forEach(select => {
      select.addEventListener('change', () => {
        const url = select.dataset.relayMode
        if (!url) return
        const mode = select.value === 'read' ? 'read' : 'readwrite'
        setLoginRelayMode(url, mode)
        setRelayStatus(`${shortRelayUrl(url)} set to ${mode === 'read' ? 'read only' : 'read/write'}.`)
        rerenderRelayList()
      })
    })

    app.querySelectorAll<HTMLButtonElement>('[data-relay-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.relayDelete
        if (!url) return
        deleteLoginRelay(url)
        setRelayStatus(`Deleted ${shortRelayUrl(url)}.`)
        rerenderRelayList()
      })
    })
  }

  wireRelayControls()

  app.querySelector('#login-relay-add')?.addEventListener('click', () => {
    const input = app.querySelector<HTMLInputElement>('#login-relay-input')
    const rawUrl = input?.value.trim()
    const url = rawUrl ? dedupeRelays([rawUrl])[0] ?? rawUrl : ''
    if (!url || !isAllowedRelayUrl(url)) return
    setLoginRelayMode(url, 'readwrite')
    setRelayStatus(`Added ${shortRelayUrl(url)}.`)
    rerenderRelayList()
    if (input) input.value = ''
  })

  app.querySelector('#login-relay-reset')?.addEventListener('click', () => {
    resetLoginRelays()
    setRelayStatus('Restored bundled relays.')
    rerenderRelayList()
  })

  app.querySelector('#login-relay-input')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      e.preventDefault()
      app.querySelector<HTMLButtonElement>('#login-relay-add')?.click()
    }
  })

}

async function bootApp(): Promise<void> {
  // Derive persona keys from identity — restore from vault or init fresh
  {
    const { identity, personas: vaultPersonas } = getState()
    if (identity?.privkey) {
      if (Object.keys(vaultPersonas).length > 0) {
        initPersonasFromTree(identity, vaultPersonas)
      } else {
        initPersonas(identity)
      }
    }
  }

  buildShell()

  if (window.location.hash === '#call') {
    update({ view: 'call-demo' })
  }

  const header = document.getElementById('header')
  if (header) renderHeader(header)

  wireSidebarToggle()

  document.getElementById('footer-sync-btn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:sync-vault'))
  })

  render()
  subscribe(scheduleRender)
  subscribe(scheduleVaultPublish)
  wireGlobalEvents()

  // Must come AFTER wireGlobalEvents so the 'canary:join-group' listener is registered
  checkInviteFragment()
  window.addEventListener('hashchange', () => checkInviteFragment())

  void bootSync()
  // Non-blocking: fetch kind 0 profiles for all personas
  fetchPersonaProfiles().catch(() => {})
}

// ── In-app notification prompt (replaces confirm()) ───────────

function showNotificationPrompt(onAccept: () => void): void {
  const existing = document.getElementById('notification-prompt')
  if (existing) existing.remove()

  const banner = document.createElement('div')
  banner.id = 'notification-prompt'
  banner.className = 'notification-prompt'

  const text = document.createElement('div')
  text.className = 'notification-prompt__text'
  const strong = document.createElement('strong')
  strong.textContent = 'Enable notifications?'
  const desc = document.createElement('span')
  desc.textContent = 'We\u2019ll alert you in emergencies and remind you to check in.'
  text.append(strong, desc)

  const actions = document.createElement('div')
  actions.className = 'notification-prompt__actions'
  const accept = document.createElement('button')
  accept.className = 'btn btn--sm btn--primary'
  accept.textContent = 'Enable'
  const dismiss = document.createElement('button')
  dismiss.className = 'btn btn--sm'
  dismiss.textContent = 'Not now'
  actions.append(accept, dismiss)

  banner.append(text, actions)
  document.getElementById('app')?.appendChild(banner)

  accept.addEventListener('click', () => { banner.remove(); onAccept() })
  dismiss.addEventListener('click', () => banner.remove())
}

function showAddToHomeScreenPrompt(): void {
  const existing = document.getElementById('notification-prompt')
  if (existing) existing.remove()

  const banner = document.createElement('div')
  banner.id = 'notification-prompt'
  banner.className = 'notification-prompt'

  const text = document.createElement('div')
  text.className = 'notification-prompt__text'
  const strong = document.createElement('strong')
  strong.textContent = 'Add to Home Screen'
  const desc = document.createElement('span')
  desc.textContent = 'To receive emergency alerts and liveness reminders, add CANARY to your home screen. Tap the share button, then "Add to Home Screen".'
  text.append(strong, desc)

  const actions = document.createElement('div')
  actions.className = 'notification-prompt__actions'
  const dismiss = document.createElement('button')
  dismiss.className = 'btn btn--sm'
  dismiss.textContent = 'Got it'
  actions.append(dismiss)

  banner.append(text, actions)
  document.getElementById('app')?.appendChild(banner)

  dismiss.addEventListener('click', () => banner.remove())
}

// ── Vault sync: debounced publish on group changes ────────────
let _vaultTimer: ReturnType<typeof setTimeout> | null = null
const VAULT_DEBOUNCE_MS = 30_000

function scheduleVaultPublish(): void {
  const { identity, groups } = getState()
  if (!identity?.pubkey) return
  if (!canUseIdentitySigner(identity)) return
  if (Object.keys(groups).length === 0) return

  if (_vaultTimer) clearTimeout(_vaultTimer)
  _vaultTimer = setTimeout(() => {
    const { identity: id, groups: g, personas: p, deletedGroupIds: d } = getState()
    if (!id?.pubkey || Object.keys(g).length === 0) return
    if (id.privkey) {
      publishVault(g, id.privkey, id.pubkey, p, d)
    } else if (isExternalSignerIdentity(id)) {
      publishVaultNip07(g, id.pubkey, p, d, id, { interactive: false })
    }
  }, VAULT_DEBOUNCE_MS)
}

function publishVaultNow(): void {
  if (_vaultTimer) clearTimeout(_vaultTimer)
  const { identity, groups, personas, deletedGroupIds } = getState()
  if (!identity?.pubkey || Object.keys(groups).length === 0) return

  const publish = identity.privkey
    ? publishVault(groups, identity.privkey, identity.pubkey, personas, deletedGroupIds)
    : isExternalSignerIdentity(identity)
      ? publishVaultNip07(groups, identity.pubkey, personas, deletedGroupIds, identity, { interactive: false })
      : null

  publish
    ?.then(() => console.info('[canary:vault] Vault published OK'))
    .catch((err) => {
      console.error('[canary:vault] Vault publish FAILED:', err)
      showToast(`Vault publish failed: ${err instanceof Error ? err.message : err}`, 'error')
    })
}

/**
 * Manual vault sync: publish local state, then fetch + merge remote vault.
 * Triggered by the "Sync Groups" button in the sidebar.
 */
async function manualVaultSync(): Promise<void> {
  const { identity, groups, personas } = getState()
  if (!identity?.pubkey) {
    showToast('No identity — cannot sync', 'error')
    return
  }
  if (!canUseIdentitySigner(identity)) {
    showToast('No private key or Signet signer — cannot sync', 'error')
    return
  }

  const isSignet = isExternalSignerIdentity(identity)
  const shortPk = identity.pubkey.slice(0, 8)
  showToast(`Syncing as ${shortPk}\u2026${isSignet ? ` (${identitySignerLabel(identity)})` : ''}`, 'info', 3000)
  console.info(`[canary:vault] Manual sync for pubkey ${shortPk} (${isSignet ? identitySignerLabel(identity) : 'local key'})`)

  try {
    // Publish local state first so the other device can pick it up
    const { deletedGroupIds } = getState()
    if (Object.keys(groups).length > 0) {
      if (isSignet) {
        await publishVaultNip07(groups, identity.pubkey, personas, deletedGroupIds, identity, { interactive: true })
      } else {
        await publishVault(groups, identity.privkey!, identity.pubkey, personas, deletedGroupIds)
      }
    }

    // Fetch remote vault and merge
    const { waitForConnection } = await import('./nostr/connect.js')
    await waitForConnection()
    const vaultData = isSignet
      ? await fetchVaultNip07(identity.pubkey, identity, { interactive: true })
      : await fetchVault(identity.privkey!, identity.pubkey)
    const vaultGroups = vaultData?.groups

    if (vaultGroups && Object.keys(vaultGroups).length > 0) {
      const { groups: localGroups } = getState()
      const merged = mergeVaultGroups(localGroups, vaultGroups, getState().deletedGroupIds)
      const newCount = Object.keys(merged).length - Object.keys(localGroups).length

      update({ groups: merged })
      flushPersist()

      if (newCount > 0) {
        showToast(`Synced — ${newCount} new group(s) restored`, 'success')
      } else {
        showToast('Groups are in sync', 'success', 2000)
      }
    } else {
      showToast(`No vault found for ${shortPk}\u2026 — are both devices using the same identity?`, 'warning', 5000)
    }
    // Merge vault persona metadata
    if (vaultData?.personas && Object.keys(vaultData.personas).length > 0) {
      const { personas: currentPersonas } = getState()
      const updated = { ...currentPersonas }
      for (const [id, vaultP] of Object.entries(vaultData.personas)) {
        if (updated[id]) {
          updated[id] = { ...updated[id], ...vaultP, npub: updated[id].npub }
        } else {
          updated[id] = vaultP
        }
      }
      update({ personas: updated })
    }
  } catch (err) {
    console.error('[canary:vault] Manual sync failed:', err)
    showToast(`Sync failed: ${err instanceof Error ? err.message : err}`, 'error')
  }
}

// pagehide fires reliably on mobile (beforeunload does not on iOS Safari)
window.addEventListener('pagehide', () => {
  if (_vaultTimer) publishVaultNow()
})

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
