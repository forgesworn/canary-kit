# Examples

Runnable examples demonstrating canary-kit's core features.

All examples are standalone ESM scripts. Run with Node.js 22+:

```bash
npm run build          # compile the library first
node examples/01-phone-verification.ts    # if using tsx/ts-node
# or:
npx tsx examples/01-phone-verification.ts
```

| Example | Demonstrates |
|---------|-------------|
| [01-phone-verification.ts](01-phone-verification.ts) | Two-party phone call verification (insurance, banking) |
| [02-family-group.ts](02-family-group.ts) | Family safe word with weekly rotation and duress detection |
| [03-duress-detection.ts](03-duress-detection.ts) | Silent duress alerting in sessions and groups |
| [04-beacon-encryption.ts](04-beacon-encryption.ts) | Encrypted location beacons for group members |
| [05-nostr-events.ts](05-nostr-events.ts) | Building Nostr events for the CANARY protocol |
