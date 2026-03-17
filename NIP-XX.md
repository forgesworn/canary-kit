NIP-XX
======

Shared Secret Groups
--------------------

`draft` `optional`

## Abstract

A convention for lightweight encrypted groups using existing Nostr event kinds.
Members share a 256-bit seed from which they derive a symmetric encryption key.
Group state is stored in kind 30078 (NIP-78) events, real-time signals use kind
20078 ephemeral events, and seeds are distributed via NIP-17 direct messages.

No new event kinds are introduced.

## Motivation

Several applications need a group of participants who share encrypted state:

- **Rotating verification codes** — members derive the same spoken word from the
  shared seed on a schedule, enabling mutual authentication over voice calls
- **Encrypted coordination** — a dispatch system where drivers share encrypted
  status updates visible to all group members
- **IoT device fleets** — devices publish encrypted telemetry that any authorised
  device in the group can decrypt
- **Shared encrypted state** — collaborative applications where all participants
  need access to the same encrypted data store

NIP-17 gift wraps serve well for private conversations, but each message must be
individually wrapped for every recipient — O(N) per message. MLS-based protocols
provide forward secrecy but require complex ratchet-tree state management.

Shared Secret Groups fill the gap: a single shared seed, O(1) encryption per
event, and zero new event kinds. This deliberately trades forward secrecy for
simplicity — the right trade-off when the goal is shared state derivation rather
than confidential messaging.

## Specification

### Group seed

A group is defined by a 256-bit cryptographically random seed, encoded as a
64-character lowercase hex string. The seed MUST be generated using a CSPRNG
(`crypto.getRandomValues` or equivalent).

### Key derivation

The symmetric group key used for encryption is derived from the seed:

```
group_key = HMAC-SHA256(key = seed_bytes, data = utf8("ssg:key"))
```

Where `seed_bytes` is the 32-byte binary representation of the hex-encoded seed.
The result is a 32-byte AES-256 key.

Applications that need additional derived keys SHOULD use distinct HMAC info
strings with their own namespace (e.g., `"myapp:telemetry:key"`). The `ssg:key`
derivation is reserved for the standard group encryption key defined in this NIP.

### Encryption

All group-encrypted content uses AES-256-GCM with a random 12-byte IV:

```
ciphertext = base64( IV[12] || AES-GCM-ciphertext || auth_tag[16] )
```

- The group key MUST be exactly 32 bytes. Implementations MUST reject shorter
  keys to prevent silent AES-128 downgrade.
- The IV MUST be generated using a CSPRNG for each encryption operation. Reusing
  an IV with the same key is catastrophic in GCM mode.
- Encrypted content SHOULD NOT exceed 65,536 bytes to stay within typical relay
  event size limits.

### Group state event (kind 30078)

Group configuration is stored as a kind 30078 (NIP-78) addressable event:

```json
{
  "kind": 30078,
  "content": "<AES-256-GCM encrypted>",
  "tags": [
    ["d", "ssg/<group-id>"],
    ["p", "<member-1-pubkey>"],
    ["p", "<member-2-pubkey>"],
    ["L", "ssg"],
    ["l", "group", "ssg"]
  ]
}
```

| Tag | Required | Description |
|-----|----------|-------------|
| `d` | MUST | `ssg/<group-id>` — unique group address. |
| `p` | MUST | One tag per member (64-char lowercase hex pubkey). |
| `L` | SHOULD | Label namespace `ssg` (NIP-32). |
| `l` | SHOULD | Label `group` in namespace `ssg` (NIP-32). |

The `ssg/` d-tag prefix is defined by this NIP. Applications using Shared Secret
Groups MUST use this prefix to avoid collisions with other NIP-78 consumers.

The encrypted `content` carries application-specific group configuration as JSON.
This NIP does not prescribe the content schema — applications define their own.
Any member with the group seed can derive the key and decrypt the content.

Applications MAY add additional tags. Unknown tags MUST be ignored.

### Ephemeral signal event (kind 20078)

Real-time signals between group members use kind 20078 ephemeral events. This
NIP registers kind 20078 as the ephemeral counterpart to kind 30078 (NIP-78),
following the established kind-range pattern (20000–29999 for ephemeral events).

```json
{
  "kind": 20078,
  "content": "<AES-256-GCM encrypted>",
  "tags": [
    ["d", "ssg/<SHA-256(group-id)>"]
  ]
}
```

| Tag | Required | Description |
|-----|----------|-------------|
| `d` | MUST | `ssg/` followed by `SHA-256(utf8(group_id))` as 64-char lowercase hex. |

The `d` tag uses a SHA-256 hash of the group ID rather than the plaintext. This
prevents relay operators from correlating high-frequency ephemeral signals to a
named group. Kind 30078 uses the plaintext group ID because member pubkeys are
already visible in `p` tags.

Signal types and encrypted payload schemas are application-defined. This NIP does
not prescribe specific signal types. Applications MAY add a `t` tag for
client-side signal routing. Unknown signal types MUST be silently ignored.

### Seed distribution

Seeds are distributed to members using NIP-17 gift-wrapped direct messages:

1. The admin creates a kind 14 rumour containing the seed and group identifier.
2. The rumour is NIP-44 encrypted and NIP-59 gift-wrapped for each recipient.
3. Each recipient receives their own individually-wrapped copy.

The rumour uses a `subject` tag to identify the message type:

```json
{
  "kind": 14,
  "content": "<NIP-44 encrypted payload>",
  "tags": [
    ["p", "<recipient-pubkey>"],
    ["subject", "ssg:seed"]
  ]
}
```

The encrypted content carries the group seed and any application-specific
parameters. This NIP does not prescribe the encrypted payload schema — only the
`subject` tag is standardised for client-side routing.

NIP-17 is used for seed distribution because it hides sender, recipient,
timestamp, and inner event kind from relays. A relay that can see who receives
seeds can infer group membership even when the seed itself is encrypted.

### Member removal and reseed

When a member is removed, the group MUST generate a new seed and distribute it
to all remaining members via NIP-17 with subject `ssg:reseed`. The old seed MUST
be discarded. This ensures the removed member cannot derive future group keys.

## Security Considerations

### No forward secrecy

A compromised seed exposes all past content encrypted under that seed. This is a
deliberate trade-off: SSG prioritises simplicity and shared-state derivation over
message confidentiality. Groups that require forward secrecy should use MLS-based
protocols instead. The reseed mechanism provides forward secrecy at the
membership-change boundary — after a reseed, the old seed cannot decrypt new
content.

### Trust model

All members with the seed can read and write group events. SSG is appropriate for
groups where members trust each other. For admin-gated access control, the
application layer should enforce authority — this NIP does not prescribe an
authority model.

### Metadata

Member pubkeys are visible in kind 30078 `p` tags. This is the cost of
relay-side filtering — members subscribe to events that tag them. Applications
that need membership privacy should not use SSG, or should use purpose-specific
keypairs that are not linked to the user's primary identity. Kind 20078 events
use hashed `d` tags to reduce correlation of ephemeral signals to known groups.

### Ephemeral signal reliability

Kind 20078 events are ephemeral — relays do not store them. Members who are
offline will miss ephemeral signals. Applications SHOULD NOT rely on ephemeral
signals for critical state transitions. Use NIP-17 gift wraps for messages that
must reach offline members.

### Seed storage

Seeds MUST be stored securely on the client. Applications SHOULD encrypt seeds at
rest and zero seed material from memory when no longer needed.

## Dependencies

| NIP | Usage |
|-----|-------|
| NIP-01 | Event structure, kind ranges |
| NIP-17 | Gift-wrapped messages for seed distribution |
| NIP-32 | Labels for group discovery |
| NIP-44 | Encryption within NIP-17 payloads |
| NIP-59 | Gift wrap for metadata hiding |
| NIP-78 | Application-specific data (kind 30078) |
