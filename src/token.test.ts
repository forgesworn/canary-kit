import { describe, it, expect } from 'vitest'
import { deriveTokenBytes, deriveToken, deriveDuressTokenBytes, deriveDuressToken } from './token.js'
import { hexToBytes, bytesToHex } from './crypto.js'

const SECRET_1 = '0000000000000000000000000000000000000000000000000000000000000001'
const SECRET_2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

describe('deriveTokenBytes', () => {
  it('returns 32 bytes', () => {
    const bytes = deriveTokenBytes(SECRET_1, 'test', 0)
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(32)
  })

  it('is deterministic', () => {
    const a = deriveTokenBytes(SECRET_1, 'test', 0)
    const b = deriveTokenBytes(SECRET_1, 'test', 0)
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('different context produces different output', () => {
    const a = deriveTokenBytes(SECRET_1, 'context-a', 0)
    const b = deriveTokenBytes(SECRET_1, 'context-b', 0)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('different counter produces different output', () => {
    const a = deriveTokenBytes(SECRET_1, 'test', 0)
    const b = deriveTokenBytes(SECRET_1, 'test', 1)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('different secret produces different output', () => {
    const a = deriveTokenBytes(SECRET_1, 'test', 0)
    const b = deriveTokenBytes(SECRET_2, 'test', 0)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('accepts Uint8Array secret', () => {
    const secretBytes = hexToBytes(SECRET_1)
    const a = deriveTokenBytes(SECRET_1, 'test', 0)
    const b = deriveTokenBytes(secretBytes, 'test', 0)
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })
})

describe('deriveToken', () => {
  it('defaults to single word encoding', () => {
    const token = deriveToken(SECRET_1, 'test', 0)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
    expect(token.split(' ')).toHaveLength(1)
  })

  it('encodes as PIN', () => {
    const token = deriveToken(SECRET_1, 'test', 0, { format: 'pin', digits: 4 })
    expect(token).toHaveLength(4)
    expect(Number(token)).not.toBeNaN()
  })

  it('encodes as hex', () => {
    const token = deriveToken(SECRET_1, 'test', 0, { format: 'hex', length: 8 })
    expect(token).toHaveLength(8)
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it('encodes as multi-word phrase', () => {
    const token = deriveToken(SECRET_1, 'test', 0, { format: 'words', count: 3 })
    expect(token.split(' ')).toHaveLength(3)
  })

  it('is deterministic', () => {
    const a = deriveToken(SECRET_1, 'test', 0)
    const b = deriveToken(SECRET_1, 'test', 0)
    expect(a).toBe(b)
  })
})

const IDENTITY_A = 'alice'
const IDENTITY_B = 'bob'

describe('deriveDuressTokenBytes', () => {
  it('returns 32 bytes', () => {
    const bytes = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_A, 0)
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(32)
  })

  it('is deterministic', () => {
    const a = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_A, 0)
    const b = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_A, 0)
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('different identity produces different output', () => {
    const a = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_A, 0)
    const b = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_B, 0)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('different from normal derivation', () => {
    const normal = deriveTokenBytes(SECRET_1, 'test', 0)
    const duress = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_A, 0)
    expect(bytesToHex(normal)).not.toBe(bytesToHex(duress))
  })
})

describe('deriveDuressToken', () => {
  it('returns encoded string', () => {
    const token = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('never collides with normal token', () => {
    for (let c = 0; c < 100; c++) {
      const normal = deriveToken(SECRET_1, 'test', c)
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, c)
      expect(duress).not.toBe(normal)
    }
  })

  it('different identities produce different duress tokens', () => {
    const a = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0)
    const b = deriveDuressToken(SECRET_1, 'test', IDENTITY_B, 0)
    expect(a).not.toBe(b)
  })

  it('works with PIN encoding', () => {
    const encoding = { format: 'pin' as const, digits: 4 }
    const normal = deriveToken(SECRET_1, 'test', 0, encoding)
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, encoding)
    expect(duress).toHaveLength(4)
    expect(duress).not.toBe(normal)
  })
})
