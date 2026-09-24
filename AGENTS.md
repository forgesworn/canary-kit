# AGENTS.md: canary-kit

Instructions for AI coding agents working on this repository.

## What This Project Is

Coercion-resistant spoken verification library. Derives spoken words from shared secrets using HMAC-SHA256 counters, built on `spoken-token`. Adds duress signalling, liveness checks, group verification, encrypted location beacons and Nostr transport. ESM-only, TypeScript native.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript to dist/ |
| `npm run build:app` | Build the demo app to docs/ |
| `npm test` | Run all tests (vitest) |
| `npm run test:watch` | Watch mode |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Run ESLint |
| `npm run bench` | Run performance benchmarks |
| `npm run demo` | Build and serve the interactive demo at localhost:8787 |
| `npm run test:e2e` | Run all Playwright e2e tests |
| `npm run test:e2e:protocol` | Run protocol-specific e2e tests |

## Project Structure

```
src/
  index.ts      : barrel re-export (main entry)
  token.ts      : universal CANARY protocol (derive, verify, liveness, directional pairs)
  encoding.ts   : re-exports spoken-token encoding (words, PIN, hex)
  session.ts    : directional two-party verification sessions
  derive.ts     : group word/phrase derivation
  verify.ts     : group word verification
  group.ts      : group lifecycle (create, reseed, add/remove members)
  sync.ts       : transport-agnostic group state synchronisation (CANARY-SYNC)
  sync-crypto.ts: AES-256-GCM envelope encryption for sync messages, keyed via nsec-tree
  presets.ts    : threat-profile presets (family, field-ops, enterprise)
  beacon.ts     : encrypted location beacons and duress alerts
  nostr.ts      : Nostr event builders (NIP-XX transport for SSG groups)
  wordlist.ts   : re-exports spoken-token en-v1 wordlist
  counter.ts    : re-exports spoken-token time-based counter
  crypto.ts     : re-exports spoken-token crypto utilities
app/            : interactive demo app (Vite, builds to docs/)
```

Subpath exports: `canary-kit`, `canary-kit/token`, `canary-kit/encoding`, `canary-kit/session`, `canary-kit/wordlist`, `canary-kit/nostr`, `canary-kit/beacon`, `canary-kit/sync`.

## Dependencies

- `spoken-token`: core derivation, encoding, wordlist and counter primitives (re-exported)
- `nsec-tree`: deterministic Nostr sub-identity derivation, used by `src/sync-crypto.ts` for persona-based group signing
- `@scure/bip32`, `@scure/bip39`: mnemonic key recovery in the demo app
- `@forgesworn/shamir-words`: Shamir secret sharing with BIP-39 word output, used by the demo app

## Conventions

- British English: colour, initialise, behaviour, licence
- ESM-only: `"type": "module"` in package.json
- TDD: write a failing test first, then implement
- Pure functions: group management returns new state, never mutates input
- Input validation: all public APIs validate inputs and throw on invalid parameters

## Commit Messages

Uses [semantic-release](https://semantic-release.gitbook.io/), driven by [forgesworn/anvil](https://github.com/forgesworn/anvil): `auto-release.yml` reads conventional commits on push to `main`, bumps the version and creates a GitHub Release; `release.yml` then runs the pre-publish gates and publishes to npm via OIDC trusted publishing.

| Prefix | Version bump |
|--------|-------------|
| `fix:` | Patch (1.0.x) |
| `feat:` | Minor (1.x.0) |
| `BREAKING CHANGE:` in body | Major (x.0.0) |
| `docs:`, `chore:`, `refactor:` | None |

Do not include `Co-Authored-By` lines in commits. Tests must pass before release.

## Testing

Tests live alongside source files as `*.test.ts`. Run `npm test` before committing. Run `npm run typecheck` to verify types.

## Key Patterns

- All group functions are pure: they return new `GroupState`, never mutate input
- Crypto primitives in `src/crypto.ts` are synchronous pure JS (SHA-256, HMAC-SHA256)
- `src/beacon.ts` and `src/sync-crypto.ts` use async crypto (`crypto.subtle` for AES-256-GCM)
- Nostr event builders return `UnsignedEvent`; signing is the caller's responsibility
- The sync protocol validates admin checks, epoch ordering and replay protection

## Security-Critical Paths

Be extra careful when modifying:
- `src/token.ts`: duress word derivation, liveness challenges, directional pair generation
- `src/sync-crypto.ts`: AES-256-GCM envelope encryption for group sync messages
- `src/beacon.ts`: encrypted location beacons and duress alert broadcasting
- `src/session.ts`: directional two-party verification (word ordering matters for security)
- `src/group.ts`: group reseeding and member removal (key material lifecycle)

## Protocol Specs

- `CANARY.md`: full protocol specification
- `NIP-CANARY.md`: Nostr application profile of NIP-XX for CANARY groups
- `GROUPS.md`: Simple Shared Secret Groups (transport-agnostic group lifecycle)
- `NIP-XX.md`: Nostr transport mapping for SSG groups (kinds 30078, 20078 and 14)
- `INTEGRATION.md`: enterprise/finance integration guide
- `THREAT-MODEL.md`: adversary profiles and attack trees
- `AUDIT.md`: adversarial security audit findings
- `REGULATORY.md`: regulatory alignment notes
