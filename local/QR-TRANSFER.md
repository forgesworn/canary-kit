# Moving QR transfers

The same app version is needed on both devices. This carrier reuses My Signet's
MIT Base45/coarse QR framing, with separate Vouch payload and digest domains.
It carries the existing public invitations/receiving requests and
recipient-encrypted replies/copies. It adds no pairing cipher, relay, account,
signalling service or automatic identity/duress verdict.

## A new person over a trusted call

1. Choose **Connect on a call**, name the person and confirm the trusted context.
   Protect your local vault if needed.
2. Share the public invitation through the call's chat, or choose **Show a moving
   QR for a video call**. They use **Read a QR or open a reply** inside Vouch.
3. They protect their copy and return the encrypted reply in the same way. The
   original device reads it in its original Vouch app/vault.
4. Compare the four fixed words on the trusted call and save separately. Setup
   words do not rotate. Later call checks keep the original 30-second profile.

This is the existing `connect.ts` invitation/NIP-44 reply profile. The method is
recorded as a trusted call. It does not establish an unknown caller's identity.

## Your own devices, in either direction

The receiving device chooses **Bring my people here** and shows its public
receiving-request QR. The source reads it, selects completed people and shows
the recipient-encrypted copy as a moving QR. The receiver reads that reply,
compares the import code with the source, reviews the names and imports.
Reverse those roles to copy back. Existing names/unlock protection are kept;
duplicates are skipped. Group keys and unfinished exchanges remain excluded.
The original copy remains, with no automatic synchronisation or revocation.

Large copies use the existing encrypted-file route or fewer selected people.
Public/encrypted text/JSON files can be opened from the QR reader. Inputs are
validated/canonicalised before being queued across backgrounding; unsupported
file contents are not echoed into an error message.

## Video and privacy

Live QR over video needs a second screen the camera can see. One phone cannot
point its camera at its own call screen. Use the trusted call's chat for the
public invitation/request and encrypted reply/file on a single phone, then
return to Vouch to paste/open it. Those chosen apps/providers can retain data.

Share only the transfer QR. Keep vault, rotating call words and recovery screens
private. Call participants/providers may record public/ciphertext frames and
timing. A complete SHA-256 frame digest checks assembly consistency, not peer
authenticity. Human code comparison remains essential; a compromised endpoint
or live relay is outside the protection of the spoken check.

## Bounds and evidence

`VQP1:` wraps canonical typed packets in Base45. `VQF1:` frames bind up to 128
coarse parts with the full digest, reject inconsistent totals/parts and accept
out-of-order duplicates. Frames repeat every 500 ms. **Trouble scanning?** offers
a larger QR and one-second frames. Reader progress counts only validated,
distinct parts; the complete digest is still required before opening a transfer.
Dedicated reading and
partial assembly are bounded to three minutes and stop on leaving or lock.
Ordinary offline Connect/radio sessions keep their one-minute activity pause.

Unit checks cover RFC vectors, mixed/damaged/expired assemblies, private-field
stripping, recipient encryption and actual QR pixel decoding. The complete
browser journey covers invitation/reply and own-device copying in both
directions through canvas camera fixtures. See `evidence/optical-transfer.json`.
`npm run test:video` runs the same complete journeys through real, locally
signalled WebRTC VP8 and H.264 encoders, RTP and decoders. It deliberately
withholds some whole QR parts in the first cycle, mirrors alternate video
streams and adds slight rotation. Input is 640 × 360 at a 250 kbit/s cap;
the encoder may adapt resolution. Reported RTP/codec/frame statistics are in
`evidence/video-call-transfer.json`. Screens/cameras and credentials are fixtures,
without any external call provider. This is not a physical camera-through-call
trial or novice timing acceptance.
