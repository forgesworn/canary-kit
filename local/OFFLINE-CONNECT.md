# Offline Connect

Both prepared devices open **Connect**, face their screens towards each other,
compare four fixed words, name each other and save separately. The front cameras
automatically read public QR updates. The shared pair seed is derived locally;
it is never sent in a code or file. Nothing is posted to a relay or server.

Both devices need the public app shell before going offline. A desktop webcam
uses the same flow. This is an optical exchange, not native phone tapping.

## Public transcript

`meet.ts` implements a new local application profile using existing primitives:

1. Generate an ephemeral secp256k1 key, random 128-bit session ID and random
   256-bit nonce. Save them in the encrypted vault before displaying a card.
2. Display the ID, x-only public key and SHA-256 nonce commitment. Pin and save
   the peer's entire public card before releasing the local nonce.
3. Display the original card plus the released nonce and intended peer ID.
   Validate the other reveal against its saved commitment and recipient ID.
   A different peer/key/commitment is rejected rather than silently replaced.
4. Derive the shared key using Nostr Tools' existing NIP-44 v2 conversation-key
   helper: secp256k1 ECDH shared x-coordinate, then HKDF-extract SHA-256 with
   salt `nip44-v2`. No NIP-44 ciphertext or signed Nostr event is sent here.
5. HMAC-SHA256 the complete ordered transcript using that key; the first
   16 bytes become the existing BIP39 pair seed. Public-key ordering determines
   opposite speaking roles. Both humans compare the fixed four words before
   saving the completed check on each device.

The commitment is SHA-256 over UTF-8 `JSON.stringify` of:

```text
["canary:offline-meet:commit:v1", id, publicKey, nonce]
```

All component strings are fixed-length lowercase hexadecimal. The seed HMAC
input is the UTF-8 serialisation of the following array, where A/B are sorted
lexicographically by public key and must have different keys and IDs:

```text
["canary:offline-meet:seed:v1",
 [idA, pubA, commitmentA, nonceA],
 [idB, pubB, commitmentB, nonceB]]
```

Commit-before-reveal prevents choosing a contribution after learning the peer's
random contribution to the comparison. Persistence is part of that ordering:
failed storage must not expose a reveal. Replays of the same card/reveal are
idempotent within its saved session; replacing it requires an explicit restart.

This is a new application profile, not the My Signet native NFC protocol or an
independently audited authentication standard. A four-word comparison has a
44-bit output space, not unlimited authentication strength. The two people
must compare through their trusted encounter. It cannot exclude live forwarding,
an unlocked compromised endpoint, tampered code or a misleading human claim.
There is no proof that the other human confirmed or saved. Do not use a new pair
to validate an unexpected caller.

## Wire representation

The compact token is case-sensitive and contains no padding:

```text
CANARY-MEET:1:<base64url(id[16] || publicKey[32] || commitment[32])>
CANARY-MEET:1:<same card>:<base64url(recipientId[16] || nonce[32])>
```

The card segment is 107 characters (80 bytes); the optional reveal segment is
64 characters (48 bytes). Canonical encoding and exact lengths are required.
HTTPS QR links use the same-origin/path `#meet=<token>` fragment. Other origins,
paths, query strings and credentials are rejected. Local HTML uses the raw token
for Vouch's bundled scanner. Normal camera apps need an available HTTPS page.

The early inline bootstrap removes recognised fragments before module loading;
fragments are outside HTTP requests. Public IDs/keys/commitments/revealed nonces
can link observations of the same exchange. Camera apps, screenshots, history
sync, extensions and file-transfer apps can retain them. No anonymity or erasure
claim is made. The unreleased nonce and private key remain in the local vault.

## Saved state and interruption

Vault payload v6 adds up to eight independent unfinished sessions, including
private keys/nonces, pinned peer cards/reveals and any derived unconfirmed pair.
Array and v2–v5 payloads remain readable. Session/pending-pair consistency is
validated on read and save; old apps reject v6 rather than dropping its fields.
The outer v1 envelope, existing credentials, completed pairs and group keys stay
unchanged. Recovery backups include unfinished session state.

Setup has no clock deadline. Camera capture pauses after 60 seconds; **Read
codes again** resumes the same saved session. Lock/background/reload clear the
display and stop capture. Unlock resumes the saved public code and comparison.
The code remains on screen after obtaining the words so the slower peer can
catch up. Both must have their words before comparing and saving.

Completion removes the session and pending marker in the same encrypted save
that keeps the completed pair. Restart/removal affects only that local session.
These actions do not erase old backups, OS/browser remnants or the peer's copy.
JavaScript strings and browser storage have no guaranteed secure-erasure property.

The call engine is unchanged: Canary Kit / Spoken Token derives two directional
normal/duress words every 30 seconds, with a private checker allowing one interval
either side. The fixed four-word setup namespace does not rotate. Spoken words
must be read in full; this word list lacks unique four-letter prefixes. BIP39
four-letter recovery prefixes apply only to the separate 12-word recovery input.

## Camera and file behaviour

Front-camera capture is requested only after entering Connect and protecting the
vault. Audio is disabled. A switch-camera control is available. The bundled jsQR
decoder processes local frames with a centre-crop retry; frames are not uploaded
or recorded. Capture stops on successful reveal, navigation, lock, pause and late
permission grants after cancellation. There is no NFC, microphone, Bluetooth,
WebRTC, socket, rendezvous or application network transport in this exchange.

A camera-less desktop can show its initial QR to a phone. Save/share the phone's
public reply file, transfer it by an offline method, then open/drop it on the
desktop. Let the phone read the updated desktop QR to finish. Files carry the
public token only, never names, private keys or pair seed. Both devices can also
exchange successive public files deliberately. OS share sheets may offer
networked apps; the app cannot guarantee those destinations are offline or do
not retain files. Revoking a Blob URL does not delete a downloaded file.

## Reuse and evidence

No new dependency or cipher was added. Existing Nostr Tools/Noble perform key
agreement; Canary Kit / Spoken Token supplies SHA-256, HMAC, word derivation and
duress behaviour; Scure BIP39 supplies recovery encoding. Existing Web Crypto
and WebAuthn PRF protect the vault, with a strong-passphrase fallback. The prior
NIP-44 invitation/encrypted reply remains under **Other ways to connect**.

`meet.test.ts` includes an independent Node/OpenSSL ECDH/HMAC transcript check,
opposite-role agreement, tamper/recipient/reflection/peer-change rejection,
serialised resume and bounded state. Vault tests exercise v6 consistency and
cleanup. `tools/test-offline-meet.mjs` uses two isolated Chromium contexts,
actual QR pixels and local canvas camera streams, browser networking disabled
after loading, camera pause, storage failure before reveal, mirrored frames,
slower peer, lock/resume, reciprocal call words and camera-less file fallback.
Credential operations use a stub; no physical optics are reproduced.

Physical iPhone/GrapheneOS/webcam scanning, provider PRF/biometrics, offline OS
file transfer, one-minute novice usability and independent cryptographic review
remain separate acceptance gates. See [PHONE-ACCEPTANCE.md](PHONE-ACCEPTANCE.md),
[VALIDATION.md](VALIDATION.md) and [the UK assessment](legal/README.md).
