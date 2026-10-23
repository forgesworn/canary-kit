# Privacy facts and hosting inputs

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code `1ac118f5c4287159f08a72989c77d288c45207b7`.
Law note verified 28 September 2026; §§5.1–5.2 and 7 partially refreshed
23 October 2026 against primary sources.**

Current factual delta reviewed on 23 October 2026 against the working tree based
on app commit `621b6ae5b4da6f8703b863bfeef9af4aeb8f7476` and the modified
`../canary-words-site` publishing source. Earlier commit/readback references
below record the earlier release, not production verification of this candidate.
No deployment or public readback was performed for this gap review.


These facts apply to the local app and the public static-response site at
`https://canary-words.cocoacod256.chatgpt.site/`. The deployed notice is in
`local/index.html:60`, including the owner-adopted hosting basis and contact.
See [hosting record](hosting-proposal.md) and [production evidence](../evidence/publication.json).

## Device processing

Starting a new in-person pair or remote exchange now first creates or unlocks
the encrypted vault (`local/main.ts`, `create` handler and `ensureTrustVault`;
`local/connect-ui.ts`, `mountConnect`). The in-person creator's pair and remote
exchange progress are encrypted before their outgoing link is displayed. An
incoming local QR/manual pair can still be transient until explicitly kept.
Unsaved pairs are cleared on backgrounding or five-minute inactivity; both
people need their own saved copy for future calls. No publisher account exists.
Pair setup words, roles and user-chosen nicknames are held in memory while
unlocked. Encrypted payloads and wrapped master keys are stored in this browser's
localStorage (`local/main.ts:82`; `local/vault.ts:148`). Plaintext nicknames or
pair secrets are not persisted by these handlers. The app also uses the device
clock and transiently displays normal/duress words. No account or network member
identifier is required, and there is no server-side recipient for the app data.

Local records contain ciphertext, salts/nonces, a random vault reference and,
if enabled, a credential identifier, PRF input, origin and wrapped key for device
unlock (`local/vault.ts:14`). Data remains until removed by the user, browser
clearing/eviction or device loss. Deleting one entry rewrites the encrypted
vault; it does not guarantee erasure of old disk blocks or backups. Locking wipes
displayed secrets and attempts to zero the in-memory key, not guaranteed browser
memory erasure. See `local/main.ts:56`, `local/vault.ts:155`.

Keeping a new pair first offers native device encryption where available, with
passphrase fallback. Device-only vaults initially have no recovery passphrase.
The user can add one later; until then portable backup export is refused
(`local/vault.ts:197`, `local/vault.ts:142`, `local/vault.ts:219`). Loss of the
credential or browser data without recovery can lose all saved pairs. Existing
passphrase vaults are still supported. Saved nicknames may be default numbered
labels until the user optionally renames them (`local/main.ts:200`).

**Save encrypted backup** downloads encrypted JSON without the device credential
slot (`local/main.ts:367`; `local/vault.ts:219`). Backups remain wherever the user
saves them until deleted. Files, browser stores and backups may be copied by
device backup/sync settings. The publisher cannot recover a forgotten vault
passphrase, erase remote copies or revoke another offline pair holder.

## Setup links, camera and passkey providers

On HTTPS, the displayed QR is a private link containing the pair secret in its
fragment (`local/model.ts:59`), so a normal camera can open the app. The fragment
is outside the HTTP request URL. An early, CSP-hashed script removes it from the
current history entry (`local/index.html:12`) and the app consumes the transient
value (`local/main.ts:519`). Same-tab fragment navigation is supported too.
Either holder can intentionally re-show the same pair’s QR to restore the
other side. The recovery invite identifies the recipient’s speaking role; it
does not rotate the shared secret or revoke previous copies. Resaving the same
secret/role reuses the existing local record. This is not a one-use, expiring or
revocable invitation. Camera/scanner software,
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
(`local/vault.ts:174`). The request carries the origin, generic Canary label,
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
an on-device result, not an alert or location report (`local/main.ts:469`).
The application installs no cookie, tracker or account system. It registers a
same-origin service worker for the public offline shell; see the update below.
The existing `SECURITY.md` describes repository security-report routes; this
change adds no form, inbox endpoint or report upload service.

A hosted download necessarily exposes ordinary connection/request metadata to
its host. The app request monitor and the current `connect-src 'self'` policy do not prove that a
web host retains no logs. Hosting processing is described below; no fixed log lifetime or UK-only
location is asserted.

## Published host

A separate OpenAI Sites origin is public; the current response wrapper serves a fixed public app/manifest/icon/service-worker
allowlist with fixed headers and rejects other paths/methods. The platform's
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

## Optional private contacts and group vouches — 23 October update

`local/vault.ts` now preserves user-entered meeting method/date, observed account
labels and last matching normal-word check dates. These are local notes; an
observed platform identifier is not independently verified account ownership.
Merely displaying words does not record a comparison, and duress results are
not exported into group evidence or public activity.

`local/trust.ts` creates an independent signing key per group. Keys, group names,
private aliases, accepted vouchers, signed issued/received vouches, withdrawals,
dated historical checks, pending challenges and outgoing handoffs are in the
same encrypted local vault. The payload migration reads previous entry arrays.
Encrypted recovery backups now also carry these keys and records. Older backups
retain only the data they originally contained. Local removal does not revoke
remote copies or erase the browser's old disk blocks/backups.

`local/trust-wire.ts` uses the existing NIP-44 encryption implementation for
recipient-addressed vouches, challenges, responses and withdrawals. Signature
verification is separate and mandatory. Group cards and holder-key cards contain
public information and can reveal the group name or public keys to recipients.
Signatures alone do not make statements private; an authorised recipient can
copy a decrypted proof or disclose it to a keeper during a requested check.

`local/trust-ui.ts` offers local camera decoding, explicit clipboard copying and
user-invoked native sharing. A chosen messaging app, clipboard manager, native
camera or browser can retain deliberately shared links and metadata under its
own settings/terms. The app adds no messaging provider or recipient by default.
`local/index.html` consumes `#trust=` through the same early hashed history
replacement as setup links. The HTTP request contains no fragment. Link erasure
from native history/sync is not guaranteed.

Pending requests and outgoing handoffs are saved before their QR is displayed.
The app still clears plaintext UI/references on locking, hiding or idle. Fresh
requests expire after ten minutes; group cards do not themselves admit people.
Vouches expire after the issuer's explicit 1–90 day selection. Signed withdrawals
are stored until the group is removed; storage limits reject a new write rather
than silently discard evidence. There is no online status lookup, account
creation, profile discovery, relay connection, remote signer or public vouch
publication. This changes local processing facts without adding a hosted user-
content API. The deployed privacy text has been expanded to match.

## Phone installation and remote pairing — working-tree update

`local/install.ts` registers `./sw.js` automatically on supported secure website
loads, independently of the home-screen installation button. The worker fetches
and caches only `/`, `/manifest.webmanifest`, `/icon-192.png`, `/icon-512.png` and
`/apple-touch-icon.png` (`local/pwa/sw.js`, `FILES`). Registration/update checks
also request the public worker. These are additional ordinary host requests;
no fragment, vault, nickname, exchange key or pair secret is put in this cache.
Installation fetches omit credentials. Browser/platform installation and update
processing remains subject to the user's browser/OS settings.

The versioned public shell can remain available offline. Activation deletes old
Canary shell cache versions; it does not erase saved vaults or external copies.
The browser may evict storage. A user-requested `navigator.storage.persist()`
permission can reduce eviction, not prevent clearing or device loss. Home-screen
and ordinary browser contexts may have separate storage: use the same context
or an encrypted recovery backup; installation does not promise vault migration.

`local/connect.ts` produces an offer with a random exchange identifier and public
key. It is public information, not a shared pair secret, but may link an exchange
to the recipient/chat context. The reply carries the pair inside recipient-
encrypted NIP-44 data with public exchange/key metadata. Encryption does not
establish who owns the other key: compare the fixed pair code on a separately
trusted live call. No relay, Nostr account, remote signer or messaging API is used.

`local/connect-ui.ts` passes a link to `navigator.share` or writes the clipboard
only when the user clicks Send/Copy. The user chooses the external app/recipient.
Those apps, OS share tools, clipboard managers, browser and scanners can retain
links and metadata under their own settings. Encryption is no promise that a
recipient or compromised endpoint cannot copy the pair. Native sharing is not
a direct send by the publisher. `#connect=` is stripped by the early history
replacement in `local/index.html`; HTTP does not carry that fragment, but native
history/sync/link handling copies cannot be guaranteed absent.

Pending offers keep their private exchange key, public invitation and label in
the encrypted vault; pending pair entries keep the setup method and an encrypted
reply for resending (`local/vault.ts`, `opened`, `sealEntries`, `entriesFrom`).
They travel in encrypted recovery backups with the vault payload. Unfinished
offers have no automatic expiry in this implementation; users finish or remove
them. Completion removes the matched offer locally. Removing data does not
revoke previously shared links or erase other holders' copies. Unlocking exposes
this material to the user's browser; the publisher receives no content key.

Face/fingerprint/phone PIN refers to the platform authenticator's required user
verification and PRF (`local/vault.ts`, `enableDeviceUnlock`, `unlockWithDevice`), not a
short Canary PIN encrypting a copied vault. The fallback UI requires a strong
passphrase of at least 14 characters. Existing-vault compatibility is not proof
that every older passphrase was strong. Device-only recovery limitations remain.

## Publication evidence after this gap review

The phone/PWA candidate was subsequently deployed as Sites version 5 on the same
origin. `../evidence/publication.json` records website source `cc95b579a31ac64a0cf9fde5f0508cf566c136a1`
and app implementation `82817b61632e81cc4e1236faad175ea3566430ea`. All six served
public files matched the pushed source bytes and required headers. The live
browser journey and actual offline shell reload passed (`mobile-hosting.json`,
`mobile-live.json`). These later technical readbacks close the candidate
publication gap mentioned above; the legal interpretation, physical-phone
acceptance and independent-review limits remain. They are not a new law review.

## Encrypted copy to another device — working-tree model review

Reviewed 23 October 2026 against the device-copy working tree, not a deployed
release. `local/device-transfer.ts:26` creates a random request identifier,
ephemeral public key and fifteen-minute expiry; its private key stays with
the receiving device. `deviceLink` puts only that public request in `#device=`.
The public request can still reveal timing and link a transfer to a chat or
recipient context. A public key is not proof of who owns the device.

`makeDeviceCopy` accepts completed saved people only and encrypts their pair
secrets, names, observed-account notes, meeting evidence and last-check dates
using the existing NIP-44 library (`local/device-transfer.ts:41`). Each encrypted
chunk binds purpose, request, keys, dates, digest, position and total; the
receiver checks those bindings before accepting the data. The file envelope
exposes public request/key metadata, expiry, a keyed manifest digest and encrypted-part sizes. The manifest uses the shared conversation key, rather than exposing a plaintext hash of private contact notes.
The fixed comparison code is twelve hexadecimal digits (48 bits); it is for
comparison with the source device, not proof of civil identity or a new
historical check. Copied notes remain historical observations.

The intended handoff is a user-selected encrypted `.canary.json` file through
the OS share sheet or Save file, followed by the user's existing AirDrop, chat
or manual transfer. Canary adds no upload/download endpoint, relay, remote
signer or automatic recipient. Chosen apps, file stores, device backups and
OS sharing tools may retain the encrypted file and metadata under their own
settings. A recipient who unlocks/decrypts the copy can retain its contents.
The request expiry is an app acceptance limit, not guaranteed deletion or
cryptographic revocation of copies or keys. Restoring an older encrypted
backup can also restore the receive key and unconsumed request; local
consumption is not a global replay or erasure guarantee.

Only people entries are serialised, with unfinished setups rejected. Group
keeper/signing keys, group trust records, master/unlock credentials and unfinished
connection exchanges are excluded from this file. `mergePeople` preserves
existing destination entries, deduplicates by pair secret and remaps colliding
entry identifiers (`local/device-transfer.ts:103`). Copying leaves the source
intact; no synchronisation, removal or revocation is implemented by this model.

Vault payload version 4 additionally saves a pending receiving private key and
an outgoing encrypted file/count inside the encrypted vault and its recovery
backup (`local/vault.ts:84`, `:125`). Previous array/v2/v3 payloads remain
readable. The encoded record limit is 1 MiB, total plaintext payload limit
600,000 bytes and ordinary entries/trust/exchanges limit remains 160,000 bytes;
limits reject a save rather than silently discard data. Expiry does not itself
erase retained local state or existing backups. Unlocked device compromise and
backup retention limits stated above still apply.

The completed source integration was then reviewed: `local/device-ui.ts:129`
shares a file only after the user clicks; `:133` similarly downloads ciphertext.
The receiving preview requires an explicit matching-code checkbox and selected
people (`:142`). Import revalidates the packet, removes the receive request and
passes both entries/state to one encrypted save (`:155`; `local/main.ts`,
`mountDevices`, `save`). That save checks the same unlocked vault/generation and
visible document before persisting, retaining its master/credential/group and
connection state. With no receiving request, reopening the same file fails;
this is local consumption subject to the backup-restoration limit above.

`local/index.html`, `take`, removes `#device=` through the early history
replacement; app HTTP requests carry no fragment. Native browser/scanner,
clipboard and history-sync retention remain outside that guarantee. Locking
clears the device UI and preview references (`local/main.ts`,
`wipeUi`; `local/device-ui.ts`, `clear`). Recipient-encrypted download object
URLs may remain for up to 60 seconds to let the OS finish a handoff; they contain
no plaintext people and are then revoked. An import preview must reopen the file after
unlocking; saved encrypted receive/send state can resume. These are code-review
findings, not physical phone or real AirDrop acceptance. The published page must
carry the candidate's file-transfer/storage explanation before this release;
earlier production evidence does not verify the candidate. Existing host,
controller/contact and adopted hosting purpose/basis remain unchanged.

## Signet Vouch presentation and private labels — source candidate

Reviewed 23 October 2026 against the working tree based on app commit
`599058fa3c970467cb47122285592ffa7780fa88`. `local/vouch-view.ts`,
`knownPeople`, derives a group-scoped list from existing saved private labels,
chosen vouchers, issued/received claims and the last historical check. This is
this device's saved key/evidence list, not an authoritative current member
register, public directory, identity match or social graph. Identical labels
in different groups do not link their keys or spoken pairs.

`local/trust-ui.ts`, `personView`, lets the user explicitly save or replace a
private name in the existing `Group.people` field. Names and key associations
remain in the existing encrypted vault and encrypted recovery backup; the
existing backup, device-compromise and retention limits above still apply.
Saving a name does not accept that key as a voucher or alter any other platform's
membership. User-supplied call/account context remains an observation.

`local/vouch-view.ts`, `vouchSummary`, checks saved claim signatures, group
scope, method and lifetime before presenting current, expired, withdrawn or
unusable evidence. Dates describe the signed observation and its expiry; a
current label reflects only local time and withdrawals already received. It
does not prove current identity, account ownership, the truth of a meeting or
global withdrawal freshness. A refreshed verification card or restarted
expired request initiates the existing proof flow, rather than renewing an old
vouch or converting it into an identity check.

`local/index.html` and `local/pwa/manifest.webmanifest` use the Signet Vouch
product name while keeping the existing app origin and manifest identity.
The hosting notice still names the Canary Kit (ForgeSworn) publisher and the
existing GitHub privacy route. The Signet Vouch label introduces no Signet
login, account integration, relay,
backend, automatic contact lookup or new recipient. Spoken words still check a
separate shared secret and are not linked automatically to group keys. The
publisher, origin, hosting purpose/basis and existing GitHub privacy route are
unchanged. Publication/notice alignment and live release readback must be
verified for this candidate; earlier publication evidence does not do that.
