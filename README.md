# canary-kit

> Deepfake-proof identity verification. Open protocol, zero dependencies.

[![npm](https://img.shields.io/npm/v/canary-kit)](https://www.npmjs.com/package/canary-kit)
[![CI](https://github.com/TheCryptoDonkey/canary-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/TheCryptoDonkey/canary-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-native-blue)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)

**[Interactive Demo](https://thecryptodonkey.github.io/canary-kit/)** · [Protocol Spec](CANARY.md) · [Nostr Binding](NIP-CANARY.md) · [Integration Guide](INTEGRATION.md)

## The Problem

Voice phishing surged 442% in 2025. AI can clone a voice from three seconds of
audio. The tools that were supposed to protect us are failing:

- **Security questions** are one-directional and socially engineerable
- **Voice biometrics** — 91% of US banks are reconsidering after deepfake attacks
- **TOTP codes** prove you to a server, but never prove the server to you
- **"Family safe words"** are static, never rotate, and have no duress signalling

CANARY is the first protocol that combines **bidirectional verification** (both
sides prove identity), **coercion resistance** (duress tokens), and **spoken-word
output** — three properties that have never existed together in a standard.

It works because cloning a voice doesn't help you derive the right word. Only
knowledge of the shared secret does.

## Quick Start

```bash
npm install canary-kit
```

### Phone Verification (Insurance, Banking)

```typescript
import { createSession } from 'canary-kit/session'

const session = createSession({
  secret: sharedSeed,
  namespace: 'aviva',
  roles: ['caller', 'agent'],
  myRole: 'agent',
  preset: 'call',
})

session.myToken()        // "choose" — what I speak
session.theirToken()     // "bid" — what I expect to hear
session.verify('bid')    // { status: 'valid' }
```

### Family / Team Verification

```typescript
import { createGroup, getCurrentWord, verifyWord, getCounter } from 'canary-kit'

const group = createGroup({
  name: 'Family',
  members: [alicePubkey, bobPubkey],
  preset: 'family',
})

getCurrentWord(group)  // "falcon"
```

## Use Cases

| Use case | Preset | Rotation | What it replaces |
|----------|--------|----------|------------------|
| Insurance phone calls | `call` | 30 seconds | Security questions |
| Banking phone calls | `call` | 30 seconds | Voice biometrics, callbacks |
| Rideshare/delivery handoff | `handoff` | Single-use | Random PINs |
| Family safety | `family` | 7 days | Static safe words |
| Journalism / activism | `field-ops` | 24 hours | Nothing (no existing standard) |
| Enterprise incident response | `enterprise` | 48 hours | Challenge-response over email |

## Why Not Just...

| Solution | Limitation CANARY solves |
|----------|------------------------|
| Security questions | One-directional. Socially engineerable. No rotation. |
| Voice biometrics | Defeated by AI voice cloning. One-directional. |
| TOTP (Google Auth) | Machine-readable digits, not spoken words. No duress. One-directional. |
| Callback numbers | Slow. Doesn't prove the agent's identity. |
| BIP-39 wordlist | No verification protocol. No rotation. No duress. |
| "Family safe word" | Static. No rotation. No duress. No protocol. |
| **CANARY** | **Bidirectional. Deepfake-proof. Duress-aware. Rotating. Offline. Open.** |

## Why Canary

**Bidirectional.** Both sides prove identity. The caller proves they know the secret, and the agent proves it back. Neither can impersonate the other.

**Built on proven primitives.** CANARY extends the HMAC-counter pattern from HOTP (RFC 4226) and TOTP (RFC 6238) to human-to-human spoken verification, adding duress signalling and coercion resistance.

**Offline-first.** Words are derived locally from a shared seed and a time-based counter. No network is required after initial setup.

**Duress-aware.** Every party has a personal duress word distinct from the verification word. Speaking it silently alerts the system while giving the attacker plausible deniability.

**Automatic rotation.** Configurable intervals — 30 seconds for phone calls, 7 days for family groups.

**Zero dependencies.** Pure JavaScript — no runtime dependencies. Requires `globalThis.crypto` (Web Crypto API): all browsers, Node.js 22+, Deno, and edge runtimes.

**Protocol-grade.** Formal specification with published test vectors and a curated 2048-word spoken-clarity wordlist.

## Compatibility

| Runtime | Version | Notes |
|---------|---------|-------|
| Node.js | 22+ | Full support (`globalThis.crypto` required) |
| Deno | 1.x+ | Full support |
| Bun | 1.x+ | Full support |
| Browsers | All modern | Chrome, Firefox, Safari, Edge |
| Cloudflare Workers | Yes | Web Crypto API available |
| React Native | Via polyfill | Needs `crypto.subtle` polyfill |

ESM-only. Seven subpath exports for tree-shaking:

```typescript
import { createSession } from 'canary-kit/session'    // just sessions
import { deriveToken } from 'canary-kit/token'         // just derivation
import { encodeAsWords } from 'canary-kit/encoding'    // just encoding
import { WORDLIST } from 'canary-kit/wordlist'          // just the wordlist
import { buildGroupEvent } from 'canary-kit/nostr'     // just Nostr
import { encryptBeacon } from 'canary-kit/beacon'      // just beacons
```

## Security

- **Zero runtime dependencies** — the published package contains only our code
- **Automated publishing** — GitHub Actions with OIDC trusted publishing, no stored tokens
- **Provenance signed** — npm provenance attestation enabled
- **Protocol-grade test vectors** — 12 frozen canonical vectors; any conformant implementation must produce identical results
- **Timing-safe byte compare** — `timingSafeEqual()` utility provided for constant-time byte operations
- **Bounded tolerance** — `MAX_TOLERANCE` cap prevents pathological iteration

See [SECURITY.md](SECURITY.md) for vulnerability disclosure and known limitations. See [CANARY.md](CANARY.md) for the full security analysis.

## API Reference

### Session API (Directional Verification)

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

### CANARY Protocol (Universal)

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
| `deriveDuressWord` | `(seedHex: string, memberPubkeyHex: string, counter: number) => string` | Derives a member's duress word |
| `deriveDuressPhrase` | `(seedHex: string, memberPubkeyHex: string, counter: number, wordCount: 1 \| 2 \| 3) => string[]` | Derives a member's multi-word duress phrase |

### Verification

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
| `reseed(state: GroupState)` | Generates a fresh seed and resets the usage offset |
| `addMember(state: GroupState, pubkey: string)` | Adds a member; idempotent if already present |
| `removeMember(state: GroupState, pubkey: string)` | Removes a member and immediately reseeds |

### Threat-Profile Presets

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
// or: import { WORDLIST, WORDLIST_SIZE, getWord, indexOf } from 'canary-kit/wordlist'
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

### Beacon & Duress Alerts

```typescript
import {
  deriveBeaconKey,
  encryptBeacon, decryptBeacon,
  buildDuressAlert, encryptDuressAlert, decryptDuressAlert,
} from 'canary-kit/beacon'
```

## Protocol

The full protocol specification is in [CANARY.md](CANARY.md). The Nostr binding is in [NIP-CANARY.md](NIP-CANARY.md). The integration guide for finance/enterprise is in [INTEGRATION.md](INTEGRATION.md).

| Event | Kind | Type |
|---|---|---|
| Group announcement | `38800` | Replaceable |
| Seed distribution | `28800` | Ephemeral |
| Member update | `38801` | Replaceable |
| Reseed | `28801` | Ephemeral |
| Word used | `28802` | Ephemeral |
| Encrypted location beacon | `20800` | Ephemeral |

All kind numbers above are provisional — pending final NIP allocation.

Content is encrypted with **NIP-44**. Events may carry a **NIP-40** `expiration` tag.

## For AI Assistants

- [llms.txt](llms.txt) — concise API summary
- [llms-full.txt](llms-full.txt) — complete reference with all type signatures

## Licence

MIT
