// Transport-agnostic sync message protocol

import { bytesToHex, hexToBytes } from './crypto.js'

// ── Message types ─────────────────────────────────────────────

/** A typed, serialisable description of a group state change. */
export type SyncMessage =
  | { type: 'member-join'; pubkey: string; timestamp: number }
  | { type: 'member-leave'; pubkey: string; timestamp: number }
  | { type: 'counter-advance'; counter: number; usageOffset: number; timestamp: number }
  | { type: 'reseed'; seed: Uint8Array; counter: number; timestamp: number }
  | { type: 'beacon'; lat: number; lon: number; accuracy: number; timestamp: number }
  | { type: 'duress-alert'; lat: number; lon: number; timestamp: number }

const VALID_TYPES = new Set<string>([
  'member-join', 'member-leave', 'counter-advance',
  'reseed', 'beacon', 'duress-alert',
])

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

  if (type === 'reseed') {
    if (typeof parsed.seed !== 'string') {
      throw new Error('Invalid sync message: reseed.seed must be a hex string')
    }
    return { ...parsed, seed: hexToBytes(parsed.seed) } as SyncMessage
  }

  return parsed as SyncMessage
}

// ── Transport interface ───────────────────────────────────────

/** Minimal interface any sync transport must implement. */
export interface SyncTransport {
  /** Send a sync message to all group members. */
  send(groupId: string, message: SyncMessage, recipients: string[]): Promise<void>
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
