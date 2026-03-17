import { describe, it, expect, vi } from 'vitest'
import {
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  advanceCounter,
  reseed,
  addMember,
  removeMember,
  removeMemberAndReseed,
  syncCounter,
  dissolveGroup,
  type GroupConfig,
  type GroupState,
} from './group.js'

const ALICE = '1'.repeat(64)
const BOB = '2'.repeat(64)
const CHARLIE = '3'.repeat(64)

describe('createGroup', () => {
  it('creates a group with generated seed', () => {
    const group = createGroup({
      name: 'Family',
      members: [ALICE, BOB],
    })
    expect(group.seed).toHaveLength(64)
    expect(group.members).toEqual([ALICE, BOB])
    expect(group.rotationInterval).toBe(604_800)
    expect(group.wordCount).toBe(1)
    expect(group.counter).toBeGreaterThan(0)
    expect(group.usageOffset).toBe(0)
  })

  it('accepts custom rotation interval', () => {
    const group = createGroup({
      name: 'High Security',
      members: [ALICE, BOB],
      rotationInterval: 86_400,
    })
    expect(group.rotationInterval).toBe(86_400)
  })

  it('accepts custom word count', () => {
    const group = createGroup({
      name: 'Paranoid',
      members: [ALICE, BOB],
      wordCount: 3,
    })
    expect(group.wordCount).toBe(3)
  })

  it('rejects rotationInterval of 0', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], rotationInterval: 0 }))
      .toThrow('rotationInterval must be a positive integer, got 0')
  })

  it('rejects negative rotationInterval', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], rotationInterval: -1 }))
      .toThrow('rotationInterval must be a positive integer, got -1')
  })

  it('rejects invalid wordCount', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], wordCount: 99 as any }))
      .toThrow('wordCount must be 1, 2, or 3, got 99')
  })

  it('rejects wordCount of 0', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], wordCount: 0 as any }))
      .toThrow('wordCount must be 1, 2, or 3, got 0')
  })

  it('rejects beaconPrecision out of range', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], beaconPrecision: 99 }))
      .toThrow('beaconPrecision must be an integer between 1 and 11, got 99')
  })

  it('rejects beaconPrecision of 0', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], beaconPrecision: 0 }))
      .toThrow('beaconPrecision must be an integer between 1 and 11, got 0')
  })

  it('rejects beaconInterval of 0', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], beaconInterval: 0 }))
      .toThrow('beaconInterval must be a positive integer, got 0')
  })

  it('rejects fractional rotationInterval', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], rotationInterval: 86400.5 }))
      .toThrow('rotationInterval must be a positive integer, got 86400.5')
  })

  it('rejects fractional beaconInterval', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], beaconInterval: 300.7 }))
      .toThrow('beaconInterval must be a positive integer, got 300.7')
  })

  it('rejects negative tolerance', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], tolerance: -1 }))
      .toThrow('tolerance must be an integer 0–10, got -1')
  })

  it('rejects tolerance exceeding MAX_TOLERANCE', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], tolerance: 11 }))
      .toThrow('tolerance must be an integer 0–10, got 11')
  })

  it('rejects fractional tolerance', () => {
    expect(() => createGroup({ name: 'Bad', members: [ALICE], tolerance: 1.5 }))
      .toThrow('tolerance must be an integer 0–10, got 1.5')
  })

  it('rejects empty name', () => {
    expect(() => createGroup({ name: '', members: [ALICE] }))
      .toThrow('name must be a non-empty string')
  })

  it('rejects non-string name', () => {
    expect(() => createGroup({ name: 123 as any, members: [ALICE] }))
      .toThrow('name must be a non-empty string')
  })

  it('rejects name exceeding 256 characters', () => {
    expect(() => createGroup({ name: 'x'.repeat(257), members: [ALICE] }))
      .toThrow('name must be at most 256 characters')
  })

  it('accepts name at exactly 256 characters', () => {
    const group = createGroup({ name: 'x'.repeat(256), members: [ALICE] })
    expect(group.name).toHaveLength(256)
  })

  it('accepts valid edge-case config', () => {
    const group = createGroup({
      name: 'Edge',
      members: [ALICE],
      rotationInterval: 1,
      wordCount: 3,
      beaconPrecision: 11,
      beaconInterval: 1,
    })
    expect(group.rotationInterval).toBe(1)
    expect(group.wordCount).toBe(3)
    expect(group.beaconPrecision).toBe(11)
    expect(group.beaconInterval).toBe(1)
  })

  it('rejects member pubkey that is too short', () => {
    expect(() => createGroup({ name: 'Bad', members: ['abcd'] }))
      .toThrow('Invalid member pubkey: expected 64 hex characters')
  })

  it('rejects member pubkey with uppercase hex', () => {
    expect(() => createGroup({ name: 'Bad', members: ['A'.repeat(64)] }))
      .toThrow('Invalid member pubkey: expected 64 hex characters')
  })

  it('rejects member pubkey with non-hex characters', () => {
    expect(() => createGroup({ name: 'Bad', members: ['g'.repeat(64)] }))
      .toThrow('Invalid member pubkey: expected 64 hex characters')
  })
})

describe('getCurrentWord', () => {
  it('returns the current verification word', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const word = getCurrentWord(group)
    expect(typeof word).toBe('string')
    expect(word.length).toBeGreaterThan(0)
  })

  it('returns same word for same group state', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    expect(getCurrentWord(group)).toBe(getCurrentWord(group))
  })

  it('returns 2 space-separated words when wordCount is 2', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB], wordCount: 2 })
    const phrase = getCurrentWord(group)
    const parts = phrase.split(' ')
    expect(parts).toHaveLength(2)
    expect(parts[0].length).toBeGreaterThan(0)
    expect(parts[1].length).toBeGreaterThan(0)
  })

  it('returns 3 space-separated words when wordCount is 3', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB], wordCount: 3 })
    const phrase = getCurrentWord(group)
    const parts = phrase.split(' ')
    expect(parts).toHaveLength(3)
    expect(parts.every(p => p.length > 0)).toBe(true)
  })
})

describe('getCurrentDuressWord', () => {
  it('returns a duress word for a specific member', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const duress = getCurrentDuressWord(group, ALICE)
    expect(typeof duress).toBe('string')
    expect(duress).not.toBe(getCurrentWord(group))
  })
})

describe('advanceCounter', () => {
  it('increments usageOffset', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const advanced = advanceCounter(group)
    expect(advanced.usageOffset).toBe(group.usageOffset + 1)
  })

  it('changes the current word', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const before = getCurrentWord(group)
    const advanced = advanceCounter(group)
    const after = getCurrentWord(advanced)
    expect(after).not.toBe(before)
  })

  it('throws when effective counter would exceed time-based counter plus MAX_COUNTER_OFFSET', () => {
    const state = createGroup({ name: 'bound-test', members: [ALICE] })
    const s = { ...state, usageOffset: 100 }
    expect(() => advanceCounter(s)).toThrow(RangeError)
  })

  it('allows advancing up to MAX_COUNTER_OFFSET', () => {
    const state = createGroup({ name: 'bound-test', members: [ALICE] })
    const s = { ...state, usageOffset: 99 }
    const result = advanceCounter(s)
    expect(result.usageOffset).toBe(100)
  })
})

describe('reseed', () => {
  it('generates a new seed', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const reseeded = reseed(group)
    expect(reseeded.seed).not.toBe(group.seed)
    expect(reseeded.seed).toHaveLength(64)
  })

  it('resets usageOffset to 0', () => {
    const group = advanceCounter(createGroup({ name: 'Test', members: [ALICE, BOB] }))
    const reseeded = reseed(group)
    expect(reseeded.usageOffset).toBe(0)
  })
})

describe('addMember', () => {
  it('adds a member to the group', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const updated = addMember(group, CHARLIE)
    expect(updated.members).toContain(CHARLIE)
    expect(updated.members).toHaveLength(3)
  })

  it('does not add duplicate member', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const updated = addMember(group, ALICE)
    expect(updated.members).toHaveLength(2)
  })

  it('rejects invalid pubkey', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    expect(() => addMember(group, 'not-a-pubkey'))
      .toThrow('Invalid member pubkey: expected 64 hex characters')
  })

  it('rejects adding beyond maximum member count', () => {
    const members = Array.from({ length: 100 }, (_, i) => i.toString(16).padStart(64, '0'))
    const group = createGroup({ name: 'Test', members })
    const nextPubkey = (100).toString(16).padStart(64, '0')
    expect(() => addMember(group, nextPubkey)).toThrow(/maximum/)
  })
})

describe('duplicate member validation (security audit)', () => {
  it('rejects duplicate pubkeys in members array', () => {
    expect(() => createGroup({ name: 'Test', members: [ALICE, ALICE] })).toThrow(/Duplicate/)
  })

  it('accepts unique pubkeys', () => {
    expect(() => createGroup({ name: 'Test', members: [ALICE, BOB] })).not.toThrow()
  })
})

describe('removeMember', () => {
  it('removes a member without reseeding', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB, CHARLIE] })
    const updated = removeMember(group, CHARLIE)
    expect(updated.members).not.toContain(CHARLIE)
    expect(updated.members).toHaveLength(2)
    // Seed unchanged — callers must create a new group for forward secrecy
    expect(updated.seed).toBe(group.seed)
  })

  it('is idempotent for absent members', () => {
    const state = createGroup({ name: 'test', members: ['a'.repeat(64)] })
    const result = removeMember(state, 'b'.repeat(64))
    expect(result.seed).toBe(state.seed)
    expect(result.members).toEqual(state.members)
  })

  it('rejects invalid pubkey (security audit)', () => {
    const state = createGroup({ name: 'test', members: ['a'.repeat(64)] })
    expect(() => removeMember(state, 'not-a-hex-key')).toThrow(/hex/)
  })
})

describe('removeMemberAndReseed', () => {
  it('removes the member and generates a fresh seed', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB, CHARLIE] })
    const updated = removeMemberAndReseed(group, CHARLIE)
    expect(updated.members).not.toContain(CHARLIE)
    expect(updated.members).toHaveLength(2)
    expect(updated.seed).not.toBe(group.seed)
    expect(updated.usageOffset).toBe(0)
  })

  it('returns reseeded state even for absent members', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const updated = removeMemberAndReseed(group, CHARLIE)
    // Member list unchanged (Charlie wasn't in it)
    expect(updated.members).toEqual(group.members)
    // But seed is still rotated (caller explicitly asked for reseed)
    expect(updated.seed).not.toBe(group.seed)
  })
})

describe('authority model fields', () => {
  it('createGroup with creator sets only creator as admin', () => {
    const creator = 'a'.repeat(64)
    const member = 'b'.repeat(64)
    const group = createGroup({ name: 'test', members: [creator, member], preset: 'family', creator })
    expect(group.admins).toEqual([creator])
    expect(group.members).toEqual([creator, member])
    expect(group.epoch).toBe(0)
    expect(group.consumedOps).toEqual([])
  })

  it('createGroup without creator has empty admins', () => {
    const group = createGroup({ name: 'test', members: [], preset: 'family' })
    expect(group.admins).toEqual([])
    expect(group.epoch).toBe(0)
  })

  it('createGroup with creator not in members throws', () => {
    const creator = 'a'.repeat(64)
    const member = 'b'.repeat(64)
    expect(() => createGroup({ name: 'test', members: [member], preset: 'family', creator }))
      .toThrow('creator must be in members')
  })

  it('reseed does not change admins or epoch (local reseed is not an epoch bump)', () => {
    const creator = 'a'.repeat(64)
    const group = createGroup({ name: 'test', members: [creator], preset: 'family', creator })
    const reseeded = reseed(group)
    expect(reseeded.admins).toEqual(group.admins)
    expect(reseeded.epoch).toBe(group.epoch)
  })
})

describe('dissolveGroup', () => {
  it('returns state with zeroed seed, empty members, and empty admins', () => {
    const state = createGroup({ name: 'dissolve-test', members: [ALICE, BOB] })
    const dissolved = dissolveGroup(state)
    expect(dissolved.seed).toBe('0'.repeat(64))
    expect(dissolved.members).toEqual([])
    expect(dissolved.admins).toEqual([])
  })

  it('preserves name and metadata for audit trail', () => {
    const state = createGroup({ name: 'audit-trail', members: [ALICE] })
    const dissolved = dissolveGroup(state)
    expect(dissolved.name).toBe('audit-trail')
    expect(dissolved.createdAt).toBe(state.createdAt)
  })

  it('clears consumedOpsFloor on dissolution', () => {
    const state = createGroup({ name: 'floor-test', members: [ALICE] })
    const withFloor = { ...state, consumedOpsFloor: 1700000000, consumedOps: ['op-1'] }
    const dissolved = dissolveGroup(withFloor)
    expect(dissolved.consumedOps).toEqual([])
    expect(dissolved.consumedOpsFloor).toBeUndefined()
  })
})

describe('syncCounter', () => {
  it('syncCounter advances counter and resets usageOffset', () => {
    const state = createGroup({ name: 'test', members: ['a'.repeat(64)] })
    const advanced = advanceCounter(state)
    expect(advanced.usageOffset).toBe(1)
    // Sync to a future time
    const futureTime = Math.floor(Date.now() / 1000) + state.rotationInterval * 2
    const synced = syncCounter(advanced, futureTime)
    expect(synced.counter).toBeGreaterThan(state.counter)
    expect(synced.usageOffset).toBe(0)
  })

  it('syncCounter returns same state when counter unchanged', () => {
    const state = createGroup({ name: 'test', members: ['a'.repeat(64)] })
    const synced = syncCounter(state, Math.floor(Date.now() / 1000))
    expect(synced).toBe(state) // reference equality — no unnecessary copy
  })

  it('syncCounter rejects counter regression from clock rollback', () => {
    const state = createGroup({ name: 'test', members: ['a'.repeat(64)] })
    // Advance to a future time first
    const futureTime = Math.floor(Date.now() / 1000) + state.rotationInterval * 5
    const advanced = syncCounter(state, futureTime)
    expect(advanced.counter).toBeGreaterThan(state.counter)

    // Now attempt to sync to a past time — should not regress
    const pastTime = Math.floor(Date.now() / 1000) - state.rotationInterval * 2
    const regressed = syncCounter(advanced, pastTime)
    expect(regressed.counter).toBe(advanced.counter)
  })
})

describe('createGroup group size advisory', () => {
  it('warns when creating a 1-word group with 10+ members via console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const members = Array.from({ length: 10 }, (_, i) =>
      i.toString(16).padStart(2, '0').repeat(32)
    )
    createGroup({ name: 'large', members, wordCount: 1 })
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('2+ words')
    )
    spy.mockRestore()
  })

  it('does not warn for 2-word group with 10+ members', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const members = Array.from({ length: 10 }, (_, i) =>
      i.toString(16).padStart(2, '0').repeat(32)
    )
    createGroup({ name: 'large', members, wordCount: 2 })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
