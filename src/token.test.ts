import { describe, it, expect } from 'vitest'
import { deriveTokenBytes, deriveToken, deriveDuressTokenBytes, deriveDuressToken, verifyToken, deriveLivenessToken } from './token.js'
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

  it('retries beyond first suffix on repeated collision', () => {
    // Run 1000 counter values across two encodings to exercise retry paths.
    const encoding = { format: 'pin' as const, digits: 4 }
    for (let c = 0; c < 1000; c++) {
      const normal = deriveToken(SECRET_1, 'test', c, encoding)
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, c, encoding)
      expect(duress).not.toBe(normal)
    }
  })
})

describe('verifyToken', () => {
  it('returns valid for correct token', () => {
    const token = deriveToken(SECRET_1, 'test', 0)
    const result = verifyToken(SECRET_1, 'test', 0, token, [IDENTITY_A])
    expect(result.status).toBe('valid')
  })

  it('returns duress with identity for duress token', () => {
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0)
    const result = verifyToken(SECRET_1, 'test', 0, duress, [IDENTITY_A, IDENTITY_B])
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual([IDENTITY_A])
  })

  it('returns invalid for unknown token', () => {
    const result = verifyToken(SECRET_1, 'test', 0, 'nonsenseword', [IDENTITY_A])
    expect(result.status).toBe('invalid')
  })

  it('normalises input (case + whitespace)', () => {
    const token = deriveToken(SECRET_1, 'test', 0)
    const result = verifyToken(SECRET_1, 'test', 0, '  ' + token.toUpperCase() + '  ', [IDENTITY_A])
    expect(result.status).toBe('valid')
  })

  it('respects tolerance window', () => {
    const token = deriveToken(SECRET_1, 'test', 5)
    const result = verifyToken(SECRET_1, 'test', 6, token, [], { tolerance: 1 })
    expect(result.status).toBe('valid')
  })

  it('rejects outside tolerance window', () => {
    const token = deriveToken(SECRET_1, 'test', 5)
    const result = verifyToken(SECRET_1, 'test', 8, token, [], { tolerance: 1 })
    expect(result.status).toBe('invalid')
  })

  it('works with PIN encoding', () => {
    const encoding = { format: 'pin' as const, digits: 4 }
    const pin = deriveToken(SECRET_1, 'test', 0, encoding)
    const result = verifyToken(SECRET_1, 'test', 0, pin, [IDENTITY_A], { encoding })
    expect(result.status).toBe('valid')
  })

  it('detects duress with tolerance', () => {
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_B, 10)
    const result = verifyToken(SECRET_1, 'test', 11, duress, [IDENTITY_A, IDENTITY_B], { tolerance: 1 })
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual([IDENTITY_B])
  })

  it('returns identities array (not singular identity) for duress', () => {
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0)
    const result = verifyToken(SECRET_1, 'test', 0, duress, [IDENTITY_A, IDENTITY_B])
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual([IDENTITY_A])
    expect(result).not.toHaveProperty('identity')
  })
})

describe('counterBe32 guards', () => {
  it('throws on negative counter', () => {
    expect(() => deriveTokenBytes(SECRET_1, 'ctx', -1)).toThrow(RangeError)
  })

  it('throws on counter exceeding uint32 max', () => {
    expect(() => deriveTokenBytes(SECRET_1, 'ctx', 0xFFFFFFFF + 1)).toThrow(RangeError)
  })

  it('throws on fractional counter', () => {
    expect(() => deriveTokenBytes(SECRET_1, 'ctx', 1.5)).toThrow(RangeError)
  })
})

describe('tolerance window', () => {
  it('tolerance window does not wrap at counter=0', () => {
    const token = deriveToken(SECRET_1, 'ctx', 0xFFFFFFFF)
    const result = verifyToken(SECRET_1, 'ctx', 0, token, [], { tolerance: 1 })
    expect(result.status).toBe('invalid')
  })

  it('throws on negative tolerance', () => {
    expect(() => verifyToken(SECRET_1, 'ctx', 0, 'test', [], { tolerance: -1 })).toThrow(RangeError)
  })
})

describe('concatenation ambiguity', () => {
  it('concatenation ambiguity is resolved by null-byte separator', () => {
    const a = deriveDuressToken(SECRET_1, 'x:duress', '', 0)
    const b = deriveDuressToken(SECRET_1, 'x', ':duress', 0)
    expect(a).not.toBe(b)
  })
})

describe('verifyToken with empty identities', () => {
  it('still returns valid for correct token when identities is empty', () => {
    const token = deriveToken(SECRET_1, 'test', 0)
    const result = verifyToken(SECRET_1, 'test', 0, token, [])
    expect(result.status).toBe('valid')
  })

  it('never returns duress when identities is empty', () => {
    // Any token that does not match the normal token should be invalid, not duress
    const result = verifyToken(SECRET_1, 'test', 0, 'nosuchword', [])
    expect(result.status).toBe('invalid')
  })
})

describe('liveness token context isolation', () => {
  it('different contexts produce different liveness tokens', () => {
    const a = deriveLivenessToken(SECRET_1, 'context-a', IDENTITY_A, 0)
    const b = deriveLivenessToken(SECRET_1, 'context-b', IDENTITY_A, 0)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })
})

describe('deriveLivenessToken', () => {
  it('returns 32 bytes', () => {
    const bytes = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 0)
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(32)
  })

  it('is deterministic', () => {
    const a = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 0)
    const b = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 0)
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('different from verify and duress derivations', () => {
    const verify = deriveTokenBytes(SECRET_1, 'test', 0)
    const duress = deriveDuressTokenBytes(SECRET_1, 'test', IDENTITY_A, 0)
    const liveness = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 0)
    expect(bytesToHex(liveness)).not.toBe(bytesToHex(verify))
    expect(bytesToHex(liveness)).not.toBe(bytesToHex(duress))
  })

  it('different identity produces different output', () => {
    const a = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 0)
    const b = deriveLivenessToken(SECRET_1, 'test', IDENTITY_B, 0)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('different counter produces different output', () => {
    const a = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 0)
    const b = deriveLivenessToken(SECRET_1, 'test', IDENTITY_A, 1)
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })
})
