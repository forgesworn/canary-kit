/**
 * Group key derivation and envelope encryption for CANARY sync.
 *
 * All functions are zero-dependency and use only the Web Crypto API (crypto.subtle)
 * together with the pure-JS primitives in ./crypto.ts.
 */

import {
  hmacSha256,
  sha256,
  hexToBytes,
  bytesToBase64,
  base64ToBytes,
  bytesToHex,
  concatBytes,
} from './crypto.js'
import { deriveFromPersona } from 'nsec-tree/persona'
import type { Persona } from 'nsec-tree/persona'
import type { Identity } from 'nsec-tree/core'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Encode a UTF-8 string as a Uint8Array. */
function utf8(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

const HEX_64_RE = /^[0-9a-f]{64}$/

function validateSeedHex(seedHex: string): void {
  if (!HEX_64_RE.test(seedHex)) {
    throw new Error('seedHex must be a 64-character lowercase hex string (32 bytes)')
  }
}

function validateAesKey(key: Uint8Array): void {
  if (key.length !== 32) {
    throw new Error('AES-256-GCM requires a 32-byte key')
  }
}

// ── Task 1: Group key derivation ──────────────────────────────────────────────

/**
 * Derive a 32-byte symmetric group key from a seed.
 *
 * `HMAC-SHA256(hex_to_bytes(seed), utf8("canary:sync:key"))`
 *
 * @param seedHex - Group seed as a 64-character lowercase hex string (32 bytes).
 * @returns 32-byte AES-256 group key for envelope encryption.
 * @throws {Error} If seedHex is not a valid 64-character hex string.
 */
export function deriveGroupKey(seedHex: string): Uint8Array {
  validateSeedHex(seedHex)
  return hmacSha256(hexToBytes(seedHex), utf8('canary:sync:key'))
}

// ── Task 1: Envelope encryption ───────────────────────────────────────────────

/**
 * Encrypt a plaintext string with AES-256-GCM using the provided group key.
 *
 * Returns `base64(IV || ciphertext || auth_tag)` where IV is a random 12-byte nonce.
 *
 * @param groupKey - 32-byte AES-256 key from {@link deriveGroupKey}.
 * @param plaintext - UTF-8 string to encrypt.
 * @returns Base64-encoded ciphertext (12-byte IV prepended to AES-GCM output).
 * @throws {Error} If groupKey is not 32 bytes.
 */
export async function encryptEnvelope(groupKey: Uint8Array, plaintext: string): Promise<string> {
  validateAesKey(groupKey)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    groupKey as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  )

  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    utf8(plaintext) as BufferSource,
  )

  // Web Crypto returns ciphertext || auth_tag concatenated; prepend IV.
  const combined = concatBytes(iv, new Uint8Array(ciphertextBuf))
  return bytesToBase64(combined)
}

/**
 * Decrypt an envelope produced by `encryptEnvelope`.
 *
 * Expects `base64(IV || ciphertext || auth_tag)`.
 * Throws on authentication failure (wrong key or tampered data).
 *
 * @param groupKey - 32-byte AES-256 key from {@link deriveGroupKey}.
 * @param encoded - Base64-encoded ciphertext from {@link encryptEnvelope}.
 * @returns Decrypted plaintext string.
 * @throws {Error} If groupKey is not 32 bytes, data is too short, or decryption fails.
 */
export async function decryptEnvelope(groupKey: Uint8Array, encoded: string): Promise<string> {
  validateAesKey(groupKey)
  const combined = base64ToBytes(encoded)

  // 12-byte IV + 16-byte GCM auth tag = 28 bytes minimum (matching beacon.ts)
  if (combined.length < 28) {
    throw new Error('decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)')
  }

  const iv = combined.slice(0, 12)
  const ciphertextWithTag = combined.slice(12)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    groupKey as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  )

  let plaintextBuf: ArrayBuffer
  try {
    plaintextBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      ciphertextWithTag,
    )
  } catch {
    throw new Error('decryptEnvelope: decryption failed — wrong key or tampered data')
  }

  return new TextDecoder().decode(plaintextBuf)
}

// ── Group identity derivation (via nsec-tree) ───────────────────────────────

/**
 * Derive a group signing identity from a persona.
 *
 * Uses nsec-tree's two-level derivation: persona → group.
 * Purpose string: `canary:group:{groupId}`
 * Index maps to group epoch — reseed increments epoch, producing fresh keys for all members.
 *
 * @param persona - The member's persona (from nsec-tree derivePersona).
 * @param groupId - The group identifier string.
 * @param epoch - Group epoch (0 = initial, increments on reseed).
 * @returns nsec-tree Identity with signing key for this group.
 */
export function deriveGroupIdentity(persona: Persona, groupId: string, epoch: number): Identity {
  return deriveFromPersona(persona, `canary:group:${groupId}`, epoch)
}

export type { Persona, Identity }

// ── Task 2: Hashed group tag ──────────────────────────────────────────────────

/**
 * Hash a group ID to produce a privacy-preserving public tag.
 *
 * `hex(SHA256(utf8(groupId)))` — returns a 64-character lowercase hex string.
 *
 * Publishing the hash rather than the group ID prevents observers from
 * correlating events to a known group name.
 *
 * @param groupId - The group identifier string.
 * @returns 64-character lowercase hex string (SHA-256 hash of the group ID).
 */
export function hashGroupTag(groupId: string): string {
  return bytesToHex(sha256(utf8(groupId)))
}
