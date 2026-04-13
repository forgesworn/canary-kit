# CLAUDE.md — canary-kit

Coercion-resistant spoken verification. Extends `spoken-token` with duress, liveness, groups, and Nostr transport.

## Commands

- `npm run build` — compile TypeScript to dist/
- `npm test` — run all tests (vitest)
- `npm run test:watch` — watch mode
- `npm run typecheck` — type-check without emitting
- `npm run bench` — run performance benchmarks
- `npm run lint` — run ESLint
- `npm run demo` — build and serve interactive demo at localhost:8787
- `npm run build:app` — build demo app to docs/
- `npm run test:e2e` — run Playwright e2e tests (requires `npx playwright install` first)
- `npm run test:e2e:protocol` — run protocol-specific e2e tests

## Dependencies

- **`spoken-token`** — core derivation, encoding, wordlist, and verification (re-exported from canary-kit)
- **`@scure/bip32`** and **`@scure/bip39`** — mnemonic key recovery in demo app

## Structure

- `src/token.ts` — CANARY-specific derivation (duress, liveness, directional pairs) — wraps spoken-token
- `src/encoding.ts` — re-exports spoken-token encoding (words, PIN, hex)
- `src/session.ts` — directional two-party verification sessions
- `src/derive.ts` — group word/phrase derivation
- `src/verify.ts` — group word verification
- `src/group.ts` — group lifecycle (create, reseed, add/remove members)
- `src/sync.ts` — transport-agnostic group sync protocol (CANARY-SYNC)
- `src/sync-crypto.ts` — AES-256-GCM envelope encryption for sync messages
- `src/presets.ts` — threat-profile presets (family, field-ops, enterprise)
- `src/beacon.ts` — encrypted location beacons and duress alerts
- `src/nostr.ts` — Nostr event builders (kinds 30078, 20078, NIP-17 gift wrap)
- `src/wordlist.ts` — re-exports spoken-token en-v1 wordlist
- `src/counter.ts` — re-exports spoken-token time-based counter
- `src/crypto.ts` — re-exports spoken-token crypto utilities
- `src/index.ts` — barrel re-export
- `app/` — interactive demo app (Vite, builds to docs/)

## Protocol Specs

Layered architecture — each spec builds on the one above:

1. **`spoken-token/PROTOCOL.md`** — generic HMAC-counter-to-words derivation (lives in spoken-token repo)
2. **`GROUPS.md`** — Simple Shared Secret Groups (transport-agnostic group lifecycle)
3. **`NIP-XX.md`** — Nostr transport binding for groups (maps to kinds 30078, 20078, NIP-17)
4. **`CANARY.md`** — full CANARY protocol (extends 1+2 with duress, liveness, beacons, presets)
5. **`NIP-CANARY.md`** — Nostr application profile of NIP-XX for CANARY groups
6. **`INTEGRATION.md`** — enterprise/finance integration guide

## Security-Critical Paths

Be extra careful when modifying:
- `src/token.ts` — duress word derivation, liveness challenges, directional pair generation
- `src/sync-crypto.ts` — AES-256-GCM envelope encryption for group sync messages
- `src/beacon.ts` — encrypted location beacons and duress alert broadcasting
- `src/session.ts` — directional two-party verification (word ordering matters for security)
- `src/group.ts` — group reseeding and member removal (key material lifecycle)

## Conventions

- **British English** — colour, initialise, behaviour, licence
- **ESM-only** — `"type": "module"` in package.json
- **TDD** — write failing test first, then implement
- **Pure functions** — group management returns new state, never mutates input
- **Git:** commit messages use `type: description` format
- **Git:** Do NOT include `Co-Authored-By` lines in commits

## Release & Versioning

**Automated via [forgesworn/anvil](https://github.com/forgesworn/anvil)** — `auto-release.yml` reads conventional commits on push to `main`, bumps the version, and creates a GitHub Release; `release.yml` then runs the pre-publish gates and publishes to npm via OIDC trusted publishing.

| Type | Example | Version Bump |
|------|---------|--------------|
| `fix:` | `fix: handle counter overflow` | Patch (1.0.x) |
| `feat:` | `feat: add liveness API` | Minor (1.x.0) |
| `BREAKING CHANGE:` | In commit body | Major (x.0.0) |
| `chore:`, `docs:`, `refactor:` | `docs: update README` | None |

Tests must pass before release.
