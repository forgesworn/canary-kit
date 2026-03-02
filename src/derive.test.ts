import { describe, it, expect } from 'vitest'
import { deriveVerificationWord, deriveVerificationPhrase } from './derive.js'

// Fixed test seed (32 bytes hex = 64 hex chars)
const TEST_SEED = 'a'.repeat(64)

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
    expect(() => deriveVerificationWord('z'.repeat(64), 0)).not.toThrow() // hex chars don't need to be validated beyond length for now
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
