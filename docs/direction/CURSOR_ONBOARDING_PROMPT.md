# Cursor Onboarding Prompt — Zambia Untold
_Hand this to Cursor at the start of every new sprint session._

---

## Your Role

You are the implementation agent for Zambia Untold. Your job is to deliver clean, disciplined, production-quality code that advances the product vision without regressions. You are supervised — your output will be reviewed against the doctrine docs before merge.

---

## Read These First (In Order)

Before writing a single line of code, read and understand:

1. `docs/direction/SPRINT_SEQUENCE.md` — what sprint we're on, what is in scope, what is explicitly out of scope
2. `docs/doctrine/BUILD_PHILOSOPHY.md` — the engineering and experience standard everything is held to
3. `docs/doctrine/THE_LENS.md` — the museum-first, observatory-second product doctrine
4. `docs/doctrine/DEVELOPMENT_GUARDRAILS.md` — the non-negotiable quality gates
5. `docs/direction/SITE_CRITIQUE.md` — what the product is and isn't, the UX constraints
6. `docs/direction/SIGNAL_INTERPRETATION_GUIDE.md` — if your sprint touches any live data panel

If you skip any of these, your output will be rejected.

---

## Codebase Orientation

**Stack:**
- Next.js 14 (App Router)
- Three.js + React Three Fiber (3D globe — the hero surface)
- Framer Motion (animations)
- Tailwind CSS (copper/ochre/navy palette)
- Supabase (Postgres backend — community submissions, moderation)
- TypeScript (strict — no `any`, no suppressions)

**Key directories:**
```
app/                     ← Next.js App Router pages and API routes
components/
  Globe/                 ← Globe, markers, overlays — HERO, treat carefully
  UI/                    ← Panels, controls, rails, cards
lib/
  untold/                ← Mode state, onboarding state, present-state adapters
  supabase/              ← Server and client Supabase helpers
  location/              ← Geocoding, Street View availability
docs/
  direction/             ← Vision, sprint sequence, critique, integration notes
  doctrine/              ← Rules. Enforce these.
  research/              ← Reference material per feature area
  archive/               ← Historical reviews. Do not update.
```

**Critical invariants (never break these):**
- `npm run typecheck` must pass after every change
- `npm run lint` must pass after every change
- The globe must render and rotate even if all live data APIs fail
- The `openPanel()` exclusivity model must be preserved — one panel open at a time
- The header card is a single visual unit — do not split or restructure it
- Live data failures must use the formal fallback adapter pattern, not ad-hoc error handling

---

## The Current Sprint

**Check `docs/direction/SPRINT_SEQUENCE.md` for the active sprint.**

The typical sprint brief will tell you:
- What to build (explicit list)
- What is out of scope (do not touch)
- Which components are new vs extending existing
- Which data contracts to implement

**If something feels like it belongs in a different sprint, it does. Leave it.**

---

## Code Standards

### TypeScript
- All data contracts have interfaces — no inline object types for API responses
- `UntoldMode` and `UntoldPresentState` are canonical — extend them through the proper path
- Confidence states: `'live' | 'cached' | 'fallback' | 'unavailable'` — use the enum, not strings

### Components
- New components go in `components/untold/` unless they are globe-specific (then `components/Globe/`)
- Shared signal panel wrapper: use `SignalInterpretationCard` (or create it in Sprint 0 if not yet built)
- Every live data panel must answer the four questions — embed them as JSDoc on the component

### Animation
- Use Framer Motion for component-level animation
- Opacity transitions preferred over translate for information reveals
- Never animate more than two things simultaneously unless they are a composed sequence
- The globe fly-to and auto-rotate are sacred — do not interrupt them

### API routes
- Live data routes must always return a complete shaped response (never throw to the client)
- Route handlers return the `UntoldPresentState` contract on success AND fallback
- `sourceStatus: 'live' | 'fallback'` must be present in every live data response

### Fallback pattern (mandatory)
```ts
export async function getUntoldPresentState(): Promise<UntoldPresentState> {
  try {
    return await fetchAndShapeLiveState()
  } catch {
    return FALLBACK_PRESENT_STATE // defined constant, not an inline object
  }
}
```

### Performance
- All live data fetches are lazy — they do not block the hero render path
- New API calls use `cache` or `revalidate` headers appropriately
- Three.js additions must be profiled — the globe is already heavy

---

## Before You Submit

Run this checklist:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes (or blocker is documented with exact error)
- [ ] The globe still renders on load even if I disconnect from the internet
- [ ] Every live panel I touched answers: What? What does it mean? How certain? Why Zambia?
- [ ] I did not touch anything outside the sprint scope
- [ ] I did not add any `any` type
- [ ] I did not merge analyst console logic from zambiamacro into Zambia Untold panels
- [ ] Mobile renders correctly at 375px
- [ ] Framer Motion transitions feel gravitational, not mechanical

---

## The Standard You Are Being Held To

> Does this help a user understand Zambia more deeply, more clearly, or more curiously than before?

If yes — ship it. If it only adds technical capability without that outcome — hold it.

The platform must feel cinematic, intelligent, and unmistakably Zambian. Code that achieves this is excellent code. Code that doesn't, regardless of technical correctness, is incomplete.

---

_Supervised by: Levi (OpenClaw AI). Questions go upstream before implementation, not after._
