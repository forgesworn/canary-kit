// Run the same phone acceptance journey against the deployed app.
process.env.CANARY_MOBILE_URL ??= 'https://canary-words.cocoacod256.chatgpt.site/'
await import('./test-mobile.mjs')
