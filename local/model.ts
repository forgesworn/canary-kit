import { generateMnemonic, mnemonicToEntropy, entropyToMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { deriveToken, deriveDuressToken } from '../src/token.js'
import { bytesToHex, hexToBytes, sha256, timingSafeStringEqual } from '../src/crypto.js'

export const INTERVAL = 30
const CONTEXT = 'canary:local-pair:v1'
const ROLES = ['first', 'second'] as const
const ENCODING = { format: 'words', count: 2 } as const
const TOLERANCE = 1
const SETUP_WORDS = new Set(wordlist)
const SETUP_PREFIXES = new Map(wordlist.map(word => [word.slice(0, 4), word]))
export type Role = typeof ROLES[number]
export interface Pair { v: 1; mnemonic: string; role: Role }

export function createPair(): Pair {
  return { v: 1, mnemonic: generateMnemonic(wordlist, 128), role: 'first' }
}

export function joinPair(input: string, role: Role = 'second'): Pair {
  if (typeof input !== 'string' || input.length > 300) throw new Error('Enter the 12 setup words.')
  if (!ROLES.includes(role)) throw new Error('Choose the side you originally used.')
  const entered = input.toLowerCase().trim().split(/\s+/)
  if (entered.length !== 12) throw new Error('Enter all 12 setup words, in order. The first four letters of each word are enough.')
  const mnemonic = entered.map((word, index) => {
    if (SETUP_WORDS.has(word)) return word
    const expanded = word.length === 4 ? SETUP_PREFIXES.get(word) : undefined
    if (!expanded) throw new Error(`Check setup word ${index + 1}. Use its first four letters, or the full word.`)
    return expanded
  }).join(' ')
  try { mnemonicToEntropy(mnemonic, wordlist).fill(0) }
  catch { throw new Error('Those setup words do not pass the spelling and checksum check. Check them with the other person.') }
  return { v: 1, mnemonic, role }
}

export function makeInvite(pair: Pair): string {
  // Preserve existing first-to-second links; a recovering original creator
  // needs the first role when the original receiver shows the QR again.
  return withSeed(pair, seed => pair.role === 'first'
    ? `CANARY-LOCAL:1:${bytesToHex(seed)}`
    : `CANARY-LOCAL:2:${bytesToHex(seed)}:first`)
}

export function joinInvite(input: string): Pair {
  if (typeof input !== 'string' || input.length > 80) throw new Error('This is not a Canary pairing QR.')
  const match = /^CANARY-LOCAL:(?:1:([0-9a-f]{32})|2:([0-9a-f]{32}):(first|second))$/.exec(input)
  if (!match) throw new Error('This is not a Canary pairing QR.')
  const seed = hexToBytes(match[1] ?? match[2])
  try { return joinPair(entropyToMnemonic(seed, wordlist), (match[3] ?? 'second') as Role) }
  finally { seed.fill(0) }
}

function siteAddress(address: string): URL {
  const url = new URL(address)
  if (url.protocol !== 'https:' || url.username || url.password || url.search) throw new Error('Pairing links need a clean HTTPS website address.')
  url.hash = ''
  return url
}
export function inviteLink(pair: Pair, address: string): string {
  const url = siteAddress(address)
  url.hash = `pair=${makeInvite(pair)}`
  return url.href
}
export function joinFragment(fragment: string): Pair {
  if (typeof fragment !== 'string' || !fragment.startsWith('#pair=')) throw new Error('This is not a Canary pairing link.')
  return joinInvite(fragment.slice(6))
}
export function joinLink(input: string, address: string): Pair {
  if (typeof input !== 'string' || input.length > 2048) throw new Error('This is not a Canary pairing link.')
  const expected = siteAddress(address)
  const received = siteAddress(input)
  if (received.href !== expected.href) throw new Error('This pairing link belongs to a different website. Open the trusted Canary address together.')
  return joinFragment(new URL(input).hash)
}

export function readPair(raw: unknown): Pair {
  if (!raw || typeof raw !== 'object') throw new Error('This saved pair could not be opened.')
  const data = raw as Record<string, unknown>
  if (data.v !== 1 || typeof data.mnemonic !== 'string' || (data.role !== 'first' && data.role !== 'second')) {
    throw new Error('This saved pair uses an unsupported format.')
  }
  return joinPair(data.mnemonic, data.role)
}

function counterAt(nowSec: number): number {
  const counter = Math.floor(nowSec / INTERVAL)
  if (!Number.isFinite(nowSec) || nowSec < 0 || counter > 0xffffffff) throw new Error('Check this device’s date and time.')
  return counter
}

function withSeed<T>(pair: Pair, fn: (seed: Uint8Array) => T): T {
  const seed = mnemonicToEntropy(pair.mnemonic, wordlist)
  try { return fn(seed) } finally { seed.fill(0) }
}

export function pairReference(pair: Pair): string {
  return withSeed(pair, seed => bytesToHex(sha256(seed)).slice(0, 12).match(/.{4}/g)!.join(' '))
}
/** Fixed, role-independent comparison for the meeting, separate from rotating call words. */
export function pairComparison(pair: Pair): string {
  return withSeed(pair, seed => deriveToken(seed, CONTEXT + ':setup-comparison', 0, { format: 'words', count: 4 }))
}

export function wordsAt(pair: Pair, nowSec: number) {
  const counter = counterAt(nowSec)
  const theirRole = pair.role === 'first' ? 'second' : 'first'
  return withSeed(pair, seed => {
    const say = deriveToken(seed, CONTEXT, counter, ENCODING, pair.role)
    const hear = deriveToken(seed, CONTEXT, counter, ENCODING, theirRole)
    // A rare short-output collision must not turn the check into an echo.
    if (say === hear) throw new Error('Please wait for the next words before checking.')
    const duress = deriveDuressToken(seed, CONTEXT, pair.role, counter, ENCODING, TOLERANCE, [...ROLES])
    return { say, hear, duress }
  })
}

/** Listener-only comparison choices; never read either phrase to the caller. */
export function wordsToHear(pair: Pair, nowSec: number) {
  const speaker = wordsAt({ ...pair, role: pair.role === 'first' ? 'second' : 'first' }, nowSec)
  return { normal: speaker.say, duress: speaker.duress }
}

export function checkWords(pair: Pair, input: string, nowSec: number): 'match' | 'signal' | 'different' {
  if (typeof input !== 'string' || input.length > 100) return 'different'
  const spoken = input.toLowerCase().trim().replace(/\s+/g, ' ')
  const counter = counterAt(nowSec)
  const theirRole = pair.role === 'first' ? 'second' : 'first'
  return withSeed(pair, seed => {
    let normal = false
    let signal = false
    for (let c = Math.max(0, counter - TOLERANCE); c <= Math.min(0xffffffff, counter + TOLERANCE); c++) {
      const expected = deriveToken(seed, CONTEXT, c, ENCODING, theirRole)
      const own = deriveToken(seed, CONTEXT, c, ENCODING, pair.role)
      if (expected !== own && timingSafeStringEqual(spoken, expected)) normal = true
      const duress = deriveDuressToken(seed, CONTEXT, theirRole, c, ENCODING, TOLERANCE, [...ROLES])
      if (timingSafeStringEqual(spoken, duress)) signal = true
    }
    return signal ? 'signal' : normal ? 'match' : 'different'
  })
}
