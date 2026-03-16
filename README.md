# canary-kit

> Deepfake-proof identity verification. Open protocol, minimal dependencies.

[![npm](https://img.shields.io/npm/v/canary-kit)](https://www.npmjs.com/package/canary-kit)
[![CI](https://github.com/TheCryptoDonkey/canary-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/TheCryptoDonkey/canary-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-native-blue)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](vitest.config.ts)

**[Interactive Demo](https://canary.trotters.cc/)** · [Protocol Spec](CANARY.md) · [Nostr Binding](NIP-CANARY.md) · [Integration Guide](INTEGRATION.md)

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

**Minimal dependencies.** Core crypto is pure JavaScript. Only `@scure/bip32` and `@scure/bip39` for mnemonic key recovery. Requires `globalThis.crypto` (Web Crypto API): all browsers, Node.js 22+, Deno, and edge runtimes.

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

ESM-only. Eight subpath exports for tree-shaking:

```typescript
import { createSession } from 'canary-kit/session'    // just sessions
import { deriveToken } from 'canary-kit/token'         // just derivation
import { encodeAsWords } from 'canary-kit/encoding'    // just encoding
import { WORDLIST } from 'canary-kit/wordlist'          // just the wordlist
import { buildGroupEvent } from 'canary-kit/nostr'     // just Nostr
import { encryptBeacon } from 'canary-kit/beacon'      // just beacons
import { applySyncMessage } from 'canary-kit/sync'     // just sync protocol
```

## Security

- **Minimal runtime dependencies** — only `@scure/bip32` and `@scure/bip39` for mnemonic key recovery; core crypto is pure JS
- **Automated publishing** — GitHub Actions with OIDC trusted publishing, no stored tokens
- **Provenance signed** — npm provenance attestation enabled
- **Protocol-grade test vectors** — frozen canonical vectors in both CANARY.md and NIP-CANARY.md; any conformant implementation must produce identical results
- **Timing-safe byte compare** — `timingSafeEqual()` utility provided for constant-time byte operations
- **Bounded tolerance** — `MAX_TOLERANCE` cap prevents pathological iteration

See [SECURITY.md](SECURITY.md) for vulnerability disclosure and known limitations. See [CANARY.md](CANARY.md) for the full security analysis.

## API

| Subpath export | Key functions |
|---|---|
| `canary-kit/session` | `createSession`, `generateSeed`, `deriveSeed` |
| `canary-kit/token` | `deriveToken`, `verifyToken`, `deriveDuressToken`, `deriveLivenessToken` |
| `canary-kit/encoding` | `encodeAsWords`, `encodeAsPin`, `encodeAsHex` |
| `canary-kit` | `createGroup`, `getCurrentWord`, `verifyWord`, `addMember`, `reseed` |
| `canary-kit/nostr` | `buildGroupEvent`, `buildBeaconEvent`, + 4 more builders |
| `canary-kit/beacon` | `encryptBeacon`, `decryptBeacon`, `buildDuressAlert` |
| `canary-kit/sync` | `applySyncMessage`, `encodeSyncMessage`, `deriveGroupKey` |
| `canary-kit/wordlist` | `WORDLIST`, `getWord`, `indexOf` |

Full API documentation with signatures, types, and presets: **[API.md](API.md)**

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

Content is encrypted with **NIP-44**. Events may carry a **NIP-40** `expiration` tag.

## For AI Assistants

- [llms.txt](llms.txt) — concise API summary
- [llms-full.txt](llms-full.txt) — complete reference with all type signatures

## Support

For issues and feature requests, see [GitHub Issues](https://github.com/TheCryptoDonkey/canary-kit/issues).

If you find canary-kit useful, consider sending a tip:

- **Lightning:** `thedonkey@strike.me`
- **Nostr zaps:** `npub1mgvlrnf5hm9yf0n5mf9nqmvarhvxkc6remu5ec3vf8r0txqkuk7su0e7q2`

## Licence

MIT
