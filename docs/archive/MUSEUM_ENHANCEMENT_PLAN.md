# ZAMBIA UNTOLD — Virtual Museum Enhancement Plan

**Document Status:** Production — Governing Spec  
**Version:** 1.0  
**Date:** March 2026

---

## Executive Summary

ZAMBIA UNTOLD is reframed from "interactive historical atlas" to **The Atlas Museum** — a sovereign virtual museum for Zambia. The globe is the museum floor, time is the gallery wing, and every epoch is an exhibition hall. The scrubber is restructured as a **Deep Time axis** (4.5B BC → present) so every position tells a story — geological, biological, human — even when no marker is active. This plan defines the museum architecture, enhancement phases, and success criteria for stakeholder review.

---

## Part 1 — The Museum Concept

### Vision Statement

> A new category: a sovereign intelligence atlas experienced as a museum. Not a virtual tour of physical rooms. Not a slideshow. The globe is the museum floor, time is the gallery wing, and every epoch is an exhibition hall you navigate by dragging a scrubber.

### Reference Class

| Precedent | Relevance |
|-----------|------------|
| **Persepolis Reimagined** (Getty/Media.Monks) | Full-scale WebGL recreation of ancient civilization; instancing, LOD, historian input |
| **Kremer Museum** | World's first VR-only museum; social exploration, community discussion |
| **Met VR experiences** | Original storytelling + high-res objects + specialist curation |
| **Google Arts & Culture** | Scale reference; we differentiate via sovereignty, time-as-navigation, and African agency |

**Our position:** 476,000 years of Zambian agency on a globe, browser-based, offline-capable, 60fps. Built without colonial institution curation.

**The synthesis:** You are not building a historical atlas. You are not building a virtual museum in the conventional sense. You are building the **first sovereign intelligence platform** that makes the case — in 4.5 billion years of evidence — that Zambia has always been a substrate, always been a node, always been an actor. And that what CopperCloud is doing is not new. It is the most recent expression of something ancient. *That is an institutional pitch that no slide deck can make. Only a time machine can make it.*

**The paradox:** Zambia is simultaneously the oldest substrate and the most underexplored frontier. The copper ore is 900 million years old. The systematic knowledge of what else exists beneath Zambia is younger than the iPhone. Fewer than ten deep wildcat wells across the entire territory. That's not a contradiction — that's the argument for why what comes next matters.

**Four knowledge layers:** Historical record (ZAMBIA UNTOLD) · Community archive (Isibalo) · Folk tales & mythology (Inganji) · Geological intelligence (The Substrate). See `docs/Community-Context.md`.

**Content Architecture:** Full research for Isibalo, Inganji, and production pipeline: `docs/ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md`.

**Reference:** `docs/Tech-And-Experience-Recommendation.md` — architectural strengths to preserve, visual/content recommendations, and Phase A–C readiness strategy.

---

### Design Principles (Architectural Mandates)

These are strategic differentiators, not technical quirks. Preserve through Phase A–C.

| Principle | Implementation |
|-----------|-----------------|
| **Offline-first architecture** | System fonts, PWA service worker, static JSON, local textures, minimal runtime APIs |
| **Minimal external dependencies** | Custom Three.js globe (no Cesium), no WebGPU at this stage |
| **Sovereign data ownership** | Content-driven architecture; static structured content over runtime APIs |
| **Evidence-based historical record** | Academic citations, archival sources, optional oral tradition references |
| **Community knowledge integration** | Living Archive enriches without replacing curatorial core |

**Scene Layer Contract:** Every globe layer must define: activation epoch, geographic scope, visual primitive, narrative relationship. Prevents chaos as content grows. See Tech-And-Experience-Recommendation §1.3.

---

## Part 2 — Museum Architecture

### 2.1 The Lobby — Globe as Entry Hall

**Current state:** Globe loads, Africa centered, scrubber visible.

**Target state:**
- First 3 seconds: Globe only. No UI chrome. Earth from ~800km, slowly rotating, Zambia boundary glowing copper.
- At 3s: Single line fades in: *"Before there were nations, there was a substrate."*
- At 5s: Scrubber, header, and Layers panel fade in.
- At 7s: A single copper pulse radiates outward from Zambia's center. Then the UI settles.
- Optional: Subtle ambient (subsonic rumble) from first frame.

The 7s "heartbeat" signals the platform is alive, primes the visitor to expect interaction, and transforms a fade-in into a cinematic opening. One CSS/WebGL animation, zero dependencies.

**Success criteria:** Visitor understands the thesis before a single click.

---

### 2.2 The Galleries — Epochs as Exhibition Wings

Each epoch has a distinct aesthetic identity. The palette shift is editorial, not decorative.

| Epoch Range | Gallery Name | Aesthetic | Key Artifact |
|-------------|--------------|------------|--------------|
| 476,000 BC – 10,000 BC | **The Deep Substrate** | X-Ray topographic, copper glow, no borders | Kalambo wooden structure |
| 10,000 BC – 1000 CE | **The Migration Corridors** | Warm ochre, Bantu flow arrows | Twin Rivers pigment evidence |
| 1000 CE – 1600 CE | **The Copper Empire** | Rich amber, particle trade flows | Ing'ombe Ilede ingots |
| 1600 CE – 1890 CE | **The Kingdom Age** | Deep green, four kingdom boundaries | Lozi floodplain |
| 1890 – 1964 | **The Colonial Wound** | Desaturated blue-gray, extraction railways | Compound system map |
| 1964 – Present | **The Unfinished Sovereign** | Returning copper warmth, live data | Liberation sanctuary constellation |

**Implementation:**
- Globe tint/saturation driven by scrubber year.
- Colonial epoch (1890–1964): Cool gray-blue overlay, reduced copper intensity.
- 1964 onward: Warmth returns.
- Epoch-specific layer visibility (trade routes, kingdoms, railways) per Foundation.md.
- **Copper Corridor particle flow:** Use Three.js `InstancedMesh` for thousands of particles at 60fps. On colonial epoch (route reversal), color lerps from warm copper to cold industrial gray/blue — the extraction narrative without a single paragraph.

---

### 2.3 The Object Cases — Marker Panels as Exhibit Cards

**Current state:** NarrativePanel with Story / Evidence tabs, Export Brief.

**Target state — three layers per exhibit:**

| Layer | Content | Format |
|-------|---------|--------|
| **Surface** | Narrative (what it is, why it matters) | Museum placard typography |
| **Provenance** | Academic citations — Smithsonian, PNAS, Nature links | Evidence tab, structured |
| **Intelligence Dossier** | Export Brief PNG for sharing | One-click export |

**Design spec:**
- Placard-style hierarchy: object title → date/epoch → body → citation block.
- **Readability:** Slightly larger body text, increased line height, subtle contrast increase. Maintain museum aesthetic (Tech-And-Experience-Recommendation §3.1).
- Optional hero image and inline images (NarrativeBlock schema already supports).
- Evidence tab: `sources: [{ url, year, confidence, type, region }]` per marker. The `region` field ("Zambia" | "Southern Africa" | "Pan-African" | "Global") distinguishes local knowledge from external scholarship — critical for Living Archive display and Northrise partnership.

---

### 2.4 Curatorial Controls & Marker Taxonomy

**Layers as curatorial modes:** Frame the Layers dropdown as curatorial modes, not technical toggles. Examples: Core Exhibit · Community Archive · Folk Tales · Evidence Mode (Tech-And-Experience-Recommendation §3.2).

**Marker taxonomy:** Different knowledge layers use distinct marker styles to prevent confusion as content grows. This is the canonical visual grammar — do not introduce new marker types without updating this table.

| Marker Type | Glyph | Color | Meaning |
|-------------|-------|-------|---------|
| Curated exhibit | Point/diamond | Copper glow (#B87333) | Evidence-based historical narrative |
| Folk tale (Inganji) | Spiral/flame | Warm amber (#D4943A) | Legend, story passed down |
| Community (Isibalo) | Soft circle | Pale amber (#E8C170) | Contributed memory, moderated |
| Geological substrate | Stone glyph | Stone/earth (#8B7355) | Deep time, mineral formation |

---

### 2.5 Sound Design — Spatial Audio as Museum Acoustics

Each epoch has a signature soundscape (environmental texture, not music):

| Epoch | Soundscape |
|-------|------------|
| Deep Substrate | Subsonic geological rumble, cave resonance |
| Migration Corridors | Wind, distant movement |
| Copper Empire | Distant market ambience, metallic percussion |
| Kingdom Age | Organic, territorial |
| Colonial Wound | Industrial machinery, rhythmic, cold |
| Unfinished Sovereign | Crowd energy, liberation song fragments, quiet resolve |

**Implementation:** Web Audio API. User-toggleable (on by default). No external dependencies.

---

### 2.6 The Deep Time Axis — Scrubber as Geological Navigator

**The core insight:** The scrubber gap isn't a UX problem. It's an invitation to make the thesis **planetary rather than national**. Zambia's copper ore bodies are 900 million years old. The Copperbelt isn't a colonial discovery or even a human one — it's a geological event that predates complex life on Earth. When the visitor starts at 4.5 billion years ago and drags forward, they don't arrive at Kalambo Falls as a historical curiosity. They arrive at it as *the inevitable first act of intelligence on a substrate that has been waiting 900 million years to be found*. That is the Substrate Primacy thesis told in a single gesture. No words needed.

**What belongs on this globe:** Geological and biological context are Zambia's story — the planet-scale frame that makes 476,000 BC feel earned rather than arbitrary. See Appendix D for full tables.

#### Implementation Options

| Option | Approach | Pros |
|--------|----------|------|
| **A — Segmented Axis** (recommended) | Labeled era zones with non-linear spacing. Each zone gets proportional scrubber space regardless of real-time length. | Intuitive for non-specialists. Logarithmic scales are intellectually honest but experientially disorienting. Zone names do editorial work before a single marker fires. |
| **B — Logarithmic Scale** | Scrubber position maps to `log(years_ago)`. Human history (last 10K years) expands on the right. | ChronoZoom-style. Deep time and recent time both explorable. |

**Segmented axis zones (Option A) — each zone is a gallery wing:**
```
DEEP EARTH → ANCIENT LIFE → HOMINID RISE → ZAMBIA DEEP → COPPER EMPIRE → KINGDOM AGE → COLONIAL WOUND → UNFINISHED SOVEREIGN
4.5B BC       540M BC      5M BC         476K BC       1000 CE          1600 CE       1890             1964
```

#### Contextual Epoch Cards

When the scrubber is between named markers, the right panel does **not** go blank. That's a dead zone. It shows a **Contextual Epoch Card**:

> *"You are in the Cretaceous period, approximately 90 million years ago. The landmass that will become Zambia sits within Gondwana, covered by a shallow sea. The copper ore bodies forming deep underground will not be discovered by humans for another 89.9 million years."*

- **Essential and undervalued.** Filling these spaces with synthesized geological context transforms every position on the scrubber into meaning. The visitor is never not in a story.
- Generate by Claude at **build time**, not runtime — zero API cost. Agent-generatable from Appendix D tables.
- No academic citation required — contextual synthesis from standard geological/archaeological consensus.
- Globe tint shifts to match (deep blue-green for Cretaceous sea, ash-gray for K-Pg extinction, warm ochre for Pliocene savanna).

#### The Zambezi River as Persistent Character

One visual element persists across all geological epochs: **the Zambezi River system evolving**.

| Epoch | Zambezi State |
|-------|---------------|
| Miocene | Proto-drainage patterns; river doesn't exist yet |
| Pleistocene | Fills and empties with ice age cycles |
| Kansanshi epoch | Trade highway |
| Colonial | Dammed at Kariba |

The river is Zambia's spine. A river that doesn't exist yet in the Miocene, forms in the Pliocene, becomes a trade highway in the medieval period, gets dammed at Kariba in the colonial era — that's not a data layer. **That's a protagonist.** The museum has a protagonist that isn't a person. That's genuinely original.

#### Emotional Payoff

When a visitor drags from 66M BC (K-Pg extinction, dinosaurs gone) through 5M BC (Rift Valley forming), past 299,000 BC (Kabwe skull), to 1964 (independence) — they feel the weight of geological time as context for human achievement. By the time the Kalambo Falls marker fires, the visitor already knows: this structure was built after the dinosaurs by an incomprehensibly long margin, by a species already ancient when Egypt built its first pyramid. That's not a history lesson. That's a perspective shift.

**The scrubber gap isn't a bug — it's an invitation to make the most ambitious feature of the entire museum.**

#### Re-Entry Experience

When a returning visitor lands, the Museum Passport drops them back at their **last epoch** with a prompt: *"You left during the Copper Empire."* The geological layer makes this more powerful — someone who made it to the Cretaceous last time is being welcomed back into a genuinely different kind of exploration than someone who only saw the six markers.

#### CopperCloud Closing Argument

The scrubber ends at 2026 AD. The rightmost position is the most important moment in the entire experience. It should not just show the Lusaka liberation marker. It should show a **deliberate final frame** — every clause sourced to peer-reviewed geology or documented policy:

> *900 million years ago: hydrothermal fluids deposit copper into the Katanga Supergroup sediments above three converging cratons. 476,000 years ago: a human engineer works the land above it. 12th century: the copper becomes currency. 1964: the nation becomes sovereign. 2025: SI 68 requires that sovereignty extend to who benefits from the ground. 2026: the first complete aerial geophysical survey of the substrate is still running — and the same fault system that made the copper is now being mapped for clean hydrogen.*

Beneath it: **CopperCloud** as the infrastructure layer of the next chapter. That's not marketing. That's the logical conclusion of everything the visitor just experienced. The museum earns that closing argument across 4.5 billion years of context. Reference: `docs/Mineral_Context.md` — Appendix E for layer specs.

---

## Part 3 — Three Differentiating Features

### 3.1 The Curator's Voice — AI Docent Layer

- Text-to-speech narrates exhibit card text as scrubber moves or marker is selected.
- Options: Web Speech API (zero cost) or ElevenLabs (premium quality).
- Modes: **Self-Guided** (silent) | **Guided Tour** (docent on).
- Cadence: Measured, authoritative. Not robotic.

**Value:** For diaspora audiences, this makes the experience feel like a gift.

---

### 3.2 The Living Archive — Community Contribution Portal

- "Add Your Memory" submission form anchored to any map coordinate.
- Visitor from Solwezi can pin oral tradition about Kansanshi.
- Lusaka elder can attach a photograph to the 1964 liberation marker.
- Tonga community member can add Nyami Nyami story to Kariba coordinate.
- Moderation workflow (manual or partner-led).
- Northrise University partnership angle: formal scholarship contribution mechanism.

**Value:** Museum grows as community contributes. Earns institutional buy-in.

---

### 3.3 The Then vs. Now — Split-Screen Gallery

- Any coordinate, any epoch vs. present satellite view.
- Colonial railway infrastructure over pre-colonial trade routes.
- Extraction corridor vs. Lobito Corridor.
- Zambia's story compressed into a gesture.

**Implementation:** Requires satellite tile layer (Mapbox/Cesium ion). X-Ray or epoch view on left, satellite on right. Sync camera position.

---

## Part 4 — Phased Enhancement Plan

**Phase order:** A → B → D → C. Split-screen (D) delivers more "wow" per effort than the contribution portal (C) and has zero institutional dependency — show the institution first, then invite participation.

### Phase A: Museum Identity (2–3 weeks)

| Task | Output | Dependencies |
|------|--------|--------------|
| Lobby sequence | 3s globe-only, thesis line, 7s copper pulse, delayed UI | None |
| Deep Time scrubber | Segmented or logarithmic axis (Appendix D) | None |
| Contextual Epoch Cards | Panel content when no marker active | None |
| Zambezi evolution layer | River state per epoch | None |
| Globe rendering | Boundary scanline, atmosphere, topo shadows, in-geometry HUD (Appendix C) | None |
| Epoch palette system | Globe tint/saturation by year | None |
| Exhibit card redesign | Placard typography, hierarchy | None |
| Evidence tab schema | `sources` array, citation links | None |
| Museum Passport | Visitor progression, re-entry at last epoch | None |
| CopperCloud closing | Final frame at 2026 AD, infrastructure layer | None |

**Success:** Visitor feels they've entered an institution, not an app.

**Re-entry:** Museum Passport restores last epoch with "You left during [zone name]" prompt. **Closing:** Rightmost scrubber position shows substrate → structure → sovereignty frame + CopperCloud as next chapter.

---

### Phase B: Acoustic & Voice (2 weeks)

| Task | Output | Dependencies |
|------|--------|--------------|
| Epoch soundscapes | Web Audio ambient per gallery | None |
| Curator's Voice | TTS docent, Self-Guided / Guided toggle | Web Speech API or ElevenLabs |
| Audio controls | Mute, volume, per-layer toggle | None |

**Success:** Boardroom demo is unforgettable with sound on.

---

### Phase D: Then vs. Now (3–4 weeks) — *Before Living Archive*

| Task | Output | Dependencies |
|------|--------|--------------|
| Satellite tile layer | Mapbox or Cesium ion integration | API signup |
| Split-screen mode | Epoch view \| Satellite view | None |
| Sync camera | Single control, dual render | None |

**Success:** Signature interactive — before/after in one gesture. Ship to DFIs and universities before asking for contributions.

---

### Phase C: Living Archive (3–4 weeks) — *After Then vs. Now*

**Brand:** Isibalo — the community record. See `docs/Community-Context.md` for strategic rationale.

| Task | Output | Dependencies |
|------|--------|--------------|
| Contribution form | Coordinate-pinned submission UI | Backend or serverless |
| Moderation queue | Review, approve, reject | Auth or partner workflow |
| Display layer | Community pins on globe | Data model |
| Northrise integration | Formal contribution path | Partnership |

**Success:** First community-contributed memory visible in production.

**Implementation spec:** `docs/LIVING_ARCHIVE_SPEC.md`

### Phase C2 (future): Folk Tales & Mythology (Inganji)

Folk tales and mythology layer — illustrated story cards, animated globe sequences (e.g. Nyami Nyami, Kuomboka), Mythology tab on markers. Community-submitted folk tales via Isibalo feed into this layer. See `docs/Community-Context.md` Part 2.

---

### Content Expansion Strategy (Phase A Extended)

The museum will succeed primarily through depth of content. After Phase A core UX is complete, expand exhibits from 6 to ~25 markers (Tech-And-Experience-Recommendation §4).

**Recommended early additions:**

| Category | Examples |
|----------|----------|
| **Geology** | Broken Hill deposit, Kansanshi mine |
| **Trade Routes** | Swahili coast trade links, Copperbelt rail corridors |
| **Kingdoms** | Luba connections, Lozi kingdom expansion |
| **Colonial Era** | Kariba Dam construction, Northern Rhodesia administration |
| **Liberation** | Kaunda independence movement |

**Evidence layer:** Each narrative should include academic citation, archival source, and optional oral tradition reference for institutional credibility.

---

## Part 5 — Institutional Pitch (Reframed)

| Stakeholder | Museum Framing |
|-------------|----------------|
| **Universities (Northrise, UNZA)** | Living academic archive and teaching tool, not a tech demo |
| **African Union** | First sovereign digital museum of pre-colonial African agency |
| **DFIs** | Proof of what African digital infrastructure produces from the substrate up |
| **Diaspora** | The museum their grandparents' countries never built for them |

---

## Part 6 — Success Criteria (Review Checklist)

### Phase A
- [ ] Lobby: 3s globe-only, thesis line, 7s copper pulse, no chrome
- [ ] Deep Time: Segmented scrubber zones, contextual epoch cards when no marker
- [ ] Zambezi: River evolution visible across epochs
- [ ] Globe rendering: Boundary sovereign scanline, dynamic atmosphere at zoom
- [ ] Epoch palette: Colonial epoch visually distinct (cooler)
- [ ] Exhibit cards: Placard hierarchy, readability (body text, line height, contrast), Evidence tab with citations
- [ ] Museum Passport: Tracks epochs/markers, re-entry at last epoch ("You left during the Copper Empire")
- [ ] CopperCloud closing: Final frame at 2026 AD with substrate/structure/sovereignty + infrastructure layer
- [ ] "Galleries Visited" counter visible on return visits
- [ ] Optional: "You've explored 3 of 6 galleries" nudge
- [ ] Layers as curatorial modes (Core Exhibit, Community Archive, Folk Tales, Evidence Mode)
- [ ] Marker taxonomy: distinct styles per layer (copper / amber / spiral / stone)
- [ ] No regressions: Globe, scrubber, markers, Export Brief all functional

### Phase B
- [ ] Soundscapes: At least 3 epochs have distinct ambient
- [ ] Curator's Voice: TTS reads narrative on marker select
- [ ] Toggle: Self-Guided vs. Guided Tour

### Phase D
- [ ] Split-screen: Epoch view | Satellite view
- [ ] Camera sync: Pan/zoom affects both views

### Phase C
- [ ] Contribution form: Submit memory + coordinate
- [ ] At least one community pin visible (can be seeded)
- [ ] Isibalo branding and moderation flow (see `Community-Context.md`)

### Phase C2 (Inganji — future)
- [ ] Mythology tab on marker panels
- [ ] Folk tale markers (Nyami Nyami, Kuomboka, etc.)
- [ ] Illustrated story cards, globe animations

---

## Part 7 — Technical Notes

### Current Stack
- Next.js 14, React Three Fiber, Three.js
- No CesiumJS (globe is custom R3F + sphere geometry)
- GeoJSON: Zambia boundary, provinces, Lusaka roads

### Dependencies to Add
- Web Audio API (built-in)
- Web Speech API (built-in) or ElevenLabs SDK
- Mapbox or Cesium ion (Phase D)
- Backend/serverless for Living Archive (Phase C)

### Performance Budget
- 60fps target
- First Contentful Paint < 2s
- Time to Interactive < 4s

### Bundle Size Guard
- **Core globe bundle ≤ 250KB gzipped.** With Web Audio, TTS, and eventually Mapbox tiles, bundle bloat is the most likely 60fps killer.
- Audio and TTS loaded as dynamic imports (lazy).
- Satellite tile layer loaded only on Phase D activation.
- Use `next/dynamic` with `ssr: false` for all Three.js and Web Audio components.

### Rendering Mandate
- **Shaders and instanced meshes over HTML overlays.** Sovereignty Stack, Value Extraction Clock, and trade-route particles must render in WebGL (Drei `Html`/`Text` or screen-space canvas) — curved as if projected onto the inside of a satellite lens. Protects 60fps and maintains the "Classified Historical Record" aesthetic.

### Out of Scope (Do Not Add Yet)

To maintain development discipline, avoid introducing these prematurely (Tech-And-Experience-Recommendation §7):

| Technology | When it becomes relevant |
|------------|---------------------------|
| WebGPU renderer | Massive point clouds, satellite datasets, real-time geospatial simulations |
| CRDT synchronization | Multi-user real-time collaboration at scale |
| Wasm SQLite databases | Offline-first at very large data volumes |
| Complex agent pipelines | Automated content generation requiring orchestration |

The current architecture is already well suited for Phase A–C. Focus on content richness and narrative depth, not new infrastructure.

---

## Part 8 — Distribution Strategy

Every section describes what visitors experience; this addresses how they find the museum. For diaspora audiences, discovery won't be organic search — it will be a single share moment.

| Channel | Mechanic | Trigger |
|---------|----------|---------|
| **Diaspora social** | Export Brief PNG designed to be shared | Every marker click |
| **Academic** | Provenance citations link back to the atlas | Evidence tab |
| **Institutional** | Offline PWA demo survives the boardroom Wi-Fi drop | Every meeting |
| **Press** | "First sovereign virtual museum of pre-colonial Africa" — press-ready claim | Launch day |

---

## Appendix A — Gallery Aesthetic Spec (Draft)

| Epoch | Globe Tint | Overlay | Layer Emphasis |
|-------|------------|---------|----------------|
| Deep Substrate | X-Ray copper (current) | None | Kalambo, Kabwe, Twin Rivers |
| Migration | Warm ochre 5% | Bantu flow | Iron sites, territory |
| Copper Empire | Amber 8% | Trade particles | Ing'ombe, Kansanshi routes |
| Kingdom Age | Green 6% | Kingdom boundaries | Four polities |
| Colonial | Blue-gray 12% | Railways, compounds | Extraction |
| Sovereign | Copper return | Liberation nodes | Live data |

---

## Appendix B — Evidence Tab Schema (Proposed)

```ts
type NarrativeSource = {
  url: string;
  year?: number;
  confidence?: "high" | "medium" | "disputed";
  type?: "academic" | "archival" | "oral" | "media";
  label?: string;
  /** Distinguishes local knowledge from external scholarship. Critical for Living Archive. */
  region?: "Zambia" | "Southern Africa" | "Pan-African" | "Global";
};

type Narrative = {
  body: string;
  blocks?: NarrativeBlock[];
  cta: string;
  heroImage?: string;
  sources?: NarrativeSource[];
};
```

---

## Appendix C — Rendering & Cinematic Spec

Technical enhancements to ensure the platform wows with intelligence-agency flair while protecting 60fps. Reference: Foundation.md, ZAMBIA_UNTOLD_SPRINT3A_AGENT_BRIEF.md.

### Zoom & Atmosphere

At proximity (e.g. 50km altitude over Zambia), standard procedural atmospheres and flat lighting break the illusion — the earth reads as a flat polygon.

| Enhancement | Spec |
|-------------|------|
| **Dynamic atmospheric scattering** | As camera zooms closer, adjust opacity and thickness of secondary atmospheric shader. Scale with camera distance. |
| **Topographical shadows** | Below ~500km altitude, shift directional lighting angle based on `targetRotationSpeed` so terrain/borders cast subtle shadows. Surface feels physical, not painted. |

### Zambia Boundary — "Sovereign Scanline"

A raw GeoJSON path on a curved surface risks z-fighting and reads like a CAD drawing. Elevate to intelligence readout:

| Enhancement | Spec |
|-------------|------|
| **Dash-offset animation** | Boundary renders with animated `dash-offset` so the copper line looks actively drawn/scanned onto the earth by a satellite. |
| **Subtle area fill** | When a marker is clicked, apply very faint additive volumetric glow (`opacity: 0.05`) to the interior of the Zambia polygon. Centers attention on territory, pulls focus from neighboring nations. |

### Sovereignty Stack & Value Extraction Clock

Standard React DOM panels feel disconnected from the 3D globe.

| Enhancement | Spec |
|-------------|------|
| **In-geometry HUD** | Render Sovereignty Stack and Value Extraction Clock as screen-space WebGL (Drei `Html` or `Text`) overlaid into the R3F Canvas. Curve slightly as if projected onto the inside of a satellite lens. "Classified Historical Record" aesthetic. |

### Copper Corridor — Trade Route Particles

| Enhancement | Spec |
|-------------|------|
| **InstancedMesh** | Thousands of particles at 60fps. No DOM. |
| **Epoch color lerp** | Pre-colonial: warm copper. Colonial (route reversal): lerp to cold, sterile industrial gray/blue. Visual extraction narrative without text. |

### Mandate

Use shaders and instanced meshes rather than overloading HTML overlays. Protect 60fps. Make the data look like a live satellite feed intercepted from an intelligence agency.

---

## Appendix D — Deep Time Layer Tables

These aren't distractions from Zambia's story. They are Zambia's story — the planet-scale context that makes 476,000 BC feel earned rather than arbitrary.

### Geological & Biological Epochs (Contextual layer — no Zambia marker needed)

| Period | Years | What Was Happening in What Is Now Zambia | Globe Aesthetic |
|--------|-------|------------------------------------------|-----------------|
| Hadean/Archean | 4.5B–2.5B BC | The copper substrate forms. Zambia's ore bodies crystallize from hydrothermal activity in the Congo Craton | Deep red molten, no continents |
| Proterozoic | 2.5B–540M BC | The African Shield stabilizes. The Copperbelt's 900M-year-old ore deposits form — oldest economically significant copper on Earth | Dark rock texture, Gondwana forming |
| Cambrian Explosion | 540M BC | First complex life — Zambia's ancient seabed hosts trilobite-era marine fauna | Blue-green ocean over southern Africa |
| Carboniferous | 359–299M BC | Zambia within Gondwana's coal forests — precursor to the Karoo Basin | Dense green, no Rift Valley yet |
| Cretaceous | 145–66M BC | Dinosaurs in Africa. Malawisaurus in Zambezi basin. K-Pg extinction event | Warm humid canopy, then impact flash |
| K-Pg Extinction | 66M BC | Chicxulub impact. Zambia's ecosystem collapses and rebuilds. Mammals that will produce Homo heidelbergensis begin their rise | Impact flash, then ash, then recovery green |
| Miocene | 23–5M BC | Great Rift Valley begins forming. Zambezi River system takes shape. African savanna emerges. Hominid ancestors spread | Rift Valley animation, valley forming |
| Pliocene | 5–2.6M BC | Australopithecus walking upright. Zambia's corridor becomes a migration highway | Ochre savanna, hominid footprints |
| Pleistocene | 2.6M–10,000 BC | Ice ages cycle. Zambia oscillates between humid refugia and arid corridors. Populations that become 73 ethnic groups take shape | Climate pulse animation |

### Human History Context (Global beats framing the Zambia story)

| Date | Global Event | Zambia Parallel |
|------|--------------|-----------------|
| 476,000 BC | Kalambo Falls structure — marker | Oldest known wood structure on Earth |
| 315,000 BC | Homo sapiens emerges (Jebel Irhoud, Morocco) | Kabwe skull (299,000 BC) predates modern human migration — predecessor species already present |
| 200,000 BC | Earliest known ochre use (Twin Rivers, Zambia) | Marker |
| 70,000 BC | "Toba catastrophe" — volcanic winter nearly wipes out humanity | Zambia's forest refugia may have sheltered surviving populations |
| 12,000 BC | End of last ice age, global sea levels rise 120m | Zambezi basin floods, new ecosystems form |
| 3,500 BC | Egyptian Old Kingdom begins | Zambia's BaTwa hunter-gatherers continuously present 100,000+ years |
| 1,200 BC | Bronze Age Collapse — Mediterranean civilizations fall | Zambia's Iron Age smelting begins — opposite trajectory |
| 0 AD | Roman Empire at peak | Khoisan-speaking peoples occupy most of southern Africa |
| 700 AD | Islamic Golden Age | Swahili coast trade networks that will reach Ing'ombe Ilede begin forming |
| 1200 AD | Kansanshi copper currency — marker | Contemporaneous with Crusades, Song Dynasty China at peak |
| 1400 AD | Ing'ombe Ilede — marker | Contemporaneous with Ming Dynasty, pre-Columbus Americas |

---

## Appendix E — Mineral & Policy Layer Spec

Technical precision from `docs/Mineral_Context.md`. Data sources and visual specs for agent implementation.

### Layer 1: Craton Intersection (2.5B BC)

| Field | Spec |
|-------|------|
| **Data** | BGS World Geology map (free download, GeoJSON exportable) + document coordinates |
| **Visual** | Three polygon overlays — Kasai (west, deep ochre), Tanzania (north, amber), Zimbabwe-Kalahari (south, copper gold) — converging on Zambia's center. Where they meet: glowing white intersection zone labeled "The Substrate Origin." This is the globe's creation moment. |

### Layer 2: Katanga Supergroup Formation (900M BC)

| Field | Spec |
|-------|------|
| **Data** | Document geological description + BGS Precambrian Africa map |
| **Visual** | Animated hydrothermal pulse — copper-colored particles rising from depth at Copperbelt coordinates (Kansanshi, Sentinel, Mingomba). 3–5 second loop. Dissolves into static copper deposit dots. LTTB downsampling, max 500 particles. |

### Layer 3: Gondwana Fragmentation (300M BC)

| Field | Spec |
|-------|------|
| **Data** | PALEOMAP project (free) — static GeoJSON of Gondwana outline |
| **Visual** | Continental drift animation. Zambia's position within Gondwana. Luangwa and Kafue troughs appear as continent stretches. |

### Layer 4: Active Mine Constellation (Present)

| Field | Spec |
|-------|------|
| **Data** | Document: Kansanshi (FQM), Sentinel/Kalumbila (FQM), Mingomba (KoBold), Enterprise (FQM), Munali (Mabiza), Nkombwa Hill (Antler Gold) |
| **Visual** | Color-coded by mineral — copper (amber), nickel (silver-white), lithium (pale blue), REE (gold). Size = production scale. No API needed; coordinates from document + standard mine databases. |

### Layer 5: SI 68 Local Content Compliance (2025–2031)

| Field | Spec |
|-------|------|
| **Data** | SI 68 table: 20% by June 2026 → 25% → 35% → 40% by 2031 |
| **Visual** | Bar chart overlay in Sovereign epoch panel. Animated progressive ownership percentage rising year by year. Color: starts copper-tinted, fills to full copper saturation at 40%. Policy response to Colonial Wound epoch. |

### Layer 6: Luangwa Hydrogen Kitchen (2026+)

| Field | Spec |
|-------|------|
| **Data** | Document rift geometry — Luangwa Rift Zone crustal thickness 32.8–46.3 km, Vp/Vs 1.76. Serpentinization window (200–350°C) along Mwembeshi Shear Zone. |
| **Visual** | New scrubber epoch "The Next Substrate." Luangwa Valley in electric blue-white. Animated serpentinization pulse. Label: "The same fault system that made the copper may now make the fuel." |

### Layer 7: Nkombwa Hill REE (Present)

| Field | Spec |
|-------|------|
| **Data** | Document: Nkombwa Hill REE carbonatite near Isoka (Muchinga Province), neodymium and praseodymium. Proximal to TAZARA railway. |
| **Visual** | Single marker with depth panel: "The same ancient cratons that produced the copper now hold the minerals inside every electric vehicle motor on Earth." Fourth resource thread alongside copper, hydrogen, lithium. |

### Layer 8: Aerial Survey Coverage (2024–2026)

| Field | Spec |
|-------|------|
| **Data** | 2024–2026 High-Resolution Aerial Geophysical Survey — AGG and magnetics. |
| **Visual** | Expanding coverage layer as survey completes. The globe literally gets more detailed as Zambia reveals itself. Live storyline. |

---

*Document prepared for stakeholder review. Governing spec — ready to brief an agent, university partner, or DFI in the same week.*
