// app/panels/settings.ts — Group settings drawer

import { getState, updateGroup, update } from '../state.js'
import { deleteGroup, reseedGroup } from '../actions/groups.js'
import { connectRelays, disconnectRelays, isConnected, getRelayCount } from '../nostr/connect.js'
import { subscribeToGroup, teardownSync } from '../sync.js'
import { hasNip07 } from '../nostr/signer.js'
import { updateRelayStatus } from '../components/header.js'

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

  container.innerHTML = `
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${_drawerOpen ? 'transform: rotate(90deg);' : ''}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${_drawerOpen ? '' : ' hidden'}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${group.name}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${group.rotationInterval === 86400 ? 'segmented__btn--active' : ''}" data-interval="86400">24h</button>
            <button class="segmented__btn ${group.rotationInterval === 604800 ? 'segmented__btn--active' : ''}" data-interval="604800">7d</button>
            <button class="segmented__btn ${group.rotationInterval === 2592000 ? 'segmented__btn--active' : ''}" data-interval="2592000">30d</button>
          </div>
        </div>

        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${group.wordCount === 1 ? 'segmented__btn--active' : ''}" data-words="1">1</button>
            <button class="segmented__btn ${group.wordCount === 2 ? 'segmented__btn--active' : ''}" data-words="2">2</button>
            <button class="segmented__btn ${group.wordCount === 3 ? 'segmented__btn--active' : ''}" data-words="3">3</button>
          </div>
        </div>

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${group.encodingFormat === 'words' ? 'segmented__btn--active' : ''}" data-enc="words">Word</button>
            <button class="segmented__btn ${group.encodingFormat === 'pin' ? 'segmented__btn--active' : ''}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${group.encodingFormat === 'hex' ? 'segmented__btn--active' : ''}" data-enc="hex">Hex</button>
          </div>
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

            <!-- Relay list -->
            <div class="nostr-relays">
              <span class="input-label">Relays</span>
              <ul class="relay-list" id="relay-list">
                ${(group.relays ?? []).map((url, i) => `
                  <li class="relay-item">
                    <span class="relay-url">${url}</span>
                    <button class="btn btn--ghost btn--sm relay-remove" data-relay-index="${i}" aria-label="Remove relay">✕</button>
                  </li>
                `).join('')}
              </ul>
              <div class="relay-add-row">
                <input
                  class="input relay-add-input"
                  id="relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="relay-add-btn">Add</button>
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
          <button class="btn btn--warning" id="reseed-btn">Emergency Reseed</button>
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

  // ── Nostr toggle ─────────────────────────────────────────────

  document.getElementById('nostr-toggle')!.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked
    updateGroup(activeGroupId!, { nostrEnabled: enabled })
    const nostrPanel = document.getElementById('nostr-settings')!
    nostrPanel.hidden = !enabled

    if (enabled) {
      const relays = getState().groups[activeGroupId!]?.relays ?? []
      void connectRelays(relays).then(() => {
        updateRelayStatus(isConnected(), getRelayCount())
        updateNostrConnectionStatus()
        if (activeGroupId) subscribeToGroup(activeGroupId)
      })
      void populateNostrIdentity()
    } else {
      teardownSync()
      void disconnectRelays().then(() => {
        updateRelayStatus(false, 0)
        updateNostrConnectionStatus()
      })
    }
  })

  // ── Relay management ──────────────────────────────────────────

  // Remove a relay by index.
  container.querySelectorAll<HTMLButtonElement>('.relay-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.relayIndex)
      const relays = [...(getState().groups[activeGroupId!]?.relays ?? [])]
      relays.splice(idx, 1)
      updateGroup(activeGroupId!, { relays })
      // Reconnect with updated relay list if Nostr is enabled.
      if (getState().groups[activeGroupId!]?.nostrEnabled) {
        void connectRelays(relays).then(() => {
          updateRelayStatus(isConnected(), getRelayCount())
          if (activeGroupId) subscribeToGroup(activeGroupId)
        })
      }
    })
  })

  // Add a relay.
  document.getElementById('relay-add-btn')!.addEventListener('click', () => {
    const input = document.getElementById('relay-add-input') as HTMLInputElement
    const url = input.value.trim()
    if (!url.startsWith('wss://') && !url.startsWith('ws://')) {
      input.focus()
      return
    }
    const relays = [...(getState().groups[activeGroupId!]?.relays ?? [])]
    if (!relays.includes(url)) {
      relays.push(url)
      updateGroup(activeGroupId!, { relays })
      input.value = ''
      if (getState().groups[activeGroupId!]?.nostrEnabled) {
        void connectRelays(relays).then(() => {
          updateRelayStatus(isConnected(), getRelayCount())
          if (activeGroupId) subscribeToGroup(activeGroupId)
        })
      }
    } else {
      input.value = ''
    }
  })

  // Allow adding via Enter key.
  document.getElementById('relay-add-input')!.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('relay-add-btn')!.click()
    }
  })

  // ── Populate NIP-07 identity on load ─────────────────────────

  if (group.nostrEnabled) {
    void populateNostrIdentity()
  }

  // ── Emergency reseed ─────────────────────────────────────────

  document.getElementById('reseed-btn')!.addEventListener('click', () => {
    if (confirm('Emergency reseed? This generates a new seed. All members will need new invites.')) {
      reseedGroup(activeGroupId!)
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
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const imported = JSON.parse(text)
        if (!imported.seed || !imported.name || !imported.members) {
          throw new Error('Invalid group file')
        }
        const id = crypto.randomUUID()
        const appGroup = {
          ...imported,
          id,
          nostrEnabled: false,
          relays: [],
          encodingFormat: imported.encodingFormat ?? 'words',
          usedInvites: [],
          livenessInterval: imported.rotationInterval,
          livenessCheckins: {},
          tolerance: imported.tolerance ?? 1,
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

  const signerLabel = hasNip07() ? 'NIP-07' : 'Local key'
  const shortened = `${identity.pubkey.slice(0, 8)}…${identity.pubkey.slice(-8)}`
  el.innerHTML = `
    <div class="nostr-identity-row">
      <span class="input-label">Identity (${signerLabel})</span>
      <span class="relay-url nostr-pubkey" title="${identity.pubkey}">${shortened}</span>
    </div>
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
