# GEMINI.md -- canary-kit

Coercion-resistant spoken verification library. Extends `spoken-token` with duress, liveness, groups, Nostr transport, and encrypted location beacons.

## Commands

- `npm run build` -- compile TypeScript to dist/
- `npm test` -- run all tests (vitest)
- `npm run typecheck` -- type-check without emitting
- `npm run lint` -- run ESLint
- `npm run bench` -- run performance benchmarks
- `npm run demo` -- build and serve interactive demo at localhost:8787
- `npm run test:e2e` -- run Playwright e2e tests

## Dependencies

Runtime (5 packages):
- **`spoken-token`** -- core derivation, encoding, wordlist, and verification primitives
- **`nsec-tree`** -- deterministic Nostr sub-identity derivation for persona-based group signing
- **`@forgesworn/shamir-words`** -- Shamir secret sharing with BIP-39 word output
- **`@scure/bip32`** and **`@scure/bip39`** -- mnemonic key recovery in demo app

## Structure

```
src/
  index.ts         -- barrel re-export (main entry)
  token.ts         -- universal CANARY protocol (derive, verify, liveness, directional pairs)
  encoding.ts      -- re-exports spoken-token encoding (words, PIN, hex)
  session.ts       -- directional two-party verification sessions
  derive.ts        -- group word/phrase derivation
  verify.ts        -- group word verification
  group.ts         -- group lifecycle (create, reseed, add/remove members)
  sync.ts          -- transport-agnostic group state synchronisation (CANARY-SYNC)
  sync-crypto.ts   -- AES-256-GCM envelope encryption for sync messages
  presets.ts       -- threat-profile presets (family, field-ops, enterprise)
  beacon.ts        -- encrypted location beacons and duress alerts
  nostr.ts         -- Nostr event builders (kinds 30078, 20078, kind 14 rumour)
  wordlist.ts      -- re-exports spoken-token en-v1 wordlist
  counter.ts       -- re-exports spoken-token time-based counter
  crypto.ts        -- re-exports spoken-token crypto utilities
app/               -- interactive demo app (Vite, builds to docs/)
```

Eight subpath exports: `canary-kit`, `canary-kit/token`, `canary-kit/encoding`, `canary-kit/session`, `canary-kit/wordlist`, `canary-kit/nostr`, `canary-kit/beacon`, `canary-kit/sync`.

## Conventions

- **British English** -- colour, initialise, behaviour, licence
- **ESM-only** -- `"type": "module"` in package.json
- **TDD** -- write failing test first, then implement
- **Pure functions** -- group management returns new state, never mutates input
- **Input validation** -- all public APIs validate inputs and throw on invalid parameters
- **Commit messages** -- `type: description` format (feat:, fix:, docs:, chore:, refactor:). No Co-Authored-By lines.

## Key Patterns

- All group functions return new `GroupState`, never mutate input
- Crypto in `src/crypto.ts` is synchronous pure JS (SHA-256, HMAC-SHA256) via spoken-token
- Only `src/beacon.ts` and `src/sync-crypto.ts` use async crypto (`crypto.subtle` for AES-256-GCM)
- Nostr event builders return `UnsignedEvent` -- signing is the caller's responsibility
- Sync protocol validates against 6 invariants (admin checks, epoch ordering, replay protection)

## Protocol Specs

- `CANARY.md` -- full protocol specification (CANARY-DERIVE, CANARY-DURESS, CANARY-WORDLIST)
- `NIP-CANARY.md` -- Nostr binding (kinds 30078, 20078, NIP-17 gift wrap)
- `GROUPS.md` -- Simple Shared Secret Groups (transport-agnostic group lifecycle)
- `NIP-XX.md` -- Nostr transport mapping for SSG groups
- `INTEGRATION.md` -- enterprise/finance integration guide
- `THREAT-MODEL.md` -- adversary profiles and attack trees
- `AUDIT.md` -- adversarial security audit findings
- `REGULATORY.md` -- regulatory alignment (FCA, RBI, UAE TDRA, EU AI Act, eIDAS)

## Testing

685 tests across 24 files. Tests live alongside source as `*.test.ts`. Run `npm test` before committing. Run `npm run typecheck` to verify types.

## Release

Automated via semantic-release. `feat:` = minor, `fix:` = patch, `BREAKING CHANGE:` in body = major. GitHub Actions with OIDC trusted publishing.
