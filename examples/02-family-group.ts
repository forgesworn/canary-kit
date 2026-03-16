/**
 * Family group — shared rotating safe word.
 *
 * Scenario: A family sets up a group safe word that rotates weekly.
 * Any member can speak the current word to prove they're really who
 * they say they are — useful when a call might be a deepfake.
 *
 * Run: npx tsx examples/02-family-group.ts
 */

import { createGroup, getCurrentWord, verifyWord, getCounter } from 'canary-kit'

// Fake pubkeys for this example (in production, use real Nostr pubkeys)
const alice = 'a'.repeat(64)
const bob = 'b'.repeat(64)
const charlie = 'c'.repeat(64)

// Create a family group with the 'family' preset (7-day rotation, 1 word)
const group = createGroup({
  name: 'Smith Family',
  members: [alice, bob, charlie],
  preset: 'family',
})

// Everyone derives the same word from the shared seed
const word = getCurrentWord(group)
console.log('Current safe word:', word)

// The word rotates based on a time-based counter (7-day windows)
const counter = getCounter(Math.floor(Date.now() / 1000), group.rotationInterval)
console.log('Current counter:', counter)
console.log('Rotation interval:', group.rotationInterval, 'seconds (7 days)')

// Verify a spoken word
const result = verifyWord(word, group.seed, group.members, counter)
console.log('Verify correct word:', result)
// → { status: 'verified' }

// Wrong word
const bad = verifyWord('banana', group.seed, group.members, counter)
console.log('Verify wrong word:', bad)
// → { status: 'failed' }
