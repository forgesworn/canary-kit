import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  // Source root is app/ — Vite looks for index.html here
  root: 'app',

  // Relative base so the build works on GitHub Pages and via file://
  base: './',

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

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
      'canary-kit/crypto':    resolve(__dirname, 'src/crypto.ts'),
      // Root export must come last (longest-match-first is not guaranteed)
      'canary-kit':           resolve(__dirname, 'src/index.ts'),
    },
  },

  build: {
    // Output into docs/ so GitHub Pages can serve it from the repo root
    outDir: resolve(__dirname, 'docs'),

    // Don't wipe docs/ — it contains docs/record/ (demo recording scripts).
    emptyOutDir: false,
  },
})
