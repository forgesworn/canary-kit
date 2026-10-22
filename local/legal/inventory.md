# Code inventory and document gaps

**Draft — 22 October 2026. Not legal advice; not reviewed by a lawyer. Code:
`46079244b9c93edac98f184f240d8f86d891a811`. Law note verified 28 September 2026.**

The legal-cover inventory helper was run on the full repository and separately
on tracked `local/` files. The latter searched four source/config files out of
six then-tracked files; its automated searches found no hosts, servers, payment
paths, analytics or accounts. Its search vocabulary misses Blob exports and
clipboard writes, which were manually checked below. The isolated build graph
and emitted file were also checked; the full app's relay defaults are not part
of this artifact. The helper omits ignored dependencies and does not prove
runtime behaviour by itself.

**Key-holder answer:** Nothing operated by the publisher holds a user's key in
this artifact. The user's browser and explicitly saved private HTML files do
hold the complete shared secret; the files are unencrypted.

| Inventory question | Finding | Code evidence / verification limit |
|---|---|---|
| 1. What could be hosted? | Static local file only in this entry point. | `vite.local.config.ts:6`, `tools/build-local.mjs:28`. No deployment performed. |
| 2. Default hosts? | None. | `local/main.ts:1` import graph; emitted file has no external scripts or assets. |
| 3. Publisher-operated defaults? | None in this artifact. | `tools/build-local.mjs:17`; not a finding about the larger app. |
| 4. Third-party contacts? | None automatically. Optional clipboard and download are device operations. | `local/main.ts:90`, `local/main.ts:129`; offline browser request monitor saw none. |
| 5. Content reaching another user through the publisher? | No endpoint, storage, relay, API or sharing service. | `local/main.ts:90`; users independently transfer files/words outside this software. |
| 6. Discovery? | No directory, search, profiles or presence. | Complete `local/index.html:15` interface and `local/main.ts:105` handlers. |
| 7. Keys held? | Browser session and private exported file contain the shared secret. | `local/model.ts:14`, `local/main.ts:8`, `local/main.ts:94`. No remote key holder. |
| 8. Stored where / retention? | Memory during session; user-requested file until deleted; clipboard history outside app control. | `local/main.ts:90`, `local/main.ts:129`, `local/main.ts:151`. No guaranteed memory erasure. |
| 9. Accounts / age checks? | None; no chosen minimum age. | `local/index.html:15`, `local/model.ts:12`. |
| 10. Money? | No payment or donation path in the local interface. | `local/index.html:15`; full-repository funding metadata is not an enabled feature here. |
| 11. Agents / transcription? | None. | `local/main.ts:1` imports; only local token derivation and DOM operations. |
| 12. Service start? | No new service launched. | Local commit only; no hosting or launch date claimed. |
| 13. Named operator? | No natural person named; no hosted controller inferred. | `local/index.html:53`; future host inputs remain conditional in `privacy.md`. |
| 14. Who can use a server? | No server supplied or contacted by the artifact. | `tools/build-local.mjs:17`, browser `file://` validation. |
| 15. Position? | Local software publisher, as chosen by the owner. | Build and runtime evidence above. Other deployments require their own inventory. |

## Existing-document gap check

The helper's legal-document patterns did not identify a privacy notice, terms,
or `docs/legal` documents. A manual check also considered `REGULATORY.md`,
`AUDIT.md` and `THREAT-MODEL.md`; their claims are not borrowed for this new file.

| Gap / limit | Evidence | Note section | Who decides / resolution |
|---|---|---|---|
| Financial/foreign regulatory mapping does not establish UK scope or this UI's assurance. | `REGULATORY.md:3` addresses integrators; local file has no banking service. | §§1, 2.1, 13 | Local assessment written separately; broader claims were not revalidated. |
| Existing audit is automated and excludes UI/build/deployment. | `AUDIT.md:5`, `AUDIT.md:30`; local entry point is new. | Scope/evidence discipline | No independent audit or regulatory acceptance claimed. |
| Existing threat model does not assess this UI or private-file storage. | `THREAT-MODEL.md:15`; `local/main.ts:94` embeds the secret. | §3 and project facts | Limitations documented in the UI and `local/README.md`. |
| No local-specific account of exported secret files and clipboard retention existed. | `local/main.ts:90`, `local/main.ts:129`. | §§3.2, 4 | Addressed by local privacy facts and in-file explanations. |
| A future host's logs/roles are unverified. | No host or deployment selected. | §§3.1–3.2 | Conditional owner inputs in `privacy.md`; no invented operator identity. |

No local hosted-service deadlines or fees have been identified. No release,
deployment, physical device, foreign regime, full-repository legal audit, or
independent security review is evidenced by this inventory.
