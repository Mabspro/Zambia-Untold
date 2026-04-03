# Fire and Water First-Pass Implementation Plan

This plan translates the live systems matrix into near-term repo work for the first two serious observatory layers: fire and water.

## 1. Goal

Add Zambia-relevant live observatory layers that are:

- museum-compatible
- opt-in
- low-bandwidth friendly
- community-enrichable
- built on a shared live-layer contract

## 2. What Landed In This Pass

Code structure added:

- `lib/live/contracts.ts`
- `lib/live/payloads.ts`
- `app/api/earth/fire/route.ts`
- `app/api/earth/water/route.ts`

These routes are transitional scaffolds using event-style feeds and the shared payload shape.
They are not the final authoritative data adapters.

## 3. Fire Layer Plan

### Current scaffold

Route:

- `/api/earth/fire`

Current behavior:

- uses NASA EONET wildfire events for Zambia-region event summaries
- returns shared `LiveLayerPayload`
- exposes clear transitional wording in `detail`

### Target authoritative version

Primary source:

- NASA FIRMS hotspot ingestion

Needed upgrades:

- authenticated upstream adapter if API key or approved access path is required
- hotspot clustering for public map view
- daily and recent-period aggregation
- source freshness diagnostics
- moderated `fire_observation` annotations

### UI target

Public:

- observatory summary card
- clustered fire layer in map layers
- seasonal context explanation card

Operator:

- hotspot ingest freshness
- cluster job health
- stale fallback state

## 4. Water Layer Plan

### Current scaffold

Route:

- `/api/earth/water`

Current behavior:

- uses NASA EONET severe-storm style events as a temporary hydrology watch signal
- returns shared `LiveLayerPayload`
- explicitly marks itself transitional

### Target authoritative version

Primary sources:

- Digital Earth Africa WOfS
- Digital Earth Africa Waterbodies
- GloFAS where forecast context is needed

Needed upgrades:

- Zambia AOI water extent summarization
- weekly/daily water change summaries
- named waterbody trend summaries
- flood outlook / river stress card
- moderated `water_observation`, `waterbody_note`, and `flood_report` annotations

### UI target

Public:

- observatory summary card
- water/flood map overlay
- named waterbody trend card

Operator:

- source freshness
- AOI coverage validation
- raster/summary generation health
- forecast conflict checks

## 5. Shared UI Work Needed Next

1. Add a `live layer registry` consumer in the observatory shell.
2. Create a compact shared card component for `LiveLayerPayload`.
3. Expose only top-priority layers from the observatory entry surface.
4. Keep raw diagnostics on protected routes only.

## 6. Shared Data Work Needed Next

1. Add community annotation table design for live observation schemas.
2. Add protected operator diagnostics route for layer health.
3. Normalize all new live routes to the shared payload shape.
4. Add tests that confirm no live routes boot on museum first load.

## 7. Lowest-Regret Next Sprint

- wire `/api/earth/fire` and `/api/earth/water` into an internal observatory dev panel first
- replace transitional sources with authoritative adapters in order: fire, then water
- add annotation schema types and moderation path
- only then promote these layers into the public observatory UI
