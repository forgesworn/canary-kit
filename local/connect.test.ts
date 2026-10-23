import { describe, expect, it } from 'vitest'
import { beginConnect, acceptConnect, finishConnect, readConnect, readExchange } from './connect.js'
import { wordsAt, pairReference, pairComparison } from './model.js'

describe('private app-to-app pairing over an existing messenger', () => {
  it('uses the encrypted exchange for in-person QR pairing without exposing the seed', () => {
    const draft = beginConnect('Sam', 'in-person')
    const offer = readConnect(draft.invite)
    expect(offer.method).toBe('in-person')
    const result = acceptConnect(draft.invite)
    const first = finishConnect(draft, result.reply)
    expect(pairReference(first)).toBe(pairReference(result.pair))
    expect(pairComparison(first)).toBe(pairComparison(result.pair))
    expect(pairComparison(first).split(' ')).toHaveLength(4)
    expect(result.reply).not.toContain(first.mnemonic)
    expect(draft.invite).not.toContain(draft.secret)
    expect(readExchange(JSON.parse(JSON.stringify(draft)))).toEqual(draft)
  })
  it('exchanges only a public invitation and recipient-encrypted response, deriving opposite sides', () => {
    const draft = beginConnect('Alice')
    const accepted = acceptConnect(draft.invite)
    const first = finishConnect(draft, accepted.reply)
    expect(first.role).toBe('first')
    expect(accepted.pair.role).toBe('second')
    expect(pairReference(first)).toBe(pairReference(accepted.pair))
    expect(wordsAt(first, 1_790_000_000).say).toBe(wordsAt(accepted.pair, 1_790_000_000).hear)
    expect(draft.invite).not.toContain(draft.secret)
    expect(accepted.reply).not.toContain(first.mnemonic)
    expect(readExchange(JSON.parse(JSON.stringify(draft)))).toEqual(draft)
  })
  it('rejects replies for another exchange, tampered ciphertext and invalid or unbounded input', () => {
    const draft = beginConnect('Alice'), other = beginConnect('Bob')
    const { reply } = acceptConnect(draft.invite)
    expect(() => finishConnect(other, reply)).toThrow()
    const packet = readConnect(reply)
    expect(() => finishConnect(draft, JSON.stringify({ ...packet, box: packet.type === 'reply' ? packet.box.slice(0, -8) + 'AAAAAAAA' : '' }))).toThrow()
    for (const bad of ['{}', 'x'.repeat(4000), JSON.stringify({ v: 1, type: 'offer', id: 'bad', pub: '00' })]) expect(() => readConnect(bad)).toThrow()
    expect(() => acceptConnect(reply)).toThrow()
    expect(() => readExchange({ ...draft, secret: other.secret })).toThrow()
  })
})
