# Sprint Plan - Mission Framework + Integration Completion (C3)

Date: 2026-03-05
Owner: Codex execution pass

## Objective
Implement a lightweight Mission Framework (guidance + progress + badges, no hard locks), while closing high-leverage integration gaps already identified in C2/C2.8 reviews.

## Constraints
- Do not alter Globe shaders, CameraRig, particle systems, or boot/lobby sequence behavior.
- Preserve one-panel-at-a-time overlay rule.
- Keep local-first mission progress persistence (no backend dependency).

## Workstreams

### W1 - Mission Framework (Implemented)
1. Added mission model + steps + badge metadata.
2. Added mission event bus for decoupled progress updates.
3. Added mission progress persistence to local storage alongside museum passport continuity.
4. Added mission event emissions from existing interactions:
   - Marker opens (mission marker set)
   - X-ray activation threshold (scrubber before 10,000 BC)
   - Copper epoch traversal (1000-1600 CE)
   - Layer toggles (satellites + community archive)
   - Community memory open + submission
5. Added Mission System UI:
   - Bottom-left collapsible terminal panel
   - Expanded mission checklist
   - All Missions log with badges/status
6. Added badge-award overlay moment (typed terminal style, 3s fade).

### W2 - Integration Quick Wins (Implemented)
1. Added community archive layer toggle wiring:
   - `LayerVisibility.community`
   - Layers panel checkbox
   - Globe community layer visibility hook
2. Added geocode policy hardening:
   - Nominatim contact env support (`NOMINATIM_CONTACT_EMAIL`) in User-Agent + From headers.
   - Added `.env.example` and `docs/DEPLOY.md` references.
3. Hydration safety hardening:
   - Removed viewport-conditional class construction causing server/client mismatch in `CanvasWrapper`.

### W3 - Remaining Integrations (Deferred / Next Sprint)
1. Cache/throttle `/api/space/live` and `/api/space/catalog` (SWR + concurrency guard parity). ✅ Implemented (TTL 30s/60s + `X-Cache` + stale fallback).
2. Add counts-only payload path for SpaceSignal approved reads. ✅ Implemented (`/api/space/catalog?counts=true` + HUD integration + full catalog only when Live Satellites is enabled).
3. Replace shared moderation token flow with auth/role-based moderation (Supabase Auth).
4. Add reviewer metadata writes (`reviewed_by`, `reviewed_at`, `reviewer_notes`).
5. Add OpenSky Zambia FIR and NASA FIRMS live data layer.
6. Mission guidance refinement:
   - Move all mobile guidance nudges to fixed globe-bottom anchor with guaranteed safe-area bounds.
   - Keep one persistent nudge location (no jumping) for tour steps.

## Acceptance Criteria
- Mission progress persists in localStorage key `zambia-untold:mission-progress`.
- No feature lockouts introduced.
- Badge overlays trigger exactly once per newly completed mission.
- `npm run typecheck` passes.
- `npm run lint` passes.

## Validation (This Pass)
- `npm run typecheck`: pass
- `npm run lint`: pass

## Risks
- Mission event over-firing from repeated interactions.
- UI overlap on mobile with existing bottom rail.

## Mitigations
- Deduplicate completed steps in mission reducer.
- Panel defaults to collapsed and uses constrained viewport width.
- Guided tour remains separable from mission panel (`showGuidedTour` suppresses mission panel).

