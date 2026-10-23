# Signet Vouch — your people, your call check

A phone-first website at [Signet Vouch](https://canary-words.cocoacod256.chatgpt.site/),
with a self-contained
[HTML copy](../canary-local.html) for local review in **Chrome**. There are no
application accounts, message servers, directories, relays or secret-sync APIs.
The static hosting candidate is generated in ignored `local-site/`.

## In practice

The opening screen explains the purpose: save a private check with someone you
know, then compare your two spoken words on a future call. It offers **Show my
code** and **Scan their code**. Group introductions are under a separate details
panel. There is no Nostr account, group choice or terminology to learn for pairing.

Together in person:

1. One person taps **Show my code**, protecting their phone if needed. Progress
   is saved encrypted before a public invitation QR is displayed.
2. The other scans using their normal camera on HTTPS, or Vouch's scanner. Their
   screen explains why and offers **Save our check on this phone**. Protection is
   through a supported device credential or strong passphrase fallback. No name
   form, install requirement or protocol checkbox interrupts this step.
3. They show the recipient-encrypted reply QR. The first phone scans it back.
   Both read the same **four fixed setup comparison words**, name the other
   person so they can find them later, and tap **Same code · save our check**.
   Each saves on their own phone; neither can certify the other's final save.
4. The two different call phrases appear only after confirmation. They rotate
   every 30 seconds. Setup comparison words do not rotate.

Both sides can unlock and resume saved progress after switching apps. The
receiver can re-show the exact encrypted reply. Failed storage never claims
success. Setting up a new pair does not validate an unexpected caller or replace
an existing saved person. Use an already trusted meeting/call to establish trust.

Later: **home-screen icon → unlock → person → words**. If you requested the
check, listen first. If the other person asked, read **You say**. Never read their
expected **Listen for** words aloud. A normal match is knowledge of the shared
secret, not a guarantee of identity or safety. For unexpected words, use the
private checker; an agreed duress signal needs a rehearsed human response and
sends no alert.

The Spoken Token list has ambiguous four-letter prefixes, so spoken check words
must be read in full. Manual BIP39 recovery still accepts the first four letters
of each of all 12 setup words (short words stay whole). Never use wallet words.

The fixed comparison uses Canary Kit `deriveToken` in a separate setup namespace,
counter zero, four words (44-bit output space); the existing pair reference stays
unchanged. Call phrases retain two words, 30-second intervals and ±1 tolerance.
They remain replayable during their accepted window, and live relay is possible.

One-minute setup and panic usability are physical-person acceptance targets,
not measured claims. A local file can exchange raw public/encrypted codes using
the in-app scanner; normal-camera links need the stable HTTPS site. The existing
My Signet Android app has native NFC/nearby handshake code. This website has no
phone-bump feature; browser NFC does not supply that native transport.

## Public invitations and private recovery

Default in-person and trusted-call setup use the existing `connect.ts` NIP-44
invitation/reply protocol. The invitation contains an ephemeral public key, not
the shared pair seed; the reply encrypts that seed for the invitation key. Compare
the fixed words through the trusted encounter to detect substitution.

HTTPS `#connect=` fragments are removed before module loading and do not enter
HTTP requests. Camera/history/clipboard/chosen apps may retain links. The advanced
**Recover an older shared-secret pair** QR/manual flow remains secret-bearing:
keep it private. Removing a fragment does not erase other software's copies.

## Keeping pairs for the future

For legacy raw-secret QR/manual recovery, before **Keep on this phone** the pair exists only in memory. It clears on
backgrounding, reload, manual lock, Escape or five minutes without interaction.
The screen explicitly distinguishes a transient pair from a saved one. Failed
storage does not claim success. Both people must keep their own copy.

The vault saves nicknames, setup secrets and roles as encrypted browser storage.
It locks on reload, backgrounding, Escape, manual lock and five minutes without
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
No service worker is installed. Local operations work after the page is loaded;
future offline navigation to a hosted page is not promised.

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
  or uploaded. The displayed QR contains the setup secret: keep it private.
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
ordinary personal pairing stays independent, using a public QR and encrypted scan-back.

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
