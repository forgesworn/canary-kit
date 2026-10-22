# Verification record

23 October 2026. Code `3fc6a02c1d14f1cd57240efd6b59f16b23a9c0ba`.

Artifact: `canary-local.html`, 262,975 bytes. SHA-256:

```text
0c03fc4681ea3b32aaff55eb63b0a85632d4503e85eec2cd67662e0f700ecdb7
```

- `npm test -- --maxWorkers=2`: **722 passed across 29 files**. The fourteen local
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
  and opening that URL in a fresh isolated browser. The HTTPS address is a locally
  fulfilled fixture, not a real deployment. The receiver reaches words without
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

Owner confirmed the failure was using a normal phone camera on the opaque local
QR. HTTPS mode now generates a private setup link for normal cameras; local-file
mode explicitly remains an in-app scanner preview. No hosted address is live yet,
so the Mac file cannot demonstrate cross-phone normal-camera opening. The
separate camera-downsampling regression was fixed as well. Native scanner apps,
history sync or extensions could retain the private link despite early address
replacement. No one-use/expiry/revocation or perfect erasure is claimed.

Not evidenced: independent audit, physical GrapheneOS/iPhone camera or passkey
support, measured human one-minute pairing, actual HTTPS hosting headers/logs,
public deployment, hosted CI, PR or release. Native camera/device prompts remain
platform-dependent. The WebKit executable is unavailable; no WebKit pass is claimed.

No test server, fixture, emulator, browser automation process or native camera
is left running. Owner-review Chrome remains open. Task-installed dependencies,
temporary backups, scripts and inventories are removed at handover. The named
static hosting candidate in `local-site/` is retained for review and can be
regenerated with `npm run build:local`. No push or deployment was performed.
