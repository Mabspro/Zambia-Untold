# Space History & Logic — How It Works and How People See It

**Purpose:** Single reference for the space layer: narrative logic, data flow, and user-facing entry points.

---

## 1. Why space belongs in Zambia Untold

The space layer is not a separate product; it extends the same thesis: **African agency and ambition, often refused or mocked, then vindicated by history.**

- **Edward Mukuka Nkoloso (1964)** — At independence, a Zambian schoolteacher and freedom fighter declared that Zambia would reach **Mars** before the US or USSR. He founded the Zambia National Academy of Science, Space Research and Philosophy in Lusaka, trained “afronauts” (including Matha Mwamba and two cats) with oil drums and ropes, and requested UNESCO funding. The world laughed; UNESCO declined. The story was filed as “eccentric African curiosity.”
- **The real argument:** Nkoloso was making a claim that African scientific ambition has no ceiling. He was **refused**, not naive. Zambia has not launched a satellite yet — that is a fact about what has been **funded**, not about capability.
- **Today:** Live satellite data (ISS, NORAD, Earth observation) over Zambia shows what *could* have been supported. The museum juxtaposes **1964 refusal** with **real-time orbital data** and a **“Build Zambia’s Satellite”** youth engagement path. See **`docs/Space_Angle.md`** for the full strategic doc (Post 7, CopperCloud anchors, open APIs).

---

## 2. How people see it — entry points

| Where | What the user sees |
|-------|---------------------|
| **Globe marker** | A marker at Lusaka 1964: **“Nkoloso Space Academy”** (tag: SPACE SOVEREIGNTY). Clicking it opens the narrative panel and triggers the **Nkoloso cinematic** (beat-by-beat text + optional tone). |
| **Map Layers panel** (desktop, left) | Under **Overlays**: toggles for **Space signal (live)**, **Earth observation**, **Live satellites**. When **Space signal** is on, a **“Space Dreams”** section appears with **“Jump to Nkoloso (1964)”** and **“Build Zambia’s Satellite”**. |
| **Space Signal panel** (desktop, top-right) | Shown when the space layer is enabled. Shows: ISS over Zambia or not, altitude/velocity, **Mars distance (km)**, satellite pass estimate, NORAD parsed counts, live satellites over Zambia, Earth Observation events in the region, **“Build Mission”** button. Attribution: *Orbital: CelesTrak/NORAD · Compute: CopperCloud*. |
| **Globe visuals** | With **Space signal** on: **ISS orbit track** (moving dot). With **Live satellites** on: **selectable satellite objects** from NORAD-propagated sample. With **Earth observation** on: **imagery overlay** (NASA GIBS/Worldview) and/or pulse rings for EO events. |
| **Build Zambia’s Satellite** | Opens the **Space Mission Builder** panel: name, mission type (earth-observation / weather / communications), altitude, inclination. Submissions go to Supabase `space_mission_proposals` (or localStorage fallback). |

So: **history** = Nkoloso marker + narrative + cinematic; **live data** = Space Signal panel + ISS + live satellites + Earth observation; **youth activation** = Mission Builder and “Space Dreams” shortcuts.

---

## 3. Logic and data flow

### State (page level)

- **`layerVisibility.space`** — Master switch for space layer (Space Signal panel, ISS track, Nkoloso shortcut in Layers). Default `true`.
- **`layerVisibility.earthObservation`** — Earth Observation overlay and EO section in Space Signal. Default `true`.
- **`layerVisibility.liveSatellites`** — Renders propagated satellite objects on the globe and feeds NORAD counts into Space Signal. Default `true`.
- **`showNkolosoCinematic`** — True only when the **selected marker** is `nkoloso-space-academy`. Set in `onMarkerSelect` and cleared when another panel opens or marker is cleared.
- **`activePanel === "spaceMission"`** — Space Mission Builder overlay is open.

### APIs (server routes)

| Route | Purpose | Used by |
|-------|---------|--------|
| **`/api/space/live`** | ISS position (wheretheiss.at or fallback), Earth–Mars distance, satellites-over-Zambia estimate | SpaceSignal |
| **`/api/space/catalog`** | Curated list of satellites with Zambia/near-Zambia filtering | SpaceSignal |
| **`/api/space/norad`** | NORAD TLE parse + SGP4 propagation; returns counts and a **sample** of positions for globe rendering | Globe (live satellite meshes), SpaceSignal (counts) |
| **`/api/space/mission/submit`** | POST mission proposal → Supabase `space_mission_proposals` or local fallback | SpaceMissionBuilder |
| **`/api/earth/observation`** | NASA EONET (or similar) events in Zambia region | SpaceSignal, EarthObservationLayer |
| **`/api/earth/imagery`** | NASA GIBS/Worldview imagery URL for Zambia AOI | EarthObservationLayer (texture overlay) |

### Globe components

- **`ISSOrbitTrack`** — Single moving dot for ISS when `layerVisibility.space` is on.
- **`EarthObservationLayer`** — Fetches `/api/earth/imagery`, applies texture overlay and/or pulse rings when `earthObservation` is on.
- **Live satellites** — When `liveSatellites` and `space` are on, Globe fetches `/api/space/norad`, propagates a sample, and renders selectable satellite meshes (see `Globe.tsx` state `liveSatellites` and the layer that consumes it).

### Nkoloso cinematic

- **Trigger:** `selectedMarker?.id === "nkoloso-space-academy"`.
- **Content:** Four beats of text (academy, afronauts, UNESCO denial, “What if this ambition had sovereign infrastructure?”), ~2.2s per beat, ~9.5s total; optional Web Audio tone per beat.
- **Control:** “Tone On / Off” button; auto-ends and calls `onDone()` so the narrative panel remains usable.

---

## 4. Narrative content

- **Marker:** `data/markers.ts` → `nkoloso-space-academy` (Lusaka coords, 1964, tag SPACE SOVEREIGNTY, headline/subhead).
- **Narrative panel:** Uses the same narrative system as other markers; ensure `data/narratives.ts` has an entry keyed by `nkoloso-space-academy` for the full story and sources (if not, the panel still shows headline/subhead from the marker).
- **Cinematic beats:** Defined in `NkolosoCinematic.tsx` (`BEATS` array). For full Nkoloso copy and strategic framing, see **`docs/Space_Angle.md`**.

---

## 5. Summary

- **History:** Nkoloso 1964 — space academy, afronauts, UNESCO refusal, colonial mockery; reframed as **refused ambition**, not failure.
- **Live layer:** ISS, NORAD satellites, Earth observation events, Mars distance — “what exists over Zambia now” and attribution to open data + CopperCloud.
- **Youth layer:** “Build Zambia’s Satellite” / Space Mission Builder — name a mission, choose type/orbit, submit to moderation; proposals stored in Supabase (or locally).
- **How people see it:** Via the **Nkoloso marker** on the globe (1964), **Map Layers** toggles and “Space Dreams” links, the **Space Signal** panel (when space is on), **live satellites and ISS** on the globe, and the **Space Mission Builder** panel opened from Space Signal or Layers.

For product/positioning detail (Post 7, open tools, CopperCloud anchors), use **`docs/Space_Angle.md`**. For implementation details, use **`TECH_AUDIT_MATRIX.md`** and the files listed above.
