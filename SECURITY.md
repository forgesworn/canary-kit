# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x   | Yes       |
| < 1.0.0 | No        |

## Reporting a Vulnerability

**Please report security vulnerabilities through GitHub Security Advisories only.**

1. Go to [Security Advisories](https://github.com/TheCryptoDonkey/canary-kit/security/advisories)
2. Click **"New draft security advisory"**
3. Fill in the details of the vulnerability

**Do not** report security vulnerabilities through public GitHub issues, pull requests, or any other public channel.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgement:** Within 72 hours
- **Initial assessment:** Within 1 week
- **Fix timeline:** Depends on severity; Critical issues targeted within 2 weeks

### Severity Definitions

| Level | Definition |
|-------|-----------|
| Critical | Breaks a core security property (token unpredictability, duress indistinguishability, coercion resistance) |
| High | Significant weakness exploitable by a defined adversary profile |
| Medium | Defence-in-depth gap; exploitable under specific conditions |
| Low | Minor issue; hardening opportunity |

### Scope

The following components are in scope for security reports:

- Protocol specification (`CANARY.md`, `NIP-CANARY.md`)
- Reference implementation (`src/*.ts`)
- Cryptographic primitives (`src/crypto.ts`)
- Sync protocol (`src/sync.ts`, `src/sync-crypto.ts`)

Out of scope: demo application (`app/`), build tooling, CI/CD.

## Security Model

CANARY's security rests on the secrecy of the shared seed and the properties of HMAC-SHA256. The protocol does **not** protect against:

- Compromise of the shared seed (all tokens derivable until reseed)
- Side-channel attacks inherent to JavaScript runtimes (timing, memory access patterns)
- An attacker who can observe both parties' tokens in real time

### Known Limitations of JavaScript Cryptography

- **No constant-time guarantees.** JavaScript engines may optimise away constant-time patterns. A `timingSafeEqual()` utility is provided and used for all token comparisons. The CANARY threat model (spoken-word verification over voice calls) makes sub-millisecond timing attacks impractical.
- **HMAC-SHA256 is synchronous.** The core derivation uses a pure JavaScript SHA-256 implementation rather than Web Crypto API, because derivation must be synchronous (called frequently, deterministic, offline). The implementation follows FIPS 180-4.
- **AES-256-GCM is async.** Beacon encryption uses `crypto.subtle` (Web Crypto API) and is the only async operation in the library.

### Browser Storage

The demo/alpha browser application stores group seeds and private keys in `localStorage`:

- **Without PIN:** Secrets are stored in plaintext. Any script running on the page origin can read them.
- **With PIN:** Secrets are encrypted with AES-256-GCM via a PBKDF2-derived key (600,000 iterations, non-extractable `CryptoKey`). Secrets are only readable in memory while the app is unlocked.

**This is NOT suitable for enterprise or high-security deployments.** Production implementations on native platforms MUST use platform secure storage (iOS Keychain, Android Keystore, OS credential manager).

The browser app mitigates this with:
- A strict `Content-Security-Policy` (`script-src 'self'`) blocking injected scripts
- Zero third-party runtime dependencies in the production bundle
- Auto-lock after configurable inactivity period (default: 5 minutes)

### Supply Chain

- **Zero runtime dependencies.** The published package contains only our code.
- **Automated publishing.** Releases are built and published via GitHub Actions with OIDC trusted publishing — no npm tokens stored.
- **Provenance signed.** npm provenance attestation is enabled.

## Security Documents

- [Threat Model](THREAT-MODEL.md) — Adversary profiles, security properties, attack trees
- [Audit Report](AUDIT.md) — Adversarial security audit with findings register
- [Protocol Specification](CANARY.md) — Full protocol spec with security analysis
