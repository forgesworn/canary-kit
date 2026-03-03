# canary-kit

> Spoken-word identity verification for trusted groups

[![npm](https://img.shields.io/npm/v/canary-kit)](https://www.npmjs.com/package/canary-kit)
[![CI](https://github.com/TheCryptoDonkey/canary-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/TheCryptoDonkey/canary-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## The Problem

AI voice cloning takes three seconds of audio. The security advice — "agree on a
family safe word" — is widespread, but common implementations are dangerously naive:
static words that never rotate, no duress signalling, and no protocol behind them.

Existing standards solve parts of this:
- **TOTP/HOTP** rotate tokens automatically, but output digits for machines, not words for humans
- **ZRTP SAS** produces human-readable strings, but doesn't rotate or signal duress
- **BIP-39** provides a spoken wordlist, but has no verification or coercion resistance

CANARY combines these ideas into a single protocol: deterministic rotation (like TOTP),
coercion-resistant duress signalling, and spoken-word output — three properties that
have never been combined in a standard before.

## Quick Start

```bash
npm install canary-kit
```

```typescript
import { createGroup, getCurrentWord, getCurrentDuressWord, verifyWord, getCounter } from 'canary-kit'

// Create a group
const group = createGroup({
  name: 'Family',
  members: [alicePubkey, bobPubkey],
})

// Get the current verification word (all members derive the same word)
const word = getCurrentWord(group)
// => "falcon"

// Get Alice's duress word (only she should use this if coerced)
const duress = getCurrentDuressWord(group, alicePubkey)
// => "bridge"

// Verify a spoken word (uses getCurrentWord internally for comparison)
const result = verifyWord(word, group.seed, group.members,
  getCounter(Math.floor(Date.now() / 1000), group.rotationInterval) + group.usageOffset)
// => { status: 'verified' }
```

## Why Canary

**Built on proven primitives.** CANARY extends the HMAC-counter pattern from HOTP (RFC 4226) and TOTP (RFC 6238) to human-to-human spoken verification, adding duress signalling and coercion resistance. If TOTP proves you have a secret to a server, CANARY proves you're safe to another person.

**Offline-first.** Words are derived locally from a shared seed and a time-based counter. No network is required after initial setup.

**Duress-aware.** Every member has a personal duress word distinct from the verification word. Speaking it silently alerts the group while giving the attacker plausible deniability.

**Automatic rotation.** The counter advances on a configurable interval (default: 7 days). Burn-after-use increments the counter immediately after each verification, so words cannot be replayed.

**Multi-channel.** Seed distribution uses Nostr relays with NIP-44 encryption. Meshtastic mesh provides a resilient offline fallback.

**Zero dependencies.** Pure JavaScript — no runtime dependencies. Requires `globalThis.crypto` (Web Crypto API): all browsers, Node.js 22+, Deno, and edge runtimes.

**Protocol-grade.** Formal specification with published test vectors and a curated 2048-word spoken-clarity wordlist.

## API Reference

### Core Derivation

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
| `deriveDuressWord` | `(seedHex: string, memberPubkeyHex: string, counter: number) => string` | Derives a member's unique duress word; guaranteed not to collide with the verification word |
| `deriveDuressPhrase` | `(seedHex: string, memberPubkeyHex: string, counter: number, wordCount: 1 \| 2 \| 3) => string[]` | Derives a member's multi-word duress phrase |

### CANARY Protocol (Universal)

The universal protocol API works with any transport — not just Nostr groups.

```typescript
import {
  deriveToken, deriveTokenBytes,
  deriveDuressToken, deriveDuressTokenBytes,
  verifyToken,
  deriveLivenessToken,
  type TokenVerifyResult, type VerifyOptions,
} from 'canary-kit/token'

import {
  encodeAsWords, encodeAsPin, encodeAsHex,
  encodeToken, type TokenEncoding,
} from 'canary-kit/encoding'
```

| Function | Description |
|---|---|
| `deriveToken(secret, context, counter, encoding?)` | Derive an encoded verification token |
| `deriveDuressToken(secret, context, identity, counter, encoding?)` | Derive a duress token for a specific identity |
| `verifyToken(secret, context, counter, input, identities, options?)` | Verify a token — returns `valid`, `duress` (with matching identities), or `invalid` |
| `deriveLivenessToken(secret, context, identity, counter)` | Derive a liveness heartbeat token for dead man's switch |

### Verification

```typescript
import { verifyWord, type VerifyResult, type VerifyStatus } from 'canary-kit'
```

`verifyWord(spokenWord, seedHex, memberPubkeys, counter): VerifyResult`

Checks a spoken word in order: current verification word → each member's duress word → previous window (stale) → failed.

```typescript
type VerifyStatus = 'verified' | 'duress' | 'stale' | 'failed'

interface VerifyResult {
  status: VerifyStatus
  members?: string[]  // pubkeys of coerced members (only when status === 'duress')
}
```

### Group Management

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
| `reseed(state: GroupState)` | Generates a fresh seed and resets the usage offset; call after a suspected compromise |
| `addMember(state: GroupState, pubkey: string)` | Adds a member; idempotent if already present |
| `removeMember(state: GroupState, pubkey: string)` | Removes a member and immediately reseeds to invalidate the old shared secret |

```typescript
interface GroupConfig {
  name: string
  members: string[]           // hex-encoded Nostr pubkeys
  preset?: PresetName         // threat-profile preset; explicit fields override
  rotationInterval?: number   // seconds; default 604800 (7 days)
  wordCount?: 1 | 2 | 3      // words per challenge; default 1
  wordlist?: string           // wordlist identifier; default 'en-v1'
}
```

### Threat-Profile Presets

```typescript
import { createGroup, PRESETS, type PresetName } from 'canary-kit'
```

Pre-configured group settings for common risk profiles:

| Preset | Words | Rotation | Use case |
|--------|-------|----------|----------|
| `family` | 1 | 7 days | Casual family/friend verification |
| `field-ops` | 2 | 24 hours | Journalism, activism, field work |
| `enterprise` | 2 | 48 hours | Corporate incident response |

```typescript
// Use a preset
const group = createGroup({
  name: 'Newsroom',
  members: [alicePubkey, bobPubkey],
  preset: 'field-ops',
})

// Override specific preset values
const custom = createGroup({
  name: 'Custom',
  members: [alicePubkey, bobPubkey],
  preset: 'field-ops',
  wordCount: 3, // override preset's 2
})
```

Explicit config values always override preset defaults.

### Counter

```typescript
import { getCounter, counterToBytes, DEFAULT_ROTATION_INTERVAL } from 'canary-kit'
```

| Export | Description |
|---|---|
| `getCounter(timestampSec, rotationIntervalSec?)` | Returns `floor(timestamp / interval)` — the current time window |
| `counterToBytes(counter)` | Serialises a counter to an 8-byte big-endian `Uint8Array` (RFC 6238 encoding) |
| `DEFAULT_ROTATION_INTERVAL` | `604800` — 7 days in seconds |

### Wordlist

```typescript
import { WORDLIST, WORDLIST_SIZE, getWord, indexOf } from 'canary-kit'
// or, for direct access:
import { WORDLIST, WORDLIST_SIZE, getWord, indexOf } from 'canary-kit/wordlist'
```

| Export | Description |
|---|---|
| `WORDLIST` | `readonly string[]` — 2048 words curated for spoken clarity |
| `WORDLIST_SIZE` | `2048` |
| `getWord(index: number)` | Returns the word at the given index |
| `indexOf(word: string)` | Returns the index of a word, or `-1` if not found |

The wordlist (`en-v1`) is derived from BIP-39 English, filtered for verbal verification: no homophones, no phonetic near-collisions, no emotionally charged words. All words are 3–8 characters, lowercase alphabetic only.

### Nostr Events

```typescript
import {
  buildGroupEvent,
  buildSeedDistributionEvent,
  buildMemberUpdateEvent,
  buildReseedEvent,
  buildWordUsedEvent,
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

`KINDS` exports all five kind numbers as named constants.

### Beacon & Duress Alerts

```typescript
import {
  deriveBeaconKey,
  encryptBeacon, decryptBeacon,
  buildDuressAlert, encryptDuressAlert, decryptDuressAlert,
} from 'canary-kit/beacon'
```

## Protocol

The full protocol specification is in [CANARY.md](CANARY.md). The Nostr binding is in [NIP-CANARY.md](NIP-CANARY.md).

| Event | Kind | Type |
|---|---|---|
| Group announcement | `38800` | Replaceable |
| Seed distribution | `28800` | Ephemeral |
| Member update | `38801` | Replaceable |
| Reseed | `28801` | Ephemeral |
| Word used | `28802` | Ephemeral |

All kind numbers above are provisional — pending final NIP allocation.

Content is encrypted with **NIP-44**. Events may carry a **NIP-40** `expiration` tag.

## Licence

MIT
