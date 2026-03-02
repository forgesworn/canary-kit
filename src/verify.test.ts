import { describe, it, expect } from 'vitest'
import { verifyWord, type VerifyResult } from './verify.js'
import { deriveVerificationWord, deriveDuressWord } from './derive.js'

const TEST_SEED = 'a'.repeat(64)
const ALICE = '1'.repeat(64)
const BOB = '2'.repeat(64)
const MEMBERS = [ALICE, BOB]
const COUNTER = 100

describe('verifyWord', () => {
  it('returns verified for correct verification word', () => {
    const word = deriveVerificationWord(TEST_SEED, COUNTER)
    const result = verifyWord(word, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('verified')
  })

  it('returns duress with member pubkey for Alice duress word', () => {
    const duress = deriveDuressWord(TEST_SEED, ALICE, COUNTER)
    const result = verifyWord(duress, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('duress')
    expect(result.member).toBe(ALICE)
  })

  it('detects Bob duress word correctly', () => {
    const duress = deriveDuressWord(TEST_SEED, BOB, COUNTER)
    const result = verifyWord(duress, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('duress')
    expect(result.member).toBe(BOB)
  })

  it('returns stale for previous window verification word', () => {
    const prevWord = deriveVerificationWord(TEST_SEED, COUNTER - 1)
    const result = verifyWord(prevWord, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('stale')
  })

  it('returns failed for unknown word', () => {
    const result = verifyWord('xyznotaword', TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('failed')
  })

  it('normalises input (case insensitive, trimmed)', () => {
    const word = deriveVerificationWord(TEST_SEED, COUNTER)
    const result = verifyWord('  ' + word.toUpperCase() + '  ', TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('verified')
  })

  it('does not return stale when counter is 0', () => {
    const result = verifyWord('xyznotaword', TEST_SEED, MEMBERS, 0)
    expect(result.status).toBe('failed')
  })
})
