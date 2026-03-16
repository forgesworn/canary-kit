import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
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
  test: {
    include: ['src/**/*.test.ts', 'app/**/*.test.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
