# ZAMBIA UNTOLD — Next Sprint Brief
## The "Demo-Ready" Sprint

**Date:** March 2026  
**Sprint Name:** Sprint C0 — Foundation Fixes + Narrative Anchor  
**Duration:** 3–5 days  
**Goal:** Close the gap between the vision documents and what a first-time user experiences. Every item below is either blocking the institutional demo or breaking the core narrative experience.

---

## Context: What the Docs Are Telling Us

After reading all five docs in sequence — UI_UX_AUDIT_REPORT, UI_UX_AUDIT_REVIEW_COMMENTARY, LIVING_ARCHIVE_SPEC, INGANJI_SPEC, The-Palantir-Context — the signal is consistent and unanimous:

**The architecture is correct. The content is extraordinary. The experience has five specific issues that prevent it from landing the way it should.**

The Audit Commentary adds a critical nuance the original audit doesn't fully resolve: **the Story Compass should be subtle — a museum corner label, not a GPS**. Over-anchoring in a 4.5 billion year experience destroys the awe of scale. The Palantir context confirms the aesthetic direction — intelligence platform, not tourist app. The Living Archive and Inganji specs show exactly what Phase C/C2 requires, and both are closer to buildable than the sprint plan suggests (the ContributionForm frontend is already done; Supabase schema is already written).

Here is the starting point. In order of execution.

---

## Alignment Memo (Agreed Direction)

This brief is now aligned across:
- ZAMBIA_UNTOLD_CTO_REVIEW.md
- docs/UI_UX_AUDIT_REPORT.md
- docs/UI_UX_AUDIT_REVIEW_COMMENTARY.md
- docs/MUSEUM_ENHANCEMENT_PLAN.md
- docs/MUSEUM_SPRINT_PLAN.md

**Agreement locked for execution:**
1. **Sprint C0 starts with 3 blocks in this exact order:** Globe rendering fix -> Sovereignty Stack visibility restore (DOM layer) -> panel mutual exclusion.
2. **Story Compass is intentionally subtle** ("museum corner label", muted/low-contrast), never a dominant HUD.
3. **Sovereignty Stack implementation path:** use existing DOM SovereigntyStack component (not in-canvas Html) to avoid the historical full-viewport tint bug.
4. **After C0:** C1 (content + seeded Isibalo examples) -> C2 (Supabase backend + moderation flow) -> C3 (audio).
5. **Phase D (satellite split-screen) is explicitly deprioritized** until community contribution flow is live and stable.

---

## BLOCK 1 — Globe Rendering Fixes (4 hours)
*"The globe must be crisp before anything else matters."*

These are the two render issues that visually undermine the platform on first impression. Both are in `Globe.tsx` and `app/page.tsx`.

### Fix 1A: Lighting + Tone Mapping (ACESFilmic Limb Wash)
**Files:** `components/Globe/Globe.tsx`

The commentary correctly diagnoses this as a tone-mapping artifact, not just an atmosphere issue. The primary directional light at 0.95 intensity computationally blows out the earth texture edges under ACESFilmic.

```ts
// CURRENT (in Scene component):
<ambientLight intensity={0.28} />
<directionalLight position={[2.5, 1.5, 3]} intensity={0.95} color="#e8ecf4" />
<directionalLight position={[-2, -1, -2]} intensity={0.15} color="#ffffff" />

// CHANGE TO:
<ambientLight intensity={0.32} />
<directionalLight position={[2.5, 1.5, 3]} intensity={0.75} color="#e8ecf4" />
<directionalLight position={[-2, -1, -2]} intensity={0.08} color="#ffffff" />
```

And in the Canvas `gl` setup:
```ts
// CURRENT:
toneMappingExposure: 1.0,

// CHANGE TO (test both):
toneMappingExposure: 0.9,
// Also test: toneMapping: THREE.LinearToneMapping (in onCreated callback)
```

Also tune atmosphere opacity:
```ts
// CURRENT in Globe.tsx:
const ATMOSPHERE_OPACITY_NEAR = 0.07;

// CHANGE TO:
const ATMOSPHERE_OPACITY_NEAR = 0.04;
```

### Fix 1B: Globe Centers on Americas (Idle Snap + AutoRotate)
**Files:** `components/Globe/Globe.tsx`

```ts
// CURRENT:
autoRotateSpeed={0.35}
// ... in useFrame idle logic:
if (idleTime > 15) {
  snapActiveRef.current = true;
}

// CHANGE TO:
autoRotateSpeed={0.15}
// ... in useFrame:
if (idleTime > 8) {
  snapActiveRef.current = true;
}
```

Also verify the damping factor for idle snap feels smooth at the new speed:
```ts
// CURRENT:
const damp = 1 - Math.exp(-delta * 0.85);
// Keep this — the exponential ease is correct. Just the trigger time changes.
```

---

## BLOCK 2 — Restore Sovereignty Stack Visibility (DOM Layer) (1 hour)
*"Without this, the platform tells a story. With it, it makes an argument."*

**Files:** `app/page.tsx`, `components/UI/SovereigntyStack.tsx`, `components/Globe/Globe.tsx`

The in-canvas HUD was removed because it acted as a full-viewport tint. The concept stays; the implementation changes. For Sprint C0, use the existing DOM `SovereigntyStack.tsx` fallback already in the codebase and wire it to `scrubYear` in `app/page.tsx`.

**Do not restore `SovereigntyStackHUD` in the R3F scene for C0.**
If needed later, revisit 3D HUD as a separate visual experiment after demo-critical stability.

**In `app/page.tsx`, add the DOM component alongside other UI overlays:**
```tsx
// Add near LayersPanel / StoryCompass overlays:
{showUI && (
  <SovereigntyStack year={scrubYear} />
)}
``` 

Update `SovereigntyStack.tsx` to position fixed, bottom-left (above LayersPanel), small and non-intrusive. The three-state flip as the scrubber moves through epochs is the whole argument. It needs to be visible.

---

## BLOCK 3 — Panel Mutual Exclusion (30 minutes)
*"One panel at a time is a principle, not a convention. Enforce it at the state level."*

**Files:** `app/page.tsx`

This is the most significant UX issue and also the quickest fix:

```tsx
// CURRENT — two independent state signals:
const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
const [activePanel, setActivePanel] = useState<ActivePanel>(null);

// ADD a unified handler that enforces mutual exclusion:
const openPanel = useCallback((panel: ActivePanel) => {
  setActivePanel(panel);
  if (panel !== null) {
    // Opening any overlay → close narrative panel
    setSelectedMarkerId(null);
    setContextualCardDismissed(true);
  }
}, []);

// UPDATE all button onClick calls to use openPanel() instead of setActivePanel():
// onClick={() => openPanel(activePanel === "deepTime" ? null : "deepTime")}
// onClick={() => openPanel(activePanel === "calendar" ? null : "calendar")}
// etc. for all 5 buttons

// The Globe's onMarkerSelect already sets setActivePanel(null) — verify this.
// Globe's handleNavigateToCoordinate already sets setActivePanel(null) — verify this.
```

---

## BLOCK 4 — The Story Compass (2 hours)
*"A museum corner label — subtle, always accurate, never shouting."*

The Commentary adds the critical nuance the original audit lacks: the compass must be **low-contrast and peripheral**. The awe of 4.5 billion years depends partly on the user not being over-explained. This is a small, dim indicator in the corner, not a banner.

**New file:** `components/UI/StoryCompass.tsx`

```tsx
"use client";

import { useMemo } from "react";
import { getZoneForYear, formatDeepTimeLabel, type DeepTimeZone } from "@/lib/deepTime";
import type { Marker } from "@/data/markers";

type StoryCompassProps = {
  scrubYear: number;
  selectedMarker: Marker | null;
  activePanel: string | null;
};

const LAYER_LABELS: Record<string, string> = {
  deepTime: "🪨 Deep Time",
  calendar: "📅 Living Calendar",
  folkTales: "🔥 Oral Tradition",
  villageSearch: "📍 Geographic Search",
  contribute: "✦ Community Archive",
};

const ZONE_LABELS: Record<DeepTimeZone, string> = {
  "DEEP EARTH": "Deep Earth",
  "ANCIENT LIFE": "Ancient Life",
  "HOMINID RISE": "Hominid Rise",
  "ZAMBIA DEEP": "Zambia Deep",
  "COPPER EMPIRE": "Copper Empire",
  "KINGDOM AGE": "Kingdom Age",
  "COLONIAL WOUND": "Colonial Wound",
  "UNFINISHED SOVEREIGN": "Unfinished Sovereign",
};

export function StoryCompass({ scrubYear, selectedMarker, activePanel }: StoryCompassProps) {
  const label = useMemo(() => {
    if (activePanel && LAYER_LABELS[activePanel]) {
      return LAYER_LABELS[activePanel];
    }
    if (selectedMarker) {
      return `${selectedMarker.tag} · ${selectedMarker.epochLabel}`;
    }
    const zone = getZoneForYear(scrubYear);
    const timeLabel = formatDeepTimeLabel(scrubYear);
    return `${ZONE_LABELS[zone]} · ${timeLabel}`;
  }, [scrubYear, selectedMarker, activePanel]);

  return (
    // Fixed — bottom center above the action bar, or top center below the header
    // Low contrast: muted text, no background, barely there
    <div
      className="pointer-events-none fixed bottom-20 left-1/2 z-20 -translate-x-1/2 md:bottom-auto md:top-16 md:left-7 md:translate-x-0"
      aria-live="polite"
      aria-label="Current context"
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 md:text-[10px]">
        {label}
      </p>
    </div>
  );
}
```

**In `app/page.tsx`, add alongside other UI overlays:**
```tsx
{showUI && (
  <StoryCompass
    scrubYear={scrubYear}
    selectedMarker={selectedMarker}
    activePanel={activePanel}
  />
)}
```

Key design decision: `text-muted/50` — half opacity of the muted token. This is a whisper, not a label. It answers "where am I?" for users who need it, without breaking the deep time awe for users who don't.

---

## BLOCK 5 — Data Sovereignty Label (30 minutes)
*"The sovereignty argument should be visible in the UI, not buried in a README."*

This was surfaced in the Commentary and connects directly to the SovereigntyStackHUD concept. One line, always visible, aligning the CopperCloud premise with the platform's UI.

**In `app/page.tsx`, inside the header block:**
```tsx
// Add to the header title card, below "Galleries Visited":
<p className="mt-1 text-[9px] font-mono uppercase tracking-[0.16em] text-muted/40">
  Stored locally · No external tracking
</p>
```

This is 1 line of JSX. Its impact is disproportionate — it makes the offline-first architecture visible to the user and connects the platform's technical choices to its narrative.

---

## BLOCK 6 — Village Search Fly-To Confirmation Pin (2 hours)
*"A Zambian in London searching for their grandmother's village deserves a pin, not silence."*

**Files:** `app/page.tsx`, new `components/Globe/FlyToPin.tsx`

**New component:**
```tsx
// components/Globe/FlyToPin.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/camera";
import { Html } from "@react-three/drei";

type FlyToPinProps = {
  lat: number;
  lng: number;
  placeName?: string;
  onExpire?: () => void;
};

export function FlyToPin({ lat, lng, placeName, onExpire }: FlyToPinProps) {
  const ageRef = useRef(0);
  const opacity = useRef(1);
  const groupRef = useRef<THREE.Group>(null);
  const position = latLngToVector3(lat, lng, 1.025);

  useFrame((_, delta) => {
    ageRef.current += delta;
    // Fade out after 10 seconds
    if (ageRef.current > 8) {
      opacity.current = Math.max(0, 1 - (ageRef.current - 8) / 2);
    }
    if (ageRef.current > 10 && onExpire) {
      onExpire();
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Copper pin dot */}
      <mesh>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshBasicMaterial color="#B87333" transparent opacity={0.9} />
      </mesh>
      {/* Label */}
      {placeName && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none", userSelect: "none" }}>
          <div className="rounded border border-copper/40 bg-bg/90 px-2 py-0.5 backdrop-blur-sm">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-copperSoft whitespace-nowrap">
              📍 {placeName}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
```

**In `app/page.tsx`:**
```tsx
// Add state for fly-to pin:
const [flyToPin, setFlyToPin] = useState<{ lat: number; lng: number; placeName?: string } | null>(null);

// In handleNavigateToCoordinate, when flying to arbitrary coordinate:
setFlyToPin({ lat, lng, placeName: /* pass from VillageSearch */ });

// In the Globe scene (pass through Globe props):
flyToPin && <FlyToPin {...flyToPin} onExpire={() => setFlyToPin(null)} />
```

**In `VillageSearch.tsx`**, pass the place name through the `onNavigate` callback so the pin can label itself.

---

## BLOCK 7 — ProvinceHighlight String Fix (5 minutes)
*"One line. Prevents silent failures."*

**File:** `components/Globe/ProvinceHighlight.tsx`

```ts
// CURRENT — only replaces first space:
province.replace(" ", "-")

// CHANGE TO:
province.replace(/\s+/g, "-")
```

---

## BLOCK 8 — Zambia Boundary Visibility (30 minutes)
*"Users must be able to find Zambia on the globe."*

**File:** `components/Globe/ZambiaBoundary.tsx`

```ts
// CURRENT:
<lineDashedMaterial
  color="#B87333"
  transparent
  opacity={0.9}
  dashSize={0.012}
  gapSize={0.008}
/>

// CHANGE — thicker line, slightly more visible:
// The main fix is in the lineWidth (note: WebGL only supports lineWidth=1 on most systems)
// The real fix is: pulse the boundary opacity upward when no marker is selected
// Already partly implemented — ensure the base opacity is 0.9 and pulses to 1.0
// Add a subtle inner glow effect by adding a second wider semi-transparent line slightly offset
```

More impactful fix: add a faint semi-transparent Zambia fill polygon. This gives Zambia territorial presence on the globe even before a marker is clicked.

```tsx
// In ZambiaBoundary.tsx, after the lineLoop, add a fill mesh:
// Use the same GeoJSON points but create a THREE.Shape and ExtrudeGeometry
// Fill color: rgba(184, 115, 51, 0.06) — barely perceptible copper wash
// This is the audit's "subtle copper fill" recommendation
// Only visible when no marker is active (fade out when marker selected)
```

---

## BLOCK 9 — [MYTHOLOGY] Tab Scaffold in NarrativePanel (1 hour)
*"The Inganji spec calls for 4 tabs: [STORY] [MYTHOLOGY] [EVIDENCE] [COMMUNITY]. Scaffold the tab now, content comes in Phase C2."*

**File:** `components/UI/NarrativePanel.tsx`

```tsx
// CURRENT tab type:
type TabId = "story" | "evidence";

// CHANGE TO:
type TabId = "story" | "mythology" | "evidence" | "community";

// Add to the tab row:
<button
  type="button"
  onClick={() => setActiveTab("mythology")}
  className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
    activeTab === "mythology"
      ? "border-b border-copper text-copperSoft"
      : "text-muted hover:text-text"
  }`}
>
  Mythology
</button>

// Add placeholder content for mythology tab:
{activeTab === "mythology" && (
  <motion.div key="mythology" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <p className="text-[11px] text-muted leading-relaxed">
      Folk tale connections for this site are being prepared.
      Visit <strong>Inganji</strong> in the action bar to explore oral traditions.
    </p>
  </motion.div>
)}
```

This future-proofs the UI for Phase C2 without requiring Inganji content to exist yet.

---

## BLOCK 10 — Sparkles Reduction (5 minutes)
*"NASA backdrop, not screensaver."*

**File:** `components/Globe/Globe.tsx`

```tsx
// CURRENT:
<Sparkles count={50} scale={[2.5, 2.5, 2.5]} size={2} speed={0.08} color="#B87333" opacity={0.18} />

// CHANGE TO:
<Sparkles count={22} scale={[2.5, 2.5, 2.5]} size={1.0} speed={0.05} color="#B87333" opacity={0.12} />
```

```tsx
// CURRENT:
<Stars radius={120} depth={40} count={900} factor={3} saturation={0} fade />

// CHANGE TO:
<Stars radius={120} depth={40} count={500} factor={3} saturation={0} fade />
```

---

## BLOCK 11 — "On This Day" Calendar Wording (5 minutes)

**File:** `components/UI/HistoricalCalendar.tsx`

Find the "On This Day" rendering. Change logic:
- If today has an event → `"Today · ${event.title}"`
- If nearest event is upcoming → `"Coming Up · ${event.title}"`
- If nearest event is past this month → `"Nearest · ${event.title}"`

The Commentary correctly notes "Coming Up" implies only future. "Nearest" is accurate for all directions.

---

## BLOCK 12 — Sovereignty Stack Polish

**File:** `lib/sovereignty.ts`

The Commentary and CTO Review both flag the missing 1991 threshold:

```ts
// CURRENT — jumps from Colonial → Independent:
if (year < 1964) {
  return { governance: "Colonial Rule", ... }
}
return { governance: "Independent State", value: "Mixed/Contested", ... }

// ADD:
if (year < 1991) {
  return {
    governance: "Independent / One-Party State",
    value: "Nationalized / Contested",
    infrastructure: "State-Led Development",
  };
}
if (year < 2021) {
  return {
    governance: "Multi-Party Democracy",
    value: "Market / Partial Rebalancing",
    infrastructure: "Mixed Public-Private",
  };
}
// 2021+ (Hichilema era)
return {
  governance: "Independent State",
  value: "Mixed / SI 68 Era",
  infrastructure: "Rebalancing Sovereign",
};
```

This makes the Sovereignty Stack a genuinely accurate historical indicator, not just a 5-state approximation.

---

## BLOCK 13 — TD Cleanups (1 hour total)

**TD-01: lib/epoch.ts cleanup**
Delete all deprecated exports — only `isMarkerActive` should survive. The JSDoc `@deprecated` markers are already there; now execute the deletion.

**TD-05: MARKER_TO_PROVINCE validation**
In `lib/geo.ts`, add a dev-mode assertion:
```ts
// In a useEffect (dev only) in ProvinceHighlight.tsx:
if (process.env.NODE_ENV === 'development') {
  const provinceNames = /* loaded GeoJSON features map */;
  Object.values(MARKER_TO_PROVINCE).forEach(province => {
    if (!provinceNames.includes(province)) {
      console.warn(`[ProvinceHighlight] Province "${province}" not found in GeoJSON`);
    }
  });
}
```

**TD-06: Shaders → .glsl files**
Add to `next.config.mjs`:
```js
webpack: (config) => {
  config.module.rules.push({ test: /\.glsl$/, use: 'raw-loader' });
  return config;
},
```
Add `raw-loader` to devDependencies. Move `XRAY_VERTEX` and `XRAY_FRAGMENT` strings to:
- `components/Globe/shaders/xray.vert`  
- `components/Globe/shaders/xray.frag`

Import with:
```ts
import xrayVert from './shaders/xray.vert';
import xrayFrag from './shaders/xray.frag';
```

---

## Sprint C0 Completion Checklist

```
RENDERING (Globe looks sharp)
- [ ] Directional light: 0.95 → 0.75 intensity
- [ ] Atmosphere opacity: 0.07 → 0.04
- [ ] AutoRotateSpeed: 0.35 → 0.15
- [ ] Idle snap: 15s → 8s
- [ ] Sparkles: 50 → 22, size 2 → 1.0
- [ ] Stars: 900 → 500

NAVIGATION (One thing at a time)
- [ ] Panel mutual exclusion enforced at state level (openPanel() handler)
- [ ] SovereigntyStack DOM component restored and visible
- [ ] Story Compass component built and added (subtle, muted/50 text)
- [ ] Village Search fly-to pin with place name label

CONTENT (What you say is backed by evidence)
- [ ] ProvinceHighlight: .replace(" ","-") → /\s+/g
- [ ] Sovereignty thresholds: add 1991 (one-party) and 2021 (Hichilema era)
- [ ] Calendar: "On This Day" → "Nearest" logic
- [ ] [MYTHOLOGY] tab scaffold in NarrativePanel

SOVEREIGNTY (The thesis is visible)
- [ ] "Stored locally · No external tracking" in header
- [ ] Zambia boundary: verify base opacity and pulse behavior

TECHNICAL DEBT
- [ ] TD-01: epoch.ts — delete deprecated exports
- [ ] TD-05: MARKER_TO_PROVINCE dev assertion
- [ ] TD-06: Shaders to .glsl files (raw-loader)

VALIDATE
- [ ] npm run validate (typecheck + lint + build)
- [ ] Test on mobile (375px width — iPhone SE)
- [ ] Test on 3G throttle (Chrome DevTools)
```

---

## What Comes After Sprint C0

**Sprint C1 — Content & Data Layer (1 week)**
- Add 3 new markers: Mwela Rock Paintings, Kazembe Kingdom, TAZARA Railway
- Replace Ing'ombe Ilede Wikipedia sources with Fagan/Phillipson academic citations
- Add 20 calendar events (target: 61 total)
- Seed 8 Isibalo contributions to localStorage (bootstraps the archive)
- BGS/PALEOMAP/USGS GeoJSON download and commit to public/data/

**Sprint C2 — Isibalo Backend (2 weeks)**
- Supabase project setup (schema from LIVING_ARCHIVE_SPEC Appendix C — already written)
- Connect ContributionForm.tsx to Supabase (the form exists, just needs the API call)
- Add CommunityPin component (distinct amber glow markers)
- LayersPanel: add `communityArchive` toggle (off by default)
- Soft launch to inner circle with 5+ visible pins before public launch

**Sprint C3 — Phase B Audio (1 week)**
- Howler.js for epoch soundscapes
- Web Speech API Curator's Voice (GuidedMode toggle in LayersPanel)
- Colonial Wound soundscape: industrial, rhythmic, uncomfortable by design

**Phase D — Satellite Split-Screen (deprioritized)**
- Begin only after C2 is live and C3 is stable
- Keep PMTiles/MapLibre prep tasks non-blocking in parallel
- Do not let satellite work delay community onboarding

---

## The One Principle That Governs All of This

Every decision in Sprint C0 is in service of one thing: **the first-time visitor must understand what they are in within 30 seconds, without reading a word of documentation**.

The globe should be centered on Zambia. The scrubber position should be labelled. One panel should be open at a time. The Sovereignty Stack should show the three-state flip. The contribution form should be visible and inviting.

When all of that is true, the platform earns its own thesis: *the history you were never taught* — experienced, not just displayed.

---

*Sprint C0 · Zambia Untold · March 2026*  
*Governing brief — ready for agent execution*






