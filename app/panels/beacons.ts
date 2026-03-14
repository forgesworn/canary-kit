// app/panels/beacons.ts — Beacons panel: MapLibre map with geohash area circles

import { getState, updateGroup } from '../state.js'
import { broadcastAction } from '../sync.js'
import { deriveBeaconKey, encryptBeacon } from 'canary-kit'
import { encode, decode, precisionToRadius } from 'geohash-kit'
import { getCachedName, getCachedProfile } from '../nostr/profiles.js'
import { escapeHtml } from '../utils/escape.js'

let map: any = null
let maplibregl: typeof import('maplibre-gl') | null = null
let markers: Record<string, any> = {}
let positions: Record<string, { lat: number; lon: number; geohash: string; precision: number; timestamp: number }> = {}
let encryptedPayloads: Record<string, string> = {}
let geoWatchId: number | null = null
let duressMembers = new Set<string>()
let mapReady = false

/** Named precision presets — human-readable, ordered from least to most precise. */
const PRECISION_PRESETS = [
  { label: 'City', value: 4, hint: '~20 km' },
  { label: 'Neighbourhood', value: 5, hint: '~2.4 km' },
  { label: 'Street', value: 6, hint: '~610 m' },
  { label: 'Exact', value: 9, hint: '~2 m' },
] as const

// ── Circle geometry helper ────────────────────────────────────

const EARTH_RADIUS = 6_371_000 // metres

/** Generate a GeoJSON polygon approximating a circle on the map. */
function circlePolygon(lat: number, lon: number, radiusM: number, segments = 48): [number, number][] {
  const coords: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI
    const dLat = (radiusM / EARTH_RADIUS) * Math.cos(angle) * (180 / Math.PI)
    const dLon = (radiusM / (EARTH_RADIUS * Math.cos(lat * Math.PI / 180))) * Math.sin(angle) * (180 / Math.PI)
    coords.push([lon + dLon, lat + dLat])
  }
  return coords
}

/** Stable hue per member — deterministic from pubkey so each person is always the same colour. */
const MEMBER_HUES = [210, 140, 30, 280, 60, 330, 170, 0] // blue, green, orange, purple, yellow, pink, teal, red

function memberHue(pubkey: string): number {
  const { groups, activeGroupId } = getState()
  const group = activeGroupId ? groups[activeGroupId] : null
  const members = group?.members ?? []
  const idx = members.indexOf(pubkey)
  return MEMBER_HUES[(idx >= 0 ? idx : 0) % MEMBER_HUES.length]
}

/**
 * Get a member's display colour based on liveness status + their personal hue.
 * Healthy = saturated personal colour, overdue = desaturated, missed = grey, duress = red.
 */
function memberColour(pubkey: string): string {
  if (duressMembers.has(pubkey)) return '#f87171' // red — duress
  const { groups, activeGroupId } = getState()
  const group = activeGroupId ? groups[activeGroupId] : null
  if (!group) return `hsl(${memberHue(pubkey)}, 70%, 55%)`
  const lastCheckin = group.livenessCheckins[pubkey] ?? 0
  if (lastCheckin === 0) return `hsl(${memberHue(pubkey)}, 20%, 50%)` // desaturated — never checked in
  const elapsed = Math.floor(Date.now() / 1000) - lastCheckin
  const interval = group.livenessInterval
  if (elapsed <= interval) return `hsl(${memberHue(pubkey)}, 70%, 55%)` // vibrant — healthy
  if (elapsed <= interval * 1.25) return `hsl(${memberHue(pubkey)}, 40%, 50%)` // fading — overdue
  return '#94a3b8' // grey — missed
}

/** Build GeoJSON FeatureCollection for all member circles. */
function buildCircleFeatures(): any {
  return {
    type: 'FeatureCollection',
    features: Object.entries(positions).map(([pubkey, pos]) => ({
      type: 'Feature',
      properties: { pubkey, duress: duressMembers.has(pubkey), colour: memberColour(pubkey) },
      geometry: {
        type: 'Polygon',
        coordinates: [circlePolygon(pos.lat, pos.lon, precisionToRadius(pos.precision))],
      },
    })),
  }
}

// ── MapLibre loading ──────────────────────────────────────────

// Pinned version + SRI hashes to prevent supply-chain attacks via CDN.
const MAPLIBRE_VERSION = '5.19.0'
const MAPLIBRE_CDN_JS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`
const MAPLIBRE_CDN_CSS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`
const MAPLIBRE_JS_SRI = 'sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO'
const MAPLIBRE_CSS_SRI = 'sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH'

async function loadMapLibre(): Promise<typeof import('maplibre-gl')> {
  if (maplibregl) return maplibregl

  // Try npm bundle first (normal build). Falls back to CDN for single-file build.
  try {
    const [ml] = await Promise.all([
      import('maplibre-gl'),
      import('maplibre-gl/dist/maplibre-gl.css'),
    ])
    maplibregl = ml
    return ml
  } catch {
    // Not bundled (single-file build) — load from CDN
  }

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = MAPLIBRE_CDN_CSS
  link.integrity = MAPLIBRE_CSS_SRI
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = MAPLIBRE_CDN_JS
    script.integrity = MAPLIBRE_JS_SRI
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })

  maplibregl = (window as any).maplibregl
  return maplibregl!
}

// ── Render ────────────────────────────────────────────────────

export async function renderBeacons(container: HTMLElement): Promise<void> {
  const { groups, activeGroupId } = getState()
  if (!activeGroupId || !groups[activeGroupId]) {
    if (map) { map.remove(); map = null; mapReady = false }
    container.innerHTML = ''
    return
  }

  const group = groups[activeGroupId]
  const precision = group.beaconPrecision ?? 5

  // Restore persisted positions into the in-memory map (runs once per session)
  if (Object.keys(positions).length === 0 && group.lastPositions) {
    for (const [pk, pos] of Object.entries(group.lastPositions)) {
      positions[pk] = pos
    }
  }

  // If map is already initialised, skip re-rendering to preserve the live
  // MapLibre instance (replacing innerHTML would orphan the GL context).
  if (map && document.getElementById('beacon-map')) return

  container.innerHTML = `
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${geoWatchId !== null ? 'btn--primary' : ''}" id="beacon-toggle-btn" type="button">
          ${geoWatchId !== null ? 'Sharing Location' : 'Share Location'}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${geoWatchId !== null ? '<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>' : ''}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${PRECISION_PRESETS.map(p =>
            `<button class="segmented__btn ${precision === p.value ? 'segmented__btn--active' : ''}" data-beacon-precision="${p.value}" title="${p.hint}">${p.label}</button>`
          ).join('')}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `

  // ── Precision pickers ────────────────────────────────────────
  container.querySelectorAll('[data-beacon-precision]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = Number((btn as HTMLElement).dataset.beaconPrecision)
      const { activeGroupId: gid } = getState()
      if (gid) {
        updateGroup(gid, { beaconPrecision: val })
        if (geoWatchId !== null) {
          stopBeaconWatch()
          startBeaconWatch()
        }
        // Update active state directly — can't re-render because the map early-return blocks it
        container.querySelectorAll('[data-beacon-precision]').forEach(b => {
          b.classList.toggle('segmented__btn--active', Number((b as HTMLElement).dataset.beaconPrecision) === val)
        })
      }
    })
  })

  container.querySelector<HTMLButtonElement>('#beacon-toggle-btn')?.addEventListener('click', () => {
    if (geoWatchId !== null) {
      stopBeaconWatch()
    } else {
      startBeaconWatch()
    }
    // Re-render to update button state
    void renderBeacons(container)
  })

  container.querySelector<HTMLButtonElement>('#beacon-fit-btn')?.addEventListener('click', () => {
    fitMapToMarkers()
  })

  try {
    await loadMapLibre()
    initMap()
  } catch {
    container.querySelector('.beacon-map')!.innerHTML =
      '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>'
  }
}

function initMap(): void {
  const mapEl = document.getElementById('beacon-map')
  if (!mapEl || map || !maplibregl) return

  const isDark = document.documentElement.dataset.theme !== 'light'
  const style = isDark
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

  map = new maplibregl.Map({
    container: mapEl,
    style,
    center: [-0.1278, 51.5074], // London default
    zoom: 12,
  })

  map.on('load', () => {
    mapReady = true
    console.info('[canary:beacon] map loaded, positions to catch up:', Object.keys(positions).length)

    // Add GeoJSON source for geohash area circles
    map.addSource('geohash-circles', {
      type: 'geojson',
      data: buildCircleFeatures(),
    })

    // Fill layer — colour per member based on liveness status
    map.addLayer({
      id: 'geohash-fill',
      type: 'fill',
      source: 'geohash-circles',
      paint: {
        'fill-color': ['get', 'colour'],
        'fill-opacity': ['case', ['get', 'duress'], 0.35, 0.2],
      },
    })

    // Stroke layer
    map.addLayer({
      id: 'geohash-stroke',
      type: 'line',
      source: 'geohash-circles',
      paint: {
        'line-color': ['get', 'colour'],
        'line-width': 2.5,
        'line-opacity': ['case', ['get', 'duress'], 0.9, 0.6],
      },
    })

    // Render any positions that arrived before the map was ready
    for (const [pubkey, pos] of Object.entries(positions)) {
      updateMapMarker(pubkey, pos.lat, pos.lon)
    }
    if (Object.keys(positions).length > 0) fitMapToMarkers()
  })
}

/** Persist current positions to group state so they survive page reload. */
function persistPositions(): void {
  const { activeGroupId } = getState()
  if (!activeGroupId) return
  updateGroup(activeGroupId, { lastPositions: { ...positions } })
}

/** Update the GeoJSON source with current positions and duress state. */
function refreshCircles(): void {
  if (!map || !mapReady) return
  const source = map.getSource('geohash-circles')
  if (source) source.setData(buildCircleFeatures())
}

// ── Beacon watch ──────────────────────────────────────────────

function stopBeaconWatch(): void {
  if (geoWatchId !== null) {
    navigator.geolocation.clearWatch(geoWatchId)
    geoWatchId = null
  }
  // Remove own position from map
  const { identity } = getState()
  if (identity?.pubkey) {
    delete positions[identity.pubkey]
    delete encryptedPayloads[identity.pubkey]
    if (markers[identity.pubkey]) {
      markers[identity.pubkey].remove()
      delete markers[identity.pubkey]
    }
    refreshCircles()
    updateBeaconList()
  }
}

function startBeaconWatch(): void {
  if (geoWatchId !== null) return
  if (!('geolocation' in navigator)) return

  const { groups, activeGroupId, identity } = getState()
  if (!activeGroupId || !groups[activeGroupId] || !identity?.pubkey) return

  const group = groups[activeGroupId]
  const beaconKey = deriveBeaconKey(group.seed)

  // City-level precision (4 ≈ 20 km cell radius) — deliberately coarse
  const geohashPrecision = group.beaconPrecision || 5

  geoWatchId = navigator.geolocation.watchPosition(
    async (pos) => {
      // Encode to geohash at town level, then decode center — this snaps
      // the coordinate to the geohash cell center, discarding fine detail.
      const geohash = encode(pos.coords.latitude, pos.coords.longitude, geohashPrecision)
      const center = decode(geohash)
      const lat = center.lat
      const lon = center.lon

      const encrypted = await encryptBeacon(beaconKey, geohash, geohashPrecision)
      if (identity?.pubkey) {
        encryptedPayloads[identity.pubkey] = encrypted
        positions[identity.pubkey] = { lat, lon, geohash, precision: geohashPrecision, timestamp: Math.floor(Date.now() / 1000) }
        updateMapMarker(identity.pubkey, lat, lon)
        refreshCircles()
        fitMapToMarkers()
        updateBeaconList()
        persistPositions()

        // Broadcast geohash center (not raw GPS) to group members
        if (activeGroupId) {
          broadcastAction(activeGroupId, {
            type: 'beacon',
            lat,
            lon,
            accuracy: precisionToRadius(geohashPrecision),
            timestamp: Math.floor(Date.now() / 1000),
            opId: crypto.randomUUID(),
          })
        }
      }
    },
    (err) => { console.warn('[canary:beacon] watchPosition error', err.code, err.message) },
    { enableHighAccuracy: false, maximumAge: 60000, timeout: 15000 },
  )
}

// ── Markers (small center dots) ───────────────────────────────

function updateMapMarker(pubkey: string, lat: number, lon: number): void {
  if (!map || !maplibregl) {
    console.warn('[canary:beacon] updateMapMarker skipped — map not ready', { map: !!map, maplibregl: !!maplibregl, pubkey: pubkey.slice(0, 8) })
    return
  }
  const colour = memberColour(pubkey)
  const isDuress = duressMembers.has(pubkey)

  const name = resolveName(pubkey)
  const profile = getCachedProfile(pubkey)
  const hasPicture = !!profile?.picture
  const size = isDuress ? 40 : 32

  if (markers[pubkey]) {
    markers[pubkey].setLngLat([lon, lat])
    const wrapper = markers[pubkey].getElement()
    const dot = wrapper.querySelector('.beacon-dot') as HTMLElement
    if (dot) {
      if (!hasPicture) dot.style.background = colour
      dot.style.width = `${size}px`
      dot.style.height = `${size}px`
      dot.style.borderColor = colour
      dot.style.boxShadow = `0 0 10px ${colour}80`
      dot.style.animation = isDuress ? 'beacon-pulse 1s ease-in-out infinite' : 'none'
    }
    const label = wrapper.querySelector('.beacon-label') as HTMLElement
    if (label) label.textContent = name
  } else {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.pointerEvents = 'none'

    let dot: HTMLElement
    if (hasPicture) {
      dot = document.createElement('img')
      ;(dot as HTMLImageElement).src = profile!.picture!
      dot.style.objectFit = 'cover'
    } else {
      dot = document.createElement('div')
      dot.style.background = colour
    }
    dot.className = 'beacon-dot'
    dot.style.width = `${size}px`
    dot.style.height = `${size}px`
    dot.style.borderRadius = '50%'
    dot.style.border = `3px solid ${colour}`
    dot.style.boxShadow = `0 0 10px ${colour}80`
    dot.style.zIndex = '2'
    if (isDuress) dot.style.animation = 'beacon-pulse 1s ease-in-out infinite'
    wrapper.appendChild(dot)

    const label = document.createElement('div')
    label.className = 'beacon-label'
    label.textContent = name
    label.style.fontSize = '11px'
    label.style.fontWeight = '600'
    label.style.color = '#fff'
    label.style.textShadow = '0 1px 3px rgba(0,0,0,0.8)'
    label.style.marginTop = '2px'
    label.style.whiteSpace = 'nowrap'
    wrapper.appendChild(label)

    markers[pubkey] = new maplibregl.Marker({ element: wrapper, anchor: 'center' }).setLngLat([lon, lat]).addTo(map)
  }
}

/** Zoom map to fit all member markers with padding. */
function fitMapToMarkers(): void {
  if (!map) return
  const allPositions = Object.values(positions)
  if (allPositions.length === 0) return
  if (allPositions.length === 1) {
    map.flyTo({ center: [allPositions[0].lon, allPositions[0].lat], zoom: 13 })
    return
  }
  const lngs = allPositions.map(p => p.lon)
  const lats = allPositions.map(p => p.lat)
  map.fitBounds(
    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
    { padding: 60, maxZoom: 14 },
  )
}

function resolveName(pubkey: string): string {
  const { groups, activeGroupId, identity } = getState()
  const group = activeGroupId ? groups[activeGroupId] : null
  const isSelf = identity?.pubkey === pubkey

  let name: string | undefined
  const mn = group?.memberNames?.[pubkey]
  if (mn && mn !== 'You') name = mn
  if (!name) name = getCachedName(pubkey)

  if (isSelf) return name ? `${name} (you)` : 'You'
  if (name) return name
  return `${pubkey.slice(0, 8)}\u2026`
}

function updateBeaconList(): void {
  const listEl = document.getElementById('beacon-list')
  if (!listEl) return

  const entries = Object.entries(positions).map(([pk, pos]) => {
    const colour = memberColour(pk)
    const name = resolveName(pk)
    const prof = getCachedProfile(pk)
    const age = Math.floor(Date.now() / 1000) - pos.timestamp
    const ageLabel = age < 60 ? 'just now' : age < 3600 ? `${Math.floor(age / 60)}m ago` : `${Math.floor(age / 3600)}h ago`
    const dotHtml = prof?.picture
      ? `<img src="${escapeHtml(prof.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${colour};" />`
      : `<span style="width:8px;height:8px;border-radius:50%;background:${colour};flex-shrink:0;"></span>`
    return `
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${dotHtml}
        <span class="beacon-member" style="font-weight:500;">${escapeHtml(name)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${escapeHtml(pos.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${escapeHtml(ageLabel)}</span>
      </div>
    `
  }).join('')

  listEl.innerHTML = entries || '<p class="settings-hint">No beacons yet \u2014 enable location to start</p>'
}

// ── Duress event listener ───────────────────────────────────────

document.addEventListener('canary:duress', ((e: CustomEvent) => {
  const { members } = e.detail
  if (!members?.length) return

  for (const pk of members) {
    duressMembers.add(pk)
    setMarkerDuress(pk)
  }

  // Refresh circle colours to red for duress members
  refreshCircles()

  // Fit map to duress members' positions
  const duressPositions = members.map((pk: string) => positions[pk]).filter(Boolean)
  if (map && duressPositions.length === 1) {
    map.flyTo({ center: [duressPositions[0].lon, duressPositions[0].lat], zoom: 14 })
  } else if (map && duressPositions.length > 1) {
    const lngs = duressPositions.map((p: any) => p.lon)
    const lats = duressPositions.map((p: any) => p.lat)
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 60 },
    )
  }
}) as EventListener)

function setMarkerDuress(pubkey: string): void {
  const m = markers[pubkey]
  if (!m) return
  const el = m.getElement()
  el.style.background = '#f87171'
  el.style.width = '14px'
  el.style.height = '14px'
  el.style.boxShadow = '0 0 12px rgba(248, 113, 113, 0.6)'
}

/**
 * Send a one-shot location beacon (used by liveness check-in).
 * Starts the continuous watch if not already active, then fires a single
 * position update so the map refreshes immediately.
 */
export function sendLocationPing(): void {
  console.info('[canary:beacon] sendLocationPing called', { hasGeo: 'geolocation' in navigator, map: !!map, mapReady })

  if (!('geolocation' in navigator)) return

  const { groups, activeGroupId, identity } = getState()
  if (!activeGroupId || !groups[activeGroupId] || !identity?.pubkey) {
    console.warn('[canary:beacon] sendLocationPing: missing state', { activeGroupId, hasPubkey: !!identity?.pubkey })
    return
  }

  const group = groups[activeGroupId]
  const beaconKey = deriveBeaconKey(group.seed)
  const geohashPrecision = group.beaconPrecision || 5

  // Start the continuous watch if not already running
  if (geoWatchId === null) startBeaconWatch()

  // Also fire a single high-priority position request for immediate feedback
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      if (import.meta.env.DEV) console.info('[canary:beacon] getCurrentPosition success', { map: !!map, mapReady })

      const geohash = encode(pos.coords.latitude, pos.coords.longitude, geohashPrecision)
      const center = decode(geohash)
      const lat = center.lat
      const lon = center.lon

      const encrypted = await encryptBeacon(beaconKey, geohash, geohashPrecision)
      if (identity?.pubkey) {
        encryptedPayloads[identity.pubkey] = encrypted
        positions[identity.pubkey] = { lat, lon, geohash, precision: geohashPrecision, timestamp: Math.floor(Date.now() / 1000) }
        if (import.meta.env.DEV) console.info('[canary:beacon] position saved, updating map', { pubkey: identity.pubkey.slice(0, 8), map: !!map, mapReady, markerExists: !!markers[identity.pubkey] })
        updateMapMarker(identity.pubkey, lat, lon)
        refreshCircles()
        fitMapToMarkers()
        updateBeaconList()
        persistPositions()

        if (activeGroupId) {
          broadcastAction(activeGroupId, {
            type: 'beacon',
            lat,
            lon,
            accuracy: precisionToRadius(geohashPrecision),
            timestamp: Math.floor(Date.now() / 1000),
            opId: crypto.randomUUID(),
          })
        }
      }
    },
    (err) => {
      console.warn('[canary:beacon] getCurrentPosition FAILED', err.code, err.message)
      // Import toast dynamically to avoid circular deps
      import('../components/toast.js').then(({ showToast }) => {
        if (err.code === 1) showToast('Location permission denied', 'error', 3000)
        else if (err.code === 3) showToast('Location request timed out', 'error', 3000)
        else showToast('Could not get location', 'error', 3000)
      })
    },
    { enableHighAccuracy: false, maximumAge: 30000, timeout: 10000 },
  )
}

/**
 * Handle an incoming beacon from another member (received via sync).
 * Updates the positions map and refreshes the map if it's ready.
 */
export function handleIncomingBeacon(
  pubkey: string,
  lat: number,
  lon: number,
  accuracy: number,
  timestamp: number,
): void {
  if (import.meta.env.DEV) console.info('[canary:beacon] handleIncomingBeacon', { pubkey: pubkey.slice(0, 8), accuracy, map: !!map, mapReady })
  // Estimate geohash precision from accuracy radius
  const precision = accuracyToPrecision(accuracy)
  const geohash = encode(lat, lon, precision)

  positions[pubkey] = { lat, lon, geohash, precision, timestamp }
  updateMapMarker(pubkey, lat, lon)
  refreshCircles()
  fitMapToMarkers()
  updateBeaconList()
  persistPositions()
}

/** Map accuracy (metres) back to approximate geohash precision. */
function accuracyToPrecision(accuracyM: number): number {
  if (accuracyM <= 3) return 9
  if (accuracyM <= 20) return 8
  if (accuracyM <= 80) return 7
  if (accuracyM <= 620) return 6
  if (accuracyM <= 2500) return 5
  if (accuracyM <= 20000) return 4
  if (accuracyM <= 80000) return 3
  if (accuracyM <= 630000) return 2
  return 1
}

export function cleanupBeacons(): void {
  if (geoWatchId !== null) navigator.geolocation.clearWatch(geoWatchId)
  geoWatchId = null
  mapReady = false
  if (map) { map.remove(); map = null }
  markers = {}
  positions = {}
  encryptedPayloads = {}
  duressMembers.clear()
}
