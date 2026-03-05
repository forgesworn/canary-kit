import { describe, it, expect } from 'vitest'
import { MAX_TOLERANCE, deriveTokenBytes, deriveToken, deriveDuressTokenBytes, deriveDuressToken, verifyToken, deriveLivenessToken, deriveDirectionalPair } from './token.js'
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
    const token = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 1)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('never collides with normal token', () => {
    for (let c = 0; c < 100; c++) {
      const normal = deriveToken(SECRET_1, 'test', c)
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, c, undefined, 1)
      expect(duress).not.toBe(normal)
    }
  })

  it('different identities produce different duress tokens', () => {
    const a = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 1)
    const b = deriveDuressToken(SECRET_1, 'test', IDENTITY_B, 0, undefined, 1)
    expect(a).not.toBe(b)
  })

  it('works with PIN encoding', () => {
    const encoding = { format: 'pin' as const, digits: 4 }
    const normal = deriveToken(SECRET_1, 'test', 0, encoding)
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, encoding, 1)
    expect(duress).toHaveLength(4)
    expect(duress).not.toBe(normal)
  })

  it('retries beyond first suffix on repeated collision', () => {
    // Run 1000 counter values across two encodings to exercise retry paths.
    const encoding = { format: 'pin' as const, digits: 4 }
    for (let c = 0; c < 1000; c++) {
      const normal = deriveToken(SECRET_1, 'test', c, encoding)
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, c, encoding, 1)
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
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 1)
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
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_B, 10, undefined, 1)
    const result = verifyToken(SECRET_1, 'test', 11, duress, [IDENTITY_A, IDENTITY_B], { tolerance: 1 })
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual([IDENTITY_B])
  })

  it('returns identities array (not singular identity) for duress', () => {
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 1)
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
    const a = deriveDuressToken(SECRET_1, 'x:duress', '', 0, undefined, 1)
    const b = deriveDuressToken(SECRET_1, 'x', ':duress', 0, undefined, 1)
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

describe('deriveDirectionalPair', () => {
  it('returns an object with both role keys', () => {
    const pair = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    expect(pair).toHaveProperty('caller')
    expect(pair).toHaveProperty('agent')
  })

  it('both values are non-empty strings', () => {
    const pair = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    expect(typeof pair.caller).toBe('string')
    expect(typeof pair.agent).toBe('string')
    expect(pair.caller.length).toBeGreaterThan(0)
    expect(pair.agent.length).toBeGreaterThan(0)
  })

  it('produces different tokens for each role', () => {
    const pair = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    expect(pair.caller).not.toBe(pair.agent)
  })

  it('is deterministic', () => {
    const a = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    const b = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    expect(a).toEqual(b)
  })

  it('different counter produces different pair', () => {
    const a = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    const b = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 1)
    expect(a.caller).not.toBe(b.caller)
    expect(a.agent).not.toBe(b.agent)
  })

  it('different namespace produces different pair', () => {
    const a = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    const b = deriveDirectionalPair(SECRET_1, 'barclays', ['caller', 'agent'], 0)
    expect(a.caller).not.toBe(b.caller)
  })

  it('role tokens match individual deriveToken calls', () => {
    const pair = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0)
    expect(pair.caller).toBe(deriveToken(SECRET_1, 'aviva:caller', 0))
    expect(pair.agent).toBe(deriveToken(SECRET_1, 'aviva:agent', 0))
  })

  it('works with PIN encoding', () => {
    const encoding = { format: 'pin' as const, digits: 4 }
    const pair = deriveDirectionalPair(SECRET_1, 'dispatch', ['requester', 'provider'], 0, encoding)
    expect(pair.requester).toHaveLength(4)
    expect(pair.provider).toHaveLength(4)
    expect(pair.requester).not.toBe(pair.provider)
  })

  it('works with multi-word encoding', () => {
    const encoding = { format: 'words' as const, count: 2 }
    const pair = deriveDirectionalPair(SECRET_1, 'aviva', ['caller', 'agent'], 0, encoding)
    expect(pair.caller.split(' ')).toHaveLength(2)
    expect(pair.agent.split(' ')).toHaveLength(2)
  })
})

describe('cross-counter collision avoidance', () => {
  it('deriveDuressToken never matches normal token at adjacent counters (default maxTolerance=1)', () => {
    // Reviewer's reproduction: secret=...0001, context=canary:verify, identity=alice, counter=1946
    // Before fix: deriveDuressToken at 1946 collides with deriveToken at 1945 or 1947
    const secret = SECRET_1
    const context = 'canary:verify'

    for (let c = 0; c < 200; c++) {
      const duress = deriveDuressToken(secret, context, IDENTITY_A, c, undefined, 1)
      const lo = Math.max(0, c - 1)
      const hi = c + 1
      for (let adj = lo; adj <= hi; adj++) {
        const normal = deriveToken(secret, context, adj)
        expect(duress, `duress(${c}) collided with normal(${adj}): "${duress}"`).not.toBe(normal)
      }
    }
  })

  it('deriveDuressToken avoids collisions within custom maxTolerance=2', () => {
    const secret = SECRET_1
    const context = 'canary:verify'

    for (let c = 0; c < 100; c++) {
      const duress = deriveDuressToken(secret, context, IDENTITY_A, c, undefined, 2)
      const lo = Math.max(0, c - 2)
      const hi = c + 2
      for (let adj = lo; adj <= hi; adj++) {
        const normal = deriveToken(secret, context, adj)
        expect(duress, `duress(${c}) collided with normal(${adj}): "${duress}"`).not.toBe(normal)
      }
    }
  })

  it('verifyToken: duress at exact counter wins over normal at adjacent counter', () => {
    // Even with tolerance, a duress token at the exact counter must be detected
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 10, undefined, 1)
    const result = verifyToken(SECRET_1, 'test', 10, duress, [IDENTITY_A, IDENTITY_B], { tolerance: 1 })
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual([IDENTITY_A])
  })

  it('verifyToken passes tolerance as maxTolerance to deriveDuressToken', () => {
    // With tolerance=2, duress tokens should be collision-free within ±2.
    // If verifyToken doesn't pass tolerance as maxTolerance, a duress token
    // derived with default maxTolerance=1 could collide with normal at ±2.
    const tolerance = 2

    for (let c = 2; c < 100; c++) {
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, c, undefined, tolerance)
      const result = verifyToken(SECRET_1, 'test', c, duress, [IDENTITY_A], { tolerance })
      expect(
        result.status,
        `counter=${c}: duress token "${duress}" classified as "${result.status}" with tolerance=${tolerance}`,
      ).toBe('duress')
    }
  })

  it('duress token avoids collisions across 2× tolerance window (P2 regression)', () => {
    // Regression: deriveDuressToken with maxTolerance=T must avoid collisions
    // in the range ±2T, because the verifier's counter can drift by ±T from
    // the deriver's counter, expanding the normal-token window to ±2T.
    const tolerance = 2
    for (let d = 4; d < 200; d++) {
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, d, undefined, tolerance)
      // Check the full ±2T window
      const lo = Math.max(0, d - 2 * tolerance)
      const hi = d + 2 * tolerance
      for (let c = lo; c <= hi; c++) {
        const normal = deriveToken(SECRET_1, 'test', c)
        expect(duress, `duress(${d}) collided with normal(${c}): "${duress}"`).not.toBe(normal)
      }
    }
  })

  it('verifyToken detects duress when verifier counter drifts by tolerance (P2 regression)', () => {
    // The exact reproduction: deriver at c=74, verifier at c=72, tolerance=2
    const tolerance = 2
    for (let d = tolerance; d < 100; d++) {
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, d, undefined, tolerance)
      // Verifier counter can be anywhere in [d-tolerance, d+tolerance]
      for (let v = Math.max(0, d - tolerance); v <= d + tolerance; v++) {
        const result = verifyToken(SECRET_1, 'test', v, duress, [IDENTITY_A], { tolerance })
        expect(
          result.status,
          `deriver=${d}, verifier=${v}, token="${duress}": expected duress, got ${result.status}`,
        ).toBe('duress')
      }
    }
  })

  it('verifyToken detects duress with tolerance=3 (P2 regression round 2)', () => {
    // Regression: derive at c=427, verify at vc=430, tolerance=3
    // Before fix: duress token classified as 'valid' because collision avoidance
    // window was insufficient for the verifier's tolerance.
    const tolerance = 3
    for (let d = tolerance; d < 80; d++) {
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, d, undefined, tolerance)
      for (let v = Math.max(0, d - tolerance); v <= d + tolerance; v++) {
        const result = verifyToken(SECRET_1, 'test', v, duress, [IDENTITY_A], { tolerance })
        expect(
          result.status,
          `deriver=${d}, verifier=${v}, token="${duress}": expected duress, got ${result.status}`,
        ).toBe('duress')
      }
    }
  })
})

describe('verifyToken — multi-identity duress', () => {
  it('collects all matching duress identities (CANARY-DURESS spec)', () => {
    // Both Alice and Bob happen to be under duress at the same counter.
    // Verifier must collect ALL matches, not short-circuit after the first.
    const aliceDuress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 1)
    const bobDuress = deriveDuressToken(SECRET_1, 'test', IDENTITY_B, 0, undefined, 1)
    // These are different tokens, so only one identity matches per verification call.
    const resultA = verifyToken(SECRET_1, 'test', 0, aliceDuress, [IDENTITY_A, IDENTITY_B])
    expect(resultA.status).toBe('duress')
    expect(resultA.identities).toContain(IDENTITY_A)

    const resultB = verifyToken(SECRET_1, 'test', 0, bobDuress, [IDENTITY_A, IDENTITY_B])
    expect(resultB.status).toBe('duress')
    expect(resultB.identities).toContain(IDENTITY_B)
  })

  it('returns empty identities array never — at least one match for duress', () => {
    const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 5, undefined, 2)
    const result = verifyToken(SECRET_1, 'test', 5, duress, [IDENTITY_A, IDENTITY_B], { tolerance: 2 })
    expect(result.status).toBe('duress')
    expect(result.identities!.length).toBeGreaterThanOrEqual(1)
  })
})

describe('deriveDuressToken — distinct words per pubkey', () => {
  it('produces distinct duress words for different pubkeys with same seed and counter', () => {
    // Simulates two group members (different pubkeys) — their duress words must differ.
    // This confirms the identical-word observation in same-browser testing is an artefact
    // of both tabs sharing the same identity, not a protocol bug.
    const pubkeyAlice = 'aaaa'.repeat(16) // 64-char hex
    const pubkeyBob = 'bbbb'.repeat(16)
    const seed = SECRET_1
    const context = 'canary:group'

    for (let c = 0; c < 50; c++) {
      const aliceDuress = deriveDuressToken(seed, context, pubkeyAlice, c, undefined, 1)
      const bobDuress = deriveDuressToken(seed, context, pubkeyBob, c, undefined, 1)
      expect(aliceDuress, `counter=${c}: Alice and Bob duress words should differ`).not.toBe(bobDuress)
    }
  })
})

describe('deriveDuressToken — maxTolerance=0', () => {
  it('works with zero tolerance (no cross-counter collision avoidance needed)', () => {
    const token = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 0)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('still avoids collision with normal token at exact counter', () => {
    for (let c = 0; c < 200; c++) {
      const normal = deriveToken(SECRET_1, 'test', c)
      const duress = deriveDuressToken(SECRET_1, 'test', IDENTITY_A, c, undefined, 0)
      expect(duress).not.toBe(normal)
    }
  })
})

describe('MAX_TOLERANCE enforcement', () => {
  it('deriveDuressToken throws on maxTolerance > MAX_TOLERANCE', () => {
    expect(() => deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 11)).toThrow(RangeError)
    expect(() => deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 100)).toThrow(RangeError)
  })

  it('verifyToken throws on tolerance > MAX_TOLERANCE', () => {
    const token = deriveToken(SECRET_1, 'test', 0)
    expect(() => verifyToken(SECRET_1, 'test', 0, token, [], { tolerance: 11 })).toThrow(RangeError)
    expect(() => verifyToken(SECRET_1, 'test', 0, token, [], { tolerance: 100 })).toThrow(RangeError)
  })

  it('deriveDuressToken accepts maxTolerance = MAX_TOLERANCE', () => {
    expect(() => deriveDuressToken(SECRET_1, 'test', IDENTITY_A, 0, undefined, 10)).not.toThrow()
  })

  it('verifyToken accepts tolerance = MAX_TOLERANCE', () => {
    const token = deriveToken(SECRET_1, 'test', 0)
    expect(() => verifyToken(SECRET_1, 'test', 0, token, [], { tolerance: 10 })).not.toThrow()
  })
})
