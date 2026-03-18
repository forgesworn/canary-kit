// app/persona.test.ts — Persona module tests (TDD)

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import { bytesToHex } from 'nostr-tools/utils'
import type { AppIdentity } from './types.js'
import {
  initPersonas,
  isPersonasInitialised,
  getPersona,
  getGroupIdentity,
  createPersona,
  rotatePersona,
  destroyPersonas,
} from './persona.js'

/** Create a local identity from a fresh keypair. */
function localIdentity(): AppIdentity {
  const sk = generateSecretKey()
  return {
    pubkey: getPublicKey(sk),
    privkey: bytesToHex(sk),
    signerType: 'local',
  }
}

/** Create a local identity from a fixed seed for determinism tests. */
function fixedIdentity(): AppIdentity {
  // A well-known 32-byte hex key (all 0x01 bytes)
  const privkey = '0101010101010101010101010101010101010101010101010101010101010101'
  const sk = new Uint8Array(32).fill(1)
  return {
    pubkey: getPublicKey(sk),
    privkey,
    signerType: 'local',
  }
}

describe('persona module', () => {
  afterEach(() => {
    // Clean up after each test
    if (isPersonasInitialised()) destroyPersonas()
  })

  describe('initPersonas', () => {
    it('returns empty when no custom names provided (user creates their own)', () => {
      const identity = localIdentity()
      const personas = initPersonas(identity)
      expect(Object.keys(personas)).toHaveLength(0)
      expect(isPersonasInitialised()).toBe(true)
    })

    it('derives personas for provided custom names', () => {
      const identity = localIdentity()
      const personas = initPersonas(identity, ['personal', 'bitcoiner'])

      const names = Object.keys(personas)
      expect(names).toHaveLength(2)
      expect(names).toContain('personal')
      expect(names).toContain('bitcoiner')

      for (const [name, p] of Object.entries(personas)) {
        expect(p.name).toBe(name)
        expect(p.index).toBe(0)
        expect(p.npub).toMatch(/^npub1[a-z0-9]+$/)
      }
    })

    it('is deterministic — same privkey produces same personas', () => {
      const identity = fixedIdentity()
      const names = ['personal', 'bitcoiner']

      const first = initPersonas(identity, names)
      destroyPersonas()
      const second = initPersonas(identity, names)

      // Same npubs for every persona name
      for (const name of Object.keys(first)) {
        expect(second[name]).toBeDefined()
        expect(second[name].npub).toBe(first[name].npub)
      }
    })

    it('returns empty for NIP-07 identity (no privkey)', () => {
      const identity: AppIdentity = {
        pubkey: 'aabbccdd'.repeat(8),
        signerType: 'nip07',
      }
      const personas = initPersonas(identity)
      expect(Object.keys(personas)).toHaveLength(0)
    })

    it('includes custom personas when customNames provided', () => {
      const identity = localIdentity()
      const personas = initPersonas(identity, ['burner', 'alias'])

      expect(personas['burner']).toBeDefined()
      expect(personas['burner'].npub).toMatch(/^npub1/)
      expect(personas['alias']).toBeDefined()
      expect(personas['alias'].npub).toMatch(/^npub1/)
    })
  })

  describe('getGroupIdentity', () => {
    it('returns Identity with npub and privateKey', () => {
      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])

      const groupIdentity = getGroupIdentity('personal', 'group-abc', 0)
      expect(groupIdentity.npub).toMatch(/^npub1/)
      expect(groupIdentity.privateKey).toBeInstanceOf(Uint8Array)
      expect(groupIdentity.privateKey.length).toBe(32)
    })

    it('different groups produce different identities', () => {
      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])

      const id1 = getGroupIdentity('personal', 'group-a', 0)
      const id2 = getGroupIdentity('personal', 'group-b', 0)
      expect(id1.npub).not.toBe(id2.npub)
    })

    it('different personas produce different identities for the same group', () => {
      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])

      const id1 = getGroupIdentity('personal', 'group-x', 0)
      const id2 = getGroupIdentity('work', 'group-x', 0)
      expect(id1.npub).not.toBe(id2.npub)
    })
  })

  describe('createPersona', () => {
    it('creates a custom persona at index 0', () => {
      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])

      const persona = createPersona('stealth')
      expect(persona.name).toBe('stealth')
      expect(persona.index).toBe(0)
      expect(persona.npub).toMatch(/^npub1/)
    })
  })

  describe('rotatePersona', () => {
    it('increments index and produces a new npub', () => {
      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])

      const original = createPersona('rotate-test')
      const rotated = rotatePersona('rotate-test', original.index)

      expect(rotated.index).toBe(original.index + 1)
      expect(rotated.npub).toMatch(/^npub1/)
      expect(rotated.npub).not.toBe(original.npub)
    })
  })

  describe('destroyPersonas', () => {
    it('cleans up TreeRoot', () => {
      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])
      expect(isPersonasInitialised()).toBe(true)

      destroyPersonas()
      expect(isPersonasInitialised()).toBe(false)
    })
  })

  describe('isPersonasInitialised', () => {
    it('true after init, false after destroy', () => {
      expect(isPersonasInitialised()).toBe(false)

      const identity = localIdentity()
      initPersonas(identity, ['personal', 'bitcoiner', 'work'])
      expect(isPersonasInitialised()).toBe(true)

      destroyPersonas()
      expect(isPersonasInitialised()).toBe(false)
    })
  })
})
