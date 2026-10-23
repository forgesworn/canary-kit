# Inventory and gap check

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code `0ba43087ca2c701a143d85ba31464ca3f55a367e`.
Law note verified 28 September 2026; §§5.1–5.2 and 7 partially refreshed
23 October 2026 against primary sources.**

The legal-cover inventory helper was rerun on tracked `local/`: six code/config
files out of eighteen tracked files, excluding prose, tests and build
output. It found localStorage at `main.ts:74`; no default hosts, application
endpoints, money paths, analytics or accounts. Manual review also followed the
bundled dependency graph, camera/credential calls, Blob export and generated
hosting headers, which the helper alone does not fully enumerate.

**Key-holder answer:** the user's unlocked browser holds the pair secrets and
master key. Local persisted records/backups contain encrypted secrets and wrapped
keys. The publisher receives no such key through this app. An unlocked compromised
device can read plaintext; optional platform credential providers are a separate
trust boundary. This is not end-to-end encryption of content carried by a server.

| Question | Finding / code evidence |
|---|---|
| 1. Could be hosted? | Public baked-page response only; exact HTML/headers verified. `../canary-words-site/worker/index.js:1`, `scripts/build-worker.mjs:1`, `local/evidence/publication.json`. |
| 2. Default hosts? | No external app server or remote asset. `local/main.ts:1` dependency graph, `tools/build-local.mjs:17`. |
| 3. Publisher-operated defaults? | None wired into this entry point. Not a finding about the larger app. `vite.local.config.ts:6`. |
| 4. Third parties? | Host receives public page requests; optional browser/OS credential provider receives its native API requests on user action. No app-content API or telemetry. `local/vault.ts:148`. |
| 5. One user's content through an operator server? | No. Setup crosses a local QR or manual read-back; no server routes or shared stores. `local/model.ts:36`, `local/qr.ts:46`. |
| 6. Discovery? | No public search, directory, presence or profile lookup. The private people list is decrypted locally. `local/main.ts:95`. |
| 7. Key holders? | Unlocked device and optional credential provider/key protection. No remote master key sent by app code. `local/vault.ts:90`, `local/vault.ts:148`. |
| 8. Storage/retention? | Encrypted localStorage and explicit encrypted backups; unsaved pairs/plaintext in memory/display only, cleared on lock. No secure-erasure promise. `local/main.ts:73`, `local/main.ts:301`, `local/vault.ts:129`. |
| 9. Accounts/ages? | No app accounts or age gate. Device vault/passkey is not an account at the publisher. No minimum age selected. `local/index.html:19`. |
| 10. Money? | No purchase, donation, subscription or payment path in the local interface. `local/index.html:15`. |
| 11. Agents/recording? | No agent or transcription. Camera frames are transient QR input, not recordings. No microphone request. `local/qr.ts:46`. |
| 12. Start? | Public static page published 23 October; no messaging-service deadline inferred. `local/evidence/publication.json`. |
| 13. Named operator? | No invented natural person or company. Existing project identity/report route retained; host terms and approved basis recorded. Page notice at `local/index.html:59`. |
| 14. Server access? | Wrapper returns baked HTML for GET/HEAD only, with no storage/body processing. `../canary-words-site/worker/index.js:1`. |
| 15. Position? | Static-site publisher; public readback and anonymous browser opening passed. `local/evidence/hosting.json`, `local/evidence/live-browser.json`. |

Normal-camera links are now another secret-handling surface: generation at
`local/model.ts:55`, early fragment stripping at `local/index.html:12`, and
consumption at `local/main.ts:412`. The HTTP request does not carry the fragment;
that does not rule out native scanner/browser-history/sync copies. Privacy facts
and UI cover those providers by kind, without promising they do not communicate.

## Hosting/legal scope refresh, 23 October

The shared-law §5/§7 refresh found a material distinction missing from the old
project table: the IPA operator definition includes website owners under the
Home Office guidance, while Ofcom's Communications Act definition is separate.
That omission is corrected in `position.md`; no blanket exemption is claimed.

The current app commit is named above; standalone publishing source commit is
`393c4750c688613d18cd78cc3cc307363bb2b170`. The public site serves the exact baked
page through a fixed-response wrapper with no application API. Provider traffic
metrics and processor terms add hosting facts without adding app-content
requests. The deployed notice retains the existing project identity/report route
and owner-approved legitimate-interest basis. Cookie/header/byte/network
readbacks are in `local/evidence/`; no physical phone acceptance is inferred.

## Gap check: previous draft versus this build

| Gap | Code evidence | Note | Resolution / who decides |
|---|---|---|---|
| Previous draft only described an opaque QR and app-owned camera frames. | `local/model.ts:55`, `local/index.html:12`, `local/main.ts:412` now support private HTTPS fragment links and native-camera opening. | §3.2 | Added link/history/native-provider exposure, address stripping and lack of one-use/revocation guarantees. Local files remain an explicitly labelled app-scanner preview. |
| Previous flow required a vault before exchanging. | `local/main.ts:121`, `local/main.ts:182` now pair in memory and save only on explicit Keep. | §§3.2, 4 | Updated privacy/UI facts: transient pairs clear on background or idle. No plaintext persistence introduced. |
| Previous wording assumed every vault had a recovery passphrase. | `local/vault.ts:171` creates a device-only slot; `:117` adds recovery later, `:193` refuses portable export without it. | §3.2 | Corrected UI, README and legal drafts. Explain credential-loss risk rather than claiming recovery exists. |
| Previous onboarding required a nickname and reference checkbox. | `local/main.ts:135`, `local/main.ts:356` open words directly and rename optionally. | §§3.1–3.2 | Names can be numbered local defaults. This is no identity certification or new remote profile collection. |
| Native credential provider remains involved only when asked to keep/unlock. | `local/vault.ts:148` requests verified PRF material. | §3.2 | Retained provider trust/sync boundary; no claim that OS networking is absent. |
| Earlier privacy draft left hosting unknown. | Fixed-response wrapper plus actual production readback in `local/evidence/hosting.json`; deployed notice `local/index.html:59`. | §§3.1–3.2 | Adopted basis/contact/provider facts; disclosed aggregate statistics and observed security cookie. No invented log lifetime or region. |
| Existing audit/financial alignment briefs cannot certify this UI. | `AUDIT.md:5`, `AUDIT.md:30`, `REGULATORY.md:3`. | Scope/evidence | No independent audit or broad regulatory acceptance claimed. Foreign/finance assertions were not revalidated. |

The watch list and current note status were checked. No local/static OSA
assessment deadline or service fee is identified. Legal topics outside the note,
provider-internal retention/region, controller-wide fee status, independent audit,
physical acceptance and foreign regimes are
not checked by this inventory. The full networked app remains separately scoped.
