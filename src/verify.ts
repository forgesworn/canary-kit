/**
 * Group-level word verification — thin wrapper around the universal token API.
 *
 * Maps verifyToken results to group-specific statuses:
 * - 'verified' = exact counter match
 * - 'duress'   = duress token detected (with member pubkeys)
 * - 'stale'    = valid token from an adjacent counter (out of sync)
 * - 'failed'   = no match
 */

import { verifyToken, deriveToken } from './token.js'
import type { TokenEncoding } from './encoding.js'
import { GROUP_CONTEXT } from './derive.js'
import { timingSafeStringEqual } from './crypto.js'

export type VerifyStatus = 'verified' | 'duress' | 'stale' | 'failed'

export interface VerifyResult {
  /** The outcome of the verification check. */
  status: VerifyStatus
  /** Pubkeys of members whose duress word matched (only when status = 'duress'). */
  members?: string[]
}

/**
 * Verify a spoken word against the group's current state.
 *
 * Checks in order:
 * 1. Current verification word → verified
 * 2. ALL members' duress words within tolerance window → duress (with all matching members)
 * 3. Adjacent verification word within tolerance → stale (out of sync)
 * 4. None matched → failed
 *
 * Per CANARY-DURESS: the verifier MUST check all identities and collect all matches.
 * The verifier MUST NOT short-circuit after the first duress match.
 */
export function verifyWord(
  spokenWord: string,
  seedHex: string,
  memberPubkeys: string[],
  counter: number,
  wordCount: 1 | 2 | 3 = 1,
  tolerance: number = 1,
): VerifyResult {
  const encoding: TokenEncoding = wordCount === 1
    ? undefined as unknown as TokenEncoding  // default single-word encoding
    : { format: 'words', count: wordCount }
  const encodingOpt = wordCount === 1 ? undefined : encoding

  const result = verifyToken(seedHex, GROUP_CONTEXT, counter, spokenWord, memberPubkeys, {
    encoding: encodingOpt,
    tolerance,
  })

  if (result.status === 'invalid') return { status: 'failed' }
  if (result.status === 'duress') return { status: 'duress', members: result.identities }

  // result.status === 'valid' — distinguish exact from stale
  const normalised = spokenWord.toLowerCase().trim().replace(/\s+/g, ' ')
  const exact = deriveToken(seedHex, GROUP_CONTEXT, counter, encodingOpt)
  if (timingSafeStringEqual(normalised, exact)) return { status: 'verified' }
  return { status: 'stale' }
}
