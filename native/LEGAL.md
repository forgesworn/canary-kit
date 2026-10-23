# Native Vouch prototype: position and privacy gap check

Draft factual review — 23 October 2026. Not legal advice; not independently
reviewed by a lawyer. Scope: the current `native/` Android/iOS wrappers,
`local/native.ts`, native vault/Connect integration and `tools/build-local.mjs
--native`. The separate MySignet native application is outside this review.

Law source: [GB online-services note](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md),
verified **28 September 2026**, review by **28 March 2027**, with its recorded
partial updates of **23 October 2026**. `[P]` means a primary source was read;
`[S]` secondary; `[U]` an unchecked or unsettled interpretation/application.
The notes are within review date. No new law research was performed.

## Position today and intended scope

The selected native candidate is packaged endpoint software, with local radio
exchange and device storage. It does not run an internet relay, rendezvous,
message API, public directory, account service or remote vault. The owner
selected a local native prototype, not app-store or public-web publication.
The static public website remains a separate deployment with its already
adopted publisher/contact and hosting purpose/basis. This review changes none
of those decisions (`tools/build-local.mjs:7`, `:17`, `:27`, `:58`).

The publisher/software assessment under GB note §§2.2 and 2.11 remains `[U]`.
The underlying OSA service/provider definitions are `[P]`; no operated
user-to-user internet service has been identified in this native scope. Using
Nostr cryptographic primitives does not create a Nostr account or relay.
Encryption alone would not establish a legal exemption if a service were later
operated. Classify again before adding network transport, discovery servers,
remote backups or a publisher-managed admission service.

The wrappers do hold keys on the user's own device: native unlock seeds and,
while unlocked, JS vault/private-session material. No publisher-run component
holding those keys was identified. The bridge deliberately returns the unlock
seed to bundled JS after device authentication. Do not claim that unlock
material never leaves Keychain/Keystore or that an unlocked app cannot read it
(`local/native.ts:56`, `local/vault.ts:182`, `local/vault.ts:222`).

## Source inventory and notice check

The legal-cover inventory helper ran, but selected zero files in this untracked
native tree. Its empty output is not proof of no processing. Findings below
come from direct source inspection, including Swift, Java, manifests and the
native build transformation. Native paths below are relative to `native/`; bare
Java filenames refer to `android/app/src/main/java/dev/forgesworn/vouch/`, and
bare Swift filenames refer to `ios/Vouch/`.

| Processing or boundary | Source evidence and finding |
|---|---|
| Bundled UI, no application network endpoint | `tools/build-local.mjs:17` replaces the footer with `native/PRIVACY.html`; `:27` sets connect/worker/manifest to none; `:58` writes only the native bundle. Android `MainActivity.java:24` blocks network loads and `:29` serves the exact local asset; iOS `WebHost.swift:58` restricts navigation. Deliberate HTTPS link taps open the external browser. |
| No Android Internet, microphone or location permission | `android/app/src/main/AndroidManifest.xml:1`: NFC, camera, biometric and Bluetooth scan/connect/advertise permissions only. Scan declares `neverForLocation`; hardware features are optional. Google build repositories are not a Google runtime service or telemetry SDK; `android/app/build.gradle:16` lists only the JVM test dependency. |
| Local public radio messages | `local/native.ts:61` validates bounded CANARY-MEET tokens; platform `PublicCode.java:10` and `PublicCode.swift:6` enforce the compact public-token profile, at most 186 bytes, with a separate Vouch AID. Private keys, labels and shared pair seeds are not radio payload fields. Full commitment/reveal semantics are checked by the existing JS meeting engine. |
| Bluetooth exposure | `ios/Vouch/NearbyCarrier.swift:26` and Android `BleCarrier.java:34` advertise a common service UUID. Peers exchange public card/reveal values through local GATT. Device identifiers/addresses and radio timing are also handled by platform/peer discovery; a common UUID does not establish anonymity. Nearby observers may correlate a session. |
| NFC roles | `ios/Vouch/NfcCarrier.swift:9` starts an explicit Core NFC reader; Android `NfcCarrier.java:15` temporarily enables HCE while Connect is active and `:16` implements explicit reader mode. No iPhone card-emulation claim is made. |
| Bounded foreground exchange | `ios/Vouch/NativeRadios.swift:8` and Android `Radios.java:11` enforce a 60-second activity window and 256 accepted-frame limit, session guards and public tokens. `local/meet-ui.ts:23` stops native radio sessions on leaving/clearing; iOS `WebHost.swift:52` and Android `MainActivity.java:98` stop on background and cancel authentication. These are source controls, not measured physical-device guarantees. |
| Human confirmation | `local/meet-ui.ts:69` saves the pinned peer before rendering its reveal. Existing `meet.ts`, `pairFromMeeting`, derives the seed locally after validating contributions. Both humans compare four fixed words and confirm independently; radio range or a locally recorded in-person label does not certify identity or prove the other human confirmed. |
| iOS native unlock seed | `ios/Vouch/DeviceKeys.swift:23` uses WhenPasscodeSetThisDeviceOnly plus userPresence; `:24` and `:33` explicitly set synchronizable false. The source supports device-only credential storage, not a blanket assertion that all iOS app data is excluded from OS backup. `WebHost.swift:17` uses the persistent default WKWebView data store. |
| Android native unlock seed | `DeviceKeys.java:29` creates AES-GCM Keystore protection with per-use strong biometric/device-credential authentication and unlocked-device requirement. The random unlock seed is stored encrypted in app SharedPreferences (`:35`), not as a plaintext preference. `AndroidManifest.xml:11` disables backup; `res/xml/data_extraction_rules.xml:1` excludes listed cloud/device-transfer domains. No claim of attested hardware backing is made. |
| Vault and recovery | `local/vault.ts:163` domain-separates native key derivation and clears temporary byte arrays as best effort. Existing encrypted v1 envelope/v6 payload is retained. `:237` exports password/data fields and omits device credential metadata. Device-only unlock is not portable recovery; an encrypted backup requires a recovery passphrase. |
| User-selected exports/imports | iOS `WebHost.swift:66` writes protected temporary files and presents an OS share sheet; Android `MainActivity.java:91` grants read access to app-cache exports via a non-exported provider. `ExportProvider.java:19` only purges sufficiently old files on a later launch; iOS purges old files on launch and schedules removal after share dismissal. Cleanup is best effort, not deletion at a guaranteed deadline. OS destinations/providers may network or retain copies. |
| Diagnostics | The ready operations in `WebHost.swift` and Android `MainActivity.java` log a Web Crypto availability boolean. Radio adapters log the transport of the first three public frames, NFC reader/service state and radio pause events, without token contents, keys, words or names. This does not establish that OS crash/diagnostic services keep nothing. |

`native/PRIVACY.html:1` accurately distinguishes native storage/radio operation
from deliberate external website/contact visits, public protocol material from
private keys/seeds, radio proximity from identity, saved state from recovery,
and active-vault removal from backups/other copies. It discloses local camera
fallback, system device authentication, explicit OS sharing and prototype limits.
The source notice-alignment gate is closed for this reviewed candidate. This is
not a readback of an installed binary or an app-store privacy submission.

## Applicable regimes and outstanding work

- **Data protection — §§3.1–3.2:** Article 13 contents are `[P]`; the note's
  controller/default-recipient applications remain `[U]`. No new publisher
  recipient/controller server is identified for local vault or radio data.
  Privacy contact remains the established Canary Kit project private report
  route. External GitHub/website visits use their respective services. Ordinary
  users' household, group or business processing is a separate question (§3.9).
- **Device storage — §4:** the statutory exception framework is `[P]`; the
  interpretation for storage necessary to a requested local vault/security
  service remains `[U]`. Explain encrypted persistence, recovery and local radio
  handling accurately. System radio/camera permissions are technical controls,
  not a general GDPR consent or proof of identity. No added tracking store or
  consent banner requirement is identified in this bounded prototype.
- **OSA/communications — §§2.2, 2.11, 4.1, 5 and 7:** no public internet
  communications operation is identified in these wrappers. Do not transform
  this finding into blanket immunity from lawful process or into a rule that
  encrypted radio software can never attract another regime. Those application
  questions remain `[U]` where the note leaves them open.
- **Publication/export/trading — §§6, 6.1 and 8:** native code/builds are not
  an export/end-use or sanctions clearance. No charge, payment, app-store
  release or new commercial activity is introduced by this review. Licence
  verification and store distribution requirements are separate from the
  online-service notes and were not certified here.

No new OSA assessment deadline, controller fee or registration obligation has
been identified merely from this local prototype. The existing controller-wide
fee uncertainty is not reopened or settled here. No additional owner decision,
new identity/contact publication or new hosting legal basis is invented.

## Evidence limits

The parent task reports successful compilation/build checks and actual installed
app launches on an iPhone 13 Pro Max (iOS 26.6.2) and Pixel 10 Pro XL (Android
17). Its NFC-only device logs show service SELECT and public frames on both
phones. Android NFC was initially off, then explicitly enabled and its state
verified. This is reported physical launch/transport evidence, not a fresh log
readback performed by this legal reviewer or proof of completed pairing. The
artifact receipt in `evidence/artifacts.json` records its own build candidate;
do not assume an earlier hash establishes every later installed source change.

The owner subsequently confirmed matching four setup words on both real phones
via NFC for the earlier installed binary. Separate human save, reciprocal call
checks and acceptance of the later call-check UI remain unconfirmed. A later BLE trial received iOS frames on Android but did not establish the
reverse direction; it is not a BLE pass. Android/Android NFC,
iPhone/iPhone BLE, range behaviour, no-Play GrapheneOS, actual device-authentication
flows, lifecycle stop behaviour and recovery remain distinct acceptance work.
No app-store or website publication, foreign-law assessment, independent
cryptographic/security audit, platform privacy-manifest completeness or lawyer
review is established. iOS encrypted WebView data backup behaviour has not been
verified on a device. No raw-secret recovery QR should be described as public.


## NFC delivery and diagnostic delta — 23 October 2026

The source now keeps an NFC reader exchanging until its final public reveal has
been sent in a successful exchange before ending the completed scan. Delivery
state is reset on stop; revision/session guards reject stale reader/service
callbacks (`ios/Vouch/NfcCarrier.swift:35`, `ios/Vouch/PublicCode.swift:27`,
`android/app/src/main/java/dev/forgesworn/vouch/NfcCarrier.java:24`,
`android/app/src/main/java/dev/forgesworn/vouch/PublicCode.java:38`,
`android/app/src/main/java/dev/forgesworn/vouch/VouchCardService.java:6`). This is
transport delivery handling, not evidence that the peer human compared or saved.

NFC-only test launches suppress BLE; ordinary launches retain available nearby
transports (`ios/Vouch/NativeRadios.swift:7`, Android `Radios.java`). Source
inspection confirms the additional reader/service-state, pause and first-three-
frame transport diagnostics contain no token payload, word, key or contact name.
They can still reveal app/radio usage timing to whoever can access device logs;
no zero-metadata/zero-log claim is made. Existing nearby-observation, local-state
and prototype notices remain accurate, so source notice alignment stays closed.
No new processing recipient, network service, legal basis, distribution or
approval is introduced. Physical transport evidence above does not close owner
separate-save/call-check acceptance, BLE testing or independent review.


## Listener comparison UI delta — 23 October 2026

Following owner feedback, the listener can select a large displayed normal or
duress phrase as the words they heard, choose Neither matches, or type both full
words for the existing adjacent-interval check (`../local/model.ts:118`,
`../local/main.ts:588`, `../local/main.ts:597`, `../local/index.html:83`). The
choices use unchanged derivation for the opposite role; no wire, vault format,
server, radio payload, microphone/transcription or telemetry path is added.
The UI explicitly instructs the listener not to read these choices to the caller.

The normal-choice action records the listener's confirmation of what they heard;
it is not an independent capture/check of the caller. The existing encrypted
lastCheck timestamp can be updated from that local confirmation
(`../local/main.ts:618`). A locally saved check therefore remains the user's
record, not independent identity or platform-account evidence. Selecting a
shown phrase is not proof that the other party actually said it.

Duress receives an explicit red alert/result and agreed-plan wording, with no
message or emergency alert sent. The displayed duress result survives word
rotation until a fresh check, person change or lock clears it; it is not a
continuing live measurement or a transmitted incident record. Other check
results expire on rotation (`../local/main.ts:373`, `../local/main.ts:594`,
`../local/main.ts:602`). The app still cannot guarantee concealment, safety or
that a recipient follows an agreed plan. Existing privacy/prototype limits
remain accurate; no new legal basis or owner approval is introduced.

The owner-confirmed NFC matching-words result belongs to the earlier installed
binary. The new UI's rebuilt artifacts and installation do not establish physical
acceptance of its listening/duress interaction. Exact artifact hashes and any
subsequent device evidence must be recorded separately; no future physical.json
receipt is presumed by this review. Source notice alignment remains closed;
new UI owner acceptance, reciprocal call checks, BLE and independent review
remain separate gates.


## Listen/Speak and optical video handoff — 23 October 2026 candidate

This later section supersedes preceding source-notice and pending-test statements
where the candidate has changed. The shared call UI now presents Listen and Speak
panels with two phrase cards each. Speak displays the user's normal and duress
words together, without the previous hidden-duress control; Listen offers local
human confirmation of the peer's normal/duress phrase. The existing manual check,
rotation and persistent duress result remain (`../local/index.html:83`,
`../local/main.ts:369`, `../local/main.ts:417`). This is not automatic speech
capture, identity proof, incident transmission or an assurance of concealment.
Screen capture/sharing can expose both phrases. Show only the transfer QR during
a call, never the call-word, private vault or raw-secret recovery screen.

The new optical wrapper carries canonical public connection invitations/device
requests, recipient-encrypted connection replies and recipient-encrypted device
copies. It does not replace those existing crypto protocols. `../local/optical.ts:1`
records the MIT source adaptation; separate Vouch prefixes/domain, bounded Base45
frames and a complete SHA-256 assembly digest separate this carrier from the
native NFC/BLE token profile. At most 128 frames and a three-minute camera/
assembly window are accepted (`optical.ts`, `createOpticalFrameReader`;
`../local/optical-ui.ts`, `scan`). The digest detects assembly inconsistency; it
is not sender authentication or fresh encryption. Larger transfers must use the
existing encrypted file route or fewer selected contacts. Camera/assembly pause
is separate from the existing device-request acceptance expiry and no-expiry
connection invitations; no remote deletion follows from any expiry.

A live video-call participant/provider or recording can observe/copy public
requests, ephemeral sender/recipient keys, exchange identifiers, timing/size and
ciphertext shown on camera or screen. The shared pair seed and selected contact
contents remain inside the existing recipient-encrypted reply/copy rather than
plaintext optical fields (`../local/device-transfer.ts:43`). Only established
trusted-call comparison and the receiving-device/import checks provide the
existing human assurance; a video image or frame digest alone does not identify
the peer. Use the fixed pair code for a new contact and the device-copy comparison
code before importing a copy. Recipients still can retain decrypted material.

Video QR needs a second screen visible to the scanning camera. Explicit chat/link
or encrypted-file transfer is the single-phone fallback; Vouch does not operate
the video/chat provider (`../local/optical-ui.ts`, `alternatives`). The generic
selected-file path bounds files to 400,000 bytes and parses only the supported
public/request/recipient-encrypted packet forms; browser .json/.txt filters are
picker hints, not content validation (`../local/main.ts:344`). Raw-secret recovery
and vault backups are not the moving-QR payload profile. Native shareText is an
explicit OS sheet for fixed-origin #connect/#device links; the destination may
network, retain links or expose metadata (`../local/native.ts:94`, iOS
`WebHost.swift`, Android `MainActivity.java`, shareText).

This retains the software-publisher assessment `[U]`: no publisher relay,
video service, server/account, new automated recipient or hosting purpose/basis
is introduced. The owner's existing Sites project/audience was intended to carry
the same shared UI, with public v11 the recorded live release at source-review
time. Candidate v12 source/build work was not publication readback. No additional
owner approval, provider adoption or new legal research is identified here.

**Source notice recheck:** `../local/index.html:126` and `PRIVACY.html:5`
now explain moving QR through a chosen video-call service, both public/encrypted
transfer directions, provider/participant/recording copies, the second-screen
requirement and one-phone link/file fallback. They distinguish frame consistency
from authenticity and three-minute optical scanning from the one-minute ordinary
Connect/radio pause, require fixed-code comparison and disclose visible Speak
duress without a concealment promise. `../local/optical-ui.ts:45` also instructs
users to share only the transfer QR, keeping vault/call/recovery screens private.
Local text/JSON decoding and review of decrypted imported people match the source.
The expanded candidate's source notice-alignment gap is closed. This is not v12
publication readback or physical acceptance of the changed UI/video transfers.

`evidence/physical.json` records the earlier owner-confirmed NFC matching-four-
words pass against its artifact hashes. It also records a one-way BLE failure:
Android received iOS public BLE frames; iOS receipt was not established. A later
Android MTU response fix was installed according to the task, but no repeat was
available. Neither that fix nor latest Listen/Speak/video QR/device-copy changes
have owner physical acceptance. Build/fixture checks, changed installed artifacts,
NFC pass, incomplete BLE, and owner confirmation remain distinct evidence gates.
No general interoperability, effortless single-phone video QR or independent
security/legal review is claimed.

### Publication follow-up — 23 October 2026

The shared web UI is now published as website version 12 from Canary Kit commit
`4335636c2fa7621c7961619cc69f8ea90d3cbc91` and static wrapper commit
`9bf8b1218b98f0fda8f5be1c120c40c3405722d2`. Anonymous six-file exact-byte and
security-header readback passed, alongside the live browser QR setup/copy journey
in both directions. See `../local/evidence/publication.json` and its linked
readbacks. This supersedes the publication-pending status at the source-review
time above; the source notices and approved hosting facts remain unchanged.

The latest signed iOS prototype and Android APK are installed on the same phones.
The installed Pixel APK hash matches `evidence/artifacts.json`. The iPhone was
locked for launch; no unlock was bypassed. The owner cannot retest now. These
installation facts do not establish BLE, new UI, real video QR, biometric or
human acceptance. The earlier NFC pass remains tied to its recorded binaries.
No app-store publication, new publisher messaging service, independent audit or
blanket legal clearance is implied.


## Transport-check candidate — 23 October 2026

The candidate adds foreground BLE operation deadlines, bounded read retries and
temporary cooldown bookkeeping. Established links and advertising remain for
the slower peer after local reading completes, until the existing overall stop.
Moving QR offers a larger/slower display and parser-validated fragment progress;
partial progress does not authenticate a sender or complete a transfer. The
existing public-token bounds, human comparison, radio activity limit, vault and
recipient encryption remain unchanged. Code: `native/*/BleReadLoop`,
`BleCarrier.java`, `NearbyCarrier.swift`, `local/optical.ts`, `local/optical-ui.ts`.

Test tooling (`tools/lib/vouch-video-call.mjs`, `tools/test-optical-vouch.mjs`)
uses locally signalled WebRTC VP8/H.264 encoders/RTP/decoders, simulated screens
and cameras, and stubbed device credentials. No production video service,
STUN/TURN server, new publisher recipient or hosting purpose is introduced.
The existing approved static-hosting basis and publisher/contact remain;
classification stays `[U]`. The existing notices remain aligned with this source
change. This is a factual delta, not a new legal opinion; the law note remains
verified 28 September 2026, review due 28 March 2027, with partial 23 October updates.

Physical bilateral BLE, real camera-through-provider video calls, system unlock
and owner/novice/panic acceptance are outstanding. The owner cannot test phones
today. Earlier NFC and public-site evidence remains tied to its recorded source
and binaries. Candidate compilation/codec results are separate evidence, never
an assertion that those physical gates passed. See `TRANSPORT-ACCEPTANCE.md`.
