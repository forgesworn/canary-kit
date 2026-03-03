// app/views/call-simulation.ts — Call verification demo: two-party simulation

import { createSession, generateSeed, SESSION_PRESETS, type Session } from 'canary-kit/session'

interface ScenarioConfig {
  label: string
  namespace: string
  roles: [string, string]
  preset: 'call' | 'handoff'
  encoding?: 'words' | 'pin'
}

const SCENARIOS: Record<string, ScenarioConfig> = {
  insurance: {
    label: 'Insurance',
    namespace: 'aviva',
    roles: ['caller', 'agent'],
    preset: 'call',
  },
  banking: {
    label: 'Banking',
    namespace: 'barclays',
    roles: ['customer', 'agent'],
    preset: 'call',
  },
  rideshare: {
    label: 'Rideshare',
    namespace: 'dispatch',
    roles: ['requester', 'provider'],
    preset: 'handoff',
    encoding: 'pin',
  },
}

let _seed = generateSeed()
let _scenario: ScenarioConfig = SCENARIOS.insurance
let _callerSession: Session
let _agentSession: Session
let _tickInterval: ReturnType<typeof setInterval> | null = null
let _handoffCounter = 1

function buildSessions(): void {
  const isHandoff = _scenario.preset === 'handoff'
  const encoding = _scenario.encoding === 'pin'
    ? { format: 'pin' as const, digits: 4 }
    : undefined

  const base = {
    secret: _seed,
    namespace: _scenario.namespace,
    roles: _scenario.roles as [string, string],
    preset: _scenario.preset as 'call' | 'handoff',
    ...(isHandoff ? { counter: _handoffCounter } : {}),
    ...(encoding ? { encoding } : {}),
  }

  _callerSession = createSession({ ...base, myRole: _scenario.roles[0] })
  _agentSession = createSession({ ...base, myRole: _scenario.roles[1] })
}

buildSessions()

function clearTick(): void {
  if (_tickInterval !== null) {
    clearInterval(_tickInterval)
    _tickInterval = null
  }
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0s'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function secondsUntilRotation(rotationSeconds: number): number {
  if (rotationSeconds === 0) return 0
  const nowSec = Math.floor(Date.now() / 1000)
  const counter = Math.floor(nowSec / rotationSeconds)
  const nextRotation = (counter + 1) * rotationSeconds
  return Math.max(0, nextRotation - nowSec)
}

export function renderCallSimulation(container: HTMLElement): void {
  clearTick()

  const nowSec = Math.floor(Date.now() / 1000)
  const isHandoff = _scenario.preset === 'handoff'
  const rotationSeconds = isHandoff ? 0 : SESSION_PRESETS[_scenario.preset].rotationSeconds
  const secsLeft = secondsUntilRotation(rotationSeconds)
  const progressPct = rotationSeconds > 0
    ? Math.min(100, ((rotationSeconds - secsLeft) / rotationSeconds) * 100)
    : 100

  const roleA = _scenario.roles[0]
  const roleB = _scenario.roles[1]

  container.innerHTML = `
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(SCENARIOS).map(([key, s]) =>
            `<button class="btn call-sim__scenario-btn${_scenario === s ? ' call-sim__scenario-btn--active' : ''}" data-scenario="${key}">${s.label}</button>`
          ).join('')}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${roleA.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your word:</span>
            <div class="call-sim__token call-sim__token--mine" id="caller-my-token">${_callerSession.myToken(nowSec)}</div>
          </div>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Expect to hear:</span>
            <div class="call-sim__token call-sim__token--theirs" id="caller-their-token">${_callerSession.theirToken(nowSec)}</div>
          </div>
          ${!isHandoff ? `
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${progressPct}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${formatCountdown(secsLeft)}</span>
          ` : '<span class="call-sim__countdown">Single-use</span>'}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="caller-verify-input" placeholder="Type ${roleB}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="caller-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="caller-result" hidden></div>
        </div>

        <div class="call-sim__divider"></div>

        <div class="call-sim__panel call-sim__panel--agent">
          <h3 class="call-sim__role">${roleB.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your word:</span>
            <div class="call-sim__token call-sim__token--mine" id="agent-my-token">${_agentSession.myToken(nowSec)}</div>
          </div>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Expect to hear:</span>
            <div class="call-sim__token call-sim__token--theirs" id="agent-their-token">${_agentSession.theirToken(nowSec)}</div>
          </div>
          ${!isHandoff ? `
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${progressPct}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${formatCountdown(secsLeft)}</span>
          ` : '<span class="call-sim__countdown">Single-use</span>'}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="agent-verify-input" placeholder="Type ${roleA}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="agent-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="agent-result" hidden></div>
        </div>
      </div>

      <div class="call-sim__footer">
        <span class="call-sim__meta">Namespace: <strong>${_scenario.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${isHandoff ? 'single-use' : rotationSeconds + 's'}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${_scenario.encoding ?? 'words'}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${isHandoff ? '0' : SESSION_PRESETS[_scenario.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `

  // Wire scenarios
  container.querySelector('#call-scenarios')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-scenario]')
    if (!btn) return
    const key = btn.dataset.scenario!
    if (SCENARIOS[key] && SCENARIOS[key] !== _scenario) {
      _scenario = SCENARIOS[key]
      buildSessions()
      renderCallSimulation(container)
    }
  })

  // Wire reset seed
  container.querySelector('#call-reset-seed')?.addEventListener('click', () => {
    _seed = generateSeed()
    if (_scenario.preset === 'handoff') _handoffCounter++
    buildSessions()
    renderCallSimulation(container)
  })

  // Wire verify buttons
  function wireVerify(inputId: string, btnId: string, resultId: string, session: Session): void {
    const input = container.querySelector<HTMLInputElement>(`#${inputId}`)
    const btn = container.querySelector<HTMLButtonElement>(`#${btnId}`)
    const resultEl = container.querySelector<HTMLElement>(`#${resultId}`)
    if (!input || !btn || !resultEl) return

    function doVerify(): void {
      const spoken = input!.value.trim()
      if (!spoken) return
      const result = session.verify(spoken)
      resultEl!.hidden = false
      resultEl!.className = 'call-sim__result'
      if (result.status === 'valid') {
        resultEl!.classList.add('call-sim__result--valid')
        resultEl!.textContent = 'Verified ✓'
      } else if (result.status === 'duress') {
        resultEl!.classList.add('call-sim__result--duress')
        resultEl!.textContent = 'DURESS DETECTED — silent alert triggered'
      } else {
        resultEl!.classList.add('call-sim__result--invalid')
        resultEl!.textContent = 'Failed ✗'
      }
      setTimeout(() => { resultEl!.hidden = true }, 3000)
    }

    btn.addEventListener('click', doVerify)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doVerify() })
  }

  wireVerify('caller-verify-input', 'caller-verify-btn', 'caller-result', _callerSession)
  wireVerify('agent-verify-input', 'agent-verify-btn', 'agent-result', _agentSession)

  // Populate directional pair display
  const pairEl = container.querySelector<HTMLElement>('#pair-display')
  if (pairEl) {
    const pair = _callerSession.pair(nowSec)
    const entries = Object.entries(pair).map(([role, token]) => `${role}: ${token}`).join(' | ')
    pairEl.textContent = entries
  }

  // Countdown tick
  if (!isHandoff && rotationSeconds > 0) {
    _tickInterval = setInterval(() => {
      const remaining = secondsUntilRotation(rotationSeconds)
      const pct = Math.min(100, ((rotationSeconds - remaining) / rotationSeconds) * 100)

      const cp = container.querySelector<HTMLElement>('#caller-progress')
      const ap = container.querySelector<HTMLElement>('#agent-progress')
      const cc = container.querySelector<HTMLElement>('#caller-countdown')
      const ac = container.querySelector<HTMLElement>('#agent-countdown')

      if (cp) cp.style.width = `${pct}%`
      if (ap) ap.style.width = `${pct}%`
      if (cc) cc.textContent = formatCountdown(remaining)
      if (ac) ac.textContent = formatCountdown(remaining)

      const pairDisplay = container.querySelector<HTMLElement>('#pair-display')
      if (pairDisplay) {
        const pair = _callerSession.pair()
        const entries = Object.entries(pair).map(([role, token]) => `${role}: ${token}`).join(' | ')
        pairDisplay.textContent = entries
      }

      if (remaining === 0) {
        clearTick()
        renderCallSimulation(container)
      }
    }, 1000)
  }
}

export function destroyCallSimulation(): void {
  clearTick()
}
