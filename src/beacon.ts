/**
 * Encrypted location beacons and duress alerts for canary groups.
 *
 * Key derivation: sync (HMAC-SHA256 from crypto.ts)
 * Encryption:     async (AES-256-GCM via crypto.subtle)
 *
 * The sync/async split is intentional:
 * - Word derivation stays sync (called frequently, deterministic)
 * - Beacon/duress encryption is async (event-driven, one call per publish)
 */

import { hmacSha256, hexToBytes, bytesToBase64, base64ToBytes } from './crypto.js'

const HEX_64_RE = /^[0-9a-f]{64}$/
const GEOHASH_RE = /^[0-9b-hjkmnp-z]+$/

// ---------------------------------------------------------------------------
// Key Derivation (sync)
// ---------------------------------------------------------------------------

const BEACON_KEY_INFO = new TextEncoder().encode('canary:beacon:key')
const DURESS_KEY_INFO = new TextEncoder().encode('canary:duress:key')

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

/**
 * Derive a 256-bit AES key from the group seed for beacon encryption.
 * Deterministic: same seed always produces the same key.
 *
 * @param seedHex - Group seed as a 64-character lowercase hex string (32 bytes).
 * @returns 32-byte AES-256 key derived via HMAC-SHA256.
 * @throws {Error} If seedHex is not a valid 64-character hex string.
 */
export function deriveBeaconKey(seedHex: string): Uint8Array {
  validateSeedHex(seedHex)
  return hmacSha256(hexToBytes(seedHex), BEACON_KEY_INFO)
}

/**
 * Derive a 256-bit AES key from the group seed for duress alert encryption.
 * Uses a distinct HMAC info string from beacon keys for domain separation —
 * prevents cross-type key reuse between normal beacons and duress alerts.
 *
 * @param seedHex - Group seed as a 64-character lowercase hex string (32 bytes).
 * @returns 32-byte AES-256 key derived via HMAC-SHA256 with duress-specific info.
 * @throws {Error} If seedHex is not a valid 64-character hex string.
 */
export function deriveDuressKey(seedHex: string): Uint8Array {
  validateSeedHex(seedHex)
  return hmacSha256(hexToBytes(seedHex), DURESS_KEY_INFO)
}

// ---------------------------------------------------------------------------
// AES-256-GCM helpers (async, shared by beacon and duress)
// ---------------------------------------------------------------------------

async function aesGcmEncrypt(key: Uint8Array, plaintext: Uint8Array): Promise<string> {
  validateAesKey(key)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key as Uint8Array<ArrayBuffer>, { name: 'AES-GCM' }, false, ['encrypt'],
  )
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, plaintext as Uint8Array<ArrayBuffer>),
  )
  // Prepend 12-byte IV to ciphertext, then base64
  const combined = new Uint8Array(12 + ciphertext.length)
  combined.set(iv)
  combined.set(ciphertext, 12)
  return bytesToBase64(combined)
}

async function aesGcmDecrypt(key: Uint8Array, content: string): Promise<Uint8Array> {
  validateAesKey(key)
  const combined = base64ToBytes(content)
  const MIN_CIPHERTEXT_LEN = 28 // 12-byte IV + 16-byte GCM auth tag
  if (combined.length < MIN_CIPHERTEXT_LEN) {
    throw new Error('Invalid ciphertext: too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)')
  }
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key as Uint8Array<ArrayBuffer>, { name: 'AES-GCM' }, false, ['decrypt'],
  )
  return new Uint8Array(
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext),
  )
}

// ---------------------------------------------------------------------------
// Beacon Payload
// ---------------------------------------------------------------------------

/** Decrypted content of a kind 20800 location beacon event. */
export interface BeaconPayload {
  geohash: string
  precision: number
  timestamp: number
}

/**
 * Encrypt a location beacon payload with the group's beacon key.
 * Returns a base64 string suitable for a Nostr event's `content` field.
 *
 * @param key - 32-byte AES-256 key from {@link deriveBeaconKey}.
 * @param geohash - Geohash string representing the location.
 * @param precision - Geohash precision level (1-11).
 * @returns Base64-encoded ciphertext (12-byte IV prepended to AES-GCM output).
 * @throws {Error} If key is not 32 bytes.
 */
export async function encryptBeacon(
  key: Uint8Array,
  geohash: string,
  precision: number,
): Promise<string> {
  if (typeof geohash !== 'string' || geohash.length === 0 || geohash.length > 11) {
    throw new Error('geohash must be a non-empty string of at most 11 characters')
  }
  if (!GEOHASH_RE.test(geohash)) {
    throw new Error('geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)')
  }
  if (!Number.isInteger(precision) || precision < 1 || precision > 11) {
    throw new Error('precision must be an integer between 1 and 11')
  }
  const payload: BeaconPayload = {
    geohash,
    precision,
    timestamp: Math.floor(Date.now() / 1000),
  }
  return aesGcmEncrypt(key, new TextEncoder().encode(JSON.stringify(payload)))
}

/**
 * Decrypt a location beacon event's content.
 * Throws if the key is wrong or the ciphertext is tampered with (AES-GCM authentication).
 *
 * @param key - 32-byte AES-256 key from {@link deriveBeaconKey}.
 * @param content - Base64-encoded ciphertext from the beacon event's content field.
 * @returns Decrypted {@link BeaconPayload} with geohash, precision, and timestamp.
 * @throws {Error} If decryption fails, ciphertext is tampered, or payload is malformed.
 */
export async function decryptBeacon(
  key: Uint8Array,
  content: string,
): Promise<BeaconPayload> {
  const plaintext = await aesGcmDecrypt(key, content)
  let parsed: unknown
  try {
    parsed = JSON.parse(new TextDecoder().decode(plaintext))
  } catch {
    throw new Error('Invalid beacon payload: decrypted content is not valid JSON')
  }
  const obj = parsed as Record<string, unknown>
  if (typeof obj.geohash !== 'string' || typeof obj.precision !== 'number' || typeof obj.timestamp !== 'number') {
    throw new Error('Invalid beacon payload: missing or malformed required fields')
  }
  if (obj.geohash.length > 11 || (obj.geohash.length > 0 && !GEOHASH_RE.test(obj.geohash))) {
    throw new Error('Invalid beacon payload: geohash contains invalid characters or exceeds max length')
  }
  if (!Number.isInteger(obj.precision) || obj.precision < 0 || obj.precision > 11) {
    throw new Error('Invalid beacon payload: precision must be an integer between 0 and 11')
  }
  return { geohash: obj.geohash, precision: obj.precision, timestamp: obj.timestamp }
}

// ---------------------------------------------------------------------------
// Duress Alert
// ---------------------------------------------------------------------------

/** Decrypted content of a duress alert beacon (kind 20800, AES-GCM encrypted). */
export interface DuressAlert {
  type: 'duress'
  member: string
  geohash: string
  precision: number
  locationSource: 'beacon' | 'verifier' | 'none'
  timestamp: number
}

/** Location info for a duress alert. Null means no location available. */
export interface DuressLocation {
  geohash: string
  precision: number
  locationSource: 'beacon' | 'verifier'
}

/**
 * Construct a duress alert payload.
 *
 * The caller is responsible for geohash encoding and precision upgrade
 * (e.g. using geohash-kit to re-encode at precision 11 for duress).
 * This function just assembles the payload.
 *
 * @param memberPubkey - 64-character lowercase hex pubkey of the member under duress.
 * @param location - Location info with geohash, precision, and source; or null if unavailable.
 * @returns A {@link DuressAlert} payload ready for encryption.
 * @throws {Error} If memberPubkey is not a valid 64-character hex string.
 */
export function buildDuressAlert(
  memberPubkey: string,
  location: DuressLocation | null,
): DuressAlert {
  if (!HEX_64_RE.test(memberPubkey)) {
    throw new Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${memberPubkey.length} chars`)
  }
  if (location) {
    if (typeof location.geohash !== 'string' || location.geohash.length === 0 || location.geohash.length > 11) {
      throw new Error('location.geohash must be a non-empty string of at most 11 characters')
    }
    if (!GEOHASH_RE.test(location.geohash)) {
      throw new Error('location.geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)')
    }
    if (!Number.isInteger(location.precision) || location.precision < 1 || location.precision > 11) {
      throw new Error('location.precision must be an integer between 1 and 11')
    }
    return {
      type: 'duress',
      member: memberPubkey,
      geohash: location.geohash,
      precision: location.precision,
      locationSource: location.locationSource,
      timestamp: Math.floor(Date.now() / 1000),
    }
  }
  return {
    type: 'duress',
    member: memberPubkey,
    geohash: '',
    precision: 0,
    locationSource: 'none',
    timestamp: Math.floor(Date.now() / 1000),
  }
}

/**
 * Encrypt a duress alert with the group's duress key (from deriveDuressKey).
 * Returns a base64 string for the Nostr event's `content` field.
 *
 * @param key - 32-byte AES-256 key from {@link deriveDuressKey}.
 * @param alert - The {@link DuressAlert} payload to encrypt.
 * @returns Base64-encoded ciphertext (12-byte IV prepended to AES-GCM output).
 * @throws {Error} If key is not 32 bytes.
 */
export async function encryptDuressAlert(
  key: Uint8Array,
  alert: DuressAlert,
): Promise<string> {
  return aesGcmEncrypt(key, new TextEncoder().encode(JSON.stringify(alert)))
}

/**
 * Decrypt a duress alert event's content.
 *
 * @param key - 32-byte AES-256 key from {@link deriveDuressKey}.
 * @param content - Base64-encoded ciphertext from the duress alert event's content field.
 * @returns Decrypted {@link DuressAlert} payload.
 * @throws {Error} If decryption fails, ciphertext is tampered, or payload is malformed.
 */
export async function decryptDuressAlert(
  key: Uint8Array,
  content: string,
): Promise<DuressAlert> {
  const plaintext = await aesGcmDecrypt(key, content)
  let parsed: unknown
  try {
    parsed = JSON.parse(new TextDecoder().decode(plaintext))
  } catch {
    throw new Error('Invalid duress alert payload: decrypted content is not valid JSON')
  }
  const obj = parsed as Record<string, unknown>
  const VALID_SOURCES = new Set(['beacon', 'verifier', 'none'])
  if (
    obj.type !== 'duress' ||
    typeof obj.member !== 'string' ||
    typeof obj.timestamp !== 'number' ||
    typeof obj.geohash !== 'string' ||
    typeof obj.precision !== 'number' ||
    !VALID_SOURCES.has(obj.locationSource as string)
  ) {
    throw new Error('Invalid duress alert payload: missing or malformed required fields')
  }
  if (!HEX_64_RE.test(obj.member)) {
    throw new Error('Invalid duress alert payload: member must be a 64-character lowercase hex string')
  }
  if (obj.geohash.length > 11 || (obj.geohash.length > 0 && !GEOHASH_RE.test(obj.geohash))) {
    throw new Error('Invalid duress alert payload: geohash contains invalid characters or exceeds max length')
  }
  if (!Number.isInteger(obj.precision) || obj.precision < 0 || obj.precision > 11) {
    throw new Error('Invalid duress alert payload: precision must be an integer between 0 and 11')
  }
  return {
    type: 'duress',
    member: obj.member,
    geohash: obj.geohash,
    precision: obj.precision,
    locationSource: obj.locationSource as DuressAlert['locationSource'],
    timestamp: obj.timestamp,
  }
}
