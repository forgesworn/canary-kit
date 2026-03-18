# [1.0.0](https://github.com/forgesworn/canary-kit/compare/v0.11.0...v1.0.0) (2026-03-18)


* feat!: update to spoken-token v2, refactor session for domain separation ([a0c9d86](https://github.com/forgesworn/canary-kit/commit/a0c9d86bde9a15ca8f44c75388eaa4fc38e2b731))


### Bug Fixes

* remove unnecessary type assertions flagged by eslint ([9e68117](https://github.com/forgesworn/canary-kit/commit/9e68117a3aa0afedf4e027dbf88d94ee20b80a48))
* restore necessary type assertions for array spreads from any ([19ce954](https://github.com/forgesworn/canary-kit/commit/19ce954c3ffba411396a3b54d5c183e93cc60474))
* security hardening — input validation, field stripping, key zeroing ([c10f60c](https://github.com/forgesworn/canary-kit/commit/c10f60c6a3c8be1d9df61bf21a613d0f37d3638d))
* strip extra fields and validate geohash in decrypt functions ([7ceb00b](https://github.com/forgesworn/canary-kit/commit/7ceb00b9020a454c78adf9add4091ccbfa5d4b18))
* use colon-separated context in call simulation duress derivation ([86791c7](https://github.com/forgesworn/canary-kit/commit/86791c7825227eb1c58534ab43cd11c1d9afa966))


### BREAKING CHANGES

* Session tokens and duress tokens change due to
spoken-token v2's PIN bias fix and directional pair domain separation.

- Bump spoken-token to ^2.0.0
- Refactor session.ts: use deriveDirectionalPair for myToken/theirToken
  instead of constructing null-byte contexts manually (spoken-token v2
  blocks null bytes in the public deriveToken API)
- Inline session duress detection using colon-separated context format
  (pair:namespace:role:duress) for collision avoidance
- Update conformance vectors: U-04 PIN 2818→1429, U-07 PIN 0973→9160,
  U-14 empty context now expects error, U-16 PIN 0453→6004
- Update session tests to use deriveDirectionalPair and new duress context

# [0.11.0](https://github.com/TheCryptoDonkey/canary-kit/compare/v0.10.0...v0.11.0) (2026-03-17)


### Bug Fixes

* add missing tolerance field to sync test GroupState objects ([4d3f6e0](https://github.com/TheCryptoDonkey/canary-kit/commit/4d3f6e008547f4b22507bbbd9fb6320f0baade92))
* security hardening — event verification, size limits, key zeroing, future timestamp bounds ([ab48a3d](https://github.com/TheCryptoDonkey/canary-kit/commit/ab48a3de6a67625c5970950802c71325e0a76869))


### Features

* rewrite Nostr event builders for NIP-XX (30078, 20078, kind 14) ([91f364a](https://github.com/TheCryptoDonkey/canary-kit/commit/91f364a1d0081bb3f0ab57e32153118e14258e3c))

# [0.10.0](https://github.com/TheCryptoDonkey/canary-kit/compare/v0.9.0...v0.10.0) (2026-03-17)


### Bug Fixes

* increase timeout for tolerance=3 duress regression test ([a822978](https://github.com/TheCryptoDonkey/canary-kit/commit/a8229784a11bb593702f5b5327b0d9fbab529d2c))
* update demo URL from GitHub Pages to canary.trotters.cc ([aad3e8d](https://github.com/TheCryptoDonkey/canary-kit/commit/aad3e8dfccc36f1ffc05443e472dd44f1672d996))


### Features

* extract generic primitives to spoken-token dependency ([63ca72d](https://github.com/TheCryptoDonkey/canary-kit/commit/63ca72d01192fd564f31d1ef9191b54e895b0809))
* extract generic primitives to spoken-token dependency ([91ab2d8](https://github.com/TheCryptoDonkey/canary-kit/commit/91ab2d85d253c1d3a74c569f3db246535cf28619))
