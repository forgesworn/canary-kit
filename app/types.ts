// app/types.ts — App-specific types extending the SDK's GroupState

import type { GroupState } from 'canary-kit'

/** A CANARY group with UI-specific persistence fields layered on top of GroupState. */
export interface AppGroup extends GroupState {
  /** Unique local identifier, generated with crypto.randomUUID(). */
  id: string
  /** @deprecated Mode is now derived from relay config — use `groupMode(group)` instead. Kept for migration. */
  mode?: 'offline' | 'online'
  /** Whether Nostr relay publishing is enabled for this group. */
  nostrEnabled: boolean
  /** List of Nostr relay WebSocket URLs for this group. */
  relays: string[]
  /** Preferred output encoding for token display. */
  encodingFormat: 'words' | 'pin' | 'hex'
  /** Nonces of invites that have already been consumed. */
  usedInvites: string[]
  /** Most recent accepted invite issue time (unix seconds). Used to reject stale invite rollbacks. */
  latestInviteIssuedAt: number
  /** Dead man's switch check-in interval in seconds. */
  livenessInterval: number
  /** Last check-in unix timestamp per member pubkey. */
  livenessCheckins: Record<string, number>
  /** Verification tolerance window: accept tokens within +/- this many counters. */
  tolerance: number
  /** Human-readable names for members, keyed by pubkey. */
  memberNames?: Record<string, string>
  /** Silent duress response mode: immediate alert, dead-drop, or both. */
  duressMode?: 'immediate' | 'dead-drop' | 'both'
  /** Geohash precision for location beacons (1–11, default 6 ≈ 1.2km). Higher = more precise.
   * Inherited from GroupState where it's required; optional here for backwards compat with persisted state. */
  beaconPrecision: number
  /** Last known beacon positions per member pubkey — persisted so map shows data on refresh. */
  lastPositions?: Record<string, { lat: number; lon: number; geohash: string; precision: number; timestamp: number }>
}

/** Derive the effective mode from group relay config. */
export function groupMode(group: Pick<AppGroup, 'relays'>): 'offline' | 'online' {
  return group.relays?.length > 0 ? 'online' : 'offline'
}

/** The local identity (Nostr keypair) for this device. */
export interface AppIdentity {
  pubkey: string
  privkey?: string          // hex, stored locally when no NIP-07 extension
  nsec?: string
  displayName?: string
  signerType: 'nip07' | 'local'
}

/** Persisted user preferences. */
export interface AppSettings {
  theme: 'dark' | 'light'
  pinEnabled: boolean
  autoLockMinutes: number
  /** Default Nostr relay URLs for new online groups. */
  defaultRelays: string[]
}

/** Root application state. */
export interface AppState {
  view: 'groups' | 'call-demo'
  groups: Record<string, AppGroup>
  activeGroupId: string | null
  identity: AppIdentity | null
  settings: AppSettings
}
