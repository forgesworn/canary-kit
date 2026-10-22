import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  root: 'local',
  base: './',
  plugins: [viteSingleFile()],
  build: {
    outDir: resolve(import.meta.dirname, 'dist-local'),
    emptyOutDir: true,
    target: 'es2022',
    modulePreload: false,
  },
})
