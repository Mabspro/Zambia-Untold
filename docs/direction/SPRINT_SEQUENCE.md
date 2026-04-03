# Zambia Untold — New Direction: Sprint Sequence & Implementation Doctrine
_Last updated: 2026-04-02_

---

## The Core Tension

Zambia Untold already has the seed of a category-defining cultural-tech product. The interface has atmosphere, conviction, and symbolism.

The next leap is not prettier visuals or more systems. It is a clearer journey architecture so first-time users can move from **awe → understanding → participation**.

Right now the product feels like entering a beautifully lit chamber of national memory. The next job is to give visitors a **lantern, a map, and a reason to keep walking**.

**The single most important constraint before adding anything:**

> Do not add more systems before you add orientation.
> Build the front door before you widen the cathedral.

---

## Three Governing Documents

These three docs serve different roles and should stay separate:

| Document | Purpose |
|----------|---------|
| `ZAMBIA_UNTOLD_VISION_V2.md` | Product roadmap and system spec — what to build and when |
| `Site-Critique.md` | UX governor and anti-drift doctrine — why certain things matter |
| `New-Direction_Sprint-Sequence.md` (this file) | Implementation bridge — how product tensions translate to components, routes, state, and data contracts |

---

## The Three-Layer Product Model

Zambia Untold is evolving into a **living platform with three temporal layers**, each with a distinct role:

| Layer | What it is | User question answered | External link |
|-------|-----------|----------------------|---------------|
| **Past** | 900M years of history, geology, kingdoms, folklore | "Where did Zambia come from?" | — |
| **Present** | Live sovereign intelligence — power stress, hydrology, FX | "What is Zambia dealing with right now?" | zambiamacro.ai |
| **Future** | Sovereign compute, native AI, digital infrastructure vision | "Where could Zambia go?" | coppercloud.ai |

**Role boundaries are non-negotiable:**
- Zambia Untold = the **meaning layer** (narrative, context, cultural depth)
- zambiamacro.ai = the **signal layer** (analytical depth, methodology, confidence)
- coppercloud.ai = the **trust-and-infrastructure layer** (sovereign compute, audit, governance)

Blur these boundaries and the ecosystem becomes intellectually impressive but product-wise foggy. Protect them and it becomes powerful.

**The habit loop insight (most important for commercial viability):**
- Past creates wonder
- **Present creates return behavior** ← this is the commercial and behavioral hinge
- Future creates strategic gravity

The Present layer is what turns Zambia Untold from a one-time experience into a recurring surface.

---

## Mode Model

The product needs a central **view-mode** to replace implicit state derived from scattered epoch/panel combinations:

```ts
export type UntoldMode =
  | 'deep-time'
  | 'historical'
  | 'living'      // ← the Present layer
  | 'archive'
  | 'future';
```

**Mode is the lantern.** Without it, the globe says one thing, the side rail says another, the footer links to a third idea, and the user quietly leaves.

The screen state should derive from `mode + selectedEpochId`, not from each component guessing independently.

---

## Sprint Sequence

### Sprint 0 — Front Door (Build First, No Exceptions)

**Goal:** First-time users understand what this is and how to begin within 10 seconds.

**Why this comes first:** Every subsequent feature makes the cathedral bigger. Without orientation, each addition compounds the confusion.

**What to build:**

1. **Subtitle line** under the title:
   > "Explore Zambia through deep history, living systems, and cultural memory."

2. **Three entry routes** — explicit, first-class navigation:
   - "Start with Deep Time"
   - "View Live Zambia"
   - "Enter the Archive"

3. **Mode state** — central `UntoldMode` model driving panel/rail behavior

4. **Progress system reframed** — intentional, not incidental:
   - Historical explorer: "4 of 8 galleries"
   - Live user: "Live Zambia last checked today"
   - Archive contributor: "Mission pathway unlocked"

5. **"Why am I seeing this?" explainer** — one-click context for why live signals appear on a history platform:
   > "Zambia Untold includes present-day signals because the current era is part of the archive, not outside it."

**Suggested component structure:**
```
app/page.tsx
components/untold/
  HeroIntroCard.tsx
  EntryRoutes.tsx
  GlobeViewport.tsx
  ContextRail.tsx
  ProgressPassport.tsx
  WhyThisSignal.tsx
lib/untold/
  entry-routes.ts
  onboarding-state.ts
  ui-mode.ts
```

**Entry route contract:**
```ts
type EntryRoute = 'deep-time' | 'live-zambia' | 'archive';

interface EntryRouteItem {
  id: EntryRoute;
  label: string;
  description: string;
  href?: string;
  onSelect?: () => void;
}
```

**Local returning-user state:**
```ts
interface ReturningUserHints {
  lastEntryRoute?: EntryRoute;
  dismissedIntro?: boolean;
  lastViewedLiveStateAt?: string;
}
```
New users see orientation. Returning users jump back to their previous mode quickly. The "stored locally" privacy stance becomes productively useful here.

---

### Sprint 0.5 — Present Habit Loop Skeleton

**Goal:** Wire the live signal strip as a lightweight, cached, fallback-safe surface.

**What to build:**

1. `/api/zambia-macro/state` proxy route — fetches and shapes zambiamacro.ai public views into an Untold-safe contract
2. `PresentSignalStrip` component — 3-4 tickers: PSI level, Kariba %, FX direction, rail health
3. Graceful fallback adapter (see doctrine below)
4. "View Live Zambia" route behavior
5. "Last updated" + source status display

**Normalized data contract:**
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
```

**Fallback must be formal, not improvised:**
```ts
export async function getUntoldPresentState(): Promise<UntoldPresentState> {
  try {
    return await fetchAndShapeLiveState();
  } catch {
    return {
      psi: { value: null, regime: 'Unavailable', updatedAt: null },
      hydrology: { karibaPercent: null, status: 'unknown' },
      fx: { pair: 'ZMW/USD', value: null, direction: 'unknown' },
      railHealth: { label: 'Signal unavailable', status: 'unknown' },
      sourceStatus: 'fallback',
    };
  }
}
```

**Architecture rule:** Do not fetch live macro state inside the main globe render tree. Use server-side fetch with cached shaping, or a client-side lazy panel that hydrates after the globe is stable. Live data failures must never contaminate the hero render path.

**Prerequisites:** zambiamacro.ai public API surface (post-April retrain, targeting May–June 2026)

---

### Sprint A — Street View Prototype

**Goal:** "See Your Village From Space *and* From the Street" — the diaspora moment.

**Scope constraint:** Attached to existing village/town search only. No new routing, no core architectural spread.

**What to build:**
- "View at street level" button appears only when Street View coverage exists for a searched location
- `StreetLevelPanel` side panel — does not affect globe state
- Fallback to Mapbox satellite view for locations without Street View coverage

**Plugin-like component structure:**
```
lib/location/street-view.ts
components/untold/StreetLevelPanel.tsx
components/untold/LocationActionButton.tsx
```

**Availability contract:**
```ts
interface StreetViewAvailability {
  available: boolean;
  provider: 'google-street-view' | 'fallback-mapbox' | 'none';
  lat: number;
  lng: number;
}
```

Street View logic must not leak into core globe state beyond: selected location + whether street panel is open.

**Why Phase A (not later):** For diaspora users the "from orbit to the street" moment is not a delight feature — it's the thesis made visceral. It's the thing that makes someone cry or share the link. Keep it scoped but don't delay it.

---

### Sprint B — Visual Globe Overlays

**Build only after Sprint 0.5 Present signal strip feels stable.**

- Lusaka marker PSI pulse (intensity proportional to PSI level 0.0–1.0)
- Zambezi river overlay Kariba tint (blue → amber → red)
- Hover tooltips: "PSI [level] / [regime]", "Kariba [%] capacity"
- Sovereignty panel live strip (see Vision V2 §2.3)
- Cross-site ecosystem navigation strip (all three sites)

---

### Sprint C — Future Layer

**Build only after users can explain the product back to you in one sentence.**

Add a checkpoint before starting: Can a new visitor distinguish Zambia Untold from zambiamacro.ai? Do they understand why live signals appear on a history platform? Do they click through to Macro at meaningful rates?

**Three pillars only (resist scope creep):**
1. **Sovereign Compute** — What CopperCloud is and why Zambia needs it → coppercloud.ai
2. **Native Data** — The untapped datasets that are Zambia's training substrate
3. **Local AI Possibility** — What becomes possible when models are trained on Zambian data, for Zambian contexts

Everything else (language maps, sector-specific models, agricultural stress AI, financial inclusion) nests underneath or defers. The Future layer must not become a technology manifesto.

**Globe additions:**
- CopperCloud node marker — Lusaka or Copperbelt, **explicitly labeled "planned"** (never overclaim)
- Language overlay — 73 Zambian languages, AI training data coverage (near zero for most)

---

### Sprint D — Depth & UNGA Readiness

**Target: demo-ready by September 2026 for UNGA side events**

- Digital Earth Africa NDVI/water layers
- Enhanced EONET fire season surface
- Street View integration polished
- Institutional demo state: coherent end-to-end journey from Deep Time → Present signal → ecosystem links

---

## Ecosystem Navigation Architecture

The three sites form a coherent trilogy. Navigation should make this explicit without being loud.

**The user journey biases toward:**
> Untold (invitation) → Macro (diagnosis) → CopperCloud (systems answer)

Not all directions equally. CopperCloud is conceptually downstream for most users — surface it after Untold and Macro have established why infrastructure matters.

**Ecosystem strip — data-driven, one config shape:**
```ts
export const ecosystemLinks = [
  {
    id: 'untold',
    label: 'The Archive',
    href: 'https://zambia-untold.vercel.app',
  },
  {
    id: 'macro',
    label: 'The Signal',
    href: 'https://zambiamacro.ai',
  },
  {
    id: 'coppercloud',
    label: 'The Infrastructure',
    href: 'https://coppercloud.ai',
  },
];
```

One shared `EcosystemStrip` component pattern across all three sites. Reduces drift, reinforces the trilogy without making it noisy.

---

## Feature Gate Doctrine

Before shipping any feature, it must clear at least one of these:

1. Does it improve orientation for a first-time user?
2. Does it strengthen return behavior (the habit loop)?
3. Does it preserve the globe as the hero surface?
4. Does it belong to Untold — or should it live in zambiamacro.ai or coppercloud.ai?

**A feature belongs in Zambia Untold if it:**
- Clarifies Zambia across time
- Makes the present legible in contextual (not analytical) form
- Deepens cultural or archival participation
- Bridges to ecosystem sites without duplicating their core role

**Save this file as:** `docs/doctrine/untold-feature-gate.md` when doctrine stabilizes.

---

## Design Invariants

- **Never break the globe** — all live data integrations must have graceful static fallbacks
- **Hero truth vs context truth** — historical layers are hero truth; live signals are context truth; never let context truth contaminate the hero render path
- **Honest labeling** — "planned" vs "live", structural context vs operational signals, source freshness always visible
- **No cluttered UI** — each addition must earn its place; the globe is always the hero
- **Sovereign vantage point** — global tools, Zambian perspective, Zambian data
- **Performance** — Three.js globe is already heavy; all new API calls must be lazy-loaded and cached

---

## The One-Paragraph Pitch (When It's Ready)

_Not yet — earn this after Sprint 0 and 0.5 ship._

> Zambia Untold is the only platform that lets you explore Zambia across all of time — from 900 million years of geological formation through kingdoms, colonialism, and sovereignty — step into the present with live power stress intelligence, and look toward a future of sovereign compute and native AI. Built by a Zambian. Grounded in public data. Honest about what it knows and what it doesn't.

---

_Update this file as sprints complete. No code changes until Sprint 0 front door is the active work._
