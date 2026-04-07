# Cookbook -- canary-kit

> Complete workflow examples for common integration patterns. For API reference, see [API.md](API.md). For protocol specs, see [CANARY.md](CANARY.md).

## Duress Detection: Detecting and Handling Coercion

Canary-kit's coercion resistance works by giving each member a personal duress word that is always distinct from the normal verification word. When a coerced member speaks their duress word instead of the normal word, the verifier silently detects the coercion without the coercer knowing.

### Session-Based Duress Detection (Phone Calls)

```typescript
import { createSession } from 'canary-kit/session'

// Both parties share a secret (established during onboarding)
const session = createSession({
  secret: sharedSecretHex,
  namespace: 'acme-insurance',
  roles: ['agent', 'customer'],
  myRole: 'agent',
  preset: 'call',
  // CRITICAL: theirIdentity enables duress detection.
  // Without it, duress tokens return 'invalid' instead of 'duress'.
  theirIdentity: customerId,
})

// Agent speaks their token to prove identity to the customer
const agentSaysToCustomer = session.myToken()

// Customer speaks back -- agent verifies
const spokenByCustomer = 'granite' // what the agent heard
const result = session.verify(spokenByCustomer)

switch (result.status) {
  case 'valid':
    // Normal verification -- proceed with the call
    console.log('Customer verified successfully')
    break

  case 'duress':
    // SILENT ALERT: customer is under coercion.
    // result.identities contains the identity strings of coerced parties.
    // DO NOT reveal this to the caller -- the coercer may be listening.
    console.log('Duress detected for:', result.identities)
    // Trigger silent alert workflow:
    // 1. Continue the call as if verification succeeded
    // 2. Flag the interaction in your backend
    // 3. Notify security/compliance team via back-channel
    // 4. Follow your organisation's duress response protocol
    await triggerSilentDuressAlert(result.identities, session)
    break

  case 'invalid':
    // Word does not match -- could be wrong word, expired token, or attacker
    console.log('Verification failed')
    // Ask the customer to repeat, or escalate
    break
}
```

### Group-Based Duress Detection

```typescript
import {
  createGroup, getCurrentWord, getCurrentDuressWord,
  verifyWord, getCounter,
} from 'canary-kit'

const group = createGroup({
  name: 'Family Safety',
  members: [alicePubkey, bobPubkey, carolPubkey],
  preset: 'family',
  creator: alicePubkey,
})

// The normal verification word is shared by all members
const normalWord = getCurrentWord(group) // e.g. "falcon"

// Each member has a unique duress word
const aliceDuress = getCurrentDuressWord(group, alicePubkey) // e.g. "marble"
const bobDuress = getCurrentDuressWord(group, bobPubkey)     // e.g. "timber"

// Verify a word spoken by any group member
const counter = getCounter(Math.floor(Date.now() / 1000), group.rotationInterval)
const result = verifyWord(spokenWord, group.seed, group.members, counter, group.wordCount)

switch (result.status) {
  case 'verified':
    console.log('Identity confirmed')
    break

  case 'duress':
    // result.members contains the pubkeys of the coerced member(s)
    console.log('DURESS: coerced members:', result.members)
    // The specific member's duress word matched -- you know WHO is under duress
    break

  case 'stale':
    // Word matches a previous time window -- likely clock skew or late call
    console.log('Stale token -- ask them to repeat')
    break

  case 'failed':
    console.log('Verification failed -- word does not match')
    break
}
```

### Key Design Points

- **Duress words are always distinct from verification words.** The library enforces collision avoidance with suffix retry. A duress word can never accidentally equal the normal word.
- **Duress detection requires identity context.** For sessions, pass `theirIdentity`. For groups, pass all `members` to `verifyWord`. Without identities, duress cannot be detected.
- **Duress wins over valid.** If a word matches both (impossible by design, but as a safety property), duress takes priority.
- **Silent by design.** The coercer hears a normal-sounding word. The verifier sees `duress` status. Nothing in the protocol reveals that duress was detected.

---

## Replacing SMS OTP with Spoken-Word Verification

SMS OTP is vulnerable to SIM-swap, SS7 interception, and social engineering. Canary-kit replaces it with time-rotating spoken words derived from a shared secret, meeting FCA Strong Customer Authentication (SCA) requirements: possession (the shared secret on the device) + inherence (the human speaking the word).

### Step-by-Step Migration

```typescript
import { createSession, deriveSeed } from 'canary-kit/session'

// ── Step 1: Onboarding (replaces "register phone number") ─────────────────

// During account creation or migration, derive a per-customer seed
// from your platform's master key + customer ID.
const customerSeed = deriveSeed(platformMasterKey, 'customer', customerId)
// Store customerSeed securely server-side. Provision to customer's app via
// secure channel (QR code in branch, NFC tap, or authenticated app download).

// ── Step 2: Authentication (replaces "send SMS OTP") ──────────────────────

// Server creates a session for this authentication attempt
const serverSession = createSession({
  secret: customerSeed,
  namespace: 'mybank',
  roles: ['server', 'customer'],
  myRole: 'server',
  preset: 'call',          // 30-second rotation, +-1 tolerance
  theirIdentity: customerId, // enables duress detection
})

// Server displays or reads: "Please say the word: {serverSession.myToken()}"
// Customer's app shows: serverSession.theirToken() from their local session
// Customer speaks the word shown in their app

// ── Step 3: Verification (replaces "check OTP code") ──────────────────────

const result = serverSession.verify(spokenWord)

if (result.status === 'valid') {
  // Authentication successful
  grantAccess(customerId)
} else if (result.status === 'duress') {
  // Customer is under coercion -- grant apparent access but trigger silent alert
  grantApparentAccess(customerId)
  await alertSecurityTeam(customerId, result.identities)
} else {
  // Authentication failed
  denyAccess(customerId)
}
```

### Why This Works as an OTP Replacement

- **No phone number dependency.** SIM-swap and SS7 interception do not apply.
- **Works offline.** Tokens derived locally from shared secret + time. No network needed at verification time.
- **Bidirectional.** Both parties prove identity, not just the user to the server.
- **Duress detection.** Coerced users can signal silently -- impossible with SMS OTP.

For regulatory compliance mapping (FCA SCA, EU AI Act, UAE, RBI), see [INTEGRATION.md](INTEGRATION.md).

---

## Group Verification: Multi-Member Verification Workflows

### Basic Group Verification

```typescript
import {
  createGroup, getCurrentWord, getCurrentDuressWord,
  verifyWord, getCounter, advanceCounter,
} from 'canary-kit'

// Create a group with an admin who can manage membership
const group = createGroup({
  name: 'Field Team Alpha',
  members: [leaderPubkey, agent1Pubkey, agent2Pubkey, agent3Pubkey],
  preset: 'field-ops',  // 2-word phrases, 24-hour rotation
  creator: leaderPubkey, // leader is admin
})

// All members derive the same verification phrase
const phrase = getCurrentWord(group) // e.g. "falcon granite"

// Any member can verify any other member's spoken phrase
const counter = getCounter(Math.floor(Date.now() / 1000), group.rotationInterval)
const result = verifyWord(
  spokenPhrase,
  group.seed,
  group.members,
  counter,
  group.wordCount,
)

// After using the word (e.g. for a check-in), burn it to prevent replay
const updated = advanceCounter(group)
// The next getCurrentWord(updated) returns a different phrase
```

### M-of-N Threshold Verification

Canary-kit groups use a shared secret, so all members derive the same verification word. M-of-N threshold checks are implemented at the application layer by collecting individual verifications:

```typescript
import {
  createGroup, getCurrentWord, verifyWord, getCounter,
} from 'canary-kit'

interface MemberVerification {
  pubkey: string
  spokenWord: string
  timestamp: number
}

/**
 * Verify M-of-N group members have provided correct tokens.
 * Each member must independently speak the current word.
 * Returns verified/duress member lists for threshold decisions.
 */
function verifyThreshold(
  group: GroupState,
  verifications: MemberVerification[],
  requiredCount: number,
): { verified: string[]; duress: string[]; failed: string[]; met: boolean } {
  const counter = getCounter(Math.floor(Date.now() / 1000), group.rotationInterval)
  const verified: string[] = []
  const duress: string[] = []
  const failed: string[] = []

  for (const v of verifications) {
    // Each verification is checked independently
    const result = verifyWord(v.spokenWord, group.seed, group.members, counter, group.wordCount)

    switch (result.status) {
      case 'verified':
        verified.push(v.pubkey)
        break
      case 'duress':
        // Even in M-of-N, duress is flagged silently
        duress.push(v.pubkey)
        break
      case 'stale':
      case 'failed':
        failed.push(v.pubkey)
        break
    }
  }

  return {
    verified,
    duress,
    failed,
    // Threshold met only when enough members verify AND no duress detected
    met: verified.length >= requiredCount && duress.length === 0,
  }
}

// Usage: require 2-of-3 members to verify before authorising an action
const result = verifyThreshold(group, collectedVerifications, 2)

if (result.duress.length > 0) {
  // At least one member signalled duress -- abort and alert
  await triggerGroupDuressProtocol(result.duress)
} else if (result.met) {
  // Threshold met -- proceed
  authoriseAction()
} else {
  // Not enough verified members
  requestMoreVerifications(result.failed)
}
```

### Group Membership Management with Sync

```typescript
import {
  createGroup, addMember, removeMember, advanceCounter,
} from 'canary-kit'
import {
  applySyncMessage, encodeSyncMessage, decodeSyncMessage,
  deriveGroupKey, encryptEnvelope, decryptEnvelope,
  type SyncMessage,
} from 'canary-kit/sync'

// ── Adding a member (admin-only) ──────────────────────────────────────────

const joinMsg: SyncMessage = {
  type: 'member-join',
  pubkey: newMemberPubkey,
  displayName: 'Carol',
  timestamp: Math.floor(Date.now() / 1000),
  epoch: group.epoch,
  opId: crypto.randomUUID(),
  protocolVersion: 2,
}

// Encrypt for transport (AES-256-GCM with group key)
const groupKey = deriveGroupKey(group.seed)
const encrypted = await encryptEnvelope(groupKey, encodeSyncMessage(joinMsg))

// On the receiving side: decrypt and apply
const decrypted = await decryptEnvelope(groupKey, encrypted)
const decoded = decodeSyncMessage(decrypted)
const nowSec = Math.floor(Date.now() / 1000)

// applySyncMessage returns a new GroupState (unchanged if rejected)
const newState = applySyncMessage(group, decoded, nowSec, adminPubkey)

// Check if it was applied by comparing references
if (newState !== group) {
  console.log('Member added:', newMemberPubkey)
  console.log('Members:', newState.members)
} else {
  console.log('Message rejected (not admin, wrong epoch, or replay)')
}
```

---

## Family Safety Application

### Setting Up a Family Verification Group

```typescript
import {
  createGroup, getCurrentWord, getCurrentDuressWord,
  verifyWord, getCounter,
} from 'canary-kit'
import { deriveSeed } from 'canary-kit/session'

// ── Master Key Management ─────────────────────────────────────────────────
// The master key should be stored in the device's secure enclave/keychain.
// On iOS: Keychain Services. On Android: Android Keystore.
// On web: IndexedDB with non-extractable CryptoKey (WebCrypto API).
//
// NEVER store the master key in localStorage, plain files, or app preferences.
// If the master key is compromised, all derived group seeds are compromised.

// Option A: Generate a fresh master key during family setup
import { generateSeed } from 'canary-kit/session'
const masterKey = generateSeed()  // 32 random bytes

// Option B: Derive from a mnemonic (BIP-39) for recovery
// import { mnemonicToSeedSync } from '@scure/bip39'
// const masterKey = mnemonicToSeedSync(mnemonic).slice(0, 32)

// ── Create Family Group ───────────────────────────────────────────────────
const family = createGroup({
  name: 'Smith Family',
  members: [mumPubkey, dadPubkey, teenPubkey, granPubkey],
  preset: 'family',     // 1 word, 7-day rotation
  creator: mumPubkey,   // mum is admin (can add/remove members)
})

// ── Weekly Family Verification ────────────────────────────────────────────
// Each week, the word rotates automatically. Family members can verify
// each other during phone calls or video calls.
const currentWord = getCurrentWord(family) // e.g. "falcon"

// ── Elderly Parent Protection ─────────────────────────────────────────────
// Scenario: gran receives a call from someone claiming to be her grandchild.
// Instead of relying on voice recognition (defeated by AI cloning), she asks
// for the family word.
//
// Legitimate grandchild knows the word (their app shows it).
// Voice-cloning scammer does NOT know the word (they don't have the seed).

// Gran verifies the word spoken to her:
const counter = getCounter(Math.floor(Date.now() / 1000), family.rotationInterval)
const result = verifyWord(spokenWord, family.seed, family.members, counter, family.wordCount)

if (result.status === 'verified') {
  // Caller knows the family word -- identity confirmed
  console.log('This is really a family member')
} else if (result.status === 'duress') {
  // Family member is being coerced -- the correct response depends on context:
  // - Notify other family members via the app
  // - Contact authorities
  // - Do NOT confront the coercer
  console.log('Family member under duress:', result.members)
} else {
  // Caller does not know the word -- likely a scam
  console.log('Scam call detected -- hang up')
}
```

### Error Handling for Family Apps

```typescript
import { createGroup, syncCounter, type GroupState } from 'canary-kit'

// ── Loading persisted state ───────────────────────────────────────────────
// After app restart or device reboot, refresh the time-based counter.
// syncCounter enforces monotonicity -- the counter never goes backwards,
// even if the device clock was rolled back.

function loadGroupState(persisted: GroupState): GroupState {
  // Refresh counter to current time window
  const refreshed = syncCounter(persisted)

  // Validate the loaded state
  if (refreshed.members.length === 0) {
    throw new Error('Group has no members -- may have been dissolved')
  }
  if (refreshed.seed === '0'.repeat(64)) {
    throw new Error('Group seed is zeroed -- group was dissolved')
  }

  return refreshed
}

// ── Handling network delays ───────────────────────────────────────────────
// Family members may be in different time zones or have clock drift.
// The tolerance window (default: 1 for family preset) accepts tokens
// from adjacent time windows: current, previous, and next.
//
// For families spread across time zones, consider increasing tolerance:
const family = createGroup({
  name: 'Global Family',
  members: [londonPubkey, sydneyPubkey, nyPubkey],
  preset: 'family',
  tolerance: 2,       // Accept tokens from +-2 windows (wider margin)
  creator: londonPubkey,
})
```

---

## Multi-Channel Verification Architecture

Canary-kit is transport-agnostic. The same shared secret can derive verification tokens across phone calls, video calls, messaging apps, and in-person encounters. This section covers how to maintain verification integrity across multiple channels.

### Architecture Overview

```
                    +------------------+
                    |  Shared Secret   |
                    |  (per pair or    |
                    |   per group)     |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
        +-----+-----+ +-----+-----+ +-----+-----+
        |   Phone   | |   Video   | |   In-App   |
        |   Call    | |   Call    | |  Message   |
        +-----+-----+ +-----+-----+ +-----+-----+
              |              |              |
        session:call   session:call   group:verify
        30s rotation   30s rotation   7d rotation
```

### Same Secret, Different Channels

```typescript
import { createSession, deriveSeed } from 'canary-kit/session'

// Derive channel-specific sessions from the same master secret.
// Each channel gets its own namespace, producing different tokens.
// This prevents a token captured on one channel from being replayed
// on another channel (cross-channel replay prevention).

const masterSecret = deriveSeed(platformKey, 'customer', customerId)

// Phone call session
const phoneSession = createSession({
  secret: masterSecret,
  namespace: 'acme/phone',  // unique namespace per channel
  roles: ['agent', 'customer'],
  myRole: 'agent',
  preset: 'call',
  theirIdentity: customerId,
})

// Video call session (different tokens due to different namespace)
const videoSession = createSession({
  secret: masterSecret,
  namespace: 'acme/video',
  roles: ['agent', 'customer'],
  myRole: 'agent',
  preset: 'call',
  theirIdentity: customerId,
})

// The phone token and video token are DIFFERENT at the same instant,
// even though they derive from the same master secret.
// This prevents cross-channel replay attacks.
console.log(phoneSession.myToken()) // e.g. "falcon"
console.log(videoSession.myToken()) // e.g. "marble" (different)
```

### Replay Prevention Mechanisms

Canary-kit prevents replay attacks through multiple layers:

1. **Time-based rotation.** Tokens rotate every 30 seconds (for `call` preset). A captured token expires within the tolerance window.

2. **Namespace isolation.** Each channel uses a different namespace, producing different tokens. A token from the phone channel is invalid on the video channel.

3. **Burn-after-use (groups).** `advanceCounter()` immediately rotates the token after use, preventing replay within the same time window.

4. **Epoch-based replay protection (sync).** Every state-mutating sync message carries an `opId` tracked in `consumedOps`. Replayed messages are silently dropped. The `epoch` field ensures messages from old group states (before a reseed) are rejected.

5. **Freshness gates (fire-and-forget).** Beacon and liveness messages are dropped if older than 5 minutes (`FIRE_AND_FORGET_FRESHNESS_SEC`) or more than 60 seconds in the future (`MAX_FUTURE_SKEW_SEC`).

```typescript
import { advanceCounter } from 'canary-kit'

// After verifying a group member's word, burn it immediately
let group = loadGroupState()
const result = verifyWord(spoken, group.seed, group.members, counter, group.wordCount)
if (result.status === 'verified') {
  // Advance the counter so this word cannot be replayed
  group = advanceCounter(group)
  persistGroupState(group)
}
```

---

## Distributed Sync Architecture

Canary-kit's sync protocol is designed for distributed environments where multiple devices hold copies of group state and must converge without a central server. This section covers the architectural considerations for deploying sync across multiple nodes.

### Consistency Model: Convergent State via Operation Ordering

Canary-kit uses an **operation-based consistency model** where the sync protocol guarantees convergence through invariant enforcement rather than consensus:

- **No central coordinator.** Any node can generate and broadcast sync messages. There is no leader election or distributed lock.
- **Idempotent operations.** Every sync message carries an `opId`. The `consumedOps` set ensures that applying the same message twice is a no-op (Invariant I2).
- **Monotonic counters.** Counter-advance messages enforce `incomingEffective > currentEffective`, so out-of-order delivery of counter advances converges to the highest value.
- **Epoch boundaries.** Reseeds atomically replace `{seed, members, admins, epoch}` and clear `consumedOps`. Messages from old epochs are rejected (Invariant I6). This provides a clean cut-over point.

```typescript
import {
  applySyncMessage, decodeSyncMessage,
  deriveGroupKey, decryptEnvelope,
  type SyncMessage,
} from 'canary-kit/sync'
import type { GroupState } from 'canary-kit'

/**
 * Process an incoming sync message on any node.
 * The invariants ensure convergence regardless of message ordering.
 */
async function processIncomingSyncMessage(
  currentState: GroupState,
  encryptedPayload: string,
  senderPubkey: string,
): Promise<GroupState> {
  const groupKey = deriveGroupKey(currentState.seed)

  // Decrypt the envelope (AES-256-GCM, keyed to current seed)
  // Fails if the message was encrypted with an old seed (post-reseed)
  let plaintext: string
  try {
    plaintext = await decryptEnvelope(groupKey, encryptedPayload)
  } catch {
    // Decryption failure: message from a different epoch or corrupted
    // This is expected during reseed transitions -- not an error
    return currentState
  }

  // Parse and validate the message structure
  let msg: SyncMessage
  try {
    msg = decodeSyncMessage(plaintext)
  } catch (err) {
    // Invalid message: wrong protocol version, missing fields, etc.
    // Log for debugging but do not apply
    console.warn('Invalid sync message:', (err as Error).message)
    return currentState
  }

  // Apply with full invariant checking
  const nowSec = Math.floor(Date.now() / 1000)
  const newState = applySyncMessage(currentState, msg, nowSec, senderPubkey)

  // applySyncMessage returns the same reference if rejected
  if (newState === currentState) {
    // Message was rejected by an invariant (stale epoch, replay, etc.)
    // This is normal in distributed systems -- not an error
    return currentState
  }

  // Persist the updated state
  await persistState(newState)
  return newState
}
```

### Message Ordering and Conflict Resolution

**Out-of-order delivery is handled by the invariants, not by the application.** You do not need to implement message ordering, vector clocks, or CRDTs. The sync protocol handles it:

| Scenario | How it converges |
|---|---|
| Two `counter-advance` messages arrive out of order | Monotonic check: only the higher effective counter wins. Both orderings produce the same final state. |
| `member-join` arrives after `reseed` | Epoch check (I3/I6): the join is rejected because its epoch doesn't match. The admin must re-issue the join in the new epoch. |
| Two nodes send `counter-advance` simultaneously | Both are applied if they advance the counter. The higher value wins on both nodes (monotonic). |
| `member-leave` replayed after re-join | `opId` replay guard (I2): the duplicate `opId` is in `consumedOps` and is silently dropped. |
| Network partition heals with diverged state | Nodes exchange their pending messages. Invariants ensure only valid, non-replayed messages are applied. Counter advances converge to the max. |

### Preserving Deepfake-Proof Guarantees in Distributed Deployments

The deepfake-proof property depends on the shared secret remaining secret. In a distributed environment:

1. **Envelope encryption.** All sync messages travel inside AES-256-GCM envelopes derived from the group seed (`deriveGroupKey(seed)`). Only nodes that possess the current seed can decrypt messages.

2. **Reseed isolates epochs.** When a member is removed or a compromise is suspected, `reseed` generates a new seed and bumps the epoch. Old nodes (or attackers with the old seed) cannot decrypt messages in the new epoch. The key derivation changes completely.

3. **No seed in transit (except during provisioning).** Normal sync messages (counter-advance, beacon, member-join) do not contain the seed. The seed is only transmitted during initial group creation (via NIP-17 gift wrap or QR code) and during reseed (encrypted within the new epoch's envelope).

4. **Offline-first derivation.** Each node derives tokens locally from its copy of the seed and the current counter. No network request is needed to verify a spoken word. This means a compromised relay or transport layer cannot inject false tokens.

```typescript
import {
  applySyncMessage, encodeSyncMessage,
  deriveGroupKey, encryptEnvelope,
  type SyncMessage,
} from 'canary-kit/sync'
import { removeMember, type GroupState } from 'canary-kit'

/**
 * Handle suspected compromise: remove the compromised member and reseed.
 * This atomically invalidates the old seed across all nodes.
 */
function handleCompromise(
  group: GroupState,
  compromisedPubkey: string,
  adminPubkey: string,
): { newState: GroupState; reseedMessage: SyncMessage } {
  // Build the reseed message with the compromised member removed
  const remainingMembers = group.members.filter(m => m !== compromisedPubkey)
  const remainingAdmins = group.admins.filter(a => a !== compromisedPubkey)

  // Generate a new seed (32 random bytes, hex-encoded)
  const newSeed = crypto.getRandomValues(new Uint8Array(32))

  const reseedMsg: SyncMessage = {
    type: 'reseed',
    seed: newSeed,
    counter: group.counter,
    timestamp: Math.floor(Date.now() / 1000),
    epoch: group.epoch + 1,  // I4: reseed epoch = local epoch + 1
    opId: crypto.randomUUID(),
    admins: remainingAdmins,
    members: remainingMembers,
    protocolVersion: 2,
  }

  // Apply locally first
  const nowSec = Math.floor(Date.now() / 1000)
  const newState = applySyncMessage(group, reseedMsg, nowSec, adminPubkey)

  return { newState, reseedMessage: reseedMsg }
}
```

### Transport Layer Integration

The sync protocol is transport-agnostic. Implement the `SyncTransport` interface to plug in any delivery mechanism:

```typescript
import type { SyncTransport, SyncMessage } from 'canary-kit/sync'

// Example: Nostr relay transport
class NostrSyncTransport implements SyncTransport {
  async send(groupId: string, message: SyncMessage, recipients?: string[]): Promise<void> {
    // 1. Encode the message
    // 2. Encrypt with group key (AES-256-GCM)
    // 3. Publish as a Nostr event (kind 30078 for stored, kind 20078 for ephemeral)
  }

  subscribe(groupId: string, onMessage: (msg: SyncMessage, sender: string) => void): () => void {
    // 1. Subscribe to Nostr events for this group's hash tag
    // 2. Decrypt incoming events
    // 3. Decode and call onMessage
    // Return unsubscribe function
    return () => { /* cleanup */ }
  }

  disconnect(): void {
    // Close relay connections
  }
}

// Example: WebSocket transport (for custom infrastructure)
class WebSocketSyncTransport implements SyncTransport {
  // Same interface, different transport
  // Messages still use the same envelope encryption
}

// Example: Signal/SMS transport (for bootstrapping)
class ManualSyncTransport implements SyncTransport {
  // For manual seed distribution via QR code or secure messaging
  // Only used for initial group setup, not ongoing sync
}
```

### Node Recovery After Extended Offline Period

When a node comes back online after missing multiple sync messages:

```typescript
import { syncCounter, type GroupState } from 'canary-kit'
import { applySyncMessage, decodeSyncMessage } from 'canary-kit/sync'

/**
 * Recover state after being offline. Fetch and apply all missed messages.
 * The invariants handle out-of-order application automatically.
 */
async function recoverAfterOffline(
  persistedState: GroupState,
  missedMessages: Array<{ payload: string; sender: string }>,
): Promise<GroupState> {
  // 1. Refresh the time-based counter (monotonic -- never regresses)
  let state = syncCounter(persistedState)

  // 2. Apply each missed message in order
  // Even if order is wrong, invariants ensure correctness
  const nowSec = Math.floor(Date.now() / 1000)
  for (const { payload, sender } of missedMessages) {
    try {
      const msg = decodeSyncMessage(payload)
      state = applySyncMessage(state, msg, nowSec, sender)
    } catch {
      // Skip invalid messages (wrong protocol version, etc.)
      continue
    }
  }

  // 3. If the node missed a reseed, it cannot decrypt new-epoch messages.
  // The node must be re-invited by an admin (state-snapshot or new group invite).
  // This is by design: ensures forward secrecy after member removal.

  return state
}
```

### Deployment Checklist

- [ ] **Persist state after every successful `applySyncMessage`.** The in-memory state must match what's on disk to survive crashes.
- [ ] **Use `applySyncMessageWithResult()` for observability.** Unlike `applySyncMessage` which silently returns unchanged state on rejection, `applySyncMessageWithResult` returns `{ state, applied }` so you can log rejected messages.
- [ ] **Handle decryption failures gracefully.** After a reseed, old-epoch messages will fail to decrypt. This is expected, not an error.
- [ ] **Set `creator` in `createGroup()`.** Without a creator, `admins` is empty and all privileged sync operations (member-join, reseed, member-leave of others) are silently rejected.
- [ ] **Always pass `sender` to `applySyncMessage`.** Privileged actions require a sender. Counter-advance requires sender to be a current group member. Omitting sender causes silent rejection.
- [ ] **Bound your message store.** `consumedOps` is capped at 1000 entries per epoch. For high-throughput groups, ensure your transport delivers within the eviction window.
- [ ] **Monitor clock drift.** Messages with timestamps more than 60 seconds in the future are rejected (`MAX_FUTURE_SKEW_SEC`). Fire-and-forget messages older than 5 minutes are dropped (`FIRE_AND_FORGET_FRESHNESS_SEC`).
