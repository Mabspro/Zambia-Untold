# docs/ — Zambia Untold Documentation

Organised into four folders. Know where to look before adding anything new.

---

## direction/
**Active product direction. Read this first.**

| File | What it is |
|------|-----------|
| `VISION_V2.md` | Full product vision — three-layer model, integration roadmap, ecosystem links |
| `SPRINT_SEQUENCE.md` | Implementation doctrine — mode model, sprint order, component contracts, feature gate |
| `SITE_CRITIQUE.md` | UX governor — anti-drift doctrine, narrative hierarchy, audience framing |
| `SIGNAL_INTERPRETATION_GUIDE.md` | How to build honest signal panels — four-question framework, confidence labels, educational design |
| `INTEGRATION_NOTES.md` | zambiamacro.ai ↔ zambia-untold connection — data sources, timing, sovereignty.ts hook |

**Before building anything:** read `SPRINT_SEQUENCE.md` for sequencing, `SITE_CRITIQUE.md` for anti-drift checks, `SIGNAL_INTERPRETATION_GUIDE.md` for any live data panel.

---

## doctrine/
**Non-negotiable rules. Enforce these, don't debate them.**

| File | What it is |
|------|-----------|
| `THE_LENS.md` | Core product doctrine — museum-first, observatory as second lens |
| `DEVELOPMENT_GUARDRAILS.md` | Quality gates, UI invariants, regression checklist |
| `DEVELOPMENT_GUIDELINES.md` | Engineering workflow, pre-merge checklist |
| `LIVE_SYSTEMS_ROADMAP.md` | Observatory expansion rules and sequencing |
| `LIVE_SYSTEMS_EXECUTION_MATRIX.md` | Implementation decisions for each live system |
| `PROVINCE_NORMALIZATION.md` | Province naming and normalization rules |

---

## research/
**Reference material and content research. Read when building a specific feature.**

| File | What it is |
|------|-----------|
| `APPEARANCE_CONTEXT.md` | Indigenous Zambian visual language for UI design |
| `COMMUNITY_CONTEXT.md` | Strategy for community contribution layer |
| `MINERAL_CONTEXT.md` | Geological and mineral history for epoch cards |
| `SPACE_ANGLE.md` | Nkoloso story and space layer concept |
| `SPACE_LAYER_README.md` | Space layer technical notes |
| `PALANTIR_CONTEXT.md` | Palantir-inspired layer/mode design patterns |
| `TECH_EXPERIENCE_RECOMMENDATIONS.md` | Phase A–C technical recommendations |
| `INGANJI_SPEC.md` | Folklore / folk tales content spec |
| `LIVING_ARCHIVE_SPEC.md` | Isibalo community archive spec |
| `FIRE_WATER_PLAN.md` | Fire and water observatory layer plan |
| `SPRINT_MISSION_FRAMEWORK_C3.md` | Mission framework from Sprint C3 |
| `CONTENT_ARCHITECTURE_COMMUNITY.md` | Community layer, Inganji, and Isibalo content architecture |

---

## archive/
**Completed reviews and historical planning docs. Do not update — for reference only.**

| File | What it is |
|------|-----------|
| `CODESTATE_REVIEW_2026-03-06.md` | Code state snapshot, March 2026 |
| `FOUNDER_CTO_AUDIT_2026.md` | Product and engineering audit |
| `FIRST_TIME_WELCOME_REVIEW_AND_PLAN.md` | Onboarding review (superseded by SPRINT_SEQUENCE.md Sprint 0) |
| `MUSEUM_ENHANCEMENT_PLAN.md` | Museum enhancement planning (completed) |
| `MUSEUM_SPRINT_PLAN.md` | Museum sprint plan (completed) |
| `UI_UX_AUDIT_REPORT.md` | UX audit report |
| `UI_UX_AUDIT_REVIEW_COMMENTARY.md` | UX audit commentary |

---

## Root-level docs (keep here)
| File | What it is |
|------|-----------|
| `DEPLOY.md` | GitHub, Vercel, and Supabase deploy instructions |
| `ENGINEERING_MEMORY.md` | Short continuity log — decisions, risks, follow-ups |

---

## Adding a new doc

Ask: which folder does this belong in?

- **direction/** — if it shapes what to build next or governs product decisions
- **doctrine/** — if it's a rule that must be enforced on every build
- **research/** — if it's reference material for a specific feature or content area
- **archive/** — if it's a completed review or historical plan

If it doesn't fit any of these, it probably doesn't need to be a doc yet.
