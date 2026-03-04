// Transport-agnostic sync message protocol

export { deriveGroupKey, deriveGroupSigningKey, hashGroupTag, encryptEnvelope, decryptEnvelope } from './sync-crypto.js'

import { bytesToHex, hexToBytes } from './crypto.js'
import type { GroupState } from './group.js'
import { addMember, removeMember } from './group.js'

// ── Message types ─────────────────────────────────────────────

/** A typed, serialisable description of a group state change. */
export type SyncMessage =
  | { type: 'member-join'; pubkey: string; timestamp: number }
  | { type: 'member-leave'; pubkey: string; timestamp: number }
  | { type: 'counter-advance'; counter: number; usageOffset: number; timestamp: number }
  | { type: 'reseed'; seed: Uint8Array; counter: number; timestamp: number }
  | { type: 'beacon'; lat: number; lon: number; accuracy: number; timestamp: number }
  | { type: 'duress-alert'; lat: number; lon: number; timestamp: number }
  | { type: 'liveness-checkin'; pubkey: string; timestamp: number }
  | { type: 'state-snapshot'; seed: string; counter: number; usageOffset: number; members: string[]; timestamp: number }

const VALID_TYPES = new Set<string>([
  'member-join', 'member-leave', 'counter-advance',
  'reseed', 'beacon', 'duress-alert', 'liveness-checkin', 'state-snapshot',
])

/** 64-character lowercase hex string (32 bytes — Nostr pubkey or CANARY seed). */
const HEX_64_RE = /^[0-9a-f]{64}$/

// ── Serialisation ─────────────────────────────────────────────

/**
 * Encode a sync message as a JSON string for transport.
 * Binary fields (seed) are hex-encoded for safe JSON round-tripping.
 */
export function encodeSyncMessage(msg: SyncMessage): string {
  if (msg.type === 'reseed') {
    return JSON.stringify({ ...msg, seed: bytesToHex(msg.seed) })
  }
  return JSON.stringify(msg)
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
  if (typeof ts !== 'number' || ts < 0) {
    throw new Error(`Invalid sync message: missing or invalid timestamp`)
  }

  switch (type) {
    case 'member-join':
    case 'member-leave':
    case 'liveness-checkin':
      if (typeof parsed.pubkey !== 'string' || !HEX_64_RE.test(parsed.pubkey)) {
        throw new Error(`Invalid sync message: ${type} requires a 64-char hex pubkey`)
      }
      break

    case 'counter-advance':
      if (typeof parsed.counter !== 'number' || parsed.counter < 0) {
        throw new Error('Invalid sync message: counter-advance requires a non-negative counter')
      }
      if (typeof parsed.usageOffset !== 'number' || parsed.usageOffset < 0) {
        throw new Error('Invalid sync message: counter-advance requires a non-negative usageOffset')
      }
      break

    case 'reseed':
      if (typeof parsed.seed !== 'string' || !HEX_64_RE.test(parsed.seed)) {
        throw new Error('Invalid sync message: reseed.seed must be a 64-char hex string')
      }
      if (typeof parsed.counter !== 'number' || parsed.counter < 0) {
        throw new Error('Invalid sync message: reseed requires a non-negative counter')
      }
      return { type, seed: hexToBytes(parsed.seed), counter: parsed.counter, timestamp: ts }

    case 'beacon':
      if (typeof parsed.lat !== 'number' || typeof parsed.lon !== 'number') {
        throw new Error('Invalid sync message: beacon requires numeric lat and lon')
      }
      if (typeof parsed.accuracy !== 'number' || parsed.accuracy < 0) {
        throw new Error('Invalid sync message: beacon requires a non-negative accuracy')
      }
      break

    case 'duress-alert':
      if (typeof parsed.lat !== 'number' || typeof parsed.lon !== 'number') {
        throw new Error('Invalid sync message: duress-alert requires numeric lat and lon')
      }
      break

    case 'state-snapshot':
      if (typeof parsed.seed !== 'string' || !HEX_64_RE.test(parsed.seed)) {
        throw new Error('Invalid sync message: state-snapshot requires a 64-char hex seed')
      }
      if (typeof parsed.counter !== 'number' || parsed.counter < 0) {
        throw new Error('Invalid sync message: state-snapshot requires a non-negative counter')
      }
      if (typeof parsed.usageOffset !== 'number' || parsed.usageOffset < 0) {
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
 * Apply a sync message to group state.
 * Pure function — returns a new GroupState with the change applied.
 * Beacons and duress alerts don't modify group state (fire-and-forget).
 */
export function applySyncMessage(group: GroupState, msg: SyncMessage): GroupState {
  switch (msg.type) {
    case 'member-join':
      return addMember(group, msg.pubkey)

    case 'member-leave':
      return removeMember(group, msg.pubkey)

    case 'counter-advance': {
      // Monotonic: only advance, never retreat
      const currentEffective = group.counter + group.usageOffset
      const incomingEffective = msg.counter + msg.usageOffset
      if (incomingEffective <= currentEffective) return group
      return { ...group, counter: msg.counter, usageOffset: msg.usageOffset }
    }

    case 'reseed':
      // GroupState.seed is a hex string; SyncMessage.reseed.seed is Uint8Array
      return { ...group, seed: bytesToHex(msg.seed), counter: msg.counter, usageOffset: 0 }

    case 'state-snapshot':
      return {
        ...group,
        seed: msg.seed,
        counter: msg.counter,
        usageOffset: msg.usageOffset,
        members: [...msg.members],
      }

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
