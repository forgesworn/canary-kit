import { describe, expect, it } from 'vitest'
import { entropyToMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { createPair, joinPair, wordsAt, checkWords, pairReference, readPair } from './model.js'

const setup = entropyToMnemonic(new Uint8Array(16).fill(19), wordlist)
const first = () => joinPair(setup, 'first')
const second = () => joinPair(setup, 'second')
const now = 1_000_000_050

describe('local pair', () => {
  it('creates fresh, checksummed setup words and rejects damaged or oversized input', () => {
    const a = createPair()
    const b = createPair()
    expect(a.mnemonic.split(' ')).toHaveLength(12)
    expect(a.mnemonic).not.toBe(b.mnemonic)
    expect(() => joinPair(a.mnemonic.replace(/^\S+/, 'notaword'))).toThrow()
    expect(() => joinPair('a'.repeat(2000))).toThrow()
    expect(() => readPair({ v: 2, mnemonic: setup, role: 'first' })).toThrow()
    expect(() => readPair({ v: 1, mnemonic: setup, role: 'third' })).toThrow()
  })

  it('pairs both sides without names, accounts or a server', () => {
    expect(pairReference(first())).toBe(pairReference(second()))
    const a = wordsAt(first(), now)
    const b = wordsAt(second(), now)
    expect(a.say).toBe(b.hear)
    expect(b.say).toBe(a.hear)
    expect(a.say).not.toBe(a.hear)
    expect(a.say.split(' ')).toHaveLength(2)
    expect(checkWords(second(), a.say, now)).toBe('match')
    expect(checkWords(first(), a.say, now)).toBe('different')
  })

  it('rotates on the UTC 30-second boundary and handles only one interval of drift', () => {
    const token = wordsAt(first(), now).say
    expect(wordsAt(first(), now + 29).say).toBe(token)
    expect(wordsAt(first(), now + 30).say).not.toBe(token)
    expect(checkWords(second(), token, now + 30)).toBe('match')
    expect(checkWords(second(), token, now + 60)).toBe('different')
  })

  it('detects each side’s duress phrase across clock drift without confusing normal words', () => {
    for (let c = 1000; c < 1040; c++) {
      for (const [speaker, listener] of [[first(), second()], [second(), first()]]) {
        const spoken = wordsAt(speaker, c * 30)
        expect(spoken.duress).not.toBe(spoken.say)
        expect(spoken.duress).not.toBe(spoken.hear)
        for (const drift of [-30, 0, 30]) {
          expect(checkWords(listener, spoken.duress, c * 30 + drift)).toBe('signal')
          expect(checkWords(listener, spoken.say, c * 30 + drift)).toBe('match')
        }
      }
    }
  })

  it('normalises spoken input and rejects another pair, bad clocks and huge input', () => {
    const spoken = wordsAt(first(), now).say
    expect(checkWords(second(), `  ${spoken.toUpperCase().replace(' ', '   ')}  `, now)).toBe('match')
    expect(checkWords(createPair(), spoken, now)).toBe('different')
    expect(checkWords(second(), 'x'.repeat(3000), now)).toBe('different')
    expect(() => wordsAt(first(), -1)).toThrow()
    expect(() => wordsAt(first(), Number.NaN)).toThrow()
  })
})
