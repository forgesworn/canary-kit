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
 * If the result collides with the verification word, re-derives with
 * incrementing suffix bytes (0x01..0xFF) to guarantee the duress word
 * never matches the verification word. Throws if all 255 suffixes collide.
 */
export function deriveDuressWord(
  seedHex: string,
  memberPubkeyHex: string,
  counter: number,
): string {
  const seedBuf = seedToBytes(seedHex)
  const pubkeyBuf = hexToBytes(memberPubkeyHex)
  const counterBuf = counterToBytes(counter)
  const verificationWord = deriveVerificationWord(seedHex, counter)

  const baseKey = concatBytes(seedBuf, pubkeyBuf)
  let raw = hmacSha256(baseKey, counterBuf)
  let word = getWord(readUint16BE(raw, 0) % WORDLIST_SIZE)

  // Collision avoidance: deterministic multi-suffix retry
  let suffix = 1
  while (word === verificationWord && suffix <= 255) {
    const reKey = concatBytes(seedBuf, pubkeyBuf, new Uint8Array([suffix]))
    raw = hmacSha256(reKey, counterBuf)
    word = getWord(readUint16BE(raw, 0) % WORDLIST_SIZE)
    suffix++
  }

  if (word === verificationWord) {
    throw new Error('Duress word collision unresolvable after 255 retries')
  }

  return word
}

/**
 * Derive a multi-word duress phrase for a given member.
 * Each word uses a consecutive 2-byte slice of the HMAC digest.
 * If the entire phrase matches the verification phrase, re-derives with
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
  const verifyPhrase = deriveVerificationPhrase(seedHex, counter, wordCount)

  const baseKey = concatBytes(seedBuf, pubkeyBuf)
  let raw = hmacSha256(baseKey, counterBuf)
  const words: string[] = []

  for (let i = 0; i < wordCount; i++) {
    const index = readUint16BE(raw, i * 2) % WORDLIST_SIZE
    words.push(getWord(index))
  }

  // Collision avoidance: deterministic multi-suffix retry
  let suffix = 1
  while (words.every((w, i) => w === verifyPhrase[i]) && suffix <= 255) {
    raw = hmacSha256(concatBytes(seedBuf, pubkeyBuf, new Uint8Array([suffix])), counterBuf)
    for (let i = 0; i < wordCount; i++) {
      words[i] = getWord(readUint16BE(raw, i * 2) % WORDLIST_SIZE)
    }
    suffix++
  }

  if (words.every((w, i) => w === verifyPhrase[i])) {
    throw new Error('Duress phrase collision unresolvable after 255 retries')
  }

  return words
}
