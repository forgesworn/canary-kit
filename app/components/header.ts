// app/components/header.ts — Header component: brand, theme toggle, relay status

import { getState, update } from '../state.js'

// ── Types ──────────────────────────────────────────────────────

type Theme = 'dark' | 'light'

// ── Internal helpers ───────────────────────────────────────────

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme): void {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

function updateToggleLabel(btn: HTMLButtonElement): void {
  const theme = currentTheme()
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
  btn.textContent = '◐'
}

function handleThemeToggle(btn: HTMLButtonElement): void {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  update({ settings: { ...getState().settings, theme: next } })
  updateToggleLabel(btn)
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Render the header chrome into the given container element.
 * Produces: brand div, nav tabs, relay status indicator, and theme toggle button.
 */
export function renderHeader(container: HTMLElement): void {
  const view = getState().view

  container.innerHTML = `
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY</div>
    <nav class="header__nav" id="header-nav">
      <button class="header__nav-tab${view === 'groups' ? ' header__nav-tab--active' : ''}" data-view="groups">Groups</button>
      <button class="header__nav-tab${view === 'call-demo' ? ' header__nav-tab--active' : ''}" data-view="call-demo">Call Demo</button>
    </nav>
    <div class="header__actions">
      <span id="relay-status" hidden>
        <span class="relay-dot"></span>
        <span class="relay-label"></span>
      </span>
      <button class="theme-toggle" id="theme-toggle" aria-label="Switch to light mode">&#9680;</button>
    </div>
  `

  const btn = container.querySelector<HTMLButtonElement>('#theme-toggle')
  if (btn) {
    updateToggleLabel(btn)
    btn.addEventListener('click', () => handleThemeToggle(btn))
  }

  const nav = container.querySelector<HTMLElement>('#header-nav')
  nav?.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-view]')
    if (!tab) return
    const targetView = tab.dataset.view as 'groups' | 'call-demo'
    if (targetView && targetView !== getState().view) {
      update({ view: targetView })
    }
  })
}

/**
 * Update the relay status indicator's visibility and appearance.
 * When connected: shows a green dot and "N relays" label.
 * When disconnected: shows a grey dot and "offline" label.
 */
export function updateRelayStatus(connected: boolean, count: number): void {
  const indicator = document.getElementById('relay-status')
  if (!indicator) return

  const dot = indicator.querySelector<HTMLElement>('.relay-dot')
  const label = indicator.querySelector<HTMLElement>('.relay-label')

  if (connected && count > 0) {
    indicator.removeAttribute('hidden')
    if (dot) dot.classList.add('relay-dot--connected')
    if (dot) dot.classList.remove('relay-dot--offline')
    if (label) label.textContent = `${count} relay${count === 1 ? '' : 's'}`
  } else if (!connected) {
    indicator.removeAttribute('hidden')
    if (dot) dot.classList.remove('relay-dot--connected')
    if (dot) dot.classList.add('relay-dot--offline')
    if (label) label.textContent = 'offline'
  } else {
    // connected but count === 0 — hide entirely
    indicator.setAttribute('hidden', '')
  }
}
