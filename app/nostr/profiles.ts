// app/nostr/profiles.ts — Fetch and cache Nostr kind 0 profile metadata

import { getPool } from './connect.js'
import { getState, updateGroup } from '../state.js'

export interface NostrProfile {
  name?: string
  display_name?: string
  picture?: string
  about?: string
  nip05?: string
  lud16?: string
  lud06?: string
  website?: string
  banner?: string
}

/** In-memory cache: pubkey → profile. Survives re-renders but not page reload. */
const _cache = new Map<string, NostrProfile>()

/** Pubkeys that returned no profile — retry after 60s. */
const _notFound = new Map<string, number>()
const NOT_FOUND_TTL_MS = 60_000

/** Pubkeys currently being fetched (dedup in-flight requests). */
const _pending = new Set<string>()

/**
 * Get a cached display name for a pubkey, or undefined if not yet fetched.
 * Call `fetchProfiles` to populate the cache for a set of pubkeys.
 */
export function getCachedName(pubkey: string): string | undefined {
  const profile = _cache.get(pubkey)
  if (!profile) return undefined
  return profile.display_name || profile.name || undefined
}

/** Get the full cached profile for a pubkey, or undefined if not yet fetched. */
export function getCachedProfile(pubkey: string): NostrProfile | undefined {
  return _cache.get(pubkey)
}

/**
 * Fetch kind 0 profiles for the given pubkeys from connected relays.
 * Results are cached in memory and also written to group memberNames.
 * No-ops if no relay pool is available.
 */
export function fetchProfiles(pubkeys: string[], groupId?: string): void {
  const pool = getPool()
  if (!pool) return

  // Filter to pubkeys we haven't fetched or aren't already fetching
  const now = Date.now()
  const needed = pubkeys.filter(pk => {
    if (_cache.has(pk) || _pending.has(pk)) return false
    const notFoundAt = _notFound.get(pk)
    if (notFoundAt && (now - notFoundAt) < NOT_FOUND_TTL_MS) return false
    return true
  })
  if (needed.length === 0) return

  const { identity } = getState()
  const selfPubkey = identity?.pubkey

  for (const pk of needed) _pending.add(pk)

  // Get relay URLs from group or state
  const relays = getGroupRelays(groupId)
  if (relays.length === 0) {
    for (const pk of needed) _pending.delete(pk)
    return
  }

  // Subscribe to kind 0 for all needed pubkeys
  const sub = pool.subscribeMany(
    relays,
    [{ kinds: [0], authors: needed }],
    {
      onevent(event) {
        try {
          const profile: NostrProfile = JSON.parse(event.content)
          _cache.set(event.pubkey, profile)
          _pending.delete(event.pubkey)

          // Update memberNames in the group if we got a name and it's not our own key
          const displayName = profile.display_name || profile.name
          if (displayName && event.pubkey !== selfPubkey && groupId) {
            const group = getState().groups[groupId]
            if (group && group.memberNames?.[event.pubkey] !== displayName) {
              updateGroup(groupId, {
                memberNames: { ...group.memberNames, [event.pubkey]: displayName },
              })
            }
          }
        } catch {
          _notFound.set(event.pubkey, Date.now())
          _pending.delete(event.pubkey)
        }
      },
      oneose() {
        for (const pk of needed) {
          if (!_cache.has(pk)) _notFound.set(pk, Date.now())
          _pending.delete(pk)
        }
        sub.close()
      },
    },
  )
}

function getGroupRelays(groupId?: string): string[] {
  if (groupId) {
    const group = getState().groups[groupId]
    if (group?.relays?.length) return group.relays
  }
  // Fallback to default relay
  const settings = getState().settings
  return settings?.defaultRelays?.length ? settings.defaultRelays : []
}
