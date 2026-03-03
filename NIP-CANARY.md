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

## Nostr Canary Groups

This section defines a Nostr application layer built on the CANARY protocol, providing
group management, seed distribution, and counter synchronisation over Nostr relays.

Nostr canary groups use a specific instantiation of the CANARY protocol with time-based
counters and Nostr public keys as member identities.

### Group Derivation Scheme

The Nostr group scheme uses 64-bit counter encoding and the group seed directly as the
HMAC key (without a context string), for simplicity in the single-purpose group setting:

#### Verification Word

```
counter_bytes = uint64_be(counter)
mac           = HMAC-SHA256(key=seed, data=counter_bytes)
index         = uint16_be(mac[0..2]) mod 2048
word          = wordlist[index]
```

Where:

- `seed` is the 32-byte group seed
- `counter` is `floor(unix_timestamp / rotation_interval)` plus any usage offset
- `uint16_be(mac[0..2])` interprets bytes 0 and 1 of the MAC as a big-endian 16-bit
  integer

#### Verification Phrase

For multi-word phrases (2 or 3 words), each word is derived from a consecutive 2-byte
slice of the same HMAC digest:

```
mac    = HMAC-SHA256(key=seed, data=uint64_be(counter))
word_1 = wordlist[uint16_be(mac[0..2]) mod 2048]
word_2 = wordlist[uint16_be(mac[2..4]) mod 2048]
word_3 = wordlist[uint16_be(mac[4..6]) mod 2048]
```

Different 2-byte slices MAY produce the same index; this is a valid output, not an error.

#### Duress Word

Each member has a distinct duress word derived per the CANARY-DURESS collision avoidance
algorithm (see [CANARY.md](CANARY.md)). In finite wordlist spaces, two members may
derive the same duress word — this is handled by multi-match attribution. The member's Nostr public key (32-byte hex) is
used as the identity parameter, and the group seed is used as the shared secret:

```
key   = seed || member_pubkey   (64 bytes: 32-byte seed + 32-byte pubkey)
mac   = HMAC-SHA256(key=key, data=uint64_be(counter))
index = uint16_be(mac[0..2]) mod 2048
word  = wordlist[index]
```

If the duress word collides with any verification word within the ±1 counter
tolerance window (counter−1, counter, counter+1), the deterministic multi-suffix
retry algorithm from CANARY-DURESS applies (append suffix bytes 0x01..0xFF to the
key until distinct, error if exhausted).

### Counter Derivation

```
counter = floor(unix_timestamp / rotation_interval) + usage_offset
```

The `usage_offset` is the number of times the word has been burned within the current
time window. It MUST be included in Word Used events (kind 28802) so all members can
advance in step.

### Verification Algorithm

When verifying a spoken response:

1. If it matches the current verification word (or phrase, when `words > 1`) →
   identity confirmed.
2. Derive the duress word (or phrase) for every member at the **current counter**.
   Collect all matches. Per CANARY-DURESS, the verifier MUST check all members and
   collect all matches (see [CANARY.md](CANARY.md)).
3. Derive the duress word (or phrase) for every member at `counter - 1`.
   Collect all matches. This catches duress signals from members whose counter is
   one window behind.
4. If any duress matches from steps 2 or 3 → **DURESS DETECTED**. Act normally,
   broadcast silent duress event.
5. Check the verification word (or phrase) at `counter - 1` (one window lookback
   for stale counters). If it matches → identity confirmed, member out of sync.
6. Otherwise → verification failed.

### Burn-After-Use

When a word is used for verification:

1. The verifying member broadcasts a Word Used event (kind 28802) with the new counter.
2. All members advance their counter to `max(local_counter + 1, time_based_counter)`.
3. Members who miss the event resynchronise at the next natural time rotation.

## Event Kinds

This NIP defines five event kinds for Nostr transport. Kind numbers 38800–38801 are
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
| Remove member + reseed     | `removeMember()`   | `buildMemberUpdateEvent()` + `buildReseedEvent()` + `buildSeedDistributionEvent()` |
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

**Algorithm:**

```
verification:
  mac   = HMAC-SHA256(key=seed, data=uint64_be(counter))
  index = uint16_be(mac[0:2]) mod 2048
  word  = wordlist[index]

duress:
  key   = seed || pubkey  (64 bytes)
  mac   = HMAC-SHA256(key=key, data=uint64_be(counter))
  index = uint16_be(mac[0:2]) mod 2048
  word  = wordlist[index]

  # Cross-counter collision avoidance: forbidden set is verification
  # words at counter−1, counter, and counter+1 (clamped at 0).
  forbidden = { verification_word(max(0, counter-1)),
                verification_word(counter),
                verification_word(counter+1) }
  if word in forbidden:
    for suffix in 0x01..0xFF:
      key   = seed || pubkey || byte(suffix)
      mac   = HMAC-SHA256(key=key, data=uint64_be(counter))
      index = uint16_be(mac[0:2]) mod 2048
      word  = wordlist[index]
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

Reference: `https://github.com/TheCryptoDonkey/canary-kit` — `src/wordlists/en-v1.txt`

## Reference Implementation

### Nostr Group API

```typescript
import {
  createGroup, getCurrentWord, verifyWord,
  deriveDuressWord, deriveVerificationWord,
} from 'canary-kit'
```

Source: `https://github.com/TheCryptoDonkey/canary-kit`
