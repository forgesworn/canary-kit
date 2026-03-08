/**
 * Binary invite encoder/decoder — packs an InvitePayload into a compact
 * binary format suitable for QR codes (~244 bytes vs ~400 bytes JSON).
 *
 * Binary format (version 1):
 * [1B version] [32B seed] [32B inviterPubkey] [64B inviterSig] [16B nonce]
 * [4B counter] [2B usageOffset] [4B epoch] [4B rotationInterval] [4B beaconInterval]
 * [1B beaconPrecision] [1B wordCount] [1B tolerance] [1B encodingFormat] [1B wordlist]
 * [4B issuedAt] [4B expiresAt] [1B protocolVersion]
 * [1B memberCount] [32B * memberCount members]
 * [1B adminCount] [1B * adminCount adminIndices]
 * [1B groupIdLen] [groupIdLen bytes groupId UTF-8]
 * [1B groupNameLen] [groupNameLen bytes groupName UTF-8]
 *
 * Relays and memberNames are NOT included — relays are not needed for
 * offline QR scanning and memberNames are advisory only.
 */
import type { InvitePayload } from '../invite.js'

// ── Local hex helpers (avoid circular deps with canary-kit/crypto) ──

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

// ── Encoding format enum ──

const ENCODING_FORMAT_MAP: Record<string, number> = { words: 0, pin: 1, hex: 2 }
const ENCODING_FORMAT_REVERSE: Record<number, InvitePayload['encodingFormat']> = {
  0: 'words',
  1: 'pin',
  2: 'hex',
}

// ── Wordlist enum ──

const WORDLIST_MAP: Record<string, number> = { 'en-v1': 0 }
const WORDLIST_REVERSE: Record<number, string> = { 0: 'en-v1' }

const VERSION = 1
const encoder = new TextEncoder()
const decoder = new TextDecoder()

// ── Pack ──

export function packInvite(p: InvitePayload): Uint8Array {
  const groupIdBytes = encoder.encode(p.groupId)
  const groupNameBytes = encoder.encode(p.groupName)

  // Build admin indices (indices into the members array)
  const adminIndices: number[] = p.admins.map((admin) => {
    const idx = p.members.indexOf(admin)
    if (idx === -1) throw new Error(`Admin ${admin} not found in members array`)
    return idx
  })

  // Calculate total size
  const fixedSize =
    1 + // version
    32 + // seed
    32 + // inviterPubkey
    64 + // inviterSig
    16 + // nonce
    4 + // counter
    2 + // usageOffset
    4 + // epoch
    4 + // rotationInterval
    4 + // beaconInterval
    1 + // beaconPrecision
    1 + // wordCount
    1 + // tolerance
    1 + // encodingFormat
    1 + // wordlist
    4 + // issuedAt
    4 + // expiresAt
    1 // protocolVersion
  // = 175

  const totalSize =
    fixedSize +
    1 + p.members.length * 32 + // memberCount + members
    1 + adminIndices.length + // adminCount + adminIndices
    1 + groupIdBytes.length + // groupIdLen + groupId
    1 + groupNameBytes.length // groupNameLen + groupName

  const buf = new ArrayBuffer(totalSize)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)
  let offset = 0

  // Version
  view.setUint8(offset, VERSION)
  offset += 1

  // Seed (32 bytes hex → raw)
  bytes.set(hexToBytes(p.seed), offset)
  offset += 32

  // Inviter pubkey (32 bytes)
  bytes.set(hexToBytes(p.inviterPubkey), offset)
  offset += 32

  // Inviter sig (64 bytes)
  bytes.set(hexToBytes(p.inviterSig), offset)
  offset += 64

  // Nonce (16 bytes)
  bytes.set(hexToBytes(p.nonce), offset)
  offset += 16

  // Counter (4 bytes, big-endian)
  view.setUint32(offset, p.counter)
  offset += 4

  // Usage offset (2 bytes, big-endian)
  view.setUint16(offset, p.usageOffset)
  offset += 2

  // Epoch (4 bytes)
  view.setUint32(offset, p.epoch)
  offset += 4

  // Rotation interval (4 bytes)
  view.setUint32(offset, p.rotationInterval)
  offset += 4

  // Beacon interval (4 bytes)
  view.setUint32(offset, p.beaconInterval)
  offset += 4

  // Beacon precision (1 byte)
  view.setUint8(offset, p.beaconPrecision)
  offset += 1

  // Word count (1 byte)
  view.setUint8(offset, p.wordCount)
  offset += 1

  // Tolerance (1 byte)
  view.setUint8(offset, p.tolerance)
  offset += 1

  // Encoding format (1 byte enum)
  view.setUint8(offset, ENCODING_FORMAT_MAP[p.encodingFormat] ?? 0)
  offset += 1

  // Wordlist (1 byte index)
  view.setUint8(offset, WORDLIST_MAP[p.wordlist] ?? 0)
  offset += 1

  // Issued at (4 bytes, unix seconds)
  view.setUint32(offset, p.issuedAt)
  offset += 4

  // Expires at (4 bytes, unix seconds)
  view.setUint32(offset, p.expiresAt)
  offset += 4

  // Protocol version (1 byte)
  view.setUint8(offset, p.protocolVersion)
  offset += 1

  // Members
  view.setUint8(offset, p.members.length)
  offset += 1
  for (const member of p.members) {
    bytes.set(hexToBytes(member), offset)
    offset += 32
  }

  // Admin indices
  view.setUint8(offset, adminIndices.length)
  offset += 1
  for (const idx of adminIndices) {
    view.setUint8(offset, idx)
    offset += 1
  }

  // Group ID (length-prefixed UTF-8)
  view.setUint8(offset, groupIdBytes.length)
  offset += 1
  bytes.set(groupIdBytes, offset)
  offset += groupIdBytes.length

  // Group name (length-prefixed UTF-8)
  view.setUint8(offset, groupNameBytes.length)
  offset += 1
  bytes.set(groupNameBytes, offset)
  offset += groupNameBytes.length

  return bytes
}

// ── Unpack ──

export function unpackInvite(data: Uint8Array): InvitePayload {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  let offset = 0

  // Version
  const version = view.getUint8(offset)
  offset += 1
  if (version !== VERSION) {
    throw new Error(`Unsupported binary invite version: ${version}`)
  }

  // Seed
  const seed = bytesToHex(data.slice(offset, offset + 32))
  offset += 32

  // Inviter pubkey
  const inviterPubkey = bytesToHex(data.slice(offset, offset + 32))
  offset += 32

  // Inviter sig
  const inviterSig = bytesToHex(data.slice(offset, offset + 64))
  offset += 64

  // Nonce
  const nonce = bytesToHex(data.slice(offset, offset + 16))
  offset += 16

  // Counter
  const counter = view.getUint32(offset)
  offset += 4

  // Usage offset
  const usageOffset = view.getUint16(offset)
  offset += 2

  // Epoch
  const epoch = view.getUint32(offset)
  offset += 4

  // Rotation interval
  const rotationInterval = view.getUint32(offset)
  offset += 4

  // Beacon interval
  const beaconInterval = view.getUint32(offset)
  offset += 4

  // Beacon precision
  const beaconPrecision = view.getUint8(offset)
  offset += 1

  // Word count
  const wordCount = view.getUint8(offset) as 1 | 2 | 3
  offset += 1

  // Tolerance
  const tolerance = view.getUint8(offset)
  offset += 1

  // Encoding format
  const encodingFormat = ENCODING_FORMAT_REVERSE[view.getUint8(offset)] ?? 'words'
  offset += 1

  // Wordlist
  const wordlist = WORDLIST_REVERSE[view.getUint8(offset)] ?? 'en-v1'
  offset += 1

  // Issued at
  const issuedAt = view.getUint32(offset)
  offset += 4

  // Expires at
  const expiresAt = view.getUint32(offset)
  offset += 4

  // Protocol version
  const protocolVersion = view.getUint8(offset)
  offset += 1

  // Members
  const memberCount = view.getUint8(offset)
  offset += 1
  const members: string[] = []
  for (let i = 0; i < memberCount; i++) {
    members.push(bytesToHex(data.slice(offset, offset + 32)))
    offset += 32
  }

  // Admin indices → admin pubkeys
  const adminCount = view.getUint8(offset)
  offset += 1
  const admins: string[] = []
  for (let i = 0; i < adminCount; i++) {
    const idx = view.getUint8(offset)
    offset += 1
    admins.push(members[idx])
  }

  // Group ID
  const groupIdLen = view.getUint8(offset)
  offset += 1
  const groupId = decoder.decode(data.slice(offset, offset + groupIdLen))
  offset += groupIdLen

  // Group name
  const groupNameLen = view.getUint8(offset)
  offset += 1
  const groupName = decoder.decode(data.slice(offset, offset + groupNameLen))
  offset += groupNameLen

  return {
    groupId,
    seed,
    groupName,
    rotationInterval,
    wordCount,
    wordlist,
    counter,
    usageOffset,
    nonce,
    beaconInterval,
    beaconPrecision,
    members,
    relays: [],
    encodingFormat,
    tolerance,
    issuedAt,
    expiresAt,
    epoch,
    admins,
    protocolVersion,
    inviterPubkey,
    inviterSig,
  }
}
