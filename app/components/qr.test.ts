import { describe, expect, it } from 'vitest'
import jsQR from 'jsqr'
import { generateQR } from './qr.js'

/** Rasterise the SVG as a browser would (one SVG unit a pixel, scaled up by
 *  `scale`), on a white page `around` pixels wider each side. */
function raster(svg: string, scale: number, around: number): { data: Uint8ClampedArray; side: number } {
  const units = Number(/viewBox="0 0 (\d+) \d+"/.exec(svg)![1])
  const side = units * scale + around * 2
  const data = new Uint8ClampedArray(side * side * 4).fill(255)
  const symbol = /<svg x="(\d+)" y="(\d+)" width="(\d+)"[^>]*viewBox="0 0 (\d+) \d+"/.exec(svg)!
  const [offset, span, modules] = [Number(symbol[1]), Number(symbol[3]), Number(symbol[4])]
  const cell = span / modules
  const path = /<path fill="#000" d="([^"]*)"/.exec(svg)![1]!
  for (const [, x, y, run] of path.matchAll(/M(\d+) (\d+)h(\d+)v1h-\3z/g)) {
    const x0 = Math.round((offset + Number(x) * cell) * scale) + around
    const x1 = Math.round((offset + (Number(x) + Number(run)) * cell) * scale) + around
    const y0 = Math.round((offset + Number(y) * cell) * scale) + around
    const y1 = Math.round((offset + (Number(y) + 1) * cell) * scale) + around
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        const o = (py * side + px) * 4
        data[o] = data[o + 1] = data[o + 2] = 0
      }
    }
  }
  return { data, side }
}

describe('generateQR', () => {
  const payload = 'npub1' + 'q'.repeat(58)

  it('is a scalable SVG with a viewBox and no fixed size, black on white', () => {
    const svg = generateQR(payload)
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 \d+ \d+" preserveAspectRatio="xMinYMin meet">/)
    expect(svg).toContain('<rect width="100%" height="100%" fill="#fff"/>')
    expect(svg).toContain('fill="#000"')
    expect(svg.match(/<svg /g)).toHaveLength(2)
  })

  it('keeps the 2 unit border: the viewBox is the symbol plus 4 units, whatever the cell size', () => {
    for (const cell of [3, 4]) {
      const svg = generateQR(payload, cell)
      const units = Number(/^<svg[^>]*viewBox="0 0 (\d+) /.exec(svg)![1])
      const inner = Number(/<svg x="2" y="2" width="(\d+)"/.exec(svg)![1])
      expect(units).toBe(inner + 4)
      expect(inner % cell).toBe(0)
    }
  })

  it('reads back with jsQR as the same text', () => {
    for (const cell of [3, 4]) {
      const { data, side } = raster(generateQR(payload, cell), 2, 16)
      expect(jsQR(data, side, side)?.data).toBe(payload)
    }
  })
})
