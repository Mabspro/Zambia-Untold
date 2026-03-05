# ZAMBIA UNTOLD

**The Atlas Museum** — A sovereign virtual museum for Zambia's deep history. The globe is the museum floor, time is the gallery wing, and every epoch is an exhibition hall. Navigate 4.5 billion years of geological and human history by dragging the Deep Time scrubber.

*The history you were never taught.*

---

## Quick Start

| Step | Command |
|------|---------|
| **Requirements** | Node.js 18+ |
| **Install** | `npm install` |
| **Run dev** | `npm run dev` |
| **Build** | `npm run build` |

---

## Tech Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | App Router, React Server Components, static export |
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **React Three Fiber** | 8.x | React renderer for Three.js |
| **Three.js** | 0.179.x | WebGL globe, shaders, geometry |
| **Drei** | 9.x | R3F helpers (Html, OrbitControls, etc.) |

### UI & Styling

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first styling, theme tokens |
| **Framer Motion** | Lobby transitions, panel animations, AnimatePresence |
| **PostCSS** | Tailwind processing |
| **Autoprefixer** | CSS vendor prefixes |

### Capabilities

| Technology | Purpose |
|------------|---------|
| **next-pwa** | PWA support, offline caching, service worker |
| **html2canvas** | Export Brief PNG capture |
| **cross-env** | Cross-platform env vars (`build:no-pwa`) |

### Data & Assets

| Format | Location | Purpose |
|--------|----------|---------|
| **GeoJSON** | `public/data/` | Zambia boundary, provinces, Lusaka roads |
| **Static JSON** | `data/*.ts` | Markers, narratives, contextual cards, Zambezi path |
| **Textures** | `public/textures/` | Earth night map, etc. |

---

## Project Structure

```
zambia-untold/
├── app/
│   ├── layout.tsx          # Root layout, metadata, globals
│   ├── page.tsx            # Home: lobby flow, scrubber, passport, layers
│   ├── globals.css         # Tailwind, CSS vars, keyframes
│   └── error.tsx            # Error boundary
├── components/
│   ├── Globe/              # R3F scene
│   │   ├── Globe.tsx       # Main scene: earth, atmosphere, layers
│   │   ├── GlobeMarker.tsx # Marker spheres
│   │   ├── ZambiaBoundary.tsx
│   │   ├── ZambeziLayer.tsx
│   │   ├── KatangaFormationLayer.tsx
│   │   ├── LusakaParticleSwarm.tsx
│   │   ├── ProvinceHighlight.tsx
│   │   ├── SovereigntyStackHUD.tsx
│   │   └── CameraRig.tsx
│   ├── Layout/
│   │   └── CanvasWrapper.tsx
│   └── UI/
│       ├── NarrativePanel.tsx   # Story/Evidence tabs, contextual cards
│       ├── TimeScrubber.tsx     # Deep Time axis
│       ├── LayersPanel.tsx
│       ├── PreloadScreen.tsx
│       ├── ExportBriefButton.tsx
│       ├── DataIssueBanner.tsx
│       ├── ChevronDivider.tsx
│       └── EpochLabel.tsx
├── data/
│   ├── markers.ts          # 9 exhibit markers (core + geological)
│   ├── narratives.ts      # Narrative + NarrativeSource schema
│   ├── contextualEpochCards.ts
│   └── zambeziPath.ts
├── lib/
│   ├── deepTime.ts        # 8-zone axis, year↔position mapping
│   ├── epochPalette.ts    # Globe tint by epoch
│   ├── epoch.ts           # isMarkerActive (legacy exports deprecated)
│   ├── camera.ts          # Lat/lng, quadratic arc
│   ├── geo.ts             # GeoJSON → Vector3, MARKER_TO_PROVINCE
│   ├── lttb.ts            # Downsampling for large point sets
│   ├── museumPassport.ts  # localStorage visitor progress
│   ├── sovereignty.ts     # Governance/Value/Infrastructure state
│   ├── dataIssues.ts      # Event bus for fetch failures
│   └── types.ts
├── public/
│   ├── data/              # GeoJSON (boundary, provinces, roads)
│   └── textures/         # Earth map
├── docs/                  # Specs, plans, context
└── TECH_AUDIT_MATRIX.md   # File-by-file audit, tech debt
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Production build (with PWA) |
| `npm run build:no-pwa` | Build without PWA (restricted envs) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run validate` | typecheck + lint + build |

---

## Deployment

**Current model:** Next.js server deployment. `npm run build` produces an optimized build; `npm run start` serves it. Suitable for Vercel, Railway, or any Node.js host.

**Static export (recommended for museums):** Add `output: 'export'` to `next.config.mjs` for a fully static site. Deploy the `out/` folder to any static host (Netlify, GitHub Pages, S3). No server required; ideal for offline PWA demos and institutional environments.

---

## Core Data Schemas

```ts
// data/markers.ts
type Marker = {
  id: string;
  epoch: number;           // Year (negative = BC)
  epochLabel: string;
  tag: string;
  coordinates: { lat: number; lng: number; alt: number };
  headline: string;
  subhead: string;
  color: string;
  accentHex: number;
};

// data/narratives.ts
type Narrative = {
  body: string;
  blocks?: NarrativeBlock[];
  cta: string;
  heroImage?: string;
  sources?: NarrativeSource[];
};

type NarrativeSource = {
  url: string;
  year?: number;
  confidence?: "high" | "medium" | "disputed";
  type?: "academic" | "archival" | "oral" | "media";
  label?: string;
  region?: "Zambia" | "Southern Africa" | "Pan-African" | "Global";
};
```

---

## Data Sources

| Asset | Source | Notes |
|-------|--------|-------|
| `zambia-boundary.geojson` | GeoJSON export | Country outline |
| `zambia-provinces.geojson` | GeoJSON export | Province polygons |
| `lusaka-roads.geojson` | GeoJSON export | Cha-cha-cha particle paths |
| `earth-night.jpg` | NASA Blue Marble / similar | Globe texture |
| Markers, narratives | Build-time | `data/markers.ts`, `data/narratives.ts` |
| Contextual cards | Build-time | `data/contextualEpochCards.ts` |

---

## Current Status

| Sprint | Status |
|--------|--------|
| A1 (Deep Time) | ✅ Complete |
| A2 (Globe + Mineral) | ✅ Complete |
| A3 (Exhibit cards, Passport, Closing) | ✅ Complete |
| A4 (Content, Docs, Curatorial) | 🔄 In progress |
| Phase B (Audio) | ⏳ Queued |
| Phase D (Split-screen) | ⏳ Queued |
| Phase C (Living Archive / Isibalo) | ⏳ Queued |
| Phase C2 (Folk Tales / Inganji) | ⏳ Future |

**Implemented:** Lobby sequence, Deep Time scrubber (4.5B BC → 2026 AD), contextual epoch cards, boundary scanline, Zambezi layer, Katanga formation, epoch palette, Museum Passport, Evidence tab, Export Brief, PWA, 9 markers (core + geological), Layers as curatorial modes, marker taxonomy.

---

## Key Docs

| Doc | Purpose |
|-----|---------|
| `docs/MUSEUM_ENHANCEMENT_PLAN.md` | Governing spec |
| `docs/MUSEUM_SPRINT_PLAN.md` | Sprint mapping |
| `docs/Tech-And-Experience-Recommendation.md` | Architectural strengths, visual/content recommendations, Phase A–C readiness |
| `docs/Community-Context.md` | Community & folk-tale strategy (Isibalo, Inganji) |
| `docs/ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md` | Full research: Inganji catalog, Isibalo Supabase schema, production pipeline |
| `docs/LIVING_ARCHIVE_SPEC.md` | Community contribution layer — implementation (Phase C) |
| `docs/INGANJI_SPEC.md` | Folk tales & mythology layer — implementation (Phase C2) |
| `docs/Mineral_Context.md` | Geological research |
| `TECH_AUDIT_MATRIX.md` | Technical audit, debt tracker |

**Four knowledge layers:** Historical record · Community archive (Isibalo) · Folk tales (Inganji) · Geological substrate. See `docs/Community-Context.md`.

**Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a new exhibit.

---

## Development Notes

- **No Cesium.** Globe is custom R3F + Three.js sphere.
- **Offline typography.** System font stacks (Book Antiqua, Garamond, Courier New) — no Google Fonts.
- **PWA:** Disabled in dev. Use `DISABLE_PWA=1` or `npm run build:no-pwa` in restricted build environments.
- **Globe:** Loaded with `next/dynamic` and `ssr: false` to avoid hydration mismatch.
- **Epoch overlay:** Globe tint by scrubber year is off by default for better contrast. Set `NEXT_PUBLIC_EPOCH_OVERLAY=1` to re-enable.
