// app/sync.ts — Thin wiring layer between app actions and sync transport

import type { SyncTransport, SyncMessage } from 'canary-kit/sync'
import { applySyncMessage, FIRE_AND_FORGET_FRESHNESS_SEC } from 'canary-kit/sync'
import { getState, updateGroup } from './state.js'
import { connectRelays, isConnected, getRelayCount } from './nostr/connect.js'
import { GroupSigner } from './nostr/signer.js'
import { NostrSyncTransport } from './nostr/adapter.js'
import { updateRelayStatus, flashSyncing } from './components/header.js'
import { showToast } from './components/toast.js'
import { recordCheckin, startLivenessHeartbeat, stopLivenessHeartbeat } from './components/liveness.js'
import { drainDuressQueue } from './duress-queue.js'

let _transport: SyncTransport | null = null
const _unsubscribers = new Map<string, () => void>()

// ── Fire-and-forget opId dedup ───────────────────────────────
// Tracks seen opIds for duress-alert and beacon messages per group
// to prevent replayed messages from triggering side effects.
export const SEEN_OPID_CAP = 500
const _seenOpIds = new Map<string, string[]>()

export function isSeenOpId(groupId: string, opId: string): boolean {
  const seen = _seenOpIds.get(groupId)
  return seen ? seen.includes(opId) : false
}

export function recordOpId(groupId: string, opId: string): void {
  let seen = _seenOpIds.get(groupId)
  if (!seen) {
    seen = []
    _seenOpIds.set(groupId, seen)
  }
  if (seen.length >= SEEN_OPID_CAP) seen.shift()
  seen.push(opId)
}

/** Reset opId tracking (for tests). */
export function _resetSeenOpIds(): void {
  _seenOpIds.clear()
}

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
  if (!identity || !identity.privkey || relays.length === 0) return

  try {
    connectRelays(relays)

    if (!_transport) {
      initSync(new NostrSyncTransport(relays, identity.pubkey, identity.privkey))
    }

    if (groupId) {
      subscribeToGroup(groupId)
    }

    // Drain any queued duress alerts for this group
    if (groupId) {
      const queued = drainDuressQueue(groupId)
      for (const msg of queued) {
        broadcastAction(groupId, msg)
      }
    }

    updateRelayStatus(isConnected(), getRelayCount())
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
 * Re-register a group's encryption key with the transport after a reseed.
 * Unregisters the old key, then registers with the new seed so subsequent
 * broadcasts are encrypted under the new group key.
 */
export function reRegisterGroup(groupId: string): void {
  if (!(_transport instanceof NostrSyncTransport)) return
  const { identity, groups } = getState()
  const group = groups[groupId]
  if (!identity?.privkey || !group?.seed) return

  _transport.unregisterGroup(groupId)
  const signer = new GroupSigner(group.seed, identity.privkey)
  _transport.registerGroup(groupId, group.seed, signer, group.members, _recoveryOptions(groupId))
}

/** Build recovery callbacks for a group registration. */
function _recoveryOptions(groupId: string) {
  return {
    admins: getState().groups[groupId]?.admins ?? [],
    onRecoveryRequest: (requesterPubkey: string, _localEpoch: number, _localCounter: number): SyncMessage | null => {
      const { groups } = getState()
      const group = groups[groupId]
      if (!group) return null
      // Only respond if requester is a known member
      if (!group.members.includes(requesterPubkey)) return null
      // Build state-snapshot from current group state
      return {
        type: 'state-snapshot',
        seed: group.seed,
        counter: group.counter,
        usageOffset: group.usageOffset,
        members: group.members,
        admins: group.admins,
        epoch: group.epoch,
        opId: `recovery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Math.floor(Date.now() / 1000),
      }
    },
    onRecoveryResponse: (snapshot: SyncMessage, adminPubkey: string): void => {
      const { groups } = getState()
      const group = groups[groupId]
      if (!group) return

      // Higher-epoch recovery is disabled in applySyncMessage — only same-epoch
      // snapshots are accepted. The confirm() dialog is removed.
      const updated = applySyncMessage(group, snapshot, undefined, adminPubkey)
      if (updated !== group) {
        updateGroup(groupId, updated)
        reRegisterGroup(groupId)
        showToast('Group state recovered from admin', 'success')
      }
    },
  }
}

/**
 * Handle fire-and-forget side effects (liveness, beacon, duress) with
 * freshness gating and opId dedup. Extracted for testability.
 */
export function handleFireAndForget(
  groupId: string,
  msg: SyncMessage,
  sender: string | undefined,
  nowSec: number = Math.floor(Date.now() / 1000),
  dispatch: (groupId: string, msg: SyncMessage, sender: string | undefined) => void = _defaultDispatch,
): void {
  // Record incoming liveness check-ins (freshness-gated + opId dedup)
  if (msg.type === 'liveness-checkin') {
    if (!sender) return // no authenticated sender — suppress
    const elapsed = nowSec - msg.timestamp
    if (elapsed <= FIRE_AND_FORGET_FRESHNESS_SEC && elapsed >= -60) {
      if (!isSeenOpId(groupId, msg.opId)) {
        recordOpId(groupId, msg.opId)
        recordCheckin(groupId, sender, msg.timestamp)
      }
    }
    return
  }

  // App-layer side effects for fire-and-forget messages (with replay protection).
  if (msg.type === 'beacon' || msg.type === 'duress-alert') {
    const elapsed = nowSec - msg.timestamp
    if (elapsed > FIRE_AND_FORGET_FRESHNESS_SEC || elapsed < -60) return // stale or future — suppress

    if (isSeenOpId(groupId, msg.opId)) return // replay — suppress
    recordOpId(groupId, msg.opId)
    dispatch(groupId, msg, sender)
  }
}

function _defaultDispatch(groupId: string, msg: SyncMessage, sender: string | undefined): void {
  document.dispatchEvent(
    new CustomEvent('canary:sync-message', { detail: { groupId, message: msg, sender } }),
  )
}

/**
 * Subscribe to incoming sync messages for a group.
 * Applies received messages to group state via the pure applySyncMessage function.
 */
export function subscribeToGroup(groupId: string): void {
  if (!_transport) return
  // Unsubscribe from previous subscription if any
  _unsubscribers.get(groupId)?.()

  // Register group key for encryption/decryption and authorise members
  if (_transport instanceof NostrSyncTransport) {
    const { identity, groups } = getState()
    const group = groups[groupId]
    if (identity?.privkey && group?.seed) {
      const signer = new GroupSigner(group.seed, identity.privkey)
      ;(_transport as NostrSyncTransport).registerGroup(groupId, group.seed, signer, group.members, _recoveryOptions(groupId))
    }
  }

  const unsub = _transport.subscribe(groupId, (msg, sender) => {
    const { groups } = getState()
    const group = groups[groupId]
    if (!group) return

    const updated = applySyncMessage(group, msg, undefined, sender)
    if (updated !== group) {
      updateGroup(groupId, updated)
    }

    if (
      msg.type === 'member-join' ||
      msg.type === 'member-leave' ||
      msg.type === 'reseed' ||
      msg.type === 'state-snapshot'
    ) {
      reRegisterGroup(groupId)
    }

    // Dispatch custom event so the invite modal can react to new members
    if (msg.type === 'member-join' && updated !== group) {
      const joinerName = msg.pubkey
        ? (updated.memberNames?.[msg.pubkey] ?? sender?.slice(0, 8) ?? 'Someone')
        : 'Someone'
      document.dispatchEvent(
        new CustomEvent('canary:member-joined', {
          detail: { groupId, pubkey: msg.pubkey, name: joinerName },
        }),
      )
    }

    // Toast notifications for important sync events
    if (msg.type === 'member-join' && updated !== group) {
      const name = msg.pubkey
        ? (updated.memberNames?.[msg.pubkey] ?? sender?.slice(0, 8) ?? 'Someone')
        : 'Someone'
      showToast(`${name} joined the group`, 'success')
    } else if (msg.type === 'reseed') {
      showToast('Group secret was rotated', 'warning')
    } else if (msg.type === 'state-snapshot') {
      showToast('Group state recovered', 'success')
    }

    handleFireAndForget(groupId, msg, sender)

    // Flash sync indicator
    flashSyncing()
    setTimeout(() => updateRelayStatus(isConnected(), getRelayCount()), 1500)
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
