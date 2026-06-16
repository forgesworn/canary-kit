// app/nostr/signer.ts — EventSigner implementations for local keypair and group-derived identity

import type { EventSigner } from 'canary-kit/sync'
import type { Identity } from 'nsec-tree/core'
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'

// ── Helpers ───────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  if (!/^[0-9a-f]*$/i.test(hex) || hex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: "${hex.slice(0, 20)}${hex.length > 20 ? '…' : ''}"`)
  }
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// ── Local Key Signer ──────────────────────────────────────────

/** Signs with a locally stored private key using nostr-tools. */
export class LocalKeySigner implements EventSigner {
  constructor(
    public readonly pubkey: string,
    private readonly privkeyHex: string,
  ) {}

  async sign(event: unknown): Promise<unknown> {
    const sk = hexToBytes(this.privkeyHex)
    return finalizeEvent(event as any, sk)
  }

  async encrypt(plaintext: string, recipientPubkey: string): Promise<string> {
    const sk = hexToBytes(this.privkeyHex)
    const ck = getConversationKey(sk, recipientPubkey)
    return nip44encrypt(plaintext, ck)
  }

  async decrypt(ciphertext: string, senderPubkey: string): Promise<string> {
    const sk = hexToBytes(this.privkeyHex)
    const ck = getConversationKey(sk, senderPubkey)
    return nip44decrypt(ciphertext, ck)
  }
}

// ── Group Signer ───────────────────────────────────────────────

/**
 * Signs Nostr events using an nsec-tree-derived group identity. Personal pubkey never appears on relays.
 *
 * Note: GroupSigner intentionally does NOT implement the full EventSigner interface
 * (which includes encrypt/decrypt). Group signing keys are for event signing only —
 * NIP-44 encryption uses the persona key or personal key, not the group signing key.
 */
export class GroupSigner {
  public readonly pubkey: string
  private readonly signingKey: Uint8Array

  constructor(groupIdentity: Identity) {
    this.signingKey = groupIdentity.privateKey
    this.pubkey = bytesToHex(groupIdentity.publicKey)
  }

  async sign(event: unknown): Promise<unknown> {
    return finalizeEvent(event as any, this.signingKey)
  }
}

// ── Signer resolution ──────────────────────────────────────────

/**
 * Resolve a local keypair signer.
 * Always uses a local keypair — Signet-backed signers are opt-in via login.
 * Generates a new keypair if no privkey is provided.
 */
export async function resolveSigner(
  identity: { pubkey: string; privkey?: string },
): Promise<{ signer: LocalKeySigner; signerType: 'local'; pubkey: string; privkey: string }> {
  if (identity.privkey && identity.pubkey) {
    return {
      signer: new LocalKeySigner(identity.pubkey, identity.privkey),
      signerType: 'local',
      pubkey: identity.pubkey,
      privkey: identity.privkey,
    }
  }

  const sk = generateSecretKey()
  const pubkey = getPublicKey(sk)
  const privkey = bytesToHex(sk)
  return {
    signer: new LocalKeySigner(pubkey, privkey),
    signerType: 'local',
    pubkey,
    privkey,
  }
}
