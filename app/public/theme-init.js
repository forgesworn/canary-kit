// theme-init.js — Restore theme before first paint to avoid flash.
// Loaded as a blocking script in index.html, before the main app bundle.
try {
  var s = localStorage.getItem('canary:settings')
  if (s && JSON.parse(s).theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  }
} catch (e) { /* ignore — defaults to dark */ }
