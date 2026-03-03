# Contributing to canary-kit

## Setup

```bash
git clone https://github.com/TheCryptoDonkey/canary-kit.git
cd canary-kit
npm install
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests (vitest) |
| `npm run test:watch` | Watch mode |
| `npm run build` | Compile TypeScript to dist/ |
| `npm run typecheck` | Type-check without emitting |
| `npm run bench` | Run performance benchmarks |
| `npm run demo` | Build and serve interactive demo at localhost:8787 |

## Project Structure

```
src/
  index.ts       — barrel re-export (main entry)
  token.ts       — universal CANARY protocol (derive, verify, liveness)
  encoding.ts    — output encoding (words, PIN, hex)
  session.ts     — directional two-party verification sessions
  derive.ts      — group word/phrase derivation
  verify.ts      — group word verification
  group.ts       — group lifecycle (create, reseed, add/remove members)
  presets.ts     — threat-profile presets (family, field-ops, enterprise)
  beacon.ts      — encrypted location beacons and duress alerts
  nostr.ts       — Nostr event builders (6 event kinds)
  wordlist.ts    — 2048-word en-v1 spoken-clarity wordlist
  counter.ts     — time-based counter derivation
  crypto.ts      — pure JS SHA-256, HMAC-SHA256, hex/base64 utilities
```

Seven subpath exports mirror the source modules: `canary-kit`, `canary-kit/token`, `canary-kit/encoding`, `canary-kit/session`, `canary-kit/wordlist`, `canary-kit/nostr`, `canary-kit/beacon`.

## Conventions

- **British English** — colour, initialise, behaviour, licence
- **Zero dependencies** — no runtime deps. Only vitest, typescript, vite as dev deps.
- **ESM-only** — `"type": "module"` in package.json
- **TDD** — write a failing test first, then implement
- **Input validation** — all public APIs validate inputs and throw on invalid parameters
- **Pure functions** — group management returns new state, never mutates input

## Testing

Tests live alongside source files as `*.test.ts`. The suite includes unit tests, protocol vector tests, and encoding boundary tests (280+ total across 14 files).

```bash
# Run all tests
npm test

# Run a specific test file
npx vitest run src/token.test.ts

# Watch mode
npm run test:watch
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-change`
3. Write tests for your changes
4. Ensure all tests pass: `npm test`
5. Ensure types check: `npm run typecheck`
6. Commit with a conventional message (see below)
7. Open a pull request against `main`

## Commit Messages

This project uses [semantic-release](https://semantic-release.gitbook.io/) — commit message prefixes determine version bumps:

| Prefix | Version bump | Example |
|--------|-------------|---------|
| `feat:` | Minor (1.x.0) | `feat: add liveness token API` |
| `fix:` | Patch (1.0.x) | `fix: handle counter overflow` |
| `docs:` | None | `docs: update API reference` |
| `chore:` | None | `chore: update dev dependencies` |
| `refactor:` | None | `refactor: simplify collision avoidance` |
