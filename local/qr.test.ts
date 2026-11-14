import { describe, expect, it } from 'vitest'
import jsQR from 'jsqr'
import { drawQr } from './qr.js'

/** A canvas that records fillRect into an RGBA buffer, enough for drawQr. */
function fakeCanvas() {
  const canvas = {
    width: 0,
    height: 0,
    pixels: new Uint8ClampedArray(0),
    getContext() {
      const ctx = {
        fillStyle: '#000',
        fillRect: (x: number, y: number, w: number, h: number) => {
          if (canvas.pixels.length !== canvas.width * canvas.height * 4) canvas.pixels = new Uint8ClampedArray(canvas.width * canvas.height * 4)
          const value = ctx.fillStyle === '#fff' ? 255 : 0
          for (let py = y; py < y + h; py++) for (let px = x; px < x + w; px++) {
            const o = (py * canvas.width + px) * 4
            canvas.pixels[o] = canvas.pixels[o + 1] = canvas.pixels[o + 2] = value
            canvas.pixels[o + 3] = 255
          }
        },
      }
      return ctx
    },
  }
  return canvas
}

describe('drawQr', () => {
  it('draws at 8 pixels a module with a 4 module quiet zone that jsQR reads back', () => {
    for (const [payload, level] of [['canary:' + 'a1'.repeat(40), 'M'], ['HTTPS://EXAMPLE.COM/CONNECT?X=1', 'L']] as const) {
      const canvas = fakeCanvas()
      drawQr(canvas as unknown as HTMLCanvasElement, payload, level)
      expect(canvas.width).toBe(canvas.height)
      expect(canvas.width % 8).toBe(0)
      // Top-left finder starts after the quiet zone: 4 modules of white, then dark.
      const first = (4 * 8 * canvas.width + 4 * 8) * 4
      expect(canvas.pixels[first]).toBe(0)
      expect(canvas.pixels[first - 4]).toBe(255)
      expect(jsQR(canvas.pixels, canvas.width, canvas.height)?.data).toBe(payload)
    }
  })

  it('says so when there is no 2D context', () => {
    const canvas = { width: 0, height: 0, getContext: () => null }
    expect(() => drawQr(canvas as unknown as HTMLCanvasElement, 'x')).toThrow('QR display is unavailable')
  })
})
