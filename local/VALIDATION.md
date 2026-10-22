# Local verification record

22 October 2026. Code commit `46079244b9c93edac98f184f240d8f86d891a811`.

Artifact: `canary-local.html`, 66,913 bytes.

SHA-256:

```text
5e68be61d1461aa155b30bcd42bbf69ee44df4742cfe6f5e5f3042cd7891d8e6
```

- `npm test -- --maxWorkers=2`: **713 tests passed across 28 files**, including
  the five new pair tests. These cover setup validation, opposite-side matching,
  rotation, bounded drift, both directions' duress detection across multiple
  counters, and invalid inputs.
- `npm run typecheck`: passed for the existing library.
- `npm run typecheck:local`: passed for the new browser entry point.
- `npm run build:local`: passed; generated a single HTML file, installed exact
  CSP script/style hashes, and removed the intermediate `dist-local/` directory.
- `npm run test:local` with the existing Chromium headless executable revision
  1243: passed with offline networking and actual `file://` loads. The check
  creates both sides, rejects invalid setup, reopens both downloaded private
  files, checks role direction, normal/duress words, rotation and echo rejection,
  clears entered secrets, checks screen hiding and a 380-pixel layout, and sees
  **zero network requests or browser/CSP errors**. No cookies/localStorage were
  installed. All downloaded private test files were deleted and the browser
  closed.
- The WebKit attempt could not launch: its expected cached executable was
  unavailable. No browser was downloaded. This is an unavailable check, not a
  WebKit pass. The failed attempt's empty scratch directory was removed.

Visual evidence retained: [desktop](evidence/desktop.png) and
[mobile viewport](evidence/mobile.png). Neither contains setup secrets.

No independent audit, physical Android/GrapheneOS or iPhone acceptance, user
usability acceptance, hosted deployment, push, PR or release is claimed. The
existing automated protocol audit is not independent acceptance of this UI.

No test server, fixture, emulator or browser is left running by this task.
The temporary inventory files and the abandoned initial `known-words` scaffold
are removed at handover. The final artifact, source, screenshots and legal
findings are retained in this branch.
