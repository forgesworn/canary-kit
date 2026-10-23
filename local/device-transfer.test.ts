import { describe, it, expect } from 'vitest'
import { newDeviceRequest, makeDeviceCopy, openDeviceCopy, deviceCode, mergePeople, readDevices, deviceLink, deviceInput } from './device-transfer.js'
import { createPair, wordsAt } from './model.js'
import type { Entry } from './vault.js'
import { bytesToHex, sha256 } from '../src/crypto.js'
const now = 1_790_000_000
const person = (id: string, label: string): Entry => ({ id, label, pair: createPair() })
describe('local device copy', () => {
  it('encrypts selected people only to the requesting device and binds the comparison code to the whole copy', () => {
    const receive = newDeviceRequest(now), entries = [person('alice', 'Alice')]
    const sent = makeDeviceCopy(receive.request, entries, now)
    const opened = openDeviceCopy(receive, sent.file, now)
    expect(opened).toEqual(entries)
    expect(sent.code).toBe(deviceCode(sent.file))
    expect(sent.file).not.toContain('Alice')
    expect(sent.file).not.toContain(entries[0].pair.mnemonic)
    // A public plaintext hash would let someone who already knows a pair seed
    // test guesses about its private contact notes. The manifest is keyed.
    const dictionaryHash = bytesToHex(sha256(new TextEncoder().encode('canary:device-copy:1:'+receive.request.id+':'+JSON.stringify({v:1,entries}))))
    expect(JSON.parse(sent.file).digest).not.toBe(dictionaryHash)
    expect(deviceLink(receive.request, 'https://canary.test/')).not.toContain(receive.secret)
    expect(deviceInput(deviceLink(receive.request, 'https://canary.test/'), 'https://canary.test/')).toEqual(receive.request)
    expect(() => deviceInput(deviceLink(receive.request, 'https://evil.test/'), 'https://canary.test/')).toThrow()
    expect(wordsAt(opened[0].pair,now)).toEqual(wordsAt(entries[0].pair,now))
  })
  it('rejects wrong recipients, expiry, tampering, reordered/incomplete chunks and unconfirmed pairs', () => {
    const receive = newDeviceRequest(now), other = newDeviceRequest(now)
    const entries = Array.from({length:100},(_,i)=>person('id-'+i,'Person '+i))
    const sent = makeDeviceCopy(receive.request, entries, now)
    const packet = JSON.parse(sent.file)
    expect(packet.parts.length).toBeGreaterThan(1)
    expect(openDeviceCopy(receive,sent.file,now)).toEqual(entries)
    expect(() => openDeviceCopy(other,sent.file,now)).toThrow()
    expect(() => openDeviceCopy(receive,sent.file,now+901)).toThrow()
    expect(() => makeDeviceCopy(receive.request,entries,now+901)).toThrow()
    expect(() => openDeviceCopy(receive,JSON.stringify({...packet,parts:[...packet.parts].reverse()}),now)).toThrow()
    expect(() => openDeviceCopy(receive,JSON.stringify({...packet,parts:packet.parts.slice(1)}),now)).toThrow()
    const altered = {...packet,digest:'0'.repeat(64)}
    expect(() => openDeviceCopy(receive,JSON.stringify(altered),now)).toThrow()
    expect(deviceCode(JSON.stringify(altered))).not.toBe(sent.code)
    expect(() => makeDeviceCopy(receive.request,[{...entries[0],setup:{method:'in-person'}}],now)).toThrow()
    expect(() => openDeviceCopy(receive,'x'.repeat(500_000),now)).toThrow()
  })
  it('preserves destination data, skips duplicate seeds and remaps colliding IDs', () => {
    const kept = person('same-id','My existing name'), incoming = person('same-id','New friend')
    const duplicate = {...kept,id:'other-id',label:'Different imported name'}
    const result = mergePeople([kept],[duplicate,incoming])
    expect(result.entries[0]).toEqual(kept)
    expect(result.entries[1].pair).toEqual(incoming.pair)
    expect(result.entries[1].id).not.toBe(kept.id)
    expect(result.added).toBe(1); expect(result.skipped).toBe(1)
    expect(mergePeople([kept],[{...kept,pair:{...kept.pair,role:'second'}}]).skipped).toBe(1)
    expect(() => mergePeople(Array.from({length:200},(_,i)=>person('p'+i,'Person')), [incoming])).toThrow()
  })
  it('validates encrypted-vault transfer state without making expired requests prevent vault recovery', () => {
    const receive = newDeviceRequest(now)
    const sent = makeDeviceCopy(receive.request,[person('p','Friend')],now)
    expect(readDevices({receive,send:{file:sent.file,count:1}})).toEqual({receive,send:{file:sent.file,count:1}})
    expect(() => readDevices({receive:{...receive,secret:newDeviceRequest(now).secret}})).toThrow()
    expect(() => readDevices({send:{file:'bad',count:1}})).toThrow()
  })
})
