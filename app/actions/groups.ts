// app/actions/groups.ts — Group lifecycle functions combining SDK calls with app state

import {
  createGroup,
  addMember,
  removeMember,
  reseed,
  advanceCounter,
  type PresetName,
} from 'canary-kit'

import { getState, update, updateGroup } from '../state.js'
import { broadcastAction, reRegisterGroup } from '../sync.js'
import type { AppGroup } from '../types.js'

/**
 * Return the local user's pubkey from trusted app state.
 * Throws if no identity is available (should never happen after boot).
 */
function getCallerPubkey(): string {
  const { identity } = getState()
  if (!identity?.pubkey) {
    throw new Error('No local identity — cannot perform privileged action.')
  }
  return identity.pubkey
}

/**
 * Assert that the local user is an admin of the given group.
 * Throws a descriptive error if not.
 */
function assertAdmin(group: { admins: string[]; name: string }): void {
  const caller = getCallerPubkey()
  if (!group.admins.includes(caller)) {
    throw new Error(`Not authorised — you are not an admin of "${group.name}".`)
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

/**
 * Create a new group, wrap the SDK result as an AppGroup with app-layer
 * defaults, persist it to state, and return the new group's id.
 *
 * @param name         Human-readable group name.
 * @param preset       Named threat-profile preset ('family' | 'field-ops' | 'enterprise').
 * @param memberPubkey Optional 64-char hex pubkey to add as the first member.
 */
export function createNewGroup(name: string, preset: PresetName, memberPubkey?: string): string {
  const id = crypto.randomUUID()

  const members: string[] = memberPubkey ? [memberPubkey] : []
  const sdkGroup = createGroup({ name, members, preset, creator: memberPubkey })

  const relays = [...getState().settings.defaultRelays]

  const appGroup: AppGroup = {
    ...sdkGroup,
    id,
    nostrEnabled: relays.length > 0,
    relays,
    encodingFormat: 'words',
    usedInvites: [],
    latestInviteIssuedAt: 0,
    livenessInterval: sdkGroup.rotationInterval,
    livenessCheckins: {},
    tolerance: 1,
    memberNames: {},
    duressMode: 'immediate',
  }

  const { groups } = getState()
  update({
    groups: { ...groups, [id]: appGroup },
    activeGroupId: id,
  })

  if (memberPubkey) {
    broadcastAction(id, { type: 'member-join', pubkey: memberPubkey, timestamp: Math.floor(Date.now() / 1000), epoch: 0, opId: crypto.randomUUID() })
  }

  return id
}

/**
 * Delete a group from state.
 * Clears `activeGroupId` if the deleted group was the active one.
 */
export function deleteGroup(id: string): void {
  const { groups, activeGroupId } = getState()

  const updated = { ...groups }
  delete updated[id]

  update({
    groups: updated,
    activeGroupId: activeGroupId === id ? null : activeGroupId,
  })
}

/**
 * Routine key rotation (transition-under-old-key).
 * Broadcasts the reseed encrypted under the OLD group key so peers can
 * decrypt it, then rekeys locally.
 */
export function reseedGroup(id: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] reseedGroup: unknown group id "${id}"`)
    return
  }

  assertAdmin(group)

  const reseeded = reseed(group)
  const newEpoch = (group.epoch ?? 0) + 1
  const opId = crypto.randomUUID()
  const admins = [...(group.admins ?? [])]

  // Broadcast FIRST under old key (peers can decrypt)
  broadcastAction(id, {
    type: 'reseed',
    seed: hexToBytes(reseeded.seed),
    counter: reseeded.counter,
    timestamp: Math.floor(Date.now() / 1000),
    epoch: newEpoch,
    opId,
    admins,
    members: [...group.members],
  })

  // Then rekey locally
  updateGroup(id, {
    ...reseeded,
    epoch: newEpoch,
    consumedOps: [opId],
    admins,
  })

  // Re-register transport with new seed for future messages
  reRegisterGroup(id)
}

/**
 * Emergency reseed when the old key is compromised.
 * Fail-closed: no broadcast (old key is untrusted).
 * All members must be reinvited.
 */
export function compromiseReseed(id: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] compromiseReseed: unknown group id "${id}"`)
    return
  }

  assertAdmin(group)

  const reseeded = reseed(group)
  const newEpoch = (group.epoch ?? 0) + 1

  updateGroup(id, {
    ...reseeded,
    epoch: newEpoch,
    consumedOps: [],
    admins: [...(group.admins ?? [])],
  })

  reRegisterGroup(id)
}

/**
 * Add a member pubkey to the group.
 * Delegates validation to the SDK `addMember()` function.
 */
export function addGroupMember(id: string, pubkey: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] addGroupMember: unknown group id "${id}"`)
    return
  }

  assertAdmin(group)

  const opId = crypto.randomUUID()
  const updated = addMember(group, pubkey)
  updateGroup(id, {
    ...updated,
    consumedOps: [...(group.consumedOps ?? []), opId],
  })
  reRegisterGroup(id)
  broadcastAction(id, {
    type: 'member-join',
    pubkey,
    timestamp: Math.floor(Date.now() / 1000),
    epoch: group.epoch ?? 0,
    opId,
  })
}

/**
 * Remove a member pubkey from the group and immediately rotate the shared seed.
 *
 * This is a fail-closed eviction path:
 * - No `member-leave` sync event is broadcast under the old key.
 * - The local group key is rekeyed right away, forcing explicit re-invite/migration
 *   for remaining members.
 */
/**
 * Evict a member (fail-closed: no broadcast).
 * Removes the member, reseeds, bumps epoch. Remaining members
 * must be reinvited since the evicted member held the old key.
 */
export function removeGroupMember(id: string, pubkey: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] removeGroupMember: unknown group id "${id}"`)
    return
  }

  // Self-leave is always allowed — no admin check needed
  const caller = getCallerPubkey()
  if (pubkey !== caller) {
    assertAdmin(group)
  }

  if (!group.members.includes(pubkey)) return

  const withoutMember = removeMember(group, pubkey)
  const rotated = reseed(withoutMember)
  const newEpoch = (group.epoch ?? 0) + 1

  const memberNames = { ...(group.memberNames ?? {}) }
  delete memberNames[pubkey]

  const livenessCheckins = { ...(group.livenessCheckins ?? {}) }
  delete livenessCheckins[pubkey]

  // Remove from admins too
  const admins = (group.admins ?? []).filter(a => a !== pubkey)

  updateGroup(id, {
    ...rotated,
    memberNames,
    livenessCheckins,
    admins,
    epoch: newEpoch,
    consumedOps: [],
  })

  // Fail-closed: no broadcast. Remaining members must be reinvited.
  reRegisterGroup(id)
}

/**
 * Burn the current word by advancing the usage counter.
 * Use after a word has been spoken/displayed to prevent reuse.
 */
export function burnWord(id: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] burnWord: unknown group id "${id}"`)
    return
  }

  const updated = advanceCounter(group)
  updateGroup(id, updated)
  broadcastAction(id, { type: 'counter-advance', counter: updated.counter, usageOffset: updated.usageOffset, timestamp: Math.floor(Date.now() / 1000) })
}

const HEX_64_RE = /^[0-9a-f]{64}$/

/**
 * Validate an imported group JSON object against protocol structural invariants.
 * Throws descriptive errors for each violation.
 * Does NOT check protocolVersion (imports are plain group JSON, not wire envelopes).
 */
export function validateGroupImport(data: unknown): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Import failed — expected a JSON object.')
  }
  const obj = data as Record<string, unknown>

  // Required string fields
  if (typeof obj.name !== 'string' || obj.name.trim().length === 0) {
    throw new Error('Import failed — name is required.')
  }
  if (typeof obj.seed !== 'string' || !HEX_64_RE.test(obj.seed)) {
    throw new Error('Import failed — seed must be a 64-character lowercase hex string.')
  }

  // Members: array of valid hex pubkeys
  if (!Array.isArray(obj.members) || obj.members.length === 0) {
    throw new Error('Import failed — members must be a non-empty array.')
  }
  for (const m of obj.members) {
    if (typeof m !== 'string' || !HEX_64_RE.test(m)) {
      throw new Error(`Import failed — invalid member pubkey: "${String(m)}".`)
    }
  }

  // Admins: array of valid hex pubkeys, must be subset of members
  if (Array.isArray(obj.admins)) {
    for (const a of obj.admins) {
      if (typeof a !== 'string' || !HEX_64_RE.test(a)) {
        throw new Error(`Import failed — invalid admin pubkey: "${String(a)}".`)
      }
    }
    const memberSet = new Set(obj.members as string[])
    for (const a of obj.admins as string[]) {
      if (!memberSet.has(a)) {
        throw new Error(`Import failed — admin "${a}" is not in the members list.`)
      }
    }
  }

  // Numeric fields
  if (obj.rotationInterval !== undefined) {
    if (typeof obj.rotationInterval !== 'number' || !Number.isInteger(obj.rotationInterval) || obj.rotationInterval <= 0) {
      throw new Error('Import failed — rotationInterval must be a positive integer.')
    }
  }
  if (obj.wordCount !== undefined) {
    if (obj.wordCount !== 1 && obj.wordCount !== 2 && obj.wordCount !== 3) {
      throw new Error('Import failed — wordCount must be 1, 2, or 3.')
    }
  }
  if (obj.encodingFormat !== undefined) {
    if (obj.encodingFormat !== 'words' && obj.encodingFormat !== 'pin' && obj.encodingFormat !== 'hex') {
      throw new Error('Import failed — encodingFormat must be words, pin, or hex.')
    }
  }
  if (obj.epoch !== undefined) {
    if (typeof obj.epoch !== 'number' || !Number.isInteger(obj.epoch) || obj.epoch < 0) {
      throw new Error('Import failed — epoch must be a non-negative integer.')
    }
  }
  if (obj.consumedOps !== undefined) {
    if (!Array.isArray(obj.consumedOps) || !obj.consumedOps.every((o: unknown) => typeof o === 'string')) {
      throw new Error('Import failed — consumedOps must be an array of strings.')
    }
  }
}
