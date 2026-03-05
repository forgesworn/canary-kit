// app/state.ts — Observable application state with subscriber pattern

import type { AppState } from './types.js'

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
    defaultRelays: ['wss://relay.trotters.cc/'],
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
