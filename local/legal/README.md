# Draft UK legal cover: static local-processing app

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code: `1ac118f5c4287159f08a72989c77d288c45207b7`.**

Current factual delta reviewed on 23 October 2026 against the working tree based
on app commit `621b6ae5b4da6f8703b863bfeef9af4aeb8f7476` and the modified
`../canary-words-site` publishing source. Earlier commit/readback references
below record the earlier release, not production verification of this candidate.
No deployment or public readback was performed for this gap review.


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
