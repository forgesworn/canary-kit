import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
const candidateVersion = process.env.SIGNET_LOGIN_CANDIDATE_VERSION?.trim()

const declaredRange = pkg.devDependencies?.['signet-login'] ?? pkg.dependencies?.['signet-login']
const lockedVersion = lock.packages?.['node_modules/signet-login']?.version

if (!declaredRange) {
  console.error('signet-login is not declared in package.json')
  process.exit(1)
}

if (!lockedVersion) {
  console.error('signet-login is not locked in package-lock.json')
  process.exit(1)
}

if (candidateVersion) {
  const installed = JSON.parse(readFileSync(resolve(root, 'node_modules/signet-login/package.json'), 'utf8'))
  if (installed.version !== candidateVersion) {
    console.error(`Canary must test the Signet Login candidate ${candidateVersion}; installed ${installed.version}.`)
    process.exit(1)
  }

  console.log(`signet-login candidate is installed: ${candidateVersion}`)
  process.exit(0)
}

const latest = execFileSync('npm', ['view', 'signet-login', 'version'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim()

const declaredVersion = declaredRange.replace(/^[~^=v\s]+/, '')
const failures = []

if (declaredVersion !== latest) {
  failures.push(`package.json declares ${declaredRange}, latest is ${latest}`)
}

if (lockedVersion !== latest) {
  failures.push(`package-lock.json locks ${lockedVersion}, latest is ${latest}`)
}

if (failures.length > 0) {
  console.error('Canary must track the latest released signet-login.')
  for (const failure of failures) console.error(`- ${failure}`)
  console.error(`Run: npm install signet-login@${latest} --save-dev`)
  process.exit(1)
}

console.log(`signet-login is current: ${latest}`)
