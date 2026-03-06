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

## 2026-03-05 - Satellite Clustering + Moderation Stats API

- Date: 2026-03-05
- Area: Live satellite readability, moderation operations visibility
- Intent: Add deterministic zoom-aware clustering for live satellites and expose moderation queue counts without leaking raw pending content
- Invariants touched:
  - Data/source transparency (live vs fallback)
  - Overlay readability across zoom ranges
- Files changed:
  - `components/Globe/Globe.tsx`
  - `components/UI/SpaceSignal.tsx`
  - `lib/server/supabase.ts`
  - `app/api/moderation/stats/route.ts`
- Risk:
  - Cluster thresholds may require field tuning once live orbital sample size increases
- Regression checks run:
  - typecheck pass
  - lint pass
  - build still blocked by local `spawn EPERM`
- Follow-ups:
  - Add restricted moderation action endpoints (approve/reject) with auth gate
  - Add mobile-specific condensed telemetry mode for Space Signal

## 2026-03-05 - Moderation Action API + Mobile Space Signal

- Date: 2026-03-05
- Area: Moderation controls, mobile telemetry accessibility
- Intent: Add token-gated moderation status updates and expose core Space Signal telemetry on mobile screens
- Invariants touched:
  - Server-side moderation writes require explicit auth token
  - Mobile UI keeps overlays concise and non-blocking
- Files changed:
  - `app/api/moderation/review/route.ts`
  - `lib/server/supabase.ts`
  - `components/UI/SpaceSignal.tsx`
  - `.env.example`
  - `docs/DEPLOY.md`
- Risk:
  - Misconfigured `MODERATION_API_TOKEN` will block moderation updates by design
- Regression checks run:
  - typecheck pass
  - lint pass
  - build still blocked by local `spawn EPERM`
- Follow-ups:
  - Add real auth/role integration (Supabase Auth or platform SSO) in place of shared token
  - Add moderation operator UI controls that call `/api/moderation/review`

## 2026-03-05 - Moderation Queue API + In-App Operator Console

- Date: 2026-03-05
- Area: Moderation operations workflow
- Intent: Close the loop from moderation telemetry to actionable in-app approve/reject controls
- Invariants touched:
  - One-panel-at-a-time overlay behavior (`openPanel` exclusivity)
  - Token-gated moderation actions (no unauthenticated queue or status updates)
  - Mobile/desktop panel behavior consistency
- Files changed:
  - `app/api/moderation/queue/route.ts`
  - `components/UI/ModerationConsole.tsx`
  - `app/page.tsx`
  - `docs/DEPLOY.md`
  - `README.md`
- Risk:
  - Shared token in client session storage is practical but not role-scoped; requires migration to auth-backed roles
- Regression checks run:
  - typecheck pass
  - lint pass
  - build still blocked by local `spawn EPERM`
- Follow-ups:
  - Replace shared token with role-based auth + server-side identity checks
  - Persist reviewer metadata (`reviewed_by`, `reviewed_at`, `reviewer_notes`)
  - Add queue pagination/search and batch actions for scale
