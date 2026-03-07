# Zambia Untold — Founder-CTO Product & Engineering Audit

**Date:** March 2026  
**Scope:** Public homepage experience for students, teachers, historians, visitors, and ordinary Zambians  
**Goal:** Validate museum-first experience; observatory as second lens; CopperCloud subtle; best-in-class flow, elegance, responsiveness, trust.

---

## 1. Intended vs Actual User Flow

### Intended (from The-LENS.md and strategy)

| Audience    | Primary need                         | Intended entry              |
|------------|--------------------------------------|-----------------------------|
| Students   | Historical continuity, identity     | **Lens 1 — Museum** (default) |
| Teachers   | Curriculum tools, visual history     | Museum (Deep Time, markers) |
| Historians | Curated evidence, citations          | Museum (narratives, sources) |
| Visitors   | National identity, discovery         | Museum (globe, timeline)    |
| Citizens   | Village search, community memory     | Museum + Isibalo (contribute)|
| Researchers| Datasets, policy context            | Both lenses as needed        |

- **Lens 1 (Archive / Museum):** Deep Time scrubber, markers, folk tales, calendar, narratives — *first-load default*.
- **Lens 2 (Observatory):** Satellite tracking, earth observation, live telemetry, mission proposals — *second lens*, opt-in.
- **CopperCloud:** Subtle in public experience (e.g. footer line only).
- **Admin / operator:** Not part of public IA; separate entry (e.g. `/admin` or token-gated).

### Actual (current codebase)

- **Single route:** One homepage that mixes museum, observatory, and operator surfaces.
- **First load:** Lobby (preload → globe → thesis → UI) then **all layers visible by default**, including:
  - Space signal (ISS, NORAD)
  - Earth observation (imagery + pulse)
  - Live satellites (desktop default `liveSatellites: true` in `app/page.tsx`)
  - Community approved (Globe fetches `/api/community/approved` and `/api/space/mission/approved` on mount regardless of layer state)
- **Action bar:** Deep Time, Calendar, Inganji, Search, Isibalo, **Review (Moderation)** — same nav for every visitor.
- **Space Signal panel:** Renders when `layerVisibility.space !== false` (default true), so observatory APIs fire as soon as UI appears.
- **No mode selector:** No "Observe the Past" vs "Monitor the Present" at entry; observatory is eager, not second lens.

**Conclusion:** Intended flow is museum-first with observatory as second lens; actual flow is "everything on at once" with admin (Moderation) in the public nav.

---

## 2. Issues Identified

### 2.1 Live stack boots too early — **CONFIRMED**

- **app/page.tsx** `DEFAULT_LAYERS`: `space: true`, `earthObservation: true`, `liveSatellites: true`. Desktop hydration (line ~198) forces `liveSatellites: true` when hydrating from localStorage.
- **Globe.tsx** fetches `/api/space/norad` whenever `layerVisibility.space` or `layerVisibility.liveSatellites` is true (default true on page).
- **Globe.tsx** fetches `/api/community/approved` and `/api/space/mission/approved` in a `useEffect` with empty deps — runs on mount regardless of layer visibility.
- **SpaceSignal** mounts when `enabled={layerVisibility.space !== false}` and then fetches 5 live APIs on first paint after UI shows.
- **EarthObservationLayer** fetches `/api/earth/imagery` when `active` (default true).

**Impact:** First load triggers multiple live/observatory APIs; not museum-first; increases latency and can confuse first-time visitors who came for history.

### 2.2 Duplicate and contradictory data models — **CONFIRMED**

- **Layer defaults:** `app/page.tsx` defines `DEFAULT_LAYERS` with `liveSatellites: true`; `components/Globe/Globe.tsx` defines its own `DEFAULT_LAYERS` with `liveSatellites: false`. Two sources of truth; page wins for initial state.
- **Types:** `LayerVisibility` is in `lib/types.ts`; sample types are duplicated inline in `Globe.tsx`.

**Impact:** Risk of drift; harder to enforce a single museum-first policy.

### 2.3 Admin tooling leaks into public IA — **CONFIRMED**

- **ModerationConsole** is opened from the main action bar ("Review" · "Moderation queue") next to Calendar, Inganji, Isibalo. No role or route gate; every visitor sees it.

**Impact:** Public IA suggests "Review" is a primary action; undermines trust and clarity.

### 2.4 Mobile safe-area handling incomplete — **CONFIRMED**

- **lib/ui/safeLayout.ts:** Reads `--safe-area-*` which are set to `env(safe-area-inset-*, 0px)`. `getComputedStyle` returns the literal string, so `parseFloat` gives NaN and insets stay 0.
- Only elements that use `env(safe-area-inset-bottom)` directly in CSS/style are correct.

**Impact:** On notched phones, JS-positioned elements may overlap system UI.

### 2.5 Homepage is museum + observatory + operator at once — **CONFIRMED**

- One page mixes lobby, globe, time scrubber, all layers (including Space/EO/Live Satellites), Calendar, Inganji, Search, Isibalo, **Moderation**, Space Signal, Mission Panel, Mission Builder, Narrative, Deep Time, Sovereignty Stack, Story Compass, banners, tour, badges, low-fi prompt.
- No mode selector; observatory and operator tools compete with museum on first load.

---

## 3. Recommended Target Experience

1. **Museum-first default:** Space, Earth Observation, Live Satellites **off** by default. Single source of truth for default layers.
2. **Observatory as second lens:** No live/observatory API calls until user enables those layers in Map Layers.
3. **Admin out of public IA:** Remove "Review" from main nav; gate behind `?moderation=1` or `/admin`.
4. **CopperCloud:** Keep current subtle footer.
5. **Safe areas:** Fix inset resolution and/or use `env()` consistently for bottom UI.

---

## 4. Implementation Priority

| Priority | Change |
|----------|--------|
| **P0**   | Museum-first default layers (single source; space, EO, liveSatellites off) |
| **P0**   | Remove Moderation from public nav; gate behind `?moderation=1` |
| **P1**   | Defer Globe community/approved and mission/approved fetch until layers enabled |
| **P1**   | Fix safe-area handling in safeLayout and critical UI |
| **P2**   | Optional: "Observe the Past" / "Monitor the Present" entry selector |
