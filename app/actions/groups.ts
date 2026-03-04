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
export function createNewGroup(name: string, preset: PresetName, memberPubkey?: string, mode: 'offline' | 'online' = 'offline'): string {
  const id = crypto.randomUUID()

  const members: string[] = memberPubkey ? [memberPubkey] : []
  const sdkGroup = createGroup({ name, members, preset })

  const appGroup: AppGroup = {
    ...sdkGroup,
    id,
    mode,
    nostrEnabled: mode === 'online',
    relays: mode === 'online' ? [...getState().settings.defaultRelays] : [],
    encodingFormat: 'words',
    usedInvites: [],
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
    broadcastAction(id, { type: 'member-join', pubkey: memberPubkey, timestamp: Math.floor(Date.now() / 1000) })
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

  // Re-register transport with new seed BEFORE broadcasting,
  // so the reseed message is encrypted under the new key.
  // The removed member (who has the old key) cannot decrypt it.
  reRegisterGroup(id)

  broadcastAction(id, { type: 'reseed', seed: hexToBytes(reseeded.seed), counter: reseeded.counter, timestamp: Math.floor(Date.now() / 1000) })
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
  broadcastAction(id, { type: 'member-join', pubkey, timestamp: Math.floor(Date.now() / 1000) })
}

/**
 * Remove a member pubkey from the group.
 *
 * **Security note:** The removed member still possesses the old seed and can
 * derive valid words. This function only removes them from the member list.
 * For forward secrecy, create a replacement group with a fresh seed.
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
  broadcastAction(id, { type: 'member-leave', pubkey, timestamp: Math.floor(Date.now() / 1000) })
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
