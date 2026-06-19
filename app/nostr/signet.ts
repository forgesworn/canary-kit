// app/nostr/signet.ts — Signet Login session adapter for external Nostr signers

import {
  login as signetLogin,
  logout as signetLogout,
  restoreSession as restoreSignetLoginSession,
} from 'signet-login'
import type {
  EventTemplate,
  LoginMethod,
  LoginPickerMethod,
  NostrEvent,
  NostrConnectStatusHandler,
  SignetSession,
  SignetSigner,
} from 'signet-login'
import type { AppIdentity, SignetLoginMethod } from '../types.js'
import { DEFAULT_WRITE_RELAY } from '../types.js'

export const SIGNET_APP_NAME = 'CANARY'
const CANARY_SIGNER_METHODS: LoginPickerMethod[] = ['local-signet', 'remote-signet', 'nip07', 'bunker', 'nostrconnect', 'nsec']
const CANARY_ADVANCED_SIGNER_METHODS: LoginPickerMethod[] = ['bunker', 'nsec']
const CANARY_NOSTR_CONNECT_PERMS = ['sign_event', 'nip44_encrypt', 'nip44_decrypt']
export const CANARY_NOSTR_CONNECT_TIMEOUT_MS = 120_000
const CANARY_NOSTR_CONNECT_RELAYS = [
  'wss://relay.primal.net',
  DEFAULT_WRITE_RELAY,
  'wss://nos.lol',
]

let _activeSession: SignetSession | null = null

type CanarySignetTestWindow = Window & {
  __CANARY_SIGNET_TEST_RELAYS__?: unknown
}

export interface SignetLoginRequest {
  preferredMethod?: LoginPickerMethod
  theme?: 'light' | 'dark' | 'auto'
  displayNameFallback?: string
  onNostrConnectStatus?: NostrConnectStatusHandler
}

export interface SignetSignerRequest {
  interactive?: boolean
  theme?: 'light' | 'dark' | 'auto'
}

function isUsableCanarySigner(signer: SignetSigner): boolean {
  return signer.capabilities.canSignEvents && signer.capabilities.hasNip44 && !!signer.nip44
}

export function getSignetNostrConnectRelays(): string[] {
  if (typeof window === 'undefined') return [...CANARY_NOSTR_CONNECT_RELAYS]
  const override = (window as CanarySignetTestWindow).__CANARY_SIGNET_TEST_RELAYS__
  if (!Array.isArray(override)) return [...CANARY_NOSTR_CONNECT_RELAYS]
  const relays = override.filter((relay): relay is string => typeof relay === 'string' && /^wss?:\/\//.test(relay))
  return relays.length > 0 ? relays : [...CANARY_NOSTR_CONNECT_RELAYS]
}

function signerCapabilityError(method?: string): Error {
  const label = method ? signetMethodLabel(method as SignetLoginMethod) : 'Signet'
  return new Error(
    `${label} proved your identity, but CANARY also needs a live signer connection to sign events and decrypt NIP-44 invite messages. ` +
    'Keep Signet open on its signing screen and try again, or choose Browser extension, Connect a Nostr signer, or Paste bunker URI.',
  )
}

function methodForReconnect(identity: AppIdentity): LoginPickerMethod | undefined {
  if (!identity.signerMethod || identity.signerMethod === 'redirect') return 'nip07'
  if (identity.signerMethod === 'amber') return 'nip07'
  return identity.signerMethod as LoginMethod
}

export function isExternalSignerIdentity(identity: AppIdentity | null | undefined): identity is AppIdentity {
  return !!identity?.pubkey && !identity.privkey && identity.signerType === 'nip07'
}

export function canUseIdentitySigner(identity: AppIdentity | null | undefined): boolean {
  return !!identity?.privkey || isExternalSignerIdentity(identity)
}

export function signetMethodLabel(method: SignetLoginMethod | LoginMethod | undefined): string {
  switch (method) {
    case 'nip07': return 'Browser extension'
    case 'bunker': return 'NIP-46 bunker'
    case 'redirect': return 'Signet'
    case 'amber': return 'Amber'
    case 'nsec': return 'nsec'
    default: return 'Signet'
  }
}

export function identitySignerLabel(identity: AppIdentity | null | undefined): string {
  if (!identity) return 'None'
  if (identity.privkey || identity.signerType === 'local') return 'Local key'
  return `Signet (${signetMethodLabel(identity.signerMethod)})`
}

export function identityFromSignetSession(
  session: SignetSession,
  previousIdentity?: AppIdentity | null,
  displayNameFallback = 'You',
): AppIdentity {
  const next: AppIdentity = {
    pubkey: session.pubkey,
    signerType: 'nip07',
    signerMethod: session.method as SignetLoginMethod,
    displayName: session.displayName ?? previousIdentity?.displayName ?? displayNameFallback,
  }
  if (previousIdentity?.pubkey === next.pubkey && previousIdentity.mnemonic) {
    return { ...next, mnemonic: previousIdentity.mnemonic }
  }
  return next
}

export async function signInWithSignet(options: SignetLoginRequest = {}): Promise<AppIdentity | null> {
  const session = await signetLogin({
    appName: SIGNET_APP_NAME,
    relayUrl: DEFAULT_WRITE_RELAY,
    theme: options.theme ?? 'auto',
    timeout: CANARY_NOSTR_CONNECT_TIMEOUT_MS,
    preferredMethod: options.preferredMethod,
    methods: CANARY_SIGNER_METHODS,
    advancedMethods: CANARY_ADVANCED_SIGNER_METHODS,
    relayUrls: getSignetNostrConnectRelays(),
    nostrConnectPerms: CANARY_NOSTR_CONNECT_PERMS,
    onNostrConnectStatus: options.onNostrConnectStatus,
  })
  if (!session) return null

  if (!isUsableCanarySigner(session.signer)) {
    await signetLogout(session).catch(() => {})
    throw signerCapabilityError(session.method)
  }

  _activeSession = session
  return identityFromSignetSession(session, null, options.displayNameFallback)
}

export async function restoreSignetSession(): Promise<SignetSession | null> {
  if (_activeSession) return _activeSession
  try {
    _activeSession = await restoreSignetLoginSession({ defaultRelay: DEFAULT_WRITE_RELAY })
    return _activeSession
  } catch (err) {
    console.warn('[canary:signet] session restore failed:', err)
    _activeSession = null
    return null
  }
}

export function clearActiveSignetSession(): void {
  _activeSession = null
}

export async function logoutSignetSession(): Promise<void> {
  const session = _activeSession
  _activeSession = null
  await signetLogout(session ?? undefined).catch(() => {})
}

export async function getSignetSigner(
  identity: AppIdentity,
  options: SignetSignerRequest = {},
): Promise<SignetSigner> {
  if (!isExternalSignerIdentity(identity)) {
    throw new Error('Signet signer requested for a local identity.')
  }

  const restored = await restoreSignetSession()
  if (restored?.pubkey === identity.pubkey && isUsableCanarySigner(restored.signer)) {
    return restored.signer
  }

  if (!options.interactive) {
    throw new Error('Signet signer is not available. Sign in with Signet again.')
  }

  const nextIdentity = await signInWithSignet({
    preferredMethod: methodForReconnect(identity),
    theme: options.theme,
    displayNameFallback: identity.displayName,
  })
  if (!nextIdentity || !_activeSession) {
    throw new Error('Signet login was cancelled.')
  }
  if (nextIdentity.pubkey !== identity.pubkey) {
    await logoutSignetSession()
    throw new Error('Signet returned a different public key. Switch back to the original account and try again.')
  }
  return _activeSession.signer
}

export async function signEventWithSignet(
  identity: AppIdentity,
  template: EventTemplate,
  options: SignetSignerRequest = {},
): Promise<NostrEvent> {
  const signer = await getSignetSigner(identity, options)
  const signed = await signer.signEvent(template)
  if (signed.pubkey !== identity.pubkey) {
    throw new Error('Signet signer used a different public key.')
  }
  return signed
}

export async function encryptWithSignet(
  identity: AppIdentity,
  peerPubkey: string,
  plaintext: string,
  options: SignetSignerRequest = {},
): Promise<string> {
  const signer = await getSignetSigner(identity, options)
  if (!signer.nip44) throw signerCapabilityError(signer.method)
  return signer.nip44.encrypt(peerPubkey, plaintext)
}

export async function decryptWithSignet(
  identity: AppIdentity,
  peerPubkey: string,
  ciphertext: string,
  options: SignetSignerRequest = {},
): Promise<string> {
  const signer = await getSignetSigner(identity, options)
  if (!signer.nip44) throw signerCapabilityError(signer.method)
  return signer.nip44.decrypt(peerPubkey, ciphertext)
}
