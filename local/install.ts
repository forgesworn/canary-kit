interface InstallPrompt extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> }
export function mountInstall(open: (name: string) => void, home: () => void) {
  const get = (id: string) => document.getElementById(id)!
  let prompt: InstallPrompt | undefined
  let returnView = 'welcome'
  const installed = () => matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const embedded = /FBAN|FBAV|Instagram|Line\/|; wv\)/i.test(navigator.userAgent)
  function render(platform = ios ? 'iphone' : 'android') {
    get('install-steps-iphone').hidden = platform !== 'iphone'
    get('install-steps-android').hidden = platform !== 'android'
    get('install-native').hidden = !prompt || installed()
    get('install-state').textContent = installed() ? 'You’re using the home-screen app.' : embedded ? 'This looks like an in-app browser. Open the page in your usual browser first.' : 'Set up here before your first private exchange.'
    get('install-copy').hidden = location.protocol !== 'https:'
    get('install-existing').hidden = !localStorage.getItem('canary.encrypted-vault.v1')
  }
  function show() { returnView = document.querySelector<HTMLElement>('.view:not([hidden])')?.id ?? 'welcome'; render(); open('install-guide') }
  for (const id of ['install-welcome', 'install-people', 'install-connect']) get(id).addEventListener('click', show)
  get('install-back').addEventListener('click', () => { if (returnView === 'connect-start') open(returnView); else home() })
  get('install-iphone').addEventListener('click', () => render('iphone'))
  get('install-android').addEventListener('click', () => render('android'))
  get('install-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.origin + location.pathname); get('install-state').textContent = 'Website address copied. Open it in your usual browser. It contains no pairing secret.' }
    catch { get('install-state').textContent = 'Open the address shown in your browser, without anything after #.' }
  })
  get('install-native').addEventListener('click', async () => {
    const available = prompt
    if (!available) return
    prompt = undefined
    try { await available.prompt(); await available.userChoice } finally { render() }
  })
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); prompt = event as InstallPrompt; render() })
  window.addEventListener('appinstalled', () => { prompt = undefined; render() })
  get('install-welcome').hidden = installed()
  if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
    // No pair, account, key or fragment is included in these fixed public URLs.
    void navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).then(registration => {
      const state = () => { get('offline-state').textContent = registration.active ? 'App available offline · encrypted on this device' : 'Preparing offline access…' }
      state()
      navigator.serviceWorker.addEventListener('controllerchange', state)
      registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', state))
    }).catch(() => { get('offline-state').textContent = 'Offline access unavailable. Keep this page open for a check.' })
  }
  return { show }
}
