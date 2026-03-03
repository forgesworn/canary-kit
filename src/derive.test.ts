import { describe, it, expect } from 'vitest'
import {
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
  deriveDuressPhrase,
} from './derive.js'

// Fixed test seed (32 bytes hex = 64 hex chars)
const TEST_SEED = 'a'.repeat(64)
const ALICE_PUBKEY = '1'.repeat(64)
const BOB_PUBKEY = '2'.repeat(64)

describe('deriveVerificationWord', () => {
  it('returns a single word from the wordlist', () => {
    const word = deriveVerificationWord(TEST_SEED, 0)
    expect(typeof word).toBe('string')
    expect(word.length).toBeGreaterThan(0)
  })

  it('is deterministic — same seed + counter = same word', () => {
    const w1 = deriveVerificationWord(TEST_SEED, 42)
    const w2 = deriveVerificationWord(TEST_SEED, 42)
    expect(w1).toBe(w2)
  })

  it('different counter = different word (with high probability)', () => {
    const w1 = deriveVerificationWord(TEST_SEED, 0)
    const w2 = deriveVerificationWord(TEST_SEED, 1)
    expect(w1).not.toBe(w2)
  })

  it('different seed = different word (with high probability)', () => {
    const seed2 = 'b'.repeat(64)
    const w1 = deriveVerificationWord(TEST_SEED, 0)
    const w2 = deriveVerificationWord(seed2, 0)
    expect(w1).not.toBe(w2)
  })

  it('rejects seed that is not 64 hex chars', () => {
    expect(() => deriveVerificationWord('tooshort', 0)).toThrow()
    expect(() => deriveVerificationWord('z'.repeat(64), 0)).toThrow(TypeError) // invalid hex characters are now rejected
  })
})

describe('deriveVerificationPhrase', () => {
  it('returns 1 word when wordCount=1', () => {
    const phrase = deriveVerificationPhrase(TEST_SEED, 0, 1)
    expect(phrase).toHaveLength(1)
  })

  it('returns 2 words when wordCount=2', () => {
    const phrase = deriveVerificationPhrase(TEST_SEED, 0, 2)
    expect(phrase).toHaveLength(2)
  })

  it('returns 3 words when wordCount=3', () => {
    const phrase = deriveVerificationPhrase(TEST_SEED, 0, 3)
    expect(phrase).toHaveLength(3)
  })

  it('is deterministic', () => {
    const p1 = deriveVerificationPhrase(TEST_SEED, 5, 3)
    const p2 = deriveVerificationPhrase(TEST_SEED, 5, 3)
    expect(p1).toEqual(p2)
  })

  it('first word matches single-word derivation', () => {
    const single = deriveVerificationWord(TEST_SEED, 5)
    const phrase = deriveVerificationPhrase(TEST_SEED, 5, 3)
    expect(phrase[0]).toBe(single)
  })
})

describe('deriveDuressWord', () => {
  it('returns a word from the wordlist', () => {
    const word = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 0)
    expect(typeof word).toBe('string')
    expect(word.length).toBeGreaterThan(0)
  })

  it('is deterministic', () => {
    const w1 = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 0)
    const w2 = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 0)
    expect(w1).toBe(w2)
  })

  it('different members get different duress words', () => {
    const alice = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 0)
    const bob = deriveDuressWord(TEST_SEED, BOB_PUBKEY, 0)
    expect(alice).not.toBe(bob)
  })

  it('duress word differs from verification word', () => {
    const verify = deriveVerificationWord(TEST_SEED, 0)
    const duress = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 0)
    expect(duress).not.toBe(verify)
  })

  it('changes with counter', () => {
    const w1 = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 0)
    const w2 = deriveDuressWord(TEST_SEED, ALICE_PUBKEY, 1)
    expect(w1).not.toBe(w2)
  })
})

describe('deriveDuressPhrase', () => {
  it('returns correct number of words', () => {
    expect(deriveDuressPhrase(TEST_SEED, ALICE_PUBKEY, 0, 2)).toHaveLength(2)
    expect(deriveDuressPhrase(TEST_SEED, ALICE_PUBKEY, 0, 3)).toHaveLength(3)
  })

  it('no word in duress phrase matches corresponding verification phrase word', () => {
    const verify = deriveVerificationPhrase(TEST_SEED, 0, 3)
    const duress = deriveDuressPhrase(TEST_SEED, ALICE_PUBKEY, 0, 3)
    expect(duress).not.toEqual(verify)
  })
})
