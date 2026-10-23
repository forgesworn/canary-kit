# Vouch native prototype

The same Vouch screens, Canary Kit / Spoken Token word engine, offline
commit/reveal pairing and v1/v6 encrypted vault are packaged in small native
iPhone/iPad and Android apps. The public website remains the separately
published browser build. This prototype has no account or relay.

## Use it

Both open **Connect**, protect/unlock the vault and allow nearby Bluetooth.
Bring the phones together. They compare their public connection codes directly;
both people compare the same four fixed words, name each other and save. Radio
proximity alone is never confirmation. Later: unlock, person, rotating call words.

On a call, **Listen** shows their normal and duress phrases as two large choices.
Choose only what they actually said, or **Neither matches**. **Speak** shows your
own normal and duress words directly. No typing or accordion is needed. A duress
result is red and remains until a fresh check, person change or lock; normal
results expire at rotation. Manual full-word entry remains available for another
phrase and one interval of drift. A choice is the listener's human comparison;
there is no automatic incident/message/alert transmission.

## QR over a trusted call

Both devices need the updated app. Choose **Connect on a call**, protect the
vault, then **Show a moving QR for a video call**. The other person chooses
**Read a QR or open a reply** inside Vouch, protects their copy and shows the
encrypted reply QR back. The original device reads that reply. Compare the four
fixed words together and save separately. Only public invitations and
recipient-encrypted replies travel optically; no new pairing cipher is added.

For your own devices, the receiving device chooses **Bring my people here** and
shows its request QR. The source reads it, selects completed people and shows
its recipient-encrypted copy as a moving QR. The receiver reads it, compares the
import code with the source, reviews the people and imports. Reverse these roles
to copy in the other direction. Existing contacts and each device's unlock are
preserved; groups/unfinished exchanges remain outside selected-person copying.
Large copies use the existing encrypted-file fallback or fewer selected people.

Live video QR needs a second screen the camera can see. On a single phone,
use the trusted call's chat to share the public invitation/request and encrypted
reply/file, then return to Vouch to paste/open it. Share only the transfer QR,
never the vault, rotating call words or recovery screen. The call provider and
participants may retain public/ciphertext frames; a digest is not identity proof.

The coarse Base45/digest/frame reader is adapted from My Signet's MIT-licensed
`handshake-optical.ts` at `335e1f6615f7db6fbcd8b5b5dfa9fdb6d0113667`, with separate
Vouch prefixes/domain and canonical packet types. At most 128 coarse frames
repeat at 500 ms. Transfer capture/assembly is bounded to three minutes and
stops on leaving/lock; ordinary Connect/radios keep their one-minute activity
pause. Selected text/JSON imports are local and bounded to 400,000 bytes.

For an NFC tap, one person taps **Tap using NFC** while the other leaves Connect
open. An iPhone is always the NFC reader, so it starts the tap against Android.
For two Androids, one starts NFC and the other offers the card. Two iPhones use
Bluetooth. A camera fallback preserves compatibility with the website/desktop.
Use **Other phone still waiting?** to retry after one device obtains its words.

The apps use prototype ID `dev.forgesworn.vouch.prototype`, separate from My
Signet. App installation is required; adding the website to the home screen
does not grant native radio APIs. Device testing and security review are distinct
from a successful build. Do not replace an established relationship with a new
pair to validate an unexpected caller.

## Build and test

Node 24, Android SDK 36, JDK 21, Xcode 16.2 or later and XcodeGen are required.
The Gradle wrapper is retained; Android builds use the usual shared Gradle cache.
No Capacitor runtime, native package manager, Rust build or Google runtime SDK
is added. iOS uses SwiftUI/WKWebView, Core NFC, Core Bluetooth and Keychain;
Android uses platform WebView, NFC/HCE, BLE, BiometricPrompt and Keystore.

```sh
npm ci --no-audit --no-fund
node native/prepare.mjs
npm run build:local -- --native
npm test -- --maxWorkers=2
npm run typecheck
npm run typecheck:local
```

The native-only builder writes ignored `native/web/index.html`, includes the
native privacy notice, removes manifest fetching, disables service workers and
sets `connect-src 'none'`. It does not overwrite `canary-local.html` or publish
the website. `--fixtures` builds ignored browser fixtures without changing the
committed standalone release. Icons are derived from the existing Signet mark.

```sh
cd native/android
JAVA_HOME=/path/to/jdk21 ANDROID_HOME=/path/to/android-sdk ./gradlew --no-daemon :app:testDebugUnitTest :app:assembleDebug
```

```sh
cd native/ios
xcodegen generate --spec project.yml
xcodebuild -quiet -jobs 2 -project Vouch.xcodeproj -scheme Vouch -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath build ARCHS=arm64 ONLY_ACTIVE_ARCH=YES CODE_SIGNING_ALLOWED=NO build
```

For a physical iPhone, select the existing organisation team, enable NFC reader
capability and build with a matching development profile. No iPhone card
emulation, NFC & SE entitlement or payment capability is used. This prototype
does not include TestFlight, App Store or public APK publication.

The pure Swift APDU vectors also run on macOS without booting a simulator:

```sh
swiftc native/ios/Vouch/PublicCode.swift native/ios/tests/WireTests.swift -o /tmp/vouch-native-wire-test
/tmp/vouch-native-wire-test native/shared/vectors.json
python3 native/test_check_builds.py
python3 native/check-builds.py --android native/android/app/build/outputs/apk/debug/app-debug.apk --ios native/ios/build/Build/Products/Debug-iphoneos/Vouch.app --out native/evidence/artifacts.json
```

Browser bridge checks use real local encryption with explicit radio/device-key
stubs; they do not verify hardware or biometrics:

```sh
CANARY_CHROMIUM_EXECUTABLE=/path/to/chromium node tools/test-native-vouch.mjs
```

## Protocol and native boundary

NFC SELECT/exchange framing is adapted from My Signet's MIT-licensed
`HandshakeApdu`, source `aa663efb2455f8430538866c231ed58f1ee8c0f7`. The AID is
separate: `F043565543483031` (prototype proprietary AID, no production allocation
claim). Both ISO 7816 SELECT forms, with and without Le, are accepted. iPhone
Core NFC selects the AID before supplying its tag object. Each subsequent APDU
sends the reader's current public code and receives the card's current public
code. Repeated exchanges let both commit/reveal stages complete while held
together. Android registers its AID only during Connect.
The reader waits until an acknowledged exchange has sent its own final public
reveal before ending a completed scan; receiving the other phone's reveal alone
is insufficient. This is transport delivery, not proof the other person saved.

BLE uses a separate read-only GATT profile because My Signet's Android L2CAP
carrier is not exposed by browsers and is not this iOS implementation. Both
devices advertise only the common service UUID and read each other's dynamic
public-code characteristic. Long reads use a stable snapshot. Polling avoids
assuming an ATT write MTU; no OS Bluetooth pairing dialogue or Google services
is required. UUIDs and NFC vectors are in `shared/vectors.json` and checked by
both platform tests. Application crypto remains in the shared `meet.ts` profile,
not in the radio adapters; no new cipher is implemented.

The native wire accepts only canonical public `CANARY-MEET:1` tokens up to 186
ASCII bytes. Curve, commitment, recipient and pinned-peer checks still happen in
the shared engine. Four-word human comparison remains essential. A native session
ID prevents stale operations from replacing/stopping a new radio session. Each
session is foreground-only, lasts at most 60 seconds and receives at most 256
frames. Leaving, locking, backgrounding and cancelling a pending start stop the
radios; the encrypted meeting itself has no deadline. A slower peer can still
read the current public code until local confirmation or the radio pause.

The bridge is available only in the marked bundled native document. Both hosts
block navigation/resource loads beyond their bundled shell; only deliberate
HTTPS links open in the system browser. iOS checks main-frame messages. Android
exposes one JSON method, uses a fixed intercepted HTTPS asset origin, blocks
network loading and has no INTERNET permission. CSP blocks frames. Neither host
loads remote scripts or accepts arbitrary code execution through the bridge.
An unlocked compromised app remains outside the protection provided by this.

## Vault and files

Native system authentication protects a fresh 32-byte unlock seed, not a short
browser PIN. iOS uses user-presence Keychain with
`WhenPasscodeSetThisDeviceOnly` and synchronisation disabled. Android uses an
auth-per-use AES-GCM Keystore key with strong biometric/device-credential access;
only its encrypted seed is stored in private SharedPreferences. Backup and
device-transfer exclusions apply to Android app data. No blanket claim is made
about iOS WKWebView encrypted-data backup behaviour.

The shared app derives a domain-separated HMAC result from the native seed and
the existing slot's random input, then uses the unchanged HKDF/AES-GCM device
wrapper. The outer v1 envelope and v6 payload stay the same, with a native-bound
origin label. Seed bytes are cleared best effort after use; JavaScript strings
and platform memory do not provide a guaranteed secure-erasure property.

Portable recovery omits the device slot and uses the existing strong-passphrase
wrapper. Export/download is an explicit OS sheet action; target apps may use
the internet or retain copies. Temporary files are private cache copies with
best-effort cleanup. There is no account recovery, sync or remote revocation.
Whole-vault backup/restore and selected-pair device copy retain their existing
scope. Physical file-picking, sharing, backup eviction and provider behaviour
need device acceptance as well as the crypto tests.

## Physical acceptance

Use dummy contacts. First verify app launch, Web Crypto and actual system unlock.
Then test NFC independently from BLE: iOS development launch argument
`--nfc-only`, Android launch extra `--ez vouch.nfcOnly true`. These suppress BLE
for a controlled NFC trial; normal launches use both available transports.
Debug logs record only readiness booleans and the transport of the first three
public frames, plus bounded radio discovery/read/service state and pause events; never token
contents, private keys, words or names. Check that NFC is enabled on Android.

Record: iPhone/Android model and OS, exact signed artefact hash, actual NFC frame
traffic, matching words on both screens, separate save, reciprocal call words,
manual/background lock, resume after radio pause and native biometric/device
credential use. Then repeat over BLE, including iPhone/iPhone when available.
These are qualification tasks, not a statement that they have passed. No novice
one-minute or panic acceptance and no independent cryptographic audit follows
from compilation, unit tests, screenshots or bridge stubs. See [LEGAL.md](LEGAL.md).
