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
checks and acceptance of the later call-check UI remain unconfirmed. BLE was not
tested. Android/Android NFC,
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
