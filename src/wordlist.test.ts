import { describe, it, expect } from 'vitest'
import { WORDLIST, WORDLIST_SIZE, getWord, indexOf } from './wordlist.js'

describe('wordlist', () => {
  it('has exactly 2048 entries', () => {
    expect(WORDLIST).toHaveLength(2048)
    expect(WORDLIST_SIZE).toBe(2048)
  })

  it('contains only lowercase alphabetic words', () => {
    for (const word of WORDLIST) {
      expect(word).toMatch(/^[a-z]+$/)
    }
  })

  it('contains no duplicates', () => {
    const unique = new Set(WORDLIST)
    expect(unique.size).toBe(WORDLIST.length)
  })

  it('all words are 3-8 characters', () => {
    for (const word of WORDLIST) {
      expect(word.length).toBeGreaterThanOrEqual(3)
      expect(word.length).toBeLessThanOrEqual(8)
    }
  })

  it('getWord returns correct word by index', () => {
    expect(getWord(0)).toBe(WORDLIST[0])
    expect(getWord(2047)).toBe(WORDLIST[2047])
  })

  it('getWord throws for out-of-range index', () => {
    expect(() => getWord(-1)).toThrow()
    expect(() => getWord(2048)).toThrow()
  })

  it('indexOf returns correct index', () => {
    expect(indexOf(WORDLIST[0])).toBe(0)
    expect(indexOf(WORDLIST[100])).toBe(100)
  })

  it('indexOf returns -1 for unknown word', () => {
    expect(indexOf('xyznotaword')).toBe(-1)
  })
})
