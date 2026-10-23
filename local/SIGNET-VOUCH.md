# Signet Vouch: a simple call check and deliberate group introductions

The public product remains Signet Vouch on the same origin, with the same PWA ID,
encrypted vault, publisher and privacy contact. The default experience is for two
people who already know each other: **Show my code / Scan their code**, save a
check together, then use rotating words on later calls. Group vouches are under
separate details and an unlocked People navigation entry.

## A meeting people can follow

The creator protects/saves a public invitation, the recipient scans and taps
**Save our check on this phone**, then shows an encrypted reply to scan back.
There is no name form, installation requirement or protocol checkbox on the
nearby recipient's opening screen. Both read four fixed comparison words,
name each other for future use and finish on their own phones. Neither phone
claims to know that the other finished saving. Both sides retain encrypted
progress, and the recipient can resend the exact reply.

The existing NIP-44 `connect.ts` protocol supplies encryption. Its optional
in-person hint is bound inside the encrypted reply and checked against the saved
offer; it is a transport hint, not proof that a meeting happened. The public QR
never directly contains the pair seed. The older secret-bearing QR/manual path
remains an explicit recovery option. The comparison is four Spoken Token words
in a separate fixed setup namespace (44-bit space); stored references and
30-second, two-word call phrases remain unchanged.

For ordinary checks, open Vouch, unlock and tap a person. If you asked for the
check, listen first; if they asked, read only You say. A mismatch offers a pause
and known contact route. A matching secret/key does not independently bind a
messaging account, rule out a live relay, certify civil identity or establish
safety. Duress is optional, requires an agreed response and sends no alert.

## Agree the statement before signing

New named-vouch requests propose a group-specific nickname in signed `claim`
and `known-as` tags. The holder sees the proposed statement and explicitly
agrees before returning the fresh proof. That proof binds the exact signed
request ID. The voucher signs the same agreed name, method and dates; it cannot
silently substitute another name after that reply.

The voucher's private address-book alias is separate and is not automatically
prefilled into the shared statement. The holder reviews the signed receipt before
keeping it and chooses which current receipt to disclose during a member check.
The keeper reviews the statement, issuer and supplied account observation before
keeping evidence. They make any admission decision themselves in the other app.
Legacy unnamed vouches remain clearly labelled meeting records without a signed
name. Aliases never grant voucher authority or merge people across groups.

Names in signed claims are disclosed to the holder and, on presentation, the
keeper; those recipients can copy/retain them. No publisher content endpoint,
public profile, trust score, relay, directory or cloud sync was added.

## Independent saved exchanges

Up to eight pending requests per group can coexist, matched by signed request ID,
subject, purpose, account context and expiry. Completing/cancelling one leaves
others intact. The UI replaces only a chosen person's same-purpose check after
confirmation. Sixteen separately named outgoing handoffs can be saved per group;
capacity is rejected before saving, with no silent eviction. Legacy pending and
outgoing slots remain readable. Ciphertext is persisted before QR/share display.

Vault payload version 5 reads arrays and v2/v3/v4. Older builds refuse v5 rather
than silently lose independent requests, approved names or saved replies. The
outer envelope and credential slots stay unchanged. Group signing keys remain
independent of shared spoken-word seeds. Device copy transfers completed pairs;
group keys still need whole-vault recovery and are not silently cloned.

## Existing technology and acceptance

Canary Kit / Spoken Token, Nostr Attestations, Nostr Tools/Noble signatures and
NIP-44, WebAuthn PRF and Web Crypto remain the engines. No WASM runtime or new
cipher was added. My Signet's native Android NFC/nearby handshake remains a
separate implementation: this website cannot perform phone bumps and does not
present a fake tap control. Its branding does not connect a Signet account.

Automated source, vault migration, real QR decoding, local browser and deployed
readback checks are recorded in VALIDATION.md and evidence/. They are not a
physical iPhone/GrapheneOS camera/biometrics/OS-sharing test, novice timed usability
trial, independent security audit or legal clearance.
