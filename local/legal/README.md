# Draft UK legal cover: static local-processing app

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code: working tree based on `30634ca5dadca7fb3ad34990c4c191d7b7b4f64a`.**

Latest factual delta reviewed on 23 October 2026 against the working tree based
on app commit `30634ca5dadca7fb3ad34990c4c191d7b7b4f64a` and the fixed-response
`../canary-words-site` wrapper. The final Offline Connect source-candidate section
in each document governs this candidate; preceding release sections are dated
history. Earlier publication receipts do not verify this candidate. No deployment
or public readback was performed for this gap review.


**Today:** publisher of a public static-response HTTPS site at
[Canary](https://canary-words.cocoacod256.chatgpt.site/), with a local HTML copy.
The owner selected and approved minimal hosting with encrypted device storage
and optional device unlock. No application accounts, directory, message carriage,
shared pair store or relay. Hosting processes request metadata and aggregate
traffic statistics; the adopted basis and notice are in `hosting-proposal.md`.
Production bytes, security headers and anonymous browser pairing were verified
on 23 October; [publication evidence](../evidence/publication.json).

Scope is `local/`, its bundled dependency graph and generated artifact. It does
not assess the larger `app/`, other hosted Canary services, other messaging
providers or any independently operated server.

Law source: [GB online-services note](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md),
**verified 28 September 2026; review by 28 March 2027**. `[P]` means a primary
source was read, `[S]` secondary, `[U]` unchecked or unsettled interpretation.
A `[P]` mark is not a legal opinion. The note remains within its review date.

- [Position, regimes and outstanding work](position.md)
- [Inventory and corrected document gaps](inventory.md)
- [Privacy facts and adopted hosting notice](privacy.md)
- [Adopted host, provider facts and owner decisions](hosting-proposal.md)

The design is assessed as an ordinary static software site, not a user-to-user
message service. This is a scope assessment, not a claim of compliance with all
UK law. No regulated-service risk assessment, age gate, registration, natural
person's public identity or company formation is invented for this position.

The existing public project identity/report route is retained. The owner
explicitly approved the minimal hosting basis before publication; the deployed
page includes that notice. No paid resource, company registration, regulator
contact or minimum age was selected. The source is on a separate publishing
checkout/origin; the larger networked app is outside this assessment.

This is a scoped finding, not blanket UK-law clearance. The note was partially
refreshed on 23 October for IPA and Communications Act scope; the proposed
shared-note correction is [PR #35](https://github.com/forgesworn/jurisdiction-kit/pull/35).
Physical phone-camera/passkey acceptance and independent review remain separate.

On the owner's telecoms question: the broader IPA website-owner definition can
apply even without messaging; the Communications Act test is different. The
partial 23 October primary-source refresh is recorded in `position.md`. No
blanket promise of being outside all telecoms law, or of immunity from notices,
is made. Classification is not itself a prohibition on publishing this tool.

The optional private-contact and group-vouch release keeps the same hosted
position. Expanded local data/recipient and recovery facts are in `privacy.md`;
the feature gap check and code evidence are in `inventory.md`. No Nostr account,
relay connection, public social graph or automatic platform membership is
introduced. Human attestations and cryptographic key proofs remain distinct.

The phone/PWA and remote-pairing working-tree delta is recorded in the final
sections of `inventory.md`, `privacy.md` and `position.md`. It adds public-shell
caching and deliberate external-app handoffs, without a publisher content API.
Earlier live readbacks do not verify this candidate. Current asset/cache/header
readback and physical phone acceptance remain separate release gates.

## Publication evidence after this gap review

The phone/PWA candidate was subsequently deployed as Sites version 5 on the same
origin. `../evidence/publication.json` records website source `cc95b579a31ac64a0cf9fde5f0508cf566c136a1`
and app implementation `82817b61632e81cc4e1236faad175ea3566430ea`. All six served
public files matched the pushed source bytes and required headers. The live
browser journey and actual offline shell reload passed (`mobile-hosting.json`,
`mobile-live.json`). These later technical readbacks close the candidate
publication gap mentioned above; the legal interpretation, physical-phone
acceptance and independent-review limits remain. They are not a new law review.

The final published receipt is now Sites version 6, a CSS-only touch-target
correction after v5. The complete mobile/offline journey and six-file public
readback passed again. Scope and legal findings are unchanged; the current
receipt and the retained v5 receipt identify the exact versions.

## Encrypted device-copy candidate — 23 October 2026

The device-copy working-tree review covers `local/device-transfer.ts`, the
extracted `local/entries.ts` validator and vault payload version 4. It retains
the selected static software-publisher position and adopted hosting basis.
Model-level storage, recipient and copy limits are recorded in `privacy.md`;
the gap table in `inventory.md` records the subsequent completed source UI,
fragment, lock-clearing and atomic-save review. Release checks remain distinct. Earlier version 6 public evidence does
not verify this new candidate. No device-copy deployment, physical phone, real
AirDrop or passkey/QR acceptance is claimed by this review.

The encrypted device-copy candidate was subsequently published as Sites version
7 on the same origin. The exact-source public readback and live device-copy and
mobile/offline journeys passed; see `../evidence/publication.json`,
`device-copy-live.json`, `mobile-live.json` and `mobile-hosting.json`. Its new
file/storage explanation is included in the published privacy notice. This
closes the publication/notice alignment gate above, not physical handoff,
independent security/legal review or the [U] scope interpretation.

Final version 8 clarifies the receiving-device sentence (“encrypted for”, rather
than promising physical hardware exclusivity). Technical behaviour is unchanged;
its exact public readback and fresh mobile flow passed. The receipt explicitly
labels v7 as the complete functional regression run and retains the v7 record.

## Signet Vouch presentation candidate — 23 October 2026

The current working tree based on app commit
`599058fa3c970467cb47122285592ffa7780fa88` presents the local group-vouch
feature as Signet Vouch. This product label does not replace the Canary Kit
(ForgeSworn) publisher or its existing GitHub privacy contact, move the origin,
or add a Signet account/service adapter. The existing minimal hosting basis
and static-software publisher assessment `[U]` are retained.

The bounded source gap check in `inventory.md` covers dated receipt status,
group-scoped saved people, explicit private label editing and fresh-check
navigation. `privacy.md` explains their local meaning and storage. Earlier
Sites version 8 evidence is historical and does not verify this presentation
candidate. Source/build/browser checks, exact public release readback, physical
phone acceptance and independent review remain separate gates. This is a
factual delta against the law note verified 28 September 2026, with the recorded
23 October partial refresh; it is not a fresh law review or blanket clearance.

The Signet Vouch candidate was published as Sites version 9 on the same origin.
The product title/mark changed; publisher, contact, hosting purpose/basis and
local protocol identities did not. The new public privacy text covers private
aliases, locally derived roster/status and separate spoken secrets, and expressly
states that no Signet service/account adapter is connected. Exact public-file,
live vouch/mobile/offline/device-copy and old-artifact upgrade checks passed;
see `../evidence/publication.json` and its linked reports. These close the release
readback/notice gate, not physical-phone, independent review or [U] legal scope.

## Signed group names and concurrent exchanges — 23 October 2026 candidate

The latest working-tree delta adds a holder-approved, signed known-as nickname
for a particular group, explicit receipt choice and keeper evidence review,
eight concurrent pending checks and sixteen saved handoffs per group. Private
device aliases remain separate. Vault payload v5 preserves this state and reads
older array/v2–v4 payloads; older reviewed builds reject v5 rather than silently
resaving an incomplete vault. Default nearby pairing now uses a public invitation
QR and a recipient-encrypted QR scan-back. Raw-secret QR remains an explicit
advanced older-pair recovery action. See the latest inventory/privacy sections.

This does not add a network, relay, directory, synchronisation, bot, platform
account-binding endpoint or automated admissions. The publisher/contact,
legitimate-interest hosting basis and static-publisher assessment `[U]` remain
unchanged. Law note verified 28 September 2026, review by 28 March 2027; the
previously recorded partial 23 October refresh is retained without fresh law
research. Candidate notice alignment and exact release readback must accompany
publication; Sites version 9 is historical evidence. Physical phone acceptance
and independent security/legal review remain separate. No blanket clearance,
new owner approval, external contact or publication is recorded by this review.

Source recheck on 23 October 2026: the updated `local/index.html` notice now
explains public invitation/encrypted scan-back versus advanced raw-secret
recovery, holder-approved group nicknames versus private aliases, selected
receipt presentation, explicit keeper review and recipient copying/retention.
The accompanying source paths match those disclosures. This closes those source
notice-alignment findings; built and published bytes/readback remain separate.

The latest nearby UX uses two primary show/scan actions, explicit encrypted
saving on the joining phone and naming at final comparison. A fixed four-word
setup comparison replaces the displayed hexadecimal comparison; stored pair
references and rotating two-word call checks are unchanged. This website has
no implemented NFC/bump pairing. See the source evidence and limits in the
latest inventory/privacy sections.

Final source recheck also confirms that transient-until-kept wording is
explicitly limited to legacy raw-secret QR/manual pairing; new nearby pairing
is saved encrypted before scan-back. The source notice-alignment gate is closed
for this candidate. Publication readback and physical acceptance remain open
until separately evidenced.

### Version 10 publication readback

Version 10 was published from website source
`7919d77ad1d6e6709b6372b706373918b0441d89`, app source
`91d54c0d7bd16839bc45847ae23bba905d8ea791`. All six public files and the updated
notice matched source with expected security headers (`../evidence/publication.json`,
`mobile-hosting.json`). Live browser journeys passed. This closes the candidate
publication/notice-alignment gate; it does not change the dated law review, [U]
scope interpretations or outstanding physical/independent acceptance gates.


## Offline Connect — 23 October 2026 source candidate

This section supersedes earlier default nearby invitation/encrypted-scan-back
and vault-v5 descriptions for this candidate. Those descriptions remain history
or advanced compatibility behaviour, not the new Connect default. The source
review covers the current working tree, including `local/meet.ts` and
`local/meet-ui.ts`; it is not a deployment/readback or independent security audit.
The GB note remains verified 28 September 2026, review by 28 March 2027, with
the already recorded partial 23 October updates. No fresh law research, new
provider selection, external contact or publication was performed.

The owner chose fully offline setup. Both devices open Connect after obtaining
the public app shell, automatically read each other's public session codes,
then compare four fixed words and explicitly save on each device. The shared
seed is derived locally rather than sent in a QR or encrypted reply
(`local/meet.ts:48`, `local/meet-ui.ts:70`). Public nonce reveals are part of the
exchange; they are not private keys or the shared seed. Optional explicit public
code files support a device without a camera (`local/meet-ui.ts:106`). The app
adds no relay, account, messaging endpoint or other transfer backend.

The selected static-publisher assessment under GB note §2.2 `[U]`, adopted
publisher/contact and minimal hosting legitimate-interest purpose/basis remain
unchanged. Encrypted vault payload v6 holds resumable session state; completion
or explicit removal changes the active vault, not old backups. The corrected source footer describes this new default and preserves the older
exchange as compatibility behaviour; its source notice-alignment gate is closed. Shell availability, browser/OS credential-provider
behaviour, physical camera/passkey acceptance, exact public release readback and
independent review are separate gates. Earlier publication and browser-fixture
receipts do not close them for this protocol candidate.

Final source notice recheck on 23 October 2026: `local/index.html:103` matches
the reviewed offline commit/reveal flow, local seed derivation, fixed comparison,
encrypted pending state and backup limits, no setup expiry versus the one-minute
scan pause, public files and user-chosen OS transfer, and retained advanced paths.
Compact base64url encoding (`local/meet.ts:76`, `:85`) carries the same public
fields and adds no processing recipient or networking. Only source notice
alignment is closed here; publication/readback, physical camera/credential-provider
acceptance and independent review are unchanged separate gates.

### Offline Connect release evidence

Version 11's publication and six-file exact-byte/header readback are now recorded
in `../evidence/publication.json`, `mobile-hosting.json` and the four live browser
reports named by the receipt. The public source footer matches this source review.
This closes that release's publication/readback gate; it does not upgrade the
`[U]` legal interpretation, physical-device acceptance or independent review.
