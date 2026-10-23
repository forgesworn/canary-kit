# Position and applicable duties

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code `0ba43087ca2c701a143d85ba31464ca3f55a367e`.
Law note verified 28 September 2026; §§5.1–5.2 and 7 partially refreshed
23 October 2026 against primary sources.**

## Position today / intended position

Publisher of a public static-response site today, delivered by a minimal
Worker wrapper at a separate origin (publishing source
`../canary-words-site`, commit `393c4750c688613d18cd78cc3cc307363bb2b170`,
`worker/index.js:1`, `scripts/build-worker.mjs:1`). The owner chose a static phone-first HTTPS website
with encrypted browser storage and optional device unlock. Both keep the shared
secret on the devices. `local/main.ts:73` writes ciphertext to localStorage;
`local/main.ts:301` exports encrypted JSON; `local/qr.ts:46` captures local video
with audio disabled. `tools/build-local.mjs:17` blocks application connections;
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
| Online Safety Act, §§2.1–2.2 | The statutory user-to-user definition is `[P]`. No user content reaches another through an operator-hosted endpoint here. Pairing is a private QR/read-back exchange; the HTTPS setup secret is in a URL fragment that is not sent to the static host. The note's no-infrastructure static-software publisher reading remains `[U]`, not Ofcom approval. The ordinary static-site position does not import OSA assessments or age assurance from messaging platforms. `local/model.ts:36`, `local/qr.ts:46`, `tools/build-local.mjs:17`. |
| Investigatory powers, §§5.1–5.2 | The Home Office Code §§2.3–2.8 expressly includes website owners `[P]`; no-chat/static hosting is not a guarantee against the IPA operator definition. IPA §66 concerns duties under a notice/authorisation with practicability limits, and §87 provides conditional retention notices `[P]`. The inference that these provisions create no blanket twelve-month logging duty on every site is `[U]`. No IPA immunity is claimed. App code receives no secret in HTTP requests (`local/model.ts:55`, `local/index.html:12`), but that does not settle duties under a future notice. |
| Ofcom telecoms regulation, §7 | Communications Act §32(2)–(2B), (7) has a different definition and content-service exclusion `[P]`. The selected software page provides no internet access, phone numbers, calls, messages or signal-transport service (`local/main.ts:1`, `tools/build-local.mjs:17`). The project assessment is that this static software page is not providing that regulated communications service `[U]`; do not conflate it with the broader IPA label. |
| Data protection, §§3.1–3.2 | App data is held on the devices, not received by the publisher. Nicknames may be personal data, but no recipient/controller server is introduced for them. The note's controller examples are `[U]`, Article 13 notice contents `[P]`. Any real hosting request data must be assessed separately: collection/roles, retention, recipients and transfers cannot be inferred from a static build. `local/vault.ts:80`, `local/main.ts:73`. |
| Device storage and PECR, §4 | The statute/exception list is `[P]`; the note's necessary-app-storage reading is `[U]`. Encrypted localStorage is now used expressly to save the service the user requests. There are no analytics or advertising stores. Explain it accurately; no tracking banner is added. Camera capture and optional passkey prompts are user initiated. `local/main.ts:73`, `local/qr.ts:46`, `local/vault.ts:148`. |
| Children, §3.6 | No user-content service, accounts, advertising or remote profile collection is added. No minimum age is selected on the owner's behalf. The note's uncertainty about unfunded information-society services remains `[U]`, not an invented age-check requirement. |
| Export, §§6–6.1 | Included MIT/Apache-2.0 notices permit redistribution as their licences specify; notices are bundled (`tools/build-local.mjs:19`). The note's public-domain provision is `[P]`, other aspects `[S]`/`[U]`. Publication is recorded separately and is not itself an export classification. No export/end-use or sanctions clearance is claimed. |
| Trading, §8 | No purchase, subscription, payment or donation path is in this entry point. No business identity disclosure or registration is imposed merely because a static tool exists. `local/index.html:15`. |

## Already in place

The HTTPS QR can open a new browser directly into the pair. Its fragment secret
is consumed locally after early address replacement (`local/model.ts:55`,
`local/index.html:12`, `local/main.ts:412`). Native scanner/history/sync software
can still copy the original link; the notice now explains that separate exposure.
No single-use/expiry/revocation promise is made. The public site now serves this behavior; readback and anonymous browser
pairing are recorded in `../evidence/publication.json`.


Pairing can run transiently before any vault exists (`local/main.ts:121`).
Keeping a pair explicitly creates or unlocks encrypted local storage. Device-only
vaults need no custom password; recovery and portable backups are offered later,
with the loss risk explained (`local/vault.ts:171`, `local/vault.ts:193`). This
changes the device-storage facts, not the selected static-publisher position.

No message infrastructure, accounts, trackers or remote-secret backup. Names and
secrets are encrypted before browser persistence; backups exclude device
credential metadata and remain encrypted. The camera is optional, local-only and
bounded; no microphone/location is requested. Device unlock uses actual PRF key
material with user verification, not a public credential identifier. Unsupported
providers cannot produce a falsely enabled state. See `local/vault.ts:148`,
`local/vault.ts:193`, `local/qr.ts:31`, `local/main.ts:395`.

The UI describes shared-secret knowledge, a human duress plan and practical
limits instead of claiming identity certification, safety or automatic dispatch
(`local/main.ts:376`). No law or security assertion is justified by marketing copy.

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
in the deployed notice and `hosting-proposal.md`. The wrapper delivers fixed
HTML/headers only; no content-transfer or message API was added. Public bytes,
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
