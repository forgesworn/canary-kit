import { describe, it, expect } from 'vitest'
import {
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  advanceCounter,
  reseed,
  deterministicReseed,
  addMember,
  removeMember,
  syncCounter,
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
})

describe('deterministicReseed', () => {
  it('produces a new seed different from the original', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const reseeded = deterministicReseed(group, 'some-context')
    expect(reseeded.seed).not.toBe(group.seed)
    expect(reseeded.seed).toHaveLength(64)
  })

  it('is deterministic — same input produces same output', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const a = deterministicReseed(group, 'same-context')
    const b = deterministicReseed(group, 'same-context')
    expect(a.seed).toBe(b.seed)
  })

  it('different context produces different seed', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB] })
    const a = deterministicReseed(group, ALICE)
    const b = deterministicReseed(group, BOB)
    expect(a.seed).not.toBe(b.seed)
  })

  it('resets usageOffset to 0', () => {
    const group = advanceCounter(createGroup({ name: 'Test', members: [ALICE, BOB] }))
    expect(group.usageOffset).toBe(1)
    const reseeded = deterministicReseed(group, 'ctx')
    expect(reseeded.usageOffset).toBe(0)
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
})
