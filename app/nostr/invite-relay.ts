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
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'
import { hexToBytes } from 'canary-kit/crypto'
import type { RemoteInviteToken } from '../crypto/remote-invite.js'
import type { AppIdentity } from '../types.js'

const HANDSHAKE_KIND = 25519

type EventTemplate = {
  kind: number
  created_at: number
  tags: string[][]
  content: string
}

type SignedEvent = EventTemplate & {
  id: string
  pubkey: string
  sig: string
}

function getNip07Provider(): any | null {
  if (typeof window === 'undefined') return null
  return (window as any).nostr ?? null
}

async function signEvent(identity: AppIdentity, template: EventTemplate): Promise<SignedEvent> {
  if (identity.privkey) {
    return finalizeEvent(template, hexToBytes(identity.privkey)) as SignedEvent
  }

  if (identity.signerType === 'nip07') {
    const provider = getNip07Provider()
    if (typeof provider?.signEvent !== 'function') {
      throw new Error('NIP-07 signer is not available.')
    }
    const signed = await provider.signEvent(template)
    if (!signed || signed.pubkey !== identity.pubkey) {
      throw new Error('NIP-07 signer used a different public key.')
    }
    return signed as SignedEvent
  }

  throw new Error('No local key or NIP-07 signer available.')
}

async function encryptTo(identity: AppIdentity, peerPubkey: string, plaintext: string): Promise<string> {
  if (identity.privkey) {
    const convKey = getConversationKey(hexToBytes(identity.privkey), peerPubkey)
    return nip44encrypt(plaintext, convKey)
  }

  if (identity.signerType === 'nip07') {
    const provider = getNip07Provider()
    if (typeof provider?.nip44?.encrypt !== 'function') {
      throw new Error('NIP-07 extension does not support NIP-44 encryption.')
    }
    return provider.nip44.encrypt(peerPubkey, plaintext)
  }

  throw new Error('No local key or NIP-07 encryption available.')
}

async function decryptFrom(identity: AppIdentity, peerPubkey: string, ciphertext: string): Promise<string> {
  if (identity.privkey) {
    const convKey = getConversationKey(hexToBytes(identity.privkey), peerPubkey)
    return nip44decrypt(ciphertext, convKey)
  }

  if (identity.signerType === 'nip07') {
    const provider = getNip07Provider()
    if (typeof provider?.nip44?.decrypt !== 'function') {
      throw new Error('NIP-07 extension does not support NIP-44 decryption.')
    }
    return provider.nip44.decrypt(peerPubkey, ciphertext)
  }

  throw new Error('No local key or NIP-07 decryption available.')
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

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
  if (!pool || !identity?.pubkey) {
    opts.onError('No relay pool or identity available.')
    return () => {}
  }

  const { inviteId, adminPubkey, readRelays, writeRelays, onWelcome, onError } = opts
  const allRelays = Array.from(new Set([...readRelays, ...writeRelays]))
  let closed = false
  let sub: { close(): void } | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  void (async () => {
    try {
      const payload = JSON.stringify({ type: 'join-request', inviteId })
      const encrypted = await encryptTo(identity, adminPubkey, payload)
      const event = await signEvent(identity, {
        kind: HANDSHAKE_KIND,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['d', inviteId], ['p', adminPubkey]],
        content: encrypted,
      })
      if (closed) return

      Promise.allSettled(pool.publish(writeRelays, event as any)).catch(() => {})

      sub = pool.subscribeMany(
        allRelays,
        { kinds: [HANDSHAKE_KIND], '#d': [inviteId], authors: [adminPubkey] } as any,
        {
          onevent(ev) {
            if (!verifyEvent(ev)) return
            if (typeof ev.content === 'string' && ev.content.length > 65536) return
            void (async () => {
              try {
                const decrypted = await decryptFrom(identity, adminPubkey, ev.content)
                const msg = JSON.parse(decrypted)
                if (msg.type === 'welcome' && msg.inviteId === inviteId && msg.envelope) {
                  onWelcome(msg.envelope)
                  sub?.close()
                }
              } catch {
                // Not for us or malformed — ignore
              }
            })()
          },
          oneose() {
            // Keep subscription open waiting for the welcome
          },
        },
      )

      timer = setTimeout(() => {
        sub?.close()
        onError('Timed out waiting for welcome message from admin.')
      }, 120_000)
    } catch (err) {
      if (!closed) onError(errorMessage(err))
    }
  })()

  return () => {
    closed = true
    if (timer) clearTimeout(timer)
    sub?.close()
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
  if (!pool || !identity?.pubkey) {
    opts.onError('No relay pool or identity available.')
    return () => {}
  }

  const { inviteId, readRelays, writeRelays, onJoinRequest, onError } = opts
  const allRelays = Array.from(new Set([...readRelays, ...writeRelays]))

  const sub = pool.subscribeMany(
    allRelays,
    { kinds: [HANDSHAKE_KIND], '#d': [inviteId], '#p': [identity.pubkey] } as any,
    {
      onevent(ev) {
        if (!verifyEvent(ev)) return
        if (typeof ev.content === 'string' && ev.content.length > 65536) return
        void (async () => {
          try {
            const decrypted = await decryptFrom(identity, ev.pubkey, ev.content)
            const msg = JSON.parse(decrypted)
            if (msg.type === 'join-request' && msg.inviteId === inviteId) {
              onJoinRequest(ev.pubkey)
            }
          } catch {
            // Not for us or malformed — ignore
          }
        })()
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
export async function sendWelcomeOverRelay(opts: SendWelcomeOpts): Promise<void> {
  const pool = getPool()
  const { identity } = getState()
  if (!pool || !identity?.pubkey) return

  const { inviteId, joinerPubkey, envelope, writeRelays } = opts

  const payload = JSON.stringify({ type: 'welcome', inviteId, envelope })
  const encrypted = await encryptTo(identity, joinerPubkey, payload)
  const event = await signEvent(identity, {
    kind: HANDSHAKE_KIND,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['d', inviteId], ['p', joinerPubkey]],
    content: encrypted,
  })
  await Promise.allSettled(pool.publish(writeRelays, event as any))
}

// ── Relay-based invite discovery ──────────────────────────────

// Parameterised replaceable (30000+) so relays store the token for later fetch.
// Was 25520 (ephemeral) — relays discarded it before joiners could fetch.
const INVITE_PUBLISH_KIND = 35520

/**
 * Publish a seedless invite token to the relay so joiners can
 * discover it by inviteId via a short URL.
 * Content is unencrypted JSON (token is seedless, inviteId is 128-bit capability).
 */
export function publishInviteToken(opts: {
  token: RemoteInviteToken
  writeRelays: string[]
}): void {
  const pool = getPool()
  const { identity } = getState()
  if (!pool || !identity?.pubkey) return

  const { token, writeRelays } = opts
  const content = JSON.stringify(token)

  void (async () => {
    try {
      const expiration = String(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60)
      const event = await signEvent(identity, {
        kind: INVITE_PUBLISH_KIND,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['d', token.inviteId], ['expiration', expiration]],
        content,
      })
      Promise.allSettled(pool.publish(writeRelays, event as any)).catch(() => {})
    } catch (err) {
      console.warn('[canary:invite] Failed to publish invite token:', err)
    }
  })()
}

/**
 * Fetch a seedless invite token from the relay by inviteId.
 * Returns the token via onToken callback, or calls onError.
 * Returns a cleanup function to cancel the subscription.
 */
export function fetchInviteToken(opts: {
  inviteId: string
  readRelays: string[]
  onToken: (token: RemoteInviteToken) => void
  onError: (msg: string) => void
}): () => void {
  const pool = getPool()
  if (!pool) {
    opts.onError('No relay pool available.')
    return () => {}
  }

  const { inviteId, readRelays, onToken, onError } = opts
  let found = false

  const sub = pool.subscribeMany(
    readRelays,
    { kinds: [INVITE_PUBLISH_KIND], '#d': [inviteId] } as any,
    {
      onevent(ev) {
        if (!verifyEvent(ev)) return
        if (typeof ev.content === 'string' && ev.content.length > 65536) return
        if (found) return
        try {
          const token = JSON.parse(ev.content) as RemoteInviteToken
          if (token.inviteId === inviteId) {
            found = true
            onToken(token)
            sub.close()
          }
        } catch {
          // Malformed — ignore
        }
      },
      oneose() {
        if (!found) {
          sub.close()
          onError('Invite not found on relay — it may have expired.')
        }
      },
    },
  )

  // Timeout after 15 seconds
  const timer = setTimeout(() => {
    if (!found) {
      sub.close()
      onError('Timed out looking for invite on relay.')
    }
  }, 15_000)

  return () => {
    clearTimeout(timer)
    sub.close()
  }
}
