/**
 * Encrypted location beacons.
 *
 * Scenario: Group members broadcast encrypted location beacons that
 * only other group members can decrypt. If a member triggers a duress
 * alert, the beacon includes their last known location.
 *
 * Run: npx tsx examples/04-beacon-encryption.ts
 */

import { createGroup } from 'canary-kit'
import { deriveBeaconKey, encryptBeacon, decryptBeacon } from 'canary-kit/beacon'

const alice = 'a'.repeat(64)
const bob = 'b'.repeat(64)

const group = createGroup({
  name: 'Safety Net',
  members: [alice, bob],
  preset: 'family',
})

// Derive the shared beacon encryption key from the group seed
const beaconKey = deriveBeaconKey(group.seed)

// Alice encrypts her location (geohash + precision)
const encrypted = await encryptBeacon(beaconKey, 'gcpuuz', 6)
console.log('Encrypted beacon:', encrypted.slice(0, 40) + '...')

// Bob (or any group member) decrypts it
const payload = await decryptBeacon(beaconKey, encrypted)
console.log('Decrypted:', payload)
// → { geohash: 'gcpuuz', precision: 6, timestamp: ... }
