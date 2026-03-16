// app/state.ts — Observable application state with subscriber pattern

import type { AppState } from './types.js'
import { WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY } from './types.js'

// ── Default state ──────────────────────────────────────────────

const DEFAULT_STATE: AppState = {
  view: 'groups',
  groups: {},
  activeGroupId: null,
  identity: null,
  settings: {
    theme: 'dark',
    pinEnabled: false,
    autoLockMinutes: 5,
    defaultRelays: [DEFAULT_WRITE_RELAY],
    defaultReadRelays: [...WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY],
    defaultWriteRelays: [DEFAULT_WRITE_RELAY],
  },
}

// ── Internal state ─────────────────────────────────────────────

let _state: AppState = structuredClone(DEFAULT_STATE)
const _listeners = new Set<() => void>()

function _notify(): void {
  for (const fn of _listeners) {
    try {
      fn()
    } catch (err) {
      console.error('[canary:state] subscriber threw:', err)
    }
  }
}

// ── Public API ─────────────────────────────────────────────────

/** Return the current state. The returned object must not be mutated. */
export function getState(): Readonly<AppState> {
  return _state
}

/** Shallow-merge a partial update into the root state and notify listeners. */
export function update(partial: Partial<AppState>): void {
  _state = { ..._state, ...partial }
  _notify()
}

/** Update a single group by id, shallow-merging the provided fields. */
export function updateGroup(
  id: string,
  partial: Partial<AppState['groups'][string]>,
): void {
  const group = _state.groups[id]
  if (!group) {
    console.warn(`[canary:state] updateGroup: unknown group id "${id}"`)
    return
  }
  _state = {
    ..._state,
    groups: {
      ..._state.groups,
      [id]: { ...group, ...partial },
    },
  }
  _notify()
}

/**
 * Subscribe to state changes.
 * The callback is invoked after every `update` or `loadState` call.
 * Returns an unsubscribe function.
 */
export function subscribe(fn: () => void): () => void {
  _listeners.add(fn)
  return () => {
    _listeners.delete(fn)
  }
}

/**
 * Replace the entire state (e.g. when restoring from persistence).
 * Notifies all listeners.
 */
export function loadState(loaded: AppState): void {
  _state = loaded
  _notify()
}

/**
 * Clear sensitive material from the in-memory state on lock.
 * Seeds, private keys, and mnemonics are wiped so a heap dump after
 * auto-lock cannot extract secrets. State is restored from encrypted
 * localStorage on unlock.
 */
export function clearSensitiveState(): void {
  const scrubbed = { ..._state }
  // Wipe identity secrets
  if (scrubbed.identity) {
    scrubbed.identity = { ...scrubbed.identity, privkey: '', mnemonic: undefined, nsec: undefined }
  }
  // Wipe group seeds
  const groups: typeof scrubbed.groups = {}
  for (const [id, g] of Object.entries(scrubbed.groups)) {
    groups[id] = { ...g, seed: '' }
  }
  scrubbed.groups = groups
  _state = scrubbed
  _notify()
}
