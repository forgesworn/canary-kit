import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  root: 'app',
  base: './',

  resolve: {
    alias: {
      'canary-kit/wordlist':  resolve(__dirname, 'src/wordlist.ts'),
      'canary-kit/nostr':     resolve(__dirname, 'src/nostr.ts'),
      'canary-kit/beacon':    resolve(__dirname, 'src/beacon.ts'),
      'canary-kit/token':     resolve(__dirname, 'src/token.ts'),
      'canary-kit/encoding':  resolve(__dirname, 'src/encoding.ts'),
      'canary-kit/session':   resolve(__dirname, 'src/session.ts'),
      'canary-kit/sync':      resolve(__dirname, 'src/sync.ts'),
      'canary-kit/crypto':    resolve(__dirname, 'src/crypto.ts'),
      'canary-kit':           resolve(__dirname, 'src/index.ts'),
    },
  },

  plugins: [viteSingleFile()],

  build: {
    outDir: resolve(__dirname, 'dist-single'),
    emptyOutDir: true,
    rollupOptions: {
      // Exclude MapLibre from the single-file bundle — it's lazy-loaded from
      // CDN when online. Keeps canary.html small for Signal/USB/airgapped use.
      external: ['maplibre-gl', 'maplibre-gl/dist/maplibre-gl.css'],
    },
  },
})
