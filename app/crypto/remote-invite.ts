// app/crypto/remote-invite.ts — Secure remote invite handshake
//
// Three-message protocol:
//   1. Admin creates a seedless invite token (signed, expiring)
//   2. Joiner responds with their pubkey (join code)
//   3. Admin encrypts group state (WelcomePayload) to joiner's pubkey via NIP-44
//
// The group seed never appears in plaintext outside the app.

import { sha256, bytesToHex, hexToBytes } from 'canary-kit/crypto'
import { schnorr } from '@noble/curves/secp256k1.js'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'

// ── Regex patterns ──────────────────────────────────────────────

const HEX_64_RE = /^[0-9a-f]{64}$/
const HEX_128_RE = /^[0-9a-f]{128}$/
const HEX_32_RE = /^[0-9a-f]{32}$/

// ── Types ───────────────────────────────────────────────────────

/** Message 1: seedless invite token sent by admin. */
export interface RemoteInviteToken {
  groupName: string
  groupId: string
  adminPubkey: string
  inviteId: string      // 16-byte random hex nonce
  expiresAt: number     // unix seconds
  relays: string[]      // relay URLs so the joiner connects to the same relays
  adminSig: string      // Schnorr sig over SHA-256(canonical JSON of other fields)
}

/** Message 3: the group state sent encrypted to joiner. */
export interface WelcomePayload {
  inviteId: string    // must match the RemoteInviteToken.inviteId
  seed: string
  counter: number
  usageOffset: number
  epoch: number
  wordCount: 1 | 2 | 3
  rotationInterval: number
  groupId: string
  groupName: string
  wordlist: string
  beaconInterval: number
  beaconPrecision: number
  encodingFormat: 'words' | 'pin' | 'hex'
  tolerance: number
  members: string[]
  admins: string[]
  relays: string[]
  memberNames?: Record<string, string>
}

// ── Helpers ─────────────────────────────────────────────────────

/**
 * Build canonical JSON bytes for signing/verification.
 * Sorts keys alphabetically, excludes `adminSig`.
 */
function canonicalBytes(token: RemoteInviteToken): Uint8Array {
  const { adminSig: _, ...rest } = token
  const sorted = Object.keys(rest).sort().reduce<Record<string, unknown>>((acc, key) => {
    acc[key] = (rest as Record<string, unknown>)[key]
    return acc
  }, {})
  return new TextEncoder().encode(JSON.stringify(sorted))
}

// ── Message 1: Create invite token ──────────────────────────────

export interface CreateRemoteInviteOpts {
  groupName: string
  groupId: string
  adminPubkey: string
  adminPrivkey: string
  relays: string[]
  expiresInSec?: number
}

/**
 * Create a signed, seedless invite token.
 * Default expiry: 24 hours.
 */
export function createRemoteInviteToken(opts: CreateRemoteInviteOpts): RemoteInviteToken {
  const {
    groupName,
    groupId,
    adminPubkey,
    adminPrivkey,
    relays,
    expiresInSec = 86400,
  } = opts

  // Generate 16-byte random invite ID
  const inviteIdBytes = new Uint8Array(16)
  crypto.getRandomValues(inviteIdBytes)
  const inviteId = bytesToHex(inviteIdBytes)

  const token: RemoteInviteToken = {
    groupName,
    groupId,
    adminPubkey,
    inviteId,
    expiresAt: Math.floor(Date.now() / 1000) + expiresInSec,
    relays: [...relays],
    adminSig: '', // placeholder — will be replaced after signing
  }

  // Sign SHA-256(canonical JSON)
  const hash = sha256(canonicalBytes(token))
  token.adminSig = bytesToHex(schnorr.sign(hash, hexToBytes(adminPrivkey)))

  return token
}

// ── Message 1: Validate invite token ────────────────────────────

/**
 * Validate and type-assert a RemoteInviteToken.
 * Checks all fields present, types correct, not expired, signature valid.
 * Throws on any failure.
 */
export function assertRemoteInviteToken(raw: unknown): asserts raw is RemoteInviteToken {
  if (raw == null || typeof raw !== 'object') {
    throw new Error('Remote invite token must be a non-null object')
  }

  const t = raw as Record<string, unknown>

  // Required string fields
  if (typeof t.groupName !== 'string' || t.groupName.length === 0) {
    throw new Error('groupName must be a non-empty string')
  }
  if (typeof t.groupId !== 'string' || t.groupId.length === 0) {
    throw new Error('groupId must be a non-empty string')
  }
  if (typeof t.adminPubkey !== 'string' || !HEX_64_RE.test(t.adminPubkey)) {
    throw new Error('adminPubkey must be a 64-character hex string')
  }
  if (typeof t.inviteId !== 'string' || !HEX_32_RE.test(t.inviteId)) {
    throw new Error('inviteId must be a 32-character hex string')
  }
  if (typeof t.adminSig !== 'string' || !HEX_128_RE.test(t.adminSig)) {
    throw new Error('adminSig must be a 128-character hex string')
  }
  if (!Array.isArray(t.relays) || !t.relays.every((r: unknown) => typeof r === 'string')) {
    throw new Error('relays must be an array of strings')
  }

  // Expiry
  if (typeof t.expiresAt !== 'number' || !Number.isFinite(t.expiresAt)) {
    throw new Error('expiresAt must be a finite number')
  }
  const now = Math.floor(Date.now() / 1000)
  if (t.expiresAt <= now) {
    throw new Error('Remote invite token has expired')
  }

  // Verify Schnorr signature
  const token = raw as RemoteInviteToken
  const hash = sha256(canonicalBytes(token))
  const valid = schnorr.verify(hexToBytes(token.adminSig), hash, hexToBytes(token.adminPubkey))
  if (!valid) {
    throw new Error('Remote invite token signature is invalid')
  }
}

// ── Message 3: Welcome envelope (NIP-44 encrypted) ──────────────

export interface CreateWelcomeEnvelopeOpts {
  welcome: WelcomePayload
  adminPrivkey: string
  joinerPubkey: string
}

/**
 * Encrypt a WelcomePayload to the joiner's pubkey using NIP-44.
 * Returns the NIP-44 ciphertext string.
 */
export function createWelcomeEnvelope(opts: CreateWelcomeEnvelopeOpts): string {
  const { welcome, adminPrivkey, joinerPubkey } = opts
  const plaintext = JSON.stringify(welcome)
  const conversationKey = getConversationKey(hexToBytes(adminPrivkey), joinerPubkey)
  return nip44encrypt(plaintext, conversationKey)
}

export interface DecryptWelcomeEnvelopeOpts {
  envelope: string
  joinerPrivkey: string
  adminPubkey: string
  expectedInviteId: string  // must match WelcomePayload.inviteId
}

/**
 * Decrypt a welcome envelope and return the WelcomePayload.
 * Validates inviteId binding, seed format, and groupId presence.
 */
export function decryptWelcomeEnvelope(opts: DecryptWelcomeEnvelopeOpts): WelcomePayload {
  const { envelope, joinerPrivkey, adminPubkey, expectedInviteId } = opts
  const conversationKey = getConversationKey(hexToBytes(joinerPrivkey), adminPubkey)
  const plaintext = nip44decrypt(envelope, conversationKey)
  const payload = JSON.parse(plaintext) as WelcomePayload

  // Validate inviteId binding — prevents replay of stale welcome envelopes
  if (typeof payload.inviteId !== 'string' || !HEX_32_RE.test(payload.inviteId)) {
    throw new Error('Welcome payload must include a valid inviteId')
  }
  if (payload.inviteId !== expectedInviteId) {
    throw new Error('Welcome payload inviteId does not match the pending invite')
  }

  // Validate critical fields
  if (typeof payload.seed !== 'string' || !HEX_64_RE.test(payload.seed)) {
    throw new Error('Welcome payload seed must be a 64-character hex string')
  }
  if (typeof payload.groupId !== 'string' || payload.groupId.length === 0) {
    throw new Error('Welcome payload must include a non-empty groupId')
  }

  return payload
}
