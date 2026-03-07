// app/nostr/invite-relay.ts — Relay-based invite handshake for in-person QR flow
//
// After the joiner scans the admin's QR code, the remaining two messages of
// the 3-message handshake are exchanged automatically over the relay:
//
//   1. [QR]   Admin → Joiner:  seedless invite token (already done via QR)
//   2. [Relay] Joiner → Admin: join request (NIP-44 encrypted pubkey)
//   3. [Relay] Admin → Joiner: welcome envelope (NIP-44 encrypted group state)
//
// Uses kind 25519 events with a `d` tag set to the inviteId for filtering.

import { getPool } from './connect.js'
import { getState } from '../state.js'
import { finalizeEvent } from 'nostr-tools/pure'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'
import { hexToBytes } from 'canary-kit/crypto'

const HANDSHAKE_KIND = 25519

// ── Joiner side ────────────────────────────────────────────────

export interface JoinRequestOpts {
  inviteId: string
  adminPubkey: string
  /** Read relays for subscribing to the welcome response. */
  readRelays: string[]
  /** Write relays for publishing the join request. */
  writeRelays: string[]
  /** @deprecated Use readRelays/writeRelays. Kept for compat. */
  relays?: string[]
  /** Called when the welcome envelope arrives (NIP-44 ciphertext). */
  onWelcome: (envelope: string) => void
  /** Called on error. */
  onError: (err: string) => void
}

/**
 * Publish a join request and subscribe for the welcome response.
 * Returns a cleanup function to unsubscribe.
 */
export function sendJoinRequest(opts: JoinRequestOpts): () => void {
  const pool = getPool()
  const { identity } = getState()
  if (!pool || !identity?.pubkey || !identity?.privkey) {
    opts.onError('No relay pool or identity available.')
    return () => {}
  }

  const { inviteId, adminPubkey, readRelays, writeRelays, onWelcome, onError } = opts
  const joinerPrivkey = identity.privkey
  const joinerPubkey = identity.pubkey

  // Combine read + write for subscription coverage
  const allRelays = Array.from(new Set([...readRelays, ...writeRelays]))

  // Encrypt join request to admin
  const convKey = getConversationKey(hexToBytes(joinerPrivkey), adminPubkey)
  const payload = JSON.stringify({ type: 'join-request', inviteId })
  const encrypted = nip44encrypt(payload, convKey)

  // Publish join request event
  const event = finalizeEvent({
    kind: HANDSHAKE_KIND,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['d', inviteId], ['p', adminPubkey]],
    content: encrypted,
  }, hexToBytes(joinerPrivkey))

  // Publish to write relays only
  Promise.allSettled(pool.publish(writeRelays, event as any)).catch(() => {})

  // Subscribe for welcome response on all relays
  const sub = pool.subscribeMany(
    allRelays,
    { kinds: [HANDSHAKE_KIND], '#d': [inviteId], authors: [adminPubkey] } as any,
    {
      onevent(ev) {
        try {
          const decrypted = nip44decrypt(ev.content, convKey)
          const msg = JSON.parse(decrypted)
          if (msg.type === 'welcome' && msg.inviteId === inviteId && msg.envelope) {
            onWelcome(msg.envelope)
            sub.close()
          }
        } catch {
          // Not for us or malformed — ignore
        }
      },
      oneose() {
        // Keep subscription open waiting for the welcome
      },
    },
  )

  // Auto-timeout after 2 minutes
  const timer = setTimeout(() => {
    sub.close()
    onError('Timed out waiting for welcome message from admin.')
  }, 120_000)

  return () => {
    clearTimeout(timer)
    sub.close()
  }
}

// ── Admin side ────────────────────────────────────────────────

export interface ListenForJoinOpts {
  inviteId: string
  /** Read relays for subscribing to join requests. */
  readRelays: string[]
  /** Write relays for publishing (used by sendWelcomeOverRelay). */
  writeRelays: string[]
  /** @deprecated Use readRelays/writeRelays. Kept for compat. */
  relays?: string[]
  /** Called when a join request arrives with the joiner's pubkey. */
  onJoinRequest: (joinerPubkey: string) => void
  /** Called on error. */
  onError: (err: string) => void
}

/**
 * Subscribe for incoming join requests for the given inviteId.
 * Returns a cleanup function to unsubscribe.
 */
export function listenForJoinRequests(opts: ListenForJoinOpts): () => void {
  const pool = getPool()
  const { identity } = getState()
  if (!pool || !identity?.pubkey || !identity?.privkey) {
    opts.onError('No relay pool or identity available.')
    return () => {}
  }

  const { inviteId, readRelays, writeRelays, onJoinRequest, onError } = opts
  const adminPrivkey = identity.privkey

  // Subscribe on all relays (read + write) for full coverage
  const allRelays = Array.from(new Set([...readRelays, ...writeRelays]))

  const sub = pool.subscribeMany(
    allRelays,
    { kinds: [HANDSHAKE_KIND], '#d': [inviteId], '#p': [identity.pubkey] } as any,
    {
      onevent(ev) {
        try {
          const convKey = getConversationKey(hexToBytes(adminPrivkey), ev.pubkey)
          const decrypted = nip44decrypt(ev.content, convKey)
          const msg = JSON.parse(decrypted)
          if (msg.type === 'join-request' && msg.inviteId === inviteId) {
            onJoinRequest(ev.pubkey)
          }
        } catch {
          // Not for us or malformed — ignore
        }
      },
      oneose() {
        // Keep subscription open
      },
    },
  )

  // Auto-timeout after 5 minutes
  const timer = setTimeout(() => {
    sub.close()
    onError('Timed out waiting for join request.')
  }, 300_000)

  return () => {
    clearTimeout(timer)
    sub.close()
  }
}

export interface SendWelcomeOpts {
  inviteId: string
  joinerPubkey: string
  envelope: string  // NIP-44 encrypted welcome payload
  /** Write relays for publishing the welcome event. */
  writeRelays: string[]
  /** @deprecated Use writeRelays. Kept for compat. */
  relays?: string[]
}

/**
 * Publish the welcome envelope to the relay for the joiner to pick up.
 */
export function sendWelcomeOverRelay(opts: SendWelcomeOpts): void {
  const pool = getPool()
  const { identity } = getState()
  if (!pool || !identity?.privkey) return

  const { inviteId, joinerPubkey, envelope, writeRelays } = opts

  const convKey = getConversationKey(hexToBytes(identity.privkey), joinerPubkey)
  const payload = JSON.stringify({ type: 'welcome', inviteId, envelope })
  const encrypted = nip44encrypt(payload, convKey)

  const event = finalizeEvent({
    kind: HANDSHAKE_KIND,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['d', inviteId], ['p', joinerPubkey]],
    content: encrypted,
  }, hexToBytes(identity.privkey))

  Promise.allSettled(pool.publish(writeRelays, event as any)).catch(() => {})
}
