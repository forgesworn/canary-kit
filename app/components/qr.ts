// app/components/qr.ts — QR code generation using @forgesworn/qr

import { encode, toSvg } from '@forgesworn/qr'

/** Light border around the code, in the SVG's own units (the same as `size`). */
const MARGIN = 2

/**
 * Generate an SVG QR code for the given data string.
 *
 * Level L, byte mode, black on white, with a border of 2 units where each module
 * is `size` units wide, as this has always drawn. The border is a fraction of a
 * module, which `toSvg`'s whole-module margin cannot express, so the symbol is
 * drawn with no margin and nested inside a white square that supplies it.
 *
 * @param data  The string to encode (e.g. a base64 invite payload).
 * @param size  Cell size in pixels (default: 4). Controls physical dimensions.
 * @returns     SVG markup string (scalable, no external dependencies).
 */
export function generateQR(data: string, size = 4): string {
  const qr = encode(data, { ecc: 'L', mode: 'byte' })
  const inner = qr.size * size
  const side = inner + MARGIN * 2
  const symbol = toSvg(qr, { margin: 0, dark: '#000', light: null }).replace(
    '<svg ',
    `<svg x="${MARGIN}" y="${MARGIN}" width="${inner}" height="${inner}" `,
  )
  // No width or height on the outer element: CSS controls the final size.
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" preserveAspectRatio="xMinYMin meet">` +
    `<rect width="100%" height="100%" fill="#fff"/>${symbol}</svg>`
  )
}
