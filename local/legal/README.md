# Draft UK legal cover: static local-processing app

**Draft — 23 October 2026. Not legal advice; not reviewed by a lawyer.
Code: `b15046e69fd930006e5e620ef30459236d6308e1`.**

**Today:** software publisher; a local HTML file and static hosting candidate
exist. No new service has been deployed. **Owner's intended position:** a
phone-first static HTTPS website with encrypted device storage and optional
device unlock. No accounts, directory, message carriage, shared server storage
or relay defaults. A real host and its data handling have not been selected or verified.

Scope is `local/`, its bundled dependency graph and generated artifact. It does
not assess the larger `app/`, other hosted Canary services, other messaging
providers or any independently operated server.

Law source: [GB online-services note](https://github.com/forgesworn/jurisdiction-kit/blob/main/law/gb/online-services.md),
**verified 28 September 2026; review by 28 March 2027**. `[P]` means a primary
source was read, `[S]` secondary, `[U]` unchecked or unsettled interpretation.
A `[P]` mark is not a legal opinion. The note remains within its review date.

- [Position, regimes and outstanding work](position.md)
- [Inventory and corrected document gaps](inventory.md)
- [Privacy facts and conditional hosting inputs](privacy.md)

The design is assessed as an ordinary static software site, not a user-to-user
message service. This is a scope assessment, not a claim of compliance with all
UK law. No regulated-service risk assessment, age gate, registration, natural
person's public identity or company formation is invented for this position.

**Before publishing:** resolve the actual host/logging/role inputs in the privacy
draft and adopt accurate hosted privacy wording. The code provides no backend
that would need to be removed to reach the chosen position. A separate stable
HTTPS origin is needed for vault/passkey isolation. Deploying behind a larger
networked app is not evidence that the wider service is outside scope.

No funds spent, registration made, regulator contacted, push or deployment
performed. No operator identity, minimum age or legal basis has been chosen for
the owner. The drafted host identity/role inputs are conditional; they are not a
requirement to identify a natural person merely to publish ordinary software.
