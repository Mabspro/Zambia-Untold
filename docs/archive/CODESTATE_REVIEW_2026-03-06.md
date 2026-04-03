# ZAMBIA UNTOLD - Code State Review (Handoff)

**Date:** March 6, 2026  
**Branch:** `main`  
**HEAD:** `87bf782`  
**Purpose:** Dated starting point for the next developer.

---

## 1) Executive Snapshot

The platform is in a strong, demo-capable state with the core museum loop active:
- Globe + deep-time navigation
- Mission framework (progress, badges, guided prompts; no hard locks)
- Community + space data overlays
- Mobile-first usability pass largely in place

Most recent production hotfix restored live satellite visibility defaults and added an explicit enable action in the `Space Signal` panel.

---

## 2) Verified Health (as of 2026-03-06)

- `npm run typecheck`: **PASS**
- `npm run lint`: **PASS**
- `npm run build`: **FAIL** in this local environment with `spawn EPERM` (worker process permission issue), not TS/ESLint errors.

---

## 3) Current System State

### App shell and orchestration
- Main orchestration remains in [`app/page.tsx`](app/page.tsx).
- Lobby/intro phases, guided tour, panel mutual exclusion, mission updates, and layer visibility are coordinated there.
- One-panel-at-a-time behavior is still enforced via `openPanel()`.

### Mission framework (C3)
- Mission definitions: [`lib/missions.ts`](lib/missions.ts)
- Event bus: [`lib/missionEvents.ts`](lib/missionEvents.ts)
- Reducer/progress application: [`lib/missionProgress.ts`](lib/missionProgress.ts)
- Persistence: [`lib/museumPassport.ts`](lib/museumPassport.ts) (`zambia-untold:mission-progress`)
- UI surfaces:
  - Mission panel: [`components/UI/MissionPanel.tsx`](components/UI/MissionPanel.tsx)
  - Badge overlay: [`components/UI/MissionBadgeOverlay.tsx`](components/UI/MissionBadgeOverlay.tsx)

### Guided onboarding + terminal language
- Guided hints are terminal-styled and interaction-driven:
  [`components/UI/GuidedTourHints.tsx`](components/UI/GuidedTourHints.tsx)
- Reusable typed text primitive:
  [`components/UI/TerminalText.tsx`](components/UI/TerminalText.tsx)

### Space/live integrations
- `/api/space/live`:
  - In-memory cache with TTL 30s
  - `X-Cache: HIT|MISS|STALE`
  - Stale fallback behavior
  - File: [`app/api/space/live/route.ts`](app/api/space/live/route.ts)
- `/api/space/catalog`:
  - In-memory cache with TTL 60s
  - `?counts=true` payload path
  - `X-Cache: HIT|MISS|STALE`
  - File: [`app/api/space/catalog/route.ts`](app/api/space/catalog/route.ts)
- `/api/space/norad`:
  - CelesTrak + SGP4 propagation + memory cache helper
  - Separate cache implementation (`lib/server/memoryCache.ts`)
  - File: [`app/api/space/norad/route.ts`](app/api/space/norad/route.ts)

### Live satellites rendering path
- Globe objects render from NORAD sample via [`components/Globe/Globe.tsx`](components/Globe/Globe.tsx) (`/api/space/norad`).
- HUD counts/list come from `catalog` (`counts` + full list on demand) in [`components/UI/SpaceSignal.tsx`](components/UI/SpaceSignal.tsx).
- `SpaceSignal` now includes an explicit **Enable** button if live satellites are off.
- Current default in page state is `liveSatellites: true` for desktop flow and hydration forces desktop `true`.

### Mobile/performance controls
- Low-Fi mode toggle and one-time mobile suggestion prompt are active in [`app/page.tsx`](app/page.tsx).
- Low-Fi preference key: `zambia-untold:low-fi-mode`.

---

## 4) Most Recent Changes (high impact)

### Commit `fd38747`
- Added layer visibility persistence key (`zambia-untold:layer-visibility`) and hydration logic.

### Commit `87bf782`
- Restored live satellites default visibility behavior.
- Added in-panel "Enable" CTA in `SpaceSignal` to prevent hidden-state confusion.

---

## 5) Known Issues / Risk Areas

1. **Build blocker in local environment**
   - `next build` fails with `spawn EPERM`.
   - This appears environmental/process-permission related, not a type/lint issue.

2. **Dual satellite data sources can confuse operators**
   - Globe visual satellites are driven by NORAD sample.
   - Space panel headline counts/list are driven by catalog route.
   - This can produce non-intuitive count differences at a given moment.

3. **Moderation auth model is still transitional**
   - Token-based operational flow exists; role-based auth migration remains pending.

4. **Overlay density still needs discipline**
   - Mission panel, guided tour panel, space panel, and action rail can cluster on smaller screens if all visible at once.
   - Current mitigations are improved, but this remains a regression-prone area.

---

## 6) Invariants to Protect (Do Not Regress)

1. One-panel-at-a-time overlay behavior from `openPanel()` in `app/page.tsx`.
2. Intro/lobby phase order and replay reliability (`playIntro` flow).
3. Guided tour progression gates (drag globe -> move scrubber -> select marker).
4. Mobile safe-area positioning for mission/tour/action bar.
5. Local-first persistence for passport + mission progress.
6. No hard locks in mission system (guidance and rewards only).

---

## 7) Recommended Next Steps (Priority Order)

1. **Unify satellite truth model**
   - Decide primary source for both rendered objects and displayed counts (NORAD vs catalog), then align both HUD and globe to it.

2. **Resolve `next build` EPERM in local/dev environments**
   - Unblock `npm run validate` as a full gate.

3. **Complete moderation hardening**
   - Replace shared token workflow with role-based auth.
   - Add reviewer metadata writes (`reviewed_by`, `reviewed_at`, `reviewer_notes`).

4. **Mobile overlay conflict pass**
   - Final pass on small devices (320/360/390/430 widths) specifically for stacked overlays and tap reachability.

5. **Mission UX polish**
   - Keep first-load mission prominence, then taper.
   - Tighten mission-to-action prompts where users still stall.

---

## 8) Operational Notes for Next Developer

- Before changing UI layering, re-check:
  - [`app/page.tsx`](app/page.tsx)
  - [`lib/ui/safeLayout.ts`](lib/ui/safeLayout.ts)
  - [`components/UI/GuidedTourHints.tsx`](components/UI/GuidedTourHints.tsx)
  - [`components/UI/MissionPanel.tsx`](components/UI/MissionPanel.tsx)
  - [`components/UI/SpaceSignal.tsx`](components/UI/SpaceSignal.tsx)

- For space data changes, always test:
  - Counts-only path (`/api/space/catalog?counts=true`)
  - Full catalog path (`/api/space/catalog`)
  - NORAD sample path (`/api/space/norad`)
  - Layer-off and layer-on states in UI.

- Minimum regression gate:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build` (when EPERM issue is resolved)
