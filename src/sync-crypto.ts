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

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Encode a UTF-8 string as a Uint8Array. */
function utf8(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

// ── Task 1: Group key derivation ──────────────────────────────────────────────

/**
 * Derive a 32-byte symmetric group key from a seed.
 *
 * `HMAC-SHA256(hex_to_bytes(seed), utf8("canary:sync:key"))`
 */
export function deriveGroupKey(seedHex: string): Uint8Array {
  return hmacSha256(hexToBytes(seedHex), utf8('canary:sync:key'))
}

// ── Task 1: Envelope encryption ───────────────────────────────────────────────

/**
 * Encrypt a plaintext string with AES-256-GCM using the provided group key.
 *
 * Returns `base64(IV || ciphertext || auth_tag)` where IV is a random 12-byte nonce.
 */
export async function encryptEnvelope(groupKey: Uint8Array, plaintext: string): Promise<string> {
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
 */
export async function decryptEnvelope(groupKey: Uint8Array, encoded: string): Promise<string> {
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
      ciphertextWithTag as BufferSource,
    )
  } catch {
    throw new Error('decryptEnvelope: decryption failed — wrong key or tampered data')
  }

  return new TextDecoder().decode(plaintextBuf)
}

// ── Task 2: Per-group derived signing identity ────────────────────────────────

/**
 * Derive a 32-byte signing key for a participant within a group.
 *
 * `HMAC-SHA256(hex_to_bytes(seed), utf8("canary:sync:sign:") || hex_to_bytes(personalPrivkey))`
 *
 * Binding the personal private key ensures that each participant's signing
 * identity is unique within the group, even across reseed events.
 */
export function deriveGroupSigningKey(seedHex: string, personalPrivkeyHex: string): Uint8Array {
  if (!/^[0-9a-f]{64}$/.test(personalPrivkeyHex)) {
    throw new Error('personalPrivkeyHex must be a 64-character lowercase hex string (32 bytes)')
  }
  const data = concatBytes(utf8('canary:sync:sign:'), hexToBytes(personalPrivkeyHex))
  return hmacSha256(hexToBytes(seedHex), data)
}

// ── Task 2: Hashed group tag ──────────────────────────────────────────────────

/**
 * Hash a group ID to produce a privacy-preserving public tag.
 *
 * `hex(SHA256(utf8(groupId)))` — returns a 64-character lowercase hex string.
 *
 * Publishing the hash rather than the group ID prevents observers from
 * correlating events to a known group name.
 */
export function hashGroupTag(groupId: string): string {
  return bytesToHex(sha256(utf8(groupId)))
}
