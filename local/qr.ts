import qrcode from 'qrcode-generator'
import jsQR from 'jsqr'

export function drawQr(canvas: HTMLCanvasElement, payload: string, correction: 'L' | 'M' = 'M'): void {
  const qr = qrcode(0, correction)
  qr.addData(payload,/^[0-9A-Z $%*+./:-]+$/.test(payload)?'Alphanumeric':'Byte')
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

  async start(facing:'user'|'environment'='environment',limitMs=60_000): Promise<void> {
    if(!Number.isInteger(limitMs)||limitMs<1000||limitMs>180_000)throw new Error('Invalid camera activity limit.')
    this.stop()
    const revision = this.revision
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera scanning is unavailable here. Type the setup words below.')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } } })
    // Permission can finish after cancellation, tab hiding or navigation.
    if (revision !== this.revision) { stream.getTracks().forEach(track => track.stop()); return }
    this.stream = stream
    try {
      this.timeout = setTimeout(() => { this.stop(); this.failed('Camera paused. Your saved setup is kept. Read again when both screens are ready.') }, limitMs)
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
            let result = jsQR(frame.data, width, height, { inversionAttempts: 'attemptBoth' })
            // A distant QR can be legible in the camera's original pixels but
            // disappear when a wide/portrait frame is shrunk for decoding.
            // Retry the central square at higher resolution, without digital
            // upscaling; the first pass still finds codes outside the centre.
            if (!result) {
              const side = Math.min(this.video.videoWidth, this.video.videoHeight)
              const size = Math.min(960, side)
              this.canvas.width = this.canvas.height = size
              ctx.drawImage(this.video, (this.video.videoWidth - side) / 2, (this.video.videoHeight - side) / 2, side, side, 0, 0, size, size)
              const centre = ctx.getImageData(0, 0, size, size)
              result = jsQR(centre.data, size, size, { inversionAttempts: 'attemptBoth' })
            }
            if (result) this.candidate(result.data)
          }
          if (revision === this.revision) this.timer = setTimeout(scan, 150)
        } catch { this.stop(); this.failed('Could not read the camera. Type the setup words instead.') }
      }
      scan()
    } catch (e) { this.stop(); throw e }
  }
}
