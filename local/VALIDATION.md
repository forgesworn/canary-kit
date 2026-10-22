# Verification record

22 October 2026. Code `b1d33e1b6a1dc5d18a01c8ab173e19356cd2e2ee`.

Artifact: `canary-local.html`, 256,501 bytes. SHA-256:

```text
7fc02a9ce7a515efa48856cd5cf8550cc1fa82c6c014711118859ded4f68a098
```

- `npm test -- --maxWorkers=2`: **718 passed across 29 files**. The ten local
  model/vault tests cover 4-letter setup expansion, checksum/format rejection,
  paired role direction, rotation and drift, both sides' duress, encrypted
  round-trip, wrong passwords, tamper rejection, fresh nonces, master-key clearing,
  mocked PRF device wrapping and passphrase recovery without the device slot.
- `npm run typecheck` and `npm run typecheck:local`: passed.
- `npm run build:local`: passed. One bundled HTML and a static hosting candidate
  with security headers are generated. Script/style hashes and dependency
  licence notices are included. No pair secret is embedded in the build.
- `npm run test:local` with existing Chromium headless revision 1243: passed.
  Actual localhost and `file://` loads; no external network requests or browser/
  CSP errors. Two isolated browser contexts simulate the two devices. The
  displayed QR is fed through a canvas-backed MediaStream to the scanner;
  successful scan stops tracks. A separate late-permission-after-cancellation
  test confirms that late tracks are stopped. No physical camera is opened.
- The browser flow checks nickname/secret encryption in localStorage and backup
  JSON; recovery into a fresh browser context; incorrect-password preservation
  of existing storage; reload, background and five-minute idle locking; full-word
  normal/duress checks, replay-window rotation and echo rejection; abbreviated
  manual setup; a signature-only provider failing to enable device unlock; and
  narrow/mobile and desktop layouts. All fixture resources are closed/deleted.

Visual evidence: [mobile welcome](evidence/mobile.png),
[desktop welcome](evidence/desktop.png), [mobile vault](evidence/vault-mobile.png).
No retained screenshot contains a pair secret or an actual user's nickname.

Not evidenced: independent audit, physical GrapheneOS/iPhone camera or passkey
support, measured human one-minute pairing, actual HTTPS hosting headers/logs,
public deployment, hosted CI, PR or release. WebAuthn PRF success is checked with
a deterministic provider stub at the vault layer; this is not hardware passkey
acceptance. The earlier WebKit executable was unavailable; no WebKit pass is claimed.

No test server, fixture, emulator, browser automation process or native camera
is left running. Only Chrome opened for owner review remains. Task-installed
dependencies and temporary inventory files are removed at handover. The generated
static hosting candidate is retained as the named reviewable delivery artifact;
it can also be regenerated with `npm run build:local`.
