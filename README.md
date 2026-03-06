# 🇿🇲 ZAMBIA UNTOLD

**The history you were never taught.**

An interactive 3D globe experience cataloguing Zambia's deep history — from 900 million years of geological formation through kingdoms, colonialism, and sovereignty. A living archive where community stories, folk tales, and historical events are mapped onto the planet.

> *"Before there were nations, there was a substrate."*

---

## ✨ Features

### 🌍 Interactive Globe
- **Three.js / React Three Fiber** powered 3D Earth with crisp satellite textures
- **Responsive FOV** — globe sizes correctly on mobile, tablet, and desktop
- **CameraRig** with smooth fly-to animations when selecting markers
- **Auto-rotate** with Africa-centered idle snap
- **Data overlays**: Zambia boundary, province highlights, Zambezi river evolution, Katanga formation

### 📅 Historical Calendar (Zambia's Living Calendar)
- **41 events** across all 12 months — ceremonies, independence milestones, geological discoveries
- **Category filtering**: ceremonies, politics, archaeology, nature, culture, geology
- **"On This Day"** feature highlights nearby events
- **Places to Visit** — each event links to a physical location with globe navigation
- **Global Context** — situates each event in world history

### 🔥 Inganji (Folk Tales & Mythology)
- **9 flagship folk tales**: Nyami Nyami, Kuomboka, Chitimukulu, Makishi, Gule Wamkulu, and more
- **Tradition filtering** by ethnic group (Tonga, Lozi, Bemba, Lunda, Chewa, Lamba)
- **Tier system**: Flagship, Regional, Urban & Living
- **Cultural review** badges for validated content

### 📍 Village Search ("See Your Village From Space")
- **Nominatim geocoding** — search any town, village, river, or landmark in Zambia
- **Fly-to navigation** — globe camera flies to selected location
- **Curated suggestions**: Lusaka, Livingstone, Kabwe, Kasama, Solwezi, Mongu, and more
- **Debounced search** with loading states and province display

### ✦ Isibalo (Community Contributions)
- **Submit memories**, oral traditions, family histories, folk tales, photographs
- **Epoch tagging** — place your story in deep time (476K BC → Present)
- **Location tagging** with place names
- **Creative Commons Attribution** consent
- **localStorage persistence** (Supabase integration planned)

### 🪨 Deep Time Panel
- **9 geological epochs** from Pre-Geological through Unfinished Sovereign
- **Retractible/minimizable** — collapse to a slim pill, expand back to full panel
- **Global context** + **Zambia context** for each epoch
- **"So What"** sections connecting geology to modern Zambia
- **Formations, paleolatitude, and modern consequences** for each era

### 🏛️ Museum Passport
- **Progress tracking** — visited zones, markers, galleries
- **Return visitor awareness** — remembers your last era on reload
- **Clean landing** — no clutter on refresh, just the globe

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D Engine | Three.js + React Three Fiber |
| Animation | Framer Motion |
| Styling | Tailwind CSS (custom copper/ochre palette) |
| State | React hooks + localStorage passport |
| Geocoding | Nominatim (OpenStreetMap) |
| Fonts | Display, body, mono, citation system |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Mabspro/Zambia-Untold.git
cd Zambia-Untold

# Install dependencies
npm install

# Run development server
npm run dev

# Open
http://localhost:3000
```

---

## 📊 Content Inventory

| Content Type | Count | Coverage |
|-------------|-------|---------|
| Calendar Events | 41 | All 12 months |
| Folk Tales | 9 | 6 ethnic traditions |
| Globe Markers | 9 | Deep Time → Sovereign |
| Deep Time Vignettes | 9 | Pre-Geological → Present |
| Narrative Entries | 9 | Per-marker detail panels |

---

## 🗺️ Roadmap (Sprint B1)

See [`ZAMBIA_UNTOLD_SPRINT_B1_INTEGRATION_BRIEF.md`](./ZAMBIA_UNTOLD_SPRINT_B1_INTEGRATION_BRIEF.md) for the full integration plan:

- **Google Photorealistic 3D Tiles** — Museum ↔ Live Earth toggle
- **Digital Earth Africa** satellite layers (Sentinel-2, water, NDVI)
- **NGDR geospatial overlays** (chiefdom boundaries, national parks)
- **Seasonal real-time events** (Kuomboka floods, fire season, rainy greening)
- **NASA FIRMS** fire hotspot integration

---

## 🧭 Philosophy

> *"Global tools, Zambian vantage point, Zambian data partnerships."*

Every integration passes the sovereignty test: *Does this make a Zambian child see their country as a place with depth, texture, and living systems?*

The data is global. The vantage point is Zambian. The stories are sovereign.

---

## 📐 Development & regression prevention

Before merging or releasing: run `npm run validate`. See **[`docs/DEVELOPMENT_GUIDELINES.md`](./docs/DEVELOPMENT_GUIDELINES.md)** for critical invariants (lobby, guided tour, header, Supabase), pre-merge checklist, and links to CONTRIBUTING, TECH_AUDIT_MATRIX, and deploy docs.

---

## 📄 License

Creative Commons Attribution — community contributions displayed under CC-BY.

---

*Zambia Untold · Isibalo · The Living Archive*

## Progress Update (March 2026)

### Delivered in current implementation window
- UI/UX hardening from C0: panel mutual exclusion, Story Compass tuning, fly-to confirmation pin, cleaner top-left hierarchy.
- Layering fix: expanded `Map Layers` now sits above the Sovereignty stack and suppresses overlap.
- Space layer build-out: `Space Signal` panel, mission builder panel, Nkoloso marker integration, Nkoloso mythology sequence.
- Live data routes:
  - `/api/space/live` (ISS + fallback)
  - `/api/space/catalog` (curated live satellites with Zambia/near-Zambia filtering)
  - `/api/space/norad` (CelesTrak TLE ingestion + SGP4 propagation via `satellite.js`)
  - `/api/earth/observation` (NASA EONET events for Zambia region)
- Globe additions: ISS orbit cue, Earth Observation pulse layer.
- Visual direction: aged-archive treatment + subtle Zambia accents + reduced purple bias in globe grading.

### Current status summary
- Type safety: `npm run typecheck` passes.
- Lint: `npm run lint` passes.
- Space strategy: operational C1 foundation is live in-app.

## Next Steps (Execution Queue)
1. Upgrade NORAD route from sampled propagation to cached full-batch propagation + worker queue.
2. Add explicit satellite object rendering from propagated NORAD sample on globe (not only panel counts).
3. Add EO imagery tile integration (Sentinel/Worldview) behind `Earth Observation` toggle.
4. Expand Nkoloso cinematic from beat overlay to full scene sequence with synchronized audio layer.
5. Connect mission proposals to backend (Supabase) and render accepted proposals as community space tracks.
6. Run cross-device QA (375px mobile, low-bandwidth profile, keyboard/a11y pass).

## Progress Update (March 2026 - Sprint C0/C1 Execution Pass)

### Completed in this pass
- Added server-side stale-while-revalidate caching infrastructure for live feeds:
  - `/api/space/norad` now uses in-memory SWR caching + concurrency guard.
  - `/api/earth/observation` now uses in-memory SWR caching + concurrency guard.
- Added Earth imagery integration route:
  - `/api/earth/imagery` now emits NASA GIBS Worldview map URL/date for Zambia AOI.
- Added live satellite rendering on globe:
  - New `Live satellites` layer toggle.
  - On-globe selectable satellite objects rendered from NORAD propagated sample.
- Upgraded Earth Observation layer:
  - Pulls imagery URL from `/api/earth/imagery` and renders a subtle textured overlay on Zambia.
  - Keeps existing pulse rings as low-bandwidth fallback visual.
- Connected submissions to backend moderation path with fallback:
  - `ContributionForm` posts to `/api/community/submit`.
  - `SpaceMissionBuilder` posts to `/api/space/mission/submit`.
  - New server adapters write to Supabase when server env is configured; otherwise local fallback remains active.
- Upgraded Nkoloso cinematic:
  - Added synchronized tonal audio sequence using WebAudio API.
  - Added user audio control (`Tone On/Off`) and device support fallback.

### Validation
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` failed in this environment with webpack `spawn EPERM` (permission issue), not TS/ESLint errors.

## Next Steps (Updated)
1. See [`docs/DEPLOY.md`](./docs/DEPLOY.md) for **GitHub, Vercel, and Supabase** setup. **Current status:** SQL executed, `.env.local` present, Vercel deployed — confirm env vars in Vercel match local and verify `/notes` and submission writes.
2. Verify approved read-path against real moderation data in Supabase and tune payload limits.
3. Optimize satellite rendering with clustering at zoomed-out distances to reduce visual noise.
4. Add mobile QA pass for the new live satellites and cinematic audio controls.
5. Resolve build-environment EPERM (likely local permission/process lock) and rerun `npm run validate`.

## Engineering Guardrails

To reduce regressions during progressive development, use:
- [`docs/DEVELOPMENT_GUARDRAILS.md`](./docs/DEVELOPMENT_GUARDRAILS.md) - quality gates, UI/intro invariants, regression checklist.
- [`docs/ENGINEERING_MEMORY.md`](./docs/ENGINEERING_MEMORY.md) - short continuity log for decisions, risks, and follow-ups.

Recommended workflow for every UI/system change:
1. Add/update an Engineering Memory entry.
2. Implement smallest vertical slice.
3. Run `npm run typecheck` and `npm run lint`.
4. Run targeted visual checks at mobile and desktop breakpoints.




## Progress Update (March 2026 - C2/C2.5 Integration Pass)

### Completed in this pass
- Added approved-read APIs:
  - `/api/community/approved`
  - `/api/space/mission/approved`
- Extended Supabase server adapter with `selectSupabaseRows` for read paths.
- Rendered approved community artifacts on globe:
  - Approved Isibalo geospatial points.
  - Approved mission orbital tracks.
- Added zoom-aware visual declutter:
  - Community point and mission track LOD thinning based on camera distance.
- Added moderation telemetry in `Space Signal`:
  - Displays approved Isibalo and approved mission counts.

### Validation
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` still fails in this environment with `spawn EPERM`.

### Next
1. Verify approved endpoint payloads against live moderated Supabase records.
2. Tune LOD thresholds with production-size datasets.
3. Add admin moderation queue surfaces (pending/rejected) and review actions.
4. Resolve local worker-spawn permission issue blocking production build.

## Progress Update (March 2026 - C2.6 Ops/Readability Pass)

### Completed in this pass
- Added moderation stats endpoint:
  - `/api/moderation/stats` returns pending/rejected/approved counts for community + mission queues.
- Added deterministic live-satellite declutter:
  - Zoom-aware clustering/thinning in `LiveSatelliteLayer` to reduce bubble noise at wide zoom.
- Expanded Space Signal telemetry:
  - Added moderation queue stats block (counts only, no raw pending content exposure).

### Validation
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` still fails in this environment with `spawn EPERM`.

## Progress Update (March 2026 - C2.7 Moderation Controls + Mobile Telemetry)

### Completed in this pass
- Added moderation action endpoint:
  - `/api/moderation/review` (POST) to set `pending|approved|rejected` for community or mission records.
  - Endpoint is gated by `MODERATION_API_TOKEN` (header `x-moderation-token` or bearer token).
- Added compact mobile `Space Signal` mode:
  - Core ISS/satellite/archive/queue telemetry now visible on mobile (`md:hidden` compact panel).
- Added environment/deploy docs for moderation token:
  - `.env.example`
  - `docs/DEPLOY.md`

### Validation
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` still fails in this environment with `spawn EPERM`.

## Progress Update (March 2026 - C2.8 Moderation Operator Console)

### Completed in this pass
- Added token-gated moderation queue read endpoint:
  - `/api/moderation/queue` (GET) with `target=community|mission` and `status=pending|rejected|approved`.
  - Endpoint requires `MODERATION_API_TOKEN` via `x-moderation-token` or bearer token.
- Added in-app moderation operator panel:
  - New `Review` action in the bottom rail opens `ModerationConsole`.
  - Queue filters for Isibalo vs Missions and Pending vs Rejected.
  - Approve / Reject / Reset actions call `/api/moderation/review` directly.
  - Token is stored in `sessionStorage` for the active session only.
- Preserved one-panel-at-a-time invariant:
  - `Review` uses existing `openPanel()` exclusivity behavior.

### Validation
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` still fails in this environment with `spawn EPERM`.

### Next
1. Replace shared token flow with role-based auth (Supabase Auth / operator role).
2. Add reviewer notes and audit fields (`reviewed_by`, `reviewed_at`, `reviewer_notes`) on moderation updates.
3. Add pagination and search to moderation queue once records exceed 100.
4. Resolve local worker-spawn permission issue blocking production build.
