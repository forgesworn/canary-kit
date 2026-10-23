# Signet Vouch — your people, your call check

A phone-first website at [Signet Vouch](https://canary-words.cocoacod256.chatgpt.site/),
with a self-contained
[HTML copy](../canary-local.html) for local review in **Chrome**. There are no
application accounts, message servers, directories, relays or secret-sync APIs.
The static hosting candidate is generated in ignored `local-site/`.

## In practice

The opening screen explains the purpose: keep a private check with someone you
know, then compare your two spoken words on a future call. It offers one primary
**Connect** button. Group introductions and other setup methods stay separate.
There is no Nostr account or group choice to learn for pairing.

Together in person:

1. Both open **Connect**. Protect/unlock each device if prompted. Each saves its
   temporary session encrypted before displaying a public QR.
2. Face the screens towards each other. Front cameras read the codes and their
   updates automatically. Keep a gap so each camera can see the other code.
3. Both compare the same **four fixed words**, name the other person for future
   use, then tap **Same words · save our check** on their own device. Leave the
   code visible until both have their words. Neither phone proves the other saved.
4. The two different call phrases appear afterwards and rotate every 30 seconds.
   Setup words do not rotate. Setup has no countdown: a paused camera can read
   again using the same saved connection, including after lock/unlock.

Both devices must already have the app available for fully offline setup. No
internet, microphone, relay or shared-secret transfer is used by the exchange.
A desktop with a webcam uses the same flow. Without a camera, show the desktop
code to the phone, explicitly transfer the phone's public reply file back using
an offline method, open it on the desktop, then let the phone read its updated
code. OS share targets may use the internet; the app does not select one for you.

Progress is saved before a code/reveal is displayed. A failed save never claims
success or releases an unpersisted commitment. Starting a new relationship does
not validate an unexpected caller or replace a saved person. Use an already
trusted meeting/call to establish trust.

Later: **home-screen icon → unlock → person → words**. If you requested the
check, listen first. If the other person asked, read **You say**. Never read their
expected **Listen for** words aloud. A normal match is knowledge of the shared
secret, not a guarantee of identity or safety. For unexpected words, use the
private checker. It shows large normal and duress choices to compare without
typing, plus **Neither matches**. Select only what you actually heard. A duress
result is distinct and stays visible until a fresh check or lock; it needs a
rehearsed human response and sends no alert. Manual entry still accepts the full
words across one interval of clock drift.

The Spoken Token list has ambiguous four-letter prefixes, so spoken check words
must be read in full. Manual BIP39 recovery still accepts the first four letters
of each of all 12 setup words (short words stay whole). Never use wallet words.

The fixed comparison uses Canary Kit `deriveToken` in a separate setup namespace,
counter zero, four words (44-bit output space); the existing pair reference stays
unchanged. Call phrases retain two words, 30-second intervals and ±1 tolerance.
They remain replayable during their accepted window, and live relay is possible.

One-minute setup and panic usability are physical-person acceptance targets,
not measured claims. My Signet Android has a separate native NFC/nearby
handshake. This website uses optical exchange and does not perform phone bumps.

## Public connection codes and private recovery

Default Connect uses the [offline commit/reveal profile](OFFLINE-CONNECT.md).
Public session keys, commitments and released random contributions are exchanged;
each device derives the pair seed locally using existing Nostr Tools ECDH/HKDF
and Canary Kit / Spoken Token SHA-256/HMAC helpers. Pinning and saving the peer's
commitment before revealing the local contribution prevents choosing that
contribution after seeing the peer's. Comparing the fixed four words together is
still essential. This new application profile is not independently audited.

**Other ways to connect** retains the prior nearby invitation/encrypted reply
and trusted-call chat flow (`connect.ts`, existing NIP-44 encryption). The older
**Recover an older shared-secret pair** QR/manual path remains secret-bearing:
keep it private. Default connection QR/files contain no shared seed.

HTTPS `#meet=` and `#connect=` fragments are removed before module loading and
do not enter HTTP requests. Camera/history/clipboard/chosen apps may retain
links or public files. Removing a fragment does not erase their copies.

## Keeping pairs for the future

For legacy raw-secret QR/manual recovery, before **Keep on this phone** the pair exists only in memory. It clears on
backgrounding, reload, manual lock, Escape or five minutes without interaction.
The screen explicitly distinguishes a transient pair from a saved one. Failed
storage does not claim success. Both people must keep their own copy.

The vault saves nicknames, pair secrets/roles, and unfinished Connect session
keys, nonces, pinned public cards and unconfirmed pairs as encrypted browser storage.
Payload v6 reads arrays and v2–v5; older apps refuse new saves. Finishing or
removing a session changes the active vault, not old backups/copies. The vault
locks on reload, backgrounding, Escape, manual lock and five minutes without
interaction. Local master-key bytes are zeroed on lock as a best effort; JavaScript
and the browser do not provide guaranteed secure memory erasure.

A device-only vault has no passphrase recovery initially. Under **Your people →
Recovery & device unlock**, add a recovery passphrase and save an encrypted
backup. Without recovery, losing device unlock or clearing browser data can lose
your pairs. Previous passphrase-protected vaults remain readable.

**Save encrypted backup** downloads encrypted JSON, not a secret-bearing HTML
file. It omits the device credential slot and can be restored with the vault
passphrase on another device/origin. There is no password reset or server recovery.
Browser data clearing, eviction or device loss can otherwise lose the vault.

Normal use needs a stable, isolated HTTPS origin: browser storage and passkeys
belong to an origin. Do not share an origin with the larger relay-enabled app or
other applications. The HTML also works directly in Chrome, but device unlock
is disabled for `file://` and local-file storage behaviour is browser-dependent.
The HTTPS app caches its public shell with a service worker; close all its windows
and reopen to apply a downloaded update. The standalone HTML does not install a
service worker. Obtain the shell on both devices before going offline.

Earlier prototype private HTML copies remain **unencrypted**. This change does
not delete or protect them. Retire those copies and create fresh pairs where
appropriate; importing their old setup words does not revoke an exposed old copy.

## Protection and limits

- AES-256-GCM encrypts the payload with a random master key and fresh 96-bit
  nonces. When a passphrase is used, a separately salted PBKDF2-SHA256 key
  (600,000 iterations) wraps the master key. Identifiers and record purpose are authenticated as additional data.
- Device unlock, offered first when keeping a new pair, uses WebAuthn with required user verification and the
  PRF extension, then HKDF-SHA256 to wrap that same master key. A signature-only
  credential does not enable encryption unlock. Credential IDs are not encryption
  keys. Unsupported providers fail without changing the protected saved vault;
  the provider may nevertheless have created an unused passkey during its prompt.
- Device credentials may sync through the user's chosen platform provider;
  availability and its account protections depend on that provider. Canary adds
  no Google runtime, remote identity SDK, telemetry or cloud-secret storage.
- QR decoding is bundled JavaScript, not a remote service. The camera requests
  no audio, stops on success/cancellation/background/navigation and after one
  minute, and stops late permission-granted streams too. Frames are not recorded
  or uploaded. Default Connect codes contain public material only; the advanced older-pair
  recovery QR contains its shared secret and must stay private.
- Application connections, forms and external resources are blocked by CSP.
  The live host serves additional framing, transport, MIME and permissions
  headers; actual readback matches the artifact. A minimal response wrapper
  delivers the page without a message API or remote vault. The host processes
  request metadata, aggregate traffic statistics and a bot-protection cookie;
  the page includes the adopted hosting/privacy notice.
- Encryption protects a locked vault or copied backup. It cannot protect an
  unlocked compromised phone, malicious extension, screen capture, compromised
  passkey provider, tampered served code or live relay. Anyone with the pair
  secret can derive both sides. Local deletion cannot remotely revoke another copy.

This is shared-secret knowledge, not certification of identity, a past meeting,
or a person's safety. There is no emergency dispatch. An independent security
audit and physical GrapheneOS/iPhone acceptance are still outstanding.

## Reuse and building

`src/token.ts` and locked `spoken-token@2.1.0` supply normal/duress derivation,
collision avoidance, HMAC-SHA256 and the spoken word list. Existing `@scure/bip39`
supplies checksummed setup words. Existing `qrcode-generator@2.0.4` generates QR;
pinned `jsqr@1.4.0` decodes locally. Vault cryptography uses browser Web Crypto,
not newly implemented ciphers or WASM. The bundle includes MIT and Apache-2.0
licences and notices. Existing library protocols and `app/` remain unchanged.

```sh
npm ci --no-audit --no-fund
npm run build:local
npm test -- --maxWorkers=2
npm run typecheck
npm run typecheck:local
npm run test:local
```

Set `CANARY_CHROMIUM_EXECUTABLE` to reuse an installed compatible Chromium
instead of downloading one. Browser checks create their own localhost fixture,
close it and the browser, and delete temporary encrypted backups afterwards.

The independent live check is `node tools/test-hosted-local.mjs` (same Chromium
override). It opens the real public site anonymously and records no secret values.

See [validation](VALIDATION.md) and [draft UK legal cover](legal/README.md).

## Optional private contacts and vouches

Contact details can save your meeting method and observed account labels inside
the encrypted vault. These notes do not independently prove platform account
control. Successful typed normal-word checks can record a local check date;
displaying words alone does not count.

Open **Private groups & vouches** to create or keep a group. No Nostr account or
relay is required. Compare the keeper code before keeping the group. Each phone
uses a separate signing key for each group, protected by the existing vault.

A holder shows **My verification QR**. The other person selects **Check their key
before vouching**, sends a fresh challenge, and receives the holder's response.
They then explicitly choose the meeting/call method and sign a private vouch.
The holder scans the encrypted handoff and chooses Keep. Return steps are needed;
ordinary personal pairing stays independent, using offline Connect.

A keeper can check a private vouch or check a voucher key before explicitly
accepting that person's vouches. Fresh proofs bind the group, holder, checker,
purpose, nonce, account-context text and expiry. A passed proof is local evidence
for a human admission decision; no messaging membership changes automatically.
The keeper chooses trusted issuers, with no automatic friends-of-friends trust.

Outgoing exchanges and pending checks save before displaying their QR. After
locking/reloading, reopen the group and use **Continue exchange**. Expired
requests need a new check. Group keys travel in your encrypted recovery backup.
Withdrawals must reach each relevant phone separately; no global status service
is claimed. See [protocol and limits](PRIVATE-TRUST.md).
