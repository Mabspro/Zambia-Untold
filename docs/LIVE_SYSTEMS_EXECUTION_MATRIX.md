# Zambia Untold Live Systems Execution Matrix

This matrix translates the live systems roadmap into implementation decisions.

Use it alongside:

- [The LENS](C:/Users/mabsp/zambia-untold/docs/The-LENS.md)
- [Live Systems Roadmap](C:/Users/mabsp/zambia-untold/docs/LIVE_SYSTEMS_ROADMAP.md)

The purpose is discipline:

- what to build
- what source to trust
- how often to refresh
- how it enters the UI
- what the public should see
- what only operators should see
- how community inputs should attach

## 1. Ranking Scale

Implementation difficulty:

- Low: small API adapter + lightweight UI
- Medium: normalization, caching, annotation model, or map overlay work
- High: multiple upstreams, raster complexity, or operator diagnostics

Bandwidth profile:

- Low: compact JSON summaries / clustered points
- Medium: moderate overlay data or denser event sets
- High: imagery, tiles, or large spatial products

## 2. Execution Matrix

| Layer | Priority | Source of truth | Refresh cadence | Bandwidth | Public entry point | Public wording | Operator diagnostics | Community schema | Difficulty |
|------|----------|-----------------|-----------------|-----------|--------------------|----------------|----------------------|------------------|------------|
| Water extent / floodplain state | P1 | Digital Earth Africa WOfS | Daily or latest-available snapshot | Medium | Observatory card + map layer + Zambia summary card | "Surface water now" / "Wetter than baseline" | source freshness, AOI coverage, fetch status, stale age | `water_observation` | Medium |
| Waterbody status | P1 | Digital Earth Africa Waterbodies | Weekly | Low | Secondary observatory panel | "Waterbody trend" / "Rising or reduced" | per-waterbody freshness, missing polygons, normalization logs | `waterbody_note` | Medium |
| Flood forecast / river stress | P1 | GloFAS / Copernicus | Daily | Low | Alert strip + river/flood overlay | "Flood risk outlook" / "Elevated river stress" | upstream availability, forecast horizon, conflict flags | `flood_report` | High |
| Fire hotspots | P2 | NASA FIRMS | Near-real-time with cached public summary | Low | Observatory summary + clustered map layer | "Active fire hotspots" / "Recent burn activity" | hotspot count drift, cluster generation health, stale cache | `fire_observation` | Low |
| Burn season context | P2 | FIRMS aggregated by period | Daily aggregate | Low | Seasonal context card | "Fire season context" | aggregation jobs, historical window health | `burn_context_note` | Medium |
| Vegetation anomaly | P3 | Digital Earth Africa NDVI anomalies | Weekly | Medium | Observatory insight card + thematic layer | "Greener than usual" / "Drier than usual" | anomaly generation date, AOI completeness, baseline version | `vegetation_observation` | Medium |
| Land condition / stable change view | P3 | Digital Earth Africa GeoMAD | Monthly or product cadence | Medium | Secondary EO layer | "Land condition change" | raster availability, date coverage, render fallback status | `land_condition_note` | High |
| EO imagery support | P4 | NASA GIBS | Daily | High | Optional zoom-aware imagery overlay | "Recent imagery" | tile freshness, load failures, low-bandwidth fallback use | `imagery_observation` | Medium |
| Satellite awareness | P5 | NORAD / CelesTrak propagated model | 30-60s public cache | Low | Space Signal + live satellites layer | "Satellites over or near Zambia now" | propagation health, object count, stale age, source errors | `satellite_note` / `mission_proposal` | Medium |
| Mission proposals | P5 | Zambia Untold moderated submissions | Event-driven | Low | Space mission panel | "Public mission ideas" | moderation state, duplicate review, reviewer actions | `mission_proposal` | Low |
| Air quality | P6 | OpenAQ where Zambia coverage exists | Hourly or source cadence | Low | Optional city-level observatory card | "Air quality reading" | station coverage monitor, missing sensor alert, freshness | `air_quality_observation` | Medium |
| Seismic / geohazard | P7 | USGS earthquake feeds | Near-real-time cached | Low | Quiet geohazard layer / expert panel | "Recent seismic activity" | feed freshness, magnitude threshold config | `felt_report` / `geology_note` | Low |

## 3. Recommended Public UI Entry Pattern

Do not expose all layers equally.

### Entry level A: Observatory CTA

Used for:

- introductory observatory card
- simple Zambia-wide summaries
- strongest current signals only

Best candidates:

- water/flood state
- fire hotspots
- vegetation anomaly summary

### Entry level B: Map Layers

Used for:

- opt-in thematic overlays
- users already exploring spatial context

Best candidates:

- EO imagery
- live satellites
- fire clusters
- flood overlay
- vegetation anomaly map

### Entry level C: Secondary panels

Used for:

- expert-oriented or explanatory surfaces
- contextual narrative around live systems

Best candidates:

- waterbody trends
- seasonal fire interpretation
- geohazard context
- source methodology summaries

## 4. Public Wording Rules

Public wording should avoid sounding like an ops console.

Preferred pattern:

- "Active fire hotspots"
- "Surface water now"
- "Flood risk outlook"
- "Greener than usual"
- "Recent imagery"
- "Satellites over or near Zambia now"

Avoid:

- raw feed names as headlines
- debug terms
- latency/internal cache language in primary text
- overly technical EO phrasing on first read

Source labels should still be visible, but quiet.

## 5. Operator Diagnostics Requirements

Every live layer should have a private diagnostics view with:

- upstream status
- last successful refresh time
- stale age
- item count / coverage summary
- parse or normalization errors
- fallback mode active or not
- source conflict notes if applicable

This should never be shown on the public observatory surface.

## 6. Community Schema Recommendations

Each live layer should attach to a specific moderated annotation type.

Recommended core fields for all schemas:

- `id`
- `type`
- `title`
- `body`
- `place_name`
- `latitude`
- `longitude`
- `observed_at`
- `source_layer`
- `media_urls[]`
- `contributor_name`
- `moderation_status`
- `review_notes`

Recommended layer-specific types:

- `water_observation`
- `waterbody_note`
- `flood_report`
- `fire_observation`
- `burn_context_note`
- `vegetation_observation`
- `land_condition_note`
- `imagery_observation`
- `satellite_note`
- `mission_proposal`
- `air_quality_observation`
- `felt_report`
- `geology_note`

## 7. Build Order By Lowest Regret

### Step 1

- satellite truth unification
- public/operator separation
- observatory stays opt-in

### Step 2

- fire hotspots
- water extent summary

### Step 3

- flood outlook
- vegetation anomaly

### Step 4

- EO imagery support
- community annotations on live layers

### Step 5

- air quality if coverage supports it
- geohazard layer
- operator diagnostics dashboard

## 8. Immediate Engineering Recommendations

For the next implementation cycle, the strongest moves are:

1. Create a `live layer contract` type in code.
2. Normalize all public live payloads to a shared shape.
3. Add a protected operator route for feed diagnostics.
4. Implement fire and water as the first serious Zambia observatory layers.
5. Add moderated annotation models for live observations before adding too many new feeds.

## 9. Bottom Line

This matrix keeps the observatory from becoming a pile of feeds.

It forces each live layer to answer:

- why it belongs
- why people should trust it
- how it appears publicly
- how operators manage it
- how community knowledge enriches it

That is how Zambia Untold becomes a durable, high-trust, sovereign observability platform.
