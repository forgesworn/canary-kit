import { describe, it, expect } from 'vitest'
import {
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
} from './derive.js'
import { verifyWord } from './verify.js'

/**
 * Canonical test vectors for the Canary group-level protocol.
 *
 * These vectors define the expected output for known inputs using the
 * CANARY-DERIVE algorithm via token.ts (context='canary:group', 4-byte BE counter).
 *
 * Any compliant implementation MUST produce the same results.
 */

const SEED_1 = '0000000000000000000000000000000000000000000000000000000000000001'
const SEED_2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const PUBKEY_A = '0000000000000000000000000000000000000000000000000000000000000002'
const PUBKEY_B = '0000000000000000000000000000000000000000000000000000000000000003'

describe('canonical test vectors', () => {
  describe('verification word derivation', () => {
    it('vector 1: seed=0x01, counter=0', () => {
      const word = deriveVerificationWord(SEED_1, 0)
      expect(word).toBe('situate')
    })

    it('vector 2: seed=0x01, counter=1', () => {
      const word = deriveVerificationWord(SEED_1, 1)
      expect(word).toBe('loom')
    })

    it('vector 3: seed=0xFF, counter=0', () => {
      const word = deriveVerificationWord(SEED_2, 0)
      expect(word).toBe('figure')
    })

    it('vector 4: seed=0x01, counter=100', () => {
      const word = deriveVerificationWord(SEED_1, 100)
      expect(word).toBe('iron')
    })
  })

  describe('verification phrase derivation', () => {
    it('vector 5: seed=0x01, counter=0, 2 words', () => {
      const phrase = deriveVerificationPhrase(SEED_1, 0, 2)
      expect(phrase).toEqual(['situate', 'airport'])
    })

    it('vector 6: seed=0x01, counter=0, 3 words', () => {
      const phrase = deriveVerificationPhrase(SEED_1, 0, 3)
      expect(phrase).toEqual(['situate', 'airport', 'defy'])
    })
  })

  describe('duress word derivation', () => {
    it('vector 7: seed=0x01, pubkey=0x02, counter=0', () => {
      const word = deriveDuressWord(SEED_1, PUBKEY_A, 0)
      expect(word).toBe('image')
    })

    it('vector 8: seed=0x01, pubkey=0x03, counter=0', () => {
      const word = deriveDuressWord(SEED_1, PUBKEY_B, 0)
      expect(word).toBe('follow')
    })
  })

  describe('verification round-trips', () => {
    it('vector 9: verification word round-trip', () => {
      const word = deriveVerificationWord(SEED_1, 0)
      const result = verifyWord(word, SEED_1, [PUBKEY_A, PUBKEY_B], 0)
      expect(result.status).toBe('verified')
    })

    it('vector 10: duress word round-trip', () => {
      const duress = deriveDuressWord(SEED_1, PUBKEY_A, 0)
      const result = verifyWord(duress, SEED_1, [PUBKEY_A, PUBKEY_B], 0)
      expect(result.status).toBe('duress')
      expect(result.members).toEqual([PUBKEY_A])
    })
  })
})
