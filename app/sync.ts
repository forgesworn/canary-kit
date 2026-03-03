// app/sync.ts — Thin wiring layer between app actions and sync transport

import type { SyncTransport, SyncMessage } from 'canary-kit/sync'
import { applySyncMessage } from 'canary-kit/sync'
import { getState, updateGroup } from './state.js'

let _transport: SyncTransport | null = null
const _unsubscribers = new Map<string, () => void>()

/** Initialise the sync layer with a transport. Call once on startup. */
export function initSync(transport: SyncTransport): void {
  _transport = transport
}

/** Get the current transport (or null if not initialised). */
export function getTransport(): SyncTransport | null {
  return _transport
}

/**
 * Broadcast a sync message to all members of a group.
 * Called by action functions after applying local state changes.
 * Silently no-ops if sync is not initialised or group not found.
 */
export function broadcastAction(groupId: string, message: SyncMessage): void {
  if (!_transport) return
  const group = getState().groups[groupId]
  if (!group) return
  // Fire-and-forget — don't await, don't block the UI
  _transport.send(groupId, message, group.members).catch((err) => {
    console.warn('[canary:sync] broadcast failed:', err)
  })
}

/**
 * Subscribe to incoming sync messages for a group.
 * Applies received messages to group state via the pure applySyncMessage function.
 */
export function subscribeToGroup(groupId: string): void {
  if (!_transport) return
  // Unsubscribe from previous subscription if any
  _unsubscribers.get(groupId)?.()

  const unsub = _transport.subscribe(groupId, (msg, sender) => {
    const { groups } = getState()
    const group = groups[groupId]
    if (!group) return

    const updated = applySyncMessage(group, msg)
    if (updated !== group) {
      updateGroup(groupId, updated)
    }

    // App-layer side effects for fire-and-forget messages
    if (msg.type === 'beacon' || msg.type === 'duress-alert') {
      document.dispatchEvent(
        new CustomEvent('canary:sync-message', { detail: { groupId, message: msg, sender } }),
      )
    }
  })

  _unsubscribers.set(groupId, unsub)
}

/** Subscribe to all groups the user belongs to. */
export function subscribeToAllGroups(): void {
  const { groups } = getState()
  for (const id of Object.keys(groups)) {
    subscribeToGroup(id)
  }
}

/** Unsubscribe from all groups and disconnect the transport. */
export function teardownSync(): void {
  for (const unsub of _unsubscribers.values()) {
    unsub()
  }
  _unsubscribers.clear()
  _transport?.disconnect()
  _transport = null
}
