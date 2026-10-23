# Signet Vouch: a simple call check and deliberate group introductions

The public product remains Signet Vouch on the same origin, with the same PWA ID,
encrypted vault, publisher and privacy contact. The default is for two people
who already know each other: **Connect → face screens together → compare four
words → name and save**. Optional group vouches remain separate.

## A meeting people can follow

Both devices open Connect. Protect/unlock if prompted, then face their screens
towards each other. Front cameras read public QR updates automatically. The
codes stay visible until both have the same four fixed words; compare them,
name each other and save on both devices. There is no setup deadline. Camera
capture pauses after a minute and **Read codes again** resumes the same session.
Interrupted progress survives encrypted lock/reload; neither phone claims to
prove the other's final save. Both must already have the app available offline.

A desktop webcam uses the same flow. A camera-less desktop shows its code to
the phone, imports the phone's deliberately transferred public reply file, then
lets the phone read its updated QR. Choose an offline file transfer for fully
offline setup. There is no transparent browser NFC bump, microphone, account,
relay, rendezvous or other application connection.

[OFFLINE-CONNECT.md](OFFLINE-CONNECT.md) specifies the new application profile:
save both public commitments before releasing local random contributions; derive
the pair seed locally with existing secp256k1 ECDH/HKDF and HMAC primitives.
Public codes contain no seed/private key. This profile needs independent review;
reusing primitives does not inherit an audit of the whole exchange. The previous
NIP-44 invitation/encrypted reply and raw-secret recovery remain under advanced
options. Old pair references, the four-word comparison's separate namespace
(44-bit space) and 30-second two-word call phrases stay unchanged.

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

Vault payload version 6 reads arrays and v2/v3/v4/v5. Older builds refuse v6 rather
than silently lose independent requests, approved names, saved replies or
unfinished offline session keys/nonces. Session completion/removal changes the
active vault, not backups or copies elsewhere. The
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
