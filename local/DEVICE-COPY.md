# Copy people between your own devices

On the receiving desktop, open Canary in Chrome and choose **Bring my people
from another device → Bring my people here**. Protect/unlock that local vault;
it keeps a new private receive key encrypted before showing its public QR.

On the phone that already has your people, choose **Add another device → Copy
from this device → Scan QR**. Select people and make the copy. Share the encrypted
file using your OS share menu, or save it and send it through your own AirDrop,
chat or file transfer. The browser chooses which share targets are available;
Canary uses [Web Share](https://www.w3.org/TR/web-share/) from an explicit click,
with a Save file fallback. There is no automatic upload or message server.

Open/drop the file on the receiving device. Compare all three groups of its
fixed code against the phone, confirm the match, review the selected names and
import. The receiving device keeps its own master key, passphrase/device slots,
existing names, contact notes, groups and unfinished exchanges. Existing pair
secrets are skipped (including the opposite speaking role), colliding IDs are
remapped, different pairs with the same name remain separate. Nothing is silently
overwritten. Capacity failures leave the original vault/request intact.

Only completed people pairs and their historical contact notes are copied.
Private group keeper/signing keys, group policy/evidence, vault master/unlock
credentials and unfinished exchanges are excluded. Copies work independently;
changes, withdrawals and removals do not sync automatically. This is not a fresh
identity check. The source is kept. A replacement-device move is a deliberate
manual cleanup only after the new device works and has recovery prepared; there
is no promise of remote erasure or revocation.

## Existing library profile

`device-transfer.ts` uses the existing Nostr Tools NIP-44 v2 implementation,
with independent ephemeral keys. It creates no Nostr account and contacts no
relay or remote signer. Spoken Token's SHA-256/HMAC helpers, already re-exported
by Canary Kit, bind the transcript. No custom cipher or new runtime dependency
was added; `entries.ts` extracts the existing contact validation.

A public request carries a 128-bit random ID, x-only public key and created/expiry
seconds, with a fixed 15-minute lifetime. Its private key remains inside the
receiving vault. `#device=` request fragments are stripped by the early inline
bootstrap, outside HTTP requests. On a local file/loopback preview the QR carries
a compact request token for Canary's scanner; normal-camera links require HTTPS.

The QR uses a compact versioned token (request ID, public key and creation time),
with the fixed lifetime reconstructed on receipt; it avoids JSON/URL encoding
overhead. The reader also accepts the earlier JSON representation.

The source serialises only validated selected completed people. The JSON payload
is limited to 180,000 UTF-8 bytes. It is divided into at most 24 parts, each with
at most 8,000 UTF-16 code units; each is encrypted separately by NIP-44. Every
part binds purpose, request ID, both keys, dates, keyed manifest digest, index and
total. The digest is HMAC-SHA256 over the request-bound payload using the shared
conversation key, with its own domain label; a public plaintext hash would allow
someone who already knows a pair seed to test guesses about private notes.

The receiver checks the saved key/request, lifetime, all part bindings, order,
completeness, MAC and contact schema before preview. Ciphertext files are bounded
to 400,000 bytes at file input (and 400,000 characters in the model). The 48-bit
comparison code hashes the complete canonical public/ciphertext transcript with
its purpose label. The request key alone is not owner authentication: scanning
a device you trust and comparing the code on both devices are essential against
substitution. This application profile has local tests, not independent audit.

## Saved progress and commits

Vault payload version 5 retains one pending receive request/private key and one
outgoing encrypted file/count. Arrays and v2/v3 payloads remain readable. Saving
v5 makes older app builds fail closed rather than discard transfer state. Normal
people/trust/exchange data retains its 160,000-byte limit; the total payload may
use 600,000 bytes and the encoded record 1 MiB to retain a ciphertext handoff.
Device-copy state is included in a passphrase-encrypted recovery backup.

Background locking clears QR/name/preview DOM and references. The exact encrypted
outgoing file is retained in the vault so resending after unlock uses the same
code. File-share callbacks cannot redisplay a locked view. Recipient-encrypted
Blob download URLs may live for 60 seconds so OS handoff survives backgrounding;
then they are revoked. They contain no plaintext contacts. A receiver preview
must reopen the encrypted file after unlocking.

Import revalidates the file and the still-current request, merges against the
current entries, removes the receive request, and seals/persists both in one
save guarded by vault identity, generation, document visibility and disk version.
There is no success screen after a failed save. A consumed request cannot be
reused in this state, but an older recovery backup can restore an unconsumed key;
this is local replay control, not global revocation. Expiry is an app acceptance
rule, not cryptographic deletion of retained files, keys or backups.

## Evidence and acceptance

`tools/test-device-copy.mjs` exercises real QR image decoding, the in-app scanner
with a local canvas camera stream (including stopped tracks), selection,
recipient encryption, a native-share lifecycle stub, exact encrypted resume,
passphrase-protected destination import, code confirmation, failed-storage retry,
name/credential preservation, duplicate handling, reload, wrong-request rejection
and source preservation. It records `evidence/device-copy.json`; the same script
uses `CANARY_DEVICE_URL` for deployed verification. Screenshot codes are dummy
values. PRF credentials and OS sharing are stubs; local passphrase/NIP-44 crypto
runs normally. Physical camera/biometrics, actual AirDrop/chat file handoff and
phone/desktop call usability remain separate owner acceptance gates.

## Simplified meeting and named vouch update

See [SIGNET-VOUCH.md](SIGNET-VOUCH.md) for the current two-action home, public
invitation plus encrypted QR reply, one-action nearby recipient, four fixed
comparison words and holder-approved group-name statements. Pending group checks
and outgoing handoffs are independent per exchange. Payload v5 reads legacy
arrays/v2/v3/v4; older builds refuse new saves. Group introductions remain optional,
and native My Signet Android phone tapping is not implemented by this website.
