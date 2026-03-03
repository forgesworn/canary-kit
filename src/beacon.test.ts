import { describe, it, expect } from 'vitest'
import {
  deriveBeaconKey,
  encryptBeacon,
  decryptBeacon,
  buildDuressAlert,
  encryptDuressAlert,
  decryptDuressAlert,
} from './beacon.js'
import { bytesToHex } from './crypto.js'

const SEED_1 = '0000000000000000000000000000000000000000000000000000000000000001'
const SEED_2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

describe('deriveBeaconKey', () => {
  it('returns a 32-byte Uint8Array', () => {
    const key = deriveBeaconKey(SEED_1)
    expect(key).toBeInstanceOf(Uint8Array)
    expect(key.length).toBe(32)
  })

  it('is deterministic — same seed produces same key', () => {
    const a = deriveBeaconKey(SEED_1)
    const b = deriveBeaconKey(SEED_1)
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('different seeds produce different keys', () => {
    const a = deriveBeaconKey(SEED_1)
    const b = deriveBeaconKey(SEED_2)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })
})

describe('encryptBeacon / decryptBeacon', () => {
  it('round-trips a beacon payload', async () => {
    const key = deriveBeaconKey(SEED_1)
    const encrypted = await encryptBeacon(key, 'gcpuuz', 6)
    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)

    const payload = await decryptBeacon(key, encrypted)
    expect(payload.geohash).toBe('gcpuuz')
    expect(payload.precision).toBe(6)
    expect(payload.timestamp).toBeGreaterThan(0)
  })

  it('different encryptions of the same data produce different ciphertext (random IV)', async () => {
    const key = deriveBeaconKey(SEED_1)
    const a = await encryptBeacon(key, 'gcpuuz', 6)
    const b = await encryptBeacon(key, 'gcpuuz', 6)
    expect(a).not.toBe(b)
  })

  it('wrong key fails to decrypt', async () => {
    const key1 = deriveBeaconKey(SEED_1)
    const key2 = deriveBeaconKey(SEED_2)
    const encrypted = await encryptBeacon(key1, 'gcpuuz', 6)
    await expect(decryptBeacon(key2, encrypted)).rejects.toThrow()
  })

  it('handles max precision geohash', async () => {
    const key = deriveBeaconKey(SEED_1)
    const encrypted = await encryptBeacon(key, 'gcpuuzwjzpb', 11)
    const payload = await decryptBeacon(key, encrypted)
    expect(payload.geohash).toBe('gcpuuzwjzpb')
    expect(payload.precision).toBe(11)
  })

  it('tampered ciphertext (byte flip after IV) causes decryptBeacon to throw', async () => {
    const key = deriveBeaconKey(SEED_1)
    const encrypted = await encryptBeacon(key, 'gcpuuz', 6)
    // Decode base64, flip a byte after the 12-byte IV, re-encode
    const bytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))
    bytes[12] ^= 0xff
    const tampered = btoa(String.fromCharCode(...bytes))
    await expect(decryptBeacon(key, tampered)).rejects.toThrow()
  })

  it('truncated base64 causes decryptBeacon to throw', async () => {
    const key = deriveBeaconKey(SEED_1)
    const encrypted = await encryptBeacon(key, 'gcpuuz', 6)
    const truncated = encrypted.slice(0, 8)
    await expect(decryptBeacon(key, truncated)).rejects.toThrow()
  })
})

const PUBKEY_A = '0000000000000000000000000000000000000000000000000000000000000002'

describe('buildDuressAlert', () => {
  it('builds alert with beacon location', () => {
    const alert = buildDuressAlert(PUBKEY_A, {
      geohash: 'gcpuuzwjzpb',
      precision: 11,
      locationSource: 'beacon',
    })
    expect(alert.type).toBe('duress')
    expect(alert.member).toBe(PUBKEY_A)
    expect(alert.geohash).toBe('gcpuuzwjzpb')
    expect(alert.precision).toBe(11)
    expect(alert.locationSource).toBe('beacon')
    expect(alert.timestamp).toBeGreaterThan(0)
  })

  it('builds alert with verifier location', () => {
    const alert = buildDuressAlert(PUBKEY_A, {
      geohash: 'u4pruydqqvj',
      precision: 11,
      locationSource: 'verifier',
    })
    expect(alert.locationSource).toBe('verifier')
    expect(alert.geohash).toBe('u4pruydqqvj')
  })

  it('builds alert with no location', () => {
    const alert = buildDuressAlert(PUBKEY_A, null)
    expect(alert.locationSource).toBe('none')
    expect(alert.geohash).toBe('')
    expect(alert.precision).toBe(0)
  })
})

describe('encryptDuressAlert / decryptDuressAlert', () => {
  it('round-trips a duress alert with location', async () => {
    const key = deriveBeaconKey(SEED_1)
    const alert = buildDuressAlert(PUBKEY_A, {
      geohash: 'gcpuuzwjzpb',
      precision: 11,
      locationSource: 'beacon',
    })
    const encrypted = await encryptDuressAlert(key, alert)
    const decrypted = await decryptDuressAlert(key, encrypted)
    expect(decrypted.type).toBe('duress')
    expect(decrypted.member).toBe(PUBKEY_A)
    expect(decrypted.geohash).toBe('gcpuuzwjzpb')
    expect(decrypted.precision).toBe(11)
    expect(decrypted.locationSource).toBe('beacon')
  })

  it('round-trips a duress alert with no location', async () => {
    const key = deriveBeaconKey(SEED_1)
    const alert = buildDuressAlert(PUBKEY_A, null)
    const encrypted = await encryptDuressAlert(key, alert)
    const decrypted = await decryptDuressAlert(key, encrypted)
    expect(decrypted.locationSource).toBe('none')
    expect(decrypted.geohash).toBe('')
  })

  it('wrong key fails to decrypt', async () => {
    const key1 = deriveBeaconKey(SEED_1)
    const key2 = deriveBeaconKey(SEED_2)
    const alert = buildDuressAlert(PUBKEY_A, {
      geohash: 'gcpuuzwjzpb',
      precision: 11,
      locationSource: 'beacon',
    })
    const encrypted = await encryptDuressAlert(key1, alert)
    await expect(decryptDuressAlert(key2, encrypted)).rejects.toThrow()
  })
})
