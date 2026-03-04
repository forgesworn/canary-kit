// app/components/header.ts — Header component: brand, theme toggle, relay status, identity

import { getState, update } from '../state.js'
import { hasNip07, resolveSigner } from '../nostr/signer.js'
import { DEMO_ACCOUNTS } from '../demo-accounts.js'
import type { AppIdentity } from '../types.js'
import { decode as nip19decode } from 'nostr-tools/nip19'
import { getPublicKey } from 'nostr-tools/pure'

// ── Types ──────────────────────────────────────────────────────

type Theme = 'dark' | 'light'

// ── Internal helpers ───────────────────────────────────────────

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme): void {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

function updateToggleLabel(btn: HTMLButtonElement): void {
  const theme = currentTheme()
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
  btn.textContent = '◐'
}

function handleThemeToggle(btn: HTMLButtonElement): void {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  update({ settings: { ...getState().settings, theme: next } })
  updateToggleLabel(btn)
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Render the header chrome into the given container element.
 * Produces: brand div, nav tabs, relay status indicator, and theme toggle button.
 */
export function renderHeader(container: HTMLElement): void {
  const view = getState().view

  container.innerHTML = `
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY</div>
    <nav class="header__nav" id="header-nav">
      <button class="header__nav-tab${view === 'groups' ? ' header__nav-tab--active' : ''}" data-view="groups">Groups</button>
      <button class="header__nav-tab${view === 'call-demo' ? ' header__nav-tab--active' : ''}" data-view="call-demo">Call Demo</button>
    </nav>
    <div class="header__actions">
      <button class="header__identity-btn" id="identity-btn" title="Identity">
        <span class="header__identity-dot" id="identity-dot"></span>
        <span class="header__identity-label" id="identity-label">...</span>
      </button>
      <span id="relay-status" hidden>
        <span class="relay-dot"></span>
        <span class="relay-label"></span>
      </span>
      <button class="theme-toggle" id="theme-toggle" aria-label="Switch to light mode">&#9680;</button>
      <button class="theme-toggle" id="reset-btn" aria-label="Reset demo" title="Clear all data and reset">&#8634;</button>
    </div>
  `

  const btn = container.querySelector<HTMLButtonElement>('#theme-toggle')
  if (btn) {
    updateToggleLabel(btn)
    btn.addEventListener('click', () => handleThemeToggle(btn))
  }

  const resetBtn = container.querySelector<HTMLButtonElement>('#reset-btn')
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Clear all data and reset the demo?')) {
        localStorage.clear()
        window.location.reload()
      }
    })
  }

  // ── Identity button ────────────────────────────────────────
  updateIdentityDisplay()
  const identityBtn = container.querySelector<HTMLButtonElement>('#identity-btn')
  identityBtn?.addEventListener('click', () => showIdentityPopover(identityBtn))

  const nav = container.querySelector<HTMLElement>('#header-nav')
  nav?.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-view]')
    if (!tab) return
    const targetView = tab.dataset.view as 'groups' | 'call-demo'
    if (targetView && targetView !== getState().view) {
      update({ view: targetView })
    }
  })
}

export type SyncStatus = 'synced' | 'syncing' | 'offline'

/**
 * Update the sync status indicator in the header.
 * Shows: green dot + "Synced" / amber dot + "Syncing..." / red dot + "Offline"
 */
export function updateRelayStatus(connected: boolean, count: number): void {
  const indicator = document.getElementById('relay-status')
  if (!indicator) return

  const dot = indicator.querySelector<HTMLElement>('.relay-dot')
  const label = indicator.querySelector<HTMLElement>('.relay-label')

  if (!connected || count === 0) {
    indicator.removeAttribute('hidden')
    dot?.setAttribute('class', 'relay-dot relay-dot--offline')
    if (label) label.textContent = 'Offline'
    indicator.title = 'Not connected to any relay'
  } else {
    indicator.removeAttribute('hidden')
    dot?.setAttribute('class', 'relay-dot relay-dot--synced')
    if (label) label.textContent = `Synced · ${count} relay${count === 1 ? '' : 's'}`
    indicator.title = `Connected to ${count} relay${count === 1 ? '' : 's'}`
  }
}

/** Show a brief "syncing" state that auto-resolves to synced. */
export function flashSyncing(): void {
  const indicator = document.getElementById('relay-status')
  if (!indicator) return
  const dot = indicator.querySelector<HTMLElement>('.relay-dot')
  const label = indicator.querySelector<HTMLElement>('.relay-label')

  indicator.removeAttribute('hidden')
  dot?.setAttribute('class', 'relay-dot relay-dot--syncing')
  if (label) label.textContent = 'Syncing...'
}

// ── Identity management ─────────────────────────────────────

/** Update the identity indicator in the header. */
export function updateIdentityDisplay(): void {
  const dot = document.getElementById('identity-dot')
  const label = document.getElementById('identity-label')
  if (!dot || !label) return

  const { identity } = getState()
  if (!identity?.pubkey) {
    label.textContent = 'No identity'
    dot.className = 'header__identity-dot header__identity-dot--none'
    return
  }

  const shortPk = `${identity.pubkey.slice(0, 6)}\u2026${identity.pubkey.slice(-4)}`
  const name = identity.displayName && identity.displayName !== 'You'
    ? identity.displayName
    : shortPk

  label.textContent = name
  dot.className = identity.signerType === 'nip07'
    ? 'header__identity-dot header__identity-dot--extension'
    : 'header__identity-dot header__identity-dot--local'
}

/** Convert a Uint8Array to hex string. */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Log in with an nsec (bech32 private key). */
function loginWithNsec(nsec: string, displayName?: string): boolean {
  try {
    const decoded = nip19decode(nsec.trim())
    if (decoded.type !== 'nsec') {
      alert('Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".')
      return false
    }
    const privkeyBytes = decoded.data as Uint8Array
    const privkey = bytesToHex(privkeyBytes)
    const pubkey = getPublicKey(privkeyBytes)
    const newIdentity: AppIdentity = {
      pubkey,
      privkey,
      signerType: 'local',
      displayName: displayName ?? 'You',
    }
    // Clear groups from previous identity — each account has its own session
    update({ identity: newIdentity, groups: {}, activeGroupId: null })
    updateIdentityDisplay()
    return true
  } catch {
    alert('Invalid nsec format.')
    return false
  }
}

function showIdentityPopover(anchor: HTMLElement): void {
  // Remove existing popover
  document.getElementById('identity-popover')?.remove()

  const { identity } = getState()
  const pk = identity?.pubkey ?? ''
  const shortPk = pk ? `${pk.slice(0, 8)}\u2026${pk.slice(-8)}` : 'None'
  const signerLabel = identity?.signerType === 'nip07' ? 'Extension (NIP-07)' : 'Local key'
  const extensionAvailable = hasNip07()

  const demoAccountsHtml = DEMO_ACCOUNTS.map(a => `
    <button class="btn btn--sm identity-popover__demo" data-nsec="${a.nsec}" data-name="${a.name}" type="button">
      <strong>${a.name}</strong> <span class="identity-popover__label">${a.bio}</span>
    </button>
  `).join('')

  const popover = document.createElement('div')
  popover.id = 'identity-popover'
  popover.className = 'identity-popover'
  popover.innerHTML = `
    <div class="identity-popover__row">
      <span class="identity-popover__label">Pubkey</span>
      <span class="identity-popover__value" title="${pk}">${shortPk}</span>
    </div>
    <div class="identity-popover__row">
      <span class="identity-popover__label">Signer</span>
      <span class="identity-popover__value">${signerLabel}</span>
    </div>

    <div class="identity-popover__divider"></div>

    <div class="identity-popover__section">
      <span class="identity-popover__label">Login with nsec</span>
      <div style="display: flex; flex-direction: column; gap: 0.375rem; margin-top: 0.375rem;">
        <input class="input" type="password" id="nsec-input" placeholder="nsec1..." style="width: 100%; font-size: 0.8125rem; padding: 0.5rem;" />
        <button class="btn btn--sm btn--primary" id="nsec-login-btn" type="button" style="width: 100%;">Login</button>
      </div>
    </div>

    ${extensionAvailable ? `
      <button class="btn btn--sm" id="nip07-connect-btn" type="button" style="width: 100%;">Use Browser Extension</button>
    ` : ''}

    ${identity?.signerType === 'nip07' ? `
      <button class="btn btn--sm" id="nip07-disconnect-btn" type="button" style="width: 100%;">Use Local Key</button>
    ` : ''}

    <div class="identity-popover__divider"></div>

    <div class="identity-popover__section">
      <span class="identity-popover__label">Demo accounts</span>
      <div class="identity-popover__demos">
        ${demoAccountsHtml}
      </div>
    </div>
  `

  anchor.parentElement?.appendChild(popover)

  // nsec login
  popover.querySelector('#nsec-login-btn')?.addEventListener('click', () => {
    const input = popover.querySelector<HTMLInputElement>('#nsec-input')
    if (!input?.value.trim()) return
    if (loginWithNsec(input.value)) popover.remove()
  })

  popover.querySelector<HTMLInputElement>('#nsec-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement
      if (loginWithNsec(input.value)) popover.remove()
    }
  })

  // Demo account quick-select
  popover.querySelectorAll<HTMLButtonElement>('.identity-popover__demo').forEach(btn => {
    btn.addEventListener('click', () => {
      const nsec = btn.dataset.nsec!
      const name = btn.dataset.name!
      if (loginWithNsec(nsec, name)) popover.remove()
    })
  })

  // Connect NIP-07
  popover.querySelector('#nip07-connect-btn')?.addEventListener('click', async () => {
    try {
      const pubkey = await (window as any).nostr.getPublicKey()
      const newIdentity: AppIdentity = {
        pubkey,
        signerType: 'nip07',
        displayName: identity?.displayName ?? 'You',
      }
      update({ identity: newIdentity, groups: {}, activeGroupId: null })
      updateIdentityDisplay()
      popover.remove()
    } catch {
      alert('Extension rejected the request.')
    }
  })

  // Disconnect NIP-07
  popover.querySelector('#nip07-disconnect-btn')?.addEventListener('click', async () => {
    const resolved = await resolveSigner({ pubkey: '', privkey: identity?.privkey })
    const newIdentity: AppIdentity = {
      pubkey: resolved.pubkey,
      privkey: resolved.privkey,
      signerType: 'local',
      displayName: identity?.displayName ?? 'You',
    }
    update({ identity: newIdentity, groups: {}, activeGroupId: null })
    updateIdentityDisplay()
    popover.remove()
  })

  // Close on outside click
  const closeHandler = (e: MouseEvent) => {
    if (!popover.contains(e.target as Node) && e.target !== anchor) {
      popover.remove()
      document.removeEventListener('click', closeHandler)
    }
  }
  requestAnimationFrame(() => document.addEventListener('click', closeHandler))
}
