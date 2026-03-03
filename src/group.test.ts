import { describe, it, expect } from 'vitest'
import {
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  advanceCounter,
  reseed,
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
})

describe('removeMember', () => {
  it('removes a member and reseeds', () => {
    const group = createGroup({ name: 'Test', members: [ALICE, BOB, CHARLIE] })
    const updated = removeMember(group, CHARLIE)
    expect(updated.members).not.toContain(CHARLIE)
    expect(updated.members).toHaveLength(2)
    expect(updated.seed).not.toBe(group.seed)
  })

  it('removeMember on non-existent member still reseeds', () => {
    const state = createGroup({ name: 'test', members: ['a'.repeat(64)] })
    const result = removeMember(state, 'b'.repeat(64))
    expect(result.seed).not.toBe(state.seed) // reseeded
    expect(result.members).toEqual(state.members) // unchanged
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
