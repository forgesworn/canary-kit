// docs/record/compose.js — ffmpeg video + audio composition
//
// Combines raw video with timestamped audio clips into final MP4.
// Uses adelay for per-clip positioning and amix with normalize=0
// (critical — without it, volume drops to 1/N with N clips).

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

/**
 * Compose a final video from raw video and audio clips.
 *
 * @param {object} opts
 * @param {string} opts.videoPath - Path to raw video file
 * @param {{ file: string, timestamp: number, duration: number }[]} opts.clips - Audio clips with timestamps
 * @param {string} opts.outputPath - Path for final output MP4
 * @param {{ width?: number, height?: number }} [opts.scale] - Optional rescale
 */
export function compose({ videoPath, clips, outputPath, scale }) {
  if (!existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`)
  }

  const audioClips = clips.filter(c => c.file && existsSync(c.file))

  if (audioClips.length === 0) {
    // No audio — just copy video
    const scaleFilter = scale ? `-vf scale=${scale.width}:${scale.height}` : ''
    execSync(
      `ffmpeg -y -i "${videoPath}" ${scaleFilter} -c:v libx264 -preset fast -crf 23 "${outputPath}"`,
      { stdio: 'inherit' },
    )
    return
  }

  // Build ffmpeg command with audio mixing
  const inputs = [`-i "${videoPath}"`]
  const adelays = []
  const labels = []

  audioClips.forEach((clip, i) => {
    inputs.push(`-i "${clip.file}"`)
    const delayMs = Math.round(clip.timestamp)
    adelays.push(`[${i + 1}:a]adelay=${delayMs}|${delayMs}[a${i}]`)
    labels.push(`[a${i}]`)
  })

  const filterParts = [
    ...adelays,
    `${labels.join('')}amix=inputs=${audioClips.length}:duration=longest:normalize=0[aout]`,
  ]

  const scaleFilter = scale
    ? `[0:v]scale=${scale.width}:${scale.height}[vout];`
    : ''
  const videoLabel = scale ? '[vout]' : '0:v'

  if (scaleFilter) {
    filterParts.unshift(scaleFilter.replace(';', ''))
  }

  const filterComplex = filterParts.join(';')

  const cmd = [
    'ffmpeg -y',
    ...inputs,
    `-filter_complex "${filterComplex}"`,
    `-map "${videoLabel}" -map "[aout]"`,
    '-c:v libx264 -preset fast -crf 23',
    '-c:a aac -b:a 128k',
    '-shortest',
    `"${outputPath}"`,
  ].join(' ')

  console.log(`\n[compose] Running ffmpeg...`)
  execSync(cmd, { stdio: 'inherit' })
  console.log(`[compose] Output: ${outputPath}`)
}

/**
 * Compose a split-screen video from two raw videos side by side.
 *
 * @param {object} opts
 * @param {string} opts.leftVideo - Path to left video
 * @param {string} opts.rightVideo - Path to right video
 * @param {{ file: string, timestamp: number, duration: number }[]} opts.clips - Audio clips
 * @param {string} opts.outputPath - Final output path
 * @param {{ width?: number, height?: number }} [opts.size] - Total output size (default 1280x720)
 * @param {{ left?: string, right?: string }} [opts.labels] - Role labels
 */
export function composeSplitScreen({ leftVideo, rightVideo, clips, outputPath, size, labels }) {
  const w = size?.width || 1280
  const h = size?.height || 720
  const halfW = Math.floor(w / 2) - 2 // 2px for divider

  const inputs = [`-i "${leftVideo}"`, `-i "${rightVideo}"`]
  const audioInputs = []
  const adelays = []
  const audioLabels = []

  const audioClips = clips.filter(c => c.file && existsSync(c.file))
  audioClips.forEach((clip, i) => {
    const idx = i + 2 // 0=left video, 1=right video
    audioInputs.push(`-i "${clip.file}"`)
    const delayMs = Math.round(clip.timestamp)
    adelays.push(`[${idx}:a]adelay=${delayMs}|${delayMs}[a${i}]`)
    audioLabels.push(`[a${i}]`)
  })

  // Video filter: scale both, pad, overlay side by side
  const leftLabel = labels?.left || 'ALICE'
  const rightLabel = labels?.right || 'BOB'

  let videoFilter = [
    `[0:v]scale=${halfW}:${h}[left]`,
    `[1:v]scale=${halfW}:${h}[right]`,
    `color=c=black:s=${w}x${h}:d=999[bg]`,
    `[bg][left]overlay=0:0[tmp]`,
    `[tmp][right]overlay=${halfW + 4}:0`,
    // Draw labels
    `drawtext=text='${leftLabel}':fontsize=18:fontcolor=white:x=${Math.floor(halfW / 2) - 30}:y=10:font=monospace`,
    `drawtext=text='${rightLabel}':fontsize=18:fontcolor=white:x=${halfW + 4 + Math.floor(halfW / 2) - 30}:y=10:font=monospace`,
  ].join(',')

  // Divider line
  videoFilter += `,drawbox=x=${halfW}:y=0:w=4:h=${h}:color=gray@0.5:t=fill`

  const filterParts = [videoFilter + '[vout]']

  if (audioClips.length > 0) {
    filterParts.push(...adelays)
    filterParts.push(`${audioLabels.join('')}amix=inputs=${audioClips.length}:duration=longest:normalize=0[aout]`)
  }

  const filterComplex = filterParts.join(';')
  const audioMap = audioClips.length > 0 ? '-map "[aout]" -c:a aac -b:a 128k' : '-an'

  const cmd = [
    'ffmpeg -y',
    ...inputs,
    ...audioInputs,
    `-filter_complex "${filterComplex}"`,
    `-map "[vout]" ${audioMap}`,
    '-c:v libx264 -preset fast -crf 23',
    '-shortest',
    `"${outputPath}"`,
  ].join(' ')

  console.log(`\n[compose] Split-screen composition...`)
  execSync(cmd, { stdio: 'inherit' })
  console.log(`[compose] Output: ${outputPath}`)
}
