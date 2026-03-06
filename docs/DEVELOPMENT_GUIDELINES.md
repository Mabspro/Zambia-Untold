# Zambia Untold — Development Guidelines & Regression Prevention

**Purpose:** Keep the codebase stable as features are added. Use this doc before merging or shipping to avoid regressions.

---

## 1. Session updates (March 2026) — what was added

| Area | What was done | Key files |
|------|----------------|-----------|
| **Supabase / deploy** | Schema migration, server client, notes verification page, deploy docs | `supabase/migrations/001_zambia_untold_tables.sql`, `lib/supabase/server.ts`, `lib/server/supabase.ts`, `app/notes/page.tsx`, `.env.example`, `docs/DEPLOY.md` |
| **First-time welcome** | Interaction-driven 3-step guided tour after lobby | `components/UI/GuidedTourHints.tsx`, `app/page.tsx` (tour state, storage keys), `components/Globe/Globe.tsx` (`onUserInteract`) |
| **Play intro** | Button to replay full lobby + tour on demand | `app/page.tsx` (`playIntro`, clears lobby + tour keys, resets phase to `preload`) |
| **Header layout** | Single card for title + era nav (no stacked cards) | `app/page.tsx` (unified header card), `components/UI/TimeButtons.tsx` (`embedded` prop) |

**Storage keys (sessionStorage):**

- `zambia-untold:lobby-seen` — lobby has been seen (return visitors skip to `done`)
- `zambia-untold:guided-tour-seen` — guided tour completed or skipped
- `zambia-untold:reentry-prompt-shown` — re-entry "You left during {zone}" already shown

---

## 2. Do not regress — critical invariants

### Lobby & first-time flow

- **Lobby phases** must remain: `preload` → `globe` → `thesis` → `ui` → `pulse` → `done`. Timers live in `lobbyTimersRef`; cleanup on unmount or when phase changes. Do not leave timers running without cleanup.
- **Return visitors:** If `LOBBY_STORAGE_KEY` is set or Museum Passport exists, set `lobbyPhase` to `"done"` on mount. Do not replay the full lobby for them unless they click "Play intro".
- **Guided tour** runs only when `lobbyPhase === "done"` and `TOUR_STORAGE_KEY` is not set. Completing or skipping the tour must set `TOUR_STORAGE_KEY` and turn off the tour (`showGuidedTour` false).
- **Play intro** must clear both `LOBBY_STORAGE_KEY` and `TOUR_STORAGE_KEY`, set `lobbyPhase` to `"preload"`, and reset tour interaction state (`hasUserDraggedGlobe`, `hasUserMovedScrubber`, `showGuidedTour`).

### Globe & camera

- **Idle snap:** 8s idle → snap to Africa; `autoRotateSpeed` 0.15. Do not revert to 15s or 0.35 (globe drifts to Americas).
- **Globe `onUserInteract`** is used by the guided tour (step 1: "drag to explore"). Do not remove it without providing another way to advance step 1 or removing the tour dependency.
- **Initial camera** targets Africa (Zambia). Keep `africaCenteredCameraPosition` and idle-snap target consistent.

### Header & UI

- **Header** is a single card: title block + border-t divider + TimeButtons. TimeButtons in the header use **`embedded`** (no border/background). Do not reintroduce a second card under the title so the "stacked cards" look does not return.
- **Panel rule:** Only one of `activePanel` or `selectedMarkerId` should be active at a time. Opening a panel clears the selected marker; selecting a marker clears the open panel. Enforce in `openPanel` and in `onMarkerSelect`.

### Data & Supabase

- **Writes** use `lib/server/supabase.ts` with `SUPABASE_SERVICE_ROLE_KEY`. Read-only verification uses `lib/supabase/server.ts` with anon key. Do not expose the service role key to the client.
- **Tables:** `isibalo_submissions`, `space_mission_proposals`, `notes`. API routes use env overrides `SUPABASE_ISIBALO_TABLE` / `SUPABASE_SPACE_MISSIONS_TABLE` when set.

### Content & types

- **Markers** and **narratives** are keyed by marker `id`. Adding a marker requires an entry in both `data/markers.ts` and `data/narratives.ts` with matching `id`.
- **NarrativeSource** must include `region` and `confidence` where applicable. Do not drop the evidence schema.

---

## 3. Pre-merge / pre-release checklist

Run these before merging to `main` or cutting a release:

```bash
npm run typecheck   # Must pass
npm run lint        # Must pass
```

**Manual smoke checks (recommended):**

- [ ] First load: preload → lobby sequence → thesis → UI → pulse → done, then guided tour (3 steps).
- [ ] Guided tour: step 1 advances on globe drag or 15s; step 2 on scrubber/era change or 15s; step 3 on marker click or 15s; Skip ends tour.
- [ ] "Play intro" restarts from preload and runs lobby + tour again.
- [ ] Return visit (refresh after completing lobby): no lobby replay; re-entry prompt if passport has last zone.
- [ ] Header: single card, no second card peeking under the era row.
- [ ] One panel at a time: opening Calendar/Folk Tales/Deep Time/etc. closes the narrative panel; clicking a marker closes any open panel.
- [ ] `/notes`: shows Supabase sample notes when env is set, or the "Configure…" message when not.

**If you touch Supabase or env:**

- [ ] Confirm Vercel env vars match `.env.example` (see `docs/DEPLOY.md`). Do not commit `.env.local` or any file with real keys.

---

## 4. Where to look for more

| Topic | Document |
|-------|----------|
| Adding markers/narratives | `CONTRIBUTING.md` |
| File-by-file health, technical debt | `TECH_AUDIT_MATRIX.md` |
| GitHub, Vercel, Supabase setup | `docs/DEPLOY.md` |
| First-time welcome / tour design | `docs/FIRST_TIME_WELCOME_REVIEW_AND_PLAN.md` |
| CTO/strategic and technical review | `ZAMBIA_UNTOLD_CTO_REVIEW.md` |
| UI/UX audit and commentary | `docs/UI_UX_AUDIT_REPORT.md`, `docs/UI_UX_AUDIT_REVIEW_COMMENTARY.md` |
| Appearance (Mwela, copper, typography) | `docs/Appearance-Context.md` |

---

## 5. Branch / PR discipline

- Run `npm run validate` (typecheck + lint + build) before opening a PR. Fix any failures.
- Do not change lobby phase order, storage key names, or the single-card header layout without updating this doc and the relevant audit/plan docs.
- When resolving a technical-debt item from `TECH_AUDIT_MATRIX.md`, remove or update the corresponding row so the matrix stays accurate.

---

*Development Guidelines · March 2026 · Zambia Untold*
