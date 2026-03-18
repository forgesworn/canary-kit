NIP-CANARY
==========

Nostr Binding for the CANARY Spoken Verification Protocol
---------------------------------------------------------

`draft` `optional`

## Abstract

This NIP defines a Nostr application layer for the [CANARY protocol](CANARY.md),
providing group management, seed distribution, and counter synchronisation over
Nostr relays. The core protocol (CANARY-DERIVE, CANARY-DURESS, CANARY-WORDLIST)
is defined in the transport-agnostic [CANARY specification](CANARY.md).

## Protocol Layering

NIP-CANARY is an **application profile** of [NIP-XX: Simple Shared Secret Groups](NIP-XX.md).

The generic group transport (NIP-XX) defines how to manage shared-secret groups over
Nostr using existing event kinds:
- **Kind 30078** (NIP-78) for durable group state
- **NIP-17 gift wraps** for secret distribution
- **Kind 20078** (ephemeral) for real-time signals

NIP-CANARY extends NIP-XX with CANARY-specific features:
- **Duress signal semantics** in kind 20078 payloads (`duress-alert`, `duress-clear`)
- **Encrypted location beacons** in kind 20078 payloads
- **Liveness check-in signals** for dead man's switch
- **Meshtastic fallback transport** for offline/mesh operation

The six custom event kinds defined below (38800–20800) represent the **current
implementation**. A future version of this NIP will migrate to NIP-XX's transport
mapping (zero new kinds). The custom kinds are documented here for compatibility
with existing deployments.

> **Migration path:** New implementations SHOULD use NIP-XX transport (kind 30078,
> NIP-17, kind 20078) with the `ssg/` tag prefix and CANARY-specific signal types.
> Existing implementations using kinds 38800–20800 will continue to work — clients
> MAY support both during the transition period.

## Nostr Canary Groups

This section defines a Nostr application layer built on the CANARY protocol, providing
group management, seed distribution, and counter synchronisation over Nostr relays.

Nostr canary groups use a specific instantiation of the CANARY protocol with time-based
counters and Nostr public keys as member identities.

### Group Derivation Scheme

The Nostr group scheme is a specific instantiation of the universal CANARY protocol
(see [CANARY.md](CANARY.md)) with the following parameters:

| Parameter     | Value                                                              |
|---------------|--------------------------------------------------------------------|
| `secret`      | 32-byte group seed                                                 |
| `context`     | `"canary:group"`                                                   |
| `counter`     | `floor(unix_timestamp / rotation_interval)` plus any usage offset  |
| `identity`    | Member's Nostr public key (64-char lowercase hex)                  |
| `encoding`    | Word encoding from CANARY-WORDLIST (`uint16_be mod 2048`)          |

#### Verification Word

Derived using **CANARY-DERIVE** (see [CANARY.md §CANARY-DERIVE](CANARY.md)):

```
token_bytes = HMAC-SHA256(seed, utf8("canary:group") || counter_be32)
index       = uint16_be(token_bytes[0:2]) mod 2048
word        = wordlist[index]
```

Where `counter_be32` is a 4-byte big-endian unsigned integer.

#### Verification Phrase

For multi-word phrases (2 or 3 words), each word is derived from a consecutive 2-byte
slice of the same HMAC digest:

```
token_bytes = HMAC-SHA256(seed, utf8("canary:group") || counter_be32)
word_1      = wordlist[uint16_be(token_bytes[0:2]) mod 2048]
word_2      = wordlist[uint16_be(token_bytes[2:4]) mod 2048]
word_3      = wordlist[uint16_be(token_bytes[4:6]) mod 2048]
```

Different 2-byte slices MAY produce the same index; this is a valid output, not an error.

#### Duress Word

Derived using **CANARY-DURESS** (see [CANARY.md §CANARY-DURESS](CANARY.md)). Each
member has a distinct duress word. In finite wordlist spaces, two members may derive
the same duress word — this is handled by multi-match attribution. The member's Nostr
public key (64-char lowercase hex) is the identity parameter:

```
duress_bytes = HMAC-SHA256(seed, utf8("canary:group:duress") || 0x00 || utf8(member_pubkey) || counter_be32)
index        = uint16_be(duress_bytes[0:2]) mod 2048
word         = wordlist[index]
```

If the duress word collides with any verification word within the collision window
defined by CANARY-DURESS (±2 × maxTolerance counter values), the deterministic
multi-suffix retry algorithm applies (append suffix bytes 0x01..0xFF to the HMAC
data until distinct, error if exhausted). See [CANARY.md §Collision Avoidance](CANARY.md).

### Counter Derivation

```
counter = floor(unix_timestamp / rotation_interval) + usage_offset
```

The `usage_offset` is the number of times the word has been burned within the current
time window. It MUST be included in Word Used events (kind 28802) so all members can
advance in step.

### Verification Algorithm

When verifying a spoken response, implementations MUST follow the priority order
defined by CANARY-DURESS (see [CANARY.md §Verification Flow](CANARY.md)):

1. **Normal token at exact counter:** If the input matches the current verification
   word (or phrase) → identity confirmed.
2. **All duress tokens across ±tolerance window:** Derive the duress word (or phrase)
   for every member at every counter in the tolerance window. Collect all matches.
   Per CANARY-DURESS, the verifier MUST check all members and collect all matches
   (see [CANARY.md](CANARY.md)). If any matches → **DURESS DETECTED**. Act normally,
   broadcast silent duress event.
3. **Normal token at remaining tolerance window:** Check the verification word (or
   phrase) at non-exact counters within the tolerance window. If it matches →
   identity confirmed, member out of sync.
4. **No match** → verification failed.

This ordering ensures that a duress token at the expected counter is never masked
by a normal token at an adjacent counter (fail-safe).

### Burn-After-Use

When a word is used for verification:

1. The verifying member broadcasts a Word Used event (kind 28802) with the new counter.
2. All members advance their counter to `max(local_counter + 1, time_based_counter)`.
3. Members who miss the event resynchronise at the next natural time rotation.

## Event Kinds

This NIP defines six event kinds for Nostr transport. Kind numbers 38800–38801 are
replaceable events (NIP-16). Kind numbers 28800–28802 are ephemeral events (NIP-16).

```
Kind 38800  Canary Group              Replaceable
Kind 28800  Seed Distribution         Ephemeral
Kind 38801  Member Update             Replaceable
Kind 28801  Re-seed                   Ephemeral
Kind 28802  Word Used / Duress Alert  Ephemeral
Kind 20800  Encrypted Location Beacon Ephemeral
```

### Kind 38800: Canary Group

Published by the group creator. The `d` tag value is the group identifier throughout the
group's lifetime.

```json
{
  "kind": 38800,
  "content": "<NIP-44 encrypted group config>",
  "tags": [
    ["d", "<group-identifier>"],
    ["name", "<human-readable group name>"],
    ["p", "<member-1-pubkey>"],
    ["p", "<member-2-pubkey>"],
    ["p", "<member-3-pubkey>"],
    ["rotation", "604800"],
    ["words", "1"],
    ["wordlist", "en-v1"],
    ["expiration", "<unix timestamp>"]
  ]
}
```

| Tag          | Required | Description                                                        |
|--------------|----------|--------------------------------------------------------------------|
| `d`          | MUST     | Unique group identifier; replaceable event address                 |
| `name`       | SHOULD   | Human-readable group name (unencrypted — visible to relays)        |
| `p`          | MUST     | Member public keys, one tag per member                             |
| `rotation`   | MUST     | Rotation interval in seconds (e.g. `"604800"` for 7 days)         |
| `words`      | MUST     | Number of words per verification phrase: `"1"`, `"2"`, or `"3"`   |
| `wordlist`   | MUST     | Wordlist identifier (e.g. `"en-v1"`)                               |
| `expiration` | SHOULD   | NIP-40 expiration timestamp — group auto-dissolves after this time |

The encrypted `content` MUST be a NIP-44 encrypted JSON object:

```json
{
  "description": "<creator-defined group description>",
  "policies": {
    "invite_by": "creator",
    "reseed_by": "creator"
  }
}
```

### Kind 28800: Seed Distribution

Delivers the group seed to a specific member, encrypted with NIP-44.

```json
{
  "kind": 28800,
  "content": "<NIP-44 encrypted payload>",
  "tags": [
    ["p", "<recipient-pubkey>"],
    ["e", "<group-event-id>"]
  ]
}
```

Encrypted payload:

```json
{
  "seed": "<256-bit hex-encoded group seed>",
  "counter_offset": 0,
  "group_d": "<group d-tag value>"
}
```

The `counter_offset` allows re-seeding mid-window without waiting for the next natural
time rotation.

### Kind 38801: Member Update

Published by the group creator to record a membership change.

```json
{
  "kind": 38801,
  "content": "<NIP-44 encrypted reason>",
  "tags": [
    ["d", "<group-identifier>"],
    ["action", "add"],
    ["p", "<affected-member-pubkey>"],
    ["reseed", "false"]
  ]
}
```

- `action` MUST be `"add"` or `"remove"`.
- When `action` is `"remove"`, `reseed` SHOULD be `"true"`. The creator SHOULD distribute
  a new seed to all remaining members promptly. Implementations MAY defer reseeding for
  low-risk presets (e.g. `family`) when the removed member is trusted not to be
  adversarial, but MUST reseed if the removal is due to compromise or duress.
- When `action` is `"add"`, the creator distributes the current seed to the new member.

**Data model note:** Kind 38801 is a replaceable event keyed by group identifier. Only the
most recent member update per group is visible to relays. Clients MUST derive the canonical
member list from kind 38800's `p` tags, which are updated by the creator whenever membership
changes. Kind 38801 serves as a change notification (latest-wins by design), not as an
accumulative membership log.

### Kind 28801: Re-seed

Signals that a re-seed is in progress. Individual seed deliveries follow as kind 28800
events.

```json
{
  "kind": 28801,
  "content": "<NIP-44 encrypted reason>",
  "tags": [
    ["e", "<group-event-id>"],
    ["reason", "member_removed"]
  ]
}
```

The `reason` tag MUST be one of: `"member_removed"`, `"compromise"`, `"scheduled"`,
`"duress"`.

### Kind 28802: Word Used / Duress Alert

Signals that the current word was used for verification, or that a duress word was
detected. All members who receive this event MUST advance their local counter.

```json
{
  "kind": 28802,
  "content": "<NIP-44 encrypted payload>",
  "tags": [
    ["e", "<group-event-id>"]
  ]
}
```

Encrypted payload:

```json
{
  "new_counter": 12346,
  "used_by": "<pubkey of member who triggered the advancement>",
  "duress": false
}
```

When `duress` is `true`, clients MUST handle this silently — they MUST NOT display any
visible indication that could alert an attacker. Clients SHOULD initiate an automatic
re-seed (kind 28801) with `reason=duress`.

#### Counter Acceptance

Per the CANARY protocol counter acceptance rules (see [CANARY.md](CANARY.md)):

- Word Used events MUST be signed by a pubkey listed in the group's `p` tags
  (kind 38800). Clients MUST reject events from non-members.
- `new_counter` in the encrypted payload MUST be greater than the client's current
  counter. Clients MUST reject `new_counter <= local_counter` (replay protection).
- `new_counter` MUST NOT exceed `time_based_counter + 100`. Clients MUST reject
  larger jumps to bound counter drift from compromised senders.
- Clients MUST deduplicate events by event ID.
- `used_by` in the encrypted payload MUST equal the event signer's pubkey. Clients MUST
  reject events where `used_by` does not match the signer. If `used_by` is omitted,
  the signer is assumed to be the user who triggered the advancement.

### Kind 20800: Encrypted Location Beacon

Ephemeral event carrying AES-256-GCM encrypted location data. Used for periodic heartbeat
beacons and duress location alerts. Encrypted with a beacon key derived from the group seed
(not NIP-44).

```json
{
  "kind": 20800,
  "content": "<AES-256-GCM encrypted payload>",
  "tags": [
    ["h", "<group-identifier>"]
  ]
}
```

The `h` tag identifies the group. The encrypted payload varies by type:

**Normal beacon payload:**

```json
{
  "geohash": "<geohash string>",
  "precision": 6,
  "timestamp": 1709510400
}
```

**Duress alert payload:**

```json
{
  "type": "duress",
  "member": "<pubkey of member under duress>",
  "geohash": "<geohash string>",
  "precision": 11,
  "locationSource": "beacon",
  "timestamp": 1709510400
}
```

| Field            | Required | Description                                                    |
|------------------|----------|----------------------------------------------------------------|
| `type`           | MUST     | `"duress"` — distinguishes from normal beacons                |
| `member`         | MUST     | Pubkey of the member who is under duress                       |
| `geohash`        | MUST     | Location geohash (empty string if unavailable)                 |
| `precision`      | MUST     | Geohash precision (0 if unavailable, 11 for high-precision duress) |
| `locationSource` | MUST     | `"beacon"`, `"verifier"`, or `"none"`                         |
| `timestamp`      | MUST     | Unix timestamp of the alert                                    |

Duress alert beacons SHOULD use maximum geohash precision (11) to aid emergency response.
The `locationSource` indicates where the location came from: the member's own beacon, the
verifier's location, or unavailable.

Beacon key derivation: `HMAC-SHA256(key=seed, data=utf8("canary:beacon:key"))`.

### Sync Envelope Encryption

Sync messages are protected by a symmetric envelope layer derived from the group seed.
This is distinct from the beacon key and from NIP-44: NIP-44 encrypts Nostr event
`content` fields point-to-point between two Nostr keys; envelope encryption wraps sync
messages group-wide and is transport-agnostic.

#### Group Key Derivation

The symmetric key for envelope encryption is derived as:

```
group_key = HMAC-SHA256(key=hex_to_bytes(seed), data=utf8("canary:sync:key"))
```

Implementations MUST use this derivation and MUST NOT reuse the beacon key
(`"canary:beacon:key"`) for sync envelopes.

#### Group Signing Key

Each participant derives a per-group signing identity by binding the group seed to their
personal private key:

```
group_signing_key = HMAC-SHA256(key=hex_to_bytes(seed), data=utf8("canary:sync:sign:") || hex_to_bytes(personal_privkey))
```

Binding the personal private key ensures that each participant's signing identity within
the group is unique, even across reseed events. Implementations MUST use the participant's
32-byte private key (64-character lowercase hex) as the binding material.

#### Group Tag Hashing

To address a group on a relay without revealing the group identifier, implementations
derive a public tag by hashing the group identifier:

```
group_tag = hex(SHA-256(utf8(group_id)))
```

The resulting 64-character lowercase hex string MAY be published in relay filter tags.
Observers can query for group events without learning the group identifier from which the
tag was derived.

#### Envelope Format

Sync payloads MUST be encrypted using AES-256-GCM:

1. Generate a random 12-byte IV.
2. Encrypt the UTF-8 plaintext with `AES-256-GCM(key=group_key, iv=iv, plaintext)`.
3. The Web Crypto API returns `ciphertext || auth_tag` concatenated.
4. Encode as `base64(iv || ciphertext || auth_tag)`.

Decryption reverses this: base64-decode, split the leading 12 bytes as IV, pass the
remainder to AES-256-GCM. Implementations MUST reject any payload where authentication
fails.

#### Relationship to NIP-44

| Layer              | Algorithm    | Scope                              | Key source            |
|--------------------|--------------|------------------------------------|-----------------------|
| Nostr event content | NIP-44      | Point-to-point between Nostr keys  | Recipient's pubkey    |
| Sync envelope       | AES-256-GCM | Group-wide; transport-agnostic     | `canary:sync:key` derivation |
| Location beacon     | AES-256-GCM | Group-wide; ephemeral relay events | `canary:beacon:key` derivation |

NIP-44 MUST be used for all Nostr event `content` fields (kinds 38800, 28800, 38801,
28801, 28802). Envelope encryption MUST be used for sync-layer payloads that are not
carried directly in a Nostr event `content` field.

## Group Lifecycle

### Creation

1. Creator generates a cryptographically random 256-bit group seed.
2. Creator publishes a Canary Group event (kind 38800) naming all initial members.
3. Creator publishes Seed Distribution events (kind 28800) to each member, encrypted
   with NIP-44.

### Active Use

Members independently derive the current verification word from the shared seed and
counter. No network is required for derivation. When a word is used:

1. The verifying member broadcasts a Word Used event (kind 28802).
2. All members advance their counter.

### Member Removal

1. Creator publishes an updated Canary Group event (kind 38800) with the removed member's
   `p` tag deleted. This is the canonical membership update — all clients derive the
   member list from 38800's `p` tags.
2. Creator publishes a Member Update event (kind 38801) with `action=remove`.
3. Creator generates a new group seed.
4. Creator publishes a Re-seed event (kind 28801) with `reason=member_removed`.
5. Creator distributes the new seed to all remaining members (kind 28800).

### Member Addition

1. Creator publishes an updated Canary Group event (kind 38800) with the new member's
   `p` tag added.
2. Creator publishes a Member Update event (kind 38801) with `action=add`.
3. Creator distributes the current seed to the new member (kind 28800). A re-seed is
   NOT required.

### Duress Detection

1. Verifier detects a duress word (see Verification Algorithm).
2. Verifier broadcasts a Word Used event (kind 28802) with `duress=true`.
3. Clients handle silently. The verifier acts normally to avoid alerting the attacker.
4. Creator initiates a re-seed (kind 28801) with `reason=duress`, excluding the
   compromised member.

### Dissolution

A group is dissolved when the creator removes all members, or when the NIP-40
`expiration` timestamp is reached. Clients MUST wipe the group seed from local storage
upon dissolution.

### Implementation Note

The lifecycle above describes the protocol-level event flow. In the reference
implementation (`canary-kit`), state management and event construction are
separate concerns:

| Protocol operation         | State function     | Event builder(s)                    |
|----------------------------|--------------------|-------------------------------------|
| Create group + distribute  | `createGroup()`    | `buildGroupEvent()` + `buildSeedDistributionEvent()` × N |
| Add member                 | `addMember()`      | `buildMemberUpdateEvent()` + `buildGroupEvent()` + `buildSeedDistributionEvent()` |
| Remove member + reseed     | `removeMember()`   | `buildMemberUpdateEvent()` + `buildGroupEvent()` + `buildReseedEvent()` + `buildSeedDistributionEvent()` |
| Advance counter            | `advanceCounter()` | `buildWordUsedEvent()`              |
| Full reseed                | `reseed()`         | `buildReseedEvent()` + `buildSeedDistributionEvent()` × N |

State functions (`src/group.ts`) are pure local transforms — they return new
state without side effects. Event builders (`canary-kit/nostr`) construct
unsigned Nostr events from that state. The application is responsible for
signing and publishing events to relays.

The protocol complexity exists to enable interoperable implementations. The SDK
complexity does not.

## Transport Layers

Word derivation is entirely local. Network transport is used only for counter
synchronisation, seed distribution, and group management.

### Nostr (Primary)

All event kinds are published to one or more Nostr relays. NIP-44 encryption throughout.
Relays see group membership metadata (public keys in `p` tags) but MUST NOT have access
to seeds, tokens, or reason text.

### Meshtastic (Fallback)

When Nostr relays are unavailable, a canary group MAY operate over Meshtastic mesh
radio with a channel PSK derived as:

```
channel_psk = HMAC-SHA256(key=group_seed, data="meshtastic-channel-key")
```

| Message type      | Format                                                         |
|-------------------|----------------------------------------------------------------|
| Seed distribution | Encrypted to channel PSK                                       |
| Word Used signal  | `{"u":<new_counter>}`                                         |
| Duress alert      | `{"d":"<first 8 hex chars of pubkey>"}`                       |
| Group management  | NOT supported — use Nostr or in-person exchange                |

### In-Person (Last Resort)

For initial seed exchange or emergency re-seeding, an implementation MAY present the
encrypted seed payload as a QR code for scanning. The QR payload MUST be a NIP-44
encrypted Seed Distribution payload. This mechanism works fully offline.

## Nostr Group Test Vectors

The following vectors define canonical outputs for the Nostr canary group derivation
scheme. Seeds and public keys are hex-encoded 32-byte values. Counters are unsigned
64-bit integers. Words are from the `en-v1` wordlist.

**Inputs:**

```
SEED_1   = 0000000000000000000000000000000000000000000000000000000000000001
SEED_2   = ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
PUBKEY_A = 0000000000000000000000000000000000000000000000000000000000000002
PUBKEY_B = 0000000000000000000000000000000000000000000000000000000000000003
```

**Algorithm (CANARY-DERIVE and CANARY-DURESS with `context = "canary:group"`):**

```
verification (CANARY-DERIVE):
  token_bytes = HMAC-SHA256(seed, utf8("canary:group") || counter_be32)
  index       = uint16_be(token_bytes[0:2]) mod 2048
  word        = wordlist[index]

duress (CANARY-DURESS):
  duress_data = utf8("canary:group:duress") || 0x00 || utf8(pubkey) || counter_be32
  duress_bytes = HMAC-SHA256(seed, duress_data)
  index        = uint16_be(duress_bytes[0:2]) mod 2048
  word         = wordlist[index]

  # Cross-counter collision avoidance per CANARY-DURESS §Collision Avoidance:
  # forbidden set spans ±(2 × maxTolerance) counter values.
  forbidden = { verification_word(c) for c in [max(0, counter - 2*tol),
                                                 ...,
                                                 counter + 2*tol] }
  if word in forbidden:
    for suffix in 0x01..0xFF:
      duress_bytes = HMAC-SHA256(seed, duress_data || byte(suffix))
      index        = uint16_be(duress_bytes[0:2]) mod 2048
      word         = wordlist[index]
      if word not in forbidden: break
```

**Vector Table:**

| #  | Function            | Seed   | Pubkey   | Counter | Expected output                  |
|----|---------------------|--------|----------|---------|----------------------------------|
| 1  | verification word   | SEED_1 | —        | 0       | `garnet`                         |
| 2  | verification word   | SEED_1 | —        | 1       | `twice`                          |
| 3  | verification word   | SEED_2 | —        | 0       | `gossip`                         |
| 4  | verification word   | SEED_1 | —        | 100     | `treat`                          |
| 5  | verification phrase | SEED_1 | —        | 0       | `["garnet", "inject"]`           |
| 6  | verification phrase | SEED_1 | —        | 0       | `["garnet", "inject", "garnet"]` |
| 7  | duress word         | SEED_1 | PUBKEY_A | 0       | `theory`                         |
| 8  | duress word         | SEED_1 | PUBKEY_B | 0       | `cedar`                          |

Notes:

- Vector 5 uses `words=2`. First word from `mac[0:2]`, second from `mac[2:4]`.
- Vector 6 uses `words=3`. Bytes 0–1 and 4–5 produce the same index; the repeated word
  is a correct output.
- Vectors 7–8: Duress words are distinct from the verification word (`garnet`) — no
  collision re-derivation needed.

**Round-Trip Verification:**

| #  | Input word | Seed   | Members              | Counter | Expected status | Expected members |
|----|------------|--------|----------------------|---------|-----------------|------------------|
| 9  | `garnet`   | SEED_1 | [PUBKEY_A, PUBKEY_B] | 0       | `verified`      | —                |
| 10 | `theory`   | SEED_1 | [PUBKEY_A, PUBKEY_B] | 0       | `duress`        | [PUBKEY_A]       |

## Dependencies

- **NIP-44**: Versioned encryption (for all Nostr event `content` fields and seed
  distribution payloads)
- **NIP-40**: Expiration tags (for group auto-dissolution and ephemeral event expiry)

## Appendix A: English Wordlist (en-v1)

The canonical `en-v1` wordlist is maintained in the reference implementation repository
and distributed with the `canary-kit` npm package. Implementations MUST use this exact
list without modification. The wordlist file contains exactly 2048 entries, one word per
line, ordered alphabetically, UTF-8 encoding, Unix line endings.

Reference: `https://github.com/forgesworn/canary-kit` — `src/wordlists/en-v1.txt`

## Reference Implementation

### Nostr Group API

```typescript
import {
  createGroup, getCurrentWord, verifyWord,
  deriveDuressWord, deriveVerificationWord,
} from 'canary-kit'
```

Source: `https://github.com/forgesworn/canary-kit`
