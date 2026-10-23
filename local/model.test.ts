import { describe, expect, it } from 'vitest'
import { entropyToMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { createPair, joinPair, wordsAt, wordsToHear, checkWords, pairReference, readPair, makeInvite, joinInvite, inviteLink, joinLink, joinFragment } from './model.js'

const setup = entropyToMnemonic(new Uint8Array(16).fill(19), wordlist)
const first = () => joinPair(setup, 'first')
const second = () => joinPair(setup, 'second')
const now = 1_000_000_050

describe('local pair', () => {
  it('uses an HTTPS fragment for normal-camera pairing without putting the secret in the request URL', () => {
    const address = 'https://example.test/canary/'
    const link = inviteLink(first(), address)
    const parsed = new URL(link)
    expect(parsed.origin + parsed.pathname + parsed.search).toBe(address)
    expect(joinLink(link, address).mnemonic).toBe(setup)
    expect(joinLink(link, address).role).toBe('second')
    expect(joinFragment(parsed.hash).mnemonic).toBe(setup)
    for (const input of ['http://example.test/', 'file:///canary.html', 'https://user:secret@example.test/', address + '?tracking=yes']) {
      expect(() => inviteLink(first(), input)).toThrow()
    }
  })

  it('rejects off-site, malformed and executable pairing links', () => {
    const address = 'https://example.test/canary/'
    const link = inviteLink(first(), address)
    for (const input of [link.replace('example.test', 'other.test'), link.replace('/canary/', '/other/'), link + 'extra', 'javascript:alert(1)', link.replace('#pair=', '?pair='), 'x'.repeat(3000)]) {
      expect(() => joinLink(input, address)).toThrow()
    }
    expect(() => joinFragment('#pair=javascript:alert(1)')).toThrow()
  })
  it('expands four-letter BIP39 setup prefixes without changing the secret or accepting typos', () => {
    const short = setup.split(' ').map(word => word.slice(0, 4)).join(' ')
    expect(joinPair(short).mnemonic).toBe(setup)
    expect(joinPair(`  ${short.toUpperCase().replaceAll(' ', '\n')} `).mnemonic).toBe(setup)
    expect(() => joinPair(setup.replace(/^\S+/, 'aba'))).toThrow()
    expect(() => joinPair(setup.replace(/^\S+/, 'abandonn'))).toThrow()
    expect(new Set(wordlist.map(word => word.slice(0, 4))).size).toBe(2048)
  })

  it('transfers the same secret through a strictly parsed non-URL QR invite', () => {
    const original = first()
    const invite = makeInvite(original)
    const received = joinInvite(invite)
    expect(received.role).toBe('second')
    expect(received.mnemonic).toBe(original.mnemonic)
    expect(pairReference(received)).toBe(pairReference(original))
    for (const input of ['https://example.invalid', 'javascript:alert(1)', invite + 'x', invite.replace(':1:', ':2:'), 'x'.repeat(2000)]) {
      expect(() => joinInvite(input)).toThrow()
    }
  })

  it('lets either holder resume the same pair with the opposite speaking role', () => {
    for (const holder of [first(), second()]) {
      const restored = joinInvite(makeInvite(holder))
      expect(restored.mnemonic).toBe(holder.mnemonic)
      expect(restored.role).toBe(holder.role === 'first' ? 'second' : 'first')
      expect(wordsAt(restored, now).say).toBe(wordsAt(holder, now).hear)
      expect(joinLink(inviteLink(holder, 'https://example.test/'), 'https://example.test/')).toEqual(restored)
    }
    for (const role of ['', 'third', 'FIRST', 'first:extra']) {
      expect(() => joinInvite(`CANARY-LOCAL:2:${'13'.repeat(16)}:${role}`)).toThrow()
    }
  })

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

  it('shows the listener the other person’s exact normal and duress words', () => {
    for (const [speaker, listener] of [[first(), second()], [second(), first()]]) {
      const choices = wordsToHear(listener, now)
      const spoken = wordsAt(speaker, now)
      expect(choices).toEqual({ normal: spoken.say, duress: spoken.duress })
      expect(checkWords(listener, choices.normal, now)).toBe('match')
      expect(checkWords(listener, choices.duress, now)).toBe('signal')
    }
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
