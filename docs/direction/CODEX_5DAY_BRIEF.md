# Codex 5-Day Brief — April 3–8, 2026
_Human operator away. Work autonomously through this sequence. Push to main after each completed task. Do not batch multiple tasks into one commit._

---

## Standing Orders

- Read `docs/direction/CURSOR_ONBOARDING_PROMPT.md` before anything
- `npm run typecheck` must pass before every commit
- Never break the globe render path
- Push each task as a separate commit with a clear message
- Log each completed task in `docs/ENGINEERING_MEMORY.md`
- If blocked, document the blocker clearly in ENGINEERING_MEMORY.md and move to the next task

---

## Task 1 — Wire the `/?fly=lat,lng` Globe Handler (UNBLOCKED)

**What:** When a user clicks "Fly to Globe" from `/discover`, the homepage receives `?fly=lat,lng` and flies the globe camera to those coordinates.

**Where:**
- `app/page.tsx` — read the `fly` query param on mount using `useSearchParams()`
- When param is present: trigger the existing globe fly-to animation to the given coordinates
- Clear the param from the URL after the fly-to fires (use `router.replace('/')`)
- The globe already has a fly-to mechanism — find it in `components/Globe/Globe.tsx` and use the same pattern

**Scope:** `app/page.tsx` and `components/Globe/Globe.tsx` only. No new components needed.

**Done when:** Clicking "Fly to Globe" on a `/discover` place card navigates to `/` and the globe animates to the place coordinates.

---

## Task 2 — Sprint 0.5: zambiamacro.ai Present State Integration

This is the most important task. It connects zambia-untold to the live zambiamacro.ai signals.

### 2a. Add environment variables

Add to `.env.local` (and document in `.env.example`):

```
ZAMBIAMACRO_SUPABASE_URL=https://[signals-project-ref].supabase.co
ZAMBIAMACRO_SUPABASE_ANON_KEY=[anon key from signals.zambia.ai project]
```

**Important:** These are the signals.zambia.ai Supabase credentials, NOT the zambia-untold credentials. They are separate projects. The anon key only has access to public views — this is safe.

These have already been added to `.env.local` for you. Do not change them.

### 2b. Build `lib/untold/present-state.ts`

Implement the canonical `UntoldPresentState` contract and fetch adapter:

```ts
export interface UntoldPresentState {
  psi: {
    value: number | null;
    regime: string | null;
    updatedAt: string | null;
  };
  hydrology: {
    karibaPercent: number | null;
    status: 'healthy' | 'stressed' | 'critical' | 'unknown';
  };
  fx: {
    pair: 'ZMW/USD';
    value: number | null;
    direction: 'up' | 'down' | 'flat' | 'unknown';
  };
  railHealth: {
    label: string;
    status: 'healthy' | 'degraded' | 'stale' | 'unknown';
  };
  sourceStatus: 'live' | 'fallback';
}

export const FALLBACK_PRESENT_STATE: UntoldPresentState = {
  psi: { value: null, regime: 'Unavailable', updatedAt: null },
  hydrology: { karibaPercent: null, status: 'unknown' },
  fx: { pair: 'ZMW/USD', value: null, direction: 'unknown' },
  railHealth: { label: 'Signal unavailable', status: 'unknown' },
  sourceStatus: 'fallback',
};
```

The fetch adapter must always return a complete `UntoldPresentState` — never throw to the caller.

### 2c. Build `/api/zambia-macro/state/route.ts`

Server-side route that:
- Creates a Supabase client using `ZAMBIAMACRO_SUPABASE_URL` + `ZAMBIAMACRO_SUPABASE_ANON_KEY`
- Fetches from these public views in the signals project:
  - `public_psi_view` — select `psi_score`, `regime_label`, `inference_date` (or similar — check actual column names in the signals repo schema)
  - `public_hydrology_latest_view` — select latest Kariba storage %
  - `public_boz_fx_latest_view` — select latest ZMW/USD rate + previous rate for direction
  - `public_rail_health_latest_view` — select overall_status
- Shapes into `UntoldPresentState`
- Returns fallback state if any fetch fails
- Cache: `revalidate = 3600` (1 hour — this is structural context, not real-time)

**Confirmed column names (do not guess):**

`public_psi_view`: `inference_date`, `psi_score`, `psi_regime`, `confidence`, `model_version`

`public_hydrology_latest_view`: `date`, `percent_full`, `lake_level_m`

`public_boz_fx_latest_view`: `date`, `zmw_usd_mid` — fetch last 2 rows (ORDER BY date DESC LIMIT 2) to derive direction from row[0] vs row[1]

`public_rail_health_latest_view`: `checked_at`, `overall_status`

For hydrology: `percent_full` is Kariba storage %. Map to status: `>40% = healthy`, `20-40% = stressed`, `<20% = critical`.

For FX direction: compare `row[0].zmw_usd_mid` vs `row[1].zmw_usd_mid`. If row[0] > row[1] by >0.5% = `up`, if < by >0.5% = `down`, else = `flat`. If only one row = `unknown`.

### 2d. Build `components/untold/PresentSignalStrip.tsx`

A compact signal strip component showing the live zambiamacro state:

```
Power Stress:    0.65 / Moderate
Kariba Storage:  20.9%
FX:              ZMW 19.12 / Stable
System Health:   Degraded
Last updated:    2026-04-01
→ Full analysis: zambiamacro.ai
```

**Design rules:**
- Matches existing copper/navy palette
- Shows `sourceStatus` clearly: "Live Signal" or "Signal Unavailable"
- Renders correctly with all-null fallback values (shows "—" not crashes)
- Links to `https://zambiamacro.ai` for full analysis
- Does NOT reproduce analytical depth — contextual strip only

### 2e. Wire PresentSignalStrip to the Living Zambia epoch

- In `app/page.tsx` or the sovereignty panel: when `UntoldMode === 'living'`, render `PresentSignalStrip`
- Fetch via the `/api/zambia-macro/state` route
- The strip should appear as a panel or rail in the existing UI — do NOT restructure the globe layout
- The `WhyThisSignal` component already exists — use it alongside the strip

**Done when:** Navigating to "View Live Zambia" shows the PresentSignalStrip with real or graceful fallback zambiamacro data.

---

## Task 3 — Fix the Lint Issue

The Windows `.next/cache/eslint` EPERM lock has been blocking lint. 

Try in order:
1. Delete `.next/cache/` directory and rerun `npm run lint`
2. If still failing, run `next lint --no-cache`
3. Fix any lint errors that surface
4. Commit: "chore: lint clean"

Do not skip this — it should be clean before the human returns.

---

## Task 4 — Discover Zambia: Add 3 More Places (Optional, if Tasks 1-3 are done)

Add these three places to `data/discoverPlaces.ts` if time permits:

**Lower Zambezi National Park**
- Province: Lusaka / Southern border
- Categories: nature
- Coordinates: -15.50, 29.20
- Short: A flood-plain wilderness where the Zambezi defines the southern boundary and elephant corridors follow the water.

**Kafue Flats**
- Province: Southern / Western
- Categories: nature, cultural
- Coordinates: -15.80, 27.00
- Short: One of Africa's largest floodplains, shaped by the Kafue River's seasonal pulse and the lives of fishing communities who read its rhythms.

**Shiwa Ng'andu**
- Province: Muchinga
- Categories: heritage, cultural
- Coordinates: -11.20, 31.73
- Short: An English manor house built in the Zambian bush in the 1920s — a strange colonial artifact now part of the country's texture.

Find appropriate Wikimedia Commons images for each. Use the branded fallback if no suitable image exists.

---

## Task 5 — Future Layer Scaffold (If Everything Else Is Done)

Build a minimal `/future` route — no content yet, just structure and framing.

**What it should say:**
- Title: "Future Zambia"
- Framing paragraph: the technology trajectory — sovereign compute, native data, local AI possibility
- Three placeholder cards: "Sovereign Compute", "Native Data", "Local AI Possibility"
- Each card: title + one sentence + "Coming soon" state
- Link to coppercloud-orchestrator.vercel.app for Sovereign Compute
- "Return to Museum" link

**What it must NOT do:**
- Make any claims that aren't true yet
- Pull in external data
- Compete with the globe hero
- Be over-engineered — this is a placeholder scaffold

**Done when:** `/future` loads, reads correctly, and links to CopperCloud.

---

## Commit Message Convention

Use this format:
```
feat: [what was built]
fix: [what was fixed]  
chore: [maintenance work]
docs: [documentation only]
```

Include a brief body note if the change is non-obvious.

---

## If You Hit a Blocker

1. Document it in `docs/ENGINEERING_MEMORY.md` with: what you tried, what failed, what the error was
2. Move to the next task
3. Do not spin on a blocker for more than 2 attempts

---

## Summary Priority Order

1. ✅ Task 1: fly handler (unblocked, 20 min)
2. ✅ Task 2: Sprint 0.5 Present layer (most important)
3. ✅ Task 3: Lint clean
4. ⚡ Task 4: 3 more discover places (if time)
5. ⚡ Task 5: /future scaffold (if time)

_Supervised by: Levi (OpenClaw AI). Human operator returns ~April 8._
