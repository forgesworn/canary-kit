# Inventory and gap check

**Draft — 22 October 2026. Not legal advice; not reviewed by a lawyer.
Code `b1d33e1b6a1dc5d18a01c8ab173e19356cd2e2ee`.
Law note verified 28 September 2026.**

The legal-cover inventory helper was rerun on tracked `local/`: six code/config
files out of seventeen then-tracked files, excluding prose, tests and build
output. It found localStorage at `main.ts:68`; no default hosts, application
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
| 1. Could be hosted? | Static files and intended security headers only; no deployment performed. `tools/build-local.mjs:40`. |
| 2. Default hosts? | No external app server or remote asset. `local/main.ts:1` dependency graph, `tools/build-local.mjs:17`. |
| 3. Publisher-operated defaults? | None wired into this entry point. Not a finding about the larger app. `vite.local.config.ts:6`. |
| 4. Third parties? | Host receives requests if deployed; optional browser/OS credential provider receives its native API requests on user action. No app-content API or telemetry. `local/vault.ts:138`. |
| 5. One user's content through an operator server? | No. Setup crosses a local QR or manual read-back; no server routes or shared stores. `local/model.ts:36`, `local/qr.ts:46`. |
| 6. Discovery? | No public search, directory, presence or profile lookup. The private people list is decrypted locally. `local/main.ts:89`. |
| 7. Key holders? | Unlocked device and optional credential provider/key protection. No remote master key sent by app code. `local/vault.ts:96`, `local/vault.ts:138`. |
| 8. Storage/retention? | Encrypted localStorage and explicit encrypted backups; plaintext only in unlocked memory/display. No secure-erasure promise. `local/main.ts:67`, `local/main.ts:212`, `local/vault.ts:119`. |
| 9. Accounts/ages? | No app accounts or age gate. Device vault/passkey is not an account at the publisher. No minimum age selected. `local/index.html:19`. |
| 10. Money? | No purchase, donation, subscription or payment path in the local interface. `local/index.html:15`. |
| 11. Agents/recording? | No agent or transcription. Camera frames are transient QR input, not recordings. No microphone request. `local/qr.ts:46`. |
| 12. Start? | No new public service launched or deadline measured from a hypothetical launch. Local commit only. |
| 13. Named operator? | No invented natural person or company. Hosting roles/contact remain conditional. `local/legal/privacy.md` records unverified inputs, not code evidence. |
| 14. Server access? | No server component in this app. Only a future static download origin is intended. `tools/build-local.mjs:40`. |
| 15. Position? | Software publisher today; intended static-site publisher. No proof of a real hosted configuration. Build/runtime evidence above. |

## Gap check: previous draft versus this build

| Gap | Code evidence | Note | Resolution / who decides |
|---|---|---|---|
| Old draft said no persistent device storage. | `local/main.ts:67` now saves encrypted localStorage. | §§3.2, 4 | Corrected in all local drafts and in-file text. It is requested functional storage, not tracking. |
| Old draft said no camera access. | `local/qr.ts:46` now requests video on explicit scan action. | §§3.1–3.2 | Corrected: local transient decoding and capture lifecycle described. |
| Old draft described secret-bearing HTML exports and clipboard writes. | `local/main.ts:212` now exports encrypted JSON; no clipboard handler remains. | §§3.2, 4 | Removed the obsolete facts. Earlier downloaded HTML files are not retroactively protected or deleted. |
| Old draft omitted native passkey provider involvement. | `local/vault.ts:138` invokes WebAuthn PRF. | §3.2 | Added the provider trust boundary and possible platform syncing; no claim that OS networking is absent. |
| A future host's logs, roles and headers remain unknown. | Static files exist, no live host readback. | §§3.1–3.2 | Owner hosting inputs remain open in privacy draft. No published complete notice claimed. |
| Existing audit/financial alignment briefs cannot certify this UI. | `AUDIT.md:5`, `AUDIT.md:30`, `REGULATORY.md:3`. | Scope/evidence | No independent audit or broad regulatory acceptance claimed. Foreign/finance assertions were not revalidated. |

The watch list and current note status were checked. No local/static OSA
assessment deadline or service fee is identified. Legal topics outside the note,
hosted operation, independent audit, physical acceptance and foreign regimes are
not checked by this inventory. The full networked app remains separately scoped.
