/**
 * Duress detection — silent coercion alerts.
 *
 * Scenario: Each group member has a personal duress word distinct from
 * the verification word. If someone is coerced into "proving" their
 * identity, they speak the duress word instead. The system detects
 * it silently — the attacker hears a valid-sounding word, but the
 * verifier knows someone is under duress.
 *
 * Run: npx tsx examples/03-duress-detection.ts
 */

import {
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  verifyWord,
  getCounter,
} from 'canary-kit'

const alice = 'a'.repeat(64)
const bob = 'b'.repeat(64)

const group = createGroup({
  name: 'Field Team',
  members: [alice, bob],
  preset: 'field-ops',  // 24-hour rotation, 2-word phrase
})

const counter = getCounter(Math.floor(Date.now() / 1000), group.rotationInterval)

// Normal verification word (same for everyone)
const safeWord = getCurrentWord(group)
console.log('Verification phrase:', safeWord)

// Each member's duress word is unique to them
const aliceDuress = getCurrentDuressWord(group, alice)
const bobDuress = getCurrentDuressWord(group, bob)
console.log("Alice's duress phrase:", aliceDuress)
console.log("Bob's duress phrase:", bobDuress)

// Verifying the normal word → 'verified'
const normal = verifyWord(safeWord, group.seed, group.members, counter, group.wordCount)
console.log('\nNormal verification:', normal)
// → { status: 'verified' }

// Verifying Alice's duress word → 'duress' with her pubkey
const duress = verifyWord(aliceDuress, group.seed, group.members, counter, group.wordCount)
console.log('Duress detected:', duress)
// → { status: 'duress', members: ['aaa...'] }
