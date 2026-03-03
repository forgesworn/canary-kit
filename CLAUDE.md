# CLAUDE.md — canary-kit

Deepfake-proof identity verification. Zero dependencies. Open protocol.

## Commands

- `npm run build` — compile TypeScript to dist/
- `npm test` — run all tests (vitest)
- `npm run test:watch` — watch mode
- `npm run typecheck` — type-check without emitting
- `npm run bench` — run performance benchmarks
- `npm run demo` — build and serve interactive demo at localhost:8787

## Structure

- `src/token.ts` — universal CANARY protocol (derive, verify, liveness, directional pairs)
- `src/encoding.ts` — output encoding (words, PIN, hex)
- `src/session.ts` — directional two-party verification sessions
- `src/derive.ts` — group word/phrase derivation
- `src/verify.ts` — group word verification
- `src/group.ts` — group lifecycle (create, reseed, add/remove members)
- `src/presets.ts` — threat-profile presets (family, field-ops, enterprise)
- `src/beacon.ts` — encrypted location beacons and duress alerts
- `src/nostr.ts` — Nostr event builders (6 event kinds)
- `src/wordlist.ts` — 2048-word en-v1 spoken-clarity wordlist
- `src/counter.ts` — time-based counter derivation
- `src/crypto.ts` — pure JS SHA-256, HMAC-SHA256, hex/base64 utilities
- `src/index.ts` — barrel re-export
- `app/` — interactive demo app (Vite, builds to docs/)

## Protocol Specs

- `CANARY.md` — full protocol specification (CANARY-DERIVE, CANARY-DURESS, CANARY-WORDLIST)
- `NIP-CANARY.md` — Nostr binding (6 event kinds: 38800, 28800, 38801, 28801, 28802, 20800)
- `INTEGRATION.md` — enterprise/finance integration guide

## Conventions

- **British English** — colour, initialise, behaviour, licence
- **Zero dependencies** — no runtime deps, only vitest + typescript + vite as dev deps
- **ESM-only** — `"type": "module"` in package.json
- **TDD** — write failing test first, then implement
- **Pure functions** — group management returns new state, never mutates input
- **Git:** commit messages use `type: description` format
- **Git:** Do NOT include `Co-Authored-By` lines in commits

## Release & Versioning

**Automated via semantic-release** — version bumps and npm publishing happen automatically when you push to `main`.

| Type | Example | Version Bump |
|------|---------|--------------|
| `fix:` | `fix: handle counter overflow` | Patch (1.0.x) |
| `feat:` | `feat: add liveness API` | Minor (1.x.0) |
| `BREAKING CHANGE:` | In commit body | Major (x.0.0) |
| `chore:`, `docs:`, `refactor:` | `docs: update README` | None |

Tests must pass before release. GitHub Actions uses OIDC trusted publishing.
