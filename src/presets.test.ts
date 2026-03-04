import { describe, it, expect } from 'vitest'
import { PRESETS } from './presets.js'
import { createGroup } from './group.js'

const ALICE = '1'.repeat(64)
const BOB = '2'.repeat(64)

describe('PRESETS', () => {
  it('exports family preset with correct defaults', () => {
    const p = PRESETS.family
    expect(p.wordCount).toBe(1)
    expect(p.rotationInterval).toBe(604_800) // 7 days
  })

  it('exports field-ops preset with 2 words and 24h rotation', () => {
    const p = PRESETS['field-ops']
    expect(p.wordCount).toBe(2)
    expect(p.rotationInterval).toBe(86_400) // 24 hours
  })

  it('exports enterprise preset with 2 words and 48h rotation', () => {
    const p = PRESETS.enterprise
    expect(p.wordCount).toBe(2)
    expect(p.rotationInterval).toBe(172_800) // 48 hours
  })

  it('exports event preset with 1 word and 4h rotation', () => {
    const p = PRESETS.event
    expect(p.wordCount).toBe(1)
    expect(p.rotationInterval).toBe(14_400) // 4 hours
  })
})

describe('createGroup with preset', () => {
  it('applies field-ops preset defaults', () => {
    const group = createGroup({
      name: 'Journalists',
      members: [ALICE, BOB],
      preset: 'field-ops',
    })
    expect(group.wordCount).toBe(2)
    expect(group.rotationInterval).toBe(86_400)
  })

  it('allows explicit overrides on top of preset', () => {
    const group = createGroup({
      name: 'Custom',
      members: [ALICE, BOB],
      preset: 'field-ops',
      wordCount: 3, // override the preset's 2
    })
    expect(group.wordCount).toBe(3)
    expect(group.rotationInterval).toBe(86_400) // still from preset
  })

  it('applies enterprise preset defaults', () => {
    const group = createGroup({
      name: 'Corp',
      members: [ALICE, BOB],
      preset: 'enterprise',
    })
    expect(group.wordCount).toBe(2)
    expect(group.rotationInterval).toBe(172_800)
  })

  it('allows explicit rotationInterval override on top of preset', () => {
    const group = createGroup({
      name: 'Custom',
      members: [ALICE, BOB],
      preset: 'field-ops',
      rotationInterval: 3600,
    })
    expect(group.rotationInterval).toBe(3600)
    expect(group.wordCount).toBe(2) // still from preset
  })

  it('applies event preset defaults', () => {
    const group = createGroup({
      name: 'Bitcoin Conference',
      members: [ALICE, BOB],
      preset: 'event',
    })
    expect(group.wordCount).toBe(1)
    expect(group.rotationInterval).toBe(14_400)
  })

  it('throws on unknown preset name', () => {
    expect(() =>
      createGroup({
        name: 'Bad',
        members: [ALICE, BOB],
        // @ts-expect-error — testing JS consumer typo
        preset: 'field_ops',
      }),
    ).toThrow('Unknown preset: "field_ops"')
  })

  it('throws on prototype-inherited keys like toString', () => {
    expect(() =>
      createGroup({
        name: 'Bad',
        members: [ALICE, BOB],
        // @ts-expect-error — testing prototype bypass
        preset: 'toString',
      }),
    ).toThrow('Unknown preset')
  })

  it('throws on empty string preset', () => {
    expect(() =>
      createGroup({
        name: 'Bad',
        members: [ALICE, BOB],
        // @ts-expect-error — testing falsy bypass
        preset: '',
      }),
    ).toThrow('Unknown preset')
  })

  it('works without a preset (backwards compatible)', () => {
    const group = createGroup({
      name: 'Legacy',
      members: [ALICE, BOB],
    })
    expect(group.wordCount).toBe(1)
    expect(group.rotationInterval).toBe(604_800)
  })
})
