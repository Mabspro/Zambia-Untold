# ZAMBIA UNTOLD — Museum Sprint Plan

**Document Status:** Execution Plan  
**Version:** 1.0  
**Date:** March 2026  
**Reference:** `MUSEUM_ENHANCEMENT_PLAN.md`, `Tech-And-Experience-Recommendation.md`, `Content Architecture` (Community/Inganji/Isibalo), `Mineral_Context.md`, `Community-Context.md`, `Foundation.md`

---

## Current State (Pre–Museum Sprints)

| Sprint | Status | Delivered |
|--------|--------|-----------|
| 1 | ✅ Complete | Globe scaffold, 6 markers, time scrubber (476K BC → 2026) |
| 2 | ✅ Complete | X-Ray shader, Cha-cha-cha particles, Export Brief |
| 3A | ✅ Complete | OrbitControls, Zambia boundary, province highlight, idle snap |
| Sprint A (Production) | ✅ Complete | Lint, typecheck, fonts, error boundary, DataIssueBanner |
| A1 | ✅ Complete | Deep Time segmented scrubber (4.5B BC → 2026), contextual epoch cards, lobby sequence, zone labeling |
| A2 | ✅ Complete | Boundary scanline, dynamic atmosphere response, epoch palette overlay, Zambezi layer, in-geometry HUD, Katanga formation layer |

**Stack:** Next.js 14, React Three Fiber, Three.js. No Cesium.

---

## Museum Phase → Sprint Mapping

| Museum Phase | Sprint(s) | Duration | Dependencies |
|--------------|-----------|----------|--------------|
| **Phase A: Museum Identity** | A1, A2, A3 | 6–8 weeks | None |
| **Phase A Extended: Content & Docs** | A4 | 2–3 weeks | Phase A |
| **Phase B: Acoustic & Voice** | B1 | 2 weeks | Phase A |
| **Phase D: Then vs. Now** | D1 | 3–4 weeks | Phase A, Mapbox/Cesium signup |
| **Phase C: Living Archive** | C1 | 3–4 weeks | Phase D, backend |

---

## Sprint A1 — Deep Time Foundation (2 weeks)

**Goal:** Restructure the scrubber as a geological axis. Every position tells a story.

### Deliverables

| Task | Output | Spec Reference |
|------|--------|----------------|
| Segmented scrubber axis | 8 zones: DEEP EARTH → ANCIENT LIFE → HOMINID RISE → ZAMBIA DEEP → COPPER EMPIRE → KINGDOM AGE → COLONIAL WOUND → UNFINISHED SOVEREIGN | MUSEUM Plan 2.5, Appendix D |
| Zone boundaries | Non-linear mapping: 4.5B BC, 540M BC, 5M BC, 476K BC, 1000 CE, 1600 CE, 1890, 1964 | Appendix D |
| Contextual Epoch Cards | Panel content when scrubber is between markers. Build-time generated from Appendix D tables. | MUSEUM Plan 2.5 |
| Lobby sequence | 3s globe-only, thesis line at 3s, UI at 5s, copper pulse at 7s | MUSEUM Plan 2.1 |

### Success Criteria

- [x] Scrubber has labeled zone names
- [x] Dragging through DEEP EARTH feels distinct from ZAMBIA DEEP
- [x] No dead zones — panel always shows narrative or contextual card
- [x] Lobby: 3s no chrome, thesis line, 7s pulse

### Agent Brief

Create `ZAMBIA_UNTOLD_SPRINT_A1_AGENT_BRIEF.md` from this section + MUSEUM Plan Part 2.5, Appendix D.

---

## Sprint A2 — Globe Rendering & Mineral Layers (2–3 weeks)

**Goal:** Intelligence-agency aesthetic. Boundary scanline, atmosphere, epoch palettes, mineral layer foundations.

### Deliverables

| Task | Output | Spec Reference |
|------|--------|----------------|
| Boundary sovereign scanline | Dash-offset animation on Zambia boundary | Appendix C |
| Dynamic atmosphere | Opacity/thickness scale with camera distance; topo shadows below 500km | Appendix C |
| Epoch palette system | Globe tint by scrubber year. Colonial = cool gray-blue. 1964+ = copper return | Appendix A |
| Zambezi evolution layer | River state per epoch: Miocene (proto), Pleistocene (cycles), Kansanshi (highway), Colonial (dammed) | MUSEUM Plan 2.5 |
| In-geometry HUD | Sovereignty Stack rendered in R3F Canvas (Drei Html/Text), curved lens aesthetic | Appendix C |
| Mineral layer: Katanga formation | 900M BC hydrothermal pulse at Copperbelt coords. LTTB, max 500 particles | Appendix E |

### Success Criteria

- [x] Boundary looks actively scanned, not static
- [x] Zoom in: atmosphere adjusts, shadows appear
- [x] Colonial epoch visually distinct
- [x] Zambezi visible/implied across epochs
- [x] Sovereignty Stack in WebGL, not DOM overlay

### Agent Brief

Create `ZAMBIA_UNTOLD_SPRINT_A2_AGENT_BRIEF.md` from this section + MUSEUM Plan Appendix C, Appendix E (Layers 1–2).

---

## Sprint A3 — Exhibit Cards, Passport, Closing (2 weeks)

**Goal:** Museum UX. Placard hierarchy, evidence schema, visitor progression, CopperCloud closing frame.

**Status:** `✅ Complete`

### Deliverables

| Task | Output | Spec Reference |
|------|--------|----------------|
| Exhibit card redesign | Placard typography, hierarchy: title → epoch → body → citation block | MUSEUM Plan 2.3 |
| Evidence tab schema | `sources: NarrativeSource[]` with url, year, confidence, type, region | Appendix B |
| Museum Passport | localStorage: epochs/markers explored. Re-entry at last epoch. "You left during [zone]" prompt | MUSEUM Plan 2.5 |
| Galleries Visited counter | Visible on return. Optional: "3 of 6 galleries" nudge | MUSEUM Plan Part 6 |
| CopperCloud closing frame | Final frame at 2026 AD. Full closing text from MUSEUM Plan 2.5. CopperCloud as next chapter | MUSEUM Plan 2.5, Mineral_Context |

### Success Criteria

- [ ] Exhibit cards read like museum placards
- [ ] Evidence tab has structured sources (can be placeholder data)
- [ ] Return visit: "You left during the Copper Empire" + restore position
- [ ] Rightmost scrubber: substrate → structure → sovereignty → CopperCloud

### Agent Brief

Create `ZAMBIA_UNTOLD_SPRINT_A3_AGENT_BRIEF.md` from this section + MUSEUM Plan 2.3, Appendix B.

---

## Sprint A4 — Content Expansion, Docs & Curatorial Polish (2–3 weeks)

**Goal:** Expand exhibits, improve contributor experience, and formalize curatorial controls. See `docs/Tech-And-Experience-Recommendation.md`.

**Status:** `🔄 In progress` (docs, content, curatorial polish delivered)

### Deliverables

| Task | Output | Spec Reference |
|------|--------|----------------|
| Content expansion | Grow from 6 to ~25 markers (geology, trade routes, kingdoms, colonial, liberation) | Tech doc §4, MUSEUM Plan Content Expansion |
| Evidence strengthening | Academic citation, archival source, optional oral tradition per narrative | Tech doc §4.2 |
| Layers as curatorial modes | Reframe dropdown: Core Exhibit · Community Archive · Folk Tales · Evidence Mode | Tech doc §3.2, MUSEUM Plan 2.4 |
| Marker taxonomy | Distinct styles: copper (core), amber (Isibalo), spiral (Inganji), stone (geological) | Tech doc §3.3, MUSEUM Plan 2.4 |
| Quick Start | README: Requirements, Install, Run, Build before Tech Stack | Tech doc §2.1 |
| Deployment clarification | Document static export vs server model | Tech doc §2.2 |
| Core data schemas | README or docs: Marker, Narrative, NarrativeSource examples | Tech doc §2.3 |
| Contributor guide | How to add exhibit: marker → narrative → sources → optional layer | Tech doc §2.4 |

### Success Criteria

- [ ] ~25 markers across geology, trade, kingdoms, colonial, liberation
- [ ] Layers dropdown reads as curatorial modes
- [ ] Marker styles visually distinct by layer
- [ ] New contributor can add exhibit from docs alone
- [ ] README has Quick Start and deployment model

### Agent Brief

Create `ZAMBIA_UNTOLD_SPRINT_A4_AGENT_BRIEF.md` from this section + Tech-And-Experience-Recommendation.

---

## Sprint B1 — Acoustic & Voice (2 weeks)

**After Phase A complete.**

| Task | Output |
|------|--------|
| Epoch soundscapes | Web Audio ambient per gallery (≥3 epochs) |
| Curator's Voice | TTS docent, Self-Guided / Guided toggle |
| Audio controls | Mute, volume, per-layer toggle |

---

## Sprint D1 — Then vs. Now (3–4 weeks)

**After Phase A. Requires Mapbox or Cesium ion signup.**

| Task | Output |
|------|--------|
| Satellite tile layer | Mapbox or Cesium ion integration |
| Split-screen mode | Epoch view \| Satellite view |
| Sync camera | Single control, dual render |

---

## Sprint C1 — Living Archive / Isibalo (3–4 weeks)

**After Phase D. Requires backend or serverless.**  
**Brand:** Isibalo — the community record. **Spec:** `docs/LIVING_ARCHIVE_SPEC.md`. **Strategy:** `docs/Community-Context.md`.

| Task | Output |
|------|--------|
| Contribution form | Coordinate-pinned submission UI |
| Moderation queue | Review, approve, reject |
| Display layer | Community pins on globe |
| Northrise integration | Formal contribution path |

---

## Sprint C2 — Folk Tales & Mythology / Inganji (future)

**After C1. Spec:** `docs/INGANJI_SPEC.md`. **Full catalog & pipeline:** `docs/ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md`.

| Task | Output |
|------|--------|
| Mythology tab | On marker panels (Story / Evidence / Mythology) |
| Folk tale markers | Nyami Nyami, Kuomboka, Chitimukulu, etc. |
| Illustrated story cards | 4–6 panels per tale, culturally reviewed |
| Globe animations | Nyami Nyami, Kuomboka flagship sequences |
| Community folk tales | Isibalo submissions → Community Folk Tale markers |

---

## Execution Order

```
A1 (Deep Time) → A2 (Globe + Mineral) → A3 (UX + Closing)
       ↓                    ↓                    ↓
       └────────────────────┴────────────────────┘
                            ↓
                        Phase A Complete
                            ↓
                        A4 (Content, Docs, Curatorial)
                            ↓
              ┌─────────────┴─────────────┐
              ↓                           ↓
           B1 (Voice)                 D1 (Split-Screen)
              ↓                           ↓
              └─────────────┬─────────────┘
                            ↓
                        C1 (Living Archive)
```

---

## Data Dependencies (Pre-Sprint)

| Data | Source | When |
|------|--------|------|
| Craton polygons | BGS World Geology (free) | A2 |
| Gondwana outline | PALEOMAP project (free) | A2 |
| Mine coordinates | Mineral_Context + standard DBs | A2 or later |
| Contextual epoch card copy | Claude at build time, from Appendix D | A1 |

---

## Next Action

1. ~~Execute Sprint A3~~ ✅ Complete.
2. ~~Execute Sprint A4 (Content, Docs, Curatorial)~~ 🔄 In progress.
3. **Phase C prep:** Design Supabase schema per LIVING_ARCHIVE_SPEC Appendix C. Seed 8 contributions before launch (Content Architecture doc).
4. **Phase C2 prep:** Use INGANJI_SPEC + Content Architecture doc for Nyami Nyami as first folk tale. Launch sequence: Nyami Nyami → Kuomboka → Chitimukulu.
5. Re-run `npm run lint` and `npm run build` in a network-enabled environment.
