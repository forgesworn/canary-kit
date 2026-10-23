# Privacy facts and hosting inputs

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code `0ba43087ca2c701a143d85ba31464ca3f55a367e`.
Law note verified 28 September 2026; §§5.1–5.2 and 7 partially refreshed
23 October 2026 against primary sources.**

These facts apply to the local app and the public static-response site at
`https://canary-words.cocoacod256.chatgpt.site/`. The deployed notice is in
`local/index.html:59`, including the owner-adopted hosting basis and contact.
See [hosting record](hosting-proposal.md) and [production evidence](../evidence/publication.json).

## Device processing

Pairing starts in memory without a vault or account (`local/main.ts:121`). No
persistent pair record is written until **Keep on this phone**. The receiver
reaches rotating words directly after scanning, and naming is optional. Unsaved
pairs are cleared on backgrounding or five-minute inactivity; both people must
keep their own copy for future calls (`local/main.ts:63`, `local/main.ts:195`).
Pair setup words, roles and user-chosen nicknames are held in memory while
unlocked. Encrypted payloads and wrapped master keys are stored in this browser's
localStorage (`local/main.ts:73`; `local/vault.ts:124`). Plaintext nicknames or
pair secrets are not persisted by these handlers. The app also uses the device
clock and transiently displays normal/duress words. No account or network member
identifier is required, and there is no server-side recipient for the app data.

Local records contain ciphertext, salts/nonces, a random vault reference and,
if enabled, a credential identifier, PRF input, origin and wrapped key for device
unlock (`local/vault.ts:9`). Data remains until removed by the user, browser
clearing/eviction or device loss. Deleting one entry rewrites the encrypted
vault; it does not guarantee erasure of old disk blocks or backups. Locking wipes
displayed secrets and attempts to zero the in-memory key, not guaranteed browser
memory erasure. See `local/main.ts:50`, `local/vault.ts:129`.

Keeping a new pair first offers native device encryption where available, with
passphrase fallback. Device-only vaults initially have no recovery passphrase.
The user can add one later; until then portable backup export is refused
(`local/vault.ts:171`, `local/vault.ts:117`, `local/vault.ts:193`). Loss of the
credential or browser data without recovery can lose all saved pairs. Existing
passphrase vaults are still supported. Saved nicknames may be default numbered
labels until the user optionally renames them (`local/main.ts:182`).

**Save encrypted backup** downloads encrypted JSON without the device credential
slot (`local/main.ts:301`; `local/vault.ts:193`). Backups remain wherever the user
saves them until deleted. Files, browser stores and backups may be copied by
device backup/sync settings. The publisher cannot recover a forgotten vault
passphrase, erase remote copies or revoke another offline pair holder.

## Setup links, camera and passkey providers

On HTTPS, the displayed QR is a private link containing the pair secret in its
fragment (`local/model.ts:55`), so a normal camera can open the app. The fragment
is outside the HTTP request URL. An early, CSP-hashed script removes it from the
current history entry (`local/index.html:12`) and the app consumes the transient
value (`local/main.ts:412`). Same-tab fragment navigation is supported too.
This is not a one-use, expiring or revocable invitation. Camera/scanner software,
browser history sync, extensions or platform backups could retain the original
link. Address replacement is not a guarantee against those copies. If exposed,
create a fresh pair. This native software is outside Canary's app request monitor
and local-frame handling. Keep setup links private; do not share them in groups.

The local-file preview still displays an opaque QR for the in-app scanner;
it cannot make a private Mac file accessible to another phone. The hosted QR now contains the live HTTPS link. Browser opening passed;
physical phone-camera acceptance remains unverified.


**Scan their QR** requests camera video, with audio disabled, only on
the user's action (`local/qr.ts:46`). Frames are decoded in memory by bundled
JavaScript. They are not recorded, exported, uploaded or passed to a remote SDK.
Capture stops after success, cancellation, navigation, backgrounding or timeout;
late permission grants are stopped too (`local/qr.ts:31`). Setup QR and displayed
words remain secrets that another person's camera or screen capture could copy.

Optional device unlock asks the browser and the user's chosen authenticator/
passkey provider for a user-verified credential and PRF output
(`local/vault.ts:148`). The request carries the origin, generic Canary label,
random user/credential material and PRF inputs. The credential/unlock key is not
sent to the publisher by app code. A provider may sync its credentials through
the user's platform account under its own settings and privacy terms; this is
not a claim that the operating system makes no network requests. No Google
service or proprietary identity SDK is introduced by Canary. The passphrase
fallback for saving is available without that provider functionality. A recovery
passphrase is not silently created for a device-only vault.

## External communication

The bundled app does not connect to Signal, Kithmoot, WhatsApp, a relay, an agent,
analytics or a remote backup. Users independently choose to speak words or use
other messaging apps; those apps' data handling is separate. A duress match is
an on-device result, not an alert or location report (`local/main.ts:376`).
The application installs no cookie, tracker, service worker or account system.
The existing `SECURITY.md` describes repository security-report routes; this
change adds no form, inbox endpoint or report upload service.

A hosted download necessarily exposes ordinary connection/request metadata to
its host. The app request monitor and `connect-src 'none'` do not prove that a
web host retains no logs. Hosting processing is described below; no fixed log lifetime or UK-only
location is asserted.

## Published host

A separate OpenAI Sites origin is public; the response wrapper only serves the
baked app with fixed headers and rejects other paths/methods. The platform's
[automatic traffic metrics](https://learn.chatgpt.com/docs/sites/managing-a-site#review-site-analytics)
and [applicable processor terms](https://openai.com/en-GB/policies/chatgpt-sites-data-processing-addendum/)
were read on 23 October 2026. Those facts require a host-specific notice; the
app's lack of its own analytics SDK does not mean hosting has no statistics.
See `hosting-proposal.md` for the origin, retention criteria, recipient/transfer
caveats and owner decisions. Those facts were adopted in the deployed notice.
Public readback found the `__cf_bm` security cookie, now disclosed in the page;
app trackers and injected scripts were absent on the corrected delivery.

## Adopted facts and continuing limits

Minimise first: an isolated static HTTPS origin; no analytics, forms, account
backend or application endpoints; host logs disabled/minimised where available.
Hosting somebody else operates is an option, not proof that every data-protection
question disappears. Publishing under a consistent project pseudonym is not
treated as a defect requiring incorporation or a natural person's name.

The initial controller/contact/basis placeholders are resolved for this selected
host: the existing Canary Kit (ForgeSworn) project identity and private GitHub
report route are used, and the owner explicitly approved the proposed minimal
legitimate-interest hosting purpose on 23 October. No person's name, invented
company or new inbox has been supplied. GitHub private reporting is enabled;
that external contact route requires GitHub sign-in. No data request is filed
by this task. The page contains the same hosting facts and rights/contact text.

The host's automatic statistics and DPA terms are described, with duration
criteria rather than an invented fixed retention setting. Public headers, cookies, network behaviour and page bytes were checked; see
`../evidence/hosting.json` and `../evidence/live-browser.json`. No UK-only hosting region is asserted.

The Article 13 notice list is in the
[GB note §3.2](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md#32-the-privacy-notice)
`[P]`. These inputs are for hosting, not permission to add moderation, identity
checks or other regulated-service obligations to this ordinary static app.
