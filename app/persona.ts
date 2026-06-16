// app/persona.ts — Persona lifecycle: TreeRoot management, derivation, group identity

import { fromNsec, derive } from 'nsec-tree/core'
import { deriveFromIdentity } from 'nsec-tree'
import type { TreeRoot, Identity } from 'nsec-tree/core'
import { derivePersona, deriveFromPersona } from 'nsec-tree/persona'
import type { Persona } from 'nsec-tree/persona'
import type { AppIdentity, AppPersona, IdentityNodeType } from './types.js'
import { findById, findByName, generatePersonaId } from './persona-tree.js'
import { getState } from './state.js'

export interface DerivationPathSegment {
  name: string
  index?: number
}

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
function toAppPersona(persona: Persona, nodeType: IdentityNodeType = 'persona'): AppPersona {
  return {
    id: generatePersonaId(),
    name: persona.name,
    index: persona.index,
    npub: persona.identity.npub,
    children: {},
    nodeType,
  }
}

function validatePersonaSegment(segment: string): string {
  const normalised = segment.trim()
  if (normalised.length === 0 || normalised.length > 32) {
    throw new Error('Derivation segments must be 1–32 characters long')
  }
  if (normalised !== normalised.toLowerCase()) {
    throw new Error('Derivation segments must be lowercase')
  }
  if (/\s/.test(normalised)) {
    throw new Error('Derivation segments must not contain spaces')
  }
  return normalised
}

function validateDerivationIndex(index: number | undefined): number {
  if (index === undefined) return 0
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Derivation indices must be non-negative integers')
  }
  return index
}

// ── Public API ────────────────────────────────────────────────

/**
 * Initialise the persona subsystem from the user's master identity.
 *
 * Creates a TreeRoot from the identity's private key, derives the
 * default persona set plus any custom names, and populates the cache.
 * Returns AppPersona records keyed by id, suitable for storing in AppState.
 *
 * If the identity has no privkey (external signer), returns an empty record.
 */
export function initPersonas(
  identity: AppIdentity,
  customNames?: string[],
): Record<string, AppPersona> {
  // External signers have no local privkey — personas require key material.
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

  // Only derive personas the user has explicitly created (passed via customNames
  // or already in state). DEFAULT_PERSONA_NAMES is for recovery scanning, not
  // for auto-populating the UI — users should create their own personas.
  const result: Record<string, AppPersona> = {}

  if (customNames && customNames.length > 0) {
    for (const name of customNames) {
      const persona = derivePersona(_masterRoot, name, 0)
      const appPersona = toAppPersona(persona)
      _personaCache.set(appPersona.id, persona)
      result[appPersona.id] = appPersona
    }
  }

  return result
}

/**
 * Re-initialise the persona subsystem and restore cached Persona instances
 * from an existing persona tree (e.g. after vault restore).
 *
 * Unlike initPersonas which generates new ids, this preserves existing ids
 * from the persona tree and re-derives the cryptographic Persona objects.
 */
export function initPersonasFromTree(
  identity: AppIdentity,
  personas: Record<string, AppPersona>,
): void {
  if (!identity.privkey || identity.signerType === 'nip07') return

  if (_masterRoot) {
    _masterRoot.destroy()
    _masterRoot = null
    _personaCache.clear()
  }

  _masterRoot = fromNsec(hexToBytes(identity.privkey))

  // Walk the tree and re-derive each persona's cryptographic key
  function cacheFromTree(tree: Record<string, AppPersona>): void {
    for (const p of Object.values(tree)) {
      const persona = derivePersona(_masterRoot!, p.name, p.index)
      _personaCache.set(p.id, persona)
      if (p.children && Object.keys(p.children).length > 0) {
        cacheFromTree(p.children)
      }
    }
  }
  cacheFromTree(personas)
}

/** Whether the persona subsystem has an active TreeRoot. */
export function isPersonasInitialised(): boolean {
  return _masterRoot !== null
}

/**
 * Get or derive a cached Persona instance by id.
 *
 * Throws if personas have not been initialised.
 */
export function getPersonaById(id: string): Persona {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')

  const cached = _personaCache.get(id)
  if (cached) return cached

  // Look up the persona in state to get its name and index
  const found = findById(getState().personas, id)
  if (!found) throw new Error(`Persona "${id}" not found in state`)

  const persona = derivePersona(_masterRoot, found.persona.name, found.persona.index)
  _personaCache.set(id, persona)
  return persona
}

/**
 * Get or derive a cached Persona instance by name (level-1 only, backwards compat).
 *
 * Throws if personas have not been initialised.
 */
export function getPersona(name: string, index = 0): Persona {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')

  // Check if we have a persona with this name in state
  const match = findByName(getState().personas, name)
  if (match) {
    const cached = _personaCache.get(match.id)
    if (cached) return cached
    const persona = derivePersona(_masterRoot, name, match.index)
    _personaCache.set(match.id, persona)
    return persona
  }

  // Fallback: derive directly (for cases where persona isn't in state yet)
  const key = `_name:${name}:${index}`
  let persona = _personaCache.get(key)
  if (!persona) {
    persona = derivePersona(_masterRoot, name, index)
    _personaCache.set(key, persona)
  }
  return persona
}

/**
 * Resolve a full Identity for any persona in the tree, chaining derivations.
 *
 * Level-1 personas use derivePersona (identity comes from the Persona object).
 * Deeper personas chain deriveFromIdentity through each ancestor.
 */
export function resolveIdentity(persona: AppPersona, ancestors: AppPersona[]): Identity {
  if (ancestors.length === 0) {
    // Level-1: use the Persona directly
    return getPersonaById(persona.id).identity
  }

  // Start from the level-1 ancestor's identity
  let currentIdentity = getPersonaById(ancestors[0].id).identity

  // Chain through intermediate ancestors (level 2+)
  for (let i = 1; i < ancestors.length; i++) {
    const ancestor = ancestors[i]
    currentIdentity = deriveFromIdentity(currentIdentity, `persona:${ancestor.name}`, ancestor.index)
  }

  // Final derivation for the target persona
  return deriveFromIdentity(currentIdentity, `persona:${persona.name}`, persona.index)
}

/**
 * Derive any tree identity from a sequence of persona path segments.
 *
 * The first segment maps to `derivePersona(root, name, 0)`. Each additional
 * segment chains `deriveFromIdentity(identity, "persona:{name}", 0)`.
 * This is intended for deterministic identity recreation examples and dev tools.
 */
export function derivePathIdentity(path: readonly string[] | readonly DerivationPathSegment[]): Identity {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')
  if (path.length === 0) throw new Error('At least one derivation segment is required')

  const segments = path.map((segment) => (
    typeof segment === 'string'
      ? { name: validatePersonaSegment(segment), index: 0 }
      : { name: validatePersonaSegment(segment.name), index: validateDerivationIndex(segment.index) }
  ))

  const [head, ...rest] = segments
  let identity = derivePersona(_masterRoot, head.name, head.index).identity

  for (const segment of rest) {
    identity = deriveFromIdentity(identity, `persona:${segment.name}`, segment.index)
  }

  return identity
}

/**
 * Derive a group-specific signing identity for a persona.
 *
 * Uses the persona tree to resolve the identity, then derives a group sub-identity.
 * The purpose string includes the groupId and epoch for deterministic
 * rotation when a group reseeds.
 */
export function getGroupIdentity(personaId: string, groupId: string, epoch: number): Identity {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')
  if (!personaId) {
    // Fallback: derive directly from master root for groups with no persona assigned
    const purpose = `canary:group:${groupId}:${epoch}`
    return derive(_masterRoot, purpose, 0)
  }

  const found = findById(getState().personas, personaId)
  if (!found) {
    // Persona id not in tree — derive from master root as fallback
    console.warn(`[canary:persona] Persona "${personaId}" not found — falling back to master root for group ${groupId}`)
    const purpose = `canary:group:${groupId}:${epoch}`
    return derive(_masterRoot, purpose, 0)
  }

  const identity = resolveIdentity(found.persona, found.ancestors)
  const purpose = `canary:group:${groupId}:${epoch}`
  return deriveFromIdentity(identity, purpose, 0)
}

/**
 * Create a new child persona under a parent (or at root level if parentId is null).
 *
 * Validates name uniqueness among siblings. Returns the new AppPersona with
 * a generated id and empty children.
 * Throws if personas have not been initialised.
 */
export function createChildPersona(parentId: string | null, name: string, nodeType: IdentityNodeType = 'persona'): AppPersona {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')

  if (parentId === null) {
    // Root-level persona — use derivePersona
    const { personas } = getState()
    // Check name uniqueness among root siblings
    for (const p of Object.values(personas)) {
      if (p.name === name) throw new Error(`Persona "${name}" already exists at root level`)
    }

    const persona = derivePersona(_masterRoot, name, 0)
    const appPersona = toAppPersona(persona, nodeType)
    _personaCache.set(appPersona.id, persona)
    return appPersona
  }

  // Deeper level — resolve parent identity, then derive child
  const found = findById(getState().personas, parentId)
  if (!found) throw new Error(`Parent persona "${parentId}" not found`)

  // Check name uniqueness among siblings
  for (const child of Object.values(found.persona.children)) {
    if (child.name === name) throw new Error(`Persona "${name}" already exists under "${found.persona.name}"`)
  }

  const parentIdentity = resolveIdentity(found.persona, found.ancestors)
  const childIdentity = deriveFromIdentity(parentIdentity, `persona:${name}`, 0)

  const id = generatePersonaId()
  return {
    id,
    name,
    index: 0,
    npub: childIdentity.npub,
    children: {},
    nodeType,
  }
}

/**
 * Create a new root-level persona (convenience wrapper).
 *
 * Derives the persona, caches it, and returns the AppPersona record.
 * Throws if personas have not been initialised.
 */
export function createPersona(name: string, nodeType: IdentityNodeType = 'persona'): AppPersona {
  return createChildPersona(null, name, nodeType)
}

/**
 * Rotate a persona to the next index.
 *
 * Derives at currentIndex + 1, updates the cache, and returns the new AppPersona.
 * Throws if personas have not been initialised.
 */
export function rotatePersona(personaId: string, currentIndex: number): AppPersona {
  if (!_masterRoot) throw new Error('Personas not initialised — call initPersonas() first')

  const found = findById(getState().personas, personaId)
  if (!found) throw new Error(`Persona "${personaId}" not found`)

  const newIndex = currentIndex + 1
  const persona = derivePersona(_masterRoot, found.persona.name, newIndex)

  // Update cache: remove old entry, add new
  _personaCache.delete(personaId)
  _personaCache.set(personaId, persona)

  return {
    ...found.persona,
    index: newIndex,
    npub: persona.identity.npub,
  }
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
