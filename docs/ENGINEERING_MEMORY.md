# Engineering Memory Log

Use this file as a lightweight continuity layer to reduce regressions across parallel work.

## Entry Template

- Date:
- Area:
- Intent:
- Invariants touched:
- Files changed:
- Risk:
- Regression checks run:
- Follow-ups:

---

## 2026-03-05 - Intro/Header/Layers Stabilization

- Date: 2026-03-05
- Area: Intro replay, header card composition, layers visibility
- Intent: Restore reliable intro replay and remove stacked/hidden card regressions
- Invariants touched:
  - Single header card invariant
  - Intro state machine restart invariant
  - Layers panel visibility invariant (desktop + mobile)
- Files changed:
  - `app/page.tsx`
  - `components/UI/TimeButtons.tsx`
  - `components/UI/LayersPanel.tsx`
  - `components/UI/GuidedTourHints.tsx`
- Risk:
  - Overlay density on small screens if multiple panels are opened quickly
- Regression checks run:
  - typecheck pass
  - lint pass
  - manual layout contract check in code
- Follow-ups:
  - Mobile interaction pass on real device
  - Build-environment EPERM resolution and full validate

## 2026-03-05 - C2 Approved Read Path + Globe Community Overlays

- Date: 2026-03-05
- Area: Supabase read integration, community/mission visualization
- Intent: Complete C2 visibility loop by reading approved records and rendering them on globe
- Invariants touched:
  - Submission APIs still degrade to local fallback
  - Live/fallback source transparency preserved for API endpoints
  - UI layering kept non-blocking with additive overlays
- Files changed:
  - `lib/server/supabase.ts`
  - `app/api/community/approved/route.ts`
  - `app/api/space/mission/approved/route.ts`
  - `components/Globe/Globe.tsx`
- Risk:
  - Globe visual density may rise if approved mission count grows without clustering
- Regression checks run:
  - typecheck pass
  - lint pass
  - build still blocked by existing local `spawn EPERM`
- Follow-ups:
  - Add zoom-aware clustering/LOD for mission tracks and community points
  - Add moderation/admin read surfaces and approved-count telemetry in UI

## 2026-03-05 - Community Visual Declutter + Moderation Telemetry

- Date: 2026-03-05
- Area: Globe visual density control, moderation visibility
- Intent: Reduce visual noise as approved records scale and expose approved counts in-space telemetry panel
- Invariants touched:
  - Overlay readability on mobile/desktop
  - One-glance status for live vs approved layers
- Files changed:
  - `components/Globe/Globe.tsx`
  - `components/UI/SpaceSignal.tsx`
- Risk:
  - LOD thresholds may need tuning after real dataset growth
- Regression checks run:
  - typecheck pass
  - lint pass
  - build still blocked by local `spawn EPERM` (same as prior)
- Follow-ups:
  - Add deterministic clustering for satellites as count grows > 100
  - Add admin moderation queue surface (pending/rejected lists)
