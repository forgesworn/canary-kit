# Private contacts and group vouches

This optional browser-local feature uses existing Spoken Token / Canary Kit for
spoken checks, `nostr-attestations@3.0.1` for attestation templates, BIP-340
signatures through Nostr Tools and Noble Curves, and NIP-44 v2 for encrypted
handoffs. It creates no Nostr account/profile and connects to no relay. Its
attestation encoding is Nostr-derived; network publication is absent. There is no
age, professional identity, government-ID or global reputation assertion.

## Separate experiences

Ordinary personal pairing exchanges a public invitation QR and recipient-encrypted scan-back, followed by fixed-word comparison and an explicit save on each phone.
Contact details can record the user's meeting method, observed accounts and last
matching word check. These are private notes, not independent proof of platform
account control. Merely displaying words does not record a successful comparison.
No word or duress phrase goes into a vouch, public card or group check.

Vouching is separate and deliberate. A keeper creates a group and shares its
signed group card. A joiner compares the keeper fingerprint through a trusted
channel before keeping it. Each phone generates an independent signing key for
this group; signing keys are never derived from the shared word seed. Reopening
the same group card preserves this phone's existing key and evidence.

The holder shows their verification QR. The voucher sends an encrypted fresh
challenge, the holder explicitly returns a signed response, and only then does
the voucher choose in-person/online method and a 1–90 day expiry. The resulting
signed vouch is encrypted for the holder, who explicitly keeps it. This needs
return steps; it is not represented as a one-scan mutual attestation ceremony.

For admission evidence the keeper sends a new challenge. The holder's response
contains a signed proof bound to that challenge and a vouch for the same key.
The keeper verifies its own signature on the saved request, group, purpose,
holder, recipient, nonce, exact account-context text, expiry and accepted issuer.
The pending request is consumed in the same encrypted save that records a
successful key check. A replay has no pending request to satisfy. The result is
evidence for the keeper's decision; it does not operate another app's membership
or establish platform ownership merely because an account label was supplied.

Accepting a voucher uses a distinct fresh key check and explicit keeper action.
A member check never confers that permission. Members can issue claims; only
the keeper's local accepted-voucher list gives those claims admission weight.
There is no automatic transitive trust or score threshold. A vouch cannot name
its own signer as its subject.

## State and transfer boundaries

Group keys, names, selected vouchers, local aliases, issued/received vouches,
withdrawals, pending challenges and the latest outgoing transfer are in the
existing AES-GCM encrypted vault. The outer vault format remains version 1;
the decrypted payload is version 5. Legacy arrays and version 2/3/4 payloads remain readable.
Saving/renaming contacts preserves group state. Portable encrypted backups carry
the group keys and pending exchanges; device-only vaults still need a recovery
passphrase before export. Existing backups are not silently retrofitted.

Signed group and holder cards intentionally disclose their public data to the
recipient. Vouches, challenges, responses and withdrawals are NIP-44 encrypted
for the intended group key. Signatures are verified independently of encryption;
the outer sender must match the signed inner event. A holder response may carry
another issuer's signed credential, which is verified independently.

The wire profile compresses signed public claim data before encryption to keep
return QRs practical; no private signing key or pair seed is in that data.
Outer transfers use bounded deflate plus base64url in `CANARY-TRUST:1:`. Both
decompression layers enforce maximum expanded lengths. HTTPS links use
`#trust=...`; the early hashed script removes fragments before module loading.
In-app scanning and paste accept only this origin/path or an explicit raw token.
No automatic fetch, WebSocket, profile lookup, directory, cloud backup, bot,
message API or public publication is implemented. Clipboard/native sharing acts
only on the user's button press and uses the user's chosen external app.

State is persisted before showing an outgoing QR. Lock/background/idle clears
plaintext UI and references. Unlocking the group offers Continue exchange after
a reload; time-bounded requests can still expire and must then be replaced.
WebAuthn/PRF protects the vault where supported; the portable signing keys remain
separate from origin-scoped device credentials. Browser memory erasure is best
effort, and a compromised unlocked device or tampered website can act as the user.

## Withdrawals, limits and recovery

Only the original signer can withdraw a saved issued vouch. The signed
withdrawal is kept locally and can be handed separately to holder and keeper.
The keeper can also stop accepting a voucher immediately on their own phone.
Withdrawals affect checks using the updates a phone has received; no online
freshness service or global revocation guarantee exists. Copied proofs cannot be
erased. Dated historical checks remain historical when policy later changes.

Each vault supports eight groups; each group has bounded issuer/receipt,
accepted-voucher and withdrawal collections. Full state is rejected before a
write rather than silently dropping evidence. A strong encrypted recovery backup
is necessary to move keys to another browser/origin or recover lost storage.
Without the original keeper key or its recovery backup, creating a replacement
group creates a different identity and requires new trust decisions.

Signet connection, public relay publication, automatic account linking and
automatic admission are intentionally outside this implementation. Any later
adapter must require owner approval, verify signatures and scope, and reassess
privacy/hosting facts if it introduces network defaults or server processing.

## Evidence gate

Unit tests cover independent keys, signatures, scope, fresh proof before issuing,
clock skew, issuer policy, replay/expiry, self-vouch rejection, withdrawals,
bounded decompression and encrypted transfer. Vault tests cover old arrays,
contact notes, group-key preservation and portable recovery. Browser evidence
uses three isolated contexts and actual QR decoding; it is not a physical
iPhone/GrapheneOS acceptance test or an independent security audit.

## Signet Vouch experience

The same local app now presents Signet Vouch as its product name, retaining the
original origin, vault key, manifests, protocol identifiers and publisher. No
Signet login, account adapter or relay was added. The header and app icons reuse
the ForgeSworn Signet mark under its bundled MIT licence.

Front-page actions lead to vouching, showing private vouches and spoken setup.
Unlocked people keep a direct spoken-check path with a separate Vouches & groups
entry. Group rosters combine saved group keys, aliases, issued/received claims
and the last checked key. They are local evidence lists, not live membership.
Saving an alias never grants authority or links a spoken pair or platform account.

Receipt cards show issuer label, method, recorded date, expiry and the current/
expired/withdrawn state known on this device. Open current cards change to expired
at their deadline. Withdrawals are only those received locally. Historical key
checks remain labelled historical. A known person can be checked again without
rescanning a holder card, but the existing fresh challenge/response is required
before issuing a vouch; replacing an active unfinished request asks explicitly.
Expired verification cards are regenerated on Continue; expired pending requests
lead to a new check, never acceptance of the old proof.

## Simplified meeting and named vouch update

See [SIGNET-VOUCH.md](SIGNET-VOUCH.md) for the current two-action home, public
invitation plus encrypted QR reply, one-action nearby recipient, four fixed
comparison words and holder-approved group-name statements. Pending group checks
and outgoing handoffs are independent per exchange. Payload v5 reads legacy
arrays/v2/v3/v4; older builds refuse new saves. Group introductions remain optional,
and native My Signet Android phone tapping is not implemented by this website.
