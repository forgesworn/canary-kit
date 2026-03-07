// docs/record/overlay.js — Text overlay injection for hook/close screens

/**
 * Show a full-screen text overlay with fade-in animation.
 *
 * @param {import('playwright').Page} page
 * @param {object} opts
 * @param {string} opts.title - Main title text
 * @param {string} [opts.subtitle] - Subtitle text
 * @param {string} [opts.background] - Background colour (default: semi-transparent black)
 * @param {number} [opts.duration] - How long to show in ms (default: 3000)
 */
export async function showOverlay(page, { title, subtitle, background, duration = 3000 }) {
  await page.evaluate(({ title, subtitle, background }) => {
    const overlay = document.createElement('div')
    overlay.id = '__demo-overlay'
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: background || 'rgba(0, 0, 0, 0.85)',
      zIndex: '999990',
      opacity: '0',
      transition: 'opacity 0.5s ease-in',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    })

    const h1 = document.createElement('h1')
    Object.assign(h1.style, {
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      margin: '0 2rem',
      lineHeight: '1.3',
    })
    h1.textContent = title
    overlay.appendChild(h1)

    if (subtitle) {
      const p = document.createElement('p')
      Object.assign(p.style, {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.2rem',
        fontWeight: '400',
        textAlign: 'center',
        margin: '1rem 2rem 0',
      })
      p.textContent = subtitle
      overlay.appendChild(p)
    }

    document.body.appendChild(overlay)
    requestAnimationFrame(() => { overlay.style.opacity = '1' })
  }, { title, subtitle, background })

  await page.waitForTimeout(duration)
}

/**
 * Fade out and remove the overlay.
 */
export async function hideOverlay(page) {
  await page.evaluate(() => {
    const overlay = document.getElementById('__demo-overlay')
    if (!overlay) return
    overlay.style.opacity = '0'
    setTimeout(() => overlay.remove(), 500)
  })
  await page.waitForTimeout(600)
}

/**
 * Show a code block overlay (for npm install, etc.)
 */
export async function showCodeOverlay(page, { code, title, duration = 3000 }) {
  await page.evaluate(({ code, title }) => {
    const overlay = document.createElement('div')
    overlay.id = '__demo-overlay'
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.9)',
      zIndex: '999990',
      opacity: '0',
      transition: 'opacity 0.5s ease-in',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    })

    if (title) {
      const h1 = document.createElement('h1')
      Object.assign(h1.style, {
        color: 'white',
        fontSize: '2rem',
        fontWeight: '700',
        margin: '0 0 1.5rem',
      })
      h1.textContent = title
      overlay.appendChild(h1)
    }

    const pre = document.createElement('pre')
    Object.assign(pre.style, {
      color: '#4ade80',
      fontSize: '1.4rem',
      fontFamily: 'ui-monospace, monospace',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '1rem 2rem',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    })
    pre.textContent = code
    overlay.appendChild(pre)

    document.body.appendChild(overlay)
    requestAnimationFrame(() => { overlay.style.opacity = '1' })
  }, { code, title })

  await page.waitForTimeout(duration)
}
