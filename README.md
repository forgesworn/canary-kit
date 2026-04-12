# canary-kit

**Nostr:** [`npub1mgvlrnf5hm9yf0n5mf9nqmvarhvxkc6remu5ec3vf8r0txqkuk7su0e7q2`](https://njump.me/npub1mgvlrnf5hm9yf0n5mf9nqmvarhvxkc6remu5ec3vf8r0txqkuk7su0e7q2)

> Deepfake-proof identity verification. Open protocol, minimal dependencies.

[![npm](https://img.shields.io/npm/v/canary-kit)](https://www.npmjs.com/package/canary-kit)
[![CI](https://github.com/forgesworn/canary-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/forgesworn/canary-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-native-blue)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](vitest.config.ts)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/TheCryptoDonkey?logo=githubsponsors&color=ea4aaa&label=Sponsor)](https://github.com/sponsors/TheCryptoDonkey)

**[Interactive Demo](https://canary.trotters.cc/)** · [Protocol Spec](CANARY.md) · [Nostr Binding](NIP-CANARY.md) · [Integration Guide](INTEGRATION.md) · [Groups Protocol](GROUPS.md) · [Nostr Transport](NIP-XX.md) · [Threat Model](THREAT-MODEL.md) · [Regulatory](REGULATORY.md)

## Why Now

Regulators and criminals arrived at the same inflection point simultaneously. In
March 2023 the UN Office on Drugs and Crime formally linked AI synthetic voice to
organised criminal networks operating cross-border fraud at institutional scale.
Voice cloning tools are now available as a service for under $400/month; vishing
surged 442% in 2025. The same week, the UAE Central Bank set a 31 March 2026
deadline banning SMS OTP across all licensed financial institutions — the first
national regulator to mandate its replacement. India's RBI follows on 1 April 2026
with mandatory two-factor authentication for all digital payment transactions. The
EU AI Act's deepfake transparency obligation (Article 50) takes effect in August
2026; EUDI Wallets must be available across all 27 Member States by December 2026.
FCA Strong Customer Authentication technical standards were updated in March 2026.

CANARY is positioned where these pressures converge: the voice channel, where
authentication is weakest and the regulatory gap is largest. For a detailed mapping
of CANARY's security properties against each regulation, see
[REGULATORY.md](REGULATORY.md).

The full verification stack covers four caller scenarios: known person, known
institution (CANARY handles this), unknown person, and unknown institution
cold-calling — the last via [Signet](https://github.com/forgesworn/signet)
cold-call verification (forthcoming). Deepfake labelling tools and CANARY are
complementary: one labels AI-generated content after the fact; CANARY verifies
the caller's identity in real time at the point of interaction.

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
import { buildGroupStateEvent } from 'canary-kit/nostr' // just Nostr
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
| `canary-kit/nostr` | `buildGroupStateEvent`, `buildSignalEvent`, `buildStoredSignalEvent`, `buildRumourEvent` |
| `canary-kit/beacon` | `encryptBeacon`, `decryptBeacon`, `buildDuressAlert` |
| `canary-kit/sync` | `applySyncMessage`, `encodeSyncMessage`, `deriveGroupKey` |
| `canary-kit/wordlist` | `WORDLIST`, `getWord`, `indexOf` |

Full API documentation with signatures, types, and presets: **[API.md](API.md)**

## Protocol

The full protocol specification is in [CANARY.md](CANARY.md). The Nostr binding is in [NIP-CANARY.md](NIP-CANARY.md). The integration guide for finance/enterprise is in [INTEGRATION.md](INTEGRATION.md).

| Event | Kind | Type |
|---|---|---|
| Group state / stored signals | `30078` | Parameterised replaceable |
| Real-time signals | `20078` | Ephemeral |
| Seed distribution / member updates | `14` → `1059` | NIP-17 gift wrap (kind 14 rumour sealed + wrapped) |

Content is encrypted with **NIP-44**. Group state events use the `ssg/` d-tag namespace. Seed distribution and member updates use **NIP-17** gift wrapping (kind 14 rumour → kind 13 seal → kind 1059 gift wrap). Events may carry a **NIP-40** `expiration` tag.

## For AI Assistants

- [llms.txt](llms.txt) — concise API summary
- [llms-full.txt](llms-full.txt) — complete reference with all type signatures

## Support

For issues and feature requests, see [GitHub Issues](https://github.com/forgesworn/canary-kit/issues).

If you find canary-kit useful, consider sending a tip:

- **Lightning:** `thedonkey@strike.me`
- **Nostr zaps:** `npub1mgvlrnf5hm9yf0n5mf9nqmvarhvxkc6remu5ec3vf8r0txqkuk7su0e7q2`

## Part of the ForgeSworn Toolkit

[ForgeSworn](https://forgesworn.dev) builds open-source cryptographic identity, payments, and coordination tools for Nostr.

| Library | What it does |
|---------|-------------|
| [nsec-tree](https://github.com/forgesworn/nsec-tree) | Deterministic sub-identity derivation |
| [ring-sig](https://github.com/forgesworn/ring-sig) | SAG/LSAG ring signatures on secp256k1 |
| [range-proof](https://github.com/forgesworn/range-proof) | Pedersen commitment range proofs |
| [canary-kit](https://github.com/forgesworn/canary-kit) | Coercion-resistant spoken verification |
| [spoken-token](https://github.com/forgesworn/spoken-token) | Human-speakable verification tokens |
| [toll-booth](https://github.com/forgesworn/toll-booth) | L402 payment middleware |
| [geohash-kit](https://github.com/forgesworn/geohash-kit) | Geohash toolkit with polygon coverage |
| [nostr-attestations](https://github.com/forgesworn/nostr-attestations) | NIP-VA verifiable attestations |
| [dominion](https://github.com/forgesworn/dominion) | Epoch-based encrypted access control |
| [nostr-veil](https://github.com/forgesworn/nostr-veil) | Privacy-preserving Web of Trust |

## Licence

MIT
