// app/panels/beacons.ts — Beacons panel: MapLibre map with geohash area circles

import { getState, updateGroup } from '../state.js'
import { broadcastAction } from '../sync.js'
import { deriveBeaconKey, encryptBeacon } from 'canary-kit'
import { encode, decode, precisionToRadius } from 'geohash-kit'

let map: any = null
let maplibregl: typeof import('maplibre-gl') | null = null
let markers: Record<string, any> = {}
let positions: Record<string, { lat: number; lon: number; geohash: string; precision: number; timestamp: number }> = {}
let encryptedPayloads: Record<string, string> = {}
let geoWatchId: number | null = null
let duressMembers = new Set<string>()
let mapReady = false

const PRECISION_LABELS: Record<number, string> = {
  1: '2,500 km — continental',
  2: '630 km — country',
  3: '78 km — region',
  4: '20 km — city',
  5: '2.4 km — neighbourhood',
  6: '610 m — street',
  7: '76 m — building',
  8: '19 m — door',
  9: '2.4 m — exact',
}

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

/** Build GeoJSON FeatureCollection for all member circles. */
function buildCircleFeatures(): any {
  return {
    type: 'FeatureCollection',
    features: Object.entries(positions).map(([pubkey, pos]) => ({
      type: 'Feature',
      properties: { pubkey, duress: duressMembers.has(pubkey) },
      geometry: {
        type: 'Polygon',
        coordinates: [circlePolygon(pos.lat, pos.lon, precisionToRadius(pos.precision))],
      },
    })),
  }
}

// ── MapLibre loading ──────────────────────────────────────────

const MAPLIBRE_CDN_JS = 'https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js'
const MAPLIBRE_CDN_CSS = 'https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css'

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
  document.head.appendChild(link)

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = MAPLIBRE_CDN_JS
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
  const precision = group.beaconPrecision ?? 4

  // If map is already initialised, skip re-rendering to preserve the live
  // MapLibre instance (replacing innerHTML would orphan the GL context).
  if (map && document.getElementById('beacon-map')) return

  container.innerHTML = `
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. Under duress, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when a duress signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem;">
        <button class="btn ${geoWatchId !== null ? 'btn--primary' : ''}" id="beacon-toggle-btn" type="button">
          ${geoWatchId !== null ? 'Sharing Location' : 'Share Location'}
        </button>
        ${geoWatchId !== null ? '<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>' : ''}
      </div>
      <div style="margin-top: 0.75rem;">
        <label class="input-label" style="margin-bottom: 0.25rem;">
          <span>Location Precision</span>
        </label>
        <input type="range" id="precision-slider" min="1" max="9" value="${precision}" style="width: 100%; accent-color: #f59e0b;" />
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.25rem;">
          <span class="settings-hint" id="precision-label">${PRECISION_LABELS[precision]}</span>
          <span class="settings-hint" style="opacity: 0.5; font-size: 0.7rem;">Duress: full GPS</span>
        </div>
      </div>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `

  // ── Precision slider ────────────────────────────────────────
  const slider = container.querySelector<HTMLInputElement>('#precision-slider')
  const precisionLabel = container.querySelector<HTMLElement>('#precision-label')
  slider?.addEventListener('input', () => {
    const val = Number(slider.value)
    if (precisionLabel) precisionLabel.textContent = PRECISION_LABELS[val] ?? ''
  })
  slider?.addEventListener('change', () => {
    const val = Number(slider.value)
    const { activeGroupId: gid } = getState()
    if (gid) {
      updateGroup(gid, { beaconPrecision: val })
      // Restart watch with new precision if active
      if (geoWatchId !== null) {
        stopBeaconWatch()
        startBeaconWatch()
      }
    }
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

    // Add GeoJSON source for geohash area circles
    map.addSource('geohash-circles', {
      type: 'geojson',
      data: buildCircleFeatures(),
    })

    // Fill layer — amber for normal, red for duress
    map.addLayer({
      id: 'geohash-fill',
      type: 'fill',
      source: 'geohash-circles',
      paint: {
        'fill-color': ['case', ['get', 'duress'], '#f87171', '#f59e0b'],
        'fill-opacity': ['case', ['get', 'duress'], 0.25, 0.12],
      },
    })

    // Stroke layer
    map.addLayer({
      id: 'geohash-stroke',
      type: 'line',
      source: 'geohash-circles',
      paint: {
        'line-color': ['case', ['get', 'duress'], '#f87171', '#f59e0b'],
        'line-width': 2,
        'line-opacity': ['case', ['get', 'duress'], 0.8, 0.5],
      },
    })
  })
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
  const geohashPrecision = group.beaconPrecision || 4

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
    () => { /* geolocation error — silent */ },
    { enableHighAccuracy: false, maximumAge: 60000 },
  )
}

// ── Markers (small center dots) ───────────────────────────────

function updateMapMarker(pubkey: string, lat: number, lon: number): void {
  if (!map || !maplibregl) return
  const isDuress = duressMembers.has(pubkey)

  if (markers[pubkey]) {
    markers[pubkey].setLngLat([lon, lat])
  } else {
    const el = document.createElement('div')
    el.style.width = '10px'
    el.style.height = '10px'
    el.style.borderRadius = '50%'
    el.style.background = isDuress ? '#f87171' : '#f59e0b'
    el.style.border = '2px solid #0a0e17'
    el.style.zIndex = '2'
    markers[pubkey] = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map)
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

function updateBeaconList(): void {
  const listEl = document.getElementById('beacon-list')
  if (!listEl) return

  const entries = Object.entries(positions).map(([pk, pos]) => {
    const encrypted = encryptedPayloads[pk]
    const truncated = encrypted ? encrypted.slice(0, 24) + '\u2026' : 'n/a'
    return `
      <div class="beacon-entry">
        <span class="beacon-member">${pk.slice(0, 8)}\u2026</span>
        <span class="beacon-geohash">${pos.geohash}</span>
        <span class="beacon-encrypted" title="${encrypted ?? ''}">${truncated}</span>
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
