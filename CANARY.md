CANARY Protocol
===============

Coercion-Resistant Spoken Verification Protocol
------------------------------------------------

`version 1.0` `draft`

> **Compatibility policy:** Protocol v1 has `draft` status. No backward
> compatibility is guaranteed until `stable` designation. Breaking changes
> increment the `protocolVersion` field; implementations MUST reject messages
> with an unrecognised version.

## Abstract

CANARY is a protocol for coercion-resistant spoken verification. It combines
deterministic token derivation (extending the HMAC-counter pattern from
HOTP/TOTP) with duress signalling and human-spoken output — three properties
that exist independently in prior standards but have never been combined in a
single protocol.

The protocol is transport-agnostic — no Nostr, no cryptocurrency, no network
assumptions. Implementations can operate over Nostr, Signal, Matrix, SMS,
Meshtastic, radio, or in-person QR codes.

The protocol is defined in three layers:

1. **CANARY-DERIVE** — Deterministic token derivation from a shared secret, context string,
   and counter
2. **CANARY-DURESS** — Coercion-resistant alternate tokens and dead man's switch (liveness
   monitoring)
3. **CANARY-WORDLIST** — Spoken-word encoding optimised for voice clarity

## Protocol Layering

CANARY builds on two generic protocol specifications:

- **[Spoken Token Protocol](https://github.com/TheCryptoDonkey/spoken-token/blob/main/PROTOCOL.md)**
  — defines SPOKEN-DERIVE (the core HMAC-counter-to-words derivation) and SPOKEN-ENCODE
  (word/PIN/hex encoding). CANARY-DERIVE is a superset of SPOKEN-DERIVE. The generic
  protocol is implemented by the `spoken-token` npm package.

- **[Simple Shared Secret Groups](GROUPS.md)** — defines the group lifecycle (creation,
  member management, seed rotation, sync protocol, replay protection). CANARY groups
  are an application of this generic group protocol with additional duress, liveness,
  and beacon extensions.

The Nostr transport binding is defined in two layers:

- **[NIP-XX: Simple Shared Secret Groups](NIP-XX.md)** — maps the generic group
  protocol onto existing Nostr kinds (30078, NIP-17, 20078). Zero new event kinds.

- **[NIP-CANARY](NIP-CANARY.md)** — application profile of NIP-XX adding
  CANARY-specific signal types (duress alerts, beacons) and Meshtastic fallback.

CANARY's unique contributions beyond the generic layers are: **duress detection**
(CANARY-DURESS), **liveness monitoring** (dead man's switch), **threat-profile
presets**, and **encrypted location beacons**.

## Motivation

AI voice cloning now requires as little as three seconds of audio. A thirty-second clip
and thirty minutes of work can produce a convincing clone. The security advice is already
widespread — "agree on a family safe word" — but common implementations are dangerously
naive:

- Static words that never rotate (one compromise burns the word forever)
- Human-chosen words with low entropy (predictable and guessable)
- No duress signalling (if a member is forced to reveal the word, there is no silent alarm)
- No protocol (just "remember a word" — no tooling, no synchronisation, no offline support)

Existing standards each solve part of the problem but not all of it:

| Standard       | Rotating tokens | Coercion resistance | Human-spoken output |
|----------------|:---------------:|:-------------------:|:-------------------:|
| TOTP (RFC 6238)| Yes             | No                  | No                  |
| HOTP (RFC 4226)| Yes             | No                  | No                  |
| SAS (ZRTP)     | No              | No                  | Yes                 |
| BIP-39         | No              | No                  | Yes                 |
| **CANARY**     | **Yes**         | **Yes**             | **Yes**             |

CANARY solves all of these by combining well-understood cryptographic primitives
(HMAC-SHA256, counters, wordlists) into a single protocol with coercion resistance as a
first-class property.

### Relationship to HOTP/TOTP

CANARY's derivation follows the HMAC-counter pattern established by HOTP
(RFC 4226) and TOTP (RFC 6238). The core operation — `HMAC(secret, counter)`,
truncated and encoded — is structurally identical. CANARY extends this pattern
with context-string domain separation, enabling multiple derivation channels
(verification, duress, liveness) from a single shared secret without requiring
separate keys or counters.

| Property            | HOTP/TOTP           | CANARY                              |
|---------------------|---------------------|-------------------------------------|
| Hash function       | SHA-1 (SHA-256 opt) | SHA-256 (mandatory)                 |
| Counter encoding    | 8-byte BE integer   | Context string + 4-byte BE integer  |
| Output encoding     | 6–8 digit code      | Words, PIN, or hex                  |
| Derivation channels | 1 per (secret, ctr) | Multiple via context strings        |
| Coercion resistance | None                | Duress + liveness channels          |
| Target verifier     | Machine             | Human (spoken)                      |

## Terminology

| Term               | Definition                                                                                     |
|--------------------|------------------------------------------------------------------------------------------------|
| Secret             | A 256-bit (32-byte) shared key known to all verifying parties                                  |
| Context            | A UTF-8 string identifying the derivation purpose (e.g. `"canary:verify"`, `"dispatch:handoff"`) |
| Counter            | An unsigned integer determining the current token; scheme is application-defined                |
| Identity           | A UTF-8 string identifying a specific person (pubkey, username, employee ID, etc.)             |
| Verification token | The current group token, derived from secret + context + counter                               |
| Duress token       | A person's coercion token, derived from secret + context + identity + counter                  |
| Liveness token     | A heartbeat token proving "I am alive and hold the secret"                                     |
| Encoding           | Output format: words, PIN, or hex                                                              |
| Wordlist           | A curated list of exactly 2048 words optimised for spoken clarity                              |
| Burn-after-use     | Advancing the counter early after a token is used for verification                             |

---

## CANARY-DERIVE

Core deterministic token derivation. The universal primitive that all other layers build on.

> **Generic layer:** The core derivation algorithm (HMAC-SHA256 with context and counter)
> is specified generically in the [Spoken Token Protocol](https://github.com/TheCryptoDonkey/spoken-token/blob/main/PROTOCOL.md)
> as SPOKEN-DERIVE. CANARY-DERIVE is identical to SPOKEN-DERIVE — this section
> documents it in CANARY's context for completeness. The `spoken-token` npm package
> provides a standalone implementation of the generic layer.

### Algorithm

```
token_bytes = HMAC-SHA256(secret, utf8(context) || counter_be32)
```

Where:

- `secret` — 256-bit (32-byte) shared key
- `context` — UTF-8 encoded string identifying the derivation purpose
- `counter_be32` — 4-byte big-endian unsigned integer
- Output: 32 bytes (256 bits), truncated and encoded per the output format

The `context` string ensures the same secret can derive different tokens for different
purposes without collision. For example, `"canary:verify"` and `"dispatch:handoff"` produce
entirely independent token sequences from the same secret.

### Counter Schemes

The protocol does not mandate a specific counter scheme. Implementations choose one or
more based on their use case:

| Scheme          | Counter value                       | Use case                                |
|-----------------|-------------------------------------|-----------------------------------------|
| **Time-based**  | `floor(unix_time / period)`         | Canary groups (7d), short-lived (30s)   |
| **Sequence**    | Monotonic integer                   | Burn-after-use, one-time tokens         |
| **Event-based** | Deterministic from event ID         | Platforms (hash of task ID)              |

### Tolerance Window

Verifiers SHOULD accept tokens within `±tolerance` counter values to handle clock skew
and latency. The tolerance value is application-defined (e.g. short-lived tokens: ±1 epoch,
canary-kit groups: 0).

Recommended tolerance values by use case:

| Use case          | Tolerance | Rationale                                    |
|-------------------|-----------|----------------------------------------------|
| Casual (family)   | ±1        | Forgiving; handles minor sync drift          |
| High-security     | 0         | Strict; requires exact counter match         |
| TOTP-equivalent   | ±1        | Standard TOTP practice (RFC 6238 §5.2)       |

The tolerance used by verifiers MUST be communicated to duress token derivers, because the
duress collision avoidance window (see §Collision Avoidance) is computed from this value.

### Counter Acceptance

Implementations that receive counter advancement signals (burn-after-use notifications,
re-sync messages) MUST enforce the following rules:

1. **Authorised source:** Counter advancement signals MUST originate from a party known
   to hold the shared secret. The mechanism for verifying this is transport-defined
   (e.g. cryptographic signature from a known group member).

2. **Monotonic advancement:** Implementations MUST reject counter updates where
   `new_counter <= local_counter`. This provides replay protection and prevents
   counter rollback.

3. **Bounded jumps:** Implementations MUST reject counter updates where
   `new_counter > time_based_counter + max_offset`. The default `max_offset` is
   100. This bounds the damage from a compromised sender attempting to desynchronise
   the group by jumping the counter far ahead.

---

## CANARY-SYNC: Transport-Agnostic Synchronisation

> **Generic layer:** The core group management protocol (creation, member management,
> seed rotation, counter sync, replay protection) is specified generically in
> [Simple Shared Secret Groups](GROUPS.md). CANARY-SYNC extends it with
> application-specific message types: `beacon`, `duress-alert`, `duress-clear`,
> and `liveness-checkin`.

CANARY-SYNC is the protocol layer for propagating group state mutations and telemetry
across any transport without depending on Nostr or any specific relay infrastructure.
It operates over any channel capable of delivering authenticated, ordered or unordered
messages — WebSocket, Bluetooth LE, Meshtastic, Matrix, or a direct TCP connection.

### Protocol Version

All CANARY-SYNC messages carry a `protocolVersion` field. The current version is **2**.
Receivers MUST reject any message whose `protocolVersion` does not exactly equal `2`.
Version negotiation is not supported — a version mismatch is a hard error. Senders MUST
inject `protocolVersion: 2` into every message before encoding.

### Message Types

CANARY-SYNC defines eight message types grouped by function:

#### State Mutations

These messages change persistent group state and require epoch/opId replay protection.
Only admins may send state-mutation messages (except `counter-advance` and self-leave —
see §Privileged Actions).

| Type | Required Fields | Description |
|------|----------------|-------------|
| `member-join` | `pubkey`, `displayName?`, `timestamp`, `epoch`, `opId` | Add a member to the group. Admin-only unless the sender is adding themselves (self-join proves possession of the group key via envelope decryption). |
| `member-leave` | `pubkey`, `timestamp`, `epoch`, `opId` | Remove a member from the group. Admin-only unless `pubkey` equals `sender` (self-leave). |
| `counter-advance` | `counter`, `usageOffset`, `timestamp` | Advance the group counter (burn-after-use). Any current member may send; subject to monotonicity and bounded-jump constraints (see §Bounded Counter Advance). No `epoch`/`opId` required. |
| `reseed` | `seed`, `counter`, `timestamp`, `epoch`, `opId`, `admins[]`, `members[]` | Replace seed, counter, members, and admins atomically. Admin-only. `epoch` MUST equal `current_epoch + 1`. Clears all replay state. |

#### Telemetry (Fire-and-Forget)

These messages convey real-time signals that do not persist in group state. They are
subject to freshness constraints but not epoch-based replay protection.

| Type | Required Fields | Description |
|------|----------------|-------------|
| `beacon` | `lat`, `lon`, `accuracy`, `timestamp`, `opId` | Share the sender's current location. `lat` MUST be in `[−90, 90]`; `lon` in `[−180, 180]`; `accuracy` in `[0, 20_000_000]` metres. |
| `duress-alert` | `lat`, `lon`, `timestamp`, `opId`, `subject?` | Emergency location alert. Same coordinate constraints as `beacon`. See §Passive Duress. |
| `liveness-checkin` | `pubkey`, `timestamp`, `opId` | Heartbeat proving presence. Receiver MUST verify that `pubkey` equals `sender`. See §Passive Duress. |

#### Recovery

| Type | Required Fields | Description |
|------|----------------|-------------|
| `state-snapshot` | `seed`, `counter`, `usageOffset`, `members[]`, `admins[]`, `epoch`, `opId`, `timestamp`, `prevEpochSeed?` | Admin-issued full state snapshot for catch-up. Subject to same-epoch anti-rollback constraints; higher-epoch snapshots are deliberately disabled (see §State Snapshot Recovery). |

### Field Constraints

- `pubkey`, `seed`, and `prevEpochSeed` fields MUST be 64-character lowercase hex strings
  (32 bytes). `seed` in `reseed` is a `Uint8Array` in-process; it is hex-encoded for wire
  transport and decoded back to bytes on receipt.
- `opId` MUST be a non-empty string of at most 128 characters.
- `epoch` and `counter` MUST be non-negative integers.
- `admins` MUST be a subset of `members` (all admins are members).
- `timestamp` MUST be a non-negative integer (Unix seconds).

### Privileged Actions

Certain message types require the sender to be an admin of the group at the time of
processing. The following rules govern privilege:

- `reseed` and `state-snapshot` are always privileged.
- `member-join` is privileged unless `msg.pubkey === sender` (self-join). Self-join is
  permitted because successful decryption of the group envelope proves the sender holds
  a valid admin-issued group key.
- `member-leave` is privileged unless `msg.pubkey === sender` (self-leave).
- `counter-advance` is not privileged; any current group member MAY send it.
- Fire-and-forget messages (`beacon`, `duress-alert`, `liveness-checkin`) are not privileged.

Implementations MUST fail closed: a privileged message with no identified sender MUST be
silently dropped without modifying group state.

### Epoch-Based Replay Protection

Each `reseed` increments the epoch counter by exactly one. Epoch numbers MUST be
monotonically increasing (Invariant I1).

Every state-mutating message that is subject to replay protection carries an `opId`. The
group state maintains a `consumedOps` list of opIds processed within the current epoch. A
message whose `opId` is already in `consumedOps` MUST be silently dropped.

On `reseed`, the new epoch begins and `consumedOps` is reset — the `reseed` message's own
`opId` is the sole initial entry (Invariant I4).

To bound memory growth, `consumedOps` is capped at 1000 entries per epoch. When this
limit is exceeded, the oldest entries are evicted and a `consumedOpsFloor` timestamp is
recorded. Any subsequent message with `timestamp ≤ consumedOpsFloor` MUST be dropped,
preventing replay of evicted operations.

Epoch matching rules for privileged operations:

| Message type | Epoch constraint |
|---|---|
| `reseed` | `msg.epoch` MUST equal `state.epoch + 1` |
| All other privileged ops | `msg.epoch` MUST equal `state.epoch` |
| `state-snapshot` (same-epoch) | `msg.epoch` MUST equal `state.epoch` |
| `state-snapshot` (higher-epoch) | Rejected — see §State Snapshot Recovery |

Messages with `msg.epoch < state.epoch` (stale epoch) MUST be silently dropped (I6).

### Fire-and-Forget Freshness

Telemetry messages (`beacon`, `duress-alert`, `liveness-checkin`) MUST pass a freshness
gate before being accepted:

- Messages older than **300 seconds** (`FIRE_AND_FORGET_FRESHNESS_SEC`) are silently dropped.
- Messages timestamped more than **60 seconds** (`MAX_FUTURE_SKEW_SEC`) in the future are
  silently dropped.

These messages do not modify group state. Implementations SHOULD route them to
application-layer handlers (e.g. alert the group on `duress-alert`, update a presence
indicator on `liveness-checkin`). See §Passive Duress.

### Bounded Counter Advance

The `counter-advance` message is not gated by admin privilege but is bounded to limit the
damage from a compromised or malicious group member.

On receipt of a `counter-advance` message, receivers MUST enforce:

1. **Member check:** `sender` MUST be a current group member. Non-members MUST be rejected.
2. **Monotonicity:** `msg.counter + msg.usageOffset` MUST be strictly greater than
   `state.counter + state.usageOffset`. Counter rollback MUST be rejected.
3. **Bounded jump:** `msg.counter + msg.usageOffset` MUST NOT exceed
   `floor(now / rotationInterval) + 100`. The offset of **100** (`MAX_COUNTER_ADVANCE_OFFSET`)
   is a hard cap. Messages that would advance the counter beyond this bound MUST be dropped.

The bound cross-references the **Bounded jumps** rule in §Counter Acceptance: both use a
`max_offset` of 100 relative to the current time-based counter.

### State Invariants

The following invariants MUST be preserved by all conforming implementations:

| # | Invariant | Description |
|---|-----------|-------------|
| **I1** | Epoch monotonicity | `state.epoch` only increases. No message may decrease it. |
| **I2** | opId uniqueness per epoch | Within a given epoch, each `opId` is processed at most once. Duplicate `opId` values MUST be dropped. |
| **I3** | Admin-only mutations | Only admins may execute privileged actions (reseed, state-snapshot, adding/removing other members). |
| **I4** | Reseed atomicity | A `reseed` atomically replaces `{seed, counter, usageOffset, members, admins, epoch}` and resets `consumedOps` to `[reseed.opId]`. No partial application is permitted. |
| **I5** | Same-epoch snapshot anti-rollback | A same-epoch `state-snapshot` MUST be rejected unless: seed matches, incoming effective counter ≥ local effective counter, incoming members ⊇ local members, and incoming admins ⊇ local admins. |
| **I6** | Stale-epoch rejection | Any privileged message with `msg.epoch < state.epoch` MUST be silently dropped. |

### State Snapshot Recovery

`state-snapshot` is an admin-issued message that allows group members who missed
intermediate transitions to resynchronise their local state.

#### Same-Epoch Recovery

When `msg.epoch === state.epoch`, the snapshot is accepted if and only if all of the
following hold:

1. `msg.seed === state.seed` — the seed has not changed within this epoch (no silent reseed).
2. `msg.counter + msg.usageOffset >= state.counter + state.usageOffset` — counter does not
   regress.
3. `msg.members` is a superset of `state.members` — member removals within an epoch require
   a reseed.
4. `msg.admins` is a superset of `state.admins` — admin demotions require a reseed.

On acceptance, the receiver advances to the snapshot's counter, members, and admins, and
appends the `opId` to `consumedOps`.

#### Higher-Epoch Recovery — Deliberately Disabled

Higher-epoch snapshots (`msg.epoch > state.epoch`) are **rejected**. A group member who
misses one or more `reseed` messages cannot recover via snapshot and MUST be re-invited
by an admin.

This restriction eliminates the stale-admin hijack attack surface: a removed admin whose
local state is stale could otherwise fabricate a higher-epoch snapshot and push a forged
group state to members who missed the reseed. By rejecting higher-epoch snapshots entirely,
the attack surface is reduced to same-epoch fabrication, which is mitigated by the
sender-must-be-in-snapshot-admins self-consistency check at the transport layer.

**Known limitation:** Full mitigation of the stale-admin fabrication attack requires either
quorum-based recovery (multiple admins must co-sign a snapshot) or a verifiable reseed
chain (signed epoch transitions stored on a relay). Both are deferred to a future protocol
version.

### Deterministic Serialisation

All CANARY-SYNC messages MUST be serialised deterministically for signing. The canonical
form is produced by `canonicaliseSyncMessage`:

1. Binary fields (`seed` in `reseed`) are hex-encoded before serialisation.
2. All object keys are sorted recursively (depth-first).
3. Arrays are serialised in their original order (element order is significant).
4. No whitespace is emitted.
5. `undefined` values are omitted.

This canonical form is the byte string over which inner signatures are computed (H2). The
`protocolVersion` field MUST be present in the canonical form — the sender is responsible
for injecting `protocolVersion: 2` before both encoding and signing, ensuring that the
canonical bytes always reflect the actual wire value.

Wire encoding uses `JSON.stringify` with the `protocolVersion` field added. Binary fields
(`seed` in `reseed`) are hex-encoded for safe JSON round-tripping via `bytesToHex`.

### Group Key Derivation and Envelope Encryption

CANARY-SYNC messages are transmitted inside encrypted envelopes keyed to the group seed.

**Group key derivation:**

```
group_key = HMAC-SHA256(hex_to_bytes(seed), utf8("canary:sync:key"))
```

**Envelope encryption:** AES-256-GCM with a random 12-byte nonce. The wire format is:

```
base64(IV || ciphertext || auth_tag)
```

where `IV` is 12 bytes, `ciphertext` is the UTF-8 encoded JSON message, and `auth_tag` is
the 16-byte GCM authentication tag appended by the Web Crypto API. Decryption MUST throw
on authentication failure.

**Per-participant signing key derivation:**

```
signing_key = HMAC-SHA256(hex_to_bytes(seed), utf8("canary:sync:sign:") || hex_to_bytes(personal_privkey))
```

Binding the personal private key ensures each participant's signing identity is unique
within the group, even across reseed events. A reseed invalidates all prior signing keys
derived from the old seed.

**Group tag hashing:** To avoid correlating events to a known group name, transport-layer
routing tags use a privacy-preserving hash:

```
group_tag = hex(SHA256(utf8(group_id)))
```

### Cross-References

- **§Counter Acceptance** — defines the bounded-jump rule that `counter-advance` enforces.
- **§Passive Duress** — defines liveness monitoring; `liveness-checkin` and `duress-alert`
  are the CANARY-SYNC wire representations of liveness heartbeats and active duress signals.
- **§Seed Storage** — the group seed from which `group_key` and `signing_key` are derived
  MUST be wiped from storage on group dissolution.

---

### Output Encodings

The encoding is a presentation layer, not part of the derivation. The same `token_bytes`
can be rendered in multiple formats:

| Format    | Encoding                                                 | Example                       |
|-----------|----------------------------------------------------------|-------------------------------|
| **Words** | `uint16_be(bytes[i*2..i*2+2]) mod 2048` → wordlist      | `net`, `throw drafter category` |
| **PIN**   | First N bytes as big-endian integer, mod 10^digits       | `2796`                        |
| **Hex**   | Lowercase hex pairs, truncated to length                 | `c51524053f1f27a4`            |

#### Word Encoding

Each word consumes 2 bytes (16 bits) from the token, reduced modulo the wordlist size
(2048 = 11 effective bits per word):

```
for i in 0..word_count:
    index = uint16_be(token_bytes[i*2 .. i*2+2]) mod 2048
    words[i] = wordlist[index]
```

A single HMAC-SHA256 output (32 bytes) provides enough material for up to 16 words.

#### PIN Encoding

The first `ceil(digits × 0.415)` bytes are interpreted as a big-endian integer, reduced
modulo `10^digits`, zero-padded to the requested length:

```
value = big_endian_int(token_bytes[0..N])
pin   = (value mod 10^digits), zero-padded to `digits` characters
```

### Token Length and Security

More output = more security, harder to speak:

| Format       | Bits  | Possibilities | Use case                         |
|--------------|-------|---------------|----------------------------------|
| 1 word       | ~11   | ~2,048        | Casual verification, voice call  |
| 2–3 words    | ~22–33| ~4M–8B        | Group identity, high-security    |
| 4-digit PIN  | ~13.3 | 10,000        | Quick handoff (dispatch)         |
| 6-digit code | ~19.9 | 1,000,000     | TOTP-equivalent                  |

### Directional Pair Pattern

A single shared token has an echo problem: the second party to speak could parrot
the first. CANARY solves this with **directional context strings** — each side
derives a different token from the same secret.

A directional pair uses a namespace and two role identifiers to construct two
context strings:

```
context_a = namespace + ":" + role_a
context_b = namespace + ":" + role_b
```

Each party derives BOTH tokens. Party A speaks their token; Party B verifies it
against context_a. Then Party B speaks their token; Party A verifies against
context_b. Neither token can be derived from the other without the shared secret.

#### Example — Insurance Phone Call

```
caller_word = HMAC-SHA256(secret, utf8("aviva\0caller") || counter_be32)
agent_word  = HMAC-SHA256(secret, utf8("aviva\0agent")  || counter_be32)
```

> **Note:** The null byte (`\0`) separator between namespace and role prevents
> concatenation ambiguity (e.g. namespace `a:b` + role `c` vs namespace `a` +
> role `b:c`).

1. Agent: "What's your verification word?"
2. Caller speaks their word — Agent verifies against `aviva\0caller` context ✓
3. Caller: "And what's mine?"
4. Agent speaks their word — Caller verifies against `aviva\0agent` context ✓

An eavesdropper hearing "bid" cannot derive "choose". Both parties have
independently proved knowledge of the shared secret.

#### Duress in Directional Pairs

Each party's duress token is derived from their OWN directional context:

```
caller_duress = HMAC-SHA256(secret, utf8("aviva\0caller:duress") || 0x00 || utf8(caller_id) || counter_be32)
agent_duress  = HMAC-SHA256(secret, utf8("aviva\0agent:duress")  || 0x00 || utf8(agent_id)  || counter_be32)
```

If the caller speaks their duress word instead of their verification word, the
agent's system detects it and triggers the appropriate response — without the
caller ever revealing they are under coercion.

#### Convention

Implementations MUST use a null-byte separator (`namespace\0role`) for directional
context strings. The namespace identifies the application or domain. The roles
identify the two parties. Example namespaces:

| Namespace   | Roles                        | Use case                       |
|-------------|------------------------------|--------------------------------|
| `dispatch`  | `requester`, `provider`      | Task handoff verification      |
| `aviva`     | `caller`, `agent`            | Insurance phone verification   |
| `barclays`  | `customer`, `agent`          | Banking phone verification     |
| `id`        | `subject`, `verifier`        | Identity verification          |

### Session Abstraction

Implementations MAY provide a **Session** object that wraps a directional pair with
role awareness and lifecycle methods. A Session encapsulates the shared secret, the
namespace, the two roles, and the caller's own role, and exposes the following
interface:

| Method | Description |
|--------|-------------|
| `counter(nowSec?)` | Return the current counter — time-derived (floor(t / rotationSeconds)) or fixed |
| `myToken(nowSec?)` | Derive the token this party speaks to prove their own identity |
| `theirToken(nowSec?)` | Derive the token expected from the other party |
| `verify(spoken, nowSec?)` | Verify a word spoken by the other party; returns a result indicating pass, duress, or fail |
| `pair(nowSec?)` | Return both tokens keyed by role name |

Sessions are constructed from a `SessionConfig` specifying the secret, namespace,
roles tuple, own role, and optional parameters (rotationSeconds, tolerance, encoding,
preset, fixed counter). Implementations SHOULD validate that the two roles are
distinct and that `myRole` is one of the configured roles.

#### Fixed-Counter Mode

When `rotationSeconds` is set to `0`, the Session operates in **fixed-counter mode**.
The counter is supplied explicitly at construction time rather than derived from the
clock. This is appropriate for single-use tokens tied to a specific event identifier
(e.g. a task ID or booking reference) rather than to a time window.

Implementations MUST require an explicit `counter` value when `rotationSeconds=0`.
Implementations MUST reject a `counter` value when `rotationSeconds>0`, since the
counter is derived deterministically from the current time in that case.

#### Session Presets

Implementations MAY provide named presets that configure a Session for a specific
two-party use case:

| Preset | Words | Rotation | Tolerance | Use case |
|--------|-------|----------|-----------|----------|
| `call` | 1 | 30 seconds | 1 | Phone verification for insurance, banking, and call centres |
| `handoff` | 1 | single-use (fixed counter) | 0 | Physical handoff for rideshare, delivery, and task completion |

The `call` preset uses a 30-second rotation window with a tolerance of ±1 counter,
giving a 90-second acceptance window to accommodate clock skew between caller and
agent.

The `handoff` preset uses fixed-counter mode (`rotationSeconds=0`), with a tolerance
of 0. The counter MUST be set to a value agreed out-of-band (e.g. the event ID
converted to a 32-bit integer). This ensures the token is single-use and bound to
a specific event, not to a time window.

#### Deterministic Seed Derivation

When multiple sessions share a master secret but MUST produce independent, isolated
token streams, implementations SHOULD derive per-session seeds deterministically
using HMAC:

```
sessionSeed = HMAC-SHA256(masterKey, utf8(component_0) || 0x00 || utf8(component_1) || ...)
```

Null-byte separators between components prevent concatenation ambiguity (the byte
sequence `"ab" || 0x00 || "c"` is distinct from `"a" || 0x00 || "bc"`). Components
SHOULD be chosen to uniquely identify the session context (e.g. namespace, task ID,
participant identifiers).

---

## CANARY-DURESS

Coercion resistance and liveness monitoring. The differentiator from existing standards.

### Active Duress — Token Derivation

Each identity has a distinct duress token, derived independently from the verification
token. In finite output spaces (e.g. 2048-word wordlist), two identities may derive
the same duress token — this is expected and handled by multi-match attribution (see
Verification Flow).

```
duress_bytes = HMAC-SHA256(secret, utf8(context + ":duress") || 0x00 || utf8(identity) || counter_be32)
```

Where:

- `context + ":duress"` — the verification context with `":duress"` appended
- `0x00` — a null-byte separator preventing concatenation ambiguity between the context
  suffix and the identity string
- `identity` — UTF-8 encoded identifier (pubkey, username, employee ID)
- Same `counter` as the verification token

**Key property:** The duress token is computationally independent from the verification
token. An attacker who knows one cannot derive the other. But a verifier with the shared
secret can check for both.

### Collision Avoidance

If the duress token, after encoding, is identical to any verification token within the
collision window, the implementation MUST re-derive by appending incrementing suffix bytes
to the HMAC data.

#### Collision Window

The collision window MUST be `±(2 × maxTolerance)` counter values centred on the deriver's
counter. The 2× factor accounts for worst-case counter drift: the deriver and the verifier
may each be off by `maxTolerance` in opposite directions, so the verifier could check
normal tokens anywhere in a `±(2 × maxTolerance)` range from the deriver's perspective.

The `maxTolerance` used when deriving the duress token MUST equal the `tolerance` used by
the verifier. Using an insufficient value allows duress tokens to collide with normal tokens
at distant counters, causing silent alarm suppression.

Implementations SHOULD enforce a practical upper bound on tolerance (the reference
implementation uses `MAX_TOLERANCE = 10`).

```
collision_window = [max(0, counter - 2 * maxTolerance),
                    min(MAX_UINT32, counter + 2 * maxTolerance)]

forbidden_tokens = { encode(derive(secret, context, c)) for c in collision_window }

duress_data = utf8(context + ":duress") || 0x00 || utf8(identity) || counter_be32
duress_bytes = HMAC-SHA256(secret, duress_data)
duress_token = encode(duress_bytes, encoding)

suffix = 1
while duress_token in forbidden_tokens and suffix <= 255:
    duress_bytes = HMAC-SHA256(secret, duress_data || byte(suffix))
    duress_token = encode(duress_bytes, encoding)
    suffix += 1

if duress_token in forbidden_tokens:
    ERROR: duress collision unresolvable
```

Collision avoidance operates at the encoding level, not the byte level, because different
byte arrays can encode to the same output via modulo reduction. Implementations MUST
apply this check whenever computing a duress token. If all 255 suffix retries produce
a collision (probability effectively zero for any practical encoding), the implementation
MUST raise an error. Implementations MUST NOT return a duress token that matches any
verification token in the collision window — this would cause a duress signal to be
classified as valid, suppressing the silent alarm.

### Verification Flow

```
verify(secret, context, counter, input, identities[], tolerance?) ->
  { status: 'valid' } |
  { status: 'duress', identities: string[] } |
  { status: 'invalid' }
```

The verification algorithm uses exact-counter-first priority:

1. Derive the verification token at the **exact** counter. If the input matches → `valid`.
   Same-counter collision avoidance guarantees no ambiguity at this step.

2. For each identity, for each counter in the tolerance window
   `[counter - tolerance, ..., counter + tolerance]`:
   derive the duress token (using `maxTolerance = tolerance`).
   Collect all matching identities. If any match →
   `duress` with all matching identities.

3. For each counter in the tolerance window **excluding the exact counter**:
   derive the verification token. If the input matches → `valid`.

4. No match → `invalid`.

This ordering ensures that a duress token at the expected counter is never masked by a
normal token at an adjacent counter (fail-safe).

#### Multi-Match Attribution

When checking duress tokens, the verifier MUST check all identities and collect all
matches. If exactly one identity matches, the result is `duress` with that identity.
If multiple identities match, the result is `duress` with all matching identities.
The verifier MUST NOT short-circuit after the first duress match.

#### Duress Collision Probability

In finite output spaces, distinct identities may derive identical duress tokens at the
same counter (birthday problem). This is a known limitation, not a protocol flaw.

| Members | 1 word (~11 bits) | 2 words (~22 bits) | 3 words (~33 bits) |
|---------|-------------------|--------------------|--------------------|
| 5       | ~0.5%             | ~0.00012%          | negligible         |
| 10      | ~2.2%             | ~0.00048%          | negligible         |
| 20      | ~9.3%             | ~0.0019%           | negligible         |
| 50      | ~45%              | ~0.012%            | negligible         |

Groups of 10 or more members SHOULD use 2+ words for reliable attribution. PIN
encoding with 4 digits (10,000 outputs) has similar collision properties to 1-word
encoding (2,048 outputs).

### Deniability Properties

The duress token is indistinguishable from a wrong answer to any party that does not hold
the shared secret:

- An attacker hears a plausible word from the wordlist (or a plausible PIN).
- The attacker cannot verify whether it is the verification token or the duress token
  without the shared secret.
- If the attacker demands the "real" token, the member can assert that the duress token
  is the real token. The attacker cannot refute this.

### Threat-Profile Presets

Implementations MAY provide named threat-profile presets that select a word count and
rotation interval appropriate for a given risk level and operational context. These are
recommendations, not requirements — implementations MAY define additional presets or
allow operators to configure custom profiles.

| Preset | Words | Rotation | Tolerance | Use case |
|--------|-------|----------|-----------|----------|
| `family` | 1 | 7 days | 1 | Casual family and friend groups |
| `field-ops` | 2 | 24 hours | 1 | High-security field operations |
| `enterprise` | 2 | 48 hours | 1 | Corporate and institutional use |
| `event` | 1 | 4 hours | 1 | Temporary event-based groups |

The `family` preset prioritises usability: a single word with a weekly rotation is easy
to remember and sufficient for live voice calls where the attacker has at most one
attempt. It is NOT suitable for text-based or asynchronous verification where an
attacker can brute-force all 2,048 words offline.

The `field-ops` preset prioritises security: two-word phrases (~22 bits of entropy)
with daily rotation are recommended for journalism, activism, and operational contexts
where the threat model includes motivated, resourced adversaries.

The `enterprise` preset extends the rotation window to 48 hours, balancing security
with operational convenience for larger teams where frequent re-verification is
impractical.

The `event` preset uses a 4-hour rotation aligned with typical conference or festival
session schedules. It is intended for ephemeral groups formed at a specific event.

### Limitations

- If the attacker has compromised the member's device AND obtained the shared secret, they
  can derive both the verification token and the duress token. At this point, the device is
  the weakest link, not the protocol.
- If the attacker knows the CANARY protocol exists and demands the member display the
  application, the member would expose the verification token. Implementations SHOULD NOT
  display the duress token in the default UI. The duress token SHOULD be accessible only
  through a non-obvious secondary gesture.

### Implementation UX Requirements

Implementations that display verification tokens to users MUST follow these
requirements to preserve duress deniability:

1. Implementations MUST NOT display the duress token alongside the verification
   token in any default UI view.
2. Implementations SHOULD require a non-obvious secondary gesture (e.g. long-press,
   hidden menu, specific swipe pattern) to access duress-related functionality.
3. When a duress token is detected during verification, implementations MUST NOT
   display any visible indication that could alert an attacker observing the
   verifier's screen. The response SHOULD appear identical to a failed verification
   from the attacker's perspective.
4. Implementations SHOULD NOT label any UI element with the word "duress" or
   "coercion" in the default interface.

### Passive Duress — Dead Man's Switch

The protocol defines a liveness token for heartbeat-based absence detection:

```
liveness_bytes = HMAC-SHA256(secret, utf8(context + ":alive") || 0x00 || utf8(identity) || counter_be32)
```

The liveness token proves both identity and knowledge of the secret — not just a ping.

Liveness monitoring parameters are application-defined:

| Parameter            | Description                                     | Example     |
|----------------------|-------------------------------------------------|-------------|
| `heartbeat_interval` | Expected time between liveness proofs           | 300s, 30s   |
| `grace_period`       | Time after missed heartbeat before DMS triggers | 2× interval |

**DMS trigger actions** are implementation-specific:

| Implementation | Action on DMS trigger                                              |
|----------------|--------------------------------------------------------------------|
| Canary-kit     | Derive liveness token; monitoring and alerting are application-layer |
| Key management | Lock signing keys, broadcast revocation                            |
| Dispatch       | Escalate to dispatch, freeze escrow                                |
| Banking        | Freeze account, alert fraud team                                   |

The CANARY protocol defines liveness token derivation. The monitoring loop
(tracking heartbeat intervals, detecting missed check-ins, triggering alerts)
is application-defined. Libraries SHOULD provide the `deriveLivenessToken()`
primitive. Applications SHOULD implement heartbeat tracking with configurable
`heartbeat_interval` and `grace_period`.

---

## CANARY-WORDLIST

Spoken-word encoding optimised for voice clarity.

### Encoding Scheme

- 2048 words = 11 bits per word
- Token bytes split into 2-byte chunks, each mapped to a word index via
  `uint16_be mod 2048`
- 1 word = ~11 bits, 2 words = ~22 bits, 3 words = ~33 bits

### Phonetic Clarity Criteria

Wordlists MUST satisfy:

1. **No homophones** — words must sound distinct (`write` vs `right` excluded)
2. **Distinct first syllable** — listeners can identify the word early
3. **Cross-accent pronounceable** — works across major accent families
4. **No offensive words** — culturally appropriate across contexts
5. **Single-word only** — no compounds, no hyphens
6. **4–8 letters preferred** — short enough to speak, long enough to be distinct

### Wordlist Requirements

Words MUST be:

- Between 3 and 8 characters in length (inclusive)
- Unambiguous when spoken aloud
- Phonetically distinct from every other word in the list
- Free of offensive meanings in major languages
- Easy to pronounce across common English accents

Words MUST NOT be:

- Homophones of other words in the list (e.g. there/their, right/write)
- Within 2 phonetic edits of another list word (e.g. cat/bat, pen/ten)
- Confusable over degraded audio channels (e.g. ship/chip, thin/fin)
- Emotionally charged words that could cause alarm if overheard (e.g. bomb, kill, death)

### Format

The wordlist is a plain text file, one word per line, with exactly 2048 entries. Lines are
numbered 0 through 2047. The word at line N is `wordlist[N]`.

### Reference Wordlist

`en-v1` — 2048-word English wordlist curated from BIP-39 with additional phonetic
filtering. Maintained in the `canary-kit` reference implementation.

The canonical English wordlist (`en-v1`) begins from the BIP-39 English wordlist (2048
words) with the following modifications:

1. Remove all words that fail the spoken-clarity requirements above.
2. Replace removed words with words from a supplementary spoken-word corpus.
3. Validate the complete list against phonetic distance metrics.

The full `en-v1` wordlist is defined in Appendix A of [NIP-CANARY.md](NIP-CANARY.md). Any
implementation claiming compliance with this protocol MUST use the exact wordlist defined
there.

### Why Not BIP-39 Directly?

CANARY's `en-v1` wordlist is **derived from** BIP-39 English — it starts with the same
2048 words, then filters for spoken-word clarity. The two lists optimise for different
threat models:

| Concern | BIP-39 | CANARY `en-v1` |
|---------|--------|----------------|
| **Primary channel** | Written (paper backup) | Spoken (voice call, radio) |
| **Identification** | First 4 characters unique | First syllable distinct |
| **Homophones** | Allowed (`write`/`right`) | Removed |
| **Audio confusion** | Not considered | Filtered (`ship`/`chip`, `thin`/`fin`) |
| **Emotional charge** | Allowed (`bomb`, `kill`) | Removed (avoids alarm if overheard) |

BIP-39 words are designed to be **written down and read back** — uniqueness from the first
4 characters is enough. CANARY words are designed to be **spoken aloud over a degraded
channel** — a phone call, a radio, a noisy conference room. The filtering removes ~15% of
BIP-39 words and replaces them with concrete, unambiguous alternatives.

**Custom wordlists are supported.** The `wordlist` field in group configuration accepts any
wordlist identifier. Implementations MAY offer BIP-39 as an alternative for teams that
prefer familiarity over spoken clarity. The protocol does not mandate `en-v1` — it mandates
that all group members use the **same** list.

### Internationalisation

Other languages can propose wordlists following the same criteria. Each list is identified
by a locale tag (`es-v1`, `fr-v1`, `ja-v1`). The protocol does not mandate a specific
language.

---

## Security Considerations

### Threat Model

| Threat                           | TOTP | CANARY  | Mitigation                                               |
|----------------------------------|:----:|:-------:|----------------------------------------------------------|
| Impersonation                    | Yes  | Yes     | Verification token challenge                              |
| AI voice/video clone             | No   | Yes     | Shared secret — clone does not know the current token    |
| Coercion (forced auth)           | No   | **Yes** | Duress token alerts silently; attacker cannot distinguish|
| Replay attack                    | Yes  | Yes     | Counter rotation / burn-after-use                         |
| Absence detection                | No   | **Yes** | Liveness token / dead man's switch                       |
| Transport interception           | —    | Yes     | End-to-end encryption at the transport layer              |
| Device compromise                | —    | Yes     | Re-seed immediately; exclude compromised member          |
| Wordlist brute force (live call) | —    | Yes     | 11 bits per word; attacker gets one attempt               |

### Entropy Analysis

- Single word: ~11 bits (1 in 2048). Adequate for real-time verification where the
  attacker has one attempt.
- Two words: ~22 bits (1 in ~4,194,304). Recommended for higher-security groups.
- Three words: ~33 bits (1 in ~8,589,934,592). Maximum word configuration.
- 4-digit PIN: ~13.3 bits (1 in 10,000). Quick handoff scenarios.
- 6-digit code: ~19.9 bits (1 in 1,000,000). TOTP-equivalent.

### Seed Storage

The shared secret MUST be stored securely on member devices:

- Encrypted at rest using the platform keychain or secure enclave where available
- Never exported in plaintext after initial receipt
- Wiped from storage on group dissolution
- Protected by device authentication (PIN or biometric) before displaying any derived
  token

### Shared Secret Trade-off

CANARY uses a symmetric shared secret because offline derivation requires it.
Any member can verify any other member without contacting a server, a key server,
or any online authority. This property — the ability to verify identity with no
network — is a deliberate design choice for scenarios where connectivity is
unreliable, adversarial, or unavailable.

The trade-off: a single compromised member or device can derive all verification
and duress tokens for the group until the secret is rotated. The blast radius of
a compromise is the entire group.

**Why not per-member secrets?** Per-member derived sub-secrets would require a
verifier to know or fetch the speaker's sub-secret before verification. This
introduces an online dependency or pre-distribution of all members' sub-secrets,
negating the simplicity of a single shared key.

**Mitigation strategy:** Detect compromise quickly and reseed immediately.

- Re-seed on member removal (`reason=member_removed`) — SHOULD for trusted
  departures, MUST for adversarial or unknown circumstances
- Re-seed on suspected compromise (`reason=compromise`)
- Re-seed on duress detection (`reason=duress`)
- Periodic scheduled re-seed even without known compromise — intervals should
  match the group's risk profile (see Threat-Profile Presets in the reference
  implementation)

The protocol provides the machinery for fast recovery. The operational discipline
of regular reseeds is where real-world resilience comes from.

### Timing Safety

Verification functions MUST NOT leak information through execution time.
Implementations MUST use constant-time comparison for all token matching
(e.g. XOR-and-accumulate, not early-exit string comparison). All verification
branches (exact match, duress check, tolerance window) MUST be computed
regardless of which branch matches — the result is determined after all
comparisons complete, not by short-circuiting on the first match.

This prevents an attacker from distinguishing verification tokens from duress
tokens by measuring response time.

---

## Test Vectors

### CANARY Protocol Vectors

The following vectors define canonical expected outputs for the universal CANARY protocol.
Any implementation claiming conformance MUST produce identical results.

**Inputs:**

```
SECRET   = 0000000000000000000000000000000000000000000000000000000000000001
CONTEXT  = canary:verify
IDENTITY = alice
```

**Algorithm:**

```
CANARY-DERIVE:
  token_bytes = HMAC-SHA256(hex_to_bytes(SECRET), utf8(CONTEXT) || counter_be32)

CANARY-DURESS:
  duress_bytes = HMAC-SHA256(hex_to_bytes(SECRET), utf8(CONTEXT + ":duress") || 0x00 || utf8(IDENTITY) || counter_be32)

Liveness:
  liveness_bytes = HMAC-SHA256(hex_to_bytes(SECRET), utf8(CONTEXT + ":alive") || 0x00 || utf8(IDENTITY) || counter_be32)
```

**Vector Table:**

| #  | Function           | Context          | Identity   | Counter | Encoding    | Expected output                                                    |
|----|--------------------|------------------|------------|---------|-------------|--------------------------------------------------------------------|
| 1  | deriveTokenBytes   | `canary:verify`  | —          | 0       | raw hex     | `c51524053f1f27a4c871c63069f285ce5ac5b69a40d6caa5af9b6945dd9556d1` |
| 2  | deriveToken        | `canary:verify`  | —          | 0       | 1 word      | `net`                                                              |
| 3  | deriveToken        | `canary:verify`  | —          | 1       | 1 word      | `famous`                                                           |
| 4  | deriveToken        | `dispatch:handoff` | —        | 0       | 4-digit PIN | `2818`                                                             |
| 5  | deriveToken        | `id:verify`        | —        | 0       | 3 words     | `decrease mistake require`                                         |
| 6  | deriveDuressToken  | `canary:verify`    | `alice`  | 0       | 1 word      | `airport`                                                          |
| 7  | deriveDuressToken  | `dispatch:handoff` | `rider123` | 0     | 4-digit PIN | `0973`                                                             |
| 8  | verifyToken        | `canary:verify`  | `alice`    | 0       | input: `net`   | `{ status: 'valid' }`                                           |
| 9  | verifyToken        | `canary:verify`  | `alice`    | 0       | input: `airport`| `{ status: 'duress', identities: ['alice'] }`                  |
| 10 | deriveLivenessToken| `canary:verify`  | `alice`    | 0       | raw hex     | `b38a10676ea8d4e716ad606e0b2ae7d9678e47ff44b0920a68ed6cb02e9bb858` |
| 11 | deriveToken        | `aviva:caller`   | —          | 0       | 1 word      | `bid`                                                              |
| 12 | deriveToken        | `aviva:agent`    | —          | 0       | 1 word      | `choose`                                                           |

Notes:

- Vector 5 uses a different context string, demonstrating that the same secret derives
  independent tokens per context.
- Vector 6: `airport` is distinct from `net` — no collision re-derivation needed.
- Vector 7: `0973` is distinct from `2818` — no collision re-derivation needed.
- Vectors 8–9: Round-trip verification confirms correct classification of normal tokens
  as `valid` and duress tokens as `duress` with the correct identity.
- Vectors 11–12: Directional pair — same secret, different context strings produce
  different tokens (`bid` vs `choose`). An eavesdropper hearing one cannot derive the other.

---

## Reference Implementation

TypeScript: `canary-kit` (npm)

```
npm install canary-kit
```

### CANARY Protocol API

```typescript
import {
  deriveToken, deriveTokenBytes,
  deriveDuressToken, deriveDuressTokenBytes,
  verifyToken,
  deriveLivenessToken,
} from 'canary-kit/token'

import {
  encodeAsWords, encodeAsPin, encodeAsHex,
} from 'canary-kit/encoding'
```

Source: `https://github.com/TheCryptoDonkey/canary-kit`
