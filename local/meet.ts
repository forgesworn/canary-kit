import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import * as nip44 from 'nostr-tools/nip44'
import { entropyToMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { bytesToHex, hexToBytes, hmacSha256, sha256 } from '../src/crypto.js'
import type { Pair } from './model.js'

export interface MeetingCard { id:string; pub:string; commitment:string }
export interface MeetingMessage { card:MeetingCard; to?:string; reveal?:string }
export interface Meeting { id:string; secret:string; nonce:string; peer?:MeetingCard; peerReveal?:string }
const encoder=new TextEncoder()
const hex=(v:unknown,n:number):v is string=>typeof v==='string'&&new RegExp(`^[0-9a-f]{${n}}$`).test(v)
function card(raw:unknown):MeetingCard {
 const v=raw as MeetingCard
 if(!v||!hex(v.id,32)||!hex(v.pub,64)||!hex(v.commitment,64))throw new Error('This is not a Vouch connection code.')
 return{id:v.id,pub:v.pub,commitment:v.commitment}
}
function commit(c:Pick<MeetingCard,'id'|'pub'>,nonce:string){return bytesToHex(sha256(encoder.encode(JSON.stringify(['canary:offline-meet:commit:v1',c.id,c.pub,nonce]))))}
function message(raw:MeetingCard|MeetingMessage):MeetingMessage {
 const input='card' in raw?raw:{card:raw},c=card(input.card)
 if(input.to===undefined&&input.reveal===undefined)return{card:c}
 if(!hex(input.to,32)||!hex(input.reveal,64)||commit(c,input.reveal)!==c.commitment)throw new Error('The other code does not match its original connection. Start again together.')
 return{card:c,to:input.to,reveal:input.reveal}
}
export function meetingCard(meeting:Meeting):MeetingCard {
 if(!hex(meeting.id,32)||!hex(meeting.secret,64)||!hex(meeting.nonce,64))throw new Error('This saved connection is invalid.')
 const secret=hexToBytes(meeting.secret)
 try{const base={id:meeting.id,pub:getPublicKey(secret)};return{...base,commitment:commit(base,meeting.nonce)}}finally{secret.fill(0)}
}
export function meetingMessage(meeting:Meeting):MeetingMessage {
 const c=meetingCard(meeting)
 return meeting.peer?{card:c,to:meeting.peer.id,reveal:meeting.nonce}:{card:c}
}
export function newMeeting():Meeting {
 const secret=generateSecretKey()
 try{return{id:bytesToHex(crypto.getRandomValues(new Uint8Array(16))),secret:bytesToHex(secret),nonce:bytesToHex(crypto.getRandomValues(new Uint8Array(32)))}}finally{secret.fill(0)}
}
export function matchMeeting(meeting:Meeting,input:MeetingCard|MeetingMessage):Meeting {
 const own=meetingCard(meeting),incoming=message(input),peer=incoming.card
 if(own.id===peer.id||own.pub===peer.pub)throw new Error('That is your own code. Point at the other device.')
 if(meeting.peer&&(meeting.peer.id!==peer.id||meeting.peer.pub!==peer.pub||meeting.peer.commitment!==peer.commitment))throw new Error('This connection already has another device. Finish it, or start again together.')
 if(incoming.reveal&&incoming.to!==own.id)throw new Error('That reply is for another device. Both open a fresh Connect screen.')
 if(meeting.peerReveal&&incoming.reveal&&meeting.peerReveal!==incoming.reveal)throw new Error('The other device changed its connection code.')
 const secret=hexToBytes(meeting.secret)
 try{const shared=nip44.v2.utils.getConversationKey(secret,peer.pub);shared.fill(0)}finally{secret.fill(0)}
 return{...meeting,peer,...(incoming.reveal?{peerReveal:incoming.reveal}:{})}
}
export function pairFromMeeting(meeting:Meeting):Pair {
 if(!meeting.peer||!meeting.peerReveal)throw new Error('Wait for both devices to finish reading the codes.')
 const own=meetingCard(meeting),peer=card(meeting.peer)
 if(commit(peer,meeting.peerReveal)!==peer.commitment)throw new Error('The saved connection changed.')
 const ordered=[{card:own,nonce:meeting.nonce},{card:peer,nonce:meeting.peerReveal}].sort((a,b)=>a.card.pub<b.card.pub?-1:1)
 const secret=hexToBytes(meeting.secret);let shared:Uint8Array|undefined,material:Uint8Array|undefined
 try{
  shared=nip44.v2.utils.getConversationKey(secret,peer.pub)
  // Pin each public key AND nonce commitment before releasing our nonce. Both
  // reveals then enter the HMAC transcript, so keys cannot be ground after seeing
  // the other side's random contribution to the short comparison words.
  material=hmacSha256(shared,encoder.encode(JSON.stringify(['canary:offline-meet:seed:v1',...ordered.map(p=>[p.card.id,p.card.pub,p.card.commitment,p.nonce])])))
  return{v:1,mnemonic:entropyToMnemonic(material.subarray(0,16),wordlist),role:ordered[0].card.pub===own.pub?'first':'second'}
 }finally{secret.fill(0);shared?.fill(0);material?.fill(0)}
}
export function readMeeting(raw:unknown):Meeting {
 const v=raw as Meeting;if(!v)throw new Error('Invalid saved connection.')
 const own:Meeting={id:v.id,secret:v.secret,nonce:v.nonce};meetingCard(own)
 if(!v.peer){if(v.peerReveal!==undefined)throw new Error('Missing peer connection.');return own}
 return matchMeeting(own,{card:v.peer,...(v.peerReveal?{to:v.id,reveal:v.peerReveal}:{})})
}
export function readMeetings(raw:unknown):Meeting[] {
 if(raw===undefined)return[]
 if(!Array.isArray(raw)||raw.length>8)throw new Error('Finish or remove a saved connection before starting another.')
 const values=raw.map(readMeeting)
 if(new Set(values.map(v=>v.id)).size!==values.length||new Set(values.map(v=>meetingCard(v).pub)).size!==values.length)throw new Error('Duplicated saved connection.')
 return values
}
function pack(hexadecimal:string):string {
 return btoa(String.fromCharCode(...hexToBytes(hexadecimal))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
}
function unpack(value:string,bytes:number):string {
 if(!/^[A-Za-z0-9_-]+$/.test(value))throw new Error('This is not a Vouch connection code.')
 const raw=atob(value.replace(/-/g,'+').replace(/_/g,'/')),hexadecimal=bytesToHex(Uint8Array.from(raw,c=>c.charCodeAt(0)))
 if(raw.length!==bytes||pack(hexadecimal)!==value)throw new Error('This is not a Vouch connection code.')
 return hexadecimal
}
export function meetingToken(input:MeetingCard|MeetingMessage):string {
 const v=message(input),c=v.card
 return`CANARY-MEET:1:${pack(c.id+c.pub+c.commitment)}`+(v.reveal?`:${pack(v.to!+v.reveal)}`:'')
}
export function meetingLink(input:MeetingCard|MeetingMessage,address:string):string {
 const url=new URL(address)
 if(url.protocol!=='https:'||url.username||url.password||url.search)throw new Error('Normal camera links need the trusted HTTPS address.')
 url.hash='meet='+meetingToken(input);return url.href
}
export function meetingInput(input:string,address:string):MeetingMessage {
 if(typeof input!=='string'||input.length>2048)throw new Error('This connection code is too large or invalid.')
 let token=input
 if(!token.startsWith('CANARY-MEET:')){
  const url=new URL(input,address),expected=new URL(address)
  if(url.origin!==expected.origin||url.pathname!==expected.pathname||url.username||url.password||url.search||!url.hash.startsWith('#meet='))throw new Error('Use a connection code from this Vouch website.')
  token=url.hash.slice(6)
 }
 const m=/^CANARY-MEET:1:([A-Za-z0-9_-]{107})(?::([A-Za-z0-9_-]{64}))?$/.exec(token)
 if(!m)throw new Error('This is not a Vouch connection code.')
 const c=unpack(m[1],80),reveal=m[2]?unpack(m[2],48):undefined
 return message({card:{id:c.slice(0,32),pub:c.slice(32,96),commitment:c.slice(96)},...(reveal?{to:reveal.slice(0,32),reveal:reveal.slice(32)}:{})})
}
