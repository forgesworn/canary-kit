// app/persona.ts — Persona lifecycle: TreeRoot management, derivation, group identity

import { fromNsec } from 'nsec-tree/core'
import type { TreeRoot, Identity } from 'nsec-tree/core'
import { derivePersona, deriveFromPersona, DEFAULT_PERSONA_NAMES } from 'nsec-tree/persona'
import type { Persona } from 'nsec-tree/persona'
import type { AppIdentity, AppPersona } from './types.js'

// ── Private module state ──────────────────────────────────────

let _masterRoot: TreeRoot | null = null
const _personaCache = new Map<string, Persona>()

// ── Helpers ───────────────────────────────────────────────────

/** Convert a hex string to Uint8Array. */
function hexToBytes(hex: string): Uint8Array {
  const len = hex.length >> 1
  const out = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    out[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return out
}

/** Map a nsec-tree Persona to our AppPersona (public-only data). */
function toAppPersona(persona: Persona): AppPersona {
  return {
    name: persona.name,
    index: persona.index,
    npub: persona.identity.npub,
  }
}

// ── Public API ────────────────────────────────────────────────

/**
 * Initialise the persona subsystem from the user's master identity.
 *
 * Creates a TreeRoot from the identity's private key, derives the
 * default persona set plus any custom names, and populates the cache.
 * Returns AppPersona records suitable for storing in AppState.
 *
 * If the identity has no privkey (NIP-07 signer), returns an empty record.
 */
export function initPersonas(
  identity: AppIdentity,
  customNames?: string[],
): Record<string, AppPersona> {
  // NIP-07 signers have no local privkey — personas require key material
  if (!identity.privkey || identity.signerType === 'nip07') {
    return {}
  }

  // Tear down any existing root before creating a new one
  if (_masterRoot) {
    _masterRoot.destroy()
    _masterRoot = null
    _personaCache.clear()
  }

  _masterRoot = fromNsec(hexToBytes(identity.privkey))

  const allNames: string[] = [...DEFAULT_PERSONA_NAMES, ...(customNames ?? [])]
  const result: Record<string, AppPersona> = {}

  for (const name of allNames) {
    const persona = derivePersona(_masterRoot, name, 0)
    _personaCache.set(cacheKey(name, 0), persona)
    result[name] = toAppPersona(persona)
  }

  return result
}

/** Whether the persona subsystem has an active TreeRoot. */
export function isPersonasInitialised(): boolean {
  return _masterRoot !== null
}

/**
 * Get or derive a cached Persona instance.
 *
 * Throws if personas have not been initialised.
 */
export function getPersona(name: string, index = 0): Persona {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')

  const key = cacheKey(name, index)
  let persona = _personaCache.get(key)
  if (!persona) {
    persona = derivePersona(_masterRoot, name, index)
    _personaCache.set(key, persona)
  }
  return persona
}

/**
 * Derive a group-specific signing identity for a persona.
 *
 * Uses two-level derivation: persona → group sub-identity.
 * The purpose string includes the groupId and epoch for deterministic
 * rotation when a group reseeds.
 */
export function getGroupIdentity(personaName: string, groupId: string, epoch: number): Identity {
  const persona = getPersona(personaName)
  const purpose = `canary:group:${groupId}:${epoch}`
  return deriveFromPersona(persona, purpose, 0)
}

/**
 * Create a new custom persona at index 0.
 *
 * Derives the persona, caches it, and returns the AppPersona record.
 * Throws if personas have not been initialised.
 */
export function createPersona(name: string): AppPersona {
  const persona = getPersona(name, 0)
  return toAppPersona(persona)
}

/**
 * Rotate a persona to the next index.
 *
 * Derives at currentIndex + 1, updates the cache, and returns the new AppPersona.
 * Throws if personas have not been initialised.
 */
export function rotatePersona(name: string, currentIndex: number): AppPersona {
  const newIndex = currentIndex + 1
  const persona = getPersona(name, newIndex)
  return toAppPersona(persona)
}

/**
 * Destroy the master TreeRoot and clear all cached personas.
 *
 * After this call, all persona derivation functions will throw until
 * initPersonas() is called again.
 */
export function destroyPersonas(): void {
  if (_masterRoot) {
    _masterRoot.destroy()
    _masterRoot = null
  }
  _personaCache.clear()
}

// ── Internal ──────────────────────────────────────────────────

function cacheKey(name: string, index: number): string {
  return `${name}:${index}`
}
