// docs/record/cursor.js — Animated cursor overlay for demo recordings
//
// Uses a data URI background-image for the cursor SVG — this renders
// reliably in Playwright's video capture (innerHTML SVGs do not).

const CURSOR_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M5 3l14 8-6.5 2L9 19.5z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
</svg>
`)}`

const CURSOR_ID = '__demo-cursor'
const RIPPLE_ID = '__demo-ripple'

/**
 * Inject the custom cursor overlay into the page.
 * Must be called once before any cursor movement.
 */
export async function injectCursor(page) {
  await page.evaluate(({ cursorSvg, cursorId, rippleId }) => {
    // Hide native cursor
    const style = document.createElement('style')
    style.textContent = `* { cursor: none !important; }`
    document.head.appendChild(style)

    // Cursor element
    const cursor = document.createElement('div')
    cursor.id = cursorId
    Object.assign(cursor.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '24px',
      height: '24px',
      backgroundImage: `url("${cursorSvg}")`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
      zIndex: '999999',
      transform: 'translate(-2px, -2px)',
      transition: 'none',
      opacity: '0',
    })
    document.body.appendChild(cursor)

    // Ripple element (click feedback)
    const ripple = document.createElement('div')
    ripple.id = rippleId
    Object.assign(ripple.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.6)',
      pointerEvents: 'none',
      zIndex: '999998',
      opacity: '0',
      transform: 'translate(-20px, -20px) scale(0.3)',
      transition: 'opacity 0.3s, transform 0.3s',
    })
    document.body.appendChild(ripple)
  }, { cursorSvg: CURSOR_SVG, cursorId: CURSOR_ID, rippleId: RIPPLE_ID })
}

/** Show the cursor. */
export async function showCursor(page) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (el) el.style.opacity = '1'
  }, CURSOR_ID)
}

/** Hide the cursor. */
export async function hideCursor(page) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (el) el.style.opacity = '0'
  }, CURSOR_ID)
}

/**
 * Smoothly move the cursor to (x, y) with cubic-bezier easing.
 */
export async function moveTo(page, x, y, { duration = 400 } = {}) {
  await page.evaluate(({ id, x, y, duration }) => {
    const el = document.getElementById(id)
    if (!el) return
    el.style.transition = `top ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), left ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
    el.style.top = `${y}px`
    el.style.left = `${x}px`
  }, { id: CURSOR_ID, x, y, duration })
  await page.waitForTimeout(duration + 50)
  // Reset transition for instant positioning
  await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (el) el.style.transition = 'none'
  }, CURSOR_ID)
}

/**
 * Show a ripple effect at the current cursor position.
 */
async function ripple(page) {
  await page.evaluate(({ cursorId, rippleId }) => {
    const cursor = document.getElementById(cursorId)
    const ripple = document.getElementById(rippleId)
    if (!cursor || !ripple) return

    const top = parseFloat(cursor.style.top)
    const left = parseFloat(cursor.style.left)

    ripple.style.transition = 'none'
    ripple.style.opacity = '0'
    ripple.style.transform = `translate(-20px, -20px) scale(0.3)`
    ripple.style.top = `${top}px`
    ripple.style.left = `${left}px`

    requestAnimationFrame(() => {
      ripple.style.transition = 'opacity 0.3s, transform 0.3s'
      ripple.style.opacity = '0.8'
      ripple.style.transform = `translate(-20px, -20px) scale(1)`

      setTimeout(() => {
        ripple.style.opacity = '0'
        ripple.style.transform = `translate(-20px, -20px) scale(0.3)`
      }, 200)
    })
  }, { cursorId: CURSOR_ID, rippleId: RIPPLE_ID })
}

/**
 * Move the cursor to an element and click it.
 * Returns after the click event has fired.
 */
export async function clickElement(page, selector, { moveDuration = 400, clickDelay = 80 } = {}) {
  const box = await page.locator(selector).first().boundingBox()
  if (!box) throw new Error(`Element not found: ${selector}`)

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  await moveTo(page, x, y, { duration: moveDuration })
  await page.waitForTimeout(clickDelay)
  await ripple(page)
  await page.locator(selector).first().click({ force: true })
  await page.waitForTimeout(100)
}

/**
 * Move cursor to an element and press-and-hold (pointerdown),
 * wait for the given duration, then release (pointerup).
 */
export async function pressAndHold(page, selector, { moveDuration = 400, holdDuration = 1500, side = 'left' } = {}) {
  const box = await page.locator(selector).first().boundingBox()
  if (!box) throw new Error(`Element not found: ${selector}`)

  // side: 'left' clicks left quarter, 'right' clicks right quarter
  const xOffset = side === 'right' ? box.width * 0.75 : box.width * 0.25
  const x = box.x + xOffset
  const y = box.y + box.height / 2

  await moveTo(page, x, y, { duration: moveDuration })
  await page.waitForTimeout(80)
  await ripple(page)

  // Dispatch pointerdown at the computed position
  await page.locator(selector).first().dispatchEvent('pointerdown', {
    clientX: x,
    clientY: y,
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
  })
  await page.waitForTimeout(holdDuration)

  // Release
  await page.locator(selector).first().dispatchEvent('pointerup', {
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
  })
  await page.waitForTimeout(100)
}

/**
 * Move cursor to an input, click it, clear it, then type text character by character.
 */
export async function typeInto(page, selector, text, { moveDuration = 300, typeDelay = 40 } = {}) {
  await clickElement(page, selector, { moveDuration })
  await page.locator(selector).first().fill('')
  await page.locator(selector).first().pressSequentially(text, { delay: typeDelay })
}

/**
 * Scroll a container so a target element is visible.
 */
export async function scrollPanelTo(page, targetSelector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, targetSelector)
  await page.waitForTimeout(400)
}
