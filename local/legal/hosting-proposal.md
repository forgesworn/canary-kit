# Adopted hosting record — minimal static page

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
App code `0ba43087ca2c701a143d85ba31464ca3f55a367e`.**

## Published deployment

The separate Site is public at
`https://canary-words.cocoacod256.chatgpt.site/`, published 23 October 2026.
The standalone source checkout is `../canary-words-site` beside this repository,
commit `393c4750c688613d18cd78cc3cc307363bb2b170`.
[Publication metadata](../evidence/publication.json),
[HTTP readback](../evidence/hosting.json) and
[live browser check](../evidence/live-browser.json) record the actual gates.

A minimal Worker ESM wrapper returns only the baked app and fixed security
headers on GET/HEAD `/`; other paths/methods are rejected. It reads no request
body and adds no logging, database, uploads, accounts, application API or remote
pair store. This response wrapper is needed because the provider's initial
static-file delivery ignored `_headers` and injected bot JavaScript. The app's
strict CSP blocked that injection; the failed readback is retained as
`hosting-v1.json`. The corrected wrapper serves the exact 264,969-byte app with
CSP/framing/transport/permissions headers and `Cache-Control: no-transform`.
That cache directive prevents Cloudflare JavaScript injection under its
[documented policy](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/).
The successful readback matches the local artifact byte for byte; no browser
or CSP errors or external application requests were observed.

## Why hosting adds privacy work

[Managing a Site](https://learn.chatgpt.com/docs/sites/managing-a-site#review-site-analytics)
states that the platform automatically records unique visits and page views
without an analytics SDK. This is separate from the app's absence of analytics.
No supported disable control was found in the available connector capabilities;
absence of a control is not proof that none exists elsewhere.

The applicable [Sites DPA](https://openai.com/en-GB/policies/chatgpt-sites-data-processing-addendum/)
(or the organisation's business DPA where applicable) describes OpenAI processing
hosted personal data on the publisher's behalf. Schedule 1 includes generated log,
usage and device data. Therefore this is not presented as a host that receives no
personal data, or as proof that the publisher has no controller responsibilities.

A GitHub Pages alternative was investigated read-only. The personal account’s default
origin already serves two unrelated apps. No available default account origin
was established as exclusive to this tool, so no shared default origin was
selected for its vault/passkeys. No existing site, DNS or account settings
were changed. No new server, custom domain or paid resource is proposed.

## Adopted notice facts

- Controller/project identity: the existing public Canary Kit project (ForgeSworn),
  with the already established GitHub private report route. No person's name or
  company identity is invented. Private reporting was verified enabled via the
  repository API on 23 October; the project policy now accepts privacy enquiries
  and the separate local website. That external contact route requires a GitHub
  account; the app itself does not.
- Purposes/basis: owner explicitly approved legitimate interests for delivering,
  securing and operating the static page, including the host's aggregate traffic
  statistics, on 23 October 2026. No advertising or app tracking SDK is introduced.
- Recipients: OpenAI as hosting provider, its hosting/subprocessors as described
  by the applicable DPA, and authorities where legally required. App code adds no
  other server recipient for pair secrets or names.
- Data: host connection/request metadata and automatic traffic statistics;
  the browser keeps pair secrets/nicknames locally, encrypted only on explicit
  Keep. The private setup secret is a URL fragment, outside the request path/query.
- Retention: the DPA describes the service term plus time needed to complete
  applicable obligations including deletion, rather than a universal fixed log
  lifetime. Do not invent a seven/thirty-day retention setting. Host-specific
  security/account data may also be governed by OpenAI's privacy policy.
- Transfers: refer to the applicable DPA's safeguards and UK Addendum. Do not
  claim UK-only/EU-only storage: the account's actual hosting region is unverified.
- Rights: access, correction, deletion, restriction, objection and portability
  where applicable; contact the controller about hosted data, with a complaint
  route to the ICO. There is no server-side pair vault for the publisher to find,
  recover, erase or disclose. Do not send setup links, pair words or passphrases
  with a privacy request. The host may require enough information to locate logs.
- Cookies: app installs no cookie or tracker. The public host sets Cloudflare's
  `__cf_bm` bot-protection cookie; the browser observed Secure / SameSite=None
  on `.chatgpt.site`. Values are not retained in evidence. Cloudflare describes
  expiry after 30 minutes of continuous inactivity in its
  [cookie documentation](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/).
  The page discloses this security processing. No zero-cookie promise is made.

## Legal scope versus a guarantee

The selected app has no message carriage or user-content store: the existing
OSA software/static-site assessment remains a documented interpretation `[U]`,
not a regulator's approval. The September law note was partially refreshed on
23 October for investigatory powers and Communications Act definitions.

Home Office guidance expressly includes website owners within the broad IPA
operator definition. That cannot be designed away merely by omitting chat. The
Communications Act definition is separate. Notice duties and a blanket logging
obligation must not be conflated: the reviewed IPA sections 66 and 87 concern
requirements/notices with their statutory conditions, not a prohibition on this
kind of static tool. No promise of immunity from future notices is made.

No lawfulness certificate or blanket UK-law clearance is given. The owner adopted
the hosting basis, and the deployed page uses the verified facts; this does not
certify every controller-wide obligation.

The basis assessment is limited to ordinary delivery/security metadata and
aggregate operation statistics: those support providing the requested page;
there is no app profiling, advertising or receipt of pair data. Host statistics
are automatic and no supported disable control was found. The notice explains
the processing and objection route. Reassess if the provider changes its
tracking or if the project adds personal analytics. This is a proportionate
project assessment, not a legal finding about every provider operation.

## Remaining steps

Public access, exact served HTML, security headers and anonymous QR-link
browser opening passed. The test used a generated secret in two isolated
contexts; HTTP requests contained no setup secret. Evidence contains no pair
secrets, words or cookie values. Physical iPhone/GrapheneOS camera and real
device-unlock acceptance remain to be performed separately.

Controller-wide ICO fee status is not established by this app inventory. The
GB note §3.4 records applicable fees and exemptions (tier 1, if due: £52 per year,
with a £5 direct-debit discount). Do not infer automatic exemption or a completed
registration from third-party hosting. No fee was paid.
