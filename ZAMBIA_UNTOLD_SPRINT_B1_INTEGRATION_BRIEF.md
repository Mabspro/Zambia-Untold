# ZAMBIA UNTOLD — Sprint B1: Live Earth Integration Layer

> **Philosophy**: Global tools, Zambian vantage point, Zambian data partnerships.
> Make Zambia feel like a live, instrumented organism — not a static museum.

---

## 🎯 Sprint Objective

Transform the stylised museum globe into a **dual-mode** experience:
1. **Museum Mode** (current) — curated, copper-toned, narrative-first
2. **Live Earth Mode** (new) — real satellite imagery, 3D terrain, real-time data overlays

Both modes share the same marker/narrative/Isibalo/Inganji architecture. The user toggles between them like switching between a painted portrait and a photograph.

---

## 🏗️ Architecture Decision: Three.js + 3D Tiles Pipeline

**Current stack**: Next.js 14 + React Three Fiber + Three.js + OrbitControls

**Recommended integration path** (preserves existing R3F investment):

| Layer | Technology | Why |
|-------|-----------|-----|
| 3D Tiles renderer | `3d-tiles-renderer` (NASA/Cesium open-source Three.js loader) | Drops into existing R3F scene; no CesiumJS dependency |
| Satellite imagery | Digital Earth Africa WMS/WMTS + Sentinel Hub | Open, Africa-focused, time-series ready |
| Geospatial vectors | NGDR / GeoJSON overlays | Admin boundaries, chiefdoms, protected areas |
| Real-time data | DE Africa APIs + NRSC portal | Flood extent, vegetation, fire alerts |
| Geocoding | Nominatim (OSM) or Google Geocoding | "See your village from space" |

**Alternative considered**: CesiumJS — more mature 3D tiles support but requires a separate rendering context (can't share R3F scene graph). May revisit if 3d-tiles-renderer hits limits.

---

## 📦 Integration Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ZAMBIA UNTOLD UI                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Calendar  │ │ Inganji  │ │ Isibalo  │ │Deep Time │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  ┌─── MODE TOGGLE ──────────────────────────────────────┐  │
│  │  [MUSEUM GLOBE]  ←→  [LIVE EARTH 3D]  ←→  [TODAY]   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────── R3F Canvas ───────────────────────┐  │
│  │                                                       │  │
│  │  Museum Mode:          Live Earth Mode:               │  │
│  │  • earth-night.jpg     • Google 3D Tiles (Zambia AOI) │  │
│  │  • Copper markers      • Same markers (re-anchored)   │  │
│  │  • X-ray shader        • Sentinel-2 drape layer       │  │
│  │  • Epoch tint           • DE Africa thematic overlays  │  │
│  │  • Zambia boundary      • NGDR admin boundaries       │  │
│  │                                                       │  │
│  │  Shared:                                              │  │
│  │  • CameraRig + OrbitControls                          │  │
│  │  • GlobeMarkers (lat/lng → 3D position)               │  │
│  │  • Isibalo community pins                             │  │
│  │  • Inganji animation overlays                         │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── DATA LAYER ───────────────────────────────────────┐  │
│  │                                                       │  │
│  │  Google Maps Platform    Digital Earth Africa          │  │
│  │  • Photorealistic        • Sentinel-2 (10m, 5-day)    │  │
│  │    3D Tiles              • Water extent products       │  │
│  │  • Map Tiles API         • Land cover change           │  │
│  │                          • Vegetation (NDVI)           │  │
│  │                          • Fire alerts                 │  │
│  │                                                       │  │
│  │  NRSC Zambia             NGDR                         │  │
│  │  • National products     • Admin boundaries            │  │
│  │  • Flood mapping         • Chiefdom polygons           │  │
│  │  • Agricultural zones    • Protected areas             │  │
│  │                          • Rivers / water bodies       │  │
│  │                                                       │  │
│  │  Nominatim / Google      OpenWeather / NASA FIRMS      │  │
│  │  • Geocoding             • Weather overlay             │  │
│  │  • Reverse geocode       • Active fire hotspots        │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Phases

### Phase B1.1 — Google Photorealistic 3D Tiles

**Goal**: Toggle between museum globe and real-world 3D terrain

**Steps**:
1. Install `3d-tiles-renderer` and `3d-tiles-renderer-r3f`
2. Create `LiveEarthScene` component parallel to existing `Scene`
3. Load Google Photorealistic 3D Tiles via API key
4. Constrain tile loading to Zambia bounding box + 200km buffer:
   - SW: (-18.5, 21.5), NE: (-8.0, 33.5)
5. Cross-fade between museum sphere and 3D tiles on toggle
6. Re-anchor GlobeMarkers to work in both coordinate systems

**Key code pattern**:
```tsx
// components/Globe/LiveEarthScene.tsx
import { GoogleTilesRenderer } from '3d-tiles-renderer';

function LiveEarth({ visible }: { visible: boolean }) {
  const tiles = useMemo(() => {
    const renderer = new GoogleTilesRenderer(API_KEY);
    renderer.setLatLonToYUp(true); // Match R3F coordinate system
    return renderer;
  }, []);

  useFrame(() => tiles.update());

  return visible ? <primitive object={tiles.group} /> : null;
}
```

**UX**: Add toggle to action bar:
```
[🏛️ Museum] ←→ [🛰️ Live Earth]
```

---

### Phase B1.2 — Satellite Imagery Layers

**Goal**: Time-series satellite views showing Zambia's transformation

**Data Sources**:

| Source | Coverage | Resolution | Update | Access |
|--------|----------|-----------|--------|--------|
| Digital Earth Africa (Sentinel-2) | Continental | 10m | 5-day | Free WMS/WMTS |
| Digital Earth Africa (Landsat) | Continental | 30m | 16-day | Free WMS/WMTS |
| DE Africa Water | Continental | 10m | Monthly | Free WMS |
| NRSC Zambia | National | Various | Varies | Partnership |

**Implementation**:
1. Create `SatelliteLayer` component that fetches WMS tiles
2. Drape as texture on globe surface (UV mapping to lat/lng)
3. Time slider integration: user scrubs → different satellite dates load
4. Historical comparison: side-by-side or fade between dates

**Key endpoints**:
```
# Digital Earth Africa - Sentinel-2
https://ows.digitalearth.africa/wms?
  service=WMS&version=1.3.0&request=GetMap
  &layers=s2_l2a
  &bbox=-18.5,21.5,-8.0,33.5
  &time=2024-01-01/2024-12-31

# DE Africa Water Observations
https://ows.digitalearth.africa/wms?
  &layers=wofs_ls_summary_alltime
  &bbox=-18.5,21.5,-8.0,33.5
```

**UX**: `[TODAY'S SKY]` button — fetches latest cloud-free Sentinel-2 for current viewport AOI

---

### Phase B1.3 — Zambia Geospatial Overlays (NGDR)

**Goal**: Clickable boundaries for chiefdoms, protected areas, rivers

**Data layers**:
- Administrative boundaries (provinces, districts)
- Traditional chiefdom boundaries (~288 chiefdoms)
- National parks & game management areas (19 parks, 36 GMAs)
- Major rivers & water bodies
- Heritage sites

**Implementation**:
1. Fetch GeoJSON from NGDR or pre-process shapefiles
2. Render as Three.js line geometries on globe surface
3. Click handler: opens contextual card with history + nearest Inganji/Isibalo

**UX**: Layers panel toggles for each category

---

### Phase B1.4 — "See Your Village From Space"

**Goal**: Personal connection — enter a place name, see it from orbit

**Flow**:
1. User types place name in search box (or taps on map)
2. Geocode via Nominatim → lat/lng
3. Camera flies to location (reuse CameraRig flight system)
4. Load latest Sentinel-2 cloud-free scene for that AOI
5. Show nearest Isibalo contributions + historical markers
6. Prompt: "Add your memory for this place →"

**Technical**:
```tsx
async function searchPlace(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},Zambia&format=json&limit=5`
  );
  const results = await res.json();
  return results.map(r => ({
    name: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}
```

---

### Phase B1.5 — Seasonal & Real-Time Events

**Goal**: Zambia as a living, breathing entity

**Integrations**:

| Event | Data Source | Trigger |
|-------|-----------|---------|
| **Kuomboka season** | DE Africa water extent | March–April: overlay flood extent on Barotse Plain |
| **Fire season** | NASA FIRMS active fire | June–October: show fire hotspots on Copperbelt/savanna |
| **Rainy season** | DE Africa rainfall | November–March: vegetation greening animation |
| **Harvest calendar** | Local data / NRSC | Overlay crop zones with seasonal status |
| **Cultural ceremonies** | Calendar system (existing) | Link to Inganji content + satellite view of location |

**UX**: Seasonal banner at top when relevant:
```
🌊 Kuomboka Season — The Barotse floodplain is 47% flooded
   [View from Space] [Read the Story] [Add Your Memory]
```

**Technical — NASA FIRMS**:
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/
  {API_KEY}/VIIRS_SNPP_NRT/
  world/1/2024-01-01
  &bbox=21.5,-18.5,33.5,-8.0
```

---

## 🎨 UX Design Patterns

### Mode Toggle (Action Bar Addition)
```
┌────────────────────────────────────────────────────────┐
│  • 🪨 Deep Time │ 📅 Calendar │ 🔥 Inganji │ ✦ Isibalo │
│                                                        │
│    ──── View: [🏛️ Museum] [🛰️ Live] [📍 Search] ──── │
└────────────────────────────────────────────────────────┘
```

### Time Scrub Morphing
When in Live Earth mode, the time scrubber does double duty:
- **Deep Time → 1900**: Shows paleomap → historical satellite (Landsat archive)
- **1900 → 2000**: Shows Landsat time series (deforestation, urbanization)
- **2000 → Present**: Shows Sentinel-2 high-res recent imagery
- **Markers** stay anchored throughout — their stories don't change

### Satellite Layer Panel (Extension of Layers Panel)
```
OVERLAYS
  ☑ Zambia boundary
  ☑ Province highlight
  ☑ Zambezi evolution

SATELLITE (Live Earth mode)
  ☑ Latest imagery
  ☐ Water extent
  ☐ Vegetation (NDVI)
  ☐ Fire hotspots
  ☐ Land cover change
```

---

## 🤝 Strategic Partnerships

### Tier 1 — Anchor Partners
| Partner | What They Provide | What We Offer |
|---------|------------------|---------------|
| **NRSC Zambia** | National satellite products, validation | Public visibility, educational reach |
| **Digital Earth Africa** | Continental satellite data, APIs | Zambia-specific showcase, use case |
| **Google Maps Platform** | 3D Tiles API access | Featured African heritage project |

### Tier 2 — Data Partners
| Partner | What They Provide |
|---------|------------------|
| **Zambia Tourism Authority** | Heritage site data, cultural calendars |
| **ZAWA** (Wildlife Authority) | Protected area boundaries, species data |
| **University of Zambia** | Academic validation, oral history archives |
| **Zambia National Museum** | Artefact databases, historical photographs |

### Tier 3 — Technical
| Partner | Integration |
|---------|------------|
| **NASA FIRMS** | Fire hotspot API |
| **OpenStreetMap / Nominatim** | Geocoding |
| **Mapbox / Maptiler** | Fallback tile services |

---

## 📐 Technical Requirements

### API Keys Needed
```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=    # 3D Tiles
NEXT_PUBLIC_DE_AFRICA_WMS=          # Digital Earth Africa (open, no key)
NEXT_PUBLIC_NASA_FIRMS_KEY=         # Fire data
NEXT_PUBLIC_SENTINEL_HUB_KEY=      # Optional: higher-tier imagery
```

### New Dependencies
```bash
npm install 3d-tiles-renderer   # Google 3D Tiles in Three.js
# OR
npm install @cesium/engine       # If switching to Cesium path
```

### Performance Budget
- 3D Tiles: lazy-load, LOD-based, only Zambia AOI
- Satellite WMS: max 4 concurrent tile requests
- Fire/water overlays: cache for 1 hour, lazy refresh
- Total additional JS bundle: < 150KB gzipped

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Time to toggle Museum ↔ Live | < 2s |
| Satellite tile load (Zambia extent) | < 4s |
| "See your village" geocode → fly | < 3s |
| User engagement (time on Live Earth) | > 45s average |
| Community contributions from Live Earth | +30% vs Museum only |
| Seasonal event banner click-through | > 15% |

---

## 🗓️ Sprint Timeline

| Week | Deliverable |
|------|------------|
| 1 | B1.1 — Google 3D Tiles toggle (Museum ↔ Live) |
| 2 | B1.2 — DE Africa satellite layers + time slider |
| 3 | B1.3 — NGDR geospatial overlays (chiefdoms, parks) |
| 4 | B1.4 — "See Your Village" search + geocode |
| 5 | B1.5 — Seasonal events + real-time data |
| 6 | Integration testing, performance, polish |

---

## 🧭 Sovereignty Frame

Every integration must pass the sovereignty test:

> "Does this make a Zambian child see their country as a place with depth,
> texture, and living systems — or does it feel like a foreign dashboard
> projected onto African soil?"

- ✅ "See Kariba Dam from space — built by Zambian engineers"
- ✅ "Your grandmother's village, photographed by a European satellite,
     narrated by your community"
- ❌ "Google Maps with pins" — this is not what we're building

The data is global. The vantage point is Zambian. The stories are sovereign.

---

*Sprint B1 · Zambia Untold · Live Earth Integration Layer*
*"Global tools, sovereign gaze."*
