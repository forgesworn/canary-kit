import { describe, it, expect } from 'vitest'
import {
  deriveTokenBytes,
  deriveToken,
  deriveDuressToken,
  verifyToken,
  deriveLivenessToken,
} from './token.js'
import { bytesToHex } from './crypto.js'

/**
 * CANARY Protocol — Canonical Test Vectors
 *
 * These vectors define the expected output for the CANARY-DERIVE and CANARY-DURESS
 * algorithms. Any implementation claiming conformance MUST produce identical results.
 *
 * Algorithm (CANARY-DERIVE):
 *   HMAC-SHA256(secret, utf8(context) || counter_be32)
 *
 * Algorithm (CANARY-DURESS):
 *   HMAC-SHA256(secret, utf8(context + ":duress") || 0x00 || utf8(identity) || counter_be32)
 *   Re-derived with 0x01 suffix if encoded output collides with normal token.
 */

const SECRET = '0000000000000000000000000000000000000000000000000000000000000001'
const CONTEXT = 'canary:verify'
const IDENTITY = 'alice'

describe('CANARY-DERIVE protocol vectors', () => {
  it('vector 1: raw bytes', () => {
    const hex = bytesToHex(deriveTokenBytes(SECRET, CONTEXT, 0))
    expect(hex).toBe('c51524053f1f27a4c871c63069f285ce5ac5b69a40d6caa5af9b6945dd9556d1')
  })

  it('vector 2: word — counter=0', () => {
    expect(deriveToken(SECRET, CONTEXT, 0)).toBe('net')
  })

  it('vector 3: word — counter=1', () => {
    expect(deriveToken(SECRET, CONTEXT, 1)).toBe('famous')
  })

  it('vector 4: 4-digit PIN — context="trott:handoff"', () => {
    expect(deriveToken(SECRET, 'trott:handoff', 0, { format: 'pin', digits: 4 })).toBe('2796')
  })

  it('vector 5: 3-word phrase — context="signet:verify"', () => {
    expect(deriveToken(SECRET, 'signet:verify', 0, { format: 'words', count: 3 })).toBe('throw drafter category')
  })
})

describe('CANARY-DURESS protocol vectors', () => {
  it('vector 6: duress word — identity="alice"', () => {
    const word = deriveDuressToken(SECRET, CONTEXT, IDENTITY, 0)
    const normal = deriveToken(SECRET, CONTEXT, 0)
    expect(word).not.toBe(normal)
    expect(word).toBe('airport')
  })

  it('vector 7: duress PIN — context="trott:handoff", identity="rider123"', () => {
    const pin = deriveDuressToken(SECRET, 'trott:handoff', 'rider123', 0, { format: 'pin', digits: 4 })
    const normal = deriveToken(SECRET, 'trott:handoff', 0, { format: 'pin', digits: 4 })
    expect(pin).not.toBe(normal)
    expect(pin).toBe('0325')
  })

  it('vector 8: verification round-trip — valid', () => {
    const token = deriveToken(SECRET, CONTEXT, 0)
    const result = verifyToken(SECRET, CONTEXT, 0, token, [IDENTITY])
    expect(result.status).toBe('valid')
  })

  it('vector 9: verification round-trip — duress', () => {
    const duress = deriveDuressToken(SECRET, CONTEXT, IDENTITY, 0)
    const result = verifyToken(SECRET, CONTEXT, 0, duress, [IDENTITY])
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual([IDENTITY])
  })

  it('vector 10: liveness token', () => {
    const hex = bytesToHex(deriveLivenessToken(SECRET, CONTEXT, IDENTITY, 0))
    expect(hex).toBe('b38a10676ea8d4e716ad606e0b2ae7d9678e47ff44b0920a68ed6cb02e9bb858')
  })
})
