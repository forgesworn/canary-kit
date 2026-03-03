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

// ---------------------------------------------------------------------------
// Key Derivation (sync)
// ---------------------------------------------------------------------------

const BEACON_KEY_INFO = new TextEncoder().encode('canary:beacon:key')

/**
 * Derive a 256-bit AES key from the group seed for beacon/duress encryption.
 * Deterministic: same seed always produces the same key.
 */
export function deriveBeaconKey(seedHex: string): Uint8Array {
  return hmacSha256(hexToBytes(seedHex), BEACON_KEY_INFO)
}

// ---------------------------------------------------------------------------
// AES-256-GCM helpers (async, shared by beacon and duress)
// ---------------------------------------------------------------------------

async function aesGcmEncrypt(key: Uint8Array, plaintext: Uint8Array): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'AES-GCM' }, false, ['encrypt'],
  )
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, plaintext),
  )
  // Prepend 12-byte IV to ciphertext, then base64
  const combined = new Uint8Array(12 + ciphertext.length)
  combined.set(iv)
  combined.set(ciphertext, 12)
  return bytesToBase64(combined)
}

async function aesGcmDecrypt(key: Uint8Array, content: string): Promise<Uint8Array> {
  const combined = base64ToBytes(content)
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'AES-GCM' }, false, ['decrypt'],
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
 */
export async function encryptBeacon(
  key: Uint8Array,
  geohash: string,
  precision: number,
): Promise<string> {
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
 */
export async function decryptBeacon(
  key: Uint8Array,
  content: string,
): Promise<BeaconPayload> {
  const plaintext = await aesGcmDecrypt(key, content)
  return JSON.parse(new TextDecoder().decode(plaintext))
}

// ---------------------------------------------------------------------------
// Duress Alert
// ---------------------------------------------------------------------------

/** Decrypted content of an enhanced kind 28802 duress alert event. */
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
 */
export function buildDuressAlert(
  memberPubkey: string,
  location: DuressLocation | null,
): DuressAlert {
  if (location) {
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
 * Encrypt a duress alert with the group's beacon key.
 * Returns a base64 string for the Nostr event's `content` field.
 */
export async function encryptDuressAlert(
  key: Uint8Array,
  alert: DuressAlert,
): Promise<string> {
  return aesGcmEncrypt(key, new TextEncoder().encode(JSON.stringify(alert)))
}

/**
 * Decrypt a duress alert event's content.
 */
export async function decryptDuressAlert(
  key: Uint8Array,
  content: string,
): Promise<DuressAlert> {
  const plaintext = await aesGcmDecrypt(key, content)
  return JSON.parse(new TextDecoder().decode(plaintext))
}
