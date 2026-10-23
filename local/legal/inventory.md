# Inventory and gap check

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code `1ac118f5c4287159f08a72989c77d288c45207b7`.
Law note verified 28 September 2026; §§5.1–5.2 and 7 partially refreshed
23 October 2026 against primary sources.**

Current factual delta reviewed on 23 October 2026 against the working tree based
on app commit `621b6ae5b4da6f8703b863bfeef9af4aeb8f7476` and the modified
`../canary-words-site` publishing source. Earlier commit/readback references
below record the earlier release, not production verification of this candidate.
No deployment or public readback was performed for this gap review.


The legal-cover inventory helper was rerun on tracked `local/`: fourteen
source/config/evidence files out of thirty-four tracked files, excluding prose,
tests and build output. It found localStorage at `main.ts:83`; no default app
servers, application endpoints, money paths or analytics. Evidence URLs and
user-opened privacy/contact links are not runtime app connections. The single
account/age text match is an explanation that vouches are not identity or age
checks, not an account system. Manual review also followed the
bundled dependency graph, camera/credential calls, Blob export and generated
hosting headers, which the helper alone does not fully enumerate.

**Key-holder answer:** the user's unlocked browser holds the pair secrets and
master key. Local persisted records/backups contain encrypted secrets and wrapped
keys. The publisher receives no such key through this app. An unlocked compromised
device can read plaintext; optional platform credential providers are a separate
trust boundary. This is not end-to-end encryption of content carried by a server.

| Question | Finding / code evidence |
|---|---|
| 1. Could be hosted? | Fixed public HTML/manifest/icon/worker responses; earlier HTML/header readback is historical. `../canary-words-site/worker/index.js:1`, `scripts/build-worker.mjs:1`, `local/evidence/publication.json`. |
| 2. Default hosts? | No external app server or remote asset. `local/main.ts:1` dependency graph, `tools/build-local.mjs:17`. |
| 3. Publisher-operated defaults? | None wired into this entry point. Not a finding about the larger app. `vite.local.config.ts:6`. |
| 4. Third parties? | Host receives public page requests; optional browser/OS credential provider receives its native API requests on user action. No app-content API or telemetry. `local/vault.ts:174`. |
| 5. One user's content through an operator server? | No publisher content transport. Setup crosses a local QR/manual read-back or deliberate external-app sharing; no content API or shared store. `local/model.ts:36`, `local/qr.ts:46`. |
| 6. Discovery? | No public search, directory, presence or profile lookup. The private people list is decrypted locally. `local/main.ts:104`. |
| 7. Key holders? | Unlocked device and optional credential provider/key protection. No remote master key sent by app code. `local/vault.ts:110`, `local/vault.ts:174`. |
| 8. Storage/retention? | Encrypted localStorage including pending exchange/setup state and explicit encrypted backups; public shell in Cache Storage; unsaved plaintext clears on lock. No secure-erasure promise. `local/main.ts:82`, `local/main.ts:367`, `local/vault.ts:155`. |
| 9. Accounts/ages? | No app accounts or age gate. Device vault/passkey is not an account at the publisher. No minimum age selected. `local/index.html:19`. |
| 10. Money? | No purchase, donation, subscription or payment path in the local interface. `local/index.html:15`. |
| 11. Agents/recording? | No agent or transcription. Camera frames are transient QR input, not recordings. No microphone request. `local/qr.ts:46`. |
| 12. Start? | Public static page published 23 October; no messaging-service deadline inferred. `local/evidence/publication.json`. |
| 13. Named operator? | No invented natural person or company. Existing project identity/report route retained; host terms and approved basis recorded. Page notice at `local/index.html:60`. |
| 14. Server access? | Wrapper returns only fixed public allowlisted files for GET/HEAD, with no content storage/body processing. `../canary-words-site/worker/index.js:1`. |
| 15. Position? | Static-site publisher [U]; earlier readback/browser opening passed, current candidate release readback outstanding. `local/evidence/hosting.json`, `local/evidence/live-browser.json`. |

Normal-camera links are now another secret-handling surface: generation at
`local/model.ts:59`, early fragment stripping at `local/index.html:12`, and
consumption at `local/main.ts:519`. The HTTP request does not carry the fragment;
that does not rule out native scanner/browser-history/sync copies. Privacy facts
and UI cover those providers by kind, without promising they do not communicate.

## Hosting/legal scope refresh, 23 October

The shared-law §5/§7 refresh found a material distinction missing from the old
project table: the IPA operator definition includes website owners under the
Home Office guidance, while Ofcom's Communications Act definition is separate.
That omission is corrected in `position.md`; no blanket exemption is claimed.

The current app commit is named above; standalone publishing source commit is
`8921e7215b12a19f4377e024065554154beb36b0`. The public site serves the exact baked
page through a fixed-response wrapper with no application API. Provider traffic
metrics and processor terms add hosting facts without adding app-content
requests. The deployed notice retains the existing project identity/report route
and owner-approved legitimate-interest basis. Cookie/header/byte/network
readbacks are in `local/evidence/`; no physical phone acceptance is inferred.

## Gap check: previous draft versus this build

| Gap | Code evidence | Note | Resolution / who decides |
|---|---|---|---|
| Previous draft only described an opaque QR and app-owned camera frames. | `local/model.ts:59`, `local/index.html:12`, `local/main.ts:519` now support private HTTPS fragment links and native-camera opening. | §3.2 | Added link/history/native-provider exposure, address stripping and lack of one-use/revocation guarantees. Local files remain an explicitly labelled app-scanner preview. |
| Previous flow required a vault before exchanging. | `local/main.ts:130`, `local/main.ts:200` now pair in memory and save only on explicit Keep. | §§3.2, 4 | Updated privacy/UI facts: transient pairs clear on background or idle. No plaintext persistence introduced. |
| Previous wording assumed every vault had a recovery passphrase. | `local/vault.ts:197` creates a device-only slot; `:142` adds recovery later, `:219` refuses portable export without it. | §3.2 | Corrected UI, README and legal drafts. Explain credential-loss risk rather than claiming recovery exists. |
| Previous onboarding required a nickname and reference checkbox. | `local/main.ts:159`, `local/main.ts:427` open words directly and rename optionally. | §§3.1–3.2 | Names can be numbered local defaults. This is no identity certification or new remote profile collection. |
| Native credential provider remains involved only when asked to keep/unlock. | `local/vault.ts:174` requests verified PRF material. | §3.2 | Retained provider trust/sync boundary; no claim that OS networking is absent. |
| Earlier privacy draft left hosting unknown. | Fixed-response wrapper plus actual production readback in `local/evidence/hosting.json`; deployed notice `local/index.html:60`. | §§3.1–3.2 | Adopted basis/contact/provider facts; disclosed aggregate statistics and observed security cookie. No invented log lifetime or region. |
| Existing audit/financial alignment briefs cannot certify this UI. | `AUDIT.md:5`, `AUDIT.md:30`, `REGULATORY.md:3`. | Scope/evidence | No independent audit or broad regulatory acceptance claimed. Foreign/finance assertions were not revalidated. |

The watch list and current note status were checked. No local/static OSA
assessment deadline or service fee is identified. Legal topics outside the note,
provider-internal retention/region, controller-wide fee status, independent audit,
physical acceptance and foreign regimes are
not checked by this inventory. The full networked app remains separately scoped.

## Pairing recovery update, 23 October

The setup screen now compares a fixed pair reference and puts explicit encrypted
Keep before the rotating words for unsaved pairs (`local/main.ts`, `openPerson`;
`local/index.html`, `exchange-reference`). This is a setup reference, not a new
identity assertion or server handshake. The word counter does not expire a pair.

`showPairQr` intentionally exposes the same local secret to the other phone,
with the opposite speaking role selected by `makeInvite` / `joinInvite`. Version
1 setup links remain readable; version 2 recovery invites carry the target role.
`keepWith` reuses a matching secret/role instead of duplicating it. No new
server route, storage category, notification or provider is introduced. Background
and five-minute idle clearing still apply to unsaved data.

## Private group feature gap check

The local app now handles signed personal relationship claims and group-scoped
keys. After the feature commit, the inventory helper was rerun with the new files
tracked. Manual review follows `trust.ts`, `trust-wire.ts`, `trust-ui.ts` and the
vault payload migration as well as the helper's tracked-file output.

| Gap in prior docs | Code evidence | Resolution |
|---|---|---|
| Storage list described pairs/nicknames only. | `vault.ts`: `entriesFrom`, `opened`, `sealEntries`; `trust.ts`: `Group`, `readTrust`. | Added contact notes, per-group private keys, signed claims, local trust choices, pending/outgoing exchanges and encrypted recovery. |
| Setup fragment only described `#pair=`. | `index.html`: `take`; `trust-wire.ts`: `transferLink`, `transferToken`; `main.ts`: `consumeIncoming`. | Added bounded `#trust=` envelopes, early fragment removal and native camera/clipboard/shared-link retention limits. |
| No description of proof recipients or public cards. | `trust-wire.ts`: `sealTransfer`, `openTransfer`; `trust-ui.ts`: `showOutgoing`. | Distinguish public group/key cards from recipient-encrypted handoffs; explain recipient copying and keeper presentation. |
| A completed check might be read as a blanket identity/membership assertion. | `trust.ts`: `inspectProof`, `acceptProof`; `trust-ui.ts`: `groupView`. | Display historical key-proof evidence and keeper-supplied account context, with no automatic admission or platform verification. |
| Withdrawal freshness was unspecified. | `trust.ts`: `receiveWithdrawal`, `vouch`, `forgetVoucher`. | Checks use locally received withdrawals and explicit issuer policy; no global status or deletion guarantee. |

Key-holder answer remains the unlocked user browser. NIP-44 conversation keys
are transient local derivatives; the host wrapper still serves fixed baked
HTML/headers and receives no content in fragments. No new provider, default
relay, public discovery, moderation surface, money path or hosted data store was
added. The private attestation library itself does not sign, verify signatures or
contact relays; this app explicitly supplies signing/encryption/verification.

GB law note remains verified 28 September 2026, review 28 March 2027, with the
23 October IPA/telecom partial refresh. Relevant provider/software watch-list
uncertainty remains `[U]`; the expanded browser-only feature is not represented
as Ofcom approval or blanket UK-law clearance. The hosting purpose/basis and
processor/contact facts are unchanged. No new fee deadline or regulator
registration is inferred from a private signed claim.

## Phone/PWA and remote-exchange gap check — working tree

The helper was run over the repository; its wider networked-app matches were
excluded from this bounded entry-point assessment. New untracked source was
reviewed directly, since the helper's tracked-file search does not capture it.
The current key-holder answer remains: the unlocked user device holds pair,
vault and pending exchange private keys; neither the fixed-response publisher
wrapper nor the public-shell cache receives them through these handlers.

| Gap | Evidence | Note section | Resolution / who decides |
|---|---|---|---|
| No-service-worker and root-only wording contradicted new public assets. | `local/install.ts`, `mountInstall`; `local/pwa/sw.js`, `FILES`; `../canary-words-site/worker/index.js`, `fetch`; `scripts/build-worker.mjs`, asset map. | §§3.2, 4 | Corrected public requests/cache and allowlist facts; no application content endpoint introduced. |
| Remote setup adds explicit outside recipients and metadata. | `local/connect.ts`, `beginConnect`, `acceptConnect`, `connectLink`; `local/connect-ui.ts`, Send/Copy handlers. | §§2.2, 3.2 | Describe public offer, encrypted reply, chat/share/clipboard retention and separate code comparison. Publisher classification remains an interpretation [U]. |
| Vault-only startup/pending setup differs from prior transient-creator wording. | `local/main.ts`, `create`, `savePairs`; `local/vault.ts`, `opened`, `sealEntries`. | §§3.2, 4 | Describe saved offer private keys, labels, pending replies and backup inclusion; no automatic invitation expiry claim. |
| Phone-PIN label could imply a weak app key. | `local/vault.ts`, required `userVerification` and PRF; `local/index.html`, passphrase form. | §3.2 | Clarify platform credential protection and strong passphrase fallback; no short app PIN. |
| Earlier live evidence cannot validate the candidate. | Previous `local/evidence/publication.json` versus changed source/assets. | Evidence gate | Current public bytes, worker/cache/update behaviour and physical-phone acceptance need fresh release evidence; no deployment performed here. |

The legal note remains verified 28 September 2026, review by 28 March 2027;
the existing documented partial 23 October refresh is not a full law refresh.
The watch list was read. No new OSA deadline/cost is identified from these local
changes. ICO fee status remains controller-wide and unverified (note §3.4:
tier 1 if due £52/year, £5 direct-debit discount); no fee was paid or registration
made. Provider configuration, foreign law, independent security/legal review and
physical no-Play GrapheneOS/iPhone credential acceptance remain unchecked.

## Publication evidence after this gap review

The phone/PWA candidate was subsequently deployed as Sites version 5 on the same
origin. `../evidence/publication.json` records website source `cc95b579a31ac64a0cf9fde5f0508cf566c136a1`
and app implementation `82817b61632e81cc4e1236faad175ea3566430ea`. All six served
public files matched the pushed source bytes and required headers. The live
browser journey and actual offline shell reload passed (`mobile-hosting.json`,
`mobile-live.json`). These later technical readbacks close the candidate
publication gap mentioned above; the legal interpretation, physical-phone
acceptance and independent-review limits remain. They are not a new law review.

## Encrypted device-copy gap check — working-tree model

Reviewed 23 October 2026. The repository-wide inventory helper was rerun;
networked `app/`, generated artifacts and narration tools are outside `local/`
entry-point scope. Untracked `device-transfer.ts` and `entries.ts` were read
directly. Key-holder answer: the unlocked user devices hold pair secrets and
ephemeral receive/decryption keys; the fixed public host receives no such key
through this model. No new network call or publisher content endpoint appears
in the device-copy model.

| Gap | Evidence | Note section | Resolution / who decides |
|---|---|---|---|
| Existing notice omits a second-device file recipient and its public metadata. | `local/device-transfer.ts:15`, `:47`, `:115`. | §3.2 | Added encrypted-file and public request/key/timing/size facts; final UI and published notice alignment remain release checks. |
| Vault storage/recovery explanation omits pending receive keys and outgoing files. | `local/vault.ts:84`, `:125`; `local/device-transfer.ts:83`. | §§3.2, 4 | Added encrypted v4 state/backups, limits, expiry versus deletion and backup-restoration replay limits. |
| Copy could be mistaken for moving an entire vault or revoking old copies. | `local/device-transfer.ts:41`, `:103`; `local/entries.ts:4`. | §3.2 | People-only scope; preserve source and destination entries, deduplicate secrets, remap IDs; exclude unfinished setups and group/credential/exchange state. |
| Cryptography could be mistaken for owner identity or fresh relationship evidence. | `local/device-transfer.ts:37`, `:63`; `local/entries.ts:23`. | §§3.1–3.2 | Describe 48-bit comparison and historical notes; no civil identity/freshness guarantee. |
| Model alone did not establish confirmation, user-only handoff or local consumption. | `local/device-ui.ts:129`, `:142`, `:155`; `local/main.ts`, `mountDevices`, `save`, `wipeUi`; `local/index.html`, `take`. | §§3.2, 4 / evidence gate | Completed source recheck finds explicit share/save clicks, code checkbox/selection, early fragment removal, lock clearing and one guarded encrypted save of imported entries plus request removal. Missing request rejects reopening; old backup restoration remains a limit. Published notice alignment and physical handoff still require release evidence. |

No new owner decision on publisher position, hosting basis or contact is needed
for these factual amendments. No deployment, law-note modification, regulator
contact or paid action was performed. Foreign law, provider-internal processing,
independent legal/security review and physical phone/real AirDrop remain unchecked.
The in-date GB note (verified 28 September 2026; review 28 March 2027, partial
23 October refresh already recorded) was used without re-researching its claims.

## Signet Vouch UX gap check — source candidate, 23 October 2026

Scope: working tree based on app commit
`599058fa3c970467cb47122285592ffa7780fa88`; `local/` and its existing bundled
dependencies. The inventory helper was rerun; its wider networked `app/`, old
generated app and recording/tool matches are outside this entry point. New
untracked `local/vouch-view.ts` was reviewed directly. Key-holder answer:
only the unlocked user browser holds the local vault/group keys; this delta
adds no operator content-key holder.

| Gap or claim tested | Code evidence | Note section | Resolution / who decides |
|---|---|---|---|
| Saved people might imply current membership or verified identity. | `vouch-view.ts`, `knownPeople`, `personName`; `trust-ui.ts`, `groupView`, `personView`. | §§2.2, 3.1–3.2 | Describe locally saved group keys, aliases and historical evidence, without membership/account/identity guarantees. |
| Editing a friendly name might imply authority or a new profile store. | `trust-ui.ts`, `personView`; existing `trust.ts`, `Group.people`, `readTrust`. | §§3.2, 4 | Explicit local alias edit uses the existing encrypted field; it does not accept voucher authority or link spoken pairs. |
| A current receipt badge might imply fresh identity or universal withdrawal status. | `vouch-view.ts`, `vouchSummary`; `trust-ui.ts`, `receiptCard`, `myVouches`; existing `trust.ts`, `inspectProof`. | §§2.2, 3.2 | Show signed method/date/expiry and received withdrawals only. Fresh protocol checks and keeper decisions remain separate. |
| Continuing an expired exchange might imply old evidence was renewed. | `vouch-view.ts`, `exchangeHint`; `trust-ui.ts`, `groupView`, `personView`. | §3.2 | Expired public verification cards are refreshed; expired pending checks return to a fresh-check action. This does not renew a vouch. |
| Signet Vouch branding might imply a new operator or Signet account integration. | `index.html`, title/brand and hosting privacy; `pwa/manifest.webmanifest`; `trust-ui.ts`, `screen`; existing `trust.ts`, `Group`; `trust-wire.ts`, `sealTransfer`, `openTransfer`. | §§2.2, 3.2 | Product label only; retain Canary Kit (ForgeSworn), same origin/contact/adopted hosting basis. No account adapter or new recipient is added. |

No protocol, vault schema, master key, credential or crypto change is introduced
by the reviewed presentation/alias delta. Existing user-chosen sharing
recipients, local storage and recovery limits still apply. The static-publisher
interpretation remains `[U]`; no blanket UK-law conclusion follows. Law note:
verified 28 September 2026, review by 28 March 2027, with the recorded
23 October partial IPA/telecom refresh. Watch-list items were read and no new
law research or shared-note date change was required by this bounded delta.

No new fee or deadline was identified for this delta. Controller-wide ICO fee
status remains outside this inventory; the note's tier-1 figure, if applicable,
is £52/year (£5 less by direct debit), not a new task payment. No owner
decision, regulator contact or publication was made in this review. Current
source/build/browser validation, public-byte/header/notice readback and physical
phone acceptance must be evidenced separately. Earlier version 8 evidence
does not verify this candidate. Independent legal/security review, host-internal
retention/region, other platforms and individual users' processing remain outside
this check.
