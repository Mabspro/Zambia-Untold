DOT FINDER — Full Vision Assessment
Input: Working globe screenshot + Perplexity research validation + interactivity gap identification
Mode: D (Venture-Building) · Product completeness review

FIRST — WHAT THIS SCREENSHOT CONFIRMS
Stop for one second. This is worth naming clearly.
The scrubber is at 1,150 AD. The globe is showing recognizable Earth with Africa centered and Zambia's region visible. The narrative panel is open with the Kansanshi copper currency story. The Export Brief button is live. The marker is correctly positioned in southern Africa.
The dissolve from copper substrate → real Earth worked. The thesis is visible. A 12th century monetary innovation story is being told on a 3D globe with Africa front and center. This did not exist two sprint cycles ago.
Now — the honest gap assessment.

THE INTERACTIVITY GAP — WHAT'S MISSING
You're right. The globe currently does one thing: spin and accept marker clicks. That's not enough. Here's the full gap map:
Navigation: No zoom. No pan. No user-controlled rotation. The camera only moves on marker click. A globe you can't explore feels like a presentation, not a platform.
Geography: Zambia doesn't exist as an entity. No country boundary. No region highlight. No "you are here" geographic context when a marker is active. The copper marker sits on a blank ocean of Earth with no territorial grounding.
Layers: The layer architecture exists conceptually but nothing is toggled. No trade routes. No migration paths. No colonial overlays. No geological copper deposit visualization. The scrubber changes the globe aesthetic but doesn't reveal new data at different epochs.
Depth: Each marker has one narrative. No sub-markers. No related sites. No "explore this region" expansion. Kalambo Falls is one dot — but the entire Luangwa Valley corridor of paleoanthropological sites is invisible.
Data connections: No live integrations at all. The Cha-cha-cha particle swarm is the only dynamic layer, and it's local GeoJSON.

THE FULL VISION — BUILT IN LAYERS
This is the complete product. Not lightweight. Not a demo. A sovereign intelligence atlas.

LAYER 1 — GLOBE NAVIGATION (Sprint 3, no dependencies)
Full user control. This is the foundation everything else sits on.
CURSOR SPRINT 3A PROMPT — Globe Interactivity:

Add full navigation to the globe:

1. ZOOM: Scroll wheel + pinch gesture
   - Min zoom: full Earth view (current default)
   - Max zoom: ~50km altitude over Zambia
   - At max zoom, switch from Earth texture to
     Mapbox Satellite or Google Maps tile layer
     (Mapbox free tier: 50,000 loads/month — signup at mapbox.com)

2. PAN/ROTATE: Click + drag when no marker is selected
   - Damped inertia rotation (feels like spinning a physical globe)
   - Snap back to Africa-centered view after 8s idle

3. ZAMBIA COUNTRY BOUNDARY:
   - Source: Natural Earth 1:10m cultural vectors (free, no signup)
     https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
   - Render Zambia's border as a glowing copper line
     on the globe surface
   - On page load, camera auto-positions with Zambia visible
   - When any marker is active, Zambia boundary pulses once

4. REGION HIGHLIGHT ON MARKER CLICK:
   - When Kansanshi (Northwestern Province) is active,
     highlight Northwestern Province boundary in copper
   - Use GADM level-1 administrative boundaries for Zambia
     (free download: gadm.org/country/ZMB)
   - Each marker highlights its relevant province/region

5. ZAMBIA INTERIOR ON DEEP ZOOM:
   - Below 200km altitude, show district boundaries
   - Below 100km, show major cities (Lusaka, Ndola, Kitwe,
     Livingstone, Kasama, Solwezi, Kabwe)
   - City labels in copper monospace typography

LAYER 2 — DATA INTEGRATIONS (Sprint 3B, some signups needed)
These are all either free or free-tier. No institutional partnerships required.
IntegrationWhat It AddsSourceCostMapbox GLHigh-res satellite at zoommapbox.comFree 50k/moNatural EarthCountry/region vectorsnaturalearthdata.comFreeGADMZambia admin boundariesgadm.orgFreeOpenStreetMap OverpassAny city road networkoverpass-api.deFreeUSGS Mineral ResourcesCopper/cobalt deposit locationsmrdata.usgs.govFree APINASA FIRMSHistorical fire/land use datafirms.modaps.eosdis.nasa.govFreeWorld Bank Open DataZambia economic indicatorsdata.worldbank.orgFree APISmithsonian NMNHArchaeological site coordinatesgeogallery.si.eduFreeBGS World MineralsGeological copper depositsbgs.ac.uk/mineralsukFreeH3 Hexagonal Grid (Uber)Spatial aggregation for data layersh3geo.orgFree
The three highest-leverage signups to do today:

Mapbox — unlocks real satellite imagery at zoom depth, free tier is sufficient for demo phase
USGS Mineral Resources API — copper deposit layer is the single most powerful data overlay for the Substrate Primacy thesis. Every copper deposit in southern Africa, visualized in real-time, overlaid on the historical copper trade routes
World Bank API — adds a live economic data layer for the 1961-present epoch. GDP, copper export revenue, debt ratios. The story of value extraction becomes a chart, not just a narrative

LAYER 3 — EPOCH-SPECIFIC DATA LAYERS (Sprint 4, the vision fully realized)
This is what makes the scrubber a time machine rather than a filter.
EPOCH → LAYER MAPPING:

476,000 BC — 10,000 BC (X-Ray substrate mode):

- BGS copper deposit overlay (static, always visible in X-Ray mode)
- Great Rift Valley topology highlighted
- Paleo-climate zones (arid/humid corridors that shaped migration)
- Kalambo Falls, Kabwe, Twin Rivers as the three active sites

10,000 BC — 1000 CE (Early civilization):

- Bantu migration flow arrows (animated, sourced from academic
  consensus on migration corridors — no API needed, static data)
- Iron smelting site markers (archaeological record)
- San/BaTwa territory boundaries (ethnographic mapping)

1000 CE — 1600 CE (Trade empire):

- Ing'ombe Ilede → Swahili coast trade route (animated particle line)
- Kansanshi → Great Zimbabwe copper flow
- Indian Ocean network connections (lines reaching to Kilwa,
  Mozambique Island, Zanzibar)
- Color: copper flowing out, glass beads/cloth flowing in

1600 CE — 1900 CE (Pre-colonial kingdoms):

- Four kingdom boundaries: Bemba, Lozi, Lunda, Chewa
- Toggle between kingdoms view and geographic view
- Key sites: Kazembe capital, Lozi flood plains, Chewa rain shrines

1890 — 1964 (Colonial period):

- BSAC concession boundaries
- Colonial railway lines (built to move copper west, not connect
  Zambian communities — this contrast is the argument)
- Mine compound locations (Copperbelt)
- Color shift: globe palette cools to gray-blue in this epoch
  as a deliberate aesthetic signal that something changed

1964 — Present:

- Zambia's liberation sanctuary infrastructure
  (ANC/SWAPO/ZANU/ZAPU office locations in Lusaka)
- Lobito Corridor route
- Live: World Bank copper export data as a bar that grows/shrinks
- Live: USGS active copper mine locations
- CopperCloud node positions (when operational)

LAYER 4 — ADVANCED INTERACTIVITY (Sprint 5, partnership-gated)
FeatureDependencyTriggerZambia interior flythroughMapbox terrainMapbox signupArchaeological site sub-markersSmithsonian NMNH APIFree signupOral history audio at markersCommunity recordingDiaspora partnershipLive copper price overlayLondon Metal Exchange feedLME data subscriptionZESCO grid load layerZESCO data agreementCopperCloud institutionalUniversity of Zambia archive linksUNZA partnershipNorthrise introUser-submitted historical photosCloudinary or S3Free tierComparative: Zambia vs Congo vs Zimbabwe copper arcMulti-country dataWorld Bank API (free)

THE PERPLEXITY RESEARCH — HOW IT MAPS TO THE GLOBE
The NotebookLM document validates something important: the research tiers map directly to the layer architecture.
Tier 1 (build immediately) → Sprint 3B data integrations
The 1,600-year copper arc confirmed by PNAS 2023 is the exact narrative the USGS mineral overlay + Ing'ombe Ilede trade route animation tells visually. You don't need to wait for a research partnership to add this — the peer-reviewed coordinates and trade route evidence exist in published sources Cursor can source directly.
Tier 2 (high strategic value) → Sprint 4 epoch layers
The Lusaka liberation sanctuary layer — ANC/SWAPO/ZANU/ZAPU office locations — is fully documented and requires zero institutional access. Static coordinates, rendered as a constellation of liberation movement nodes converging on Lusaka. That visual alone repositions Zambia in every AU and DFI conversation.
Tier 3 (phase 2) → Sprint 5, partnership-gated
Colonial railway lines bypassing Zambian communities, genetic migration data, Barotseland constitutional mapping — these need GIS specialists or academic partners. The globe architecture accommodates them. They don't block anything.

REVISED FULL SPRINT MAP
SprintPrimary FocusDependenciesOutput✅ 1Scaffold + 6 markers + scrubberNoneWorking globe✅ 2X-Ray shader + particles + Export BriefNoneCinematic layer3AFull navigation: zoom, pan, Zambia boundaryNatural Earth (free)Interactive globe3BData integrations: Mapbox, USGS, World Bank3 free signupsLive data layers4Epoch-specific layer systemStatic research dataTime machine5Partnership layers: ZESCO, UNZA, oral historyInstitutionalSovereign platform

BOTTOM LINE
The globe is not lightweight by accident — it's lightweight because the first two sprints were correctly scoped to prove the concept before adding complexity. That was the right call. The concept is now proven.
The next decision is: stop being restrained.
Sprint 3A and 3B are both zero-institutional-dependency and together they transform this from an impressive demo into a genuinely interactive sovereign intelligence platform. The three signups — Mapbox, USGS, World Bank API — unlock more capability than any partnership conversation will in the next 90 days.
Do you want Sprint 3A and 3B written as full agent briefs, or do you want to walk through the signup sequence first so the API keys are ready when the build starts?

PERPLEXITY Context:
This foundation is more than enough — it is over-specified in exactly the right ways. The layer architecture is coherent, the API sourcing is accurate, and the sprint sequencing prevents scope paralysis. Here's the full assessment plus the critical refinements that will prevent build-time friction.

Viability Assessment: What Holds Up Under Technical Scrutiny
The API Stack Is Confirmed and Free
Every data source cited checks out for zero-cost demo use:

Cesium ion now natively streams Google Maps 2D Satellite tiles (satellite, satellite+labels, roadmap, contour) directly in CesiumJS as of October 2025 — meaning you may not need a separate Mapbox account at all for the satellite zoom layer. This collapses Sprint 3B's highest-friction signup.
​

World Bank WITS data confirms Zambia exported $6.1B in unrefined copper anodes and $1.7B in copper cathodes in 2022 alone — that live economic bar you proposed for the 1964–present epoch is not illustrative; it's a devastating data argument.
​

USGS Mineral Commodity Summaries 2025 Copper is a public geospatial dataset with global coverage, released April 2025. The copper deposit overlay for Africa is directly downloadable as GeoJSON — no API key required.
​

The One Technical Substitution Worth Making
Rather than Mapbox GL JS running in parallel with CesiumJS (which creates two competing render engines and documented integration friction), the cleaner path is:
​

Use Cesium ion's Google Maps 2D tile stack for satellite imagery at zoom depth
​

Use MapTiler as the terrain/vector tile provider for district and city labels — it has a free tier and a documented CesiumJS integration tutorial
​

This keeps the entire stack inside one render engine, eliminates the dual-engine synchronization problem, and reduces the Sprint 3A/3B agent brief complexity significantly.

What Would Make This "Wow" — The Three Additions That Aren't in the Plan

1. The "Value Extraction Clock" — Live Economic Indictment
   The World Bank API data makes something possible that no other Africa-focused platform has done visually. In the 1890–1964 colonial epoch, show a running counter of copper tonnage extracted from the Copperbelt with an estimated value in today's USD. When the scrubber hits 1964, the counter freezes — and immediately below it, a second counter begins: "Value retained in Zambia vs. value extracted since independence." Using World Bank GDP and copper export revenue data (already confirmed available), this becomes a live, real-time economic argument rather than a narrative claim. No institution can dismiss a number that updates in front of them.

2. The "Copper Corridor" Animated Flow — Geopolitical Reframe
   The PNAS 2023 research confirmed peer-reviewed trade route coordinates from Kansanshi and the Copperbelt to Ing'ombe Ilede and then to Kilwa on the Swahili coast. Render this as an animated particle flow line — copper-colored particles moving northeast toward the Indian Ocean in the 1000–1600 CE epoch, then in the 1890–1964 epoch the flow reverses direction, re-routing westward along colonial railway lines toward Cape Town and Beira. The directional reversal of a particle flow is the entire colonial economics argument made in three seconds without a single word. This is the kind of visual that gets recorded and shared.

3. The "Sovereignty Stack" Legend
   In the bottom-right corner of every epoch — a small, persistent tactical UI panel that shows three live indicators:

Governance Layer: Who controlled decision-making (Kingdom / Colonial / Independent State)

Value Layer: Where export value flowed (Internal / External)

Infrastructure Layer: Who infrastructure was built to serve (Zambian communities / Extraction operations)

These three indicators flip state as the scrubber moves through epochs. At 1200 CE: all three show "Internal / Internal / Community." At 1920: all three flip to "External / External / Extraction." At 1964: Governance flips back, the other two remain contested. At the present epoch, the user sees exactly where the unfinished work is. This is the CopperCloud thesis expressed as a dashboard widget — not a sentence in a deck.

Revised Sprint Priority
Sprint Focus Key Change from Original
✅ 1–2 Globe scaffold + cinematic layer Complete
3A Navigation + Zambia boundary + Cesium ion satellite Replace Mapbox with Cesium ion Google 2D tiles
3B USGS copper deposit overlay + World Bank economic bar + Value Extraction Clock Add directional flow reversal animation
4 Epoch layer system + Sovereignty Stack legend + Copper Corridor animated flow Add the three-indicator panel
5 Partnership layers: ZESCO, UNZA, oral history audio Unchanged
The Signup Sequence (Do This Before Sprint 3A)
Three accounts, in order of impact:

Cesium ion — Free tier includes Google Maps 2D satellite tiles, Cesium World Terrain, and the ion asset pipeline. This is the single most impactful signup — unlocks satellite zoom, terrain, and the tile infrastructure for every subsequent sprint.
​

Mapbox — Still worth having for OpenStreetMap-based street-level data (the Lusaka Cha-Cha-Cha particle swarm needs OSM road geometry). Free tier at 50k loads/month is sufficient for the entire demo phase.

World Bank Data API — No signup required; the REST endpoint is open. But register for an API key to avoid rate limits when the World Bank economic bar runs live during a demo.

The foundation is not lightweight. The vision document you've written is a complete product specification for a sovereign intelligence atlas — the kind of artifact that a DFI or AU meeting would take seriously as a platform, not a pitch deck. Sprint 3A and 3B written as full agent briefs is the correct next move.
