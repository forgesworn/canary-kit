# Canary — your people, your words

A phone-first static website candidate, with a self-contained
[HTML copy](../canary-local.html) for local review in **Chrome**. There are no
application accounts, message servers, directories, relays or secret-sync APIs.
The static hosting candidate is generated in ignored `local-site/`.

## In practice

Set up each device once: choose a vault passphrase and keep it in a password
manager. On a supported HTTPS origin, optionally add device unlock under
**Your vault & backup**. The passphrase remains the recovery route.

When meeting someone:

1. Both open Canary and unlock their own vaults.
2. One chooses **Pair with someone → Make a pair**. The other chooses
   **Join their pair → Scan their private QR** inside Canary.
3. Compare the pair reference on both screens. Give the person a nickname,
   tick the reference confirmation and choose **Save this person** on each phone.
4. Agree together what the separate duress signal means and what to do on hearing it.

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

## Keeping pairs for the future

The vault saves nicknames, setup secrets and roles as encrypted browser storage.
It locks on reload, backgrounding, Escape, manual lock and five minutes without
interaction. Local master-key bytes are zeroed on lock as a best effort; JavaScript
and the browser do not provide guaranteed secure memory erasure.

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
  nonces. A separately salted PBKDF2-SHA256 key (600,000 iterations) wraps the
  master key. Identifiers and record purpose are authenticated as additional data.
- Optional device unlock uses WebAuthn with required user verification and the
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
  The deployment candidate includes additional framing, transport, MIME and
  permissions headers; a real host must be checked for actually serving them.
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

See [validation](VALIDATION.md) and [draft UK legal cover](legal/README.md).
