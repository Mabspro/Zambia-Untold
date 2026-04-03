# Development Guardrails

This document defines engineering guardrails for progressive development in Zambia Untold.

## 1) Non-Negotiable Quality Gates

Before merge or handoff:
1. `npm run typecheck`
2. `npm run lint`
3. `npm run build` (or document environment blocker with exact error)

No change is complete if these are skipped without a written blocker note.

## 2) UI Layering Invariants

Treat these as contract rules:
1. Header card must remain a single visual card (title + metadata + embedded era nav).
2. `Play intro` must remain inside header card and clickable only when lobby is done.
3. Layers panel must remain visible and reachable on desktop and mobile.
4. Expanded Layers panel must never permanently hide or clip key controls.
5. Sovereignty Stack must hide when Layers are expanded.

If any invariant changes, update this file and `docs/ENGINEERING_MEMORY.md` in the same commit.

## 3) Intro/Lobby State Machine Invariants

Allowed sequence:
`preload -> globe -> thesis -> ui -> pulse -> done`

Required behavior:
1. `playIntro()` clears session intro/tour flags and restarts at `preload`.
2. Intro replay resets guided-tour progress flags.
3. Intro replay closes active overlay panels and selected marker state.
4. Guided tour may appear only when lobby is `done` and tour flag is absent.

## 4) Progressive Development Workflow

For each feature:
1. Add or update one entry in `docs/ENGINEERING_MEMORY.md` first (intent + affected surfaces).
2. Implement smallest vertical slice.
3. Run gates (`typecheck`, `lint`) immediately.
4. Validate visually on desktop and mobile breakpoints.
5. Add a short "regression check" note to PR/commit message.

## 5) Regression Checklist (Run for UI-affecting changes)

1. Header visible at 375px, 768px, 1440px.
2. Layers card visible/clickable at 375px and 1440px.
3. `Play intro` restarts full sequence and guided tour.
4. Time navigation remains within header card (no stacked-card artifact).
5. Space Signal and Sovereignty Stack do not overlap critical controls.
6. One-panel-at-a-time behavior still enforced.

## 6) Data/Backend Safety

1. Submission APIs must degrade to local fallback if backend unavailable.
2. Never block user submission solely on remote write failure.
3. Keep source status explicit (`live` vs `fallback`) in live data endpoints.

## 7) Definition of Done

A feature is done only when:
1. Behavior matches spec and invariants.
2. Quality gates pass (or blocker documented).
3. Memory log updated (`docs/ENGINEERING_MEMORY.md`).
4. README/sprint notes updated when user-visible behavior changed.
