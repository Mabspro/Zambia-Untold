# ZAMBIA UNTOLD — Technical Audit Matrix

**Document Status:** Reference / Handoff  
**Date:** March 2026  
**Sprint baseline:** A1 + A2 + A3 complete — Phase B queued  
**References:** `docs/MUSEUM_SPRINT_PLAN.md`, `docs/MUSEUM_ENHANCEMENT_PLAN.md`, `docs/Community-Context.md`

---

## How to use this document

Each row covers one file or module: its purpose, active consumer(s), current health, and any open actions.  
**Status key:**  
`✅ Healthy` — no known issues.  
`⚠️ Needs attention` — works but has a tracked debt item.  
`❌ Has bug` — confirmed defect or regression risk.  
`🗑️ Deprecated` — content retained by convention but flagged for deletion.

---

## 1. App Shell

| File | Purpose | Consumers | Status | Notes / Actions |
|------|---------|-----------|--------|-----------------|
| `app/layout.tsx` | Root HTML shell. Sets metadata, injects globals.css. | Next.js | ✅ Healthy | Intentionally thin. No font imports (using system stacks from globals.css). |
| `app/page.tsx` | Home page. Orchestrates lobby phases, scrub year, selected marker, passport, layer visibility, contextual card dismissal. | Root route | ✅ Healthy | **Fixed (March 2026):** lobby timers now stored in `lobbyTimersRef`; unmount-only cleanup effect added. Sequence behavior preserved. |
| `app/error.tsx` | Global error boundary. Shows error message + retry. | Next.js router | ✅ Healthy | Minimal; intentional. |
| `app/globals.css` | Tailwind base, CSS custom properties, font stacks, keyframe animations (`lobby-pulse`, `mwela-expand`). | Global | ✅ Healthy | CSS variables follow `Appearance-Context.md` palette. Mwela dot-grid baked into `body` background. **Not yet loaded:** YUWOTE CHARVET / Sankofa Display (display typefaces from spec). These require explicit Google Fonts or self-hosted import if adopted. |

---

## 2. Globe Component

| File | Purpose | Consumers | Status | Notes / Actions |
|------|---------|-----------|--------|-----------------|
| `components/Globe/Globe.tsx` | Main R3F scene: earth texture, X-ray shader, atmosphere, epoch overlay, stars, markers, all layers, idle snap. | `app/page.tsx` | ✅ Healthy | Core is solid. `LayerVisibility` now imported from `lib/types.ts` (TD-04 resolved). LTTB used for terrain profile simplification ✓. |
| `components/Globe/CameraRig.tsx` | Cinematic camera animation on marker selection. Quadratic arc + exponential ease-out. | `Globe.tsx` | ✅ Healthy | Clean. `controlsRef` passed from parent; `OrbitControls.enabled` is toggled in `Globe.tsx` around transitions. |
| `components/Globe/GlobeMarker.tsx` | Sphere mesh per marker. Organic heartbeat pulse when active, shrinks when inactive. | `Globe.tsx` | ✅ Healthy | `new THREE.Vector3()` created each `useFrame` call (`meshRef.current.scale.lerp(new THREE.Vector3(...))`). Low-cost on 6 markers, but consider a persistent ref at scale. |
| `components/Globe/ZambiaBoundary.tsx` | Animated dash-offset scanline on Zambia's country boundary GeoJSON. | `Globe.tsx` | ✅ Healthy | Fetches `/data/zambia-boundary.geojson` at mount. GeoJSON schema not validated at runtime — graceful failure via `reportDataIssue`. `@ts-expect-error` on `dashOffset` (Three.js typing gap); comment explains why. |
| `components/Globe/ZambeziLayer.tsx` | Zambezi river line, changes geometry/color/opacity by epoch state: proto/pleistocene/highway/dammed. | `Globe.tsx` | ✅ Healthy | Geometry split into `fullGeometry` / `upperGeometry` for post-Kariba Dam state. Clean. |
| `components/Globe/KatangaFormationLayer.tsx` | Copper particle pulse at Copperbelt coordinates when scrubber is at 900M+ BC. LTTB-downsampled, max 500 particles. | `Globe.tsx` | ✅ Healthy | Additive blending + custom shader ✓. Particle positions are fixed at mount (no runtime recalc). Active only when `scrubYear < -500_000_000`. |
| `components/Globe/LusakaParticleSwarm.tsx` | Cha-cha-cha civil disobedience particle swarm. Reads road network from `/data/lusaka-roads.geojson`, LTTB-downsampled to 2000 pts, radial expansion wave. | `Globe.tsx` | ✅ Healthy | Async GeoJSON load; empty-array fallback if fetch fails. Color gradient (crimson → copper) by distance. `alphaArrayRef` ref pattern avoids geometry recreation. |
| `components/Globe/ProvinceHighlight.tsx` | Highlights the province associated with the active marker. | `Globe.tsx` | ⚠️ Needs attention | Fetches `/data/zambia-provinces.geojson`. Province name matching uses loose string comparison (`.replace(" ", "-")`). If province GeoJSON names drift from `MARKER_TO_PROVINCE` map, highlight silently fails. **Action:** add explicit unit test or validation step. |
| `components/Globe/SovereigntyStackHUD.tsx` | In-geometry HUD (Drei `Html`) showing Governance/Value/Infrastructure state per year. Positioned relative to camera. | `Globe.tsx` | ✅ Healthy | `useFrame` positions group in camera-relative space. Pointer events disabled ✓. Renders into R3F canvas, not DOM overlay — preserves 60fps intent. |
| `components/Globe/shaders/` | (Directory exists, no files found in audit.) | — | ⚠️ Needs attention | X-ray vertex/fragment shaders are currently inline strings in `Globe.tsx`. If additional shaders are added, migrate to this directory for discoverability. |

---

## 3. Layout & UI Components

| File | Purpose | Consumers | Status | Notes / Actions |
|------|---------|-----------|--------|-----------------|
| `components/Layout/CanvasWrapper.tsx` | Full-screen fixed div wrapping the R3F Canvas. Accepts `className` for opacity transitions. | `app/page.tsx` | ✅ Healthy | Minimal and correct. |
| `components/UI/TimeScrubber.tsx` | Deep-time scrubber. Zone-aware label, marker pips, glowing progress bar, thumb overlay, accessible range input. | `app/page.tsx` | ✅ Healthy | Uses `deepTime.ts` for all position mapping ✓. Hidden `<input type="range">` is the actual a11y/interaction element; visual thumb overlay is `pointer-events-none`. |
| `components/UI/NarrativePanel.tsx` | Slide-in panel. Story/Evidence tabs; contextual epoch cards; animated with Framer Motion; Export Brief button. | `app/page.tsx` | ✅ Healthy | **Sprint A3 (March 2026):** Placard hierarchy polished (tag → `font-mono` epoch → headline → subhead → tabs → ChevronDivider → body → "Exhibition Statement" CTA). `ChevronDivider` present in both marker panels and contextual cards ✓. `isFinale` rendering for 2026 CopperCloud frame: timeline lines + copper badge ✓. |
| `components/UI/LayersPanel.tsx` | Collapsible toggle panel for globe layers. | `app/page.tsx` | ✅ Healthy | `LayerVisibility` re-exported from `lib/types.ts` (TD-04 resolved). `zambezi` optional; toggle uses `?? true` guard ✓. |
| `components/UI/PreloadScreen.tsx` | Mwela-inspired concentric circle SVG pre-load animation. | `app/page.tsx` | ✅ Healthy | Implements `Appearance-Context.md` BaTwa visual system spec. `aria-hidden` ✓. |
| `components/UI/ExportBriefButton.tsx` | Export Intelligence Dossier as PNG. html2canvas capture of globe + narrative. | `NarrativePanel.tsx` | ✅ Healthy | **Fixed (March 2026 TD-02):** `narrativeBodyText()` helper flattens `blocks`-format narratives to plain text; falls back to `body` for legacy entries. WebGL canvas `toDataURL` failure caught silently (cross-origin texture context). |
| `components/UI/SovereigntyStack.tsx` | DOM-overlay version of the Sovereignty Stack. Retained as fallback for non-WebGL render contexts. | None (currently unused) | 🗑️ Deprecated | **TD-03 (March 2026):** Active render path uses `SovereigntyStackHUD.tsx` (in-geometry WebGL). This file retains a DOM fallback for screenshot export or accessibility mode. Delete if no such use case is needed. |
| `components/UI/DataIssueBanner.tsx` | Event-driven banner for data load failures. | `app/page.tsx` | ✅ Healthy | Deduplicates issues by `source:message` key ✓. Pointer-events-none ✓. |
| `components/UI/EpochLabel.tsx` | Floating label above scrubber thumb. | `TimeScrubber.tsx` | ✅ Healthy | `clamp()` keeps label in bounds. Not `"use client"` — fine as it has no hooks. |
| `components/UI/ChevronDivider.tsx` | Mwela-inspired nested diamond divider SVG. | `NarrativePanel.tsx` | ✅ Healthy | Implements `Appearance-Context.md` Luangwa Valley geometric spec. `aria-hidden` ✓. |

---

## 4. Library Modules

| File | Purpose | Consumers | Status | Notes / Actions |
|------|---------|-----------|--------|-----------------|
| `lib/deepTime.ts` | **Primary timeline model.** 8-zone segmented axis (4.5B BC → 2026 AD). Zone boundaries, bi-directional year↔position mapping, zone lookup, display formatters. | `TimeScrubber`, `epoch.ts`, `contextualEpochCards.ts`, `museumPassport.ts`, `app/page.tsx` | ✅ Healthy | This is the authoritative timeline module. ZONE boundaries are hardcoded constants — document before changing, as they affect scrubber feel across the entire experience. |
| `lib/epoch.ts` | Marker activation helper (`isMarkerActive`). Previously: full asinh timeline model. | `TimeScrubber`, `GlobeMarker` | ⚠️ Deprecated (partial) | **Fixed (March 2026):** file refactored with clear active/deprecated sections and JSDoc `@deprecated` tags. **Next cleanup pass:** delete `EPOCH_MIN`, `EPOCH_MAX`, `yearToNormalized`, `normalizedToYear`, `yearToSlider`, `sliderToYear`, `formatEpochLabel`, `markerPositionOnTrack`. Only `isMarkerActive` should survive. |
| `lib/epochPalette.ts` | Returns globe tint color + opacity for a given year. Implements Colonial cool, Sovereign copper return. | `Globe.tsx` | ✅ Healthy | Clean, simple. Colonial epoch (#3a4a5c) distinct as spec requires ✓. Threshold at `year < -10000` returns zero opacity for pre-historic epochs — intentional (X-ray mode takes over). |
| `lib/camera.ts` | Coordinate conversions: lat/lng → THREE.Vector3, camera positioning for Africa center + markers, quadratic arc interpolation. | `Globe.tsx`, `CameraRig.tsx`, `ZambeziLayer.tsx`, `KatangaFormationLayer.tsx`, etc. | ✅ Healthy | Standard spherical math. `quadraticArc` for cinematic fly-to ✓. `AFRICA_CENTER` is a named constant (`-15, 28`) — lat/lng of central Zambia. |
| `lib/geo.ts` | GeoJSON → THREE.Vector3[] conversion for Polygon and MultiPolygon geometries. `MARKER_TO_PROVINCE` mapping. | `ZambiaBoundary.tsx`, `ProvinceHighlight.tsx` | ⚠️ Needs attention | `MARKER_TO_PROVINCE` hardcoded — must be kept in sync with `data/markers.ts` IDs and GeoJSON province names. No validation that province names match the loaded GeoJSON. **Action:** add type safety or runtime check. |
| `lib/lttb.ts` | Largest-Triangle-Three-Buckets downsampling for large point sets. | `Globe.tsx` (terrain), `LusakaParticleSwarm.tsx`, `KatangaFormationLayer.tsx` | ✅ Healthy | Well-implemented generic LTTB. `payload` generic type enables typed data threading through downsampling. |
| `lib/museumPassport.ts` | localStorage persistence for visitor progress: last year, last zone, visited markers/zones, timestamp. | `app/page.tsx` | ✅ Healthy | Guards for SSR (`typeof window`). Schema validation on load (rejects malformed data). `visitedMarkers`/`visitedZones` default to `[]` on partial data. |
| `lib/sovereignty.ts` | Returns Governance/Value/Infrastructure state string tuple for a given year. | `SovereigntyStackHUD.tsx`, `SovereigntyStack.tsx` | ✅ Healthy | 5 year thresholds. Could grow to include the `COLONIAL WOUND → UNFINISHED SOVEREIGN` nuance from Mineral_Context (SI 68, etc.) in a future sprint. |
| `lib/dataIssues.ts` | Custom event bus for non-fatal data load failures. `reportDataIssue()` dispatches `atlas:data-issue`. | `ZambiaBoundary.tsx`, `ProvinceHighlight.tsx`, `DataIssueBanner.tsx` | ✅ Healthy | Clean, minimal. No dependencies. SSR guard ✓. |

---

## 5. Data Modules

| File | Purpose | Consumers | Status | Notes / Actions |
|------|---------|-----------|--------|-----------------|
| `data/markers.ts` | `Marker[]` — 6 markers with id, epoch, coordinates, tag, headline, subhead, color. | `app/page.tsx`, `Globe.tsx`, `TimeScrubber.tsx`, `NarrativePanel.tsx`, `ExportBriefButton.tsx` | ✅ Healthy | Epochs span -400K BC → 1961. These are narrative anchors, not geological layers. Planned expansions (craton, mine constellation, REE) will add new layer types, not more marker entries. |
| `data/narratives.ts` | `Record<string, Narrative>` — structured narrative + sources for all 6 markers. Supports `body` (legacy), `blocks` (structured), `heroImage`, `sources`. | `NarrativePanel.tsx`, `ExportBriefButton.tsx` | ✅ Healthy | All 6 entries have populated `sources[]` with `NarrativeSource` schema ✓. `ExportBriefButton.tsx` only uses `body` field — see note in UI section. |
| `data/contextualEpochCards.ts` | `ContextualCard` per deep-time zone + special CopperCloud frame at `year >= 2025`. Eliminates dead zones on the scrubber. | `NarrativePanel.tsx` | ✅ Healthy | Build-time generated from Appendix D tables ✓. CopperCloud frame is the deliberate closing argument at rightmost scrubber position. |
| `data/zambeziPath.ts` | 13 hardcoded Zambezi waypoints + `getZambeziState(year)` → `proto \| pleistocene \| highway \| dammed`. | `ZambeziLayer.tsx` | ✅ Healthy | Simplified path (not GeoJSON). Appropriate for the visual narrative role. `KARIBA_INDEX = 9` separates upper/lower river for dammed state. |

---

## 6. Static Assets & Configuration

| File/Dir | Status | Notes |
|---------|--------|-------|
| `public/textures/earth-night.jpg` | Required ✓ | Preloaded via `<link rel="preload">` in `app/page.tsx`. |
| `public/data/zambia-boundary.geojson` | Required ✓ | Fetched by `ZambiaBoundary.tsx`. |
| `public/data/zambia-provinces.geojson` | Required ✓ | Fetched by `ProvinceHighlight.tsx`. |
| `public/data/lusaka-roads.geojson` | Required ✓ | Fetched by `LusakaParticleSwarm.tsx` for Cha-cha-cha swarm. |
| `tailwind.config.ts` | ✅ Healthy | Extends theme with `copper`, `copperSoft`, `bg`, `panel`, `text`, `muted`, `rockDark`, `rockMid`, `ashGray` tokens. All match `Appearance-Context.md` color system. |
| `next.config.mjs` | ✅ Healthy | `next-pwa` with `DISABLE_PWA=1` escape hatch (`npm run build:no-pwa`) for restricted environments. Runtime caching strategies configured. |
| `.eslintrc.json` | ✅ Healthy | Extends `next/core-web-vitals`. |

---

## 7. Sprint Completion Tracker

| Sprint | Status | Outstanding items |
|--------|--------|-------------------|
| **Sprint 1** | ✅ Complete | Globe scaffold, 6 markers, time scrubber |
| **Sprint 2** | ✅ Complete | X-Ray shader, Cha-cha-cha particles, Export Brief |
| **Sprint 3A** | ✅ Complete | OrbitControls, Zambia boundary, province highlight, idle snap |
| **Sprint A (prod)** | ✅ Complete | Lint, typecheck, fonts, error boundary, DataIssueBanner |
| **Sprint A1** | ✅ Complete | Deep Time segmented scrubber, contextual epoch cards, lobby sequence |
| **Sprint A2** | ✅ Complete | Boundary scanline, atmosphere, epoch palette, Zambezi, in-geometry HUD, Katanga layer |
| **Sprint A3** | ✅ Complete | Placard polish, CopperCloud finale frame, Museum Passport re-entry, Evidence schema |
| **Phase B** | ⏳ Queued | Epoch soundscapes, Curator's Voice TTS |
| **Phase D** | ⏳ Queued | Then vs. Now split-screen (requires Mapbox/Cesium signup) |
| **Phase C** | ⏳ Queued | Living Archive / Isibalo (requires backend/serverless) |
| **Phase C2** | ⏳ Future | Folk Tales / Inganji (see Community-Context.md) |

---

## 8. Known Technical Debt (Consolidated)

| ID | File | Issue | Priority | Action |
|----|------|-------|----------|--------|
| TD-01 | `lib/epoch.ts` | Legacy asinh-model exports co-exist with active `isMarkerActive`. Deprecation markers added March 2026. | Low | Remove deprecated exports next cleanup pass. |
| TD-05 | `lib/geo.ts` | `MARKER_TO_PROVINCE` not validated against loaded GeoJSON; silently fails. | Medium | Add validation or runtime assertion at dev time. |
| TD-06 | `components/Globe/Globe.tsx` | X-ray shaders are inline template literal strings. `components/Globe/shaders/` exists but empty. | Low | Migrate shader strings to `.glsl` files in `shaders/` for maintainability. |
| TD-07 | `components/Globe/GlobeMarker.tsx` | `new THREE.Vector3(...)` instantiated on every `useFrame` call. Fine at 6 markers, worth refactoring if marker count grows significantly. | Low | Hoist to a persistent ref at top of component. |

---

## 9. Recommended Next Actions

### Sprint A3 — ✅ Complete (March 2026)
All A3 deliverables shipped and validated:
- Placard hierarchy polished (tag → `font-mono` epoch → headline → subhead → tabs → ChevronDivider → body → "Exhibition Statement" CTA)
- CopperCloud 2026 closing frame: `isFinale` path in `NarrativePanel`, timeline-line rendering, copper `▸` badge
- Museum Passport persistence, re-entry prompt, Galleries Visited counter
- Evidence tab with full `NarrativeSource[]` schema across all 6 markers
- TD-02 resolved: `narrativeBodyText()` blocks flatten in export
- TD-03 resolved: `SovereigntyStack.tsx` documented as deprecated DOM fallback
- TD-04 resolved: `LayerVisibility` canonical in `lib/types.ts`
- Lint + typecheck: 0 errors ✓

### Phase B preparation (next sprint)
1. **Web Audio API soundscapes** — dynamic import via `next/dynamic`. Minimum 3 distinct ambients: Deep Substrate, Colonial Wound, Unfinished Sovereign. No external dependency needed.
2. **Curator's Voice TTS** — decision: **Web Speech API** (zero-cost, offline-capable, PWA-aligned) vs. **ElevenLabs** (higher quality, requires API key). Implement a `GuidedMode` toggle in `LayersPanel`.
3. **Typecheck + lint gate** (`npm run validate`) before each phase merge.

### Remaining technical debt (before Phase B closes)
4. **TD-01** — Delete deprecated exports from `lib/epoch.ts`. Only `isMarkerActive` should remain.
5. **TD-05** — Add `MARKER_TO_PROVINCE` validation against loaded province GeoJSON in `lib/geo.ts`.
6. **TD-06** — Migrate inline XRAY shader strings to `components/Globe/shaders/*.glsl` for maintainability.

### Data layers (Appendix E — separate sprint after Phase B)
7. Craton polygons (BGS World Geology GeoJSON — free), Gondwana outline (PALEOMAP — free).
8. Mine constellation: hardcode coordinates from `Mineral_Context.md` — no API needed.
9. SI 68 Local Content bar chart overlay in UNFINISHED SOVEREIGN epoch panel.
10. Luangwa hydrogen layer + Nkombwa REE marker for post-2025 epoch close.

---

*Generated from full project audit — March 2026.*  
*Keep this document updated as sprints complete. When TD items are resolved, mark them removed (don't just strike-through — delete the row so the matrix reflects current truth).*
