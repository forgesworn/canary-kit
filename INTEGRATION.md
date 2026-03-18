# CANARY Integration Guide

How to integrate CANARY spoken-word verification into your systems.

## Overview

CANARY provides bidirectional, deepfake-proof identity verification using shared
secrets and spoken words. Both parties on a call independently derive the same
pair of words from a shared seed — one word per role. Cloning a voice does not
help derive the correct word. Only knowledge of the shared secret does.

This guide covers seed establishment patterns and call centre integration for
insurance, banking, and enterprise use cases.

For regulatory alignment analysis — including FCA, RBI, UAE TDRA, EU AI Act,
eIDAS, and W3C Confidence Method — see [REGULATORY.md](REGULATORY.md).

## Seed Establishment Patterns

The shared seed is the foundation of CANARY verification. How it gets to both
parties depends on your infrastructure.

### Pattern 1: App-Derived Seed (Primary — Insurance/Banking)

The customer authenticates to the insurer's app. The seed is derived server-side
and synced during login.

```
Customer opens Aviva app
  → Authenticates (biometrics / password / MFA)
  → App requests session seed from Aviva backend
  → Backend: seed = HMAC-SHA256(master_key, customer_id || seed_version)
  → Seed delivered over TLS to the app
  → App stores seed in secure storage (Keychain / KeyStore)
  → Call centre agent's system derives the same seed from the same inputs
```

Key properties:
- **No extra setup step** — seed arrives during normal app login
- **`seed_version`** allows rotation without re-enrolment
- **Master key** is HSM-protected server-side
- **Offline-capable** — the app derives tokens locally after initial sync
- **Works with existing app infrastructure**

```typescript
import { deriveSeed, createSession } from 'canary-kit/session'

// Server-side: derive seed for a customer
const seed = deriveSeed(masterKey, customerId, seedVersion.toString())

// Both agent and customer derive the same seed independently
const session = createSession({
  secret: seed,
  namespace: 'aviva',
  roles: ['caller', 'agent'],
  myRole: 'agent',
  preset: 'call',
  theirIdentity: customerId,
})
```

### Pattern 2: Enrolment QR (Branch / In-Person)

For customers without the app, generate a QR code containing the seed:

```
Customer visits branch / receives postal letter
  → Staff generates CANARY enrolment QR code
  → QR contains: { seed, namespace, roles, rotation }
  → Customer scans with phone
  → Seed stored locally
```

### Pattern 3: SMS/Email OTP Bootstrap (Lower Security)

For customers with no app and no branch visit:

```
Customer calls insurer
  → Agent sends one-time setup code via SMS/email
  → Customer enters code into a web page
  → Page derives seed from code + customer ID + server nonce
  → Page stores seed in browser/app
```

Weakest pattern (SMS is interceptable). Stepping stone to Pattern 1.

### Pattern 4: Task-Derived Seed (Rideshare / Delivery)

For event-based verification where both parties are matched dynamically:

```
Task accepted on platform
  → Platform generates task_secret (256-bit random)
  → Shared with both parties via encrypted channel
  → Both parties: seed = deriveSeed(task_secret, requester_id, provider_id)
```

```typescript
import { deriveSeed, createSession } from 'canary-kit/session'

const seed = deriveSeed(taskSecret, requesterId, providerId)

const session = createSession({
  secret: seed,
  namespace: 'dispatch',
  roles: ['requester', 'provider'],
  myRole: 'provider',
  preset: 'handoff',
  counter: taskId,
})
```

## Call Centre Integration

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Customer    │     │  Agent       │     │  Seed Service    │
│  (app)      │     │  (desktop)   │     │  (backend)       │
│             │     │              │     │                  │
│ seed ───────┼─────┼── seed ──────┼─────┼── master_key     │
│             │     │              │     │  + customer_id   │
│ createSession     │ createSession│     │  + seed_version  │
│             │     │              │     │                  │
│ myToken() ──┼──→──┼── verify() ──│     │                  │
│             │     │              │     │                  │
│ verify() ←──┼──←──┼── myToken() │     │                  │
└─────────────┘     └──────────────┘     └──────────────────┘
```

### Agent UX

The agent's screen shows:
- **Expect to hear:** the caller's current word (derived from `theirToken()`)
- **Your word:** the agent's current word (derived from `myToken()`)
- Countdown bar showing time until rotation
- Verification status: green tick (valid), red cross (invalid), amber alert (duress)

On verification:
1. Agent asks: "What's your verification word?"
2. Customer speaks their word
3. Agent types it into the system → `session.verify(spoken)`
4. System shows result (green/red/amber)
5. Agent reads their word aloud for the customer to verify

### Customer UX

The customer's app shows:
- **Your word:** the word to speak to the agent
- **Expect to hear:** the word the agent should speak back
- Countdown bar showing rotation timer
- Tap to reveal (hidden by default for shoulder-surfing protection)

### Duress Handling

When duress is detected (caller speaks their duress word instead of their
verification word), the agent's system:

1. **Shows normal "verified" to the agent** — maintaining plausible deniability
2. **Silently triggers the duress protocol** — security team alert, call recording flagged
3. **Logs the event** for compliance and investigation

The caller never reveals they are under coercion. The attacker sees a normal
verification succeed and has no way to know the duress path was triggered.

```typescript
const result = session.verify(spokenWord)

if (result.status === 'duress') {
  // Show normal success to the agent (deniability)
  showVerified()
  // Silently alert security team
  triggerDuressProtocol(result.identities)
}
```

## Security Considerations

### Master Key Management

- Store master keys in HSMs (Hardware Security Modules)
- Rotate master keys on a schedule
- `seed_version` allows seamless customer migration during rotation
- Never expose master keys to application code — derive seeds via a secure service

### Seed Storage

| Side | Storage | Protection |
|------|---------|------------|
| Client (iOS) | Keychain | Biometric / device PIN |
| Client (Android) | KeyStore | Biometric / device PIN |
| Client (browser) | IndexedDB | Encrypted with user PIN |
| Server | Encrypted database | Access-controlled, audit-logged |

### Rotation Strategy

- **Quarterly rotation** for standard accounts (update `seed_version`)
- **Immediate rotation** after any suspected compromise
- `seed_version` increment does not require customer re-enrolment
- Old seeds should be invalidated server-side after rotation grace period

### Threat Model

| Threat | Mitigated? | How |
|--------|-----------|-----|
| Voice cloning (deepfake) | Yes | Token derived from secret, not voice |
| Eavesdropping | Partially | Tokens rotate; old tokens are useless |
| Stolen device | Partially | Seed in secure storage behind biometrics/PIN |
| Compromised master key | No | Requires HSM + procedural controls |
| Social engineering | Yes | Bidirectional — attacker must know the secret |
| Coercion / duress | Yes | Distinct duress token triggers silent alert |

## Regulatory Considerations

The deployment patterns above align with specific regulatory frameworks. This
section summarises the alignment; see [REGULATORY.md](REGULATORY.md) for the
full analysis including gap assessments.

### FCA Strong Customer Authentication (UK)

Pattern 1 (App-Derived Seed) provides two SCA factors for voice-channel payment
authorisation:

- **Knowledge factor** — the shared seed, known only to the customer and institution
- **Possession factor** — the seed stored in device secure storage (Keychain / KeyStore) behind biometrics or PIN

CANARY tokens rotate on a time-based counter (P4: Replay Resistance). For
transaction-specific dynamic linking (required by FCA for remote electronic
payments), construct the session namespace or counter from transaction parameters:

```typescript
const session = createSession({
  secret: seed,
  namespace: `aviva:payment:${payeeId}:${amountPence}`,
  roles: ['caller', 'agent'],
  myRole: 'agent',
  preset: 'call',
  theirIdentity: customerId,
})
```

### RBI Digital Payment Authentication (India)

Pattern 1 satisfies the RBI's two-factor authentication requirement for digital
payment transactions (effective 1 April 2026). The CANARY token serves as a
dynamic factor — unique per time window, computed locally, and not transmitted
over SMS.

For voice-channel payment authorisation, CANARY replaces SMS OTP with a spoken
dynamic factor that does not require the customer to read digits aloud — reducing
interception and shoulder-surfing risk.

### UAE TDRA SMS-OTP Phase-Out

CBUAE Circular 3057 discontinues SMS and email OTP for financial transactions
(effective 31 March 2026). Pattern 1 provides a direct replacement:

- No SMS dependency — seeds are derived server-side and delivered over TLS during app login
- Offline derivation — tokens computed locally after initial sync
- Phishing resistance — tokens are HMAC-derived from a secret unavailable to phishing sites

Pattern 3 (SMS/Email OTP Bootstrap) should be treated as a transitional step to
Pattern 1, not as a long-term authentication mechanism in UAE-regulated contexts.

### EU AI Act Article 50 (Deepfake Transparency)

CANARY is complementary to Article 50 obligations (effective 2 August 2026).
Article 50 requires labelling of AI-generated content. CANARY verifies caller
identity at the point of interaction — a different concern. Organisations
deploying both achieve defence-in-depth:

- The AI system labels synthetic outputs (Article 50 compliance)
- CANARY verifies the human on the call is authenticated (caller integrity)

"Labelling tells you the content was AI-generated. CANARY tells you the person
on the phone is who they claim to be."

## Cold-Call Verification (Signet)

The patterns above require a prior relationship — the customer must have the
institution's app installed and a seed provisioned. For the scenario where an
institution calls a customer who has no prior enrolment, the
[Signet protocol](https://github.com/forgesworn/signet) provides cold-call
verification.

### How it works

The institution publishes a secp256k1 public key on its domain:

```
GET https://example-bank.co.uk/.well-known/signet.json
```

```json
{
  "version": 1,
  "name": "Example Bank",
  "pubkeys": [
    {
      "id": "fraud-team",
      "pubkey": "64-char-hex-secp256k1-x-only-pubkey",
      "label": "Fraud & Security Team",
      "created": "2026-01-15T00:00:00Z"
    }
  ],
  "relay": "https://verify.example-bank.co.uk/signet",
  "policy": {
    "rotation": "quarterly",
    "contact": "security@example-bank.co.uk"
  }
}
```

When the institution calls a customer:

1. Agent: "I'm calling from Example Bank. Can you Signet me?"
2. Customer opens the Signet app, types `example-bank.co.uk`
3. App fetches the institution's public key from `.well-known/signet.json`
4. App generates an ephemeral keypair, computes ECDH with the institution's key
5. App shows a short session code (e.g. `BRAVO-7742`) and 3 verification words
6. Customer reads the session code to the agent
7. Agent's system resolves the session code, performs ECDH, derives the same words
8. Agent reads the words — customer confirms they match

No prior enrolment. No shared secret. The trust anchor is DNS domain ownership.

### Deployment for institutions

Minimum deployment is a single static JSON file at `/.well-known/signet.json`
on the institution's domain. Requirements:

- HTTPS only (no HTTP fallback)
- Max 20 pubkeys per file, max 10 KB
- Pubkeys as 64-character hex (secp256k1 x-only public keys)
- Key rotation policy recommended (quarterly minimum)
- Private keys MUST be stored in an HSM for regulated institutions

For session code resolution, the institution hosts a lightweight HTTPS endpoint
(specified in the `relay` field). See the
[Signet protocol spec §27](https://github.com/forgesworn/signet) for the full
specification.

### Relationship to CANARY

Cold-call verification and CANARY are complementary:

| | Cold-Call (Signet) | CANARY Session |
|---|---|---|
| Prior relationship | Not required | Required (shared seed) |
| Duress detection | No | Yes |
| Liveness monitoring | No | Yes |
| Offline / mesh | No | Yes |
| Use case | "Is this my bank calling?" | "Am I safe? Is my family safe?" |

For institutions: deploy `.well-known/signet.json` for cold-call verification,
and Pattern 1 (App-Derived Seed) for enrolled customers. Both use spoken-token
HMAC-SHA256 derivation under the hood.

## Example: Insurance Phone Verification

End-to-end walkthrough using Aviva as the example:

```typescript
import { createSession } from 'canary-kit/session'

// Agent's system — seed was derived from master_key + customer_id
const agentSession = createSession({
  secret: customerSeed,
  namespace: 'aviva',
  roles: ['caller', 'agent'],
  myRole: 'agent',
  preset: 'call',
  theirIdentity: customerId,
})

// 1. Agent asks: "What's your verification word?"
// 2. Customer speaks their word
const result = agentSession.verify(spokenWord)

if (result.status === 'valid') {
  // ✓ Customer identity confirmed
  // 3. Agent speaks their word for the customer to verify
  const agentWord = agentSession.myToken()
  // Agent reads aloud: "Your confirmation word is: choose"
} else if (result.status === 'duress') {
  // ⚠ Customer is under coercion — silent alert
  showVerified() // maintain deniability
  triggerDuressProtocol(result.identities)
} else {
  // ✗ Verification failed — escalate
  escalateToSecurity()
}
```

## Beacon Privacy: Timing Correlation

Location beacons (`encryptBeacon`) encrypt the geohash payload with AES-256-GCM,
but the Nostr event metadata — `created_at`, publisher pubkey, and the `h` group
tag — is visible to relay operators and traffic analysts.

**Risk:** If beacons are published at a fixed interval (e.g. every 300 seconds),
an observer can:

- **Link beacons over time** by matching the regular cadence from a single pubkey
- **Detect online/offline transitions** when the cadence stops or resumes
- **Correlate pubkey rotations** by matching timing patterns across old and new keys

The content (location) remains encrypted, but the *pattern of publishing* leaks
information about a member's connectivity and movement schedule.

### Mitigation: Publish Jitter

Applications SHOULD add random jitter to the beacon publish interval. canary-kit
encrypts beacon payloads but does not control scheduling — jitter must be applied
at the application layer.

Recommended jitter by threat profile:

| Preset       | Jitter              | Rationale                                    |
|--------------|---------------------|----------------------------------------------|
| `family`     | None required       | Members know each other; timing is not sensitive |
| `enterprise` | ±20% of interval    | Reduces cadence fingerprinting across employees |
| `field-ops`  | ±30–50% of interval | Online/offline patterns are operationally sensitive |

Example (applying jitter in your publish loop):

```typescript
const baseInterval = group.beaconInterval // e.g. 300
const jitterFraction = 0.3 // ±30% for field-ops
const jitter = baseInterval * jitterFraction * (2 * Math.random() - 1)
const nextPublishIn = baseInterval + jitter
setTimeout(() => publishBeacon(), nextPublishIn * 1000)
```

For high-threat deployments, also consider:

- **Variable-rate publishing** — draw intervals from an exponential distribution
  rather than a jittered fixed interval
- **Relay diversity** — publish each beacon to a different relay to prevent any
  single operator from seeing the full cadence
- **Batch windows** — all members publish within a coordinated time window so
  individual cadences are masked by group activity

## Cross-Device State Sync

Group-based deployments (family safety, field operations) must consider how
group state reaches a user's second device. The seed, members, and settings
are security-critical — they must not be transmitted in the clear.

### Recommended: Encrypted Vault

Encrypt the full group state with the user's own key and store it on an
available transport. On login from a new device, fetch and decrypt the vault.

Properties an implementation should preserve:

| Property | Why |
|----------|-----|
| **Self-encrypted** | Only the user's own key can decrypt — the storage layer sees an opaque blob |
| **No metadata leakage** | The transport must not reveal how many groups exist, who the members are, or that the blob is a CANARY vault |
| **Transport-agnostic** | The vault is a single encrypted blob. It can be stored on a relay, a cloud bucket, a USB stick, or passed over a mesh radio |
| **Conflict resolution** | When two devices have diverged, the merge strategy must be deterministic. Recommend: higher epoch wins (rekey happened), then higher counter wins, otherwise keep local |
| **Offline-first** | A device that has never synced must still function. The vault is an enhancement, not a dependency |

### What to store

Include everything needed to derive tokens and verify members:

- Group seed, counter, epoch, usage offset
- Member list and admin list
- Rotation interval, word count, tolerance, encoding format
- Relay configuration (for online groups)
- Display names (advisory, not security-critical)

Exclude ephemeral or device-local state:

- Beacon positions (device-local, stale quickly)
- Liveness check-in timestamps (device-local)
- UI preferences that are per-device

### What NOT to do

- **Do not sync seeds in plaintext** — even over TLS, storage backends may log or cache
- **Do not use a shared encryption key** — each user encrypts their own vault with their own key
- **Do not expose group count** — an attacker learning "this person has 3 safety groups" is itself sensitive information
- **Do not require sync for operation** — the app must work offline after initial group setup

### Reference implementation

The canary-kit demo app (`app/nostr/vault.ts`) implements this pattern using
NIP-44 self-encryption and NIP-78 application-specific replaceable events on
Nostr relays. The vault is a single JSON blob containing all group states,
encrypted with the user's own keypair, published as a kind 30078 event with
a `d` tag of `canary:vault`.

## Licence

MIT — same as canary-kit.
