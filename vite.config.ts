import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  // Source root is app/ — Vite looks for index.html here
  root: 'app',

  // Relative base so the build works on GitHub Pages and via file://
  base: './',

  resolve: {
    alias: {
      // Map canary-kit subpath imports to local src/ during development,
      // avoiding the need to build the library first.
      'canary-kit/wordlist':  resolve(__dirname, 'src/wordlist.ts'),
      'canary-kit/nostr':     resolve(__dirname, 'src/nostr.ts'),
      'canary-kit/beacon':    resolve(__dirname, 'src/beacon.ts'),
      'canary-kit/token':     resolve(__dirname, 'src/token.ts'),
      'canary-kit/encoding':  resolve(__dirname, 'src/encoding.ts'),
      'canary-kit/session':   resolve(__dirname, 'src/session.ts'),
      'canary-kit/sync':      resolve(__dirname, 'src/sync.ts'),
      // Root export must come last (longest-match-first is not guaranteed)
      'canary-kit':           resolve(__dirname, 'src/index.ts'),
    },
  },

  build: {
    // Output into docs/ so GitHub Pages can serve it from the repo root
    outDir: resolve(__dirname, 'docs'),

    // Clean the output directory on each build — old demo files are gone.
    emptyOutDir: true,
  },
})
