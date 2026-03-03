# Security Policy

## Reporting Vulnerabilities

**Do not open a public GitHub issue for security vulnerabilities.**

Email: darren@thecryptodonkey.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact

We aim to respond within 48 hours and will coordinate disclosure timing with you.

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Security Model

CANARY's security rests on the secrecy of the shared seed and the properties of HMAC-SHA256. The protocol does **not** protect against:

- Compromise of the shared seed (all tokens derivable)
- Side-channel attacks inherent to JavaScript runtimes (timing, memory access patterns)
- An attacker who can observe both parties' tokens in real time

### Known Limitations of JavaScript Cryptography

- **No constant-time guarantees.** JavaScript engines may optimise away constant-time patterns. A `timingSafeEqual()` utility is provided for constant-time byte comparison, but the token verification paths use string `===` comparison — this is acceptable because the CANARY threat model (spoken-word verification over voice calls) makes timing attacks impractical.
- **HMAC-SHA256 is synchronous.** The core derivation uses a pure JavaScript SHA-256 implementation rather than Web Crypto API, because derivation must be synchronous (called frequently, deterministic, offline). The implementation follows FIPS 180-4.
- **AES-256-GCM is async.** Beacon encryption uses `crypto.subtle` (Web Crypto API) and is the only async operation in the library.

### Supply Chain

- **Zero runtime dependencies.** The published package contains only our code.
- **Automated publishing.** Releases are built and published via GitHub Actions with OIDC trusted publishing — no npm tokens stored.
- **Provenance signed.** npm provenance attestation is enabled.

## Protocol Specification

The full security analysis is in [CANARY.md](CANARY.md), section "Security Analysis".
