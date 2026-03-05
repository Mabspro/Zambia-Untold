# ZAMBIA UNTOLD — Sprint 3A Agent Assignment Brief
## Globe Interactivity · Full Navigation · Zambia Geographic Grounding
## Multi-Agent Build · Cursor Workflow · v1.0

---

## CONTEXT FOR CLAUDE (READ FIRST)

Sprints 1 and 2 are complete. The globe renders with:
- Six markers, time scrubber (476,000 BC → 2026)
- Substrate X-Ray shader (epochs < 10,000 BC)
- Earth night texture, city lights, Cha-cha-cha particle swarm
- Fly-to camera on marker click, narrative panel, Export Brief

**The concept is proven.** Sprint 3A transforms it from a presentation into an interactive platform.

Your job: Add full user-controlled navigation and Zambia geographic grounding. The globe currently spins and accepts marker clicks. After this sprint, users can zoom, pan, rotate, and see Zambia as a defined territory.

**Stack:** Next.js 14+, TypeScript, Three.js, React Three Fiber. Do not migrate to Cesium. Extend the existing architecture.

**Reference:** `Foundation.md` — Layer 1 specification. `Narrative.md` — venture context.

---

## THE PRODUCT (Post–Sprint 3A)

A globe users can **explore**, not just watch. Zoom in to Zambia. Drag to rotate. See the country boundary. When a marker is active, see its province highlighted. After 8 seconds idle, the camera gently recenters on Africa.

---

## SPRINT 3A — REQUIRED DELIVERABLES

### 1. ZOOM
- **Scroll wheel:** Zoom in/out. Min: full Earth view (current default ~3.2 distance). Max: ~50km altitude over Zambia (camera distance ~0.15–0.2 from globe surface).
- **Pinch gesture:** Same zoom range on touch devices.
- **Constraint:** Zoom must not clip through the globe. Enforce min/max distance in the control logic.
- **Implementation note:** Use `@react-three/drei` `OrbitControls` or equivalent. Disable when `selectedMarker` is set (fly-to takes over). Re-enable when panel is dismissed.

### 2. PAN / ROTATE
- **Click + drag:** When no marker is selected, user can rotate the globe by dragging. Damped inertia — the globe continues to drift slightly after release, then settles.
- **No drag when marker selected:** Fly-to animation owns the camera. Dragging is disabled during and after fly-to until user dismisses the panel.
- **Implementation note:** OrbitControls handles this. Configure `enablePan: false` if pan conflicts with rotation, or `enablePan: true` for lateral movement — use your judgment. The primary interaction is rotation.

### 3. ZAMBIA COUNTRY BOUNDARY
- **Source:** Natural Earth 1:10m cultural vectors (free).
  - Download: https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
  - File: `ne_10m_admin_0_countries.shp` (or GeoJSON export)
  - Extract Zambia's geometry (ISO_A3 = "ZMB" or NAME = "Zambia").
  - Save to `/public/data/zambia-boundary.geojson`
- **Rendering:** Draw Zambia's border as a glowing copper line (`#B87333`) on the globe surface. Use `Line` or `LineSegments` with `LineBasicMaterial` (emissive, transparent). The line should sit slightly above the globe (radius ~1.003) to avoid z-fighting.
- **On page load:** Camera auto-positions so Zambia is visible. Default camera target or initial globe rotation should center Africa in view. (Current default may already show Africa; verify and adjust if needed.)
- **When any marker is active:** Zambia boundary pulses once (brief emissive intensity ramp, e.g. 1 → 1.5 → 1 over 0.5s). Single pulse per marker selection, not continuous.

### 4. REGION HIGHLIGHT ON MARKER CLICK
- **Source:** GADM level-1 administrative boundaries for Zambia.
  - Download: https://gadm.org/download_country.html (select Zambia, level 1)
  - Export to GeoJSON. Save to `/public/data/zambia-provinces.geojson`
- **Mapping:** Each marker maps to a province:
  - `kalambo-falls` → Northern (or Mbala district)
  - `kabwe-skull` → Central
  - `twin-rivers` → Lusaka
  - `ingombe-ilede` → Southern
  - `kansanshi` → Northwestern
  - `lusaka-independence` → Lusaka
- **Rendering:** When a marker is active, highlight its province boundary in copper. Same technique as country boundary — line on globe surface, radius ~1.002. Opacity or emissive slightly higher than country line to read as "active region."
- **When no marker selected:** Only the country boundary is visible. Province highlights disappear.

### 5. IDLE SNAP TO AFRICA
- **Trigger:** After 8 seconds with no marker selected and no user interaction (no scroll, no drag), smoothly animate the camera/globe so Africa (and Zambia) returns to a centered, readable view.
- **Implementation:** Track last interaction timestamp. In `useFrame`, when `selectedMarker` is null and `now - lastInteraction > 8`, lerp camera target and/or globe rotation toward the Africa-centered state. Use damped lerp for smoothness. Reset `lastInteraction` on any scroll or pointer move.

---

## TECHNICAL CONSTRAINTS

- **Do not remove or break:** X-Ray shader, particle swarm, Export Brief, narrative panel, time scrubber, marker fly-to.
- **CameraRig:** You may extend it to integrate with OrbitControls (e.g. disable controls during fly-to, sync camera with controls after). Do not remove the fly-to behavior.
- **Data:** All GeoJSON is static. No API calls at runtime. Pre-process and save to `/public/data/`.
- **Performance:** 60fps. Zambia boundary and province boundaries are single Line geometries. Use LTTB or similar if the raw GeoJSON has too many points (Natural Earth and GADM are typically low-poly).
- **Mobile:** Pinch zoom must work. Touch drag for rotate. Test on a real device or Chrome DevTools device emulation.

---

## DATA PREPARATION (Do Before or During Build)

| File | Source | Purpose |
|------|--------|---------|
| `zambia-boundary.geojson` | Natural Earth 10m, extract ZMB | Country outline |
| `zambia-provinces.geojson` | GADM Zambia level 1 | Province boundaries for marker highlight |

If Natural Earth or GADM download is slow, use:
- **Natural Earth:** Direct GeoJSON from https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson — filter for Zambia in code or pre-process.
- **GADM:** Alternative: use a simplified Zambia provinces GeoJSON from a CDN if available. The goal is province boundaries; exact administrative accuracy is secondary to having a working highlight.

---

## FILE STRUCTURE (Proposed)

```
components/
  Globe/
    Globe.tsx              # Add OrbitControls, boundary layers
    GlobeMarker.tsx        # No change
    CameraRig.tsx          # Extend: integrate with controls, idle snap
    LusakaParticleSwarm.tsx # No change
    ZambiaBoundary.tsx     # NEW: country boundary line
    ProvinceHighlight.tsx  # NEW: province highlight per active marker
  ...
lib/
  camera.ts                # May add: africaCenteredTarget, idle snap helpers
  ...
public/
  data/
    zambia-boundary.geojson
    zambia-provinces.geojson
```

---

## DEFINITION OF DONE — SPRINT 3A

- [ ] Scroll zoom works (min full Earth, max ~50km over Zambia)
- [ ] Pinch zoom works on touch devices
- [ ] Drag to rotate works when no marker selected
- [ ] Drag disabled during/after marker selection until panel dismissed
- [ ] Zambia country boundary visible as copper line on globe
- [ ] Zambia boundary pulses once when marker is selected
- [ ] Province highlight appears for active marker's region
- [ ] Province highlight disappears when marker deselected
- [ ] After 8s idle (no marker, no interaction), camera/globe recenters on Africa
- [ ] All existing behavior intact (X-Ray, particles, Export Brief, fly-to)
- [ ] `npm run build` passes
- [ ] 60fps on mid-range device

---

## OUT OF SCOPE (Sprint 3B or Later)

- Satellite tile layer at max zoom (Mapbox / Cesium ion) — deferred
- District boundaries, city labels — Layer 1.5, future sprint
- Data integrations (USGS, World Bank) — Sprint 3B
- Epoch-specific data layers — Sprint 4

---

## FIRST CLAUDE PROMPT (Copy-paste to start)

```
Read Foundation.md and the current Globe.tsx, CameraRig.tsx, and app/page.tsx.

You are implementing Sprint 3A — Globe Interactivity. The brief is in 
ZAMBIA_UNTOLD_SPRINT3A_AGENT_BRIEF.md.

Before writing code:
1. Confirm the data files (zambia-boundary.geojson, zambia-provinces.geojson) 
   exist or need to be created. If missing, download from Natural Earth and GADM 
   (or equivalent) and save to public/data/.
2. Propose how OrbitControls will integrate with CameraRig — specifically, 
   when controls are enabled vs disabled, and how the idle snap will work.
3. Propose the coordinate transformation for GeoJSON lat/lng to 3D positions 
   on the globe surface (reuse latLngToVector3 from lib/camera.ts).

Then implement the five deliverables in order: Zoom, Pan/Rotate, Zambia Boundary, 
Province Highlight, Idle Snap.
```

---

*Brief version: 1.0 · Foundation: Foundation.md · Narrative: Narrative.md*
*Next sprint: 3B — Data integrations (USGS copper, World Bank economic bar)*
