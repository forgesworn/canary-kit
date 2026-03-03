// app/types.ts — App-specific types extending the SDK's GroupState

import type { GroupState } from 'canary-kit'

/** A CANARY group with UI-specific persistence fields layered on top of GroupState. */
export interface AppGroup extends GroupState {
  /** Unique local identifier, generated with crypto.randomUUID(). */
  id: string
  /** Whether Nostr relay publishing is enabled for this group. */
  nostrEnabled: boolean
  /** List of Nostr relay WebSocket URLs for this group. */
  relays: string[]
  /** Preferred output encoding for token display. */
  encodingFormat: 'words' | 'pin' | 'hex'
  /** Nonces of invites that have already been consumed. */
  usedInvites: string[]
  /** Dead man's switch check-in interval in seconds. */
  livenessInterval: number
  /** Last check-in unix timestamp per member pubkey. */
  livenessCheckins: Record<string, number>
}

/** The local identity (Nostr keypair) for this device. */
export interface AppIdentity {
  pubkey: string
  nsec?: string
  displayName?: string
}

/** Persisted user preferences. */
export interface AppSettings {
  theme: 'dark' | 'light'
  pinEnabled: boolean
  autoLockMinutes: number
}

/** Root application state. */
export interface AppState {
  view: 'groups' | 'call-demo'
  groups: Record<string, AppGroup>
  activeGroupId: string | null
  identity: AppIdentity | null
  settings: AppSettings
}
