// app/panels/settings.ts — Group settings drawer

import { getState, updateGroup, update } from '../state.js'
import { groupMode, allRelaysForGroup, WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY } from '../types.js'
import { deleteGroup, reseedGroup, compromiseReseed, validateGroupImport } from '../actions/groups.js'
import { showToast } from '../components/toast.js'
import { disconnectRelays, isConnected, getRelayCount } from '../nostr/connect.js'
import { ensureTransport, teardownSync } from '../sync.js'
import { updateRelayStatus } from '../components/header.js'
import { escapeHtml } from '../utils/escape.js'

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

// ── Drawer state persistence across re-renders ─────────────────
// The settings panel is re-rendered on every state change, which would
// collapse the drawer. We persist the open/closed state here so it
// survives re-renders.
let _drawerOpen = false

export function renderSettings(container: HTMLElement): void {
  const { groups, activeGroupId } = getState()

  if (!activeGroupId || !groups[activeGroupId]) {
    container.innerHTML = ''
    return
  }

  const group = groups[activeGroupId]

  const { identity } = getState()
  const isAdmin = !!identity?.pubkey && group.admins.includes(identity.pubkey)

  container.innerHTML = `
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${_drawerOpen ? 'transform: rotate(90deg);' : ''}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${_drawerOpen ? '' : ' hidden'}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${escapeHtml(group.name)}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${group.rotationInterval === 30 ? 'segmented__btn--active' : ''}" data-interval="30">30s</button>
            <button class="segmented__btn ${group.rotationInterval === 86400 ? 'segmented__btn--active' : ''}" data-interval="86400">24h</button>
            <button class="segmented__btn ${group.rotationInterval === 604800 ? 'segmented__btn--active' : ''}" data-interval="604800">7d</button>
            <button class="segmented__btn ${group.rotationInterval === 2592000 ? 'segmented__btn--active' : ''}" data-interval="2592000">30d</button>
          </div>
          <p class="settings-hint">How often the verification word changes</p>
        </div>

        ${group.encodingFormat === 'words' ? `
        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${group.wordCount === 1 ? 'segmented__btn--active' : ''}" data-words="1">1</button>
            <button class="segmented__btn ${group.wordCount === 2 ? 'segmented__btn--active' : ''}" data-words="2">2</button>
            <button class="segmented__btn ${group.wordCount === 3 ? 'segmented__btn--active' : ''}" data-words="3">3</button>
          </div>
          <p class="settings-hint">More words = stronger security</p>
        </div>
        ` : ''}

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${group.encodingFormat === 'words' ? 'segmented__btn--active' : ''}" data-enc="words">Word</button>
            <button class="segmented__btn ${group.encodingFormat === 'pin' ? 'segmented__btn--active' : ''}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${group.encodingFormat === 'hex' ? 'segmented__btn--active' : ''}" data-enc="hex">Hex</button>
          </div>
          <p class="settings-hint">Words for voice, PINs for digital input, Hex for machine-to-machine</p>
        </div>

        <!-- Tolerance Window -->
        <div class="settings-section">
          <span class="input-label">Tolerance</span>
          <div class="segmented">
            <button class="segmented__btn ${group.tolerance === 0 ? 'segmented__btn--active' : ''}" data-tolerance="0">0</button>
            <button class="segmented__btn ${group.tolerance === 1 ? 'segmented__btn--active' : ''}" data-tolerance="1">+/-1</button>
            <button class="segmented__btn ${group.tolerance === 2 ? 'segmented__btn--active' : ''}" data-tolerance="2">+/-2</button>
            <button class="segmented__btn ${group.tolerance === 3 ? 'segmented__btn--active' : ''}" data-tolerance="3">+/-3</button>
          </div>
          <p class="settings-hint">Accept words from neighbouring time windows (higher = more forgiving, less secure)</p>
        </div>

        <!-- Duress Mode -->
        <div class="settings-section">
          <span class="input-label">Duress Response</span>
          <div class="segmented">
            <button class="segmented__btn ${group.duressMode === 'immediate' || !group.duressMode ? 'segmented__btn--active' : ''}" data-duress-mode="immediate">Immediate</button>
            <button class="segmented__btn ${group.duressMode === 'dead-drop' ? 'segmented__btn--active' : ''}" data-duress-mode="dead-drop">Dead Drop</button>
            <button class="segmented__btn ${group.duressMode === 'both' ? 'segmented__btn--active' : ''}" data-duress-mode="both">Both</button>
          </div>
          <p class="settings-hint">Immediate alerts members now. Dead drop records silently for later retrieval.</p>
        </div>

        <!-- Nostr Sync Toggle -->
        <div class="settings-section">
          <label class="toggle-label">
            <input type="checkbox" id="nostr-toggle" ${group.nostrEnabled ? 'checked' : ''}>
            <span>Nostr Sync</span>
          </label>
          <div class="nostr-settings" id="nostr-settings"${group.nostrEnabled ? '' : ' hidden'}>
            <!-- Identity -->
            <div class="nostr-identity" id="nostr-identity">
              <span class="settings-hint">Loading identity…</span>
            </div>

            <!-- Write relays (publishing) -->
            <div class="nostr-relays">
              <span class="input-label">Write Relays <span class="settings-hint" style="font-weight:normal;">(publishing)</span></span>
              <ul class="relay-list" id="write-relay-list">
                ${(group.writeRelays ?? []).map((url, i) => `
                  <li class="relay-item">
                    <span class="relay-url">${escapeHtml(url)}</span>
                    <button class="btn btn--ghost btn--sm write-relay-remove" data-relay-index="${i}" aria-label="Remove write relay">✕</button>
                  </li>
                `).join('')}
              </ul>
              <div class="relay-add-row">
                <input
                  class="input relay-add-input"
                  id="write-relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="write-relay-add-btn">Add</button>
              </div>
            </div>

            <!-- Read relays (subscriptions/discovery) -->
            <div class="nostr-relays" style="margin-top: 0.5rem;">
              <span class="input-label">Read Relays <span class="settings-hint" style="font-weight:normal;">(subscriptions)</span></span>
              <ul class="relay-list" id="read-relay-list">
                ${(group.readRelays ?? []).map((url, i) => `
                  <li class="relay-item">
                    <span class="relay-url">${escapeHtml(url)}</span>
                    <button class="btn btn--ghost btn--sm read-relay-remove" data-relay-index="${i}" aria-label="Remove read relay">✕</button>
                  </li>
                `).join('')}
              </ul>
              <div class="relay-add-row">
                <input
                  class="input relay-add-input"
                  id="read-relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="read-relay-add-btn">Add</button>
              </div>
            </div>

            <!-- Connection status -->
            <div class="nostr-connection-status">
              <span id="nostr-conn-status" class="settings-hint">
                ${isConnected() ? `Connected to ${getRelayCount()} relay${getRelayCount() === 1 ? '' : 's'}` : 'Not connected'}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="settings-actions">
          <button class="btn btn--ghost" id="export-btn">Export Group</button>
          <button class="btn btn--ghost" id="import-btn">Import Group</button>
          ${isAdmin ? `<button class="btn btn--warning" id="reseed-btn">Rotate Key</button>` : ''}
          ${isAdmin ? `<button class="btn btn--danger" id="compromise-reseed-btn">Compromise Reseed</button>` : ''}
          <button class="btn btn--danger" id="dissolve-btn">Dissolve Group</button>
        </div>
      </div>
    </div>
  `

  // ── Toggle drawer ────────────────────────────────────────────

  document.getElementById('settings-toggle')!.addEventListener('click', () => {
    _drawerOpen = !_drawerOpen
    const body = document.getElementById('settings-body')!
    const chevron = container.querySelector('.settings-chevron') as HTMLElement
    body.hidden = !_drawerOpen
    chevron.style.transform = _drawerOpen ? 'rotate(90deg)' : ''
  })

  // ── Name change ──────────────────────────────────────────────

  document.getElementById('settings-name')!.addEventListener('change', (e) => {
    const name = (e.target as HTMLInputElement).value.trim()
    if (name) updateGroup(activeGroupId!, { name })
  })

  // ── Rotation interval ────────────────────────────────────────

  container.querySelectorAll('[data-interval]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateGroup(activeGroupId!, { rotationInterval: Number((btn as HTMLElement).dataset.interval) })
    })
  })

  // ── Word count ───────────────────────────────────────────────

  container.querySelectorAll('[data-words]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateGroup(activeGroupId!, { wordCount: Number((btn as HTMLElement).dataset.words) as 1 | 2 | 3 })
    })
  })

  // ── Encoding format ──────────────────────────────────────────

  container.querySelectorAll('[data-enc]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateGroup(activeGroupId!, { encodingFormat: (btn as HTMLElement).dataset.enc as 'words' | 'pin' | 'hex' })
    })
  })

  // ── Tolerance window ─────────────────────────────────────────

  container.querySelectorAll('[data-tolerance]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateGroup(activeGroupId!, { tolerance: Number((btn as HTMLElement).dataset.tolerance) })
    })
  })

  // ── Duress mode ─────────────────────────────────────────────

  container.querySelectorAll('[data-duress-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateGroup(activeGroupId!, { duressMode: (btn as HTMLElement).dataset.duressMode as 'immediate' | 'dead-drop' | 'both' })
    })
  })

  // ── Nostr toggle ─────────────────────────────────────────────

  document.getElementById('nostr-toggle')!.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked
    updateGroup(activeGroupId!, { nostrEnabled: enabled })
    const nostrPanel = document.getElementById('nostr-settings')!
    nostrPanel.hidden = !enabled

    if (enabled) {
      const g = getState().groups[activeGroupId!]
      const readRelays = g?.readRelays ?? []
      const writeRelays = g?.writeRelays ?? []
      void ensureTransport(readRelays, writeRelays, activeGroupId!).then(() => {
        updateNostrConnectionStatus()
      })
      void populateNostrIdentity()
    } else {
      teardownSync()
      disconnectRelays()
      updateRelayStatus(false, 0)
      updateNostrConnectionStatus()
    }
  })

  // ── Relay management ──────────────────────────────────────────

  /** Reconnect with current read/write relay config if Nostr is enabled. */
  function reconnectIfNeeded(): void {
    const g = getState().groups[activeGroupId!]
    if (g?.nostrEnabled) {
      void ensureTransport(g.readRelays ?? [], g.writeRelays ?? [], activeGroupId!)
    }
  }

  // Remove a write relay by index.
  container.querySelectorAll<HTMLButtonElement>('.write-relay-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.relayIndex)
      const writeRelays = [...(getState().groups[activeGroupId!]?.writeRelays ?? [])]
      writeRelays.splice(idx, 1)
      updateGroup(activeGroupId!, { writeRelays })
      reconnectIfNeeded()
    })
  })

  // Remove a read relay by index.
  container.querySelectorAll<HTMLButtonElement>('.read-relay-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.relayIndex)
      const readRelays = [...(getState().groups[activeGroupId!]?.readRelays ?? [])]
      readRelays.splice(idx, 1)
      updateGroup(activeGroupId!, { readRelays })
      reconnectIfNeeded()
    })
  })

  // Add a write relay.
  document.getElementById('write-relay-add-btn')!.addEventListener('click', () => {
    const input = document.getElementById('write-relay-add-input') as HTMLInputElement
    const url = input.value.trim()
    if (!isAllowedRelayUrl(url)) { input.focus(); return }
    const writeRelays = [...(getState().groups[activeGroupId!]?.writeRelays ?? [])]
    if (!writeRelays.includes(url)) {
      writeRelays.push(url)
      updateGroup(activeGroupId!, { writeRelays })
      input.value = ''
      reconnectIfNeeded()
    } else {
      input.value = ''
    }
  })

  // Add a read relay.
  document.getElementById('read-relay-add-btn')!.addEventListener('click', () => {
    const input = document.getElementById('read-relay-add-input') as HTMLInputElement
    const url = input.value.trim()
    if (!isAllowedRelayUrl(url)) { input.focus(); return }
    const readRelays = [...(getState().groups[activeGroupId!]?.readRelays ?? [])]
    if (!readRelays.includes(url)) {
      readRelays.push(url)
      updateGroup(activeGroupId!, { readRelays })
      input.value = ''
      reconnectIfNeeded()
    } else {
      input.value = ''
    }
  })

  // Allow adding via Enter key.
  document.getElementById('write-relay-add-input')!.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('write-relay-add-btn')!.click()
  })
  document.getElementById('read-relay-add-input')!.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('read-relay-add-btn')!.click()
  })

  // ── Populate NIP-07 identity on load ─────────────────────────

  if (group.nostrEnabled) {
    void populateNostrIdentity()
  }

  // ── Emergency reseed ─────────────────────────────────────────

  document.getElementById('reseed-btn')?.addEventListener('click', () => {
    const { groups: g } = getState()
    const ag = g[activeGroupId!]
    const isOnline = ag ? groupMode(ag) === 'online' : false
    const msg = isOnline
      ? 'Rotate the group key? This broadcasts the new key to all members via the relay.'
      : 'Rotate the group key? Remaining members will need to re-sync via Share State.'
    if (confirm(msg)) {
      reseedGroup(activeGroupId!)
      showToast('Key rotated. New verification words are active.', 'warning', 6000)
    }
  })

  document.getElementById('compromise-reseed-btn')?.addEventListener('click', () => {
    if (confirm('Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.')) {
      compromiseReseed(activeGroupId!)
      showToast('Emergency reseed complete. No broadcast sent — share new invites with all members.', 'warning', 8000)
    }
  })

  // ── Dissolve ─────────────────────────────────────────────────

  document.getElementById('dissolve-btn')!.addEventListener('click', () => {
    if (confirm(`Dissolve "${group.name}"? This cannot be undone.`)) {
      deleteGroup(activeGroupId!)
    }
  })

  // ── Export ───────────────────────────────────────────────────

  document.getElementById('export-btn')!.addEventListener('click', () => {
    if (!confirm('This exports the group secret in cleartext. Treat the file like a password.')) return
    const blob = new Blob([JSON.stringify(group, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `canary-${group.name.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  })

  // ── Import ───────────────────────────────────────────────────

  document.getElementById('import-btn')!.addEventListener('click', () => {
    if (!confirm('Only import files from trusted sources — the file contains the group secret.')) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const imported = JSON.parse(text)
        validateGroupImport(imported)
        const id = crypto.randomUUID()
        // Whitelist known fields only — never spread untrusted JSON into state
        const appGroup = {
          id,
          name: String(imported.name),
          seed: String(imported.seed),
          members: imported.members.filter((m: unknown) => typeof m === 'string'),
          memberNames: {} as Record<string, string>,
          nostrEnabled: false,
          relays: [] as string[],
          wordlist: typeof imported.wordlist === 'string' ? imported.wordlist : 'en-v1',
          wordCount: ([1, 2, 3] as const).includes(imported.wordCount) ? imported.wordCount : 2,
          counter: typeof imported.counter === 'number' && imported.counter >= 0 ? imported.counter : 0,
          usageOffset: typeof imported.usageOffset === 'number' && imported.usageOffset >= 0 ? imported.usageOffset : 0,
          rotationInterval: typeof imported.rotationInterval === 'number' && imported.rotationInterval > 0 ? imported.rotationInterval : 86400,
          encodingFormat: (['words', 'pin', 'hex'] as const).includes(imported.encodingFormat) ? imported.encodingFormat : 'words',
          usedInvites: [] as string[],
          latestInviteIssuedAt: 0,
          livenessInterval: typeof imported.rotationInterval === 'number' && imported.rotationInterval > 0 ? imported.rotationInterval : 86400,
          livenessCheckins: {} as Record<string, number>,
          tolerance: typeof imported.tolerance === 'number' && imported.tolerance >= 0 && imported.tolerance <= 10 ? imported.tolerance : 1,
          beaconInterval: typeof imported.beaconInterval === 'number' && imported.beaconInterval > 0 ? imported.beaconInterval : 60,
          beaconPrecision: typeof imported.beaconPrecision === 'number' && imported.beaconPrecision > 0 ? imported.beaconPrecision : 6,
          duressMode: (['immediate', 'dead-drop', 'both'] as const).includes(imported.duressMode) ? imported.duressMode : 'immediate',
          createdAt: typeof imported.createdAt === 'number' ? imported.createdAt : Math.floor(Date.now() / 1000),
          admins: Array.isArray(imported.admins)
            ? imported.admins.filter((a: unknown) => typeof a === 'string')
            : [],
          epoch: typeof imported.epoch === 'number' && imported.epoch >= 0 ? imported.epoch : 0,
          consumedOps: Array.isArray(imported.consumedOps)
            ? imported.consumedOps.filter((o: unknown) => typeof o === 'string')
            : [],
        }
        const { groups: currentGroups } = getState()
        update({ groups: { ...currentGroups, [id]: appGroup }, activeGroupId: id })
      } catch {
        alert('Could not import group file. Check the file format.')
      }
    })
    input.click()
  })
}

// ── Nostr helpers ───────────────────────────────────────────────

/** Populate the identity block with pubkey from state. */
function populateNostrIdentity(): void {
  const el = document.getElementById('nostr-identity')
  if (!el) return

  const { identity } = getState()
  if (!identity?.pubkey) {
    el.innerHTML = `<span class="settings-hint">No identity available.</span>`
    return
  }

  const shortened = `${identity.pubkey.slice(0, 8)}…${identity.pubkey.slice(-8)}`
  el.innerHTML = `
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${escapeHtml(identity.pubkey)}">${escapeHtml(shortened)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `
}

/** Refresh the inline connection status text inside the Nostr settings panel. */
function updateNostrConnectionStatus(): void {
  const el = document.getElementById('nostr-conn-status')
  if (!el) return
  const count = getRelayCount()
  el.textContent = isConnected()
    ? `Connected to ${count} relay${count === 1 ? '' : 's'}`
    : 'Not connected'
}
