// app/nostr/signer.ts — EventSigner implementations: NIP-07 and local keypair

import type { EventSigner } from 'canary-kit/sync'
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'

// ── Helpers ───────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// ── NIP-07 Signer ──────────────────────────────────────────────

/** Delegates signing and encryption to a NIP-07 browser extension (Alby, nos2x). */
export class Nip07Signer implements EventSigner {
  constructor(public readonly pubkey: string) {}

  async sign(event: unknown): Promise<unknown> {
    return (window as any).nostr.signEvent(event)
  }

  async encrypt(plaintext: string, recipientPubkey: string): Promise<string> {
    return (window as any).nostr.nip44.encrypt(recipientPubkey, plaintext)
  }

  async decrypt(ciphertext: string, senderPubkey: string): Promise<string> {
    return (window as any).nostr.nip44.decrypt(senderPubkey, ciphertext)
  }
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

// ── Signer resolution ──────────────────────────────────────────

/** Check if a NIP-07 extension is available. */
export function hasNip07(): boolean {
  return typeof (window as any).nostr?.signEvent === 'function'
}

/**
 * Resolve the best available signer.
 * Tries NIP-07 first (browser extension), falls back to local keypair.
 * Generates a new keypair if no privkey is provided and NIP-07 is unavailable.
 */
export async function resolveSigner(
  identity: { pubkey: string; privkey?: string },
): Promise<{ signer: EventSigner; signerType: 'nip07' | 'local'; pubkey: string; privkey?: string }> {
  // Try NIP-07 first
  if (hasNip07()) {
    try {
      const nip07Pubkey = await (window as any).nostr.getPublicKey()
      return { signer: new Nip07Signer(nip07Pubkey), signerType: 'nip07', pubkey: nip07Pubkey }
    } catch {
      // Extension present but failed — fall through to local
    }
  }

  // Fall back to local keypair
  if (identity.privkey) {
    return {
      signer: new LocalKeySigner(identity.pubkey, identity.privkey),
      signerType: 'local',
      pubkey: identity.pubkey,
      privkey: identity.privkey,
    }
  }

  // Generate new keypair
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
