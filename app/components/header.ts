// app/components/header.ts — Header component: brand, theme toggle, relay status, identity

import { getState, update } from '../state.js'
import { hasNip07 } from '../nostr/signer.js'
import { teardownSync } from '../sync.js'
import { isConnected, getRelayCount } from '../nostr/connect.js'
import type { AppIdentity } from '../types.js'
import { decode as nip19decode, nsecEncode } from 'nostr-tools/nip19'
import { getPublicKey } from 'nostr-tools/pure'
import { hexToBytes } from 'canary-kit/crypto'
import { escapeHtml } from '../utils/escape.js'

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
        <img class="header__identity-avatar" id="identity-avatar" alt="" hidden>
        <span class="header__identity-dot" id="identity-dot"></span>
        <span class="header__identity-label" id="identity-label">...</span>
      </button>
      <span id="relay-status" hidden>
        <span class="relay-dot"></span>
        <span class="relay-label"></span>
      </span>
      <span id="vault-sync-status" class="vault-sync-indicator" hidden title="Vault synced"></span>
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

  // Restore relay status after innerHTML rebuild (which resets #relay-status to hidden)
  if (isConnected()) {
    updateRelayStatus(true, getRelayCount())
  }

  // Vault sync indicator — brief flash on successful sync
  document.addEventListener('canary:vault-synced', () => {
    const el = document.getElementById('vault-sync-status')
    if (!el) return
    el.hidden = false
    el.textContent = '\u2601' // cloud icon
    setTimeout(() => { el.hidden = true }, 3000)
  })

  const nav = container.querySelector<HTMLElement>('#header-nav')
  nav?.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-view]')
    if (!tab) return
    const targetView = tab.dataset.view as 'groups' | 'call-demo'
    if (!targetView) return

    // On mobile, the Groups tab also toggles the sidebar
    if (targetView === 'groups' && window.innerWidth <= 768) {
      const sidebar = document.getElementById('sidebar')
      const overlay = document.getElementById('sidebar-overlay')
      if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('sidebar--open')
        sidebar.classList.toggle('sidebar--open', !isOpen)
        overlay.classList.toggle('sidebar-overlay--visible', !isOpen)
      }
    }

    if (targetView !== getState().view) {
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
  const avatar = document.getElementById('identity-avatar') as HTMLImageElement | null
  if (!dot || !label) return

  const { identity } = getState()
  if (!identity?.pubkey) {
    label.textContent = 'No identity'
    dot.className = 'header__identity-dot header__identity-dot--none'
    if (avatar) avatar.hidden = true
    return
  }

  const shortPk = `${identity.pubkey.slice(0, 6)}\u2026${identity.pubkey.slice(-4)}`
  const name = identity.displayName && identity.displayName !== 'You'
    ? identity.displayName
    : shortPk

  label.textContent = name

  // Show avatar if available, hide dot when avatar is shown
  if (avatar && identity.picture) {
    avatar.src = identity.picture
    avatar.hidden = false
    dot.hidden = true
  } else {
    if (avatar) avatar.hidden = true
    dot.hidden = false
    dot.className = identity.signerType === 'nip07'
      ? 'header__identity-dot header__identity-dot--extension'
      : 'header__identity-dot header__identity-dot--local'
  }
}

/** Convert a Uint8Array to hex string. */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function preserveMnemonic(nextIdentity: AppIdentity, previousIdentity: AppIdentity | null | undefined): AppIdentity {
  if (previousIdentity?.pubkey === nextIdentity.pubkey && previousIdentity.mnemonic) {
    return { ...nextIdentity, mnemonic: previousIdentity.mnemonic }
  }
  return nextIdentity
}

/** Log in with an nsec (bech32 private key). */
function loginWithNsec(nsec: string, displayName?: string): boolean {
  try {
    const currentIdentity = getState().identity
    const decoded = nip19decode(nsec.trim())
    if (decoded.type !== 'nsec') {
      alert('Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".')
      return false
    }
    const privkeyBytes = decoded.data as Uint8Array
    const privkey = bytesToHex(privkeyBytes)
    const pubkey = getPublicKey(privkeyBytes)
    const newIdentity = preserveMnemonic({
      pubkey,
      privkey,
      signerType: 'local',
      displayName: displayName ?? 'You',
    }, currentIdentity)
    // Tear down sync and clear groups from previous identity
    teardownSync()
    update({ identity: newIdentity, groups: {}, activeGroupId: null })
    updateIdentityDisplay()
    // Re-connect relays and fetch kind 0 profile for the new identity
    document.dispatchEvent(new CustomEvent('canary:resync'))
    // Publish kind 0 if we have a meaningful name
    if (displayName && displayName !== 'You') {
      import('../nostr/profiles.js').then(({ publishKind0 }) => publishKind0(displayName, privkey))
    }
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

  const popover = document.createElement('div')
  popover.id = 'identity-popover'
  popover.className = 'identity-popover'
  popover.innerHTML = `
    <div class="identity-popover__row">
      <span class="identity-popover__label">Pubkey</span>
      <span class="identity-popover__value" title="${escapeHtml(pk)}">${escapeHtml(shortPk)}</span>
    </div>
    <div class="identity-popover__row">
      <span class="identity-popover__label">Signer</span>
      <span class="identity-popover__value">${signerLabel}</span>
    </div>

    ${(identity?.mnemonic || identity?.privkey) ? `
      <div class="identity-popover__divider"></div>
      <div class="identity-popover__section">
        <span class="identity-popover__label">Recovery phrase</span>
        <p style="font-size: 0.6875rem; color: var(--text-muted); margin: 0.25rem 0;">Back this up — it's the only way to recover your account.</p>
        <div id="recovery-reveal-area" style="margin-top: 0.375rem;">
          <button class="btn btn--sm" id="recovery-reveal-btn" type="button" style="width: 100%;">Show recovery phrase</button>
        </div>
      </div>
    ` : ''}
    ${identity?.privkey ? `
      <div class="identity-popover__section" style="padding-top: 0;">
        <details style="font-size: 0.75rem;">
          <summary style="cursor: pointer; color: var(--text-muted);">Advanced: show nsec</summary>
          <div id="nsec-reveal-area" style="margin-top: 0.375rem;">
            <button class="btn btn--sm" id="nsec-reveal-btn" type="button" style="width: 100%;">Show nsec</button>
          </div>
        </details>
      </div>
    ` : ''}

    <div class="identity-popover__divider"></div>
    <button class="btn btn--sm" id="identity-logout-btn" type="button" style="width: 100%; color: var(--failed);">Logout</button>

    <details style="margin-top: 0.25rem;">
      <summary class="btn btn--sm" style="width: 100%; text-align: center; cursor: pointer; list-style: none;">Switch account</summary>

      <div style="margin-top: 0.5rem;">
        <div class="identity-popover__section">
          <span class="identity-popover__label">Login with nsec</span>
          <form id="nsec-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem; margin-top: 0.375rem;">
            <input class="input" type="password" id="nsec-input" placeholder="nsec1..." autocomplete="off" style="width: 100%; font-size: 0.8125rem; padding: 0.5rem;" />
            <button class="btn btn--sm btn--primary" type="submit" style="width: 100%;">Login</button>
          </form>
        </div>

        <button class="btn btn--sm" id="nip07-connect-btn" type="button" style="width: 100%;">Use Browser Extension (NIP-07)</button>
      </div>
    </details>
  `

  anchor.parentElement?.appendChild(popover)

  // Logout
  popover.querySelector('#identity-logout-btn')?.addEventListener('click', () => {
    teardownSync()
    update({ identity: null, groups: {}, activeGroupId: null })
    popover.remove()
    window.location.reload()
  })

  // Reveal recovery phrase
  popover.querySelector('#recovery-reveal-btn')?.addEventListener('click', () => {
    const area = popover.querySelector('#recovery-reveal-area')
    if (!area) return
    const mnemonic = getState().identity?.mnemonic
    if (!mnemonic) {
      area.textContent = ''
      const msg = document.createElement('p')
      msg.style.cssText = 'font-size:0.75rem;color:var(--text-muted);'
      msg.textContent = 'No recovery phrase stored (key was imported via nsec).'
      area.appendChild(msg)
      return
    }
    const words = mnemonic.split(' ')
    area.textContent = ''

    const grid = document.createElement('div')
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;'

    words.forEach((w, i) => {
      const cell = document.createElement('div')
      cell.style.cssText = 'border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;'
      const num = document.createElement('span')
      num.style.color = 'var(--text-muted)'
      num.textContent = `${i + 1}. `
      const word = document.createElement('span')
      word.textContent = w
      cell.append(num, word)
      grid.appendChild(cell)
    })
    area.appendChild(grid)

    const copyBtn = document.createElement('button')
    copyBtn.className = 'btn btn--sm'
    copyBtn.type = 'button'
    copyBtn.style.cssText = 'width:100%;margin-top:0.375rem;'
    copyBtn.textContent = 'Copy words'
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(mnemonic)
        copyBtn.textContent = 'Copied!'
        setTimeout(() => { copyBtn.textContent = 'Copy words' }, 2000)
      } catch {}
    })
    area.appendChild(copyBtn)
  })

  // Reveal nsec
  popover.querySelector('#nsec-reveal-btn')?.addEventListener('click', () => {
    const area = popover.querySelector('#nsec-reveal-area')
    if (!area || !identity?.privkey) return
    const nsec = nsecEncode(hexToBytes(identity.privkey))
    area.innerHTML = `
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${escapeHtml(nsec)}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `
    area.querySelector('#nsec-copy-btn')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      try {
        await navigator.clipboard.writeText(nsec)
        btn.textContent = 'Copied!'
        setTimeout(() => { btn.textContent = 'Copy nsec' }, 2000)
      } catch { /* clipboard may be blocked */ }
    })
  })

  // nsec login via form submit (avoids "password not in form" warning)
  popover.querySelector<HTMLFormElement>('#nsec-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = popover.querySelector<HTMLInputElement>('#nsec-input')
    if (!input?.value.trim()) return
    if (loginWithNsec(input.value)) popover.remove()
  })

  // Connect NIP-07
  popover.querySelector('#nip07-connect-btn')?.addEventListener('click', async () => {
    if (!hasNip07()) {
      alert('No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.')
      return
    }
    try {
      teardownSync()
      const pubkey = await (window as any).nostr.getPublicKey()
      const newIdentity = preserveMnemonic({
        pubkey,
        signerType: 'nip07',
        displayName: identity?.displayName ?? 'You',
      }, identity)
      update({ identity: newIdentity, groups: {}, activeGroupId: null })
      updateIdentityDisplay()
      document.dispatchEvent(new CustomEvent('canary:resync'))
      popover.remove()
    } catch {
      alert('Extension rejected the request.')
    }
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
