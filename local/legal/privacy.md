# Local privacy facts

**Draft — 22 October 2026. Not legal advice; not reviewed by a lawyer. Code:
`46079244b9c93edac98f184f240d8f86d891a811`. Law note verified 28 September 2026.**

This concerns the offline `canary-local.html` file. The corresponding in-file
text is `local/index.html:53`, with secret-export and clipboard explanations at
`local/index.html:46`. It is a description of local processing, not a completed
notice for a hypothetical hosted service.

The software holds setup words and derived tokens in the current browser
session. It uses the device clock. It sends no data to the publisher or another
party; no server, account, member directory, analytics, cookies, service worker,
location access, camera or microphone is used. It neither records meetings nor
stores a personal-name label. Tokens are derived locally using two fixed side
labels (`local/model.ts:7`).

Choosing **Save my private copy** or **Save their private copy** creates an HTML
download containing the unencrypted setup secret and the selected side
(`local/main.ts:90`). Those files remain until the user deletes them. Browser
download history, backups, cloud file sync or extensions may retain them. The
publisher cannot recover, erase or revoke a privately held file. Closing a pair
clears the active UI state; it is not a promise to securely wipe browser memory
or delete the embedded secret in the file originally opened.

Choosing **Copy setup words** writes the secret to the device clipboard
(`local/main.ts:129`). Clipboard managers and cross-device clipboard sync may
retain it. The app neither reads existing clipboard contents nor clears clipboard
history. Instead of copying, users can read the setup words privately in person.

Signal, Kithmoot, WhatsApp or another app receives data only if the user separately
chooses to speak or paste something there. This tool has no API, default server
or automatic connection to those services. A duress match shows an on-device
result and sends no report, location or emergency alert (`local/main.ts:136`).

The bundled software notices are included in the file. Existing security-report
routes are described in the repository's `SECURITY.md`; no new report form or
content-upload endpoint has been introduced.

## Conditional inputs before a hosted download

First consider leaving distribution with an existing third-party software host,
or using a plain static host with analytics and access logging disabled where
possible. No account or form is needed for this tool. Even a static web host may
handle IP addresses and ordinary request metadata; disabling retention does not
by itself resolve every controller question.

- `[INPUT: chosen host, controller/processor roles, request data actually handled,
  log retention, security recipients and any international transfers.]`
- `[DECISION: any resulting controller identity/contact, purposes and legal basis,
  keeping collection to what is necessary for delivering the static download.]`
- `[INPUT: any necessary hosted-site rights and complaint contact, including the
  controller complaint route, after the hosting facts and roles are known.]`

These are conditional hosting inputs. They are not requirements to name an
individual, form a company or collect contact details to use the offline file.
The Article 13 list is in the
[GB note §3.2](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md#32-the-privacy-notice)
`[P]`; this draft deliberately does not supply unverified host details.
