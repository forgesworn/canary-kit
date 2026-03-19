// app/nostr/profiles.ts — Fetch and cache Nostr kind 0 profile metadata

import { getPool, waitForConnection } from './connect.js'
import { getState, update, updateGroup } from '../state.js'
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure'
import { SimplePool } from 'nostr-tools/pool'
import { decode } from 'nostr-tools/nip19'
import { dedupeRelays } from '../types.js'
import type { AppPersona } from '../types.js'
import { getPersona } from '../persona.js'

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

/** Defensively normalise a parsed kind 0 profile, coercing fields to expected types. */
function normaliseProfile(raw: unknown): NostrProfile {
  if (!raw || typeof raw !== 'object') return {}
  const r = raw as Record<string, unknown>
  return {
    ...(typeof r.name === 'string' ? { name: r.name } : {}),
    ...(typeof r.display_name === 'string' ? { display_name: r.display_name } : {}),
    ...(typeof r.picture === 'string' ? { picture: r.picture } : {}),
    ...(typeof r.about === 'string' ? { about: r.about } : {}),
    ...(typeof r.nip05 === 'string' ? { nip05: r.nip05 } : {}),
    ...(typeof r.lud16 === 'string' ? { lud16: r.lud16 } : {}),
    ...(typeof r.lud06 === 'string' ? { lud06: r.lud06 } : {}),
    ...(typeof r.website === 'string' ? { website: r.website } : {}),
    ...(typeof r.banner === 'string' ? { banner: r.banner } : {}),
  }
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
  if (!pool) { console.warn('[profiles] no pool — skipping'); return }

  // Filter to pubkeys we haven't fetched or aren't already fetching
  const now = Date.now()
  const needed = pubkeys.filter(pk => {
    if (_cache.has(pk) || _pending.has(pk)) return false
    const notFoundAt = _notFound.get(pk)
    if (notFoundAt && (now - notFoundAt) < NOT_FOUND_TTL_MS) return false
    return true
  })
  if (needed.length === 0) { console.warn('[profiles] all cached/pending — nothing to fetch'); return }

  for (const pk of needed) _pending.add(pk)

  // Get relay URLs from group or state, plus well-known fallbacks
  const groupRelays = getGroupRelays(groupId)
  const relays = [...new Set([...groupRelays, ...PROFILE_FALLBACK_RELAYS])]
  console.warn('[profiles] fetching', needed.length, 'profiles from', relays, 'for group', groupId?.slice(0, 8))
  if (relays.length === 0) {
    for (const pk of needed) _pending.delete(pk)
    return
  }

  // Subscribe to kind 0 for all needed pubkeys
  const sub = pool.subscribeMany(
    relays,
    { kinds: [0], authors: needed } as any,
    {
      onevent(event) {
        if (!verifyEvent(event)) return
        if (typeof event.content === 'string' && event.content.length > 65536) return
        try {
          const profile: NostrProfile = normaliseProfile(JSON.parse(event.content))
          console.warn('[profiles] got profile for', event.pubkey.slice(0, 8), profile.display_name || profile.name || '(no name)')
          _cache.set(event.pubkey, profile)
          _pending.delete(event.pubkey)

          // Update memberNames in the group if we got a name and it's not our own key
          const displayName = profile.display_name || profile.name
          if (displayName && groupId) {
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
        console.warn('[profiles] EOSE — found:', needed.filter(pk => _cache.has(pk)).length, 'missing:', needed.filter(pk => !_cache.has(pk)).length)
        for (const pk of needed) {
          if (!_cache.has(pk)) _notFound.set(pk, Date.now())
          _pending.delete(pk)
        }
        sub.close()
      },
    },
  )
}

/** Well-known public relays used for kind 0 profile fetch and publish. */
export const PROFILE_RELAYS = [
  'wss://purplepag.es',
  'wss://relay.damus.io',
  'wss://nos.lol',
]

/** @deprecated Use PROFILE_RELAYS. */
const PROFILE_FALLBACK_RELAYS = PROFILE_RELAYS

/**
 * Fetch the local user's own kind 0 profile and update identity state.
 * Called once after relay pool connects. Updates displayName and picture.
 * Forces a fresh fetch (ignores cache) so switching identities always works.
 * Queries both configured relays and well-known public relays.
 */
export async function fetchOwnProfile(): Promise<void> {
  // Wait for relay connections to be established before subscribing
  await waitForConnection()

  const pool = getPool()
  const { identity, settings } = getState()
  if (!pool || !identity?.pubkey) return

  const pk = identity.pubkey

  // If a group member fetch already retrieved this profile, apply it immediately
  const alreadyCached = _cache.get(pk)
  if (alreadyCached) {
    const displayName = alreadyCached.display_name || alreadyCached.name
    const picture = alreadyCached.picture
    const updates: Record<string, string> = {}
    if (displayName && identity.displayName !== displayName) updates.displayName = displayName
    if (picture && identity.picture !== picture) updates.picture = picture
    if (Object.keys(updates).length > 0) {
      update({ identity: { ...identity, ...updates } })
    }
    return
  }

  if (_pending.has(pk)) return
  // Clear cache so we always get a fresh profile after login/switch
  _cache.delete(pk)
  _notFound.delete(pk)

  _pending.add(pk)

  // Merge configured relays with well-known public relays (deduplicated)
  const configured = settings?.defaultRelays?.length ? settings.defaultRelays : []
  const relays = [...new Set([...configured, ...PROFILE_FALLBACK_RELAYS])]
  if (relays.length === 0) { _pending.delete(pk); return }

  console.warn('[profiles] fetching own kind 0 from', relays)

  const sub = pool.subscribeMany(
    relays,
    { kinds: [0], authors: [pk] } as any,
    {
      onevent(event) {
        if (!verifyEvent(event)) return
        if (typeof event.content === 'string' && event.content.length > 65536) return
        try {
          const profile: NostrProfile = normaliseProfile(JSON.parse(event.content))
          console.warn('[profiles] got own profile from relay:', profile.display_name || profile.name || '(no name)')
          _cache.set(event.pubkey, profile)
          _pending.delete(event.pubkey)

          const displayName = profile.display_name || profile.name
          const picture = profile.picture
          const { identity: current } = getState()
          if (current && current.pubkey === event.pubkey) {
            const updates: Partial<typeof current> = {}
            if (displayName && current.displayName !== displayName) {
              updates.displayName = displayName
            }
            if (picture && current.picture !== picture) {
              updates.picture = picture
            }
            if (Object.keys(updates).length > 0) {
              update({ identity: { ...current, ...updates } })
            }
          }
        } catch {
          _pending.delete(event.pubkey)
        }
      },
      oneose() {
        _pending.delete(pk)
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

// ── Kind 0 publishing ─────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

/**
 * Publish a minimal kind 0 profile event to well-known relays.
 * Fire-and-forget — does not block the UI or throw on failure.
 * Publishes to PROFILE_RELAYS + the configured write relay so other
 * members can discover the user's display name.
 *
 * Skipped for NIP-07 users (their extension manages kind 0).
 */
export function publishKind0(name: string, privkeyHex: string): void {
  // Delay slightly so relay connections can establish after bootApp()
  setTimeout(async () => {
    try {
      const pool = getPool()
      if (!pool) {
        console.warn('[profiles] no pool — skipping kind 0 publish')
        return
      }

      await waitForConnection()

      const content = JSON.stringify({ name })
      const unsigned = {
        kind: 0,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content,
      }

      const sk = hexToBytes(privkeyHex)
      const signed = finalizeEvent(unsigned, sk)

      // Publish to profile relays + configured write relays
      const { settings } = getState()
      const writeRelays = settings?.defaultWriteRelays?.length
        ? settings.defaultWriteRelays
        : (settings?.defaultRelays?.length ? settings.defaultRelays : [])
      const relays = dedupeRelays([...PROFILE_RELAYS, ...writeRelays])

      console.warn('[profiles] publishing kind 0 to', relays)
      const results = pool.publish(relays, signed as any)
      const settled = await Promise.allSettled(results)
      const ok = settled.filter(r => r.status === 'fulfilled').length
      console.warn(`[profiles] kind 0 published to ${ok}/${relays.length} relay(s)`)
    } catch (err) {
      console.warn('[profiles] kind 0 publish failed:', err)
    }
  }, 2000)
}

// ── Persona kind 0 publishing and fetching ────────────────────

/**
 * Publish a kind 0 profile event for a named persona.
 *
 * Resolves write relays in priority order:
 *   1. `persona.writeRelays` (per-persona relay list, e.g. a private relay for a burner persona)
 *   2. `settings.defaultWriteRelays` (global fallback)
 *
 * Uses the persona's derived signing key. Fire-and-forget — errors are logged
 * but not thrown. Skipped silently if persona derivation fails (e.g. personas
 * not yet initialised).
 */
export async function publishPersonaProfile(
  persona: AppPersona,
  writeRelays?: string[],
): Promise<void> {
  const { settings } = getState()
  const resolvedRelays = (writeRelays && writeRelays.length > 0)
    ? writeRelays
    : (persona.writeRelays && persona.writeRelays.length > 0)
      ? persona.writeRelays
      : (settings?.defaultWriteRelays?.length ? settings.defaultWriteRelays : [])
  if (resolvedRelays.length === 0) return

  try {
    const derived = getPersona(persona.name, persona.index)

    const content = JSON.stringify({
      name: persona.displayName ?? persona.name,
      about: persona.about ?? '',
      picture: persona.picture ?? '',
    })

    const unsigned = {
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: [] as string[][],
      content,
    }

    const signed = finalizeEvent(unsigned, derived.identity.privateKey)

    const pool = new SimplePool()
    try {
      const results = pool.publish(resolvedRelays, signed as any)
      const settled = await Promise.allSettled(results)
      const ok = settled.filter(r => r.status === 'fulfilled').length
      console.warn(`[profiles] persona "${persona.name}" kind 0 published to ${ok}/${resolvedRelays.length} relay(s)`)
    } finally {
      pool.close(resolvedRelays)
    }
  } catch (err) {
    console.warn(`[profiles] persona "${persona.name}" kind 0 publish failed:`, err)
  }
}

/**
 * Fetch kind 0 profiles for all known personas and update their displayName,
 * picture, and about fields in state.
 *
 * Resolves read relays in priority order:
 *   1. Explicit `readRelays` argument (if provided and non-empty)
 *   2. `settings.defaultReadRelays` (global fallback)
 *
 * All personas are fetched from the same relay set (80/20 simplification — per-persona
 * read relays are not supported here; use `publishPersonaProfile` for targeted writes).
 *
 * Errors are logged but not thrown.
 */
export async function fetchPersonaProfiles(readRelays?: string[]): Promise<void> {
  const { settings } = getState()
  const resolvedRelays = (readRelays && readRelays.length > 0)
    ? readRelays
    : (settings?.defaultReadRelays?.length ? settings.defaultReadRelays : [])
  if (resolvedRelays.length === 0) return

  try {
    const { personas } = getState()
    const personaList = Object.values(personas)
    if (personaList.length === 0) return

    // Decode each persona's npub to a hex pubkey, mapping to persona id
    const pubkeyToId = new Map<string, string>()
    for (const p of personaList) {
      try {
        const decoded = decode(p.npub)
        if (decoded.type === 'npub') {
          pubkeyToId.set(decoded.data as string, p.id)
        }
      } catch {
        // Skip invalid npubs
      }
    }

    if (pubkeyToId.size === 0) return

    const pubkeys = Array.from(pubkeyToId.keys())

    await new Promise<void>((resolve) => {
      const pool = new SimplePool()

      const sub = pool.subscribeMany(
        resolvedRelays,
        [{ kinds: [0], authors: pubkeys }] as any,
        {
          onevent(event) {
            if (!verifyEvent(event)) return
            if (typeof event.content === 'string' && event.content.length > 65536) return

            const personaId = pubkeyToId.get(event.pubkey)
            if (!personaId) return

            try {
              const profile: NostrProfile = normaliseProfile(JSON.parse(event.content))
              const { personas: current } = getState()
              const existing = current[personaId]
              if (!existing) return

              const updated: AppPersona = {
                ...existing,
                ...(profile.display_name || profile.name
                  ? { displayName: profile.display_name || profile.name }
                  : {}),
                ...(profile.picture ? { picture: profile.picture } : {}),
                ...(profile.about !== undefined ? { about: profile.about } : {}),
              }

              update({ personas: { ...current, [personaId]: updated } })
            } catch {
              // Malformed profile content — skip
            }
          },
          oneose() {
            sub.close()
            pool.close(resolvedRelays)
            resolve()
          },
        },
      )
    })
  } catch (err) {
    console.warn('[profiles] fetchPersonaProfiles failed:', err)
  }
}
