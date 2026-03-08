// app/invite.ts — Invite creation and acceptance for CANARY groups

import { sha256, hmacSha256, bytesToHex, hexToBytes } from 'canary-kit/crypto'
import { getWord } from 'canary-kit/wordlist'
import { deriveToken } from 'canary-kit/token'
import type { TokenEncoding } from 'canary-kit/encoding'
import { PROTOCOL_VERSION } from 'canary-kit/sync'
import { schnorr } from '@noble/curves/secp256k1.js'
import { getState, updateGroup } from './state.js'
import type { AppGroup } from './types.js'
import { jsonToBase64, base64ToJson, jsonToBase64url } from './utils/base64.js'

/** Allow wss:// relays, plus ws:// only for localhost development. */
function isAllowedRelayUrl(url: string): boolean {
  if (url.startsWith('wss://')) return true
  if (url.startsWith('ws://')) {
    try {
      const parsed = new URL(url)
      return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '[::1]'
    } catch { return false }
  }
  return false
}

// ── Types ──────────────────────────────────────────────────────

/** Serialisable invite payload passed between devices. */
export interface InvitePayload {
  /** Shared group identifier — both inviter and receiver use this so relay sync works. */
  groupId: string
  seed: string
  groupName: string
  rotationInterval: number
  wordCount: 1 | 2 | 3
  wordlist: string
  counter: number
  usageOffset: number
  /** Random 16-byte hex nonce — prevents replay attacks. */
  nonce: string
  beaconInterval: number
  beaconPrecision: number
  members: string[]
  /** Relay URLs so the receiver can sync immediately. */
  relays: string[]
  /** Encoding format preference. */
  encodingFormat: 'words' | 'pin' | 'hex'
  /** Tolerance window. */
  tolerance: number
  /** Invite creation time (unix seconds). */
  issuedAt: number
  /** Invite expiry time (unix seconds). */
  expiresAt: number
  /** Monotonic epoch at invite creation. */
  epoch: number
  /** Admin pubkeys at invite creation. */
  admins: string[]
  /** Protocol version at invite creation. */
  protocolVersion: number
  /** Pubkey of the admin who created this invite. */
  inviterPubkey: string
  /** Schnorr signature over SHA-256(canonicalPayload) — proves the inviter controls the admin private key. */
  inviterSig: string
  /** Display names for members — not signed, advisory only. */
  memberNames?: Record<string, string>
}

// ── Helpers ────────────────────────────────────────────────────

const HEX_64_RE = /^[0-9a-f]{64}$/
const HEX_128_RE = /^[0-9a-f]{128}$/
const HEX_32_RE = /^[0-9a-f]{32}$/
const INVITE_MAX_AGE_SEC = 7 * 24 * 60 * 60
const MAX_CLOCK_SKEW_SEC = 300

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

/**
 * Generate a 16-byte cryptographically random nonce as a hex string.
 */
function randomNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** @internal Exported for contract testing — not part of the public API. */
export function assertInvitePayload(raw: unknown): asserts raw is InvitePayload {
  const data = raw as Record<string, unknown>
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid invite payload — expected an object.')
  }

  if (typeof data.groupId !== 'string' || data.groupId.length === 0) {
    throw new Error('Invalid invite payload — groupId is required.')
  }
  if (typeof data.seed !== 'string' || !HEX_64_RE.test(data.seed)) {
    throw new Error('Invalid invite payload — seed must be 64-char hex.')
  }
  if (typeof data.groupName !== 'string' || data.groupName.trim().length === 0) {
    throw new Error('Invalid invite payload — groupName is required.')
  }
  if (!Number.isInteger(data.rotationInterval) || (data.rotationInterval as number) <= 0) {
    throw new Error('Invalid invite payload — rotationInterval must be > 0.')
  }
  if (data.wordCount !== 1 && data.wordCount !== 2 && data.wordCount !== 3) {
    throw new Error('Invalid invite payload — wordCount must be 1, 2, or 3.')
  }
  if (typeof data.wordlist !== 'string' || data.wordlist.length === 0) {
    throw new Error('Invalid invite payload — wordlist is required.')
  }
  if (!isNonNegativeInt(data.counter) || !isNonNegativeInt(data.usageOffset)) {
    throw new Error('Invalid invite payload — counter and usageOffset must be non-negative integers.')
  }
  if (typeof data.nonce !== 'string' || !HEX_32_RE.test(data.nonce)) {
    throw new Error('Invalid invite payload — nonce must be 32-char hex.')
  }
  if (!Number.isInteger(data.beaconInterval) || (data.beaconInterval as number) <= 0) {
    throw new Error('Invalid invite payload — beaconInterval must be > 0.')
  }
  if (!Number.isInteger(data.beaconPrecision) || (data.beaconPrecision as number) < 1 || (data.beaconPrecision as number) > 11) {
    throw new Error('Invalid invite payload — beaconPrecision must be 1..11.')
  }
  if (!Array.isArray(data.members) || !data.members.every((m) => typeof m === 'string' && HEX_64_RE.test(m))) {
    throw new Error('Invalid invite payload — members must be 64-char hex pubkeys.')
  }
  if (!Array.isArray(data.relays) || !data.relays.every((r) => typeof r === 'string' && isAllowedRelayUrl(r))) {
    throw new Error('Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).')
  }
  if (data.encodingFormat !== 'words' && data.encodingFormat !== 'pin' && data.encodingFormat !== 'hex') {
    throw new Error('Invalid invite payload — encodingFormat must be words|pin|hex.')
  }
  if (!isNonNegativeInt(data.tolerance)) {
    throw new Error('Invalid invite payload — tolerance must be a non-negative integer.')
  }
  if ((data.tolerance as number) > 10) {
    throw new Error('Invalid invite payload — tolerance must be <= 10.')
  }
  if (!isNonNegativeInt(data.issuedAt) || !isNonNegativeInt(data.expiresAt)) {
    throw new Error('Invalid invite payload — issuedAt/expiresAt must be unix seconds.')
  }
  if ((data.expiresAt as number) <= (data.issuedAt as number)) {
    throw new Error('Invalid invite payload — expiresAt must be after issuedAt.')
  }
  if (!isNonNegativeInt(data.epoch)) {
    throw new Error('Invalid invite payload — epoch must be a non-negative integer.')
  }
  if (!Array.isArray(data.admins) || !data.admins.every((a) => typeof a === 'string' && HEX_64_RE.test(a))) {
    throw new Error('Invalid invite payload — admins must be 64-char hex pubkeys.')
  }
  // Enforce admins ⊆ members
  const memberSet = new Set(data.members as string[])
  if (!(data.admins as string[]).every((a) => memberSet.has(a))) {
    throw new Error('Invalid invite payload — all admins must be in members.')
  }
  if (data.protocolVersion === undefined || data.protocolVersion === null) {
    throw new Error('Invalid invite payload — protocolVersion is required.')
  }
  if (data.protocolVersion !== PROTOCOL_VERSION) {
    throw new Error(`Unsupported invite protocol version: ${data.protocolVersion} (expected: ${PROTOCOL_VERSION})`)
  }
  if (typeof data.inviterPubkey !== 'string' || !HEX_64_RE.test(data.inviterPubkey)) {
    throw new Error('Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.')
  }
  // Inviter must be in the admins list
  if (!(data.admins as string[]).includes(data.inviterPubkey as string)) {
    throw new Error('Invalid invite payload — inviterPubkey must be in admins.')
  }
  if (typeof data.inviterSig !== 'string' || !HEX_128_RE.test(data.inviterSig)) {
    throw new Error('Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.')
  }
}

/**
 * Compute the canonical bytes for invite signing/verification.
 * Excludes inviterSig (the field being computed) but includes all other fields.
 * Keys are sorted for deterministic output.
 */
/** @internal Exported for contract testing — not part of the public API. */
export function inviteCanonicalBytes(payload: InvitePayload): Uint8Array {
  // Exclude inviterSig (being verified), memberNames (advisory), and relays
  // (stripped by binary QR format) to ensure transport-agnostic signatures.
  const { inviterSig: _sig, memberNames: _names, relays: _relays, ...rest } = payload
  const sorted = Object.keys(rest).sort().reduce((acc, key) => {
    acc[key] = (rest as Record<string, unknown>)[key]
    return acc
  }, {} as Record<string, unknown>)
  return new TextEncoder().encode(JSON.stringify(sorted))
}

/**
 * Sign the invite payload with the inviter's Schnorr private key.
 * Proves the invite was created by someone who controls the admin private key,
 * not merely someone who knows the group seed.
 */
/** @internal Exported for contract testing — not part of the public API. */
export function signInvite(payload: InvitePayload, privkey: string): string {
  const canonical = inviteCanonicalBytes(payload)
  const hash = sha256(canonical)
  return bytesToHex(schnorr.sign(hash, hexToBytes(privkey)))
}

/**
 * Verify the invite signature against the claimed inviter pubkey.
 */
/** @internal Exported for contract testing — not part of the public API. */
export function verifyInviteSig(payload: InvitePayload): boolean {
  const canonical = inviteCanonicalBytes(payload)
  const hash = sha256(canonical)
  return schnorr.verify(hexToBytes(payload.inviterSig), hash, hexToBytes(payload.inviterPubkey))
}

/**
 * Derive a 3-word confirmation code that authenticates the full invite payload.
 *
 * Computes HMAC-SHA256 over the canonical payload content (all fields except nonce),
 * keyed by the nonce. This means any modification to the payload fields invalidates
 * the code, even if the nonce is unchanged.
 *
 * Returns 3 words from the en-v1 wordlist, hyphen-separated (e.g. "apple-river-castle").
 * Uses 33 bits of MAC output (3 × 11-bit word indices).
 */
/** @internal Exported for contract testing — not part of the public API. */
export function confirmCodeFromPayload(payload: InvitePayload): string {
  // Exclude nonce (used as HMAC key), relays, and memberNames from the hash.
  // relays and memberNames are stripped by the binary QR format, so the confirm
  // code must be transport-agnostic to match across JSON and binary invites.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { nonce, relays: _r, memberNames: _mn, ...rest } = payload
  const data = JSON.stringify(rest)
  const encoder = new TextEncoder()
  const mac = hmacSha256(hexToBytes(nonce), encoder.encode(data))
  // Extract 33 bits (3 × 11-bit word indices) from the HMAC
  const bits = (mac[0] << 25) | (mac[1] << 17) | (mac[2] << 9) | (mac[3] << 1) | (mac[4] >> 7)
  const w1 = (bits >>> 22) & 0x7ff
  const w2 = (bits >>> 11) & 0x7ff
  const w3 = bits & 0x7ff
  return `${getWord(w1)} ${getWord(w2)} ${getWord(w3)}`
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Create an invite for the given group.
 *
 * Produces a base64-encoded JSON payload containing all the group
 * parameters needed for a new member to join, plus a random nonce
 * to prevent replay attacks.
 *
 * @returns `payload` — base64 invite string to share with the new member.
 * @returns `confirmCode` — 3 space-separated words (e.g. "apple river castle") to read aloud for out-of-band confirmation.
 */
export function createInvite(group: AppGroup): { payload: string; confirmCode: string } {
  // Only admins can create invites
  const { identity } = getState()
  if (!identity?.pubkey || !identity?.privkey) {
    throw new Error('No local identity — cannot create invite.')
  }
  if (!group.admins.includes(identity.pubkey)) {
    throw new Error(`Not authorised — you are not an admin of "${group.name}".`)
  }

  const nonce = randomNonce()
  const issuedAt = Math.floor(Date.now() / 1000)

  const invitePayload: InvitePayload = {
    groupId: group.id,
    seed: group.seed,
    groupName: group.name,
    rotationInterval: group.rotationInterval,
    wordCount: group.wordCount,
    wordlist: group.wordlist,
    counter: group.counter,
    usageOffset: group.usageOffset,
    nonce,
    beaconInterval: group.beaconInterval,
    beaconPrecision: group.beaconPrecision,
    members: [...group.members],
    relays: [...(group.writeRelays ?? group.relays ?? [])],
    encodingFormat: group.encodingFormat ?? 'words',
    tolerance: group.tolerance ?? 1,
    issuedAt,
    expiresAt: issuedAt + INVITE_MAX_AGE_SEC,
    epoch: group.epoch ?? 0,
    admins: [...(group.admins ?? [])],
    protocolVersion: PROTOCOL_VERSION,
    inviterPubkey: identity.pubkey,
    inviterSig: '', // placeholder — computed below
    memberNames: { ...group.memberNames },
  }

  invitePayload.inviterSig = signInvite(invitePayload, identity.privkey)

  const payload = jsonToBase64(invitePayload)
  const confirmCode = confirmCodeFromPayload(invitePayload)

  return { payload, confirmCode }
}

/**
 * Create an invite and return the raw payload + confirmation code.
 * Used by the QR path which binary-packs the payload instead of JSON-encoding it.
 */
export function createInviteRaw(group: AppGroup): { payload: InvitePayload; confirmCode: string } {
  const { identity } = getState()
  if (!identity?.pubkey || !identity?.privkey) {
    throw new Error('No local identity — cannot create invite.')
  }
  if (!group.admins.includes(identity.pubkey)) {
    throw new Error(`Not authorised — you are not an admin of "${group.name}".`)
  }

  const nonce = randomNonce()
  const issuedAt = Math.floor(Date.now() / 1000)

  const invitePayload: InvitePayload = {
    groupId: group.id,
    seed: group.seed,
    groupName: group.name,
    rotationInterval: group.rotationInterval,
    wordCount: group.wordCount,
    wordlist: group.wordlist,
    counter: group.counter,
    usageOffset: group.usageOffset,
    nonce,
    beaconInterval: group.beaconInterval,
    beaconPrecision: group.beaconPrecision,
    members: [...group.members],
    relays: [...(group.writeRelays ?? group.relays ?? [])],
    encodingFormat: group.encodingFormat ?? 'words',
    tolerance: group.tolerance ?? 1,
    issuedAt,
    expiresAt: issuedAt + INVITE_MAX_AGE_SEC,
    epoch: group.epoch ?? 0,
    admins: [...(group.admins ?? [])],
    protocolVersion: PROTOCOL_VERSION,
    inviterPubkey: identity.pubkey,
    inviterSig: '',
    memberNames: { ...group.memberNames },
  }

  invitePayload.inviterSig = signInvite(invitePayload, identity.privkey)
  const confirmCode = confirmCodeFromPayload(invitePayload)

  return { payload: invitePayload, confirmCode }
}

/**
 * Accept and decode an invite payload.
 *
 * @param payload     Base64-encoded JSON invite string.
 * @param confirmCode 3 hyphen-separated confirmation words (case-insensitive, extra spaces tolerated).
 * @throws            If the payload is invalid or the confirmation code does not match.
 */
export function acceptInvite(payload: string, confirmCode?: string): InvitePayload {
  let raw: unknown
  try {
    raw = base64ToJson(payload)
  } catch {
    throw new Error('Invalid invite payload — could not decode.')
  }

  assertInvitePayload(raw)

  // Return an explicit whitelist copy so no unexpected fields are carried into state.
  const data: InvitePayload = {
    groupId: raw.groupId,
    seed: raw.seed,
    groupName: raw.groupName,
    rotationInterval: raw.rotationInterval,
    wordCount: raw.wordCount,
    wordlist: raw.wordlist,
    counter: raw.counter,
    usageOffset: raw.usageOffset,
    nonce: raw.nonce,
    beaconInterval: raw.beaconInterval,
    beaconPrecision: raw.beaconPrecision,
    members: [...raw.members],
    relays: [...raw.relays],
    encodingFormat: raw.encodingFormat,
    tolerance: raw.tolerance,
    issuedAt: raw.issuedAt,
    expiresAt: raw.expiresAt,
    epoch: raw.epoch,
    admins: [...raw.admins],
    protocolVersion: raw.protocolVersion,
    inviterPubkey: raw.inviterPubkey,
    inviterSig: raw.inviterSig,
    memberNames: raw.memberNames && typeof raw.memberNames === 'object'
      ? { ...raw.memberNames as Record<string, string> }
      : undefined,
  }

  // Verify the Schnorr signature — proves the inviter controls the claimed admin private key.
  if (!verifyInviteSig(data)) {
    throw new Error('Invite signature is invalid — the inviter could not prove control of the admin key.')
  }

  if (!confirmCode?.trim()) {
    throw new Error('Confirmation code is required — ask the sender to read it to you.')
  }

  const expected = confirmCodeFromPayload(data)
  const normalised = confirmCode.trim().replace(/[-\s]+/g, ' ').toLowerCase()
  const expectedNorm = expected.toLowerCase()
  if (normalised !== expectedNorm) {
    throw new Error('Confirmation words do not match — invite may have been tampered with.')
  }

  const now = Math.floor(Date.now() / 1000)
  if (data.expiresAt <= now) {
    throw new Error('Invite has expired. Ask for a new invite.')
  }
  if (data.issuedAt > now + MAX_CLOCK_SKEW_SEC) {
    throw new Error('Invite timestamp is too far in the future — check your device clock.')
  }

  return data
}

/**
 * Check whether an invite nonce has already been consumed for the given group.
 */
export function isInviteConsumed(groupId: string, nonce: string): boolean {
  const { groups } = getState()
  const group = groups[groupId]
  if (!group) return false
  return Array.isArray(group.usedInvites) && group.usedInvites.includes(nonce)
}

/**
 * Mark an invite nonce as consumed for the given group.
 * Subsequent calls to `isInviteConsumed` with the same nonce will return true.
 */
export function consumeInvite(groupId: string, nonce: string): void {
  const { groups } = getState()
  const group = groups[groupId]
  if (!group) {
    console.warn(`[canary:invite] consumeInvite: unknown group id "${groupId}"`)
    return
  }

  updateGroup(groupId, {
    usedInvites: Array.from(new Set([...group.usedInvites, nonce])),
  })
}

// ── Join Token ────────────────────────────────────────────────

/** Compact join token — proves the joiner has the group seed and controls their key. */
export interface JoinToken {
  /** Group ID */
  g: string
  /** Joiner's pubkey (64-char hex) */
  p: string
  /** Display name */
  n: string
  /** Current verification word (proves seed possession) */
  w: string
  /** Timestamp (unix seconds) */
  t: number
  /** Schnorr signature over SHA-256(canonical fields) */
  s: string
}

export interface JoinTokenResult {
  valid: boolean
  pubkey?: string
  displayName?: string
  word?: string
  error?: string
}

const JOIN_TOKEN_MAX_AGE_SEC = 7 * 24 * 60 * 60

function joinTokenCanonicalBytes(token: Omit<JoinToken, 's'>): Uint8Array {
  const sorted = Object.keys(token).sort().reduce((acc, key) => {
    acc[key] = (token as Record<string, unknown>)[key]
    return acc
  }, {} as Record<string, unknown>)
  return new TextEncoder().encode(JSON.stringify(sorted))
}

/**
 * Create a signed join token proving the joiner has the group seed and controls their private key.
 */
export function createJoinToken(opts: {
  groupId: string
  privkey: string
  pubkey: string
  displayName: string
  currentWord: string
  timestampOverride?: number
}): string {
  const token: Omit<JoinToken, 's'> = {
    g: opts.groupId,
    p: opts.pubkey,
    n: opts.displayName,
    w: opts.currentWord,
    t: opts.timestampOverride ?? Math.floor(Date.now() / 1000),
  }
  const hash = sha256(joinTokenCanonicalBytes(token))
  const sig = bytesToHex(schnorr.sign(hash, hexToBytes(opts.privkey)))
  return jsonToBase64({ ...token, s: sig })
}

/**
 * Verify a join token. Returns the parsed fields on success.
 */
export function verifyJoinToken(
  encoded: string,
  context: { groupId: string; groupSeed: string; counter: number; context: string; encoding?: TokenEncoding; tolerance?: number },
): JoinTokenResult {
  let raw: JoinToken
  try {
    raw = base64ToJson(encoded) as JoinToken
  } catch {
    return { valid: false, error: 'Invalid join token — could not decode.' }
  }

  if (raw.g !== context.groupId) {
    return { valid: false, error: 'Join token is for a different group.' }
  }

  if (typeof raw.p !== 'string' || !HEX_64_RE.test(raw.p)) {
    return { valid: false, error: 'Join token has invalid pubkey.' }
  }

  if (typeof raw.s !== 'string' || !HEX_128_RE.test(raw.s)) {
    return { valid: false, error: 'Join token has invalid signature.' }
  }

  const now = Math.floor(Date.now() / 1000)
  if (typeof raw.t !== 'number' || raw.t < now - JOIN_TOKEN_MAX_AGE_SEC) {
    return { valid: false, error: 'Join token has expired or is stale.' }
  }
  if (raw.t > now + MAX_CLOCK_SKEW_SEC) {
    return { valid: false, error: 'Join token timestamp is too far in the future.' }
  }

  // Verify Schnorr signature
  const { s: _sig, ...fields } = raw
  const hash = sha256(joinTokenCanonicalBytes(fields))
  try {
    const valid = schnorr.verify(hexToBytes(raw.s), hash, hexToBytes(raw.p))
    if (!valid) {
      return { valid: false, error: 'Join token signature is invalid.' }
    }
  } catch {
    return { valid: false, error: 'Join token signature verification failed.' }
  }

  // Verify word proves seed possession (F1 hardening)
  const word = (raw.w || '').toLowerCase()
  const tolerance = context.tolerance ?? 1
  let wordValid = false
  for (let c = context.counter - tolerance; c <= context.counter + tolerance; c++) {
    if (c < 0) continue
    if (word === deriveToken(context.groupSeed, context.context, c, context.encoding).toLowerCase()) {
      wordValid = true
      break
    }
  }
  if (!wordValid) {
    return { valid: false, error: 'Join token word does not match — seed possession not proven.' }
  }

  return {
    valid: true,
    pubkey: raw.p,
    displayName: raw.n || '',
    word: raw.w || '',
  }
}

// ── Invite Session ────────────────────────────────────────────

export interface InviteSession {
  groupId: string
  payload: string
  confirmCode: string
  nonce: string
  joinCount: number
}

let _activeSession: InviteSession | null = null

/**
 * Start an invite session for the given group.
 * Generates a fresh invite and tracks it as the active session.
 */
export function startInviteSession(group: AppGroup): InviteSession {
  const { payload, confirmCode } = createInvite(group)
  const decoded = base64ToJson(payload) as InvitePayload
  _activeSession = {
    groupId: group.id,
    payload,
    confirmCode,
    nonce: decoded.nonce,
    joinCount: 0,
  }
  return _activeSession
}

/**
 * Rotate the current session: generate a new invite with a fresh nonce.
 * Returns the updated session, or null if no session is active.
 */
export function rotateInviteSession(group: AppGroup): InviteSession | null {
  if (!_activeSession || _activeSession.groupId !== group.id) return null
  const prev = _activeSession
  const session = startInviteSession(group)
  session.joinCount = prev.joinCount + 1
  return session
}

/** Get the current active session, or null. */
export function getInviteSession(): InviteSession | null {
  return _activeSession
}

/** End the active invite session. */
export function endInviteSession(): void {
  _activeSession = null
}

// ── Remote Invite Session ─────────────────────────────────────

import {
  createRemoteInviteToken,
  createWelcomeEnvelope,
  type WelcomePayload,
} from './crypto/remote-invite.js'

export interface RemoteInviteSession {
  groupId: string
  /** Base64-encoded seedless invite token (Message 1) */
  tokenPayload: string
  /** The invite ID for tracking */
  inviteId: string
}

let _activeRemoteSession: RemoteInviteSession | null = null

export function startRemoteInviteSession(group: AppGroup): RemoteInviteSession {
  const { identity } = getState()
  if (!identity?.pubkey || !identity?.privkey) {
    throw new Error('No local identity — cannot create remote invite.')
  }
  if (!group.admins.includes(identity.pubkey)) {
    throw new Error(`Not authorised — you are not an admin of "${group.name}".`)
  }

  const relays = group.writeRelays?.length ? [...group.writeRelays] : [...(getState().settings.defaultWriteRelays ?? getState().settings.defaultRelays)]

  const token = createRemoteInviteToken({
    groupName: group.name,
    groupId: group.id,
    adminPubkey: identity.pubkey,
    adminPrivkey: identity.privkey,
    relays,
  })

  const tokenPayload = jsonToBase64url(token)

  _activeRemoteSession = {
    groupId: group.id,
    tokenPayload,
    inviteId: token.inviteId,
  }

  return _activeRemoteSession
}

export function createRemoteWelcomeEnvelope(group: AppGroup, joinerPubkey: string): string {
  const { identity } = getState()
  if (!identity?.privkey) {
    throw new Error('No local identity — cannot create welcome envelope.')
  }
  if (!_activeRemoteSession) {
    throw new Error('No active remote invite session — cannot create welcome envelope.')
  }

  const welcome: WelcomePayload = {
    inviteId: _activeRemoteSession.inviteId,
    seed: group.seed,
    counter: group.counter,
    usageOffset: group.usageOffset,
    epoch: group.epoch ?? 0,
    wordCount: group.wordCount,
    rotationInterval: group.rotationInterval,
    groupId: group.id,
    groupName: group.name,
    wordlist: group.wordlist,
    beaconInterval: group.beaconInterval,
    beaconPrecision: group.beaconPrecision,
    encodingFormat: group.encodingFormat ?? 'words',
    tolerance: group.tolerance ?? 1,
    members: [...group.members],
    admins: [...(group.admins ?? [])],
    relays: [...(group.writeRelays ?? group.relays ?? [])],
    memberNames: group.memberNames ? { ...group.memberNames } : undefined,
  }

  return createWelcomeEnvelope({
    welcome,
    adminPrivkey: identity.privkey,
    joinerPubkey,
  })
}

export function getRemoteInviteSession(): RemoteInviteSession | null {
  return _activeRemoteSession
}

export function endRemoteInviteSession(): void {
  _activeRemoteSession = null
}
