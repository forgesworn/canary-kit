# Canary — your people, your words

A phone-first website at [Canary](https://canary-words.cocoacod256.chatgpt.site/),
with a self-contained
[HTML copy](../canary-local.html) for local review in **Chrome**. There are no
application accounts, message servers, directories, relays or secret-sync APIs.
The static hosting candidate is generated in ignored `local-site/`.

## In practice

When meeting someone:

1. On the HTTPS website, one person taps **Show my QR**.
2. The other uses their **normal phone camera**, taps its link, and Canary opens
   directly into their words. The creator taps **They’ve scanned · show our words**.
   The receiver does not need Canary open first. Compare the fixed **pair code**
   shown on both phones; it stays the same when the spoken words refresh.
3. Each taps **Keep on this phone** for future calls. There is no 30-second
   deadline to save; that countdown only refreshes spoken words. A supported device credential
   protects the saved pair without a custom passphrase. Unsupported browsers and
   local files ask for a vault passphrase only at this point. Existing vaults
   unlock here instead; an already unlocked vault saves with one tap.

No vault setup, typing, nickname or reference checkbox is required to exchange.
Camera and native device prompts still depend on the browser and operating system.
The local HTML file is a preview: its QR still requires **Scan their QR** inside
Canary on the other device. A Mac's local file address cannot open that file on
someone else's phone. Use the live HTTPS page for normal-camera linking. Its QR-link opening was
verified in fresh browsers; the physical iPhone scan is still an owner check.

If either phone needs to resume, the one still holding the pair opens it and taps
**Show this pair’s QR again**. The other phone scans that QR; it restores the
same pair and correct speaking side. A saved pair survives reload/device lock;
unlock it under **Your people** first. Repeated scans reuse an existing saved
pair after unlock, preserving its name. If neither phone kept the pair and both
cleared it, exchange a new QR. Unsaved data still clears on leaving/idle.

The fixed pair code is also the reference available in details. Names are optional and can be
added afterwards under **Name & pair details**. Without a name, saved pairs get
numbered labels. Agree together what the separate duress signal means and what
human response to make on hearing it.

This is designed for a brief in-person exchange; one-minute usability has not
been measured with real people. If scanning is unavailable, enter all 12 setup
words using their first four letters (or the full word). Words shorter than four
letters stay whole. All 12 entries and a valid BIP39 checksum are still required.
Never use wallet recovery words or a secret from another app.

Later, unlock and tap the person in **Your people**. Read **You say** aloud and
listen for **They should say**. Both sides have different phrases. Words change
on UTC 30-second boundaries. Use the full spoken words: the Spoken Token list
has 55 ambiguous four-letter prefixes, including `beach` / `beacon`. The BIP39
setup list has no such ambiguity. Two words provide 22 bits per phrase.

For a possible duress phrase, use **Check what they said**. The result is private
to that device and sends no alert. The checker accepts the current interval and
one on either side: three normal candidates, approximately 3 / 4,194,304 per
random guess, and a 90-second span of verifier times. Tokens are replayable in
their accepted window. A live relay can fool the check.

## Private setup links

An HTTPS QR carries the secret in a URL fragment (`#pair=…`), outside the path and
query sent to the host. A small hashed inline script removes it from the current
history entry before the application loads; the app consumes the transient value
once. Reusing an existing tab for another link is supported. In-app scanning can
also read a link for the same site; it parses the secret without navigating.

This is a reusable secret-bearing link, not an expiring or single-use invitation.
Native camera software, browser history sync, extensions or screen capture may
still copy it. Removing it from the address does not guarantee erasure of those
copies. Keep the QR/link between the pair; if exposed, establish a fresh pair.
The native camera/provider is outside Canary's local video-processing guarantee.

## Keeping pairs for the future

Before **Keep on this phone**, the pair exists only in memory. It clears on
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
