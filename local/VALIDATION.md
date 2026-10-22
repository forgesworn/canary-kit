# Verification record

23 October 2026. Code `b15046e69fd930006e5e620ef30459236d6308e1`.

Artifact: `canary-local.html`, 260,357 bytes. SHA-256:

```text
ab9d1684410318b459e2e0e5fb46bfab6f0dd79aa7e2933ae024bb525a9fe98d
```

- `npm test -- --maxWorkers=2`: **720 passed across 29 files**. The twelve local
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
These contain no pair secrets or actual user names; the people screenshot uses a
fixture nickname. The updated HTML was opened in **Google Chrome** for owner review.

Owner reported “QR doesn’t scan”; scanning method/device has not yet been
confirmed. The QR is an opaque secret for Canary’s own scanner, not a web link
that a normal camera can open. The updated page explains this. A separate,
reproduced downsampling weakness was fixed; this does not establish that the
owner’s reported failure is resolved. Native browser camera permissions,
secure-context requirements and real lens/focus remain outside synthetic proof.

Not evidenced: independent audit, physical GrapheneOS/iPhone camera or passkey
support, measured human one-minute pairing, actual HTTPS hosting headers/logs,
public deployment, hosted CI, PR or release. Native camera/device prompts remain
platform-dependent. The WebKit executable is unavailable; no WebKit pass is claimed.

No test server, fixture, emulator, browser automation process or native camera
is left running. Owner-review Chrome remains open. Task-installed dependencies,
temporary backups, scripts and inventories are removed at handover. The named
static hosting candidate in `local-site/` is retained for review and can be
regenerated with `npm run build:local`. No push or deployment was performed.
