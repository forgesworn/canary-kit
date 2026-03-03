# CANARY Integration Guide

How to integrate CANARY spoken-word verification into your systems.

## Overview

CANARY provides bidirectional, deepfake-proof identity verification using shared
secrets and spoken words. Both parties on a call independently derive the same
pair of words from a shared seed — one word per role. Cloning a voice does not
help derive the correct word. Only knowledge of the shared secret does.

This guide covers seed establishment patterns and call centre integration for
insurance, banking, and enterprise use cases.

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
  namespace: 'trott',
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

## Licence

MIT — same as canary-kit.
