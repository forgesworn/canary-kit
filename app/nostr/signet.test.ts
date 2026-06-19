import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SignetSession } from 'signet-login'

const signetLoginMock = vi.hoisted(() => vi.fn())
const signetLogoutMock = vi.hoisted(() => vi.fn())

vi.mock('signet-login', () => ({
  login: signetLoginMock,
  logout: signetLogoutMock,
  restoreSession: vi.fn(),
}))

import {
  CANARY_NOSTR_CONNECT_TIMEOUT_MS,
  CANARY_NOSTR_CONNECT_PERMS,
  CANARY_SIGNET_ADVANCED_METHODS,
  CANARY_SIGNET_METHODS,
  canUseIdentitySigner,
  clearActiveSignetSession,
  getSignetSigner,
  identityFromSignetSession,
  identitySignerLabel,
  isExternalSignerIdentity,
  signInWithSignet,
  signetMethodLabel,
  logoutSignetSession,
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
  beforeEach(() => {
    clearActiveSignetSession()
    signetLoginMock.mockReset()
    signetLogoutMock.mockReset()
    signetLogoutMock.mockResolvedValue(undefined)
  })

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

  it('exposes Local Signet and Remote Signet in the Canary login picker', async () => {
    signetLoginMock.mockResolvedValue(makeSession())

    await expect(signInWithSignet({ theme: 'dark' })).resolves.toMatchObject({
      pubkey: PUBKEY,
      signerMethod: 'bunker',
    })

    expect(signetLoginMock).toHaveBeenCalledWith(expect.objectContaining({
      methods: CANARY_SIGNET_METHODS,
      advancedMethods: CANARY_SIGNET_ADVANCED_METHODS,
      relayUrl: 'wss://relay.trotters.cc',
      timeout: CANARY_NOSTR_CONNECT_TIMEOUT_MS,
      nostrConnectPerms: CANARY_NOSTR_CONNECT_PERMS,
      relayUrls: [
        'wss://relay.primal.net',
        'wss://relay.trotters.cc',
        'wss://nos.lol',
      ],
    }))
  })

  it('rejects auth-only Signet sessions because CANARY needs NIP-44 decrypt', async () => {
    const authOnly = makeSession({
      method: 'redirect',
      signer: {
        pubkey: PUBKEY,
        method: 'redirect',
        capabilities: { canSignEvents: false, hasNip44: false },
        signEvent: async () => {
          throw new Error('auth-only')
        },
        close: async () => {},
      },
    })
    signetLoginMock.mockResolvedValue(authOnly)

    await expect(signInWithSignet()).rejects.toThrow(/live signer connection.*NIP-44 invite messages/)
    expect(signetLogoutMock).toHaveBeenCalledWith(authOnly)
  })

  it('rejects Signet sessions that can sign but cannot perform NIP-44', async () => {
    const missingNip44 = makeSession({
      method: 'nip07',
      signer: {
        pubkey: PUBKEY,
        method: 'nip07',
        capabilities: { canSignEvents: true, hasNip44: false },
        signEvent: async template => ({
          id: 'd'.repeat(64),
          pubkey: PUBKEY,
          kind: template.kind,
          created_at: template.created_at ?? 1,
          tags: template.tags ?? [],
          content: template.content,
          sig: 'e'.repeat(128),
        }),
        close: async () => {},
      },
    })
    signetLoginMock.mockResolvedValue(missingNip44)

    await expect(signInWithSignet()).rejects.toThrow(/live signer connection.*NIP-44 invite messages/)
    expect(signetLogoutMock).toHaveBeenCalledWith(missingNip44)
  })

  it('clears the active Signet session on logout before future signer lookups', async () => {
    const session = makeSession()
    signetLoginMock.mockResolvedValue(session)

    const identity = await signInWithSignet()
    expect(identity).not.toBeNull()
    await expect(getSignetSigner(identity!)).resolves.toBe(session.signer)

    await logoutSignetSession()
    expect(signetLogoutMock).toHaveBeenCalledWith(session)
    await expect(getSignetSigner(identity!)).rejects.toThrow(/Signet signer is not available/)
  })
})
