# Canary on a phone

The everyday path is: **home-screen icon → unlock → person → listen, compare,
then say your words**. Setup, recovery and group keeper controls stay out of that
path. A mismatch says to pause and use a known contact route; a match remains
only evidence of the shared secret. No emergency alert is sent.

## Set up before a stressful call

1. Add the trusted HTTPS page to the home screen, open the new icon and keep
   using that app. iPhone instructions use the browser Share menu. Android uses
   its install prompt or menu; browsers without Google services may offer a
   shortcut. There is no compulsory browser or platform account.
2. Together in person, one person shows the private QR, the other scans. The
   creator protects and saves their progress before displaying the QR. The
   receiver keeps their copy. Each compares the fixed pair code, names the other
   person and finishes setup. Rotating words appear afterwards.
3. On an already trusted live call, use **send an invite**. Send the public offer
   through the existing chat. The recipient protects their phone and sends a
   recipient-encrypted reply. Open/paste the reply in the original Canary app;
   both compare the fixed pair code on the trusted call and finish setup.
4. Make a portable encrypted recovery backup, protected by a strong passphrase.
   A device-only credential is not portable recovery. Test restoring it before
   deleting an old copy. A website cannot recover lost keys.

The app cannot force chat links into an installed PWA, share browser/PWA storage,
or guarantee a one-minute installation on every phone. A new browser has a clear
paste/return-to-original-app path; it never invents the missing invitation. An
existing browser vault does not automatically migrate to a home-screen app.
Install first or use an encrypted backup to migrate.

## Protection and reuse

- Canary Kit's `deriveToken` / `deriveDuressToken`, backed by **Spoken Token**,
  remain the spoken-word engine. No replacement protocol or WASM runtime.
- The existing **Nostr Tools NIP-44** implementation encrypts remote pairing.
  **Nostr Attestations** remains the signed private-vouch format. These operate
  locally; no Nostr account, relay, public graph or remote signer is introduced.
- The existing local vault uses AES-256-GCM and fresh nonces. Platform WebAuthn
  user verification is required and PRF/HKDF wraps the random vault key. The
  platform may use biometrics, its device PIN, a password manager or a security
  key. Availability and credential sync depend on the provider.
- PRF absence falls back to the existing PBKDF2-600,000 strong passphrase slot.
  A short browser PIN or credential identifier is not used as an encryption key.
  Signet's broader account/relay vault is not imported into this private tool.
- Pending remote exchange private keys, invitations, labels, pending encrypted
  replies, pair seeds and recovery data live inside the same encrypted vault.
  Incoming private QR pairs remain transient until explicitly kept. New saves use
  encrypted payload version 3: original arrays and version 2 are read and upgraded;
  older app builds refuse the new payload rather than dropping pending state. Background
  locking clears the displayed QR, words, names, transfer fields and in-memory
  vault; saved exchanges can be resumed after unlock.

## Remote transcript

`connect.ts` generates an independent ephemeral secp256k1 key and 128-bit request
identifier for an offer. The offer contains only protocol version, type, request
ID and public key. The responder generates a fresh pair secret and ephemeral
key, encrypts the pair with NIP-44 and binds the purpose, request, recipient,
sender and direction inside the ciphertext. The initiator decrypts only a reply
matching its saved request and consumes that request in the same encrypted save
that creates the pending pair. Replayed replies then have no pending request.
The responder's private exchange key is discarded after encryption. Saved
outgoing replies can be resent until setup is confirmed.

This is a local application profile over existing encryption, not an independently
audited new authentication standard. Public invitation keys are unauthenticated.
The separate trusted comparison is essential against substitution. A known face
or voice alone is not proof against impersonation; neither the existing chat nor
a shared word excludes a live relay or a compromised unlocked endpoint. Offers
have no automatic expiry; remove abandoned ones. Removing a pair cannot revoke
the other person's copy. Never send the in-person secret QR through a chat.

## Offline shell and updates

The HTTPS build has a manifest and PNG icons. A service worker caches only the
five public files in its allowlist. It never handles vault data or request bodies,
never caches unknown paths or queries and contains no message endpoint. Its app
build identifier is bound to the downloaded HTML during installation. It does
not activate in place over an existing worker: close all Canary windows and
reopen to apply a downloaded update. Recovery backups remain necessary; browsers
can evict data or users can clear it even after persistent storage is granted.
The separate downloaded HTML remains usable without a service worker or host.

## Evidence limits

Automated Chromium phones exercise the public/ciphertext transcript, separate
browser vaults, reload/background recovery, fresh words and all checker outcomes,
passphrase fallback, backup/restore, storage failure, actual QR image decoding,
canvas camera capture/stop, restrictive CSP and actual offline reload. Native
credential operations are stubs. Physical iPhone/GrapheneOS camera scanning,
provider PRF/device PIN/biometrics, installation and restore across actual PWA
storage, call multitasking and timed usability require owner/device evaluation.
See `VALIDATION.md` and `evidence/mobile-journey.json`.

## Platform references

Installation copy was checked against [Apple’s iPhone web app instructions](https://support.apple.com/en-ca/guide/iphone/iphea86e5236/27/ios/27),
[WebKit’s home-screen app guidance](https://webkit.org/blog/13878/), and
[Apple’s explanation of separate home-screen storage](https://developer.apple.com/videos/play/wwdc2023/10120/).
These explain platform behaviour; the physical acceptance gate above remains.
