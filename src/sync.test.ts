import { describe, it, expect } from 'vitest'
import {
  encodeSyncMessage,
  decodeSyncMessage,
  applySyncMessage,
  type SyncMessage,
} from './sync.js'
import { createGroup } from './group.js'
import { bytesToHex } from './crypto.js'

describe('sync message serialisation', () => {
  it('round-trips a member-join message', () => {
    const msg: SyncMessage = { type: 'member-join', pubkey: 'abc123', timestamp: 1700000000 }
    const encoded = encodeSyncMessage(msg)
    expect(typeof encoded).toBe('string')
    const decoded = decodeSyncMessage(encoded)
    expect(decoded).toEqual(msg)
  })

  it('round-trips a member-leave message', () => {
    const msg: SyncMessage = { type: 'member-leave', pubkey: 'abc123', timestamp: 1700000000 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a counter-advance message', () => {
    const msg: SyncMessage = { type: 'counter-advance', counter: 42, usageOffset: 3, timestamp: 1700000000 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a reseed message with binary seed', () => {
    const seed = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    const msg: SyncMessage = { type: 'reseed', seed, counter: 0, timestamp: 1700000000 }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded.type).toBe('reseed')
    if (decoded.type === 'reseed') {
      expect(decoded.seed).toBeInstanceOf(Uint8Array)
      expect(Array.from(decoded.seed)).toEqual(Array.from(seed))
      expect(decoded.counter).toBe(0)
    }
  })

  it('round-trips a beacon message', () => {
    const msg: SyncMessage = { type: 'beacon', lat: 51.5074, lon: -0.1278, accuracy: 10, timestamp: 1700000000 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a duress-alert message', () => {
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5074, lon: -0.1278, timestamp: 1700000000 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('throws on invalid JSON', () => {
    expect(() => decodeSyncMessage('not json')).toThrow()
  })

  it('throws on unknown message type', () => {
    expect(() => decodeSyncMessage(JSON.stringify({ type: 'unknown', timestamp: 0 }))).toThrow()
  })
})

// Valid 64-char hex pubkeys for testing (addMember validates these)
const PUBKEY_AAA = 'a'.repeat(64)
const PUBKEY_BBB = 'b'.repeat(64)

describe('applySyncMessage', () => {
  function makeGroup() {
    return createGroup({ name: 'test', members: [PUBKEY_AAA], preset: 'family' })
  }

  it('applies member-join', () => {
    const group = makeGroup()
    const result = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0 })
    expect(result.members).toContain(PUBKEY_BBB)
    expect(result.members).toContain(PUBKEY_AAA)
  })

  it('member-join is idempotent', () => {
    const group = makeGroup()
    const result = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_AAA, timestamp: 0 })
    expect(result.members.filter(m => m === PUBKEY_AAA)).toHaveLength(1)
  })

  it('applies member-leave (reseeds)', () => {
    const group = makeGroup()
    const withBob = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0 })
    const result = applySyncMessage(withBob, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0 })
    expect(result.members).not.toContain(PUBKEY_BBB)
    // removeMember auto-reseeds — seed should differ
    expect(result.seed).not.toEqual(withBob.seed)
  })

  it('applies counter-advance (monotonic — only advances)', () => {
    const group = makeGroup()
    // Use counter values ahead of the group's current time-based counter
    const futureCounter = group.counter + 5
    const result = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    })
    expect(result.counter).toBe(futureCounter)
    expect(result.usageOffset).toBe(2)
  })

  it('counter-advance ignores stale counters', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 5
    const advanced = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    })
    // Stale: effective = (futureCounter - 3) + 1 < futureCounter + 2
    const stale = applySyncMessage(advanced, {
      type: 'counter-advance', counter: futureCounter - 3, usageOffset: 1, timestamp: 0,
    })
    expect(stale.counter).toBe(futureCounter) // unchanged
    expect(stale.usageOffset).toBe(2)
  })

  it('applies reseed', () => {
    const group = makeGroup()
    const newSeed = new Uint8Array(32).fill(42)
    const result = applySyncMessage(group, { type: 'reseed', seed: newSeed, counter: 0, timestamp: 0 })
    // seed is stored as hex string in GroupState
    expect(typeof result.seed).toBe('string')
    expect(result.seed).toBe(bytesToHex(newSeed))
    expect(result.usageOffset).toBe(0)
  })

  it('beacon and duress-alert return group unchanged', () => {
    const group = makeGroup()
    const afterBeacon = applySyncMessage(group, { type: 'beacon', lat: 0, lon: 0, accuracy: 10, timestamp: 0 })
    expect(afterBeacon).toEqual(group)
    const afterDuress = applySyncMessage(group, { type: 'duress-alert', lat: 0, lon: 0, timestamp: 0 })
    expect(afterDuress).toEqual(group)
  })
})

describe('state-snapshot', () => {
  it('round-trips a state-snapshot message', () => {
    const msg: SyncMessage = {
      type: 'state-snapshot',
      seed: 'a'.repeat(64),
      counter: 100,
      usageOffset: 3,
      members: ['b'.repeat(64), 'c'.repeat(64)],
      timestamp: 1700000000,
    }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    expect(decoded).toEqual(msg)
  })

  it('applySyncMessage replaces group state from snapshot', () => {
    // Create a group state, apply a snapshot with different values, verify state updated
    const group = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: ['b'.repeat(64)],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: ['b'.repeat(64), 'd'.repeat(64)],
      timestamp: 1700001000,
    }

    const updated = applySyncMessage(group, snapshot)
    expect(updated.seed).toBe('c'.repeat(64))
    expect(updated.counter).toBe(200)
    expect(updated.usageOffset).toBe(5)
    expect(updated.members).toEqual(['b'.repeat(64), 'd'.repeat(64)])
  })
})

describe('full round-trip: encode → decode → apply', () => {
  function makeGroup() {
    return createGroup({ name: 'test', members: [PUBKEY_AAA], preset: 'family' })
  }

  it('member-join round-trip updates group state', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: Date.now() }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    const updated = applySyncMessage(group, decoded)
    expect(updated.members).toContain(PUBKEY_BBB)
  })

  it('reseed round-trip preserves binary seed', () => {
    const group = makeGroup()
    const newSeed = crypto.getRandomValues(new Uint8Array(32))
    const msg: SyncMessage = { type: 'reseed', seed: newSeed, counter: 5, timestamp: Date.now() }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    const updated = applySyncMessage(group, decoded)
    expect(updated.seed).toBe(bytesToHex(newSeed))
    expect(updated.counter).toBe(5)
    expect(updated.usageOffset).toBe(0)
  })

  it('counter-advance monotonicity across encode/decode', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 10
    const msg1: SyncMessage = { type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 1 }
    const msg2: SyncMessage = { type: 'counter-advance', counter: futureCounter - 5, usageOffset: 1, timestamp: 2 }
    let state = applySyncMessage(group, decodeSyncMessage(encodeSyncMessage(msg1)))
    state = applySyncMessage(state, decodeSyncMessage(encodeSyncMessage(msg2)))
    expect(state.counter).toBe(futureCounter)
    expect(state.usageOffset).toBe(2)
  })
})
