/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { newMeeting, meetingCard, meetingMessage, meetingToken, meetingInput, meetingLink, readMeeting, readMeetings, pairFromMeeting, matchMeeting } from './meet.js'
import { pairComparison, wordsAt } from './model.js'
import { createECDH, createHash, createHmac } from 'node:crypto'
import { mnemonicToEntropy } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

describe('offline optical meeting', () => {
  it('matches an independent Node/OpenSSL ECDH and HMAC reference transcript',()=>{
    const a={id:'11'.repeat(16),secret:'00'.repeat(31)+'01',nonce:'aa'.repeat(32)},b={id:'22'.repeat(16),secret:'00'.repeat(31)+'02',nonce:'bb'.repeat(32)}
    const first=matchMeeting(a,meetingCard(b)),second=matchMeeting(b,meetingMessage(first)),done=matchMeeting(first,meetingMessage(second))
    const ec=createECDH('secp256k1');ec.setPrivateKey(a.secret,'hex')
    const shared=ec.computeSecret('02'+meetingCard(b).pub,'hex')
    const extracted=createHmac('sha256','nip44-v2').update(shared).digest()
    const ordered=[{card:meetingCard(a),nonce:a.nonce},{card:meetingCard(b),nonce:b.nonce}].sort((x,y)=>x.card.pub<y.card.pub?-1:1)
    for(const p of ordered)expect(p.card.commitment).toBe(createHash('sha256').update(JSON.stringify(['canary:offline-meet:commit:v1',p.card.id,p.card.pub,p.nonce])).digest('hex'))
    const seed=createHmac('sha256',extracted).update(JSON.stringify(['canary:offline-meet:seed:v1',...ordered.map(p=>[p.card.id,p.card.pub,p.card.commitment,p.nonce])])).digest().subarray(0,16)
    expect(mnemonicToEntropy(pairFromMeeting(done).mnemonic,wordlist)).toEqual(new Uint8Array(seed))
    expect(pairFromMeeting(done).role).toBe('first')
  })
  it('derives opposite speaking roles and the same fixed words from two public cards', () => {
    const alice=newMeeting(),bob=newMeeting()
    const first=matchMeeting(alice,meetingCard(bob)),second=matchMeeting(bob,meetingMessage(first)),last=matchMeeting(first,meetingMessage(second))
    const a=pairFromMeeting(last),b=pairFromMeeting(second)
    expect(a.mnemonic).toBe(b.mnemonic);expect(a.role).not.toBe(b.role)
    expect(pairComparison(a)).toBe(pairComparison(b));expect(pairComparison(a).split(' ')).toHaveLength(4)
    expect(wordsAt(a,1_800_000_000).say).toBe(wordsAt(b,1_800_000_000).hear)
    for(const secret of [alice.secret,bob.secret,a.mnemonic])expect(meetingToken(meetingCard(alice))+meetingToken(meetingCard(bob))).not.toContain(secret)
  })
  it('pins one peer and resumes the exact pair across serialisation without a clock deadline', () => {
    const alice=newMeeting(),bob=newMeeting(),stranger=newMeeting()
    const pinned=matchMeeting(alice,meetingCard(bob)),bobPinned=matchMeeting(bob,meetingMessage(pinned)),matched=matchMeeting(pinned,meetingMessage(bobPinned))
    const restored=readMeeting(JSON.parse(JSON.stringify(matched)))
    expect(restored).toEqual(matched)
    expect(pairFromMeeting(restored)).toEqual(pairFromMeeting(matched))
    expect(matchMeeting(restored,meetingCard(bob))).toEqual(restored)
    expect(()=>matchMeeting(restored,meetingCard(stranger))).toThrow(/another|different/i)
    expect(()=>pairFromMeeting(matchMeeting(alice,meetingCard(stranger)))).toThrow(/Wait/)
  })
  it('rejects reflection, malformed curve points, ambiguous tokens and other-site links', () => {
    const own=newMeeting(),peer=newMeeting(),card=meetingCard(peer)
    expect(()=>matchMeeting(own,meetingCard(own))).toThrow()
    expect(()=>matchMeeting(own,{...meetingCard(own),id:card.id})).toThrow()
    expect(()=>readMeeting({...own,secret:'0'.repeat(64)})).toThrow()
    expect(()=>matchMeeting(own,{...card,pub:'f'.repeat(64)})).toThrow()
    const token=meetingToken(card),url=meetingLink(card,'https://vouch.test/')
    expect(token.length).toBeLessThan(125)
    expect(meetingInput(url,'https://vouch.test/')).toEqual({card})
    expect(meetingInput(token,'https://vouch.test/')).toEqual({card})
    const revealed=meetingMessage(matchMeeting(own,card)),revealedToken=meetingToken(revealed)
    expect(revealedToken.length).toBeLessThan(190)
    expect(meetingInput(revealedToken,'https://vouch.test/')).toEqual(revealed)
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',noncanonical=token.slice(0,-1)+alphabet[alphabet.indexOf(token.at(-1)!)|1]
    for(const bad of [token+':more',token.replace('CANARY','canary'),noncanonical,'x'.repeat(9000),url.replace('vouch.test','other.test'),url.replace('/#','/other#')])expect(()=>meetingInput(bad,'https://vouch.test/')).toThrow()
  })
  it('requires a pinned commitment and matching, recipient-bound reveal before deriving words',()=>{
    const a=newMeeting(),b=newMeeting(),other=newMeeting(),pinned=matchMeeting(a,meetingCard(b))
    expect(()=>pairFromMeeting(pinned)).toThrow(/Wait/)
    const reply=meetingMessage(matchMeeting(b,meetingCard(a)))
    expect(()=>matchMeeting(pinned,{...reply,reveal:'0'.repeat(64)})).toThrow()
    expect(()=>matchMeeting(pinned,{...reply,to:other.id})).toThrow()
    const done=matchMeeting(pinned,reply)
    expect(pairFromMeeting(done).mnemonic).toBe(pairFromMeeting(matchMeeting(matchMeeting(b,meetingCard(a)),meetingMessage(pinned))).mnemonic)
    expect(()=>matchMeeting(done,{card:{...meetingCard(b),commitment:'0'.repeat(64)}})).toThrow()
  })
  it('bounds local unfinished sessions without dropping any existing session', () => {
    const sessions=Array.from({length:8},()=>newMeeting())
    expect(readMeetings(sessions)).toHaveLength(8)
    expect(()=>readMeetings([...sessions,newMeeting()])).toThrow()
    expect(()=>readMeetings([sessions[0],sessions[0]])).toThrow()
    expect(readMeetings(undefined)).toEqual([])
  })
})
