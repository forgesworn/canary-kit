import { generateMnemonic, mnemonicToEntropy } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { deriveToken, deriveDuressToken } from '../src/token.js'
import { bytesToHex, sha256, timingSafeStringEqual } from '../src/crypto.js'

export const INTERVAL = 30
const CONTEXT = 'canary:local-pair:v1'
const ROLES = ['first', 'second'] as const
const ENCODING = { format: 'words', count: 2 } as const
const TOLERANCE = 1
export type Role = typeof ROLES[number]
export interface Pair { v: 1; mnemonic: string; role: Role }

export function createPair(): Pair {
  return { v: 1, mnemonic: generateMnemonic(wordlist, 128), role: 'first' }
}

export function joinPair(input: string, role: Role = 'second'): Pair {
  if (typeof input !== 'string' || input.length > 300) throw new Error('Enter the 12 setup words.')
  if (!ROLES.includes(role)) throw new Error('Choose the side you originally used.')
  const mnemonic = input.toLowerCase().trim().replace(/\s+/g, ' ')
  if (mnemonic.split(' ').length !== 12) throw new Error('Enter all 12 setup words, in order.')
  try { mnemonicToEntropy(mnemonic, wordlist).fill(0) }
  catch { throw new Error('Those setup words do not pass the spelling and checksum check. Check them with the other person.') }
  return { v: 1, mnemonic, role }
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
