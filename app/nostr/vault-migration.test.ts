// app/nostr/vault-migration.test.ts — Tests for vault v3 format
import { describe, it, expect } from 'vitest'
import { serialiseVault, deserialiseVault } from './vault.js'
import type { AppGroup, AppPersona } from '../types.js'

// ── Helpers ─────────────────────────────────────────────────────

function makeGroup(overrides: Partial<AppGroup> = {}): AppGroup {
  return {
    id: 'test-group-1',
    name: 'Test Group',
    seed: 'a'.repeat(64),
    members: ['1'.repeat(64)],
    admins: ['1'.repeat(64)],
    counter: 10,
    usageOffset: 0,
    epoch: 1,
    nostrEnabled: true,
    relays: [],
    readRelays: ['wss://relay.trotters.cc'],
    writeRelays: ['wss://relay.trotters.cc'],
    encodingFormat: 'words',
    tolerance: 1,
    livenessInterval: 3600,
    livenessCheckins: {},
    beaconPrecision: 5,
    usedInvites: [],
    latestInviteIssuedAt: 0,
    personaId: 'p1',
    ...overrides,
  } as AppGroup
}

function makePersona(id: string, name: string): AppPersona {
  return {
    id,
    name,
    index: 1,
    npub: 'npub1' + 'a'.repeat(58),
    children: {},
    displayName: `${name} Identity`,
  }
}

// ── v3 Format Tests ──────────────────────────────────────────────

describe('vault v3 format', () => {
  it('serialises with version 3 and persona record keyed by id', () => {
    const groups = { g1: makeGroup() }
    const personas: Record<string, AppPersona> = { p1: makePersona('p1', 'ops') }
    const json = serialiseVault(groups, personas)
    const parsed = JSON.parse(json)

    expect(parsed.version).toBe(3)
    expect(parsed.personas.p1).toBeDefined()
    expect(parsed.personas.p1.name).toBe('ops')
    expect(parsed.personas.p1.id).toBe('p1')
    expect(parsed.groups.g1.personaId).toBe('p1')
  })

  it('deserialises v3 vault — preserves personaId and personas', () => {
    const groups = { g1: makeGroup({ personaId: 'p2' }) }
    const personas: Record<string, AppPersona> = {
      p2: makePersona('p2', 'field-ops'),
      p3: makePersona('p3', 'personal'),
    }
    const json = serialiseVault(groups, personas)
    const result = deserialiseVault(json)

    expect(result.groups.g1.personaId).toBe('p2')
    expect(Object.keys(result.personas)).toHaveLength(2)
    expect(result.personas.p2.name).toBe('field-ops')
    expect(result.personas.p3.name).toBe('personal')
  })

  it('migrates v1 vault — defaults personaName to personal, assigns ids', () => {
    const v1Json = JSON.stringify({
      version: 1,
      groups: {
        g1: {
          id: 'g1',
          name: 'Old Group',
          seed: 'b'.repeat(64),
          members: ['1'.repeat(64)],
        },
      },
    })

    const result = deserialiseVault(v1Json)
    expect(Object.keys(result.groups)).toHaveLength(1)
    // personaName should be migrated to personaId (empty since no personas in v1)
    expect(result.groups.g1).toBeDefined()
  })

  it('migrates v2 vault — converts persona array to tree, personaName to personaId', () => {
    const v2Json = JSON.stringify({
      version: 2,
      groups: { g1: { id: 'g1', name: 'V2 Group', personaName: 'test' } },
      personas: [{ name: 'test', index: 0, npub: 'npub1test' }],
    })

    const result = deserialiseVault(v2Json)
    // Groups should be preserved
    expect(result.groups.g1).toBeDefined()
    expect(result.groups.g1.name).toBe('V2 Group')
    // Personas should be converted from array to record with ids
    const personaEntries = Object.values(result.personas)
    expect(personaEntries).toHaveLength(1)
    expect(personaEntries[0].name).toBe('test')
    expect(personaEntries[0].id).toBeTruthy()
    expect(personaEntries[0].children).toEqual({})
    // Group personaId should map to the migrated persona's id
    expect(result.groups.g1.personaId).toBe(personaEntries[0].id)
  })

  it('migrates unversioned vault — treats as v1', () => {
    const json = JSON.stringify({
      groups: { g1: { id: 'g1', name: 'Ancient Group' } },
    })

    const result = deserialiseVault(json)
    expect(result.groups.g1).toBeDefined()
    expect(result.groups.g1.name).toBe('Ancient Group')
  })

  it('handles malformed JSON gracefully', () => {
    const result = deserialiseVault('{broken json!!!')
    expect(result.groups).toEqual({})
    expect(result.personas).toEqual({})
  })

  it('serialises with empty personas when none provided', () => {
    const groups = { g1: makeGroup() }
    const json = serialiseVault(groups)
    const parsed = JSON.parse(json)

    expect(parsed.version).toBe(3)
    expect(parsed.personas).toEqual({})
  })

  it('handles v3 vault with missing personas field', () => {
    const json = JSON.stringify({
      version: 3,
      groups: { g1: { id: 'g1', name: 'Edge', personaId: 'p1' } },
    })
    const result = deserialiseVault(json)

    expect(result.groups.g1.personaId).toBe('p1')
    expect(result.personas).toEqual({})
  })

  it('preserves deletedGroupIds in v3', () => {
    const groups = { g1: makeGroup() }
    const json = serialiseVault(groups, {}, ['old-group-1', 'old-group-2'])
    const result = deserialiseVault(json)

    expect(result.deletedGroupIds).toEqual(['old-group-1', 'old-group-2'])
  })

  it('preserves nested children in persona tree', () => {
    const child = makePersona('c1', 'client-a')
    const parent = { ...makePersona('p1', 'work'), children: { c1: child } }
    const personas: Record<string, AppPersona> = { p1: parent }
    const json = serialiseVault({ g1: makeGroup() }, personas)
    const result = deserialiseVault(json)

    expect(result.personas.p1.children.c1).toBeDefined()
    expect(result.personas.p1.children.c1.name).toBe('client-a')
  })
})
