# Verification record

23 October 2026. Code `0ba43087ca2c701a143d85ba31464ca3f55a367e`.

Artifact: `canary-local.html`, 264,969 bytes. SHA-256:

```text
13c82ad849bf9dd0c6e0b8ed05a4d3bb945a4cbb5eff98a77352bb03d7525ec6
```

- `npm test -- --maxWorkers=2 --testTimeout=30000`: **722 passed across 29 files**. The fourteen local
  model/vault tests cover setup abbreviation/checksum, directional normal/duress
  words, rotation/drift, encrypted round-trip, wrong passwords, tamper rejection,
  fresh nonces, key clearing and PRF wrapping. New cases cover device-only vault
  parsing/unlock, refusing records with no key slot, refusing portable export
  without recovery, adding recovery later, and rejecting signature-only providers.
- `npm run typecheck`, `npm run typecheck:local` and `git diff --check`: passed.
- `npm run build:local`: passed. Clean bundled HTML and an identical static-site
  candidate with intended headers. Exact script/style hashes and dependency
  notices are included. No pair secret is embedded in the build.
- `npm run test:local`, using existing Chromium headless revision 1243: passed.
  Two isolated browser contexts complete QR pairing from the welcome screen
  **without a vault, nickname, typed input or reference checkbox**. The shown QR
  goes through a canvas-backed MediaStream and actual local decoder. The receiver
  opens words immediately; the creator taps to finish. Storage remains empty
  until explicit Keep. The scanner stops its tracks and requests no audio.
- Normal-camera opening is tested by generating the HTTPS QR, decoding its URL
  and opening that URL in a fresh isolated browser. This part uses a locally
  fulfilled fixture; the independent production check is recorded below. The receiver reaches words without
  opening an in-app camera or creating storage. Word direction matches the maker.
  The early inline script removes the fragment from the current history entry;
  the app consumes its transient copy. Reusing an existing tab works too. A bad
  fragment fails safely. Observed HTTP requests contain no fragment secret.
  Model tests reject insecure/query-bearing addresses, off-site links, malformed
  payloads and executable URI schemes. Both inline scripts have exact CSP hashes.
- A new regression places a 120 × 120 QR inside a 1280 × 720 camera frame.
  It failed before the scanner centre retry and passes afterwards. The scanner
  requests HD video, retains a full-frame pass, retries a central square up to
  960 pixels and permits inverted codes. This is synthetic camera evidence,
  not a physical phone-camera acceptance result.
- Browser checks cover matching normal/duress words, self-echo rejection,
  30-second rotation, manual four-letter setup, camera cancellation and late
  camera permission grants; encrypted keeping/renaming; signature-only fallback;
  device-only save/reload/unlock and adding recovery; keeping a pending pair
  through existing-vault unlock without losing old entries; passphrase backup
  recovery into a fresh context; wrong-password storage preservation; and narrow,
  desktop and direct `file://` use. Browser credential APIs are deterministic
  stubs for success; no claim about a physical authenticator follows.
- Unsaved pairs clear on background/idle with no storage write. Failed storage
  leaves the words available and never claims saved. Completing a device prompt
  after manual lock cannot revive a pair or write a vault. Existing saved vaults
  still lock on background/reload/idle. No app requests leave the local fixture;
  no browser/CSP errors were observed. OS/provider networking is outside that check.

Visual evidence: [mobile welcome](evidence/mobile.png),
[desktop welcome](evidence/desktop.png), [mobile people](evidence/vault-mobile.png).
Welcome screenshots show HTTPS mode served by the local fixture. These contain
no pair secrets or actual user names; the people screenshot uses a
fixture nickname. The updated HTML was opened in **Google Chrome** for owner review.

## Public HTTPS delivery

[Live Canary](https://canary-words.cocoacod256.chatgpt.site/) is public, with no
visitor sign-in. Standalone source `../canary-words-site` commit
`393c4750c688613d18cd78cc3cc307363bb2b170`; Site/version/deployment IDs are in
[evidence/publication.json](evidence/publication.json). Native deployment status
succeeded, followed by independent HTTP and real-browser checks.

The first static-only publication ignored `_headers` and added Cloudflare bot
JavaScript. Strict CSP blocked it. That failed readback is retained in
[hosting-v1.json](evidence/hosting-v1.json), not claimed as a passing build.
The corrected Worker ESM delivery returns only baked HTML plus fixed headers,
rejects non-GET/HEAD and non-root paths, and has no request-body processing,
logging, storage or outgoing calls. Its build/artifact checks and static-response
contract checks passed. `Cache-Control: no-transform` suppresses the injected
script under Cloudflare's documented policy.

[HTTP readback](evidence/hosting.json) now matches the exact local SHA/bytes above,
with the intended CSP (including frame-ancestors), HSTS, MIME, referrer and
permissions headers. The security cookie `__cf_bm` is present and disclosed;
no cookie values are retained. The owner adopted the minimal hosting basis.

`node tools/test-hosted-local.mjs` passed against the actual public HTTPS URL,
without route interception or authentication. Two isolated browsers opened the
page, decoded its QR into a real link, and matched directional words. The receiver
needed no in-app scanner, typing or storage. The fragment and transient value
were removed; no pair persisted before Keep. Only two page GETs were observed,
with no secret, external application request or browser/CSP error. See
[live-browser.json](evidence/live-browser.json),
[live mobile](evidence/live-mobile.png) and [live desktop](evidence/live-desktop.png).
Those screenshots show welcome screens only, with no pair secrets.

The live URL was opened in **Google Chrome**. The owner can now test the normal
iPhone camera on the live page's QR; the local-file opaque QR is a separate
in-app-scanner preview. Native scanner/history/sync software may retain private
links despite address replacement. No one-use/expiry/revocation is promised.

Not evidenced: independent audit, physical GrapheneOS/iPhone camera or passkey
support, measured human one-minute pairing, provider-internal log retention/region,
main-repository hosted CI, merge or release. Native camera/device prompts remain
platform-dependent. The WebKit executable is unavailable; no WebKit pass is claimed.

No test server, fixture, emulator, browser automation process or native camera
is left running. Owner-review Chrome remains open. Task-installed dependencies,
temporary backups, scripts and inventories are removed at handover. The named
static hosting candidate in `local-site/` is retained for review and can be
regenerated with `npm run build:local`. The separate publishing source was pushed
and deployed; the main implementation branch remains local. The shared law-note
correction was pushed as
[jurisdiction-kit PR #35](https://github.com/forgesworn/jurisdiction-kit/pull/35),
with 97 tests and typecheck passing; no merge is claimed.
