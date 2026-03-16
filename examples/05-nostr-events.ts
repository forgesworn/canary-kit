/**
 * Nostr event building.
 *
 * Scenario: Publish CANARY group state over Nostr relays. The library
 * builds unsigned events — you sign them with your own Nostr library.
 *
 * Run: npx tsx examples/05-nostr-events.ts
 */

import { createGroup } from 'canary-kit'
import {
  KINDS,
  buildGroupEvent,
  buildBeaconEvent,
} from 'canary-kit/nostr'
import { deriveBeaconKey, encryptBeacon } from 'canary-kit/beacon'

const alice = 'a'.repeat(64)
const bob = 'b'.repeat(64)

const group = createGroup({
  name: 'Reporters',
  members: [alice, bob],
  preset: 'field-ops',
})

// Build a kind 38800 group announcement event
const groupEvent = buildGroupEvent({
  groupId: 'reporters-2026',
  name: group.name,
  members: group.members,
  rotationInterval: group.rotationInterval,
  wordCount: group.wordCount,
  wordlist: group.wordlist,
  encryptedContent: '<NIP-44 encrypted seed would go here>',
})

console.log('Group event (kind', KINDS.group + '):')
console.log(JSON.stringify(groupEvent, null, 2))

// Build a kind 20800 encrypted beacon event
const beaconKey = deriveBeaconKey(group.seed)
const encrypted = await encryptBeacon(beaconKey, 'u4pruyd', 7)

const beaconEvent = buildBeaconEvent({
  groupId: 'reporters-2026',
  encryptedContent: encrypted,
})

console.log('\nBeacon event (kind', KINDS.beacon + '):')
console.log(JSON.stringify(beaconEvent, null, 2))

// Sign with your Nostr library:
// import { finalizeEvent, generateSecretKey } from 'nostr-tools'
// const signed = finalizeEvent(groupEvent, secretKey)
