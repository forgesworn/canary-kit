import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const manifestPath = resolve(root, 'conformance/signet-feature-conformance.json')
const packagePath = resolve(root, 'package.json')

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))

const allowedStatuses = new Set(['covered', 'sdk-covered', 'not-applicable', 'gap'])
const allowedGateTypes = new Set(['file', 'npmScript', 'workflow', 'external'])
const failures = []
const seen = new Set()

function fail(message) {
  failures.push(message)
}

function hasText(path, needle) {
  return readFileSync(resolve(root, path), 'utf8').includes(needle)
}

if (manifest.schemaVersion !== 1) {
  fail(`schemaVersion must be 1, got ${manifest.schemaVersion}`)
}

if (!existsSync(resolve(root, manifest.matrixDoc ?? ''))) {
  fail(`matrixDoc is missing: ${manifest.matrixDoc}`)
}

if (!Array.isArray(manifest.features) || manifest.features.length === 0) {
  fail('features must be a non-empty array')
}

for (const feature of manifest.features ?? []) {
  const prefix = feature.id ? `feature ${feature.id}` : 'feature <missing id>'

  if (!feature.id || typeof feature.id !== 'string') {
    fail(`${prefix}: id is required`)
    continue
  }

  if (seen.has(feature.id)) fail(`${prefix}: duplicate id`)
  seen.add(feature.id)

  if (!feature.label || typeof feature.label !== 'string') {
    fail(`${prefix}: label is required`)
  } else if (!hasText(manifest.matrixDoc, feature.label)) {
    fail(`${prefix}: matrix doc does not mention label "${feature.label}"`)
  }

  for (const project of ['signetLogin', 'canary', 'mySignet']) {
    const status = feature.projects?.[project]
    if (!allowedStatuses.has(status)) {
      fail(`${prefix}: projects.${project} has invalid status ${JSON.stringify(status)}`)
    }
  }

  if (feature.requiredForCanary === true && feature.projects?.canary !== 'covered') {
    fail(`${prefix}: requiredForCanary features must have Canary status "covered"`)
  }

  if (feature.requiredForCanary === false && !feature.decision) {
    fail(`${prefix}: non-required Canary feature must record a decision`)
  }

  if (!Array.isArray(feature.gates) || feature.gates.length === 0) {
    fail(`${prefix}: gates must be a non-empty array`)
    continue
  }

  let localGateCount = 0

  for (const gate of feature.gates) {
    if (!allowedGateTypes.has(gate.type)) {
      fail(`${prefix}: invalid gate type ${JSON.stringify(gate.type)}`)
      continue
    }

    if (gate.type === 'file') {
      localGateCount++
      if (!gate.path || !existsSync(resolve(root, gate.path))) {
        fail(`${prefix}: missing gate file ${gate.path}`)
      }
    }

    if (gate.type === 'npmScript') {
      localGateCount++
      if (!gate.name || typeof pkg.scripts?.[gate.name] !== 'string') {
        fail(`${prefix}: missing npm script ${gate.name}`)
      }
    }

    if (gate.type === 'workflow') {
      localGateCount++
      if (!gate.path || !existsSync(resolve(root, gate.path))) {
        fail(`${prefix}: missing workflow ${gate.path}`)
      } else if (gate.contains && !hasText(gate.path, gate.contains)) {
        fail(`${prefix}: workflow ${gate.path} does not contain ${JSON.stringify(gate.contains)}`)
      }
    }

    if (gate.type === 'external' && (!gate.repo || !gate.command)) {
      fail(`${prefix}: external gates require repo and command`)
    }
  }

  if (feature.requiredForCanary === true && localGateCount === 0) {
    fail(`${prefix}: required Canary features need at least one local gate`)
  }
}

if (failures.length > 0) {
  console.error('Signet conformance manifest failed.')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Signet conformance manifest covers ${manifest.features.length} features.`)
