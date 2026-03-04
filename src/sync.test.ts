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
    const msg: SyncMessage = { type: 'member-join', pubkey: 'a'.repeat(64), timestamp: 1700000000, epoch: 0, opId: 'test-join-1' }
    const encoded = encodeSyncMessage(msg)
    expect(typeof encoded).toBe('string')
    const decoded = decodeSyncMessage(encoded)
    expect(decoded).toEqual(msg)
  })

  it('round-trips a member-leave message', () => {
    const msg: SyncMessage = { type: 'member-leave', pubkey: 'a'.repeat(64), timestamp: 1700000000 }
    expect(decodeSyncMessage(encodeSyncMessage(msg))).toEqual(msg)
  })

  it('round-trips a counter-advance message', () => {
    const msg: SyncMessage = { type: 'counter-advance', counter: 42, usageOffset: 3, timestamp: 1700000000 }
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
    // Self-leave: BBB removes themselves (no epoch/opId needed)
    const result = applySyncMessage(withBob, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0 }, undefined, PUBKEY_BBB)
    expect(result.members).not.toContain(PUBKEY_BBB)
    // removeMember no longer reseeds — seed stays the same
    expect(result.seed).toEqual(withBob.seed)
  })

  it('member-leave is idempotent — replayed leave for absent member returns state unchanged', () => {
    const group = makeGroup()
    const withBob = applySyncMessage(group, { type: 'member-join', pubkey: PUBKEY_BBB, timestamp: 0, epoch: 0, opId: 'test-join-1' }, undefined, PUBKEY_AAA)
    const afterLeave = applySyncMessage(withBob, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0 }, undefined, PUBKEY_BBB)
    // Replay the same leave — should be no-op (member already gone)
    const replayed = applySyncMessage(afterLeave, { type: 'member-leave', pubkey: PUBKEY_BBB, timestamp: 0 }, undefined, PUBKEY_BBB)
    expect(replayed).toBe(afterLeave) // reference equality — no change
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
      admins: [],
      epoch: 0,
      consumedOps: [],
    }

    const snapshot: SyncMessage = {
      type: 'state-snapshot',
      seed: 'c'.repeat(64),
      counter: 200,
      usageOffset: 5,
      members: ['b'.repeat(64), 'd'.repeat(64)],
      timestamp: 1700001000,
    }

    // state-snapshot is intentionally disabled (containment) — returns group unchanged
    const updated = applySyncMessage(group, snapshot)
    expect(updated).toBe(group)
  })
})

describe('liveness-checkin', () => {
  it('round-trips a liveness-checkin message', () => {
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: 'a'.repeat(64),
      timestamp: 1700000000,
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

    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: 'b'.repeat(64),
      timestamp: 1700001000,
    }

    const updated = applySyncMessage(group, msg)
    expect(updated).toEqual(group)
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
    let state = applySyncMessage(group, decodeSyncMessage(encodeSyncMessage(msg1)))
    state = applySyncMessage(state, decodeSyncMessage(encodeSyncMessage(msg2)))
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
      epoch: 2, opId: 'join-op',
    }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded).toEqual(msg)
  })

  it('round-trips a member-leave with epoch and opId', () => {
    const msg: SyncMessage = {
      type: 'member-leave', pubkey: PUBKEY_AAA, timestamp: 1700000000,
      epoch: 2, opId: 'leave-op',
    }
    const decoded = decodeSyncMessage(encodeSyncMessage(msg))
    expect(decoded).toEqual(msg)
  })

  it('rejects reseed without required epoch', () => {
    const payload = JSON.stringify({
      type: 'reseed', seed: 'a'.repeat(64), counter: 0, timestamp: 1700000000,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('epoch')
  })

  it('rejects member-join without required epoch', () => {
    const payload = JSON.stringify({
      type: 'member-join', pubkey: 'a'.repeat(64), timestamp: 1700000000,
    })
    expect(() => decodeSyncMessage(payload)).toThrow('epoch')
  })

  it('rejects reseed with opId exceeding 128 chars', () => {
    const payload = JSON.stringify({
      type: 'reseed', seed: 'a'.repeat(64), counter: 0, timestamp: 1700000000,
      epoch: 1, opId: 'x'.repeat(129),
      admins: ['a'.repeat(64)], members: ['a'.repeat(64)],
    })
    expect(() => decodeSyncMessage(payload)).toThrow('opId')
  })
})
