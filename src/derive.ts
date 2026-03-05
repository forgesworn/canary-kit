import { hmacSha256, hexToBytes, concatBytes, readUint16BE } from './crypto.js'
import { counterToBytes } from './counter.js'
import { getWord, WORDLIST_SIZE } from './wordlist.js'

/** Parse a hex-encoded seed string to a Uint8Array. */
function seedToBytes(seedHex: string): Uint8Array {
  if (seedHex.length !== 64) {
    throw new Error(`Seed must be 64 hex characters (256 bits), got ${seedHex.length}`)
  }
  return hexToBytes(seedHex)
}

/**
 * Derive the verification word for a given seed and counter.
 * All group members derive the same word.
 *
 * The HMAC-SHA256 digest is computed with the seed as key and the
 * 8-byte big-endian counter as data. The first two bytes of the digest
 * are read as a big-endian uint16 and reduced modulo WORDLIST_SIZE (2048)
 * to yield the wordlist index.
 */
export function deriveVerificationWord(seedHex: string, counter: number): string {
  const raw = hmacSha256(seedToBytes(seedHex), counterToBytes(counter))
  const index = readUint16BE(raw, 0) % WORDLIST_SIZE
  return getWord(index)
}

/**
 * Derive a multi-word verification phrase.
 *
 * Each word is derived from a consecutive 2-byte slice of the HMAC-SHA256
 * digest, giving up to 16 independent words from a single 32-byte hash.
 * The phrase at position i uses bytes [i*2, i*2+1].
 */
export function deriveVerificationPhrase(
  seedHex: string,
  counter: number,
  wordCount: 1 | 2 | 3,
): string[] {
  const raw = hmacSha256(seedToBytes(seedHex), counterToBytes(counter))
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const index = readUint16BE(raw, i * 2) % WORDLIST_SIZE
    words.push(getWord(index))
  }
  return words
}

/**
 * Derive a member's duress word for a given seed, pubkey, and counter.
 * Unique per member, derivable by all group members who know the seed.
 * If the result collides with any verification word within the ±1
 * tolerance window (counter-1, counter, counter+1), re-derives with
 * incrementing suffix bytes (0x01..0xFF) to guarantee the duress word
 * is distinct. Throws if all 255 suffixes collide.
 */
export function deriveDuressWord(
  seedHex: string,
  memberPubkeyHex: string,
  counter: number,
): string {
  const seedBuf = seedToBytes(seedHex)
  const pubkeyBuf = hexToBytes(memberPubkeyHex)
  const counterBuf = counterToBytes(counter)

  // Collect verification words at counter and ±1 adjacent counters.
  // Cross-counter collision avoidance: duress word must not match any
  // verification word within verifyWord's fixed ±1 lookback window.
  const forbidden = new Set<string>()
  const lo = Math.max(0, counter - 1)
  const hi = Math.min(0xFFFFFFFF, counter + 1)
  for (let c = lo; c <= hi; c++) {
    forbidden.add(deriveVerificationWord(seedHex, c))
  }

  const baseKey = concatBytes(seedBuf, pubkeyBuf)
  let raw = hmacSha256(baseKey, counterBuf)
  let word = getWord(readUint16BE(raw, 0) % WORDLIST_SIZE)

  // Collision avoidance: deterministic multi-suffix retry
  let suffix = 1
  while (forbidden.has(word) && suffix <= 255) {
    const reKey = concatBytes(seedBuf, pubkeyBuf, new Uint8Array([suffix]))
    raw = hmacSha256(reKey, counterBuf)
    word = getWord(readUint16BE(raw, 0) % WORDLIST_SIZE)
    suffix++
  }

  if (forbidden.has(word)) {
    throw new Error('Duress word collision unresolvable after 255 retries')
  }

  return word
}

/**
 * Derive a multi-word duress phrase for a given member.
 * Each word uses a consecutive 2-byte slice of the HMAC digest.
 * If the entire phrase matches any verification phrase within the ±1
 * tolerance window (counter-1, counter, counter+1), re-derives with
 * incrementing suffix bytes (0x01..0xFF) until distinct. Throws if all
 * 255 suffixes collide.
 */
export function deriveDuressPhrase(
  seedHex: string,
  memberPubkeyHex: string,
  counter: number,
  wordCount: 1 | 2 | 3,
): string[] {
  const seedBuf = seedToBytes(seedHex)
  const pubkeyBuf = hexToBytes(memberPubkeyHex)
  const counterBuf = counterToBytes(counter)

  // Collect verification phrases at counter and ±1 adjacent counters.
  const forbiddenPhrases: string[][] = []
  const lo = Math.max(0, counter - 1)
  const hi = Math.min(0xFFFFFFFF, counter + 1)
  for (let c = lo; c <= hi; c++) {
    forbiddenPhrases.push(deriveVerificationPhrase(seedHex, c, wordCount))
  }

  const baseKey = concatBytes(seedBuf, pubkeyBuf)
  let raw = hmacSha256(baseKey, counterBuf)
  const words: string[] = []

  for (let i = 0; i < wordCount; i++) {
    const index = readUint16BE(raw, i * 2) % WORDLIST_SIZE
    words.push(getWord(index))
  }

  const matchesForbidden = () =>
    forbiddenPhrases.some(fp => words.every((w, i) => w === fp[i]))

  // Collision avoidance: deterministic multi-suffix retry
  let suffix = 1
  while (matchesForbidden() && suffix <= 255) {
    raw = hmacSha256(concatBytes(seedBuf, pubkeyBuf, new Uint8Array([suffix])), counterBuf)
    for (let i = 0; i < wordCount; i++) {
      words[i] = getWord(readUint16BE(raw, i * 2) % WORDLIST_SIZE)
    }
    suffix++
  }

  if (matchesForbidden()) {
    throw new Error('Duress phrase collision unresolvable after 255 retries')
  }

  return words
}

/**
 * Derive the current verification word for a group.
 * Returns the first word of the current derivation.
 */
export function deriveCurrentWord(group: { seed: string; counter: number }): string {
  return deriveVerificationWord(group.seed, group.counter)
}
