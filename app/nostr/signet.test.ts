import { describe, expect, it } from 'vitest'
import type { SignetSession } from 'signet-login'
import {
  canUseIdentitySigner,
  identityFromSignetSession,
  identitySignerLabel,
  isExternalSignerIdentity,
  signetMethodLabel,
} from './signet.js'
import type { AppIdentity } from '../types.js'

const PUBKEY = 'a'.repeat(64)

function makeSession(overrides: Partial<SignetSession> = {}): SignetSession {
  return {
    pubkey: PUBKEY,
    method: 'bunker',
    displayName: 'Alice',
    authEvent: {
      id: 'b'.repeat(64),
      pubkey: PUBKEY,
      kind: 21236,
      created_at: 1,
      tags: [],
      content: '',
      sig: 'c'.repeat(128),
    },
    signer: {
      pubkey: PUBKEY,
      method: 'bunker',
      capabilities: { canSignEvents: true, hasNip44: true },
      signEvent: async template => ({
        id: 'd'.repeat(64),
        pubkey: PUBKEY,
        kind: template.kind,
        created_at: template.created_at ?? 1,
        tags: template.tags ?? [],
        content: template.content,
        sig: 'e'.repeat(128),
      }),
      nip44: {
        encrypt: async (_peer, plaintext) => plaintext,
        decrypt: async (_peer, ciphertext) => ciphertext,
      },
      close: async () => {},
    },
    ...overrides,
  }
}

describe('Signet identity adapter', () => {
  it('maps a Signet session to the legacy external signer identity shape', () => {
    const identity = identityFromSignetSession(makeSession())

    expect(identity).toMatchObject({
      pubkey: PUBKEY,
      signerType: 'nip07',
      signerMethod: 'bunker',
      displayName: 'Alice',
    })
    expect(isExternalSignerIdentity(identity)).toBe(true)
    expect(canUseIdentitySigner(identity)).toBe(true)
  })

  it('preserves a mnemonic only when the pubkey matches the previous identity', () => {
    const previous: AppIdentity = {
      pubkey: PUBKEY,
      privkey: 'f'.repeat(64),
      mnemonic: 'abandon '.repeat(11).trim() + ' about',
      signerType: 'local',
    }

    expect(identityFromSignetSession(makeSession(), previous).mnemonic).toBe(previous.mnemonic)
    expect(identityFromSignetSession(makeSession({ pubkey: '1'.repeat(64) }), previous).mnemonic).toBeUndefined()
  })

  it('labels Signet-backed identities by their actual login method', () => {
    expect(signetMethodLabel('nip07')).toBe('Browser extension')
    expect(signetMethodLabel('bunker')).toBe('NIP-46 bunker')
    expect(identitySignerLabel({ pubkey: PUBKEY, signerType: 'nip07', signerMethod: 'bunker' })).toBe('Signet (NIP-46 bunker)')
  })
})
