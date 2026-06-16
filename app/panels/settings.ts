// app/panels/settings.ts — Group settings drawer

import { getState, updateGroup, update } from '../state.js'
import { dedupeRelays, groupMode } from '../types.js'
import type { AppGroup, AppPersona } from '../types.js'
import { deleteGroup, reseedGroup, compromiseReseed, validateGroupImport } from '../actions/groups.js'
import { createPersona } from '../persona.js'
import { personaBadgeHtml } from '../components/persona-picker.js'
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

type GroupRelayMode = 'off' | 'read' | 'readwrite'

function cleanRelayList(urls: readonly string[] | undefined): string[] {
  return dedupeRelays((urls ?? []).filter(isAllowedRelayUrl))
}

function knownGroupRelays(group: Pick<AppGroup, 'knownRelays' | 'relays' | 'readRelays' | 'writeRelays'>): string[] {
  return dedupeRelays([
    ...cleanRelayList(group.knownRelays),
    ...cleanRelayList(group.relays),
    ...cleanRelayList(group.readRelays),
    ...cleanRelayList(group.writeRelays),
  ])
}

function groupRelayMode(group: Pick<AppGroup, 'readRelays' | 'writeRelays'>, url: string): GroupRelayMode {
  const read = cleanRelayList(group.readRelays).includes(url)
  const write = cleanRelayList(group.writeRelays).includes(url)
  if (read && write) return 'readwrite'
  if (read) return 'read'
  return 'off'
}

function shortRelayUrl(url: string): string {
  return url.replace(/^wss?:\/\//, '').replace(/\/$/, '')
}

function renderGroupRelayRows(group: AppGroup): string {
  const relays = knownGroupRelays(group)
  if (relays.length === 0) {
    return '<li class="login-relay-empty">No relays configured.</li>'
  }

  return relays.map((url) => {
    const mode = groupRelayMode(group, url)
    const enabled = mode !== 'off'
    const selectValue = mode === 'read' ? 'read' : 'readwrite'
    return `
      <li class="login-relay-item" data-group-relay-row="${escapeHtml(url)}">
        <button class="login-relay-toggle" data-group-relay-toggle="${escapeHtml(url)}" type="button" aria-pressed="${enabled}">${enabled ? 'On' : 'Off'}</button>
        <span class="login-relay-url" title="${escapeHtml(url)}">${escapeHtml(shortRelayUrl(url))}</span>
        <select class="input login-relay-mode" data-group-relay-mode="${escapeHtml(url)}" aria-label="Relay mode for ${escapeHtml(shortRelayUrl(url))}" ${enabled ? '' : 'disabled'}>
          <option value="readwrite"${selectValue === 'readwrite' ? ' selected' : ''}>Read/write</option>
          <option value="read"${selectValue === 'read' ? ' selected' : ''}>Read</option>
        </select>
        <button class="btn btn--ghost btn--sm login-relay-delete" data-group-relay-delete="${escapeHtml(url)}" type="button" aria-label="Delete relay">×</button>
      </li>
    `
  }).join('')
}

// ── Drawer state persistence across re-renders ─────────────────
// The settings panel is re-rendered on every state change, which would
// collapse the drawer. We persist the open/closed state here so it
// survives re-renders.
let _drawerOpen = false

/** Render the persona list items for the settings panel. */
function renderPersonaList(): string {
  const { personas } = getState()
  const entries = Object.values(personas)
  if (entries.length === 0) return '<li class="relay-item"><span class="settings-hint">No personas yet</span></li>'

  return entries.map((p: AppPersona) => {
    const shortNpub = p.npub.length > 16 ? `${p.npub.slice(0, 8)}\u2026${p.npub.slice(-4)}` : p.npub
    return `
      <li class="relay-item">
        ${personaBadgeHtml(p.name)}
        <span class="relay-url">${escapeHtml(p.displayName ?? p.name)}</span>
        <span class="settings-hint" style="margin-left: 0.25rem;">${escapeHtml(shortNpub)}</span>
        <button class="btn btn--ghost btn--sm persona-publish-btn" data-persona-id="${escapeHtml(p.id)}" title="Publish profile">Publish</button>
      </li>
    `
  }).join('')
}

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
          <span class="input-label">Emergency Alert Mode</span>
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

            <!-- Relay policy -->
            <div class="nostr-relays">
              <span class="input-label">Relays</span>
              <p class="settings-hint" style="margin: 0.25rem 0 0.5rem 0;">Choose which relays this group reads from and writes to.</p>
              <ul class="login-relay-list" id="group-relay-list">
                ${renderGroupRelayRows(group)}
              </ul>
              <div class="login-relay-add">
                <input
                  class="input login-relay-add__input"
                  id="group-relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="group-relay-add-btn">Add</button>
                <button class="btn btn--ghost btn--sm" id="group-relay-reset-btn">Reset</button>
              </div>
              <p class="settings-hint login-status-text" id="group-relay-status"></p>
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

        <!-- Personas -->
        <div class="settings-section">
          <span class="input-label">Personas</span>
          <ul class="relay-list" id="persona-list">
            ${renderPersonaList()}
          </ul>
          <div class="relay-add-row" style="margin-top: 0.5rem;">
            <input class="input relay-add-input" id="persona-name-input" type="text" placeholder="New persona name">
            <button class="btn btn--ghost btn--sm" id="persona-create-btn">Create</button>
          </div>
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

  function setGroupRelayMode(url: string, mode: GroupRelayMode): void {
    const normalised = dedupeRelays([url])[0] ?? url
    const current = getState().groups[activeGroupId!]
    if (!current) return

    const readRelays = cleanRelayList(current.readRelays).filter((relay) => relay !== normalised)
    const writeRelays = cleanRelayList(current.writeRelays).filter((relay) => relay !== normalised)

    if (mode === 'read' || mode === 'readwrite') {
      readRelays.push(normalised)
    }
    if (mode === 'readwrite') {
      writeRelays.push(normalised)
    }

    const nextWriteRelays = dedupeRelays(writeRelays)
    updateGroup(activeGroupId!, {
      knownRelays: dedupeRelays([...knownGroupRelays(current), normalised]),
      relays: nextWriteRelays,
      readRelays: dedupeRelays(readRelays),
      writeRelays: nextWriteRelays,
    })
    reconnectIfNeeded()
  }

  function deleteGroupRelay(url: string): void {
    const current = getState().groups[activeGroupId!]
    if (!current) return

    const knownRelays = knownGroupRelays(current).filter((relay) => relay !== url)
    const readRelays = cleanRelayList(current.readRelays).filter((relay) => relay !== url)
    const writeRelays = cleanRelayList(current.writeRelays).filter((relay) => relay !== url)

    updateGroup(activeGroupId!, {
      knownRelays,
      relays: writeRelays,
      readRelays,
      writeRelays,
    })
    reconnectIfNeeded()
  }

  function resetGroupRelays(): void {
    const { settings } = getState()
    const readRelays = cleanRelayList(settings.defaultReadRelays ?? settings.defaultRelays)
    const writeRelays = cleanRelayList(settings.defaultWriteRelays ?? settings.defaultRelays)
    updateGroup(activeGroupId!, {
      knownRelays: dedupeRelays([
        ...cleanRelayList(settings.knownRelays),
        ...readRelays,
        ...writeRelays,
      ]),
      relays: writeRelays,
      readRelays,
      writeRelays,
    })
    reconnectIfNeeded()
  }

  container.querySelectorAll<HTMLButtonElement>('[data-group-relay-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.groupRelayToggle
      if (!url) return
      const current = getState().groups[activeGroupId!]
      if (!current) return
      const nextMode: GroupRelayMode = groupRelayMode(current, url) === 'off' ? 'readwrite' : 'off'
      setGroupRelayMode(url, nextMode)
      showToast(`${shortRelayUrl(url)} ${nextMode === 'off' ? 'disabled' : 'enabled'}.`, 'info')
    })
  })

  container.querySelectorAll<HTMLSelectElement>('[data-group-relay-mode]').forEach(select => {
    select.addEventListener('change', () => {
      const url = select.dataset.groupRelayMode
      if (!url) return
      const mode = select.value === 'read' ? 'read' : 'readwrite'
      setGroupRelayMode(url, mode)
      showToast(`${shortRelayUrl(url)} set to ${mode === 'read' ? 'read only' : 'read/write'}.`, 'info')
    })
  })

  container.querySelectorAll<HTMLButtonElement>('[data-group-relay-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.groupRelayDelete
      if (!url) return
      deleteGroupRelay(url)
      showToast(`${shortRelayUrl(url)} deleted.`, 'info')
    })
  })

  document.getElementById('group-relay-add-btn')?.addEventListener('click', () => {
    const input = document.getElementById('group-relay-add-input') as HTMLInputElement | null
    const rawUrl = input?.value.trim()
    const url = rawUrl ? dedupeRelays([rawUrl])[0] ?? rawUrl : ''
    if (!url || !isAllowedRelayUrl(url)) { input?.focus(); return }
    setGroupRelayMode(url, 'readwrite')
    if (input) input.value = ''
    showToast(`${shortRelayUrl(url)} added.`, 'info')
  })

  document.getElementById('group-relay-reset-btn')?.addEventListener('click', () => {
    resetGroupRelays()
    showToast('Group relays reset to defaults.', 'info')
  })

  document.getElementById('group-relay-add-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('group-relay-add-btn')?.click()
  })

  // ── Populate Nostr identity on load ──────────────────────────

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
          beaconPrecision: typeof imported.beaconPrecision === 'number' && imported.beaconPrecision > 0 ? imported.beaconPrecision : 5,
          duressPrecision: typeof imported.duressPrecision === 'number' && imported.duressPrecision > 0 ? imported.duressPrecision : 9,
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

  // ── Persona create ──────────────────────────────────────────

  document.getElementById('persona-create-btn')?.addEventListener('click', () => {
    const input = document.getElementById('persona-name-input') as HTMLInputElement | null
    const name = input?.value.trim()
    if (!name) { input?.focus(); return }
    try {
      const appPersona = createPersona(name)
      const { personas } = getState()
      update({ personas: { ...personas, [name]: appPersona } })
      if (input) input.value = ''
      showToast(`Persona "${name}" created`, 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create persona.', 'error')
    }
  })

  document.getElementById('persona-name-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('persona-create-btn')?.click()
  })

  // ── Persona publish profile ─────────────────────────────────

  container.querySelectorAll<HTMLButtonElement>('.persona-publish-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const personaId = btn.dataset.personaId
      if (!personaId) return
      document.dispatchEvent(new CustomEvent('canary:publish-persona-profile', {
        detail: { personaId },
      }))
      const personaEntry = Object.values(getState().personas).find(p => p.id === personaId)
      showToast(`Publishing profile for "${personaEntry?.name ?? personaId}"…`, 'info')
    })
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
