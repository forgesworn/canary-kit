# Signet Feature Matrix

Canary is the reference consumer for Signet Access. A Signet feature is only considered production-ready for Canary when there is an automated gate proving the user-facing integration works.

Status key:

- **Covered**: implemented and guarded by automated tests.
- **SDK covered**: covered in `signet-login`, but not exposed by Canary.
- **N/A**: not a responsibility of that project.
- **Gap**: expected but not yet covered.

| Feature | signet-login SDK | Canary reference consumer | MySignet signer app | Required gate |
| --- | --- | --- | --- | --- |
| NIP-07 browser extension | Covered by SDK signer tests, including NIP-44 present/missing behavior. | Covered by adapter config and live-signer capability rejection tests. | N/A. MySignet serves signer requests rather than acting as a NIP-07 extension. | `npm test` in `signet-login`; `app/nostr/signet.test.ts` in Canary. |
| Amber / NIP-55 | SDK covered by Amber URL/callback tests. | SDK covered, but not exposed in Canary because Canary requires a live signer with NIP-44 after login. | N/A. Amber is a separate Android signer. | Keep SDK tests green; decide separately whether Canary should expose Amber as auth-only. |
| Signet remote QR | Covered by SDK modal/device tests and redirect callback persistence tests. | Exposed, but Canary rejects auth-only sessions unless a live bunker handoff is returned. | Covered by auth and approval flows in MySignet. | Existing SDK tests plus Canary adapter capability rejection. |
| NostrConnect | Covered by SDK NostrConnect modal/status tests and NIP-46 restore E2E. | Covered by Chromium, WebKit, live deploy, and public-relay smoke tests. | Covered by MySignet approve-connect, paste, and cross-app tests. | `npm run test:e2e:signet`, `npm run test:e2e:signet:webkit`, `npm run test:e2e:real-relay`. |
| bunker restore | Covered by SDK NIP-46 restore E2E. | Covered by Canary NostrConnect browser regression after reload. | Covered by MySignet NIP-46 route tests. | Pair, reload, `restoreSession()`, NIP-44 round-trip. |
| nsec fallback | Covered by SDK local signer tests. | Covered by Canary feature-surface E2E; verifies fallback stays out of Signet session storage. | N/A for Signet serving. MySignet separately manages local identities. | `e2e/protocol/signet-feature-surface.spec.ts`. |
| storage/session restore | Covered by SDK storage, redirect callback, logout, and NIP-46 restore tests. | Covered through persisted bunker restore after reload. | Covered by app DB/session tests. | `tests/nip46-restore.e2e.test.ts`; Canary NostrConnect browser regression. |
| logout/clear state | Covered by SDK logout storage tests. | Covered by Canary adapter logout test. | Covered by MySignet app state tests. | `tests/headless.test.ts`; `app/nostr/signet.test.ts`. |
| NIP-44 present/missing behavior | Covered by SDK NIP-07/local/bunker signer tests. | Covered by Canary adapter rejection tests and NIP-44 round-trip E2E. | Covered by MySignet NIP-46 server and connected-client tests. | Reject missing NIP-44; pass encrypt/decrypt round-trip. |
| timeout/abort/error diagnostics | Covered by SDK NostrConnect status tests. | Covered by Canary diagnostics panel E2E. | Covered by MySignet approve-connect failure tests. | Diagnostics must show relay, timeout window, copy action, retry action. |
| mobile copy/paste fallback | Covered by SDK NostrConnect QR/URI copy tests. | Covered by Canary NostrConnect URI copy and diagnostics tests. | Covered by MySignet verification WebKit/mobile paste tests. | WebKit mobile QR/paste test must remain green. |

Current hard gates:

- Canary fails CI when `signet-login` is not the latest npm release.
- Canary runs Chromium and WebKit Signet regressions.
- Canary scheduled smokes run against deployed `canary.trotters.cc` and `mysignet.app`.
- MySignet deploy tests include mobile QR/paste fallback coverage.

Known decision:

- Amber is implemented and tested in `signet-login`, but not enabled in Canary. Canary currently requires a live signer with NIP-44 for invite decryption and event signing; Amber returns an auth-only session in the SDK. Enabling Amber in Canary needs a product decision about auth-only mode.
