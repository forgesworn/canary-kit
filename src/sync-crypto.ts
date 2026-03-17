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
 *
 * @param seedHex - Group seed as a 64-character lowercase hex string (32 bytes).
 * @param personalPrivkeyHex - Participant's private key as a 64-character lowercase hex string.
 * @returns 32-byte signing key unique to this participant within this group epoch.
 * @throws {Error} If seedHex or personalPrivkeyHex are not valid 64-character hex strings.
 */
export function deriveGroupSigningKey(seedHex: string, personalPrivkeyHex: string): Uint8Array {
  validateSeedHex(seedHex)
  if (!/^[0-9a-f]{64}$/.test(personalPrivkeyHex)) {
    throw new Error('personalPrivkeyHex must be a 64-character lowercase hex string (32 bytes)')
  }
  const seedBytes = hexToBytes(seedHex)
  const data = concatBytes(utf8('canary:sync:sign:'), hexToBytes(personalPrivkeyHex))
  const result = hmacSha256(seedBytes, data)
  // Zero intermediate buffers containing key material (defence-in-depth).
  // JS strings are immutable so the hex inputs cannot be zeroed, but Uint8Arrays can.
  seedBytes.fill(0)
  data.fill(0)
  return result
}

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
