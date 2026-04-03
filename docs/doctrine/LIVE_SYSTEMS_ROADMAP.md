# Zambia Untold Live Systems Roadmap

This document defines the live observatory roadmap for Zambia Untold.

It is not a generic dashboard plan. It is a disciplined expansion of the second lens: present-day Zambia as a sensing surface, grounded in the museum-first doctrine.

## 1. Core Rule

The public product remains:

- Lens 1: Archive / Museum / Deep Context
- Lens 2: Observatory / Live Systems / Present Context

Lens 2 is opt-in.
It does not own first load.
It must earn its place through trust, usefulness, and clear Zambia relevance.

## 2. What "Hardened" Means Here

The goal is not cosmetic complexity.
The goal is a high-assurance civic observability platform that can mature into an operator-ready national context engine.

For Zambia Untold, hardened means:

- one truth model per live category
- low-bandwidth friendly delivery
- cache + stale fallback behavior
- clear provenance on every live surface
- public and operator surfaces separated
- community additions as annotation, not replacement truth
- resilient behavior on constrained devices and networks

Avoid the phrase "military-grade" in public product framing.
Use: high-trust, resilient, operator-ready, sovereign, high-assurance.

## 3. Selection Criteria For Live Layers

A live layer belongs in Zambia Untold only if it meets most of these:

- directly relevant to Zambia
- legible to a student or ordinary citizen
- backed by a credible official or primary source
- stable enough to maintain over time
- meaningful in historical continuity, not just novelty
- compatible with annotations from local or community knowledge

## 4. Recommended Priority Order

### Priority 1: Water and Flood Intelligence

Why it fits:

- Zambia is river-structured
- floodplains, wetlands, and seasonal water movement are historically and presently important
- strongest bridge between geography, history, agriculture, and present-day risk

Recommended sources:

- Digital Earth Africa Water Observations from Space
- Digital Earth Africa Waterbodies Monitoring
- Copernicus / GloFAS flood forecasting where useful

User-facing observatory value:

- where surface water is present now
- how water extent compares to baseline
- likely river/flood stress areas
- seasonal context around wetlands and plains

Community enrichment:

- reports of flood reach
- photos of seasonal river rise
- local naming of water bodies and floodplain memory
- oral knowledge on normal vs abnormal seasonal behavior

Implementation notes:

- start with Zambia AOI summaries and small map overlays
- prefer weekly/daily delta presentation over raw raster complexity
- expose source date and confidence clearly

### Priority 2: Fire and Burn Activity

Why it fits:

- immediately legible
- strong environmental and agricultural relevance
- good operational signal with low explanation overhead

Recommended source:

- NASA FIRMS

User-facing observatory value:

- active fire hotspots
- recent fire clusters
- seasonality of burning

Community enrichment:

- distinguish controlled burns from risk events
- local reports of smoke, field clearing, or protected-area concern

Implementation notes:

- use clustering and simplified intensity views
- pair with historical seasonal explanation so it does not read as random alarm

### Priority 3: Vegetation and Crop Stress

Why it fits:

- high strategic value for agriculture and environmental monitoring
- directly useful for schools, communities, and policy users
- connects naturally to rainfall, drought, and land use

Recommended sources:

- Digital Earth Africa NDVI anomalies
- Digital Earth Africa GeoMAD

User-facing observatory value:

- greener than usual / drier than usual zones
- season-on-season vegetation change
- agricultural stress context

Community enrichment:

- local crop observations
- grazing and land condition notes
- comparisons with remembered seasonal patterns

Implementation notes:

- emphasize anomalies and simple change states
- avoid raw EO jargon on primary UI

### Priority 4: Earth Observation Imagery

Why it fits:

- highly persuasive visually
- good support layer for floods, fires, vegetation, and land change
- should support stronger layers rather than become the main product itself

Recommended sources:

- NASA GIBS
- selected DE Africa imagery products where appropriate

User-facing observatory value:

- current or recent imagery for Zambia AOI
- visual confirmation of water, smoke, vegetation, or weather patterns

Community enrichment:

- attach observations to imagery moments
- compare remote view with ground memory

Implementation notes:

- keep imagery as optional enhancement
- load only after user intent and at appropriate zoom/state

### Priority 5: Satellite and Orbital Awareness

Why it fits:

- already part of the current observatory identity
- helps signal that Zambia exists inside global technical systems
- should remain disciplined and not become a novelty layer

Recommended source:

- NORAD / CelesTrak propagated model as single public truth for satellite presence/counts

User-facing observatory value:

- satellites over or near Zambia now
- simple mission proposals and public space imagination layer

Community enrichment:

- mission proposals
- youth space ambition
- curated contributions tied to Zambian science futures

Implementation notes:

- keep one truth model for globe + HUD
- avoid conflicting catalog counts on public surfaces

### Priority 6: Air Quality

Why it fits:

- useful if station coverage is real and stable
- good civic layer, but only if Zambia data quality is sufficient

Recommended source:

- OpenAQ where station coverage is confirmed

User-facing observatory value:

- local air quality readings
- simple health-oriented summaries

Community enrichment:

- smoke reports
- localized industrial or seasonal observations

Implementation notes:

- validate Zambian coverage before public rollout
- if sparse, keep operator-only or experimental first

### Priority 7: Seismic and Geohazard Awareness

Why it fits:

- smaller volume, but strong fit with deep geology doctrine
- useful as a quiet expert layer rather than a front-page feature

Recommended source:

- USGS earthquake feeds

User-facing observatory value:

- recent seismic activity affecting Zambia region
- present-day connection to deep-time geology

Community enrichment:

- felt reports if ever relevant
- geologic interpretation content from educators/researchers

Implementation notes:

- keep subtle and low-priority in public IA

## 5. What Should Not Ship Early

Do not prioritize these until stronger layers are stable:

- broad generic weather dashboards
- financial market tiles unrelated to Zambia context
- random global news streams
- complex infrastructure dashboards without reliable official data
- speculative AI risk scoring on weak signals

These add surface area faster than they add trust.

## 6. Community Contribution Model

Community additions should enrich live systems in three ways:

### Annotation

The official signal stays primary.
Community input adds local observation, memory, naming, and interpretation.

Examples:

- flood reached this school
- this plain is normally dry until late March
- smoke here is from annual clearing, not wildfire spread
- this river course used to run wider in our childhood

### Validation Support

Community input can help contextualize ambiguous live signals.
It should not silently overwrite them.

### Continuity

Every live layer should be able to connect back to the museum lens.

Examples:

- present floodplain tied to Kuomboka context
- present vegetation tied to historical land use
- present mining or copper corridor tied to substrate history

## 7. Public vs Operator Split

### Public observatory should show:

- curated summaries
- selected overlays
- recent change states
- clear timestamps
- simple source labels
- community annotations after moderation

### Operator surfaces should show:

- raw feed diagnostics
- ingestion status
- cache health
- rejected or uncertain records
- moderation and review queues
- source disagreement alerts

Operator tooling must not leak into public IA.

## 8. Per-Layer Hardening Contract

Every live layer should define the following before launch:

- source of truth
- update cadence
- cache TTL
- stale fallback behavior
- geographic scope
- user-facing wording
- confidence / quality note
- operator diagnostics path
- community annotation schema

Use this as a required checklist.

## 9. Recommended Build Sequence

### Phase O1: Stabilize Existing Observatory

- keep observatory opt-in
- unify satellite truth model everywhere
- keep moderation off public surfaces
- maintain low-bandwidth defaults

### Phase O2: Water and Fire

- ship water extent summary + overlay
- ship fire hotspot summary + overlay
- allow moderated local observations tied to each

### Phase O3: Vegetation and EO Context

- add vegetation anomaly layer
- add imagery as supporting evidence layer
- introduce compare-to-baseline views

### Phase O4: Community-Enriched Observatory

- attach approved local observations to live events
- add location-linked evidence cards
- allow “ground truth” style public contributions with moderation

### Phase O5: Operator Readiness

- create protected operator routes
- add feed health dashboards
- add source freshness and conflict monitoring
- add review workflows for live annotations

## 10. Product Framing

The correct message is not:

- look at all this live data
- Zambia Untold is now a dashboard

The correct message is:

- Zambia can be understood through deep time and present signals
- the same land holds memory and live systems
- the museum is the foundation
- the observatory is the second lens

## 11. Bottom Line

If Zambia Untold succeeds, it becomes:

- a museum of sovereign memory
- a contextual observatory of present-day Zambia
- a platform where official signals and community knowledge reinforce each other
- a precursor to a broader sovereign national context engine

The roadmap is not to add more live widgets.
The roadmap is to add fewer, stronger, more trusted live systems that deepen Zambia-first understanding.
