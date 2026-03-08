#!/usr/bin/env node
// docs/record/record.js — CLI orchestrator for demo recordings
//
// Usage:
//   node record.js                  # record all scripts
//   node record.js short            # record one script
//   node record.js extended         # record one script
//   node record.js --no-voice       # skip TTS (silent)

import { chromium } from 'playwright'
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { initNarration, createNarrator, getClips } from './narrate.js'
import { compose, composeSplitScreen } from './compose.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, 'output')
const SCRIPTS_DIR = join(__dirname, 'scripts')

const DEV_SERVER_URL = process.env.DEV_URL || 'http://localhost:5173'
const VIEWPORT = { width: 1280, height: 720 }
const SPLIT_VIEWPORT = { width: 640, height: 720 }

// Parse CLI args
const args = process.argv.slice(2)
const noVoice = args.includes('--no-voice')
const headless = args.includes('--headless')
const scriptNames = args.filter(a => !a.startsWith('--'))

async function checkDevServer() {
  try {
    const res = await fetch(DEV_SERVER_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch {
    console.error(`\nDev server not running at ${DEV_SERVER_URL}`)
    console.error('Start it with: npm run dev\n')
    process.exit(1)
  }
}

/**
 * Record a single-browser demo script.
 */
async function recordSingle(scriptModule, name) {
  const outputSubDir = join(OUTPUT_DIR, name)
  // Clean previous recordings
  await rm(outputSubDir, { recursive: true, force: true })
  await mkdir(outputSubDir, { recursive: true })
  await initNarration(outputSubDir, { noVoice })

  const browser = await chromium.launch({
    headless,
    args: ['--enable-webgl', '--ignore-gpu-blocklist'],
  })

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: outputSubDir, size: VIEWPORT },
    colorScheme: 'dark',
  })

  const page = await context.newPage()
  await page.goto(DEV_SERVER_URL)
  // Clear any existing state so we start from the welcome screen
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForLoadState('networkidle')

  const recordingStartMs = Date.now()
  const narrate = createNarrator(recordingStartMs)
  const pause = (ms) => page.waitForTimeout(ms)
  const waitForIdle = () => page.waitForLoadState('networkidle').catch(() => {})

  console.log(`\n[record] Recording: ${name}`)
  await scriptModule.default(page, { narrate, pause, waitForIdle })

  await page.waitForTimeout(500) // final settling
  await context.close()
  await browser.close()

  // Find the recorded video (pick the largest webm file)
  const files = await readdir(outputSubDir)
  const webmFiles = files.filter(f => f.endsWith('.webm'))
  if (webmFiles.length === 0) {
    console.error(`[record] No video file found in ${outputSubDir}`)
    return
  }
  let videoFile = webmFiles[0]
  if (webmFiles.length > 1) {
    let maxSize = 0
    for (const f of webmFiles) {
      const s = await stat(join(outputSubDir, f))
      if (s.size > maxSize) { maxSize = s.size; videoFile = f }
    }
  }

  const rawVideo = join(outputSubDir, videoFile)
  const finalVideo = join(OUTPUT_DIR, `${name}.mp4`)

  compose({
    videoPath: rawVideo,
    clips: getClips(),
    outputPath: finalVideo,
  })
}

/**
 * Record a split-screen demo with two browser contexts.
 * The script receives { alice, bob, narrate, pause }.
 */
async function recordSplitScreen(scriptModule, name) {
  const outputSubDir = join(OUTPUT_DIR, name)
  // Clean previous recordings
  await rm(outputSubDir, { recursive: true, force: true })
  const aliceDir = join(outputSubDir, 'alice')
  const bobDir = join(outputSubDir, 'bob')
  await mkdir(aliceDir, { recursive: true })
  await mkdir(bobDir, { recursive: true })
  await initNarration(outputSubDir, { noVoice })

  const browser = await chromium.launch({
    headless,
    args: ['--enable-webgl', '--ignore-gpu-blocklist'],
  })

  const aliceContext = await browser.newContext({
    viewport: SPLIT_VIEWPORT,
    recordVideo: { dir: aliceDir, size: SPLIT_VIEWPORT },
    colorScheme: 'dark',
    geolocation: { latitude: 51.5074, longitude: -0.1278 },
    permissions: ['geolocation'],
  })

  const bobContext = await browser.newContext({
    viewport: SPLIT_VIEWPORT,
    recordVideo: { dir: bobDir, size: SPLIT_VIEWPORT },
    colorScheme: 'dark',
    geolocation: { latitude: 51.5131, longitude: -0.1372 },
    permissions: ['geolocation'],
  })

  const alice = await aliceContext.newPage()
  const bob = await bobContext.newPage()

  await alice.goto(DEV_SERVER_URL)
  await bob.goto(DEV_SERVER_URL)
  // Clear any existing state so both start from the welcome screen
  await alice.evaluate(() => localStorage.clear())
  await bob.evaluate(() => localStorage.clear())
  await alice.reload()
  await bob.reload()
  await Promise.all([
    alice.waitForLoadState('networkidle'),
    bob.waitForLoadState('networkidle'),
  ])

  const recordingStartMs = Date.now()
  const narrate = createNarrator(recordingStartMs)
  const pause = (ms) => Promise.all([alice.waitForTimeout(ms), bob.waitForTimeout(ms)])
  const waitForIdle = () => Promise.all([
    alice.waitForLoadState('networkidle').catch(() => {}),
    bob.waitForLoadState('networkidle').catch(() => {}),
  ])

  console.log(`\n[record] Recording split-screen: ${name}`)
  await scriptModule.default({ alice, bob }, { narrate, pause, waitForIdle })

  await pause(500)
  await aliceContext.close()
  await bobContext.close()
  await browser.close()

  // Find recorded videos
  const aliceFiles = await readdir(aliceDir)
  const bobFiles = await readdir(bobDir)
  const aliceVideo = aliceFiles.find(f => f.endsWith('.webm'))
  const bobVideo = bobFiles.find(f => f.endsWith('.webm'))

  if (!aliceVideo || !bobVideo) {
    console.error('[record] Missing video file(s) for split-screen')
    return
  }

  const finalVideo = join(OUTPUT_DIR, `${name}.mp4`)

  composeSplitScreen({
    leftVideo: join(aliceDir, aliceVideo),
    rightVideo: join(bobDir, bobVideo),
    clips: getClips(),
    outputPath: finalVideo,
    labels: { left: 'ALICE', right: 'BOB' },
  })
}

// ── Main ────────────────────────────────────────────────────

await checkDevServer()
await mkdir(OUTPUT_DIR, { recursive: true })

// Discover available scripts
const allScriptFiles = await readdir(SCRIPTS_DIR).catch(() => [])
const available = allScriptFiles
  .filter(f => f.endsWith('.js') && f !== 'acts.js')
  .map(f => f.replace('.js', ''))

const toRecord = scriptNames.length > 0
  ? scriptNames.filter(n => available.includes(n))
  : available

if (toRecord.length === 0) {
  console.error(`No scripts found. Available: ${available.join(', ') || 'none'}`)
  process.exit(1)
}

for (const name of toRecord) {
  const mod = await import(`./scripts/${name}.js`)
  const isSplitScreen = mod.splitScreen === true

  if (isSplitScreen) {
    await recordSplitScreen(mod, name)
  } else {
    await recordSingle(mod, name)
  }
}

console.log('\nDone!')
