import { deriveVerificationWord, deriveDuressWord } from './derive.js'

export type VerifyStatus = 'verified' | 'duress' | 'stale' | 'failed'

export interface VerifyResult {
  /** The outcome of the verification check. */
  status: VerifyStatus
  /** Pubkey of the member whose duress word was detected (only when status = 'duress'). */
  member?: string
}

/**
 * Verify a spoken word against the group's current state.
 *
 * Checks in order:
 * 1. Current verification word → verified
 * 2. Each member's duress word → duress (with member identified)
 * 3. Previous window's verification word → stale (out of sync)
 * 4. None matched → failed
 */
export function verifyWord(
  spokenWord: string,
  seedHex: string,
  memberPubkeys: string[],
  counter: number,
): VerifyResult {
  const normalised = spokenWord.toLowerCase().trim()

  // 1. Check current verification word
  if (normalised === deriveVerificationWord(seedHex, counter)) {
    return { status: 'verified' }
  }

  // 2. Check each member's duress word
  for (const pubkey of memberPubkeys) {
    if (normalised === deriveDuressWord(seedHex, pubkey, counter)) {
      return { status: 'duress', member: pubkey }
    }
  }

  // 3. Check previous window (1-window lookback for sync issues)
  if (counter > 0 && normalised === deriveVerificationWord(seedHex, counter - 1)) {
    return { status: 'stale' }
  }

  // 4. Nothing matched
  return { status: 'failed' }
}
