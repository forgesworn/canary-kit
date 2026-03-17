/**
 * Conformance test suite — validates the TypeScript implementation against
 * every vector in conformance/vectors.json.
 *
 * Run: npx vitest run src/conformance.test.ts --reporter=verbose
 */

import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { describe, it, expect } from 'vitest'

import { deriveTokenBytes, deriveToken, deriveDuressToken, verifyToken, deriveLivenessToken } from './token.js'
import { deriveVerificationWord, deriveVerificationPhrase, deriveDuressWord } from './derive.js'
import { verifyWord } from './verify.js'
import { deriveBeaconKey } from './beacon.js'
import { getCounter } from './counter.js'
import { bytesToHex } from './crypto.js'
import type { TokenEncoding } from './encoding.js'

// ---------------------------------------------------------------------------
// Load conformance data
// ---------------------------------------------------------------------------

const vectorsUrl = new URL('../conformance/vectors.json', import.meta.url)
const wordlistUrl = new URL('../conformance/wordlist-en-v1.txt', import.meta.url)

const vectors = JSON.parse(readFileSync(vectorsUrl, 'utf8'))
const wordlistRaw = readFileSync(wordlistUrl)
const wordlistText = readFileSync(wordlistUrl, 'utf8')
const wordlistLines = wordlistText.split('\n')

// ---------------------------------------------------------------------------
// Helper: resolve an input reference or return the literal value
// ---------------------------------------------------------------------------

function resolve(inputs: Record<string, string>, value: string): string {
  return inputs[value] ?? value
}

// ---------------------------------------------------------------------------
// Wordlist integrity
// ---------------------------------------------------------------------------

describe('wordlist', () => {
  it('SHA-256 matches vectors.wordlist_sha256', () => {
    const digest = createHash('sha256').update(wordlistRaw).digest('hex')
    expect(digest).toBe(vectors.wordlist_sha256)
  })

  for (const check of vectors.wordlist_spotchecks) {
    it(`spot-check index ${check.index} = "${check.word}"`, () => {
      expect(wordlistLines[check.index]).toBe(check.word)
    })
  }
})

// ---------------------------------------------------------------------------
// Universal vectors (CANARY-DERIVE + CANARY-DURESS, context-based API)
// ---------------------------------------------------------------------------

describe('universal', () => {
  const { inputs, vectors: uvectors } = vectors.universal
  const secret = inputs.secret

  for (const vector of uvectors) {
    it(vector.id, () => {

      switch (vector.function) {
        case 'deriveTokenBytes': {
          const result = deriveTokenBytes(secret, vector.context, vector.counter)
          expect(bytesToHex(result)).toBe(vector.expected)
          break
        }

        case 'deriveToken': {
          const encoding = vector.encoding as TokenEncoding
          if (vector.expectedError) {
            expect(() => deriveToken(secret, vector.context, vector.counter, encoding)).toThrow(vector.expectedError)
          } else {
            const result = deriveToken(secret, vector.context, vector.counter, encoding)
            expect(result).toBe(vector.expected)
          }
          break
        }

        case 'deriveDuressToken': {
          const encoding = vector.encoding as TokenEncoding
          const result = deriveDuressToken(
            secret,
            vector.context,
            vector.identity,
            vector.counter,
            encoding,
            vector.maxTolerance,
          )
          expect(result).toBe(vector.expected)
          break
        }

        case 'verifyToken': {
          const result = verifyToken(
            secret,
            vector.context,
            vector.counter,
            vector.input,
            vector.identities,
          )
          expect(result.status).toBe(vector.expected.status)
          if (vector.expected.identities !== undefined) {
            expect(result.identities).toEqual(vector.expected.identities)
          }
          break
        }

        case 'deriveLivenessToken': {
          const result = deriveLivenessToken(
            secret,
            vector.context,
            vector.identity,
            vector.counter,
          )
          expect(bytesToHex(result)).toBe(vector.expected)
          break
        }

        default:
          throw new Error(`Unknown function in universal vector ${vector.id}: ${vector.function}`)
      }
    })
  }
})

// ---------------------------------------------------------------------------
// Group vectors (seed + counter, context = 'canary:group')
// ---------------------------------------------------------------------------

describe('group', () => {
  const { inputs, vectors: gvectors } = vectors.group

  for (const vector of gvectors) {
    it(vector.id, () => {
      switch (vector.function) {
        case 'deriveVerificationWord': {
          const seed = resolve(inputs, vector.seed)
          const result = deriveVerificationWord(seed, vector.counter)
          expect(result).toBe(vector.expected)
          break
        }

        case 'deriveVerificationPhrase': {
          const seed = resolve(inputs, vector.seed)
          const result = deriveVerificationPhrase(seed, vector.counter, vector.wordCount)
          expect(result).toEqual(vector.expected)
          break
        }

        case 'deriveDuressWord': {
          const seed = resolve(inputs, vector.seed)
          const pubkey = resolve(inputs, vector.pubkey)
          const result = deriveDuressWord(seed, pubkey, vector.counter)
          expect(result).toBe(vector.expected)
          break
        }

        case 'verifyWord': {
          const seed = resolve(inputs, vector.seed)
          const memberPubkeys = vector.members.map((m: string) => resolve(inputs, m))
          const result = verifyWord(vector.input, seed, memberPubkeys, vector.counter)
          expect(result.status).toBe(vector.expected.status)
          if (vector.expected.members !== undefined) {
            const expectedMembers = vector.expected.members.map((m: string) => resolve(inputs, m))
            expect(result.members).toEqual(expectedMembers)
          }
          break
        }

        default:
          throw new Error(`Unknown function in group vector ${vector.id}: ${vector.function}`)
      }
    })
  }
})

// ---------------------------------------------------------------------------
// Beacon vectors (deriveBeaconKey)
// ---------------------------------------------------------------------------

describe('beacon', () => {
  const { inputs, vectors: bvectors } = vectors.beacon

  for (const vector of bvectors) {
    it(vector.id, () => {
      const seed = resolve(inputs, vector.seed)
      const result = deriveBeaconKey(seed)
      expect(bytesToHex(result)).toBe(vector.expected)
    })
  }
})

// ---------------------------------------------------------------------------
// Counter vectors (getCounter)
// ---------------------------------------------------------------------------

describe('counter', () => {
  const { vectors: cvectors } = vectors.counter

  for (const vector of cvectors) {
    it(vector.id, () => {
      const result = getCounter(vector.timestamp, vector.interval)
      expect(result).toBe(vector.expected)
    })
  }
})
