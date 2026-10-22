# Position on scope

**Draft — 22 October 2026. Not legal advice; not reviewed by a lawyer. Code:
`46079244b9c93edac98f184f240d8f86d891a811`. Law note verified 28 September 2026.**

## Position today and intended position

Publisher of a self-contained local software file. The owner expressly selected
this position. `local/main.ts:90` exports a local Blob download; `local/model.ts:14`
creates secrets on the device; `vite.local.config.ts:6` selects only the local
entry point. `tools/build-local.mjs:17` blocks network connections in the final
file. No hosting registration, deployment or content-transfer endpoint is added.

The full repository also contains a larger network-capable application. This
finding is scoped to the separate local entry point and its bundled dependency
graph, not to every file or deployment in this repository.

## What applies

All section references below are to the
[GB note](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md)
(verified 28 September 2026).

| Regime | Finding and evidence |
|---|---|
| Online Safety Act, §§2.1–2.2 | The statutory user-to-user definition is `[P]`. Applying it here, the local file supplies no service on which one user's content may be encountered by another. The note's static-software publisher reading is `[U]`: a scope judgement, not an Ofcom approval. No illegal-content or children's-access assessment is added for this local file. It neither inherits another messaging app's duties nor changes the duties of an independently operated Kithmoot deployment. `local/main.ts:90`; `tools/build-local.mjs:17`. |
| Data protection, §§3.1–3.2 | The publisher receives no setup words, spoken words, identifiers or connection logs through the delivered file. This is a code finding, not a blanket data-protection exemption for every actor. The note's controller examples are `[U]`; its Article 13 notice requirements are `[P]`. If a download site is later operated, its connection data and controller position must be settled separately. `local/main.ts:90`, `local/main.ts:129`, `local/index.html:53`. |
| Device storage, §4 | The note's PECR rule and exceptions are `[P]`; its necessary-app-storage interpretation is `[U]`. This app installs no cookies, localStorage, IndexedDB or service worker. File downloads and clipboard copying occur only on the user's explicit action after the on-screen explanation. No tracking-consent banner is introduced. `local/main.ts:90`, `local/main.ts:123`, `local/main.ts:129`; `local/index.html:46`. |
| Children, §3.6 | No personal-data service, advertising, profiles or user-content surface is introduced. A minimum age has not been selected on the owner's behalf. The note's uncertainty about unfunded projects remains `[U]`; it is not turned into an age-check requirement here. |
| Export, §§6–6.1 | Existing MIT notices permit redistribution and are included in the build (`tools/build-local.mjs:19`). The note's public-domain release provision is `[P]`, with other export points `[S]`/`[U]`. The new file has not been published or supplied abroad by this task, so this assessment does not assume that an unpublished addition already meets a public-release condition. This is not an export/end-use or sanctions clearance. |
| Trading, §8 | There is no purchase, subscription, advertising, donation or payment path in the local entry point. The assessment does not import the full repository's separate funding metadata into this file. `local/index.html:15`. |

## Already in place

An isolated offline build, no accounts or directory, no relays or message
carriage, no analytics or cookies, no microphone/camera/location access, no
automatic alerts, explicit secret-file and clipboard explanations, and in-file
privacy/limitations text. The normal and duress result messages describe
shared-secret knowledge rather than claiming identity or safety
(`local/main.ts:142`). Runtime dependencies' MIT notices are bundled.

## What is owed next

No applicable OSA assessment deadline or service fee has been identified for
this offline-file position. This is a scoped finding, not a declaration that no
law can ever apply. Retain the code inventory and scope reasoning; keep the
in-file facts accurate when changing the software. The owner should review these
drafts before adopting them as the project's public legal position.

If hosting is added, minimise collection first: no analytics, forms, cookies or
application endpoints; disable or shorten access logs where the host permits.
Then verify actual hosting arrangements and finish the conditional inputs in
`privacy.md`. Do not publish an incomplete hosted-site notice. A message service
or relay would need a separate assessment against the note's then-current duties,
costs and deadlines.

## Not checked

The existing deployed Canary site or other messaging providers; actual host
logs; foreign law; individual users' processing; export end-use and sanctions;
consumer-law and Equality Act questions outside the note (§13); physical-phone
acceptance; independent legal or security review. The existing
`REGULATORY.md` financial/foreign-law alignment brief has not been adopted as
evidence of this file's legal or security status.

The watch list was read. Its messaging-service, scanning, Ofcom-code, fee and
company-registration changes do not create an active duty for this local-file
design. Recheck scope if its distribution or functionality changes. The law note
is within its stated review period; it was not silently redated.
