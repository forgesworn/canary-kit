# Regulatory Alignment

This document maps the CANARY protocol's security properties against converging voice fraud and authentication regulations. It is intended for compliance teams, integrators, and legal reviewers evaluating CANARY as part of their authentication stack.

Security property references (P1–P8) are defined in [THREAT-MODEL.md](THREAT-MODEL.md). Deployment patterns are documented in [INTEGRATION.md](INTEGRATION.md).

---

## The Four Verification Scenarios

CANARY and Signet together address all four real-world caller identity scenarios. Understanding which scenario applies is the first step to selecting the right protocol.

| Scenario | Who is calling? | Protocol | Deployment |
|----------|----------------|----------|------------|
| **Known person** | A known individual (friend, colleague, family member) | Signet "Signet me" — ECDH from prior QR exchange | Prior relationship required |
| **Known institution** | A bank, insurer, or service provider the customer is already enrolled with | CANARY session (pre-shared seed, app-derived) | App-derived seed via Pattern 1 (see INTEGRATION.md) |
| **Unknown person** | A caller whose identity is unverified | Signet trust tier check | Verifier checks Signet credential tier |
| **Unknown institution cold-calling** | A bank or institution calling a customer who has no prior session | Signet cold-call verification (`.well-known` + ephemeral ECDH) | Forthcoming — see [Signet](https://github.com/TheCryptoDonkey/signet) |

The regulations below primarily address the **known institution** scenario — a financial institution or regulated service calling an enrolled customer. CANARY's HMAC-counter session protocol is the appropriate tool for this scenario.

---

## Why Voice Verification Matters Now

The threat that makes regulation urgent is not theoretical. AI voice cloning now requires as little as three seconds of audio, is available as a service, and is already linked to organised crime at institutional scale. In March 2023, the United Nations Office on Drugs and Crime (UNODC) reported that deepfake technology is being actively exploited by criminal networks for fraud, extortion, and identity theft, with synthetic voice being a primary vector.

The verification methods that were adequate a decade ago are failing against this threat:

- **SMS one-time passwords** are defeated by SIM-swap attacks, SS7 interception, and social engineering. Multiple regulators are now mandating their replacement.
- **Voice biometrics** compare audio characteristics — properties that AI can now synthesise. 91% of US banks are reconsidering voice biometrics systems following deepfake attacks.
- **Security questions** are one-directional (only the customer proves identity to the institution, never the reverse) and rely on information that may be publicly available or previously breached.

CANARY addresses this threat at the protocol level. Tokens are derived from a shared secret using HMAC-SHA256. Cloning a voice does not help an attacker derive the correct token — only knowledge of the shared secret does.

---

## UAE — Central Bank SMS-OTP Phase-Out

**Issuing body:** Central Bank of the UAE (CBUAE)
**Directive:** CBUAE Circular 3057 — Phase-out of SMS and email OTP authentication for financial transactions
**Effective date:** 31 March 2026 (phased rollout underway since July 2025; SMS OTP for card payments discontinued from January 2026)
**Scope:** All licensed financial institutions (LFIs) — banks, insurers, payment providers, exchange houses

### What the regulation mandates

LFIs must discontinue SMS and email OTP as authentication factors for financial transactions. Permitted replacements include biometric verification, Emirates Face Recognition, and mobile-based soft tokens derived through app-based authentication.

### CANARY alignment

CANARY's app-derived seed pattern (Pattern 1 in INTEGRATION.md) provides a direct replacement for SMS OTP that exceeds the mandate's intent:

- **No SMS dependency** — the shared seed is derived server-side from customer identity and delivered over TLS during app login. No one-time code is transmitted per transaction.
- **Offline derivation** — tokens are computed locally on the device after initial sync. There is no network round-trip at verification time.
- **Phishing resistance** — tokens are HMAC-derived from a secret unavailable to phishing sites (P1: Token Unpredictability).
- **Bidirectional** — the agent speaks a token to the customer that proves the institution's identity, not just the customer's identity to the institution. This exceeds the regulation's baseline requirement.
- **Coercion resistance** — the duress token mechanism (P2: Duress Indistinguishability, P5: Coercion Resistance) provides a capability SMS OTP cannot match.

### What gap remains

CANARY requires a prior relationship — the customer must have the institution's app installed and the seed provisioned before a call can be authenticated. CANARY does not address cold-call verification of institutions the customer has no prior relationship with. The forthcoming Signet cold-call verification feature is designed for that scenario.

---

## India — RBI Digital Payment Authentication Framework

**Issuing body:** Reserve Bank of India (RBI)
**Framework:** RBI Directions on Authentication of Digital Payment Transactions (issued 25 September 2025)
**Effective date:** 1 April 2026 (domestic transactions); 1 October 2026 (cross-border card-not-present transactions)
**Scope:** Banks, card issuers, and payment service providers handling digital payment transactions

### What the regulation mandates

The framework requires two-factor authentication (2FA) for all domestic digital payment transactions, with at least one dynamic factor for card-not-present transactions. A dynamic factor is defined as a unique challenge per transaction — a biometric match, cryptographic key, or time-limited code.

The framework is technology-neutral: it permits passwords, passphrases, PINs, device tokens, biometrics, software tokens, and other mechanisms — provided the implementation meets the 2FA and dynamic-factor requirements. Risk-based authentication (RBA) is explicitly supported for contextual assessment of higher-risk transactions.

### CANARY alignment

A CANARY session provides a dynamic factor that satisfies the framework's requirements:

- **Dynamic token** — each CANARY token is time-bounded and advances with a monotonic counter (P4: Replay Resistance). Tokens from prior sessions cannot be reused.
- **Knowledge factor** — the shared seed is a possession/knowledge factor held in the customer's app secure storage (Keychain or KeyStore).
- **Two-directional** — the customer proves identity to the agent; the agent proves the institution's identity back. This is a stronger posture than the regulation's minimum.
- **Offline derivation** — tokens are computed locally, reducing exposure to server-side compromise.

For voice-channel payment authorisation (a customer calling to authorise a high-value transfer), CANARY provides a spoken dynamic factor that replaces SMS OTP without requiring the customer to read digits aloud — reducing shoulder-surfing and interception risk.

### What gap remains

The RBI framework focuses on payment transactions. CANARY is a call-verification protocol; it does not replace card-present authentication or replace the payment transaction itself. It addresses the authentication of the caller's identity in voice-channel interactions surrounding a payment.

---

## UK — Ofcom and the Online Safety Act

**Issuing body:** Ofcom (UK communications regulator)
**Framework:** Online Safety Act 2023 — duties on providers of regulated user-to-user and search services
**Status:** In force. Ofcom is actively enforcing duties including risk assessment, illegal content removal, and deepfake-related obligations.
**Consultation dates:** Ofcom is conducting rolling consultations on categorised service duties through 2026. A specific "deepfake consultation closing 23 March 2026" could not be independently verified at time of writing — verify current Ofcom consultation schedule at [ofcom.org.uk](https://www.ofcom.org.uk) before referencing this date publicly.

### Context

Ofcom opened a formal investigation into a major platform in January 2026 for alleged failures to comply with Online Safety Act duties related to non-consensual deepfake image generation. The investigation signals active regulatory attention to AI-generated synthetic media at the platform level.

CANARY does not operate at the platform layer. Its relevance to the Ofcom framework is indirect: organisations subject to Online Safety Act duties that operate voice or video communication services may benefit from CANARY's verification properties as a technical control demonstrating they have assessed and mitigated AI-impersonation risks in their communications infrastructure.

### CANARY alignment

- **Deepfake-resistance at the verification layer** — CANARY tokens cannot be derived from voice audio alone. A synthetic voice cannot satisfy a CANARY challenge without the shared secret (P1, P8).
- **Duress signal** — call centres subject to Online Safety Act obligations around user welfare can use the silent duress path (P2, P5) to alert safety teams without exposing the caller.
- **Audit trail** — `kind 28802` word-used events provide a cryptographically verifiable record of verification outcomes.

### What gap remains

CANARY addresses human-to-human voice verification, not platform-level deepfake labelling of published media. It is a verification tool, not a detection or labelling tool.

---

## EU — AI Act Article 50 Deepfake Transparency

**Issuing body:** European Commission
**Provision:** EU AI Act, Article 50 — Transparency obligations for providers and deployers of certain AI systems
**Effective date:** 2 August 2026
**Scope:** Providers and deployers of AI systems used to generate or manipulate synthetic content, including deepfakes
**Code of Practice:** Draft published January 2026; final Code anticipated June 2026

### What the regulation mandates

Article 50 requires that AI-generated or AI-manipulated content be machine-readable marked and detectable. Deployers must disclose to users when content is a deepfake. This is a **labelling and disclosure** obligation — it applies to AI systems that generate synthetic content, not to authentication systems.

### CANARY alignment

CANARY's positioning against Article 50 is **complementary, not overlapping**:

- **Labelling is retroactive** — a deepfake label is applied to content after it is created. CANARY is real-time: it verifies the caller's identity at the moment of the interaction, before any action is taken.
- **"Was this content AI-generated?"** is a different question from **"Is the person I am speaking with who they claim to be?"** CANARY answers the second question.
- Organisations deploying CANARY alongside labelling-compliant AI systems achieve defence-in-depth: the AI system labels synthetic outputs, and CANARY verifies that the person initiating the interaction is authenticated.

For institutions building voice-channel products subject to Article 50 (e.g., AI-generated voice assistants used in customer service), CANARY can serve as the authentication layer that verifies the human on the other end of the call, separate from whatever labelling mechanism is applied to AI-generated agent speech.

### What gap remains

CANARY does not satisfy Article 50 obligations directly — those obligations rest with providers and deployers of generative AI systems. CANARY is an authentication protocol, not a content labelling system.

---

## EU — eIDAS 2.0 and the European Digital Identity Wallet

**Issuing body:** European Commission
**Framework:** Regulation (EU) 2024/1183 (eIDAS 2.0) — European Digital Identity Wallets
**Deadline:** At least one EUDI Wallet must be available in each EU Member State by December 2026. Mandatory acceptance by specified relying parties from December 2027.
**Status:** Large-scale pilots underway. Technical specifications are still being finalised.

### What the regulation mandates

Each EU Member State must provide citizens with a European Digital Identity Wallet. The wallet will hold verifiable credentials (identity documents, professional qualifications, attributes) and will be accepted for authentication by public services and specified private-sector relying parties.

High-assurance use cases (e.g., opening a bank account, accessing healthcare records) require the wallet to prove the holder is physically present and in possession of the device — a liveness requirement.

### CANARY alignment

The EUDI Wallet creates an infrastructure on which verification layers can be built. CANARY is relevant at the **liveness proof** layer:

- **In-person or remote enrolment** — during wallet onboarding or high-assurance credential issuance, a CANARY spoken-word challenge can serve as an additional liveness factor proving the holder is present and uncoerced.
- **Seed stored in wallet** — the CANARY group seed could be provisioned as a wallet-held secret, with the wallet's security guarantees (hardware-backed secure element) protecting the seed.
- **Coercion signal at the point of authentication** — the duress token path (P2, P5) remains relevant when the holder is being compelled to authenticate against their will.

This integration pattern is at the design stage. The EUDI Wallet technical architecture (ARF — Architecture and Reference Framework) is still being finalised, and production-ready wallets do not yet exist. A concrete integration design will follow once the ARF stabilises.

### What gap remains

CANARY does not issue verifiable credentials, does not interact with the EUDI Wallet protocol directly, and does not replace the wallet's core identity assertion mechanism. It is a supplementary liveness and coercion-resistance layer.

---

## W3C — Verifiable Credentials Confidence Method

**Issuing body:** W3C Verifiable Credentials Working Group
**Specification:** Confidence Method v1.0
**Current status:** First Public Working Draft (published 2025). Target: W3C Recommendation by July 2026 per working group charter. **This specification is experimental and not yet fit for production deployment.**
**Purpose:** Defines a mechanism for issuers to include methods in a verifiable credential that verifiers can use to increase confidence that the subject is the intended entity.

### What the specification addresses

The Confidence Method defines how a credential issuer can declare, within a credential, what mechanisms a verifier may use to confirm that the credential's subject is present and is the same entity the issuer intended. This is a **liveness and binding** problem: proving that the credential holder is present at the time of presentation, not merely in possession of the credential.

### CANARY alignment

CANARY's security properties map directly onto the Confidence Method's intent:

- **P1 (Token Unpredictability)** — a CANARY challenge-response proves the presenter possesses the shared secret. This can serve as a confidence method declaring "the subject must be able to produce the current CANARY token."
- **P6 (Liveness Guarantee)** — liveness heartbeats provide ongoing proof of presence, not just point-in-time authentication.
- **P8 (Timing Safety)** — constant-time verification ensures the confidence method cannot be gamed by timing analysis.

A formal mapping between CANARY's protocol properties and the Confidence Method specification will be developed in Phase 4 of the regulatory positioning work, once the specification reaches Candidate Recommendation stage and its extension points are stable.

### What gap remains

The Confidence Method specification is an early working draft. The extension mechanism for declaring CANARY as a confidence method has not been formally specified. This section will be updated as the specification progresses.

---

## UK — FCA Strong Customer Authentication

**Issuing body:** Financial Conduct Authority (FCA)
**Framework:** FCA Payment Services and Electronic Money (PSD2 / UK PSRs) — Strong Customer Authentication (SCA) technical standards
**Status:** In force. Updated technical standards effective 19 March 2026.
**Scope:** Payment service providers operating in the UK

### What the regulation mandates

SCA requires authentication that uses two or more of: something the customer **knows** (knowledge factor), something the customer **has** (possession factor), and something the customer **is** (inherence factor). For remote electronic payment transactions, at least two independent factors must be used, and the resulting authentication code must be dynamically linked to the transaction amount and payee.

### CANARY alignment

For voice-channel payment authorisation, CANARY provides both a knowledge factor (shared seed, known only to the customer and institution) and an element of the possession factor (the seed is stored in the customer's device secure storage behind device biometrics or PIN):

- **Knowledge factor** — the CANARY seed functions as a shared secret. Only the customer's enrolled device can derive the current token.
- **Possession factor** — the seed is stored in Keychain (iOS) or KeyStore (Android), accessible only via device authentication. The device itself is the possession element.
- **Dynamic linking** — CANARY tokens rotate on a time-based counter. Tokens are not reusable (P4: Replay Resistance). For transaction-specific linking, the session namespace and role identifiers can be constructed to include transaction context.
- **Timing safety** — constant-time token comparison (P8) prevents timing attacks on the authentication path.

For FCA SCA purposes, CANARY is best positioned as the voice-channel authentication layer that satisfies the knowledge and possession requirements when a customer is calling to authorise a payment — replacing SMS OTP (which satisfies possession only, weakly) with a cryptographically stronger spoken-word alternative.

The FCA's updated technical standards also move toward risk-based authentication, allowing providers to apply reduced friction for low-risk transactions. CANARY's counter-based rotation and configurable tolerance window support risk-tiered deployment.

### What gap remains

SCA requires authentication codes to be "dynamically linked" to the specific transaction amount and payee for remote electronic payments. Standard CANARY sessions use time-based or burn-after-use counters, not transaction-specific inputs. Integrators requiring transaction-linked codes should use a session namespace or counter derived from transaction parameters — this is supported by the CANARY API but requires application-level design. See INTEGRATION.md (Pattern 1) for the recommended server-side derivation pattern.

---

## Cross-References

| Document | Purpose |
|----------|---------|
| [THREAT-MODEL.md](THREAT-MODEL.md) | Security properties P1–P8, adversary profiles, attack trees |
| [INTEGRATION.md](INTEGRATION.md) | Deployment patterns — call centre, banking, rideshare, field operations |
| [CANARY.md](CANARY.md) | Full protocol specification |
| [NIP-CANARY.md](NIP-CANARY.md) | Nostr binding for group protocols |
| [Signet](https://github.com/TheCryptoDonkey/signet) | Cold-call verification for unknown institutions (forthcoming) |

---

*This document reflects the regulatory landscape as of March 2026. Regulatory positions evolve — verify current status of all deadlines before making compliance decisions. Nothing in this document constitutes legal advice.*
