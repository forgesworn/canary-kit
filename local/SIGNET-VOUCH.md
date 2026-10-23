# Signet Vouch: a simpler private trust flow

The existing local app now presents Signet Vouch as its product name. Its live
origin, encrypted vault, protocol identifiers, publisher and privacy contact stay
the same. It reuses Canary Kit / Spoken Token, Nostr Attestations and the existing
signature/encryption libraries. No Signet login/service adapter, relay, directory,
public graph, account system or admission automation is added.

The front page offers **Vouch for someone**, **Show my vouches**, and **Set up a
spoken check**. A saved person still opens directly into the spoken check after
unlock. A separate Vouches & groups entry and small evidence shortcuts make the
private signed flow accessible without burying call checks.

## Signing and showing a vouch

Vouches are scoped to an existing private group. The group keeper chooses which
issuers to accept. Choose the shared group, scan the person's verification code,
compare it with them, send a fresh request and receive their signed reply. Only
then choose the meeting/trusted-call method and sign the vouch. Four short step
labels explain the exchange without representing it as a one-scan ceremony.
Native sharing/copying uses the user's chosen chat app; outgoing handoffs are
saved encrypted so they survive app switching.

Receipt cards show a private issuer label, actual recorded date, method, group,
expiry and current/expired/withdrawn state known by this device. The recipient
can name the voucher when keeping the receipt. The label is private and grants
no authority; the keeper still needs a distinct fresh voucher check and explicit
approval. A current claim is not a fresh identity or platform-account check.
Open cards change to expired at their deadline. Withdrawal freshness remains
limited to updates received locally.

## People saved for a group

The roster combines this device's aliases, trusted keys, issued/received claims
and latest checked subject. It is not a current membership list. A named row can
start another fresh vouch/member/voucher challenge without rescanning the holder
card. A saved key or previous receipt never substitutes for the new response.
Replacing a still-active unfinished request asks explicitly; expiry leads to a
new check and expired verification cards are refreshed rather than re-shared.

Local names use the existing bounded group.people field and remain inside the
encrypted vault/recovery. They never automatically link a shared spoken seed, a
person with the same name in another group, or a WhatsApp/Telegram account.
Platform binding and keeper admission remain separate human decisions. No schema
or cryptographic wire-profile migration is needed for this presentation change.

## Branding and acceptance

The Signet mark/app icons are reused from ForgeSworn's MIT-licensed Signet project;
the notice is bundled into generated HTML. The PWA keeps its existing ID, scope,
start URL and storage origin. Installed app labels/icons may update on the
platform's own schedule; do not move/clear an existing vault to change a label.
Close old app windows and reopen to activate a downloaded app update.

745 unit tests plus local browser checks cover signed status/expiry, current-card
expiry while open, named saved-person rechecks, explicit issuer approval,
withdrawal state and QR handoffs. Pairing, duress, encrypted recovery, device copy
and actual offline shell checks remain separate regression gates. Native PRF,
share and camera fixtures are not physical iPhone/GrapheneOS usability, actual
biometrics or independent security/legal acceptance. See VALIDATION.md for exact
published source, evidence and outstanding gates.
