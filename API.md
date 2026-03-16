# API Reference — canary-kit

> Complete API documentation. For getting started, see [README.md](README.md).

## Session API (Directional Verification)

```typescript
import {
  createSession,
  generateSeed,
  deriveSeed,
  SESSION_PRESETS,
  type Session,
  type SessionConfig,
  type SessionPresetName,
} from 'canary-kit/session'
```

| Function | Description |
|---|---|
| `createSession(config: SessionConfig)` | Create a role-aware verification session |
| `generateSeed()` | Generate a 256-bit cryptographic seed |
| `deriveSeed(masterKey, ...components)` | Derive a seed deterministically from a master key |

**Session interface:**

| Method | Description |
|---|---|
| `session.myToken(nowSec?)` | Token I speak to prove my identity |
| `session.theirToken(nowSec?)` | Token I expect to hear from the other party |
| `session.verify(spoken, nowSec?)` | Verify a spoken word — returns `valid`, `duress`, or `invalid` |
| `session.counter(nowSec?)` | Current counter value (time-based or fixed) |
| `session.pair(nowSec?)` | Both tokens at once, keyed by role name |

**Session presets:**

| Preset | Words | Rotation | Tolerance | Use case |
|--------|-------|----------|-----------|----------|
| `call` | 1 | 30 seconds | ±1 | Phone verification (insurance, banking) |
| `handoff` | 1 | Single-use | 0 | Physical handoff (rideshare, delivery) |

## CANARY Protocol (Universal)

The universal protocol API works with any transport — not just Nostr groups.

```typescript
import {
  deriveToken, deriveTokenBytes,
  deriveDuressToken, deriveDuressTokenBytes,
  verifyToken,
  deriveLivenessToken,
  deriveDirectionalPair,
  type TokenVerifyResult, type VerifyOptions,
  type DirectionalPair,
} from 'canary-kit/token'

import {
  encodeAsWords, encodeAsPin, encodeAsHex,
  encodeToken, type TokenEncoding,
} from 'canary-kit/encoding'
```

| Function | Description |
|---|---|
| `deriveToken(secret, context, counter, encoding?)` | Derive an encoded verification token |
| `deriveDuressToken(secret, context, identity, counter, encoding, maxTolerance)` | Derive a duress token for a specific identity |
| `verifyToken(secret, context, counter, input, identities, options?)` | Verify a token — returns `valid`, `duress` (with matching identities), or `invalid` |
| `deriveLivenessToken(secret, context, identity, counter)` | Derive a liveness heartbeat token for dead man's switch |
| `deriveDirectionalPair(secret, namespace, roles, counter, encoding?)` | Derive two directional tokens from the same secret |

## Core Derivation

```typescript
import {
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
  deriveDuressPhrase,
} from 'canary-kit'
```

| Function | Signature | Description |
|---|---|---|
| `deriveVerificationWord` | `(seedHex: string, counter: number) => string` | Derives the single verification word for all group members |
| `deriveVerificationPhrase` | `(seedHex: string, counter: number, wordCount: 1 \| 2 \| 3) => string[]` | Derives a multi-word verification phrase |
| `deriveDuressWord` | `(seedHex: string, memberPubkeyHex: string, counter: number) => string` | Derives a member's duress word |
| `deriveDuressPhrase` | `(seedHex: string, memberPubkeyHex: string, counter: number, wordCount: 1 \| 2 \| 3) => string[]` | Derives a member's multi-word duress phrase |

## Verification

```typescript
import { verifyWord, type VerifyResult, type VerifyStatus } from 'canary-kit'
```

`verifyWord(spokenWord, seedHex, memberPubkeys, counter, wordCount?): VerifyResult`

Checks a spoken word in order: current verification word → each member's duress word → previous window (stale) → failed.

```typescript
type VerifyStatus = 'verified' | 'duress' | 'stale' | 'failed'

interface VerifyResult {
  status: VerifyStatus
  members?: string[]  // pubkeys of coerced members (only when status === 'duress')
}
```

## Group Management

```typescript
import {
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  advanceCounter,
  reseed,
  addMember,
  removeMember,
  type GroupConfig,
  type GroupState,
} from 'canary-kit'
```

All functions are pure — they return new state without mutating the input.

| Function | Description |
|---|---|
| `createGroup(config: GroupConfig)` | Creates a new group with a cryptographically secure random seed |
| `getCurrentWord(state: GroupState)` | Returns the current verification word or space-joined phrase |
| `getCurrentDuressWord(state: GroupState, memberPubkey: string)` | Returns the current duress word or phrase for a specific member |
| `advanceCounter(state: GroupState)` | Increments the usage offset (burn-after-use rotation) |
| `reseed(state: GroupState)` | Generates a fresh seed and resets the usage offset |
| `addMember(state: GroupState, pubkey: string)` | Adds a member; idempotent if already present |
| `removeMember(state: GroupState, pubkey: string)` | Removes a member and immediately reseeds |

## Threat-Profile Presets

```typescript
import { createGroup, PRESETS, type PresetName } from 'canary-kit'
```

**Group presets:**

| Preset | Words | Rotation | Use case |
|--------|-------|----------|----------|
| `family` | 1 | 7 days | Casual family/friend verification |
| `field-ops` | 2 | 24 hours | Journalism, activism, field work |
| `enterprise` | 2 | 48 hours | Corporate incident response |

Explicit config values always override preset defaults.

## Counter

```typescript
import { getCounter, counterToBytes, DEFAULT_ROTATION_INTERVAL } from 'canary-kit'
```

| Export | Description |
|---|---|
| `getCounter(timestampSec, rotationIntervalSec?)` | Returns `floor(timestamp / interval)` — the current time window |
| `counterToBytes(counter)` | Serialises a counter to an 8-byte big-endian `Uint8Array` (RFC 6238 encoding) |
| `DEFAULT_ROTATION_INTERVAL` | `604800` — 7 days in seconds |

## Wordlist

```typescript
import { WORDLIST, WORDLIST_SIZE, getWord, indexOf } from 'canary-kit'
// or: import { WORDLIST, WORDLIST_SIZE, getWord, indexOf } from 'canary-kit/wordlist'
```

| Export | Description |
|---|---|
| `WORDLIST` | `readonly string[]` — 2048 words curated for spoken clarity |
| `WORDLIST_SIZE` | `2048` |
| `getWord(index: number)` | Returns the word at the given index |
| `indexOf(word: string)` | Returns the index of a word, or `-1` if not found |

The wordlist (`en-v1`) is derived from BIP-39 English, filtered for verbal verification: no homophones, no phonetic near-collisions, no emotionally charged words. All words are 3–8 characters, lowercase alphabetic only.

## Nostr Events

```typescript
import {
  buildGroupEvent,
  buildSeedDistributionEvent,
  buildMemberUpdateEvent,
  buildReseedEvent,
  buildWordUsedEvent,
  buildBeaconEvent,
  KINDS,
  type UnsignedEvent,
} from 'canary-kit/nostr'
```

All builders return an `UnsignedEvent`. Sign with your own Nostr library.

| Builder | Kind | Description |
|---|---|---|
| `buildGroupEvent(params)` | `38800` | Replaceable event announcing a group and its configuration |
| `buildSeedDistributionEvent(params)` | `28800` | Ephemeral event delivering the encrypted seed to a recipient |
| `buildMemberUpdateEvent(params)` | `38801` | Replaceable event recording a member add or remove |
| `buildReseedEvent(params)` | `28801` | Ephemeral event signalling a seed rotation |
| `buildWordUsedEvent(params)` | `28802` | Ephemeral event recording that a verification word was consumed |
| `buildBeaconEvent(params)` | `20800` | Ephemeral event carrying an encrypted location beacon |

`KINDS` exports all six kind numbers as named constants.

## Beacon & Duress Alerts

```typescript
import {
  deriveBeaconKey,
  encryptBeacon, decryptBeacon,
  buildDuressAlert, encryptDuressAlert, decryptDuressAlert,
} from 'canary-kit/beacon'
```

## Sync Protocol

```typescript
import {
  applySyncMessage,
  decodeSyncMessage,
  encodeSyncMessage,
  deriveGroupKey,
  deriveGroupSigningKey,
  hashGroupTag,
  encryptEnvelope,
  decryptEnvelope,
  type SyncMessage,
  type SyncResult,
} from 'canary-kit/sync'
```

Transport-agnostic state synchronisation for group membership, counter advancement, reseeds, beacons, and duress alerts. Messages are validated against an authority model with 6 invariants (admin checks, epoch ordering, replay protection, counter bounds).

| Message type | Description |
|---|---|
| `member-join` | Add a member (admin-only) |
| `member-leave` | Remove a member or self-leave |
| `counter-advance` | Advance the group counter (burn-after-use) |
| `reseed` | Distribute a new seed with epoch bump |
| `beacon` | Encrypted location heartbeat |
| `duress-alert` | Silent duress location alert |
| `liveness-checkin` | Dead man's switch heartbeat |
| `state-snapshot` | Full state sync for new/rejoining members |
