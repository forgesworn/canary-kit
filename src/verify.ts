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
 * 2. Each member's duress word at current counter → duress (with member identified)
 * 3. Each member's duress word at previous counter → duress (stale duress, out of sync)
 * 4. Previous window's verification word → stale (out of sync)
 * 5. None matched → failed
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

  // 2. Check each member's duress word at current counter
  for (const pubkey of memberPubkeys) {
    if (normalised === deriveDuressWord(seedHex, pubkey, counter)) {
      return { status: 'duress', member: pubkey }
    }
  }

  // 3. Check duress words at previous counter (stale duress — member slightly out of sync)
  if (counter > 0) {
    for (const pubkey of memberPubkeys) {
      if (normalised === deriveDuressWord(seedHex, pubkey, counter - 1)) {
        return { status: 'duress', member: pubkey }
      }
    }
  }

  // 4. Check previous window's verification word (1-window lookback for sync issues)
  if (counter > 0 && normalised === deriveVerificationWord(seedHex, counter - 1)) {
    return { status: 'stale' }
  }

  // 5. Nothing matched
  return { status: 'failed' }
}
