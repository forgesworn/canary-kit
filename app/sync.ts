// app/sync.ts — Thin wiring layer between app actions and sync transport

import type { SyncTransport, SyncMessage } from 'canary-kit/sync'
import { applySyncMessage } from 'canary-kit/sync'
import { getState, updateGroup } from './state.js'
import { connectRelays, isConnected, getRelayCount } from './nostr/connect.js'
import { GroupSigner } from './nostr/signer.js'
import { NostrSyncTransport } from './nostr/adapter.js'
import { updateRelayStatus, flashSyncing } from './components/header.js'
import { showToast } from './components/toast.js'
import { recordCheckin, startLivenessHeartbeat, stopLivenessHeartbeat } from './components/liveness.js'

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
 * Ensure a sync transport is active for the given relays.
 * Creates one if none exists, then subscribes to the specified group.
 * Used by settings panel, invite acceptance, and startup.
 */
export async function ensureTransport(relays: string[], groupId?: string): Promise<void> {
  const { identity } = getState()
  if (!identity || relays.length === 0) return

  try {
    connectRelays(relays)

    if (!_transport) {
      const transport = new NostrSyncTransport(relays)
      initSync(transport)
    }

    if (groupId) {
      subscribeToGroup(groupId)
    }

    updateRelayStatus(isConnected(), getRelayCount())
    startLivenessHeartbeat()
  } catch (err) {
    console.warn('[canary:sync] ensureTransport failed:', err)
    updateRelayStatus(false, 0)
  }
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
  _transport.send(groupId, message).catch((err) => {
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

  // Register group key for encryption/decryption
  if (_transport instanceof NostrSyncTransport) {
    const { identity, groups } = getState()
    const group = groups[groupId]
    if (identity?.privkey && group?.seed) {
      const signer = new GroupSigner(group.seed, identity.privkey)
      ;(_transport as NostrSyncTransport).registerGroup(groupId, group.seed, signer)
    }
  }

  const unsub = _transport.subscribe(groupId, (msg, sender) => {
    const { groups } = getState()
    const group = groups[groupId]
    if (!group) return

    const updated = applySyncMessage(group, msg)
    if (updated !== group) {
      updateGroup(groupId, updated)
    }

    // Toast notifications for important sync events
    if (msg.type === 'member-join') {
      showToast('New member joined the group', 'success')
    } else if (msg.type === 'reseed') {
      showToast('Group secret was rotated', 'warning')
    } else if (msg.type === 'state-snapshot') {
      showToast('Group state synced', 'info')
    }

    // Record incoming liveness check-ins
    if (msg.type === 'liveness-checkin') {
      recordCheckin(groupId, msg.pubkey, msg.timestamp)
    }

    // Flash sync indicator
    flashSyncing()
    setTimeout(() => updateRelayStatus(isConnected(), getRelayCount()), 1500)

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
  stopLivenessHeartbeat()
  for (const unsub of _unsubscribers.values()) {
    unsub()
  }
  _unsubscribers.clear()
  _transport?.disconnect()
  _transport = null
}
