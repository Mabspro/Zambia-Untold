# Zambia Untold — Build Philosophy
_Locked: 2026-04-02. This is the standard all code on this project is held to._

---

## What We Are Building

Not a website. Not a dashboard. Not a digital museum in the conventional sense.

**A living national memory platform** — the only surface that lets you experience Zambia across deep history, present-day system signals, and future possibility. Built by a Zambian. Grounded in public data. Honest about what it knows and what it doesn't.

The technical decisions that follow exist to serve that ambition. Every line of code either advances it or dilutes it.

---

## The Non-Negotiable Experience Standard

A first-time user must move through: **awe → understanding → participation**.

If they only get awe, we've built a screensaver.
If they only get understanding, we've built a Wikipedia article.
Participation — contributing, returning, sharing — is the measure of success.

**The product must feel:**
- Cinematic but not slow
- Dense but not cluttered
- Intelligent but not intimidating
- Zambian — not a generic global template with copper colors

---

## The Three Lenses (Never Collapse These)

| Lens | What it is | Governs |
|------|-----------|---------|
| **Past** | Archive, museum, deep time | Wonder. First-time experience. |
| **Present** | Live signals — PSI, Kariba, FX, EONET | Return behavior. Habit loop. |
| **Future** | Sovereign compute, native AI, digital infrastructure | Strategic gravity. Institutional trust. |

**The globe is the stage. Mode is the spotlight. Never let them blur.**

A user in deep-time mode should not be distracted by live signal tickers.
A user in live-state mode should understand they are in the present epoch, not lost.
The Future layer should only appear when the user has earned the context to receive it.

---

## Code Discipline Standards

### 1. Performance is a feature
The Three.js globe is already heavy. Every new addition must be lazy-loaded and cache-aware. API calls must not block the hero render path. Live data failures must never break the globe.

**Rule:** Hero truth (globe, historical layers) renders first. Context truth (live signals) hydrates after.

### 2. Graceful fallback is mandatory, not optional
Every live data integration must return a complete, renderable object even on failure. The UI must never show an empty panel, a raw error, or an unexplained spinner where content should be.

**Rule:** Fallback is a formal adapter behavior. `sourceStatus: 'live' | 'fallback'` must be visible to the component. "Unavailable" is a valid display state. Silence is not.

### 3. Mode state is the source of truth
UI behavior derives from `UntoldMode`. Panels, rails, and overlays respond to mode — they do not guess it from scroll position, panel open state, or epoch index.

**Rule:** No component infers mode from context it shouldn't own. Mode is explicit and central.

### 4. Signal panels must answer four questions before shipping
For every live data panel, the developer must be able to fill in writing:
1. What is this signal? (source and type)
2. What does it mean? (plain language)
3. How certain is it? (live / cached / fallback / unavailable)
4. Why does it matter for Zambia? (human connection)

If any of the four can't be answered, the panel is not ready to ship.

### 5. Feature gate discipline
Before adding anything, ask:
- Does it improve orientation for a first-time user?
- Does it strengthen the habit loop (reason to return)?
- Does it preserve the globe as hero?
- Does it belong to Zambia Untold — or should it live in zambiamacro.ai or coppercloud.ai?

**If none of these are true, it doesn't ship in this sprint.**

### 6. Role boundaries are enforced in code
- Zambia Untold = meaning layer (narrative, context, cultural depth)
- zambiamacro.ai = signal layer (analytical depth, methodology, confidence)
- coppercloud.ai = infrastructure layer (sovereign compute, audit, governance)

No feature in Zambia Untold should duplicate the analytical function of zambiamacro.ai.
No panel should expose service-role data or raw analytical confidence scoring.
Cross-site links are the bridge — not feature duplication.

### 7. TypeScript strictness is non-negotiable
No `any`. No silent type suppressions. Interfaces for all data contracts.
The `UntoldPresentState` shape and `UntoldMode` enum are canonical — extend them, don't bypass them.

### 8. Quality gates before every merge
```
npm run typecheck   ← must pass
npm run lint        ← must pass
npm run build       ← must pass (document exact error if environment blocker)
```
No exceptions. No "I'll fix it in the next commit."

---

## Animation & Motion Principles

This platform lives and dies by feel. Motion is not decoration — it is meaning.

**Principles:**
- **Transitions should feel gravitational**, not mechanical. Elements enter with weight; they don't pop.
- **The globe auto-rotate and fly-to animations are sacred.** Never interrupt them with a layout shift.
- **Opacity is preferred over translate for information reveals.** Content fades in; it doesn't slide.
- **Never animate more than two things simultaneously** unless they are part of a composed sequence.
- **Framer Motion** is the standard for component-level animation. Use `layout` transitions for panel size changes.
- **Loading states must be beautiful**, not just functional. A spinner is a last resort.

---

## Interaction Design Principles

- **Progressive revelation.** Show what the user needs now. Reveal depth on intent.
- **Every panel earns its place.** If a panel doesn't answer a user question, it's noise.
- **One panel at a time.** The existing `openPanel()` exclusivity model is correct. Preserve it.
- **Mobile is not an afterthought.** The globe scales. The panels stack. Everything works at 375px.
- **Keyboard and accessibility.** Every interactive element is reachable without a mouse.
- **"Stored locally. No external tracking."** This is doctrine, not just copy. Enforce it in every new data integration.

---

## The Diaspora Test

Before shipping any feature, ask: *If a Zambian living in London or Sacramento opened this, would they feel something?*

Not impressed. Not informed. **Something.**

The "See Your Village From Space and From the Street" concept isn't a feature — it's a test. Every feature that collapses the gap between planetary scale and human intimacy passes. Every feature that adds technical capability without emotional relevance fails.

---

## What We Are Not Building

- A generic interactive globe with Zambia data overlaid
- A dashboard that happens to have a globe in it
- A colonial-gaze "Africa explained" educational tool
- A product that requires a user to read documentation to understand it
- A surface that breaks when zambiamacro.ai or any external API is unavailable

---

## The One-Line Test

> Does this help a user understand Zambia more deeply, more clearly, or more curiously than before?

If yes — ship it.
If it only adds visual complexity, technical capability, or coverage of an interesting dataset — hold it.

---

_This document is the standard. When in doubt, come back here._
