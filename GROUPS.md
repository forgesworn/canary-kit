Simple Shared Secret Groups
============================

Transport-agnostic protocol for groups that share a rotating symmetric secret.

`v1.0` `draft`

## Abstract

This document specifies a protocol for managing groups of participants who share a
symmetric secret. The secret is used to derive application-specific keys (verification
tokens, encryption keys, access codes). When membership changes, the secret rotates
to exclude removed members. The protocol is transport-agnostic — it defines state
transitions and message formats, not how messages are delivered.

## Motivation

Encrypted group communication on Nostr has been attempted three times:

- **NIP-38**: Single shared secret per channel. No rotation, no member removal.
- **NIP-76**: BIP-32 key derivation for group management. Too complex.
- **NIP-112**: Shared secrets with key invalidation. Partial forward secrecy attempt.

None were merged. The community survey (hodlbod) concluded: "naive shared secrets fail
to provide forward secrecy; no proposed solution fully solves forward secrecy without
relay cooperation."

This protocol takes a deliberately simpler approach: **shared symmetric secrets with
rotation on membership changes**. It does not attempt forward secrecy. This is sufficient
for a wide range of use cases that do not require it: identity verification, access
control, team coordination, and short-lived groups.

The protocol is transport-agnostic. It can run over Nostr relays, Meshtastic mesh
radio, Signal/WhatsApp messages, QR codes, or any channel that can deliver JSON
messages between group members.

## Specification

### Group State

A group is defined by its persistent state:

```
GroupState {
  name:             string          // Human-readable group name
  seed:             bytes[32]       // 256-bit shared secret (hex-encoded in serialisation)
  members:          string[]        // Ordered list of member identities
  admins:           string[]        // Subset of members with admin privileges
  rotationInterval: integer         // Seconds between automatic counter rotation
  counter:          integer         // Time-based counter at creation
  usageOffset:      integer         // Burn-after-use offset on top of counter
  tolerance:        integer         // Verification tolerance window (0–10)
  epoch:            integer         // Monotonic, increments on reseed
  consumedOps:      string[]        // Operation IDs consumed in current epoch
  consumedOpsFloor: integer?        // Timestamp floor for replay protection
  createdAt:        integer         // Unix timestamp of creation
}
```

Applications MAY extend GroupState with additional fields (e.g. `wordCount`,
`wordlist`, `beaconInterval`). Extension fields MUST be preserved through all
state-mutating operations. This spec defines only the core fields above.

Member identities are opaque strings. Nostr implementations use 64-character hex
public keys. Other transports may use phone numbers, email addresses, or any
unique identifier.

### Effective Counter

The effective counter combines the time-based counter with the usage offset:

```
effective_counter = counter + usageOffset
```

Where `counter = floor(current_unix_timestamp / rotationInterval)`.

The usage offset starts at 0 and increments each time a token is "burned" (used
for verification). This ensures that the same token is never valid twice within a
single time window.

The usage offset MUST NOT exceed 100 (`MAX_COUNTER_OFFSET`). Implementations MUST
reject counter advances that would push the effective counter beyond
`time_based_counter + MAX_COUNTER_OFFSET`.

### Group Creation

1. Generate a cryptographically random 256-bit (32-byte) seed.
2. Set `counter` to `floor(current_unix_timestamp / rotationInterval)`.
3. Set `usageOffset` to 0, `epoch` to 0, `consumedOps` to empty.
4. Distribute the seed to all initial members via a secure channel.

The creator is the initial admin. Only admins can add/remove members and trigger
reseeds.

### Member Addition

1. Admin adds the new member's identity to the `members` list.
2. Admin distributes the current seed and state to the new member.
3. A reseed is NOT required for addition — the new member receives the current seed.

### Member Removal and Reseed

When a member is removed, the group MUST reseed to prevent the removed member from
deriving future tokens:

1. Admin removes the member's identity from the `members` list.
2. Admin generates a new 256-bit random seed and replaces the old seed locally.
3. Admin resets `usageOffset` to 0.
4. Admin broadcasts a `reseed` sync message to all remaining members.
5. When members receive and apply the `reseed` message, they increment `epoch`,
   clear `consumedOps`, and reset `consumedOpsFloor`.

**Note:** The local `reseed` operation (steps 2-3) replaces the seed and resets
the offset. The epoch increment and replay-state reset happen when the `reseed`
sync message is applied — this split ensures epoch advances are synchronised
across all members via the sync protocol, not managed independently.

The removed member retains the old seed and can derive tokens for the old epoch.
This is an accepted limitation — the protocol does not provide forward secrecy.
Applications that require immediate revocation should use a complementary mechanism
(e.g. an access control list checked at verification time).

### Manual Reseed

An admin MAY trigger a reseed at any time (e.g. suspected compromise, scheduled
rotation). The procedure is the same as removal-triggered reseed, without removing
any member.

Reseed reasons:
- `member_removed` — triggered by member removal
- `compromise` — suspected secret compromise
- `scheduled` — routine rotation policy
- `duress` — application-specific (e.g. CANARY duress detection)

### Group Dissolution

An admin MAY dissolve a group:

1. Zero the seed in memory (overwrite with null bytes, best-effort).
2. Clear the members and admins lists.
3. Delete the persisted group state.

There is no dissolution sync message — dissolution is a local operation. Members
who have not been notified out-of-band will retain their copy of the group state
until they independently dissolve or the state expires.

### Admin Management

The admin set is established at creation and can only be changed via a `reseed`
message, which carries a replacement `admins` array. There is no dedicated
promote/demote operation. To change admins, trigger a reseed with the desired
admin list.

### Counter Advancement (Burn-After-Use)

When a token is used for verification:

1. Increment `usageOffset` by 1.
2. Broadcast a counter-advance message to all members.
3. Members who receive the message advance their own `usageOffset` to
   `max(local_usageOffset, received_usageOffset)`.

Members who miss the message will resynchronise at the next natural time-based
counter rotation (when `usageOffset` resets to 0 because the time-based counter
has advanced).

### Counter Synchronisation

When loading persisted state after a period of inactivity:

```
current_time_counter = floor(current_unix_timestamp / rotationInterval)

if current_time_counter > state.counter:
    state.counter = current_time_counter
    state.usageOffset = 0
```

This ensures the group counter never moves backwards.

### Application-Specific Key Derivation

Applications derive purpose-specific keys from the group seed:

```
app_key = HMAC-SHA256(seed, utf8(context_string))
```

Context strings MUST be unique per application and purpose. Examples:

| Context | Purpose |
|---------|---------|
| `"myapp:encryption:key"` | Symmetric encryption key for group messages |
| `"myapp:signing:key"` | Group signing identity |
| `"canary:group"` | CANARY verification token derivation |
| `"canary:beacon:key"` | CANARY encrypted location beacons |
| `"canary:sync:key"` | CANARY sync envelope encryption |

### Token Derivation

Groups that use this protocol for verification tokens derive them using the
Spoken Token Protocol (see `spoken-token` PROTOCOL.md):

```
token = SPOKEN-DERIVE(seed, context, effective_counter, identity?)
```

Where `identity` is optionally the member's identity string for per-member tokens.

## Sync Protocol

The sync protocol defines typed JSON messages for propagating state changes between
group members. It is transport-agnostic — messages can be carried over any channel.

### Protocol Version

Current version: **2**. Implementations MUST reject messages with a different
`protocolVersion` value.

### Message Types

#### counter-advance

Signals that a token has been used and the counter should advance.

```json
{
  "type": "counter-advance",
  "counter": 42,
  "usageOffset": 3,
  "timestamp": 1709510400,
  "protocolVersion": 2
}
```

**Note:** `counter-advance` does not carry `opId` or `epoch` fields. Replay
protection relies on the monotonic effective-counter check (new counter must
exceed current) and envelope encryption (the AES-GCM key rotates on reseed).
This is a deliberate trade-off: counter-advance is the highest-frequency message
and omitting `opId` reduces overhead.

Validation:
- `counter` MUST be non-negative.
- `usageOffset` MUST be non-negative and not exceed `MAX_COUNTER_OFFSET` (100).
- New effective counter MUST be greater than current effective counter.

#### member-join

Signals that a new member has been added to the group.

```json
{
  "type": "member-join",
  "pubkey": "<member identity>",
  "displayName": "Alice",
  "timestamp": 1709510400,
  "epoch": 1,
  "opId": "<unique operation ID>",
  "protocolVersion": 2
}
```

#### member-leave

Signals that a member has been removed from the group.

```json
{
  "type": "member-leave",
  "pubkey": "<member identity>",
  "timestamp": 1709510400,
  "epoch": 1,
  "opId": "<unique operation ID>",
  "protocolVersion": 2
}
```

#### reseed

Signals a new seed has been distributed. The seed field contains the new secret.

On application, `usageOffset` is reset to 0.

```json
{
  "type": "reseed",
  "seed": "<64-char hex-encoded seed>",
  "counter": 42,
  "timestamp": 1709510400,
  "epoch": 2,
  "opId": "<unique operation ID>",
  "admins": ["<admin1>", "<admin2>"],
  "members": ["<member1>", "<member2>", "<member3>"],
  "protocolVersion": 2
}
```

**WARNING:** The `seed` field contains the group secret in plaintext. This message
MUST be transmitted inside an encrypted envelope. Implementations MUST NOT log
reseed messages.

#### state-snapshot

Full state synchronisation for new members or recovery.

```json
{
  "type": "state-snapshot",
  "seed": "<hex-encoded seed>",
  "counter": 42,
  "usageOffset": 0,
  "members": ["<member1>", "<member2>"],
  "admins": ["<admin1>"],
  "epoch": 2,
  "opId": "<unique operation ID>",
  "timestamp": 1709510400,
  "protocolVersion": 2
}
```

**WARNING:** Contains plaintext seed. Same encryption requirements as reseed.

Implementations MUST reject `state-snapshot` messages with an `epoch` higher
than the local epoch. Members who miss a reseed cannot catch up via snapshot —
they must be re-invited with the current seed. This prevents an attacker from
injecting a fabricated higher-epoch snapshot to replace the group state.

### Replay Protection

State-mutating messages (except `counter-advance`) carry an `opId` (unique
operation identifier) and an `epoch`. The `opId` MUST be cryptographically random
and globally unique — a UUID v4 or 32-byte random hex string is recommended.

Implementations MUST:

1. Reject messages with an `opId` already in `consumedOps`.
2. Reject messages with an `epoch` less than the current group epoch.
3. After processing, append the `opId` to `consumedOps`.
4. When `consumedOps` exceeds 1000 entries, keep the most recent 1000 and set
   `consumedOpsFloor` to `max(currentFloor, timestamp_of_new_entry)`.
5. After eviction, reject messages with `timestamp <= consumedOpsFloor`.

On epoch change (reseed), `consumedOps` is cleared and `consumedOpsFloor` is reset.

### Message Delivery Categories

| Category | Messages | Delivery requirement |
|----------|----------|---------------------|
| **Stored** | member-join, member-leave, counter-advance, reseed, state-snapshot | MUST be delivered to offline members |
| **Ephemeral** | application-specific (beacons, liveness, etc.) | MAY be dropped if recipient is offline |

Transports MUST ensure stored messages reach all members eventually. Ephemeral
messages are best-effort.

Applications MAY define additional message types beyond those specified here.
For example, the CANARY protocol defines `beacon`, `duress-alert`, `duress-clear`,
and `liveness-checkin` as application-specific ephemeral messages. Custom message
types MUST include `protocolVersion` and SHOULD follow the same validation patterns.
Implementations MUST silently ignore message types they do not recognise.

### Envelope Encryption

Sync messages that contain secrets (reseed, state-snapshot) or are privacy-sensitive
MUST be encrypted before transmission. The encryption scheme is transport-specific:

- **Nostr**: NIP-44 for point-to-point, AES-256-GCM with a group-derived key for
  broadcast
- **Meshtastic**: Channel PSK
- **Signal/WhatsApp**: End-to-end encryption provided by the transport
- **QR code**: NIP-44 or application-specific encryption

The group-derived encryption key for broadcast:

```
group_key = HMAC-SHA256(seed, utf8("<app>:sync:key"))
```

Implementations MUST NOT reuse the group seed directly as an encryption key.

#### AES-256-GCM Envelope Format

When using group-key encryption for broadcast messages:

1. Generate a random 12-byte IV.
2. Encrypt the UTF-8 plaintext with `AES-256-GCM(key=group_key, iv=iv, plaintext)`.
3. The ciphertext includes the authentication tag (appended by the cipher).
4. Encode as `base64(iv || ciphertext || auth_tag)`.

Decryption: base64-decode, split the leading 12 bytes as IV, pass the remainder
to AES-256-GCM. Reject any payload where authentication fails.

Applications MAY derive a per-participant signing key for message authentication:

```
signing_key = HMAC-SHA256(seed, utf8("<app>:sync:sign:") || personal_private_key)
```

This binds each participant's signing identity to the group seed and their own key,
ensuring unique per-participant identities even across reseed events.

### Canonical Serialisation

For signing or hashing sync messages, implementations MUST use deterministic JSON
serialisation: keys sorted alphabetically, no whitespace, no trailing commas.

## Security Considerations

### No forward secrecy

This protocol does not provide forward secrecy. A compromised seed allows derivation
of all tokens for that epoch. Reseed limits the damage to the current epoch.

### Seed compromise

If the seed is compromised, the admin MUST trigger an immediate reseed with reason
`compromise`. All tokens derived from the old seed should be considered invalid.

### Member removal timing

Between member removal and seed distribution to remaining members, there is a window
where the removed member can still derive valid tokens. This window should be
minimised. Applications MAY maintain a revocation list checked at verification time
to close this gap.

### Replay protection limits

The `consumedOps` list has a maximum size (1000). Under sustained high-frequency
operations, oldest entries are evicted with a timestamp floor. An attacker who can
delay message delivery beyond the floor timestamp could replay an evicted operation.
Applications with high-frequency operations SHOULD use shorter epochs.

### Member count limits

Implementations SHOULD limit group size to 100 members. Larger groups degrade the
collision resistance of word-based verification tokens (2048-word space).

### Transport security

The sync protocol assumes an encrypted transport. Messages transmitted in plaintext
expose the group seed, member identities, and operational patterns. Implementations
MUST encrypt sync messages before transmission over any untrusted channel.

## Applications

This protocol is a foundation for application-specific group functionality:

| Application | What it derives from the group seed |
|---|---|
| **Spoken verification** (canary-kit) | Time-rotating words via Spoken Token Protocol |
| **Encrypted group chat** | Symmetric encryption key per epoch |
| **Access control** (Dominion) | Epoch-based content keys via HKDF |
| **Shared signing** | Group signing identity for coordinated actions |
| **Verified credentials** (Signet) | Verification words for identity proofs |

## Reference Implementation

The canonical implementation is the `canary-kit` npm package:

- Group management: `src/group.ts`
- Sync protocol: `src/sync.ts`
- Sync encryption: `src/sync-crypto.ts`

Source: https://github.com/forgesworn/canary-kit

## Relationship to Other Specifications

| Specification | Relationship |
|---|---|
| Spoken Token Protocol (`spoken-token` PROTOCOL.md) | Token derivation algorithm used by groups for verification |
| CANARY Protocol (`canary-kit` CANARY.md) | Extension adding duress detection, liveness, beacons |
| NIP-XX (planned) | Nostr transport binding for this protocol |
