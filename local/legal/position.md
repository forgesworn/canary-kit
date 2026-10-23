# Position and applicable duties

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code: working tree based on `30634ca5dadca7fb3ad34990c4c191d7b7b4f64a`.
Law note verified 28 September 2026; §§5.1–5.2 and 7 partially refreshed
23 October 2026 against primary sources.**

Latest factual delta reviewed on 23 October 2026 against the working tree based
on app commit `30634ca5dadca7fb3ad34990c4c191d7b7b4f64a` and the fixed-response
`../canary-words-site` wrapper. The final signed-name/concurrent-exchange section
in each document governs this candidate; preceding release sections are dated
history. Earlier publication receipts do not verify this candidate. No deployment
or public readback was performed for this gap review.


## Position today / intended position

Publisher of a public static-response site today, delivered by a minimal
Worker wrapper at a separate origin (publishing source
`../canary-words-site`, commit `8921e7215b12a19f4377e024065554154beb36b0`,
`worker/index.js:1`, `scripts/build-worker.mjs:1`). The owner chose a static phone-first HTTPS website
with encrypted browser storage and optional device unlock. Both keep the shared
secret on the devices. `local/main.ts:82` writes ciphertext to localStorage;
`local/main.ts:367` exports encrypted JSON; `local/qr.ts:46` captures local video
with audio disabled. `tools/build-local.mjs` permits same-origin public shell fetches;
`:40` writes a static hosting candidate. No account, directory, upload, chat,
relay, discovery endpoint or default remote server is introduced.

The broad repository contains a different network-capable app. These findings
do not classify its deployment, or an origin that also exposes that service.

## Applicable regimes

All references are to the
[GB note](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md),
verified 28 September 2026.

| Regime | Scoped finding |
|---|---|
| Online Safety Act, §§2.1–2.2 | The statutory user-to-user definition is `[P]`. No user content reaches another through an operator-hosted endpoint here. Pairing uses private QR/read-back or explicit sharing through a user-chosen chat app; the HTTPS setup secret is in a URL fragment that is not sent to the static host. The note's no-infrastructure static-software publisher reading remains `[U]`, not Ofcom approval. The ordinary static-site position does not import OSA assessments or age assurance from messaging platforms. `local/model.ts:36`, `local/qr.ts:46`, `tools/build-local.mjs:17`. |
| Investigatory powers, §§5.1–5.2 | The Home Office Code §§2.3–2.8 expressly includes website owners `[P]`; no-chat/static hosting is not a guarantee against the IPA operator definition. IPA §66 concerns duties under a notice/authorisation with practicability limits, and §87 provides conditional retention notices `[P]`. The inference that these provisions create no blanket twelve-month logging duty on every site is `[U]`. No IPA immunity is claimed. App code receives no secret in HTTP requests (`local/model.ts:59`, `local/index.html:12`), but that does not settle duties under a future notice. |
| Ofcom telecoms regulation, §7 | Communications Act §32(2)–(2B), (7) has a different definition and content-service exclusion `[P]`. The selected software page provides no internet access, phone numbers, calls, messages or signal-transport service (`local/main.ts:1`, `tools/build-local.mjs:17`). The project assessment is that this static software page is not providing that regulated communications service `[U]`; do not conflate it with the broader IPA label. |
| Data protection, §§3.1–3.2 | App data is held on the devices, not received by the publisher. Nicknames may be personal data, but no recipient/controller server is introduced for them. The note's controller examples are `[U]`, Article 13 notice contents `[P]`. Any real hosting request data must be assessed separately: collection/roles, retention, recipients and transfers cannot be inferred from a static build. `local/vault.ts:86`, `local/main.ts:82`. |
| Device storage and PECR, §4 | The statute/exception list is `[P]`; the note's necessary-app-storage reading is `[U]`. Encrypted localStorage is now used expressly to save the service the user requests. There are no analytics or advertising stores. Explain it accurately; no tracking banner is added. Camera capture and optional passkey prompts are user initiated. `local/main.ts:82`, `local/qr.ts:46`, `local/vault.ts:174`. |
| Children, §3.6 | No user-content service, accounts, advertising or remote profile collection is added. No minimum age is selected on the owner's behalf. The note's uncertainty about unfunded information-society services remains `[U]`, not an invented age-check requirement. |
| Export, §§6–6.1 | Included MIT/Apache-2.0 notices permit redistribution as their licences specify; notices are bundled (`tools/build-local.mjs:19`). The note's public-domain provision is `[P]`, other aspects `[S]`/`[U]`. Publication is recorded separately and is not itself an export classification. No export/end-use or sanctions clearance is claimed. |
| Trading, §8 | No purchase, subscription, payment or donation path is in this entry point. No business identity disclosure or registration is imposed merely because a static tool exists. `local/index.html:15`. |

## Already in place

The default HTTPS QR opens a public invitation, followed by an encrypted QR
scan-back and code comparison. Advanced older-pair recovery can still open a
raw-secret pair link. Incoming fragment data is consumed locally after early address replacement (`local/model.ts:59`,
`local/index.html:12`, `local/main.ts:519`). Native scanner/history/sync software
can still copy the original link; the notice now explains that separate exposure.
No single-use/expiry/revocation promise is made. The public site now serves this behavior; readback and anonymous browser
pairing are recorded in `../evidence/publication.json`.


Incoming QR/manual pairing can remain transient; creating a new pair or a
remote exchange now first creates/unlocks encrypted storage (`local/main.ts`,
`create` handler; `local/connect-ui.ts`, `mountConnect`).
Keeping a pair explicitly creates or unlocks encrypted local storage. Device-only
vaults need no custom password; recovery and portable backups are offered later,
with the loss risk explained (`local/vault.ts:197`, `local/vault.ts:219`). This
changes the device-storage facts, not the selected static-publisher position.

No message infrastructure, accounts, trackers or remote-secret backup. Names and
secrets are encrypted before browser persistence; backups exclude device
credential metadata and remain encrypted. The camera is optional, local-only and
bounded; no microphone/location is requested. Device unlock uses actual PRF key
material with user verification, not a public credential identifier. Unsupported
providers cannot produce a falsely enabled state. See `local/vault.ts:174`,
`local/vault.ts:219`, `local/qr.ts:31`, `local/main.ts:502`.

The UI describes shared-secret knowledge, a human duress plan and practical
limits instead of claiming identity certification, safety or automatic dispatch
(`local/main.ts:469`). No law or security assertion is justified by marketing copy.

Primary sources for the partial refresh (read 23 October 2026):
[Home Office Code §§2.3–2.8](https://www.gov.uk/government/publications/communications-data-code-of-practice/communications-data-code-of-practice-accessible--2),
[IPA §66](https://www.legislation.gov.uk/ukpga/2016/25/section/66/data.html),
[IPA §87](https://www.legislation.gov.uk/ukpga/2016/25/section/87/data.html),
[Communications Act §32](https://www.legislation.gov.uk/ukpga/2003/21/section/32/data.html).

## Owed next

No OSA assessment deadline or service fee has been identified for this selected
static/offline position. This is not a blanket statement that no law applies.
Keep the scope record and the code/privacy wording aligned; owner adoption of
the drafts remains distinct from the code/test results.

The separate Sites origin is now public. The owner-approved legitimate-interest
basis, established project identity/private report route, processor terms,
automatic traffic statistics and observed `__cf_bm` security cookie are described
in the deployed notice and `hosting-proposal.md`. The candidate wrapper delivers fixed public
HTML, manifest, icons and service-worker files with security headers; no content-transfer or message API was added. Public bytes,
security headers and anonymous secret-free HTTP requests were verified.

Keep those facts current. The app inventory does not establish the controller's
overall ICO fee status (§3.4), nor promise UK-only hosting or fixed log retention.
No legal or regulatory acceptance is inferred from deployment success.

Before adding any content transfer, indexing, public member list, relay default,
payment or server-side backup, repeat the scope check against the then-current
law notes. Existing OSA watch-list items were read; they do not change this
local/static functionality into a messaging service by themselves.

## Not checked

Provider-internal retention configuration or region, controller-wide fee status,
the existing networked app, other messaging providers,
foreign law, individual users' processing, sanctions/end-use, consumer law and
Equality Act issues outside the note (§13), independent legal/security review,
physical phone camera/passkey support and actual one-minute human usability.
Browser/OS passkey-provider networking is outside the app's own request monitor.
No guarantee against compromise, coercion or live relay is claimed.

## Private group feature scope

The optional feature generates and verifies group-scoped signed claims on user
devices. Public group/key cards and recipient-encrypted handoffs are deliberately
exchanged by local cameras or user-chosen external messaging tools. The website
adds no content-transfer, publication, discovery, presence or membership-control
endpoint. A keeper's policy is local evidence for their own group decisions;
this app does not operate the other messaging platforms' membership.

This retains the selected static-software publisher assessment under GB note
§2.2 `[U]`, with the same caveat that the software/service boundary is not
settled guidance for every decentralised design. Runtime and browser network
evidence must continue to support it. Before adding shared directories, public
vouch feeds, relay defaults, automatic admission or hosted freshness services,
repeat the scope assessment. Local signed claims are not proof of civil
identity, age, safety, the truth of an issuer's judgement or universal account
ownership. Privacy/storage/recipient changes are recorded in `privacy.md`.

## Phone/PWA and remote-exchange delta

The candidate serves a fixed public PWA asset allowlist, caches only its public
shell and uses an existing user-chosen messaging tool for deliberate link
handoffs. It adds no operator-carried user content, shared pair store, relay,
directory, account or API (`local/pwa/sw.js`, `FILES`; `local/connect.ts`;
`local/connect-ui.ts`; `../canary-words-site/worker/index.js`, `fetch`). The
intended and assessed position remains static software publisher under note
§2.2 [U]. Encryption alone is not the reason for that conclusion: the absence
of a publisher content transport/store is the relevant implementation fact.

Device storage now also includes automatically registered public-shell caching,
pending exchange keys and pending setup replies. Note §4's necessary-storage
interpretation remains [U]; automatic caching must be disclosed and assessed for
its offline purpose, rather than described as absent or as an explicit install
consent. The existing minimal hosting purpose/basis is retained; no new basis,
identity, age limit or service-operation decision is invented. The ordinary host
request/statistics/cookie caveats remain, including extra public-asset requests.
The current candidate has not been deployed/read back by this review.

## Publication evidence after this gap review

The phone/PWA candidate was subsequently deployed as Sites version 5 on the same
origin. `../evidence/publication.json` records website source `cc95b579a31ac64a0cf9fde5f0508cf566c136a1`
and app implementation `82817b61632e81cc4e1236faad175ea3566430ea`. All six served
public files matched the pushed source bytes and required headers. The live
browser journey and actual offline shell reload passed (`mobile-hosting.json`,
`mobile-live.json`). These later technical readbacks close the candidate
publication gap mentioned above; the legal interpretation, physical-phone
acceptance and independent-review limits remain. They are not a new law review.

## Encrypted device-copy candidate

The reviewed model adds local encryption/decryption of an explicitly transferred
file (`local/device-transfer.ts`), not a publisher content transport or store.
The intended transfer uses the user's chosen OS/file/chat facilities. Accordingly
the selected static software-publisher assessment remains unchanged under
GB note §2.2 [U]; the adopted minimal hosting purpose/basis and controller/contact
are retained. Encryption alone does not settle provider classification. A future
relay, upload/download service, automatic cloud transfer or shared content store
would require reassessment.

The law note remains verified 28 September 2026, review by 28 March 2027, with
the documented partial 23 October IPA/telecom refresh. Its watch list was read;
this bounded local file-copy delta does not resolve those [U] questions or add
a new identified OSA assessment deadline or service fee. Controller-wide ICO
fee status remains unverified (tier 1 if due: £52/year, £5 direct-debit discount).
No registration, payment, contact or new legal-basis decision was made.

This review checks model/UI integration and factual document gaps. It does not
establish physical phone/real AirDrop acceptance, passkey or camera support,
a security audit, independent legal review or blanket legal clearance. Earlier
public readbacks do not verify this working-tree candidate.

## Signet Vouch presentation delta — source candidate

The 23 October 2026 working tree based on app commit
`599058fa3c970467cb47122285592ffa7780fa88` adds a product-facing Signet Vouch
name, local receipt/people presentation and private alias editing. The evidence
is `local/vouch-view.ts`, `vouchSummary`, `knownPeople`, `exchangeHint`, and
`local/trust-ui.ts`, `myVouches`, `personView`, `groupView`. The roster is
locally saved group-key evidence; keeper authority still requires the existing
explicit proof/acceptance flow. No platform account, automatic membership,
public directory or global revocation service is introduced.

This retains the chosen static-software publisher assessment under GB note
§2.2 `[U]`, local processing/storage explanation under §§3.1–3.2 and 4, and
the existing host metadata assessment. The product name does not establish a
new controller or connect to a Signet account service. The Canary Kit
(ForgeSworn) publisher, origin, approved hosting purpose/basis and privacy
contact remain the same. No new deadline, payment, registration, age or public
identity decision is inferred from this presentation change. The note remains
verified 28 September 2026, review by 28 March 2027, with the recorded
23 October partial refresh; the provider/software watch-list uncertainty and
prior legal, physical-device and independent-review limits remain.

A source review does not establish deployed bytes, notices, headers, host
behaviour or phone usability. Those release and acceptance gates must be
recorded separately; Sites version 8 readbacks concern the earlier release.

## Signed-name and nearby-pairing delta — 23 October 2026 candidate

A holder-approved known-as statement per group, selected receipt presentation,
explicit keeper review and resumable concurrent checks change the local data
facts, documented in the latest privacy/inventory sections. Human recognition,
fresh key control, voucher acceptance and admissions remain separate. Default
nearby pairing uses a public invitation and NIP-44-encrypted QR scan-back;
advanced older-pair raw-secret QR/manual recovery remains available. A fixed
pair code still requires human comparison, and real-time forwarding remains a
limit. Vault payload v5 preserves the new collections and reads older formats;
reviewed old readers reject v5 rather than discard its state on save.

The selected static software-publisher position under GB note §2.2 `[U]` is
retained: no network service, relay, directory, sync, bot, account-binding
endpoint or admissions automation is added. The same fixed-response host serves
public assets only. The publisher/contact and adopted legitimate-interest basis
for ordinary hosting metadata/statistics are unchanged. A signed nickname can
be personal data in holders' copies; the absence of a publisher content endpoint
does not decide every individual/group user's processing responsibilities.
No civil identity, age, global revocation or blanket legal clearance follows.

Law note verified 28 September 2026, review by 28 March 2027; existing partial
23 October refresh and `[U]` provider/IPA/telecom limits remain. No new identified
service deadline, fee, public identity, legal-basis or owner approval decision
is introduced. Current notice/build/public readback, physical phone acceptance
and independent security/legal review remain separate evidence gates. This
review publishes nothing and makes no external contact.

Source recheck on 23 October 2026: the updated `local/index.html` notice now
explains public invitation/encrypted scan-back versus advanced raw-secret
recovery, holder-approved group nicknames versus private aliases, selected
receipt presentation, explicit keeper review and recipient copying/retention.
The accompanying source paths match those disclosures. This closes those source
notice-alignment findings; built and published bytes/readback remain separate.

The simplified show/scan/save/name journey and four-word fixed setup comparison
add no new recipient or service. The comparison is a 44-bit truncated human
comparison in a separate namespace, not identity certification. Stored pair
references and rotating call checks remain unchanged. NFC/bump functionality
reported for a separate native app is outside this website's scope.

Final source recheck also confirms that transient-until-kept wording is
explicitly limited to legacy raw-secret QR/manual pairing; new nearby pairing
is saved encrypted before scan-back. The source notice-alignment gate is closed
for this candidate. Publication readback and physical acceptance remain open
until separately evidenced.
