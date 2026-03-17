NIP-XX
======

Simple Shared Secret Groups
----------------------------

`draft` `optional`

## Abstract

This NIP defines a Nostr transport binding for the Simple Shared Secret Groups
protocol ([GROUPS.md](GROUPS.md)). It maps group state, secret distribution, and
real-time signals onto existing Nostr event kinds — **no new event kinds are
required**.

The protocol enables groups of Nostr users to share a rotating symmetric secret
for application-specific purposes: verification tokens, encryption keys, access
codes, or any function that requires a shared secret with proper rotation and
member management.

## Motivation

Three previous proposals for encrypted group communication on Nostr (NIP-38,
NIP-76, NIP-112) remain unmerged. This NIP takes a deliberately simpler approach
using only existing event infrastructure:

- **Kind 30078** (NIP-78, application-specific data) for durable group state
- **NIP-17** (gift-wrapped private messages) for secret distribution
- **Kind 20078** (ephemeral application-specific data) for real-time signals

No new event kinds. No new relay requirements. Works on any NIP-01 compliant relay
today.

## Transport Mapping

The Simple Shared Secret Groups protocol defines three categories of messages.
Each maps to an existing Nostr transport:

| Category | Nostr transport | Event kind |
|----------|----------------|------------|
| **Durable group state** | NIP-78 (application-specific data) | Kind 30078 (addressable) |
| **Private point-to-point** | NIP-17 (gift-wrapped DMs) | Kind 1059 (gift wrap) |
| **Real-time group broadcast** | Ephemeral application-specific | Kind 20078 (ephemeral) |

### Why three transports

- **Kind 30078** is addressable (replaceable by `d` tag). Relays store the latest
  version. Suitable for group metadata that members query on connect.
- **NIP-17 gift wraps** provide metadata-hiding point-to-point delivery. Sender,
  recipient, timestamp, and inner event kind are all hidden from relays. Suitable
  for infrequent, private, latency-tolerant messages (seed distribution, reseed).
- **Kind 20078** is ephemeral. Relays broadcast to connected subscribers but do not
  store. Suitable for frequent, time-sensitive group signals (counter advance).

## Event Specifications

### Kind 30078: Group State

Published by the group admin. The `d` tag value uniquely identifies the group.
This is the canonical source of group membership and configuration.

```json
{
  "kind": 30078,
  "content": "<NIP-44 encrypted group config>",
  "tags": [
    ["d", "ssg/<group-identifier>"],
    ["p", "<member-1-pubkey>"],
    ["p", "<member-2-pubkey>"],
    ["p", "<member-3-pubkey>"],
    ["L", "ssg"],
    ["l", "group", "ssg"],
    ["rotation", "604800"],
    ["tolerance", "1"],
    ["expiration", "<unix timestamp>"]
  ]
}
```

| Tag | Required | Description |
|-----|----------|-------------|
| `d` | MUST | `ssg/<group-identifier>` — unique group address. The `ssg/` prefix enables filtering. |
| `p` | MUST | One tag per member. Members' Nostr public keys (64-char lowercase hex). |
| `L` | SHOULD | Label namespace `ssg` (NIP-32) for discovery. |
| `l` | SHOULD | Label `group` in namespace `ssg`. |
| `rotation` | SHOULD | Rotation interval in seconds (e.g. `"604800"` for 7 days). |
| `tolerance` | SHOULD | Counter tolerance window for verification (e.g. `"1"`). |
| `expiration` | MAY | NIP-40 expiration timestamp — group auto-dissolves after this time. |

The encrypted `content` is a NIP-44 encrypted JSON object containing private
group configuration. The encryption recipient is the group admin's own pubkey
(self-encrypted), or NIP-44 encrypted individually for each member via separate
gift-wrapped distribution.

```json
{
  "description": "Family safety group",
  "policies": {
    "invite_by": "admin",
    "reseed_by": "admin"
  }
}
```

Applications MAY add additional tags for application-specific metadata. Unknown
tags MUST be ignored by implementations.

### NIP-17 Gift Wrap: Private Messages

Secret distribution, reseed notifications, and member updates are delivered as
NIP-17 gift-wrapped private messages. Each recipient receives their own gift wrap.

The inner rumour (unsigned event inside the seal) uses kind 14 with a `subject`
tag to identify the message type:

```json
{
  "kind": 14,
  "content": "<NIP-44 encrypted payload>",
  "tags": [
    ["p", "<recipient-pubkey>"],
    ["subject", "ssg:seed-distribution"],
    ["e", "<group-30078-event-id>"]
  ]
}
```

#### Subject types

| Subject tag | Purpose | Payload |
|-------------|---------|---------|
| `ssg:seed-distribution` | Deliver group seed to a member | `{ "seed": "<hex>", "counter": 42, "group_d": "<d-tag>" }` |
| `ssg:reseed` | New seed after member removal or compromise | `{ "seed": "<hex>", "counter": 42, "epoch": 2, "reason": "member_removed" }` |
| `ssg:member-update` | Notification of membership change | `{ "action": "add" \| "remove", "pubkey": "<hex>", "reseed": true }` |
| `ssg:state-snapshot` | Full state for new member or recovery | See GROUPS.md `state-snapshot` message format |

Reseed reasons: `member_removed`, `compromise`, `scheduled`, `duress`.

#### Why NIP-17

NIP-17 gift wraps hide sender, recipient, timestamp, and inner event kind from
relays. This is essential for seed distribution — a relay that sees who receives
seeds can infer group membership even if the seed itself is encrypted.

NIP-17 timestamps are jittered (up to 2 days for privacy). This is acceptable
because these messages are infrequent and not time-critical.

### Kind 20078: Real-Time Group Signals

Counter advances, and application-specific ephemeral signals (beacons, liveness)
are broadcast as ephemeral events. All connected group members receive them
instantly; offline members do not.

```json
{
  "kind": 20078,
  "content": "<AES-256-GCM encrypted payload>",
  "tags": [
    ["d", "ssg/<hashed-group-id>"],
    ["t", "<signal-type>"]
  ]
}
```

| Tag | Required | Description |
|-----|----------|-------------|
| `d` | MUST | `ssg/<SHA-256(group_id)>` — hashed to hide group identity from relays. |
| `t` | MUST | Signal type for client-side routing. |

#### Group ID hashing

The `d` tag uses `SHA-256(utf8(group_id))` (64-char lowercase hex) so relays can
filter subscriptions without learning the group identifier.

#### Encryption

Kind 20078 content is AES-256-GCM encrypted with a group-derived symmetric key
(see GROUPS.md §Envelope Encryption). This is NOT NIP-44 — NIP-44 is point-to-point
ECDH encryption, while group signals use a shared symmetric key for broadcast
efficiency. One encryption, all members decrypt.

Envelope format: `base64(iv[12] || ciphertext || auth_tag[16])`.

#### Signal types

| `t` tag | Purpose | Encrypted payload |
|---------|---------|-------------------|
| `counter-advance` | Token burned, advance counter | `{ "counter": 42, "usageOffset": 3, "timestamp": 1709510400 }` |

Applications MAY define additional signal types. The CANARY protocol defines
`beacon`, `duress-alert`, `duress-clear`, and `liveness-checkin`. Unknown signal
types MUST be silently ignored.

#### Counter advance validation

Per GROUPS.md §Counter Advancement:
- New effective counter MUST be greater than local effective counter.
- `usageOffset` MUST NOT exceed 100.
- The event MUST be signed by a pubkey listed in the group's `p` tags (kind 30078).

## Group Lifecycle Over Nostr

### Creation

1. Admin generates a group seed and initial state (GROUPS.md §Group Creation).
2. Admin publishes a kind 30078 event with all initial members' `p` tags.
3. Admin sends a `ssg:seed-distribution` gift wrap to each member.

### Active use

Members independently derive tokens from the shared seed and counter. No network
required for derivation. When a token is used:

1. The member publishes a kind 20078 `counter-advance` signal.
2. All connected members advance their counter.

### Member addition

1. Admin publishes an updated kind 30078 event with the new member's `p` tag.
2. Admin sends a `ssg:seed-distribution` gift wrap to the new member.
3. Admin sends a `ssg:member-update` gift wrap to existing members.

### Member removal

1. Admin publishes an updated kind 30078 event without the removed member's `p` tag.
2. Admin generates a new seed (GROUPS.md §Member Removal and Reseed).
3. Admin sends a `ssg:reseed` gift wrap to all remaining members.
4. Admin sends a `ssg:member-update` gift wrap to remaining members.

### Dissolution

Admin deletes the kind 30078 event (NIP-09) or lets the NIP-40 expiration pass.
Members wipe local state on receiving the deletion or reaching expiration.

## Relay Compatibility

This NIP has been tested against major Nostr relays (March 2026):

| Relay | Kind 30078 | Kind 20078 | NIP-17 |
|-------|-----------|-----------|--------|
| relay.damus.io | Yes | Yes | Yes |
| nos.lol | Yes | Yes | Yes |
| relay.primal.net | Yes | Yes | Yes |

Kind 30078 is NIP-78 — any NIP-01 compliant relay stores addressable events.
Kind 20078 falls in the NIP-01 ephemeral range (20000-29999) — relays broadcast
but do not store. NIP-17 requires NIP-44 and NIP-59 support.

## Discovery

Clients can discover SSG-enabled groups using:

- **NIP-32 labels**: Query for events with `["L", "ssg"]` label namespace.
- **`d` tag prefix**: Filter kind 30078 events with `d` tag starting with `ssg/`.
- **NIP-89 handlers**: Applications register as handlers for kind 30078 events
  with `ssg/` prefix.

## Dependencies

| NIP | Usage |
|-----|-------|
| NIP-01 | Event structure, kind ranges, relay protocol |
| NIP-17 | Gift-wrapped private messages for secret distribution |
| NIP-32 | Labels for group discovery |
| NIP-40 | Expiration tags for group auto-dissolution |
| NIP-44 | Encryption for kind 30078 content and NIP-17 payloads |
| NIP-59 | Gift wrap (seal + wrap) for metadata hiding |
| NIP-78 | Application-specific data (kind 30078) |
| NIP-89 | Recommended application handlers (discovery) |

## Security Considerations

### Metadata leakage

Kind 30078 events expose member pubkeys in `p` tags. This is necessary for relay
filtering (members subscribe to events that tag them) but reveals group membership
to relay operators. Applications that require membership privacy should use
pseudonymous pubkeys or consider NIP-59 gift wrapping for the group event itself.

### Ephemeral signal reliability

Kind 20078 events are ephemeral — relays do not store them. Members who are
offline when a `counter-advance` signal is published will miss it. They
resynchronise at the next natural time-based counter rotation. Applications
SHOULD NOT rely on ephemeral signals for critical state transitions.

### Gift wrap overhead

NIP-17 produces one gift-wrapped event per recipient. For a group of N members,
a reseed generates N events. This is acceptable for infrequent operations
(membership changes, reseeds) but would be prohibitive for high-frequency signals
— hence the split transport architecture.

### Kind 20078 status

Kind 20078 is not formally registered as a NIP but falls within NIP-01's ephemeral
range (20000-29999). Relay support is confirmed empirically (see Relay
Compatibility). If relay support proves unreliable at scale, the fallback is
NIP-17 gift wraps for all messages, accepting the per-member overhead.

## Reference Implementation

The canonical implementation is the `canary-kit` npm package:

- Nostr event builders: `src/nostr.ts`
- Group management: `src/group.ts`
- Sync protocol: `src/sync.ts`

Source: https://github.com/TheCryptoDonkey/canary-kit

## Relationship to Other Specifications

| Specification | Relationship |
|---|---|
| Simple Shared Secret Groups (GROUPS.md) | Transport-agnostic protocol this NIP implements |
| Spoken Token Protocol (spoken-token PROTOCOL.md) | Token derivation used by groups for verification |
| CANARY Protocol (CANARY.md) | Extension adding duress, liveness, beacons |
| NIP-CANARY | Application profile of this NIP for CANARY groups |
