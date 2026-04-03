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

## 2026-03-06 - TD-01/TD-06 Cleanup + Museum-First Enforcement + Content Upgrade

- Date: 2026-03-06
- Area: Globe rendering pipeline, data layer integrity, museum-first architecture
- Intent: Resolve TD-01 (epoch.ts deprecated exports), TD-06 (inline GLSL shaders), enforce museum-first layer defaults in Globe.tsx, gate community API fetch on layer visibility, upgrade ingombe-ilede academic sources
- Invariants touched:
  - Data/backend safety: community/approved fetch now gated — no API calls unless community layer enabled
  - Museum-first principle: Globe.tsx DEFAULT_LAYERS now matches app/page.tsx (space: false, earthObservation: false)
  - Shader maintainability: xray shaders now live in /components/Globe/shaders/ directory
- Files changed:
  - `lib/epoch.ts` — deleted all deprecated asinh-scale exports (TD-01 resolved); only `isMarkerActive` remains
  - `components/Globe/Globe.tsx` — removed inline XRAY_VERTEX/XRAY_FRAGMENT strings; imports from `./shaders/xray.vert` and `./shaders/xray.frag`; fixed DEFAULT_LAYERS to museum-first (space/EO off); gated `loadApproved` useEffect on `layerVisibility.community`
  - `components/Globe/shaders/xray.vert` — new file: XRAY vertex shader (TD-06 resolved)
  - `components/Globe/shaders/xray.frag` — new file: XRAY fragment shader (TD-06 resolved)
  - `next.config.mjs` — added webpack `asset/source` rule for `.glsl/.vert/.frag` raw imports
  - `glsl.d.ts` — new file: TypeScript module declarations for `*.vert`, `*.frag`, `*.glsl` imports
  - `data/narratives.ts` — replaced ingombe-ilede Britannica/Wikipedia sources with Fagan/Phillipson academic citations (1968/1969, Journal of African History)
- Risk:
  - `loadApproved` gate change: if `community` layer defaults to `true`, behavior is unchanged; only affects users/envs where community layer is explicitly disabled
  - Shader file import requires webpack raw loader (added to next.config.mjs); if PWA wrapper interferes, test with `npm run build:no-pwa`
  - TD-01 cleanup: confirm no external scripts reference the deleted asinh exports before removing from any published package
- Regression checks run:
  - typecheck: pending (local EPERM environment)
  - lint: pending (local EPERM environment)
  - build: pending (local EPERM environment — same pre-existing blocker)
- Follow-ups:
  - Verify `.vert`/`.frag` imports resolve correctly in `npm run typecheck` after glsl.d.ts inclusion
  - Add `glsl.d.ts` reference to `tsconfig.json` if typecheck does not auto-pick it up
  - TECH_AUDIT_MATRIX.md updated: TD-01 and TD-06 rows removed

## 2026-03-06 - Comprehensive Code State Handoff Refresh

- Date: 2026-03-06
- Area: Cross-cutting handoff documentation
- Intent: Produce a dated, reality-checked code state summary for the next developer with verified build/test status and current risks.
- Invariants touched:
  - None (documentation-only change)
- Files changed:
  - `docs/CODESTATE_REVIEW_2026-03-06.md`
  - `docs/ENGINEERING_MEMORY.md`
- Risk:
  - None to runtime; risk is stale docs if not maintained after future merges.
- Regression checks run:
  - `npm run typecheck` pass
  - `npm run lint` pass
  - `npm run build` fails locally with `spawn EPERM` (environmental)
- Follow-ups:
  - Keep this handoff doc as the canonical onboarding snapshot until replaced by the next dated review.

## 2026-04-03 - Sprint 0 Front Door + Museum-First Defaults

- Date: 2026-04-03
- Area: Front-door orientation, mode architecture, archive trust
- Intent: Deliver Sprint 0 by adding explicit entry routes, a canonical mode resolver, progress framing, and truthful archive messaging without disturbing the globe-first museum flow.
- Invariants touched:
  - Museum-first default preserved; observatory remains opt-in
  - Community archive default restored to off for first-time visitors
  - Intro/header remains a single visual anchor, now with explicit route guidance
- Files changed:
  - `app/page.tsx`
  - `app/api/keepalive/route.ts`
  - `components/Globe/Globe.tsx`
  - `components/UI/ContributionForm.tsx`
  - `components/untold/HeroIntroCard.tsx`
  - `components/untold/EntryRoutes.tsx`
  - `components/untold/ProgressPassport.tsx`
  - `components/untold/WhyThisSignal.tsx`
  - `components/untold/ContextRail.tsx`
  - `components/untold/timeUtils.ts`
  - `lib/untold/entry-routes.ts`
  - `lib/untold/onboarding-state.ts`
  - `lib/untold/ui-mode.ts`
- Risk:
  - Header card is taller and should get an additional visual/mobile pass on a live device
  - Archive entry route currently points into contribution flow because a dedicated archive surface is not yet built
- Regression checks run:
  - `npm run typecheck` pass
  - `npm run lint` blocked by local Windows `.next` cache `EPERM`
- Follow-ups:
  - Add dedicated archive/listing surface so `Enter the Archive` is not contribution-first
  - Implement Sprint 0.5 present-state adapter and strip once zambiamacro public API is ready
  - Run mobile and desktop visual verification after local file-lock issue clears

## 2026-04-03 - Dedicated Archive Surface

- Date: 2026-04-03
- Area: Archive browse flow, front-door honesty, approved record discovery
- Intent: Give `Enter the Archive` a real public destination that is browse-first, filterable, and read-only on entry, with contribution moved to a secondary CTA.
- Invariants touched:
  - No new archive API surface; reuse `/api/community/approved` and `/api/space/mission/approved`
  - Globe remains homepage hero; archive route is a separate non-globe surface
  - Contribution remains moderated and secondary to browsing
- Files changed:
  - `app/archive/page.tsx`
  - `components/untold/ArchiveSurface.tsx`
  - `app/api/community/approved/route.ts`
  - `lib/server/provinceLookup.ts`
  - `app/page.tsx`
- Risk:
  - Province derivation depends on the normalized province GeoJSON staying accurate
  - Archive public browsing currently depends on the same approved endpoint used by the globe, so backward compatibility of that payload should be watched
- Regression checks run:
  - pending
- Follow-ups:
  - Add direct links from archive cards back into relevant globe moments once route affordances are defined
  - Implement Sprint 0.5 `UntoldPresentState` and `/api/zambia-macro/state`
