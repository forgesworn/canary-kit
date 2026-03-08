// docs/record/narrate.js — TTS generation via OpenAI gpt-4o-mini-tts
//
// Generates audio clips and tracks timestamps for ffmpeg composition.

import { writeFile, mkdir } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { join } from 'node:path'

const VOICE = process.env.TTS_VOICE || 'shimmer'
const MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts'
const SPEED = parseFloat(process.env.TTS_SPEED) || 1.25
const INSTRUCTIONS = process.env.TTS_INSTRUCTIONS ||
  'Urgent, confident British narrator. Like a BBC technology documentary — authoritative but human. Short punchy sentences. No filler words. Let the visuals breathe.'

/** @type {{ file: string, timestamp: number, duration: number }[]} */
const clips = []
let clipIndex = 0
let outputDir = ''
let noVoice = false
/** Composition timeline cursor — tracks when the last clip finishes playing (ms from recording start) */
let timelineCursorMs = 0

/**
 * Initialise the narration module.
 * @param {string} dir - Output directory for audio clips
 * @param {{ noVoice?: boolean }} opts
 */
export async function initNarration(dir, opts = {}) {
  outputDir = join(dir, 'audio')
  noVoice = opts.noVoice || false
  clips.length = 0
  clipIndex = 0
  timelineCursorMs = 0
  await mkdir(outputDir, { recursive: true })
}

/**
 * Generate a TTS clip and record its timestamp.
 * Returns a promise that resolves when the clip is ready.
 * The timestamp is recorded AFTER the API call (not before).
 *
 * @param {string} text - Narration text
 * @param {number} recordingStartMs - When the recording started (Date.now())
 * @returns {Promise<number>} Duration of the clip in milliseconds
 */
export async function generateClip(text, recordingStartMs) {
  const index = clipIndex++
  const clipStartMs = Date.now()

  if (noVoice) {
    // Estimate ~150 wpm for pacing without actual audio
    const words = text.split(/\s+/).length
    const estimatedMs = (words / 150) * 60 * 1000 / SPEED
    const compositionMs = Date.now() - recordingStartMs
    const timestamp = Math.max(compositionMs, timelineCursorMs)
    timelineCursorMs = timestamp + estimatedMs
    clips.push({ file: '', timestamp, duration: estimatedMs })
    // Wait until this clip would finish playing in the composition timeline
    const waitUntil = recordingStartMs + timelineCursorMs
    const waitMs = waitUntil - Date.now()
    if (waitMs > 0) await new Promise(resolve => setTimeout(resolve, waitMs))
    return estimatedMs
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input: text,
      speed: SPEED,
      response_format: 'mp3',
      instructions: INSTRUCTIONS,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`TTS API error ${response.status}: ${err}`)
  }

  // Record timestamp AFTER the API call returns, but ensure it doesn't
  // overlap with the previous clip in the composition timeline.
  const compositionMs = Date.now() - recordingStartMs
  const timestamp = Math.max(compositionMs, timelineCursorMs)

  const buffer = Buffer.from(await response.arrayBuffer())
  const file = join(outputDir, `clip-${String(index).padStart(3, '0')}.mp3`)
  await writeFile(file, buffer)

  // Measure actual duration with ffprobe
  const duration = measureDuration(file)
  timelineCursorMs = timestamp + duration
  clips.push({ file, timestamp, duration })

  console.log(`  [narrate] clip ${index}: ${duration.toFixed(0)}ms @ ${(timestamp / 1000).toFixed(1)}s — "${text.slice(0, 50)}..."`)

  // Wait until this clip would finish playing in the composition timeline.
  // This prevents the next narration from starting before this one ends.
  const waitUntil = recordingStartMs + timelineCursorMs
  const waitMs = waitUntil - Date.now()
  if (waitMs > 0) {
    await new Promise(resolve => setTimeout(resolve, waitMs))
  }

  return duration
}

/**
 * Measure audio clip duration in milliseconds using ffprobe.
 */
function measureDuration(file) {
  const result = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${file}"`,
    { encoding: 'utf-8' },
  ).trim()
  return parseFloat(result) * 1000
}

/**
 * Get all recorded clips with their timestamps and durations.
 */
export function getClips() {
  return [...clips]
}

/**
 * Create a narrate function bound to a recording start time.
 * This is the main interface used in demo scripts.
 *
 * @param {number} recordingStartMs
 * @returns {(text: string) => Promise<number>}
 */
export function createNarrator(recordingStartMs) {
  return (text) => generateClip(text, recordingStartMs)
}
