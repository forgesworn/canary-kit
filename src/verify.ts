import { deriveVerificationWord, deriveDuressWord, deriveVerificationPhrase, deriveDuressPhrase } from './derive.js'
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
 * 2. ALL members' duress words at current counter → duress (with all matching members)
 * 3. ALL members' duress words at previous counter → duress (stale duress, out of sync)
 * 4. Previous window's verification word → stale (out of sync)
 * 5. None matched → failed
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
): VerifyResult {
  const normalised = spokenWord.toLowerCase().trim().replace(/\s+/g, ' ')

  function verifyPhrase(seed: string, c: number): string {
    if (wordCount === 1) return deriveVerificationWord(seed, c)
    return deriveVerificationPhrase(seed, c, wordCount).join(' ')
  }

  function duressPhrase(seed: string, pubkey: string, c: number): string {
    if (wordCount === 1) return deriveDuressWord(seed, pubkey, c)
    return deriveDuressPhrase(seed, pubkey, c, wordCount).join(' ')
  }

  // Compute all branches to prevent timing side-channels from revealing
  // which branch matched (verified vs duress vs stale vs failed).

  // 1. Check current verification word
  const currentMatch = timingSafeStringEqual(normalised, verifyPhrase(seedHex, counter))

  // 2. Check ALL members' duress words at current counter — collect all matches
  const currentDuressMatches: string[] = []
  for (const pubkey of memberPubkeys) {
    if (timingSafeStringEqual(normalised, duressPhrase(seedHex, pubkey, counter))) {
      currentDuressMatches.push(pubkey)
    }
  }

  // 3. Check duress words at previous counter (stale duress) — collect all matches
  const staleDuressMatches: string[] = []
  if (counter > 0) {
    for (const pubkey of memberPubkeys) {
      if (timingSafeStringEqual(normalised, duressPhrase(seedHex, pubkey, counter - 1))) {
        staleDuressMatches.push(pubkey)
      }
    }
  }

  // 4. Check previous window's verification word (1-window lookback for sync issues)
  const staleMatch = counter > 0 && timingSafeStringEqual(normalised, verifyPhrase(seedHex, counter - 1))

  // Return in priority order
  if (currentMatch) return { status: 'verified' }
  if (currentDuressMatches.length > 0) return { status: 'duress', members: currentDuressMatches }
  if (staleDuressMatches.length > 0) return { status: 'duress', members: staleDuressMatches }
  if (staleMatch) return { status: 'stale' }
  return { status: 'failed' }
}
