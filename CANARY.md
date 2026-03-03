CANARY Protocol
===============

Coercion-Resistant Spoken Verification Protocol
------------------------------------------------

`version 1.0` `draft`

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
| Context            | A UTF-8 string identifying the derivation purpose (e.g. `"canary:verify"`, `"trott:handoff"`) |
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
purposes without collision. For example, `"canary:verify"` and `"trott:handoff"` produce
entirely independent token sequences from the same secret.

### Counter Schemes

The protocol does not mandate a specific counter scheme. Implementations choose one or
more based on their use case:

| Scheme          | Counter value                       | Use case                                |
|-----------------|-------------------------------------|-----------------------------------------|
| **Time-based**  | `floor(unix_time / period)`         | Canary groups (7d), short-lived (30s)   |
| **Sequence**    | Monotonic integer                   | Burn-after-use, one-time tokens         |
| **Event-based** | Deterministic from event ID         | TROTT (hash of task ID)                 |

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

### Counter Acceptance

Implementations that receive counter advancement signals (burn-after-use notifications,
re-sync messages) MUST enforce the following rules:

1. **Authorised source:** Counter advancement signals MUST originate from a party known
   to hold the shared secret. The mechanism for verifying this is transport-defined
   (e.g. cryptographic signature from a known group member).

2. **Monotonic advancement:** Implementations MUST reject counter updates where
   `new_counter <= local_counter`. This provides replay protection and prevents
   counter rollback.

3. **Bounded jumps:** Implementations SHOULD reject counter updates where
   `new_counter > time_based_counter + max_offset`. The RECOMMENDED `max_offset` is
   100. This bounds the damage from a compromised sender attempting to desynchronise
   the group by jumping the counter far ahead.

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
| 4-digit PIN  | ~13.3 | 10,000        | Quick handoff (TROTT)            |
| 6-digit code | ~19.9 | 1,000,000     | TOTP-equivalent                  |

---

## CANARY-DURESS

Coercion resistance and liveness monitoring. The differentiator from existing standards.

### Active Duress — Token Derivation

Each identity has a unique duress token, derived independently from the verification
token:

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

If the duress token, after encoding, is identical to the verification token at the same
counter, the implementation MUST re-derive by appending incrementing suffix bytes to the
HMAC data:

```
duress_data = utf8(context + ":duress") || 0x00 || utf8(identity) || counter_be32
duress_bytes = HMAC-SHA256(secret, duress_data)
duress_token = encode(duress_bytes, encoding)

suffix = 1
while duress_token == normal_token and suffix <= 255:
    duress_bytes = HMAC-SHA256(secret, duress_data || byte(suffix))
    duress_token = encode(duress_bytes, encoding)
    suffix += 1

if duress_token == normal_token:
    ERROR: duress collision unresolvable
```

Collision avoidance operates at the encoding level, not the byte level, because different
byte arrays can encode to the same output via modulo reduction. Implementations MUST
apply this check whenever computing a duress token. If all 255 suffix retries produce
a collision (probability effectively zero for any practical encoding), the implementation
MUST raise an error. Implementations MUST NOT return a duress token that matches the
normal token — this would cause a duress signal to be classified as valid, suppressing the
silent alarm.

### Verification Flow

```
verify(secret, context, counter, input, identities[], tolerance?) ->
  { status: 'valid' } |
  { status: 'duress', identities: string[] } |
  { status: 'invalid' }
```

The verification algorithm checks in order:

1. For each counter in `[counter - tolerance, ..., counter + tolerance]`:
   derive the verification token. If the input matches → `valid`.

2. For each identity, for each counter in the tolerance window:
   derive the duress token. Collect all matching identities. If any match →
   `duress` with all matching identities.

3. No match → `invalid`.

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

| Implementation | Action on DMS trigger                               |
|----------------|-----------------------------------------------------|
| Canary-kit     | Alert the group with last known location            |
| Key management | Lock signing keys, broadcast revocation             |
| TROTT          | Escalate to dispatch, freeze escrow                 |
| Banking        | Freeze account, alert fraud team                    |

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
| 4  | deriveToken        | `trott:handoff`  | —          | 0       | 4-digit PIN | `2796`                                                             |
| 5  | deriveToken        | `signet:verify`  | —          | 0       | 3 words     | `throw drafter category`                                           |
| 6  | deriveDuressToken  | `canary:verify`  | `alice`    | 0       | 1 word      | `airport`                                                          |
| 7  | deriveDuressToken  | `trott:handoff`  | `rider123` | 0       | 4-digit PIN | `0325`                                                             |
| 8  | verifyToken        | `canary:verify`  | `alice`    | 0       | input: `net`   | `{ status: 'valid' }`                                           |
| 9  | verifyToken        | `canary:verify`  | `alice`    | 0       | input: `airport`| `{ status: 'duress', identities: ['alice'] }`                  |
| 10 | deriveLivenessToken| `canary:verify`  | `alice`    | 0       | raw hex     | `b38a10676ea8d4e716ad606e0b2ae7d9678e47ff44b0920a68ed6cb02e9bb858` |

Notes:

- Vector 5 uses a different context string, demonstrating that the same secret derives
  independent tokens per context.
- Vector 6: `airport` is distinct from `net` — no collision re-derivation needed.
- Vector 7: `0325` is distinct from `2796` — no collision re-derivation needed.
- Vectors 8–9: Round-trip verification confirms correct classification of normal tokens
  as `valid` and duress tokens as `duress` with the correct identity.

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
