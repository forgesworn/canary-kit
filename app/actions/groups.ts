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
import type { AppGroup } from '../types.js'

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
  const sdkGroup = createGroup({ name, members, preset })

  const appGroup: AppGroup = {
    ...sdkGroup,
    id,
    nostrEnabled: true,
    relays: ['wss://relay.trotters.cc/'],
    encodingFormat: 'words',
    usedInvites: [],
    livenessInterval: sdkGroup.rotationInterval,
    livenessCheckins: {},
    tolerance: 1,
  }

  const { groups } = getState()
  update({
    groups: { ...groups, [id]: appGroup },
    activeGroupId: id,
  })

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
 * Reseed the group's shared secret (e.g. after a suspected compromise).
 * Calls the SDK `reseed()` function and persists the new state.
 */
export function reseedGroup(id: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] reseedGroup: unknown group id "${id}"`)
    return
  }

  const reseeded = reseed(group)
  updateGroup(id, reseeded)
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

  const updated = addMember(group, pubkey)
  updateGroup(id, updated)
}

/**
 * Remove a member pubkey from the group.
 * The SDK automatically reseeds after removal to invalidate the old secret.
 */
export function removeGroupMember(id: string, pubkey: string): void {
  const { groups } = getState()
  const group = groups[id]
  if (!group) {
    console.warn(`[canary:actions] removeGroupMember: unknown group id "${id}"`)
    return
  }

  const updated = removeMember(group, pubkey)
  updateGroup(id, updated)
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
}
