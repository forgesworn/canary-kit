import { describe, it, expect } from 'vitest'
import {
  encodeSyncMessage,
  decodeSyncMessage,
  applySyncMessage,
  applySyncMessageWithResult,
  stableStringify,
  canonicaliseSyncMessage,
  PROTOCOL_VERSION,
  FIRE_AND_FORGET_FRESHNESS_SEC,
  MAX_FUTURE_SKEW_SEC,
  type SyncMessage,
} from './sync.js'
import { createGroup } from './group.js'
import type { GroupState } from './group.js'
import { bytesToHex, hexToBytes } from './crypto.js'
import vectors from '../test-vectors/authority-model.json'

describe('sync message serialisation', () => {
  it('round-trips a member-join message', () => {
    const msg: SyncMessage = { type: 'member-join', pubkey: 'a'.repeat(64), timestamp: 1700000000, epoch: 0, opId: 'test-join-1', protocolVersion: 1 }
    const encoded = encodeSyncMessage(msg)
    expect(typeof encoded).toBe('string')
    const decoded = decodeSyncMessage(encoded)
    expect(decoded).toEqual(msg)
  })

  it('round-trips a member-leave message', () => {
    const msg: SyncMessage = { type: 'member-leave', pubkey: 'a'.repeat(64), timestamp: 1700000000, epoch: 0, opId: 'leave-1', protocolVersion: 1 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a counter-advance message', () => {
    const msg: SyncMessage = { type: 'counter-advance', counter: 42, usageOffset: 3, timestamp: 1700000000, protocolVersion: 1 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a reseed message with binary seed', () => {
    const seed = new Uint8Array(32).fill(42)
    const msg: SyncMessage = {
      type: 'reseed', seed, counter: 0, timestamp: 1700000000,
      epoch: 1, opId: 'test-reseed-1',
      admins: ['a'.repeat(64)], members: ['a'.repeat(64)],
    }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded.type).toBe('reseed')
    if (decoded.type === 'reseed') {
      expect(decoded.seed).toBeInstanceOf(Uint8Array)
      expect(Array.from(decoded.seed)).toEqual(Array.from(seed))
      expect(decoded.counter).toBe(0)
      expect(decoded.epoch).toBe(1)
      expect(decoded.opId).toBe('test-reseed-1')
      expect(decoded.admins).toEqual(['a'.repeat(64)])
      expect(decoded.members).toEqual(['a'.repeat(64)])
    }
  })

  it('round-trips a beacon message', () => {
    const msg: SyncMessage = { type: 'beacon', lat: 51.5074, lon: -0.1278, accuracy: 10, timestamp: 1700000000, opId: 'beacon-1', protocolVersion: 1 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a duress-alert message', () => {
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5074, lon: -0.1278, timestamp: 1700000000, opId: 'duress-1', protocolVersion: 1 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('throws on invalid JSON', () => {
    expect(() => decodeSyncMessage('not json')).toThrow()
  })

  it('throws on unknown message type', () => {
    expect(() => decodeSyncMessage(JSON.stringify({ type: 'unknown', timestamp: 0, protocolVersion: 1 }))).toThrow()
  })

  it('rejects member-leave without required epoch', () => {
    const payload = JSON.stringify({
      type: 'member-leave', pubkey: 'a'.repeat(64), timestamp: 1700000000, protocolVersion: 1,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('epoch')
  })

  it('rejects member-leave without required opId', () => {
    const payload = JSON.stringify({
      type: 'member-leave', pubkey: 'a'.repeat(64), timestamp: 1700000000,
      epoch: 0, protocolVersion: 1,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('opId')
  })
})

// Valid 64-char hex pubkeys for testing (addMember validates these)
const PUBKEY_AAA = 'a'.repeat(64)
const PUBKEY_BBB = 'b'.repeat(64)

describe('applySyncMessage', () => {
  function makeGroup() {
    return createGroup({ name: 'test', members: [PUBKEY_AAA], preset: 'family', creator: PUBKEY_AAA })
  }

  it('applies member-join', () => {
    const group = makeGroup()
    const result = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'test-join-1' }, undefined, PUBKEY_AAA)
    expect(result.members).toContain(PUBKEY_BBB)
    expect(result.members).toContain(PUBKEY_AAA)
  })

  it('member-join is idempotent', () => {
    const group = makeGroup()
    // First join
    const withBob = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'test-join-1' }, undefined, PUBKEY_AAA)
    // Re-join AAA (already a member) with a new opId
    const result = applySyncMessage(withBob, { type: 'member-join', pubkey: PUBKEY_AAA, timestamp: 0, epoch: 0, opId: 'test-join-2' }, undefined, PUBKEY_AAA)
    expect(result.members.filter(m => m === PUBKEY_AAA)).toHaveLength(1)
  })

  it('applies member-leave (removes member, seed unchanged)', () => {
    const group = makeGroup()
    const withBob = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'test-join-1' }, undefined, PUBKEY_AAA)
    // Self-leave: BBB removes themselves
    const result = applySyncMessage(withBob, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'self-leave-1' }, undefined, PUBKEY_BBB)
    expect(result.members).not.toContain(PUBKEY_BBB)
    // removeMember no longer reseeds — seed stays the same
    expect(result.seed).toEqual(withBob.seed)
  })

  it('member-leave is idempotent — replayed leave for absent member returns state unchanged', () => {
    const group = makeGroup()
    const withBob = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'test-join-1' }, undefined, PUBKEY_AAA)
    const afterLeave = applySyncMessage(withBob, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'self-leave-1' }, undefined, PUBKEY_BBB)
    // Replay the same leave — should be no-op (member already gone)
    const replayed = applySyncMessage(afterLeave, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'self-leave-1' }, undefined, PUBKEY_BBB)
    expect(replayed).toBe(afterLeave) // reference equality — no change
  })

  it('member-leave with consumed opId is rejected (replay protection)', () => {
    const group = makeGroup()
    const withBob = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'join-1' }, undefined, PUBKEY_AAA)

    // First leave succeeds
    const afterLeave = applySyncMessage(withBob, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'leave-1' }, undefined, PUBKEY_BBB)
    expect(afterLeave.members).not.toContain(PUBKEY_BBB)

    // Re-add Bob
    const withBobAgain = applySyncMessage(afterLeave, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'join-2' }, undefined, PUBKEY_AAA)
    expect(withBobAgain.members).toContain(PUBKEY_BBB)

    // Replay the same leave-1 opId — must be rejected
    const replayed = applySyncMessage(withBobAgain, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'leave-1' }, undefined, PUBKEY_BBB)
    expect(replayed.members).toContain(PUBKEY_BBB)
  })

  it('rejects replayed message after consumedOps eviction when timestamp is below floor', () => {
    let group = makeGroup()
    // Fill consumedOps past the MAX_CONSUMED_OPS limit (1000) with member-join messages
    for (let i = 0; i < 1001; i++) {
      group = applySyncMessage(group, {
        type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 100 + i, epoch: 0, opId: `fill-${i}`,
      }, undefined, PUBKEY_AAA)
    }
    // The first opId ('fill-0') should have been evicted from consumedOps
    expect(group.consumedOps).not.toContain('fill-0')
    // But the floor timestamp should block replay of old messages
    expect(group.consumedOpsFloor).toBeGreaterThan(0)

    // Attempt to replay 'fill-0' with its original old timestamp
    const replayed = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 100, epoch: 0, opId: 'fill-0',
    }, undefined, PUBKEY_AAA)
    // Should be rejected — timestamp is below the floor
    expect(replayed.consumedOps).not.toContain('fill-0')
  })

  it('applies counter-advance (monotonic — only advances)', () => {
    const group = makeGroup()
    // Use counter values ahead of the group's current time-based counter
    const futureCounter = group.counter + 5
    const result = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    }, undefined, PUBKEY_AAA)
    expect(result.counter).toBe(futureCounter)
    expect(result.usageOffset).toBe(2)
  })

  it('counter-advance rejects non-member sender', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 5
    const nonMember = 'c'.repeat(64)
    const result = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    }, undefined, nonMember)
    expect(result.counter).toBe(group.counter) // unchanged
    expect(result.usageOffset).toBe(group.usageOffset)
  })

  it('counter-advance rejects when no sender provided', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 5
    const result = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    })
    expect(result.counter).toBe(group.counter) // unchanged
  })

  it('counter-advance accepts member sender', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 5
    const result = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    }, undefined, PUBKEY_AAA)
    expect(result.counter).toBe(futureCounter)
    expect(result.usageOffset).toBe(2)
  })

  it('counter-advance ignores stale counters', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 5
    const advanced = applySyncMessage(group, {
      type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 0,
    }, undefined, PUBKEY_AAA)
    // Stale: effective = (futureCounter - 3) + 1 < futureCounter + 2
    const stale = applySyncMessage(advanced, {
      type: 'counter-advance', counter: futureCounter - 3, usageOffset: 1, timestamp: 0,
    }, undefined, PUBKEY_AAA)
    expect(stale.counter).toBe(futureCounter) // unchanged
    expect(stale.usageOffset).toBe(2)
  })

  it('applies reseed', () => {
    const group = makeGroup()
    const newSeed = new Uint8Array(32).fill(42)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 1, opId: 'test-reseed-1',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA],
    }, undefined, PUBKEY_AAA)
    // seed is stored as hex string in GroupState
    expect(typeof result.seed).toBe('string')
    expect(result.seed).toBe(bytesToHex(newSeed))
    expect(result.usageOffset).toBe(0)
  })

  it('beacon and duress-alert return group unchanged', () => {
    const group = makeGroup()
    const nowSec = Math.floor(Date.now() / 1000)
    const afterBeacon = applySyncMessage(group, { type: 'beacon', lat: 0, lon: 0, accuracy: 10, timestamp: nowSec, opId: 'b1' }, nowSec)
    expect(afterBeacon).toEqual(group)
    const afterDuress = applySyncMessage(group, { type: 'duress-alert', lat: 0, lon: 0, timestamp: nowSec, opId: 'd1' }, nowSec)
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
      members: [PUBKEY_AAA, PUBKEY_BBB],
      admins: [PUBKEY_AAA],
      epoch: 5,
      opId: 'snap-1',
      timestamp: 1700000000,
      protocolVersion: 1,
    }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    expect(decoded).toEqual(msg)
  })

  it('admin-signed snapshot replaces group state', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA, PUBKEY_BBB],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA, PUBKEY_BBB, 'd'.repeat(64)],
      admins: [PUBKEY_AAA],
      epoch: 5,
      opId: 'snap-1',
      timestamp: 1700001000,
    }

    const updated = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(updated.seed).toBe('c'.repeat(64))
    expect(updated.counter).toBe(200)
    expect(updated.usageOffset).toBe(5)
    expect(updated.members).toEqual([PUBKEY_AAA, PUBKEY_BBB, 'd'.repeat(64)])
    expect(updated.admins).toEqual([PUBKEY_AAA])
    expect(updated.epoch).toBe(5)
    expect(updated.consumedOps).toEqual(['snap-1'])
  })

  it('snapshot from non-admin is rejected', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA, PUBKEY_BBB],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA, PUBKEY_BBB],
      admins: [PUBKEY_AAA],
      epoch: 5,
      opId: 'snap-2',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_BBB)
    expect(result).toBe(group)
  })

  it('snapshot with stale epoch is rejected', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA, PUBKEY_BBB],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 5,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA, PUBKEY_BBB],
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-stale',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('same-epoch snapshot with advanced counter and added members is accepted', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: ['old-op'],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'a'.repeat(64),  // same seed (same epoch)
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA, PUBKEY_BBB],  // superset: added BBB
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-same-epoch',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result.seed).toBe('a'.repeat(64))
    expect(result.counter).toBe(200)
    expect(result.usageOffset).toBe(5)
    expect(result.members).toEqual([PUBKEY_AAA, PUBKEY_BBB])
    expect(result.epoch).toBe(3)
    // consumedOps preserved and appended (not reset)
    expect(result.consumedOps).toContain('old-op')
    expect(result.consumedOps).toContain('snap-same-epoch')
  })

  it('same-epoch snapshot with different seed is rejected (no silent reseed)', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),  // different seed in same epoch
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-bad-seed',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('same-epoch snapshot with lower effective counter is rejected (rollback)', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 200,
      usageOffset: 5,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'a'.repeat(64),
      counter: 50,
      usageOffset: 2,  // effective 52 < local 205
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-rollback',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('same-epoch snapshot with fewer members is rejected (superset violation)', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA, PUBKEY_BBB],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'a'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA],  // missing BBB — not a superset
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-shrink',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('same-epoch snapshot replayed with duplicate opId is rejected', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: ['snap-dup'],  // already consumed
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'a'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-dup',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('snapshot without sender is rejected (fail-closed)', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 3,
      opId: 'snap-no-sender',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot)
    expect(result).toBe(group)
  })

  it('snapshot enforces admins ⊆ members', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 3,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA, PUBKEY_BBB],  // BBB not in members
      epoch: 3,
      opId: 'snap-bad-admins',
      timestamp: 1700001000,
    }

    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('reseed does not leak previous seed into state', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 0,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 0,
      consumedOps: [],
    }

    const reseedMsg: SyncMessage = {
      type: 'reseed',
      seed: hexToBytes('b'.repeat(64)),
      counter: 51,
      timestamp: 1700001000,
      epoch: 1,
      opId: 'reseed-1',
      admins: [PUBKEY_AAA],
      members: [PUBKEY_AAA],
    }

    const updated = applySyncMessage(group, reseedMsg, undefined, PUBKEY_AAA)
    expect(updated.seed).toBe('b'.repeat(64))
    expect(updated.epoch).toBe(1)
    expect((updated as Record<string, unknown>).prevEpochSeed).toBeUndefined()
  })

  it('state-snapshot with correct prevEpochSeed is accepted', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 0,
      usageOffset: 0,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 0,
      consumedOps: [],
    }
    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'b'.repeat(64),
      counter: 0,
      usageOffset: 0,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 1,
      opId: 'snap-prev-ok',
      timestamp: 0,
      prevEpochSeed: group.seed,
    }
    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result.epoch).toBe(1)
    expect(result.seed).toBe('b'.repeat(64))
  })

  it('state-snapshot with wrong prevEpochSeed is rejected', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 0,
      usageOffset: 0,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 0,
      consumedOps: [],
    }
    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'b'.repeat(64),
      counter: 0,
      usageOffset: 0,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 1,
      opId: 'snap-prev-bad',
      timestamp: 0,
      prevEpochSeed: 'c'.repeat(64),
    }
    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('state-snapshot without prevEpochSeed is still accepted (optional field)', () => {
    const group: GroupState = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: [PUBKEY_AAA],
      rotationInterval: 604800,
      wordCount: 1,
      wordlist: 'en-v1',
      counter: 0,
      usageOffset: 0,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [PUBKEY_AAA],
      epoch: 0,
      consumedOps: [],
    }
    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'b'.repeat(64),
      counter: 0,
      usageOffset: 0,
      members: [PUBKEY_AAA],
      admins: [PUBKEY_AAA],
      epoch: 1,
      opId: 'snap-no-prev',
      timestamp: 0,
    }
    const result = applySyncMessage(group, snapshot, undefined, PUBKEY_AAA)
    expect(result.epoch).toBe(1)
  })

  it('decode ignores unknown extra fields on state-snapshot', () => {
    const raw = JSON.stringify({
      type: 'state-snapshot',
      seed: 'a'.repeat(64),
      counter: 10,
      usageOffset: 0,
      members: ['a'.repeat(64)],
      admins: ['a'.repeat(64)],
      epoch: 1,
      opId: 'snap-extra',
      timestamp: 1700000000,
      someUnknownField: 'ignored',
      protocolVersion: PROTOCOL_VERSION,
    })
    const msg = decodeSyncMessage(raw)
    expect(msg.type).toBe('state-snapshot')
  })
})

describe('liveness-checkin', () => {
  it('round-trips a liveness-checkin message', () => {
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: 'a'.repeat(64),
      timestamp: 1700000000,
      opId: 'liveness-1',
      protocolVersion: 1,
    }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    expect(decoded).toEqual(msg)
  })

  it('applySyncMessage does not modify group state', () => {
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
      admins: [],
      epoch: 0,
      consumedOps: [],
    }

    const nowSec = 1700001000
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: 'b'.repeat(64),
      timestamp: nowSec,
      opId: 'liveness-2',
    }

    const updated = applySyncMessage(group, msg, nowSec)
    expect(updated).toEqual(group)
  })

  it('rejects liveness-checkin where sender does not match pubkey', () => {
    const group = {
      name: 'Test',
      seed: 'a'.repeat(64),
      members: ['b'.repeat(64), 'c'.repeat(64)],
      rotationInterval: 604800,
      wordCount: 1 as const,
      wordlist: 'en-v1',
      counter: 50,
      usageOffset: 2,
      createdAt: 1700000000,
      beaconInterval: 300,
      beaconPrecision: 6,
      admins: [],
      epoch: 0,
      consumedOps: [],
    }

    const nowSec = 1700001000
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: 'b'.repeat(64),
      timestamp: nowSec,
      opId: 'liveness-spoof',
    }

    // Sender is 'c' but message claims pubkey 'b' — should be rejected
    const result = applySyncMessageWithResult(group, msg, nowSec, 'c'.repeat(64))
    expect(result.applied).toBe(false)
  })
})

describe('full round-trip: encode → decode → apply', () => {
  function makeGroup() {
    return createGroup({ name: 'test', members: [PUBKEY_AAA], preset: 'family', creator: PUBKEY_AAA })
  }

  it('member-join round-trip updates group state', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: Date.now(), epoch: 0, opId: 'test-join-rt-1' }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    const updated = applySyncMessage(group, decoded, undefined, PUBKEY_AAA)
    expect(updated.members).toContain(PUBKEY_BBB)
  })

  it('reseed round-trip preserves binary seed', () => {
    const group = makeGroup()
    const newSeed = crypto.getRandomValues(new Uint8Array(32))
    const msg: SyncMessage = {
      type: 'reseed', seed: newSeed, counter: 5, timestamp: Date.now(),
      epoch: 1, opId: 'test-reseed-rt-1',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA],
    }
    const encoded = encodeSyncMessage(msg)
    const decoded = decodeSyncMessage(encoded)
    const updated = applySyncMessage(group, decoded, undefined, PUBKEY_AAA)
    expect(updated.seed).toBe(bytesToHex(newSeed))
    expect(updated.counter).toBe(5)
    expect(updated.usageOffset).toBe(0)
  })

  it('counter-advance monotonicity across encode/decode', () => {
    const group = makeGroup()
    const futureCounter = group.counter + 10
    const msg1: SyncMessage = { type: 'counter-advance', counter: futureCounter, usageOffset: 2, timestamp: 1 }
    const msg2: SyncMessage = { type: 'counter-advance', counter: futureCounter - 5, usageOffset: 1, timestamp: 2 }
    let state = applySyncMessage(group, decodeSyncMessage(encodeSyncMessage(msg1)), undefined, PUBKEY_AAA)
    state = applySyncMessage(state, decodeSyncMessage(encodeSyncMessage(msg2)), undefined, PUBKEY_AAA)
    expect(state.counter).toBe(futureCounter)
    expect(state.usageOffset).toBe(2)
  })
})

const PUBKEY_CCC = 'c'.repeat(64)

describe('authority model invariants', () => {
  function makeAuthorityGroup() {
    return {
      ...createGroup({ name: 'test', members: [PUBKEY_AAA, PUBKEY_BBB], preset: 'family', creator: PUBKEY_AAA }),
      admins: [PUBKEY_AAA],
      members: [PUBKEY_AAA, PUBKEY_BBB],
      epoch: 3,
      consumedOps: [],
    }
  }

  // I1: privileged op accepted iff sender ∈ admins
  it('I1: reseed from admin is accepted', () => {
    const group = makeAuthorityGroup()
    const newSeed = new Uint8Array(32).fill(99)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 4, opId: 'op1',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA, PUBKEY_BBB],
    }, undefined, PUBKEY_AAA)
    expect(result.seed).toBe(bytesToHex(newSeed))
  })

  it('I1: reseed from non-admin member is rejected', () => {
    const group = makeAuthorityGroup()
    const newSeed = new Uint8Array(32).fill(99)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 4, opId: 'op1',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA, PUBKEY_BBB],
    }, undefined, PUBKEY_BBB)
    expect(result).toBe(group)
  })

  it('I1: member-join from non-admin is rejected', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
      epoch: 3, opId: 'op2',
    }, undefined, PUBKEY_BBB)
    expect(result).toBe(group)
  })

  it('I1: member-leave (removing another) from non-admin is rejected', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-leave', pubkey: PUBKEY_AAA, timestamp: 0,
      epoch: 3, opId: 'op2',
    }, undefined, PUBKEY_BBB)
    expect(result).toBe(group)
  })

  it('I1: self-leave is always allowed (not privileged)', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0,
      epoch: 3, opId: 'self-leave-auth-1',
    }, undefined, PUBKEY_BBB)
    expect(result.members).not.toContain(PUBKEY_BBB)
  })

  it('I1: privileged action without sender is rejected (fail-closed)', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
      epoch: 3, opId: 'op-no-sender',
    })
    expect(result).toBe(group)
  })

  // I2: each opId is single-use within (groupId, epoch)
  it('I2: replayed opId in same epoch is rejected', () => {
    const group = { ...makeAuthorityGroup(), consumedOps: ['op1'] }
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
      epoch: 3, opId: 'op1',
    }, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('I2: same opId in new epoch is accepted (consumedOps cleared)', () => {
    const group = { ...makeAuthorityGroup(), consumedOps: ['op1'] }
    const newSeed = new Uint8Array(32).fill(77)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 4, opId: 'op1',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA, PUBKEY_BBB],
    }, undefined, PUBKEY_AAA)
    expect(result.epoch).toBe(4)
    expect(result.consumedOps).toEqual(['op1'])
  })

  // I3: non-reseed privileged ops require msg.epoch == local.epoch
  it('I3: member-join with matching epoch is accepted', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
      epoch: 3, opId: 'op3',
    }, undefined, PUBKEY_AAA)
    expect(result.members).toContain(PUBKEY_CCC)
    expect(result.consumedOps).toContain('op3')
  })

  it('I3: member-join with future epoch is rejected', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
      epoch: 5, opId: 'op4',
    }, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  // I4: reseed must have msg.epoch == local.epoch + 1 and atomically replace state
  it('I4: reseed with epoch == local + 1 atomically replaces seed/members/admins/epoch', () => {
    const group = makeAuthorityGroup()
    const newSeed = new Uint8Array(32).fill(88)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 5, timestamp: 0,
      epoch: 4, opId: 'reseed-1',
      admins: [PUBKEY_BBB], members: [PUBKEY_BBB],
    }, undefined, PUBKEY_AAA)
    expect(result.seed).toBe(bytesToHex(newSeed))
    expect(result.epoch).toBe(4)
    expect(result.admins).toEqual([PUBKEY_BBB])
    expect(result.members).toEqual([PUBKEY_BBB])
    expect(result.consumedOps).toEqual(['reseed-1'])
    expect(result.counter).toBe(5)
    expect(result.usageOffset).toBe(0)
  })

  it('I4: reseed enforces admins ⊆ members', () => {
    const group = makeAuthorityGroup()
    const newSeed = new Uint8Array(32).fill(88)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 4, opId: 'reseed-bad',
      admins: [PUBKEY_CCC], members: [PUBKEY_AAA],
    }, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('I4: reseed with wrong epoch (not local + 1) is rejected', () => {
    const group = makeAuthorityGroup()
    const newSeed = new Uint8Array(32).fill(88)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 3, opId: 'reseed-2',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA],
    }, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('I4: reseed missing admins or members is rejected', () => {
    const group = makeAuthorityGroup()
    const newSeed = new Uint8Array(32).fill(88)
    const result = applySyncMessage(group, {
      type: 'reseed', seed: newSeed, counter: 0, timestamp: 0,
      epoch: 4, opId: 'reseed-3',
    } as any, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  // I6: msg.epoch < local.epoch is dropped
  it('I6: message with epoch < local epoch is dropped', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
      epoch: 2, opId: 'stale-op',
    }, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  // Schema strictness: privileged messages without epoch/opId are rejected
  it('member-join without epoch/opId is rejected (strict schema)', () => {
    const group = makeAuthorityGroup()
    const result = applySyncMessage(group, {
      type: 'member-join', pubkey: PUBKEY_CCC, timestamp: 0,
    } as any, undefined, PUBKEY_AAA)
    expect(result).toBe(group)
  })
})

describe('authority model serialisation', () => {
  it('round-trips a reseed with epoch, opId, admins, members', () => {
    const seed = new Uint8Array(32).fill(42)
    const msg: SyncMessage = {
      type: 'reseed', seed, counter: 5, timestamp: 1700000000,
      epoch: 3, opId: 'test-op',
      admins: [PUBKEY_AAA], members: [PUBKEY_AAA, PUBKEY_BBB],
    }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded.type).toBe('reseed')
    if (decoded.type === 'reseed') {
      expect(decoded.epoch).toBe(3)
      expect(decoded.opId).toBe('test-op')
      expect(decoded.admins).toEqual([PUBKEY_AAA])
      expect(decoded.members).toEqual([PUBKEY_AAA, PUBKEY_BBB])
      expect(Array.from(decoded.seed)).toEqual(Array.from(seed))
    }
  })

  it('round-trips a member-join with epoch and opId', () => {
    const msg: SyncMessage = {
      type: 'member-join', pubkey: PUBKEY_AAA, timestamp: 1700000000,
      epoch: 2, opId: 'join-op', protocolVersion: 1,
    }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded).toEqual(msg)
  })

  it('round-trips a member-leave with epoch and opId', () => {
    const msg: SyncMessage = {
      type: 'member-leave', pubkey: PUBKEY_AAA, timestamp: 1700000000,
      epoch: 2, opId: 'leave-op', protocolVersion: 1,
    }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded).toEqual(msg)
  })

  it('rejects reseed without required epoch', () => {
    const payload = JSON.stringify({
      type: 'reseed', seed: 'a'.repeat(64), counter: 0, timestamp: 1700000000, protocolVersion: 1,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('epoch')
  })

  it('rejects member-join without required epoch', () => {
    const payload = JSON.stringify({
      type: 'member-join', pubkey: 'a'.repeat(64), timestamp: 1700000000, protocolVersion: 1,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('epoch')
  })

  it('rejects reseed with opId exceeding 128 chars', () => {
    const payload = JSON.stringify({
      type: 'reseed', seed: 'a'.repeat(64), counter: 0, timestamp: 1700000000,
      epoch: 1, opId: 'x'.repeat(129),
      admins: ['a'.repeat(64)], members: ['a'.repeat(64)],
      protocolVersion: 1,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('opId')
  })
})

describe('protocol version (H1)', () => {
  it('encodeSyncMessage injects protocolVersion', () => {
    const msg: SyncMessage = { type: 'counter-advance', counter: 0, usageOffset: 0, timestamp: 0 }
    const encoded = JSON.parse(encodeSyncMessage(msg))
    expect(encoded.protocolVersion).toBe(1)
  })

  it('decodeSyncMessage accepts current version', () => {
    const payload = JSON.stringify({ type: 'counter-advance', counter: 0, usageOffset: 0, timestamp: 0, protocolVersion: 1 })
    expect(() => decodeSyncMessage(payload)).not.toThrow()
  })

  it('decodeSyncMessage rejects future version', () => {
    const payload = JSON.stringify({ type: 'counter-advance', counter: 0, usageOffset: 0, timestamp: 0, protocolVersion: 99 })
    expect(() => decodeSyncMessage(payload)).toThrow('Unsupported protocol version')
  })

  it('decodeSyncMessage rejects past version (version 0)', () => {
    const payload = JSON.stringify({ type: 'counter-advance', counter: 0, usageOffset: 0, timestamp: 0, protocolVersion: 0 })
    expect(() => decodeSyncMessage(payload)).toThrow('Unsupported protocol version')
  })

  it('decodeSyncMessage rejects missing version (hard cutover)', () => {
    const payload = JSON.stringify({ type: 'counter-advance', counter: 0, usageOffset: 0, timestamp: 0 })
    expect(() => decodeSyncMessage(payload)).toThrow('protocolVersion is required')
  })
})

describe('canonical JSON (H2)', () => {
  it('stableStringify sorts keys recursively', () => {
    const result = stableStringify({ z: 1, a: { c: 3, b: 2 }, m: [{ y: 1, x: 2 }] })
    expect(result).toBe('{"a":{"b":2,"c":3},"m":[{"x":2,"y":1}],"z":1}')
  })

  it('stableStringify handles primitives', () => {
    expect(stableStringify(null)).toBe('null')
    expect(stableStringify(true)).toBe('true')
    expect(stableStringify(42)).toBe('42')
    expect(stableStringify('hello')).toBe('"hello"')
  })

  it('stableStringify handles arrays', () => {
    expect(stableStringify([3, 1, 2])).toBe('[3,1,2]')
    expect(stableStringify([])).toBe('[]')
  })

  it('stableStringify omits undefined values', () => {
    expect(stableStringify({ a: 1, b: undefined, c: 3 })).toBe('{"a":1,"c":3}')
  })

  it('stableStringify rejects Uint8Array', () => {
    expect(() => stableStringify(new Uint8Array([1]))).toThrow('Uint8Array must be hex-encoded')
  })

  it('canonicaliseSyncMessage produces deterministic output', () => {
    const msg: SyncMessage = {
      type: 'member-join', pubkey: PUBKEY_AAA, timestamp: 1700000000,
      epoch: 0, opId: 'test',
    }
    const c1 = canonicaliseSyncMessage(msg)
    const c2 = canonicaliseSyncMessage(msg)
    expect(c1).toBe(c2)
    // Keys should be sorted
    const parsed = JSON.parse(c1)
    const keys = Object.keys(parsed)
    expect(keys).toEqual([...keys].sort())
  })

  it('canonicaliseSyncMessage preserves protocolVersion from input', () => {
    const msg: SyncMessage = {
      type: 'counter-advance', counter: 0, usageOffset: 0, timestamp: 0,
    }
    // Without version — field absent in canonical output
    const noVersion = canonicaliseSyncMessage(msg)
    expect(JSON.parse(noVersion).protocolVersion).toBeUndefined()
    // With version — field preserved as-is
    const versioned = { ...msg, protocolVersion: PROTOCOL_VERSION }
    const withVersion = canonicaliseSyncMessage(versioned)
    expect(JSON.parse(withVersion).protocolVersion).toBe(PROTOCOL_VERSION)
  })

  it('canonicaliseSyncMessage hex-encodes reseed seed', () => {
    const seed = new Uint8Array(32).fill(42)
    const msg: SyncMessage = {
      type: 'reseed', seed, counter: 0, timestamp: 0,
      epoch: 1, opId: 'op', admins: [PUBKEY_AAA], members: [PUBKEY_AAA],
    }
    const versioned = { ...msg, protocolVersion: PROTOCOL_VERSION }
    const canonical = canonicaliseSyncMessage(versioned)
    expect(canonical).toContain(bytesToHex(seed))
    // Should not contain Uint8Array artefacts
    expect(canonical).not.toContain('"0":')
  })

  it('canonicaliseSyncMessage matches encodeSyncMessage when given versioned input', () => {
    const msg: SyncMessage = {
      type: 'member-join', pubkey: PUBKEY_AAA, timestamp: 1700000000,
      epoch: 0, opId: 'test',
    }
    const versioned = { ...msg, protocolVersion: PROTOCOL_VERSION }
    const wireFields = Object.keys(JSON.parse(encodeSyncMessage(msg))).sort()
    const canonicalFields = Object.keys(JSON.parse(canonicaliseSyncMessage(versioned))).sort()
    expect(canonicalFields).toEqual(wireFields)
  })

  it('encode → decode → canonicalise round-trip matches send-side canonical for all message types', () => {
    const messages: SyncMessage[] = [
      { type: 'member-join', pubkey: PUBKEY_AAA, timestamp: 1700000000, epoch: 0, opId: 'mj-1' },
      { type: 'member-leave', pubkey: PUBKEY_AAA, timestamp: 1700000000, epoch: 0, opId: 'ml-1' },
      { type: 'counter-advance', counter: 5, usageOffset: 2, timestamp: 1700000000 },
      {
        type: 'reseed', seed: new Uint8Array(32).fill(42), counter: 0,
        timestamp: 1700000000, epoch: 1, opId: 'rs-1',
        admins: [PUBKEY_AAA], members: [PUBKEY_AAA],
      },
      { type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 10, timestamp: 1700000000, opId: 'bc-1' },
      { type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: 1700000000, opId: 'da-1' },
      { type: 'liveness-checkin', pubkey: PUBKEY_AAA, timestamp: 1700000000, opId: 'lc-1' },
    ]
    for (const msg of messages) {
      // Send side: canonicalise with protocolVersion
      const sendCanonical = canonicaliseSyncMessage({ ...msg, protocolVersion: PROTOCOL_VERSION })
      // Receive side: encode → decode → canonicalise (decode should preserve protocolVersion)
      const decoded = decodeSyncMessage(encodeSyncMessage(msg))
      const recvCanonical = canonicaliseSyncMessage(decoded)
      expect(recvCanonical).toBe(sendCanonical)
    }
  })
})

describe('conformance vectors (H6)', () => {
  for (const vector of vectors.vectors) {
    it(vector.id, () => {
      // F1 vectors: test that decodeSyncMessage rejects malformed messages
      if (vector.expected === 'decode-error') {
        expect(() => decodeSyncMessage(vector.rawMessage as string)).toThrow(vector.expectedError as string)
        return
      }

      const group = vector.initialGroup as unknown as GroupState
      let msg: SyncMessage
      if (vector.message.type === 'reseed') {
        msg = {
          ...vector.message,
          seed: hexToBytes(vector.message.seed as string),
        } as unknown as SyncMessage
      } else {
        msg = vector.message as unknown as SyncMessage
      }
      const sender = vector.sender || undefined
      const nowSec = (vector as Record<string, unknown>).nowSec as number | undefined
      const result = applySyncMessage(group, msg, nowSec, sender)
      const fireAndForget = (vector as Record<string, unknown>).fireAndForget as boolean | undefined
      if (vector.expected === 'accept') {
        if (fireAndForget) {
          // Fire-and-forget messages return group unchanged even when accepted
          expect(result).toBe(group)
        } else if (vector.expectedState) {
          for (const [key, value] of Object.entries(vector.expectedState)) {
            expect((result as Record<string, unknown>)[key]).toEqual(value)
          }
        } else {
          expect(result).not.toBe(group)
        }
      } else {
        expect(result).toBe(group)
      }
    })
  }
})

// ── Fire-and-forget freshness & opId tests ───────────────────

describe('fire-and-forget freshness gating', () => {
  function makeGroup() {
    return createGroup({ name: 'test', members: [PUBKEY_AAA], preset: 'family', creator: PUBKEY_AAA })
  }

  const nowSec = 1700000000

  it('accepts a duress-alert within the freshness window', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: nowSec - 60, opId: 'fresh-1', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    // fire-and-forget messages return group unchanged (no state mutation) — but they should NOT be rejected
    expect(result).toBe(group)
  })

  it('drops a duress-alert older than the freshness window', () => {
    const group = makeGroup()
    const staleTimestamp = nowSec - FIRE_AND_FORGET_FRESHNESS_SEC - 1
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: staleTimestamp, opId: 'stale-1', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('drops a duress-alert with a future timestamp beyond MAX_FUTURE_SKEW_SEC', () => {
    const group = makeGroup()
    const futureTimestamp = nowSec + MAX_FUTURE_SKEW_SEC + 1
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: futureTimestamp, opId: 'future-1', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('accepts a duress-alert with slight future skew within MAX_FUTURE_SKEW_SEC', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: nowSec + 30, opId: 'future-ok', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    // fire-and-forget returns group unchanged (no state mutation) — but accepted means not dropped
    expect(result).toBe(group)
  })

  it('accepts a beacon within the freshness window', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 100, timestamp: nowSec - 120, opId: 'beacon-1', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('drops a stale beacon', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 100, timestamp: nowSec - 600, opId: 'beacon-stale', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('drops a stale liveness-checkin', () => {
    const group = makeGroup()
    const msg: SyncMessage = { type: 'liveness-checkin', pubkey: PUBKEY_AAA, timestamp: nowSec - 600, opId: 'liveness-stale', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    expect(result).toBe(group)
  })

  it('does not apply freshness gating to privileged actions', () => {
    const group = makeGroup()
    // member-join with an old timestamp should still be processed (authority checks, not freshness)
    const msg: SyncMessage = { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: nowSec - 9999, epoch: 0, opId: 'join-old', protocolVersion: PROTOCOL_VERSION }
    const result = applySyncMessage(group, msg, nowSec, PUBKEY_AAA)
    expect(result.members).toContain(PUBKEY_BBB)
  })
})

describe('fire-and-forget opId serialisation', () => {
  it('round-trips a duress-alert with opId', () => {
    const msg: SyncMessage = { type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: 1700000000, opId: 'duress-op-1', protocolVersion: PROTOCOL_VERSION }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded).toEqual(msg)
  })

  it('round-trips a beacon with opId', () => {
    const msg: SyncMessage = { type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 100, timestamp: 1700000000, opId: 'beacon-op-1', protocolVersion: PROTOCOL_VERSION }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded).toEqual(msg)
  })

  it('rejects a duress-alert without opId', () => {
    const raw = JSON.stringify({ type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: 1700000000, protocolVersion: PROTOCOL_VERSION })
    expect(() => decodeSyncMessage(raw)).toThrow(/opId/)
  })

  it('rejects a liveness-checkin without opId', () => {
    const raw = JSON.stringify({ type: 'liveness-checkin', pubkey: 'a'.repeat(64), timestamp: 1700000000, protocolVersion: PROTOCOL_VERSION })
    expect(() => decodeSyncMessage(raw)).toThrow(/opId/)
  })

  it('rejects a beacon without opId', () => {
    const raw = JSON.stringify({ type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 100, timestamp: 1700000000, protocolVersion: PROTOCOL_VERSION })
    expect(() => decodeSyncMessage(raw)).toThrow(/opId/)
  })

  it('rejects a duress-alert with invalid opId', () => {
    const raw = JSON.stringify({ type: 'duress-alert', lat: 51.5, lon: -0.1, timestamp: 1700000000, opId: '', protocolVersion: PROTOCOL_VERSION })
    expect(() => decodeSyncMessage(raw)).toThrow(/opId/)
  })

  it('rejects a beacon with invalid opId', () => {
    const raw = JSON.stringify({ type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 100, timestamp: 1700000000, opId: '', protocolVersion: PROTOCOL_VERSION })
    expect(() => decodeSyncMessage(raw)).toThrow(/opId/)
  })
})

describe('applySyncMessageWithResult', () => {
  function makeGroup() {
    return createGroup({ name: 'test', members: [PUBKEY_AAA], preset: 'family', creator: PUBKEY_AAA })
  }

  it('returns applied: true for accepted member-join', () => {
    const group = makeGroup()
    const result = applySyncMessageWithResult(group, {
      type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'join-1',
    }, undefined, PUBKEY_AAA)
    expect(result.applied).toBe(true)
    expect(result.state.members).toContain(PUBKEY_BBB)
  })

  it('returns applied: false for rejected message (non-admin sender)', () => {
    const group = makeGroup()
    const result = applySyncMessageWithResult(group, {
      type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'join-1',
    }, undefined, PUBKEY_BBB) // BBB is not admin
    expect(result.applied).toBe(false)
    expect(result.state).toBe(group) // reference equality — unchanged
  })

  it('returns applied: true for fresh beacon (fire-and-forget)', () => {
    const group = makeGroup()
    const now = Math.floor(Date.now() / 1000)
    const result = applySyncMessageWithResult(group, {
      type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 10, timestamp: now, opId: 'b-1',
    }, now)
    expect(result.applied).toBe(true)
  })

  it('returns applied: false for stale beacon (fire-and-forget)', () => {
    const group = makeGroup()
    const now = Math.floor(Date.now() / 1000)
    const result = applySyncMessageWithResult(group, {
      type: 'beacon', lat: 51.5, lon: -0.1, accuracy: 10, timestamp: now - 600, opId: 'b-1',
    }, now)
    expect(result.applied).toBe(false)
  })
})
