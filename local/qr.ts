import qrcode from 'qrcode-generator'
import jsQR from 'jsqr'

export function drawQr(canvas: HTMLCanvasElement, payload: string): void {
  const qr = qrcode(0, 'M')
  qr.addData(payload)
  qr.make()
  const scale = 8
  const margin = 4
  const count = qr.getModuleCount()
  canvas.width = canvas.height = (count + margin * 2) * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('QR display is unavailable. Use the setup words instead.')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#000'
  for (let y = 0; y < count; y++) for (let x = 0; x < count; x++) {
    if (qr.isDark(y, x)) ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale)
  }
}

export class QrScanner {
  private revision = 0
  private stream: MediaStream | null = null
  private timer: ReturnType<typeof setTimeout> | undefined
  private timeout: ReturnType<typeof setTimeout> | undefined
  private canvas = document.createElement('canvas')

  constructor(private video: HTMLVideoElement, private candidate: (data: string) => void, private failed: (message: string) => void) {}

  stop(): void {
    this.revision++
    clearTimeout(this.timer)
    clearTimeout(this.timeout)
    this.stream?.getTracks().forEach(track => track.stop())
    this.stream = null
    this.video.pause()
    this.video.srcObject = null
    this.canvas.width = this.canvas.height = 1
  }

  async start(): Promise<void> {
    this.stop()
    const revision = this.revision
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera scanning is unavailable here. Type the setup words below.')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 } } })
    // Permission can finish after cancellation, tab hiding or navigation.
    if (revision !== this.revision) { stream.getTracks().forEach(track => track.stop()); return }
    this.stream = stream
    try {
      this.timeout = setTimeout(() => { this.stop(); this.failed('Scan paused after a minute. Try again or type the setup words.') }, 60_000)
      this.video.srcObject = stream
      await this.video.play()
      if (revision !== this.revision) return
      const scan = () => {
        if (revision !== this.revision) return
        try {
          if (this.video.readyState >= 2 && this.video.videoWidth > 0) {
            const width = Math.min(640, this.video.videoWidth)
            const height = Math.max(1, Math.round(width * this.video.videoHeight / this.video.videoWidth))
            this.canvas.width = width
            this.canvas.height = height
            const ctx = this.canvas.getContext('2d', { willReadFrequently: true })
            if (!ctx) throw new Error('Camera decoding is unavailable. Type the setup words instead.')
            ctx.drawImage(this.video, 0, 0, width, height)
            const frame = ctx.getImageData(0, 0, width, height)
            const result = jsQR(frame.data, width, height, { inversionAttempts: 'dontInvert' })
            if (result) this.candidate(result.data)
          }
          if (revision === this.revision) this.timer = setTimeout(scan, 150)
        } catch { this.stop(); this.failed('Could not read the camera. Type the setup words instead.') }
      }
      scan()
    } catch (e) { this.stop(); throw e }
  }
}
