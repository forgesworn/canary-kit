import { describe, it, expect } from 'vitest'
import {
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
} from './derive.js'
import { verifyWord } from './verify.js'

/**
 * Canonical test vectors for the Wordchain protocol (NIP Appendix C).
 *
 * These vectors define the expected output for known inputs.
 * Any compliant implementation MUST produce the same results.
 *
 * Derivation algorithm:
 *   verification: HMAC-SHA256(seed, counter_be64)[0:2] mod 2048 → word
 *   duress:       HMAC-SHA256(seed || pubkey, counter_be64)[0:2] mod 2048 → word
 *                 (re-derived with seed || pubkey || 0x01 key if it collides with verification word)
 */

const SEED_1 = '0000000000000000000000000000000000000000000000000000000000000001'
const SEED_2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const PUBKEY_A = '0000000000000000000000000000000000000000000000000000000000000002'
const PUBKEY_B = '0000000000000000000000000000000000000000000000000000000000000003'

describe('canonical test vectors', () => {
  describe('verification word derivation', () => {
    it('vector 1: seed=0x01, counter=0', () => {
      const word = deriveVerificationWord(SEED_1, 0)
      expect(word).toBe('garnet')
    })

    it('vector 2: seed=0x01, counter=1', () => {
      const word = deriveVerificationWord(SEED_1, 1)
      expect(word).toBe('twice')
    })

    it('vector 3: seed=0xFF, counter=0', () => {
      const word = deriveVerificationWord(SEED_2, 0)
      expect(word).toBe('gossip')
    })

    it('vector 4: seed=0x01, counter=100', () => {
      const word = deriveVerificationWord(SEED_1, 100)
      expect(word).toBe('treat')
    })
  })

  describe('verification phrase derivation', () => {
    it('vector 5: seed=0x01, counter=0, 2 words', () => {
      const phrase = deriveVerificationPhrase(SEED_1, 0, 2)
      // Each word is derived from a consecutive 2-byte slice of the same HMAC digest.
      // First word matches vector 1 (same seed + counter).
      expect(phrase).toEqual(['garnet', 'inject'])
    })

    it('vector 6: seed=0x01, counter=0, 3 words', () => {
      const phrase = deriveVerificationPhrase(SEED_1, 0, 3)
      // Note: bytes 0–1 and bytes 4–5 of this digest yield the same word index;
      // this is a valid output, not a bug.
      expect(phrase).toEqual(['garnet', 'inject', 'garnet'])
    })
  })

  describe('duress word derivation', () => {
    it('vector 7: seed=0x01, pubkey=0x02, counter=0', () => {
      const word = deriveDuressWord(SEED_1, PUBKEY_A, 0)
      // Key is seed || pubkey; guaranteed not equal to verification word.
      expect(word).toBe('theory')
    })

    it('vector 8: seed=0x01, pubkey=0x03, counter=0', () => {
      const word = deriveDuressWord(SEED_1, PUBKEY_B, 0)
      // Different pubkey → different duress word.
      expect(word).toBe('cedar')
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
      expect(result.member).toBe(PUBKEY_A)
    })
  })
})
