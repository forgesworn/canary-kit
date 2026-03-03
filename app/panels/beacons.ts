// app/panels/beacons.ts — Beacons panel: MapLibre map with member location markers

import { getState } from '../state.js'
import { deriveBeaconKey, encryptBeacon } from 'canary-kit'

let map: any = null
let maplibreLoaded = false
let markers: Record<string, any> = {}
let positions: Record<string, { lat: number; lon: number; geohash: string; precision: number; timestamp: number }> = {}
let encryptedPayloads: Record<string, string> = {}
let geoWatchId: number | null = null

const MAPLIBRE_JS = 'https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.js'
const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css'

async function loadMapLibre(): Promise<void> {
  if (maplibreLoaded) return

  // Load CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = MAPLIBRE_CSS
  document.head.appendChild(link)

  // Load JS
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = MAPLIBRE_JS
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })

  maplibreLoaded = true
}

export async function renderBeacons(container: HTMLElement): Promise<void> {
  const { groups, activeGroupId } = getState()
  if (!activeGroupId || !groups[activeGroupId]) {
    if (map) { map.remove(); map = null }
    container.innerHTML = ''
    return
  }

  // If map is already initialised, skip re-rendering to preserve the live
  // MapLibre instance (replacing innerHTML would orphan the GL context).
  if (map && document.getElementById('beacon-map')) return

  container.innerHTML = `
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <div class="beacon-map" id="beacon-map" style="height: 300px; border-radius: 8px;"></div>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `

  try {
    await loadMapLibre()
    initMap()
    startBeaconWatch()
  } catch {
    container.querySelector('.beacon-map')!.innerHTML =
      '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>'
  }
}

function initMap(): void {
  const mapEl = document.getElementById('beacon-map')
  if (!mapEl || map) return

  const isDark = document.documentElement.dataset.theme !== 'light'
  const style = isDark
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

  map = new (window as any).maplibregl.Map({
    container: mapEl,
    style,
    center: [-0.1278, 51.5074], // London default
    zoom: 12,
  })
}

function startBeaconWatch(): void {
  if (geoWatchId !== null) return
  if (!('geolocation' in navigator)) return

  const { groups, activeGroupId, identity } = getState()
  if (!activeGroupId || !groups[activeGroupId] || !identity?.pubkey) return

  const group = groups[activeGroupId]
  const beaconKey = deriveBeaconKey(group.seed)

  geoWatchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      // Placeholder: lat,lon string. In production, use geohash-kit to encode a proper geohash.
      const geohash = `${lat.toFixed(4)},${lon.toFixed(4)}`
      const precision = 6

      const encrypted = await encryptBeacon(beaconKey, geohash, precision)
      if (identity?.pubkey) {
        encryptedPayloads[identity.pubkey] = encrypted
        positions[identity.pubkey] = { lat, lon, geohash, precision, timestamp: Math.floor(Date.now() / 1000) }
        updateMapMarker(identity.pubkey, lat, lon)
        updateBeaconList()
      }
    },
    () => { /* geolocation error — silent */ },
    { enableHighAccuracy: true, maximumAge: 30000 },
  )
}

function updateMapMarker(pubkey: string, lat: number, lon: number): void {
  if (!map) return
  const maplibregl = (window as any).maplibregl

  if (markers[pubkey]) {
    markers[pubkey].setLngLat([lon, lat])
  } else {
    const el = document.createElement('div')
    el.style.width = '12px'
    el.style.height = '12px'
    el.style.borderRadius = '50%'
    el.style.background = 'var(--accent)'
    el.style.border = '2px solid var(--bg-primary)'
    markers[pubkey] = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map)
  }
}

function updateBeaconList(): void {
  const listEl = document.getElementById('beacon-list')
  if (!listEl) return

  const entries = Object.entries(positions).map(([pk, pos]) => {
    const encrypted = encryptedPayloads[pk]
    const truncated = encrypted ? encrypted.slice(0, 24) + '…' : 'n/a'
    return `
      <div class="beacon-entry">
        <span class="beacon-member">${pk.slice(0, 8)}…</span>
        <span class="beacon-geohash">${pos.geohash}</span>
        <span class="beacon-encrypted" title="${encrypted ?? ''}">${truncated}</span>
      </div>
    `
  }).join('')

  listEl.innerHTML = entries || '<p class="settings-hint">No beacons yet — enable location to start</p>'
}

// ── Duress event listener ───────────────────────────────────────

document.addEventListener('canary:duress', ((e: CustomEvent) => {
  const { members } = e.detail
  if (!members?.length) return
  for (const pk of members) {
    setMarkerDuress(pk)
  }
  // Fit map to duress members' positions
  const duressPositions = members.map((pk: string) => positions[pk]).filter(Boolean)
  if (map && duressPositions.length === 1) {
    map.flyTo({ center: [duressPositions[0].lon, duressPositions[0].lat], zoom: 16 })
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
  el.style.background = 'var(--failed)'
  el.style.width = '18px'
  el.style.height = '18px'
  el.style.boxShadow = '0 0 12px rgba(248, 113, 113, 0.6)'
}

export function cleanupBeacons(): void {
  if (geoWatchId !== null) navigator.geolocation.clearWatch(geoWatchId)
  geoWatchId = null
  if (map) { map.remove(); map = null }
  markers = {}
  positions = {}
  encryptedPayloads = {}
}
