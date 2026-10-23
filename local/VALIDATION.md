# Verification record

23 October 2026. Code `1ac118f5c4287159f08a72989c77d288c45207b7`.

Artifact: `canary-local.html`, 389,302 bytes. SHA-256:

```text
aa5f173c7e2eaa1fab8091cb4c919d23c7ee12ef51fb4e3b8c901dd53b3174a9
```

- `npm test -- --maxWorkers=2 --testTimeout=30000`: **733 passed across 30 files**. The local
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
`8921e7215b12a19f4377e024065554154beb36b0`; Site/version/deployment IDs are in
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
were removed; no pair persisted before Keep. Only three page GETs were observed,
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

## Pair setup and recovery correction

The owner reported that words refreshed before both people finished. Setup now
uses the fixed pair reference, with Keep above the rotating words for unsaved
pairs. The countdown continues refreshing spoken tokens; it does not end setup.
Either holder can deliberately show that same pair's QR again, including after
saving/reloading. The recipient gets the opposite speaking role. Existing version
1 links remain valid; recovery from the original receiver uses an explicit role
in a version 2 invite. Resaving an existing secret/role preserves the saved name
and avoids a duplicate entry. Background and five-minute idle locking remain.

TDD evidence: the new model test first failed because a receiver's invite restored
the wrong speaking role; the new browser check first failed because setup had
no fixed code. Both pass after the change. All 723 tests, global/local typechecks,
build and full Chromium fixture flow passed. The browser harness now fixes dates
per context and advances dates explicitly with timers, avoiding real-time clock
drift on a busy machine; cleanup closes all contexts even after failure.

The fixture checks fixed-code survival across multiple rotations, Keep remaining
available, idle clearing on one phone, restoration from the other saved/reloaded
phone, matching directional words, and reuse of an existing encrypted record.
The actual public check independently verifies fixed-code survival after refresh,
Keep fitting on the 390 × 844 viewport, reverse-role QR recovery and no secret
in server requests. No browser/CSP errors occurred; exact production bytes and
security headers passed. [Pairing layout](evidence/pairing-mobile.png) uses
explicit dummy code/phrases, not the generated test pair's values.

Publication v3 retains the same public origin and storage format; source/deploy
identifiers are in `evidence/publication.json`. No broader messaging service or
new hosting-data category was introduced. The owner reported partial physical
pairing; completion of the revised flow on their phones remains owner acceptance.

## Private contacts and group vouches — publication v4

Feature commit `1ac118f5c4287159f08a72989c77d288c45207b7` adds optional
group-scoped independent signing keys, signed personal vouches and recipient-
encrypted handoffs. It reuses Canary/Spoken Token, the attestation templates,
Nostr Tools/Noble signatures and NIP-44 encryption. No Nostr account, relay,
remote signer, public trust graph or platform admission adapter is used.
The concrete protocol and limits are in [PRIVATE-TRUST.md](PRIVATE-TRUST.md).

The final **733 tests / 30 files**, global/local typechecks, standalone build
and diff checks passed. The new trust tests cover signatures without SDK cache
trust, subject/group/purpose/nonce/account binding, fresh key proof before
vouching, clock skew, replay/expiry, explicit issuer policy, self-vouch rejection,
withdrawals, the 90-day maximum, encrypted recipient binding, QR size and bounded
decompression. A new vault regression first failed when contact evidence/group
keys were discarded, then passed with the version 2 encrypted payload. Previous
array payloads remain readable; portable backup recovery preserves group keys.

`tools/test-private-trust.mjs` passed with three isolated mobile browser contexts
against both a local HTTPS fixture and the actual public URL. It verifies the
fresh-key exchange before a deliberate vouch, encrypted handoff/Keep, refusal
of an unaccepted issuer, separate fresh voucher proof plus explicit trust,
successful holder proof with account-context binding, saved pending-exchange
recovery after reload, replay rejection and a delivered withdrawal rejecting
the next member proof. It decodes actual public-card and encrypted-transfer QRs,
checks encrypted local storage and phone-width layout, and observed no external
app request, transfer fragment in HTTP requests or browser/CSP error.

Reports: [fixture](evidence/private-trust.json),
[live](evidence/private-trust-live.json). Screenshots:
[kept vouch](evidence/private-vouch-mobile.png),
[historical keeper check](evidence/private-check-mobile.png). They use fixture
names and public verification codes, with no private signing key or pair seed.
WebAuthn/PRF success is stubbed in this browser suite; it does not qualify a
physical authenticator. Group vouching requires return steps and is not claimed
to be a one-scan or measured one-minute ceremony.

The same public origin now serves v4. Publishing-source commit
`8921e7215b12a19f4377e024065554154beb36b0` passed the Worker artifact/static-
response contract checks, was pushed by the supported source helper, saved and
deployed successfully. Independent HTTP readback matched all **389,302 bytes**
and the exact SHA above, with expected CSP, no-transform, transport, permissions,
MIME and referrer headers. Deployment IDs and readbacks are in the publication
record. The live page was opened in **Google Chrome**.

The legal-cover feature gap check updates local data, key custody, recovery,
public-card/recipient disclosure and withdrawal-freshness facts. The same static-
software assessment and hosting basis are retained; legal interpretation marks
and the broader IPA website-owner boundary remain explicit. No independent legal
clearance, security audit, automatic account ownership or physical phone-camera
acceptance is inferred. Signet integration remains a separate future adapter.

## Phone experience and remote setup — 23 October 2026

The current candidate replaces the old local-browser journey with
`tools/test-mobile.mjs` (`npm run test:local`). The hosted runner uses the same
journey with `CANARY_MOBILE_URL`. Earlier evidence above belongs to its named
release; it does not qualify these changes.

- **737 tests / 31 files passed**, including new remote transcript rejection,
  encrypted pending-exchange recovery and original-array/version-2 vault
  migration. New encrypted saves use payload version 3 so older builds reject
  them instead of silently discarding pending setup. Global and local TypeScript
  checks and the standalone build passed.
- Three independent phone vaults exercised in-person QR opening and matching
  directions, fixed setup-code comparison, encrypted persistence before outgoing
  display, normal/private-signal/mismatch checks, one-person quick access and
  reload/background recovery. A full public-invite/encrypted-reply round trip
  survived both people switching away; consumed replies were rejected.
- The suite checks an empty/wrong browser does not create a new vault from a
  reply; unsupported PRF falls back to passphrase; wrong passphrases fail;
  portable encrypted recovery restores; storage failures do not display a
  successful outgoing QR; late native credential results after lock cannot
  persist/reopen an exchange. Canvas-stream QR scanning stops all tracks and a
  cancelled late camera grant is stopped.
- An actual service worker installed, then offline reload, vault unlock and
  words succeeded. Cache inspection found exactly the five public shell files.
  App requests carried no fragments, pair secrets, exchange keys or request
  bodies. No third-party application requests or browser/CSP errors occurred.
- Reviewed mobile/desktop, installation and check screenshots under `evidence/`.
  The quick-check button fits a 390×720 CSS-pixel viewport. Rendered evidence
  substitutes dummy words and a dummy pair code.
- The standalone downloaded HTML also pairs, saves with passphrase and opens
  words without a host or service worker. The HTTPS app includes its separate
  manifest/icon links; these links are removed from the standalone download.
- Private group/vouch browser regression passed after the navigation change:
  signed claims, deliberate issuer approval, fresh key proofs, replay/withdrawal
  rejection, QR decoding and encrypted local data remained intact.

`evidence/mobile-journey.json` records the local run. Actual credential operations
are mocked PRF providers; this does **not** qualify iPhone or GrapheneOS passkeys,
biometrics/PIN, native installation/storage migration, physical camera scanning,
call multitasking or a one-minute human usability target. No independent security
audit or UK-law clearance is claimed. The design/reuse map and remaining limits
are in `MOBILE-EXPERIENCE.md`.

### Published phone/PWA evidence

Site version **5** deployed successfully on the same public origin from website
source commit `cc95b579a31ac64a0cf9fde5f0508cf566c136a1`; app implementation is
`82817b61632e81cc4e1236faad175ea3566430ea`. The native publication receipt is in
`evidence/publication.json` (v4 preserved separately).

The live mobile suite passed the same setup, check, app-switch, remote exchange,
replay, fallback and recovery journey. Real service-worker offline reload,
unlock and words also passed on the deployed origin; native credentials remain
stubs. All **six** served public files matched the pushed source byte for byte,
with expected MIME types, CSP, no-transform and worker scope headers; the offline
cache has **five** public shell files (it does not cache the worker itself).
See `evidence/mobile-live.json` and `evidence/mobile-hosting.json`. This readback
closes the browser/publication gate, not the physical phone or independent audit
gates above. The live app was opened in Google Chrome. Task preview/test servers
and automation browsers were stopped afterwards.

Version **6** applies a final CSS correction so the two secondary mobile setup
links have separate 44px touch targets. Website source is
`fab2f6d9ddbc61bcc19291241f02706d40b31f06`, app implementation plus that correction
is `b1af99669e15d3467adf5027e10b6b9aae597be3`. The full local and live mobile
journey and actual offline reload passed again, and six public files matched
exactly. Current receipts, screenshots and hashes supersede v5; the v5 receipt
is retained as `evidence/publication-v5.json`. The private-group regression
passed against v5's identical application code; v6 changes only CSS. Public
file readback is reproducible with `node tools/check-public-local.mjs`.

## Add another device — 23 October 2026

The current candidate adds a public request QR and recipient-encrypted people
file, explicit code confirmation and a merge into the receiving vault. Existing
contacts/credentials and the source are preserved. Private group keys and
unfinished exchanges are excluded; there is no automatic sync or deletion.

**742 tests / 32 files passed**, plus global/local TypeScript and standalone build.
New model tests cover recipient/direction binding, chunk integrity/order/count,
expiry, keyed manifest privacy, size limits, duplicate/ID merge behaviour and
encrypted resume/recovery. Arrays/v2/v3 vaults upgrade to payload v4. The device
browser suite passed the complete transfer, scanner/share lifecycle, failed-save
retry, preview clearing, exact resend, merge, replay/wrong-request refusal and
reload. The existing mobile setup/normal/duress/recovery/offline suite passed.
See `DEVICE-COPY.md`, `tools/test-device-copy.mjs` and `evidence/device-copy.json`.
The following publication record, when present, names the release that passed
live checks; earlier v6 receipts do not validate this candidate. Physical phone
and actual native share/AirDrop acceptance remain open.

### Device-copy publication

Sites version **7** deployed successfully on the same public origin. Website
source is `3a8371c7b1bb85358d08d28eefb0d94584726ff4`; app feature implementation
is `c27b67a1f2ab9ebd6cf34b3b35001a4d5c3b0599`. The v6 receipt is retained, and
`evidence/publication.json` names the current exact source/build hashes.

`evidence/device-copy-live.json` records the live scanner/selected encrypted
copy/resume/import journey, including a failed-storage retry and preservation of
existing contacts and unlock slots. `mobile-live.json` records the existing live
pairing/check/recovery journey and actual offline reload. `mobile-hosting.json`
matched all six public files byte for byte with required headers. Local private
vouch regression passed on the candidate code; no new server route was added.
These results qualify deployed browser behaviour with the stated stubs; physical
camera, biometrics and actual OS/AirDrop/chat handoff remain unqualified.

Canary was opened in Google Chrome. Temporary preview and automation servers,
archive and this task's installed dependencies were removed after evidence was
recorded. Existing installed app windows need to close and reopen to activate a
downloaded update; there is no forced refresh during a call or setup.

The final public version is **8**, website source
`ae34f24d85cb9163e4e13712dfe16127071179c1`, app source
`88c64a58eb85048359542d783874c1c271a0773a`. Its sole app change from v7 is an
explanatory sentence: the file is “encrypted for” the receiving device. It avoids
an absolute hardware-binding claim, since recovery backups can retain the
receiving key. No functional code changed. All six v8 public files matched the
source; a fresh mobile browser opened the device-copy flow without errors or
overflow. Complete live transfer/mobile/offline regression remains the v7 run of
identical functional code, explicitly named in the current receipt. The v7
receipt is retained. No physical-device or independent-audit gate is upgraded.
