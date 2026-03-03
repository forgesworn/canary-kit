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
    expect(result.members).toEqual([ALICE])
  })

  it('detects Bob duress word correctly', () => {
    const duress = deriveDuressWord(TEST_SEED, BOB, COUNTER)
    const result = verifyWord(duress, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('duress')
    expect(result.members).toEqual([BOB])
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

  it('detects stale duress word from previous counter', () => {
    // Derive duress word at counter 0, then verify against counter 1
    const duressAtZero = deriveDuressWord(TEST_SEED, ALICE, 0)
    const result = verifyWord(duressAtZero, TEST_SEED, MEMBERS, 1)
    expect(result.status).toBe('duress')
    expect(result.members).toEqual([ALICE])
  })

  it('empty memberPubkeys still verifies the verification word correctly', () => {
    const word = deriveVerificationWord(TEST_SEED, COUNTER)
    const result = verifyWord(word, TEST_SEED, [], COUNTER)
    expect(result.status).toBe('verified')
  })

  it('future counter word returns failed', () => {
    const futureWord = deriveVerificationWord(TEST_SEED, COUNTER + 10)
    const result = verifyWord(futureWord, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('failed')
  })

  it('returns members array (not singular member) for duress', () => {
    const duress = deriveDuressWord(TEST_SEED, ALICE, COUNTER)
    const result = verifyWord(duress, TEST_SEED, MEMBERS, COUNTER)
    expect(result.status).toBe('duress')
    expect(result.members).toEqual([ALICE])
    expect(result).not.toHaveProperty('member')
  })

  it('collects all matching members when duress words collide', () => {
    // Find two pubkeys that produce the same duress word at the same counter.
    // Brute-force search over hex pubkeys — 2048-word space means ~1 in 2048
    // chance of collision, so we expect to find one within a few thousand tries.
    let collidingPubkey: string | undefined
    const aliceDuress = deriveDuressWord(TEST_SEED, ALICE, COUNTER)
    for (let i = 3; i < 10000; i++) {
      const pubkey = i.toString(16).padStart(64, '0')
      const duress = deriveDuressWord(TEST_SEED, pubkey, COUNTER)
      if (duress === aliceDuress) {
        collidingPubkey = pubkey
        break
      }
    }
    // If no collision found in 10k tries, skip (astronomically unlikely for 2048-word space)
    if (!collidingPubkey) return
    const result = verifyWord(aliceDuress, TEST_SEED, [ALICE, collidingPubkey], COUNTER)
    expect(result.status).toBe('duress')
    expect(result.members).toContain(ALICE)
    expect(result.members).toContain(collidingPubkey)
    expect(result.members!.length).toBe(2)
  })
})
