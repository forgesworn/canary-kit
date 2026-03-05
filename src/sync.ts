// Transport-agnostic sync message protocol

export { deriveGroupKey, deriveGroupSigningKey, hashGroupTag, encryptEnvelope, decryptEnvelope } from './sync-crypto.js'

import { bytesToHex, hexToBytes } from './crypto.js'
import type { GroupState } from './group.js'
import { addMember, removeMember } from './group.js'

// ── Message types ─────────────────────────────────────────────

/** A typed, serialisable description of a group state change. */
export type SyncMessage =
  | { type: 'member-join'; pubkey: string; timestamp: number; epoch: number; opId: string; protocolVersion?: number }
  | { type: 'member-leave'; pubkey: string; timestamp: number; epoch?: number; opId?: string; protocolVersion?: number }
  | { type: 'counter-advance'; counter: number; usageOffset: number; timestamp: number; protocolVersion?: number }
  | { type: 'reseed'; seed: Uint8Array; counter: number; timestamp: number; epoch: number; opId: string; admins: string[]; members: string[]; protocolVersion?: number }
  | { type: 'beacon'; lat: number; lon: number; accuracy: number; timestamp: number; opId: string; protocolVersion?: number }
  | { type: 'duress-alert'; lat: number; lon: number; timestamp: number; opId: string; protocolVersion?: number }
  | { type: 'liveness-checkin'; pubkey: string; timestamp: number; opId: string; protocolVersion?: number }
  | { type: 'state-snapshot'; seed: string; counter: number; usageOffset: number; members: string[]; timestamp: number; protocolVersion?: number }

const VALID_TYPES = new Set<string>([
  'member-join', 'member-leave', 'counter-advance',
  'reseed', 'beacon', 'duress-alert', 'liveness-checkin', 'state-snapshot',
])

/** 64-character lowercase hex string (32 bytes — Nostr pubkey or CANARY seed). */
const HEX_64_RE = /^[0-9a-f]{64}$/
const MAX_COUNTER_ADVANCE_OFFSET = 100
const MAX_BEACON_ACCURACY_METERS = 20_000_000

/** Maximum age (in seconds) for fire-and-forget messages before they are dropped. */
export const FIRE_AND_FORGET_FRESHNESS_SEC = 300

/** Maximum allowed future skew (in seconds) for fire-and-forget timestamps. */
export const MAX_FUTURE_SKEW_SEC = 60

/** Maximum consumedOps entries per epoch before oldest are evicted. */
const MAX_CONSUMED_OPS = 1000

function appendConsumedOp(ops: string[], opId: string): string[] {
  const next = [...ops, opId]
  return next.length > MAX_CONSUMED_OPS ? next.slice(-MAX_CONSUMED_OPS) : next
}

/** Current protocol version. Bump on any breaking wire format change. */
export const PROTOCOL_VERSION = 1

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNonNegativeInt(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0
}

// ── Serialisation ─────────────────────────────────────────────

/**
 * Encode a sync message as a JSON string for transport.
 * Binary fields (seed) are hex-encoded for safe JSON round-tripping.
 */
export function encodeSyncMessage(msg: SyncMessage): string {
  const versioned = { ...msg, protocolVersion: PROTOCOL_VERSION }
  if (msg.type === 'reseed') {
    const { seed, ...rest } = versioned as typeof msg & { protocolVersion: number }
    return JSON.stringify({ ...rest, seed: bytesToHex(msg.seed) })
  }
  return JSON.stringify(versioned)
}

/**
 * Recursively produce a JSON string with sorted keys and no whitespace.
 * Handles nested objects, arrays (elements stringified recursively), and
 * all JSON-safe primitives. Used for deterministic signing (H2).
 */
export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean' || typeof value === 'number') return JSON.stringify(value)
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']'
  }
  if (value instanceof Uint8Array) {
    throw new Error('stableStringify: Uint8Array must be hex-encoded before serialisation')
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj).sort()
    const pairs = keys
      .filter(k => obj[k] !== undefined)
      .map(k => JSON.stringify(k) + ':' + stableStringify(obj[k]))
    return '{' + pairs.join(',') + '}'
  }
  throw new Error(`stableStringify: unsupported type ${typeof value}`)
}

/**
 * Return the canonical string representation of a sync message for signing.
 * Keys are sorted recursively, no whitespace. Binary fields are hex-encoded.
 * The message's protocolVersion field is preserved as-is — the send side
 * (encodeSyncMessage) is responsible for injecting PROTOCOL_VERSION before
 * both encode and sign, so the canonical bytes always reflect the actual
 * wire value. This is the format that inner signatures are computed over (H2).
 */
export function canonicaliseSyncMessage(msg: SyncMessage): string {
  if (msg.type === 'reseed') {
    const { seed, ...rest } = msg
    return stableStringify({ ...rest, seed: bytesToHex(seed) })
  }
  return stableStringify(msg)
}

/**
 * Decode a sync message from a JSON string.
 * Throws on invalid or unrecognised messages.
 */
export function decodeSyncMessage(payload: string): SyncMessage {
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(payload)
  } catch {
    throw new Error('Invalid sync message: not valid JSON')
  }

  const type = parsed.type
  if (typeof type !== 'string' || !VALID_TYPES.has(type)) {
    throw new Error(`Invalid sync message type: ${String(type)}`)
  }

  // Per-type field validation
  const ts = parsed.timestamp
  if (!isNonNegativeInt(ts)) {
    throw new Error(`Invalid sync message: missing or invalid timestamp`)
  }

  // Protocol version check (H1: hard cutover, exact match only)
  const version = parsed.protocolVersion
  if (version === undefined || version === null) {
    throw new Error('Invalid sync message: protocolVersion is required')
  }
  if (version !== PROTOCOL_VERSION) {
    throw new Error(`Unsupported protocol version: ${version} (expected: ${PROTOCOL_VERSION})`)
  }

  switch (type) {
    case 'member-join':
      if (typeof parsed.pubkey !== 'string' || !HEX_64_RE.test(parsed.pubkey)) {
        throw new Error('Invalid sync message: member-join requires a 64-char hex pubkey')
      }
      // member-join always requires epoch and opId (privileged action)
      if (!isNonNegativeInt(parsed.epoch)) {
        throw new Error('Invalid sync message: member-join requires a non-negative epoch')
      }
      if (typeof parsed.opId !== 'string' || parsed.opId.length === 0 || parsed.opId.length > 128) {
        throw new Error('Invalid sync message: member-join requires a non-empty opId (max 128 chars)')
      }
      break

    case 'member-leave':
      if (typeof parsed.pubkey !== 'string' || !HEX_64_RE.test(parsed.pubkey)) {
        throw new Error('Invalid sync message: member-leave requires a 64-char hex pubkey')
      }
      // epoch/opId optional (only required when removing another member)
      if (parsed.epoch !== undefined && !isNonNegativeInt(parsed.epoch)) {
        throw new Error('Invalid sync message: member-leave.epoch must be a non-negative integer')
      }
      if (parsed.opId !== undefined && (typeof parsed.opId !== 'string' || parsed.opId.length === 0 || parsed.opId.length > 128)) {
        throw new Error('Invalid sync message: member-leave.opId must be a non-empty string (max 128 chars)')
      }
      break

    case 'liveness-checkin':
      if (typeof parsed.pubkey !== 'string' || !HEX_64_RE.test(parsed.pubkey)) {
        throw new Error('Invalid sync message: liveness-checkin requires a 64-char hex pubkey')
      }
      if (typeof parsed.opId !== 'string' || parsed.opId.length === 0 || parsed.opId.length > 128) {
        throw new Error('Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)')
      }
      break

    case 'counter-advance':
      if (!isNonNegativeInt(parsed.counter)) {
        throw new Error('Invalid sync message: counter-advance requires a non-negative counter')
      }
      if (!isNonNegativeInt(parsed.usageOffset)) {
        throw new Error('Invalid sync message: counter-advance requires a non-negative usageOffset')
      }
      break

    case 'reseed':
      if (typeof parsed.seed !== 'string' || !HEX_64_RE.test(parsed.seed)) {
        throw new Error('Invalid sync message: reseed.seed must be a 64-char hex string')
      }
      if (!isNonNegativeInt(parsed.counter)) {
        throw new Error('Invalid sync message: reseed requires a non-negative counter')
      }
      if (!isNonNegativeInt(parsed.epoch)) {
        throw new Error('Invalid sync message: reseed requires a non-negative epoch')
      }
      if (typeof parsed.opId !== 'string' || parsed.opId.length === 0 || parsed.opId.length > 128) {
        throw new Error('Invalid sync message: reseed requires a non-empty opId (max 128 chars)')
      }
      if (!Array.isArray(parsed.admins) || !parsed.admins.every((a: unknown) => typeof a === 'string' && HEX_64_RE.test(a))) {
        throw new Error('Invalid sync message: reseed.admins must be 64-char hex pubkeys')
      }
      if (!Array.isArray(parsed.members) || !parsed.members.every((m: unknown) => typeof m === 'string' && HEX_64_RE.test(m))) {
        throw new Error('Invalid sync message: reseed.members must be 64-char hex pubkeys')
      }
      return {
        type, seed: hexToBytes(parsed.seed), counter: parsed.counter, timestamp: ts,
        epoch: parsed.epoch, opId: parsed.opId,
        admins: [...parsed.admins], members: [...parsed.members],
      }

    case 'beacon':
      if (!isFiniteNumber(parsed.lat) || !isFiniteNumber(parsed.lon)) {
        throw new Error('Invalid sync message: beacon requires numeric lat and lon')
      }
      if (parsed.lat < -90 || parsed.lat > 90 || parsed.lon < -180 || parsed.lon > 180) {
        throw new Error('Invalid sync message: beacon lat/lon out of range')
      }
      if (!isFiniteNumber(parsed.accuracy) || parsed.accuracy < 0 || parsed.accuracy > MAX_BEACON_ACCURACY_METERS) {
        throw new Error('Invalid sync message: beacon requires a non-negative accuracy')
      }
      if (typeof parsed.opId !== 'string' || parsed.opId.length === 0 || parsed.opId.length > 128) {
        throw new Error('Invalid sync message: beacon requires a non-empty opId (max 128 chars)')
      }
      break

    case 'duress-alert':
      if (!isFiniteNumber(parsed.lat) || !isFiniteNumber(parsed.lon)) {
        throw new Error('Invalid sync message: duress-alert requires numeric lat and lon')
      }
      if (parsed.lat < -90 || parsed.lat > 90 || parsed.lon < -180 || parsed.lon > 180) {
        throw new Error('Invalid sync message: duress-alert lat/lon out of range')
      }
      if (typeof parsed.opId !== 'string' || parsed.opId.length === 0 || parsed.opId.length > 128) {
        throw new Error('Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)')
      }
      break

    case 'state-snapshot':
      if (typeof parsed.seed !== 'string' || !HEX_64_RE.test(parsed.seed)) {
        throw new Error('Invalid sync message: state-snapshot requires a 64-char hex seed')
      }
      if (!isNonNegativeInt(parsed.counter)) {
        throw new Error('Invalid sync message: state-snapshot requires a non-negative counter')
      }
      if (!isNonNegativeInt(parsed.usageOffset)) {
        throw new Error('Invalid sync message: state-snapshot requires a non-negative usageOffset')
      }
      if (!Array.isArray(parsed.members) || !parsed.members.every((m: unknown) => typeof m === 'string' && HEX_64_RE.test(m))) {
        throw new Error('Invalid sync message: state-snapshot members must be 64-char hex pubkeys')
      }
      break
  }

  return parsed as SyncMessage
}

// ── State application ─────────────────────────────────────────

/**
 * Determine whether a sync message type is privileged (requires admin sender).
 * member-join is ALWAYS privileged. member-leave is privileged when target !== sender.
 * Self-leave is NOT privileged — a member can always remove themselves.
 */
function isPrivilegedAction(msg: SyncMessage, sender?: string): boolean {
  if (msg.type === 'reseed') return true
  if (msg.type === 'member-join') return true
  if (msg.type === 'member-leave' && msg.pubkey !== sender) return true
  return false
}

/**
 * Apply a sync message to group state.
 * Returns a new GroupState with the change applied.
 * Beacons and duress alerts don't modify group state (fire-and-forget).
 *
 * Authority invariants (I1–I6) are enforced for privileged actions.
 * Privileged actions without a sender are rejected (fail-closed).
 */
export function applySyncMessage(
  group: GroupState,
  msg: SyncMessage,
  nowSec: number = Math.floor(Date.now() / 1000),
  sender?: string,
): GroupState {
  // ── Authority checks (I1, I2, I3, I4, I6) ──────────────────
  if (isPrivilegedAction(msg, sender)) {
    // Fail-closed: no sender → reject privileged action
    if (!sender) return group

    // I1: sender must be in admins
    if (!group.admins.includes(sender)) return group

    const msgEpoch = (msg as { epoch?: number }).epoch
    const msgOpId = (msg as { opId?: string }).opId

    // Strict: privileged ops require epoch and opId
    if (msgEpoch === undefined || msgOpId === undefined) return group

    // I6: stale epoch — drop
    if (msgEpoch < group.epoch) return group

    if (msg.type === 'reseed') {
      // I4: reseed must have msg.epoch == local.epoch + 1
      if (msgEpoch !== group.epoch + 1) return group

      // I4: reseed must carry admins and members
      const reseedMsg = msg as { admins?: string[]; members?: string[] }
      if (!reseedMsg.admins || !reseedMsg.members) return group

      // Enforce admins ⊆ members
      const memberSet = new Set(reseedMsg.members)
      if (!reseedMsg.admins.every(a => memberSet.has(a))) return group
    } else {
      // I3: non-reseed privileged ops must have msg.epoch == local.epoch
      if (msgEpoch !== group.epoch) return group
    }

    // I2: opId must not be consumed in current epoch
    // reseed starts a new epoch so its opId is not subject to the current-epoch replay guard
    if (msg.type !== 'reseed') {
      const consumedSet = new Set(group.consumedOps)
      if (consumedSet.has(msgOpId)) return group
    }
  }

  // ── Freshness gate for fire-and-forget messages ────────────
  // Drop stale duress-alert/beacon/liveness-checkin messages to prevent replay.
  if (msg.type === 'duress-alert' || msg.type === 'beacon' || msg.type === 'liveness-checkin') {
    const elapsed = nowSec - msg.timestamp
    if (elapsed > FIRE_AND_FORGET_FRESHNESS_SEC) return group   // stale
    if (elapsed < -MAX_FUTURE_SKEW_SEC) return group             // too far in the future
  }

  switch (msg.type) {
    case 'member-join': {
      const updated = addMember(group, msg.pubkey)
      return { ...updated, consumedOps: appendConsumedOp(updated.consumedOps, msg.opId) }
    }

    case 'member-leave':
      // Replay guard: if the pubkey is not a current member, ignore the message
      if (!group.members.includes(msg.pubkey)) return group
      {
        const updated = removeMember(group, msg.pubkey)
        if (msg.epoch !== undefined && msg.opId !== undefined) {
          return { ...updated, consumedOps: appendConsumedOp(updated.consumedOps, msg.opId) }
        }
        return updated
      }

    case 'counter-advance': {
      // Monotonic: only advance, never retreat
      const currentEffective = group.counter + group.usageOffset
      const incomingEffective = msg.counter + msg.usageOffset
      if (incomingEffective <= currentEffective) return group

      // Bound forward jumps to limit desync damage from malicious/compromised senders.
      const timeBasedCounter = Math.floor(nowSec / group.rotationInterval)
      const maxAllowedEffective = timeBasedCounter + MAX_COUNTER_ADVANCE_OFFSET
      if (incomingEffective > maxAllowedEffective) return group

      return { ...group, counter: msg.counter, usageOffset: msg.usageOffset }
    }

    case 'reseed':
      // I4: atomic replacement of {seed, members, admins, epoch} + clear consumedOps
      return {
        ...group,
        seed: bytesToHex(msg.seed),
        counter: msg.counter,
        usageOffset: 0,
        members: [...msg.members],
        admins: [...msg.admins],
        epoch: msg.epoch,
        consumedOps: [msg.opId],
      }

    case 'state-snapshot':
      // Containment: disable remote full-state overwrite until epoch/version
      // semantics are formalised and enforced.
      return group

    case 'beacon':
    case 'duress-alert':
    case 'liveness-checkin':
      return group

    default:
      return group
  }
}

// ── Transport interface ───────────────────────────────────────

/** Minimal interface any sync transport must implement. */
export interface SyncTransport {
  /** Send a sync message to all group members. */
  send(groupId: string, message: SyncMessage, recipients?: string[]): Promise<void>
  /** Subscribe to incoming messages for a group. Returns an unsubscribe function. */
  subscribe(groupId: string, onMessage: (msg: SyncMessage, sender: string) => void): () => void
  /** Clean up all connections. */
  disconnect(): void
}

// ── Signer interface ──────────────────────────────────────────

/** Abstracts event signing and NIP-44 encryption for any transport that needs it. */
export interface EventSigner {
  /** The signer's public key (hex). */
  pubkey: string
  /** Sign an unsigned event. Parameter and return are `unknown` to avoid coupling to any specific event library's types. */
  sign(event: unknown): Promise<unknown>
  /** NIP-44 encrypt plaintext for a recipient. */
  encrypt(plaintext: string, recipientPubkey: string): Promise<string>
  /** NIP-44 decrypt ciphertext from a sender. */
  decrypt(ciphertext: string, senderPubkey: string): Promise<string>
}
