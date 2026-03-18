# [1.2.0](https://github.com/forgesworn/canary-kit/compare/v1.1.0...v1.2.0) (2026-03-18)


### Bug Fixes

* show pubkey in sync toast to diagnose identity mismatch ([223f7ef](https://github.com/forgesworn/canary-kit/commit/223f7ef7a2bd675eab08947eba29eb0ab6ae3837))


### Features

* move Sync Groups to footer for mobile visibility ([26435f3](https://github.com/forgesworn/canary-kit/commit/26435f37bcfa601e89e19cd1bc7312df777e9d6e))

# [1.1.0](https://github.com/forgesworn/canary-kit/compare/v1.0.5...v1.1.0) (2026-03-18)


### Features

* add manual "Sync Groups" button to sidebar ([c1201bf](https://github.com/forgesworn/canary-kit/commit/c1201bf26a13db60e66b51772faf8b3ffc064f61))

## [1.0.5](https://github.com/forgesworn/canary-kit/compare/v1.0.4...v1.0.5) (2026-03-18)


### Bug Fixes

* vault sync reliability and push diagnostics ([01ea70d](https://github.com/forgesworn/canary-kit/commit/01ea70dfc103e7bde093e5b09032a46d59a45bd4))

## [1.0.4](https://github.com/forgesworn/canary-kit/compare/v1.0.3...v1.0.4) (2026-03-18)


### Bug Fixes

* iOS/Safari push notification support ([8f44ef4](https://github.com/forgesworn/canary-kit/commit/8f44ef47073f90d0616ae76afefde3d6a4ef8c86))

## [1.0.3](https://github.com/forgesworn/canary-kit/compare/v1.0.2...v1.0.3) (2026-03-18)


### Bug Fixes

* footer version, notification prompt, vault sync reliability ([24e38d0](https://github.com/forgesworn/canary-kit/commit/24e38d01a8e4de07de876f2cc23553fd617fa9e0))

## [1.0.2](https://github.com/forgesworn/canary-kit/compare/v1.0.1...v1.0.2) (2026-03-18)


### Bug Fixes

* version display, mobile UX, vault sync, and push server ([cd81a3c](https://github.com/forgesworn/canary-kit/commit/cd81a3ca5187da3583a95e29e7d9913416569a4a))

## [1.0.1](https://github.com/forgesworn/canary-kit/compare/v1.0.0...v1.0.1) (2026-03-18)


### Bug Fixes

* add CI retries for flaky Chromium headless crashes ([5656c9b](https://github.com/forgesworn/canary-kit/commit/5656c9bbb19dfedf487716d9acd963cd26bf994a))

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
