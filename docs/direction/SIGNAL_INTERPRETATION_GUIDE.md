# Zambia Untold — Signal Interpretation & Expansion Guide

_Last updated: 2026-04-02_
_Reviewed: 2026-04-02 — Levi_

## Purpose

This note turns raw live-data panels into **interpretable public signals**. The goal is not only to show that Zambia Untold can pull live data, but to explain **what the data means, how confident we should be, and why a student, teacher, diaspora user, or curious visitor should care**.

This guide should help Zambia Untold become:
- a place where people **linger**, not just glance
- a place where teachers can say, **"go explore this"**
- a place that introduces users to **space, Earth observation, public data, and Zambia-facing systems thinking**
- a place that can seed interest in a future Zambian space-data or geospatial imagination

---

## Core Interpretation Doctrine

<!-- LEVI: This four-question framework is the most important thing in the entire document.
It should become a literal design checklist — not just doc prose.
Every panel, before it ships, should be able to answer all four in writing.
If a developer can't fill in all four for a given panel, the panel isn't ready. -->

Every live panel in Zambia Untold should answer four questions:

1. **What is this signal?**
   Name the source and the type of observation.
2. **What does it mean?**
   Translate the signal into plain language.
3. **How certain is it?**
   Clarify whether it is direct, modeled, estimated, sampled, or fallback.
4. **Why does it matter for Zambia?**
   Connect the signal to place, people, infrastructure, ecology, or learning.

### Recommended UI pattern

For each signal block, present:
- **Signal**
- **Interpretation**
- **Confidence / Source note**
- **Why it matters**
- optional **Learn more** or **Explore this**

<!-- LEVI: This UI pattern maps directly onto the four questions above.
The implementation should be a shared `SignalInterpretationCard` component
with slots for all four fields — not bespoke copy scattered across panels.
Standardising the component means standardising the doctrine. -->

---

## 1. Space Signal Panel

### What it is
A live or near-real-time orbital context panel showing the ISS position and selected satellites overhead or visible from Zambia, computed from public orbital data.

### Source reality
- Public orbital element sets such as TLE/GP data are designed to support orbit propagation for resident space objects. citeturn124720search2
- EONET is not the source here; this panel is based on orbital data and propagation logic.
- If the app uses propagated TLE data and an SGP4 library such as `satellite.js`, the displayed positions are **computed estimates from public orbital elements**, not direct live camera footage. TLE-style data exists precisely to support this kind of propagation. citeturn124720search2turn124720search5

### How to interpret it
Users should understand:
- this is **where known space objects are estimated to be** based on public orbital models
- the ISS line is the most recognizable entry point
- the broader value is not just "cool, something is overhead" but that **Zambia is part of a real orbital environment** that supports communications, weather services, timing systems, Earth observation, and global infrastructure

### Confidence language
Use one of the following labels:
- **Live propagated**: position computed from current public orbital elements
- **Cached propagated**: recently computed from cached orbital elements
- **Fallback model**: estimated from reduced or sampled orbital data
- **Unavailable**: signal not currently reliable

<!-- LEVI: These four confidence states should be a TypeScript enum, not just doc prose.
The same enum should power both the UI label and the API response shape.
This prevents the label drifting from the actual data source state over time.
Align with the `sourceStatus: 'live' | 'fallback'` pattern in UntoldPresentState. -->

### Suggested public-facing interpretive copy

**ISS Not Over Zambia**
The International Space Station is currently not passing above Zambia. Its position updates from public orbital tracking sources and orbit models.

**Why this matters**
The ISS is a familiar doorway into understanding that Zambia sits under the same shared orbital commons as the rest of the world.

### Suggested improvement for listed satellites
Instead of listing only names such as `SKYNET 4C` or `UFO 2`, classify each object where possible:
- communications satellite
- weather satellite
- navigation satellite
- military communications satellite
- scientific payload
- historical calibration satellite
- unknown / uncategorized object

### Better panel framing
Replace a raw list with a table or expandable list such as:
- **SKYNET 4C** — geostationary communications satellite
- **UFO 2 (USA 95)** — military communications satellite
- **CALSPHERE 1** — historic calibration satellite

<!-- LEVI: The satellite classification labels (comms / weather / navigation / historical / unknown)
should live in a small lookup table in the codebase, not just in this doc.
CelesTrak's GP data includes object type codes — many can be auto-classified.
Unknown/uncategorized is fine and honest for the remainder.
This makes the panel educational without requiring manual curation per satellite. -->

Add a short explainer:

> These are space objects currently overhead or visible from Zambia based on public orbital models. Some support communications or observation. Others are legacy or specialized spacecraft.

### Why it matters for Zambia
This panel can support three types of value:
1. **Scientific literacy**
   Introduces orbital mechanics, public space data, and tracking.
2. **National imagination**
   Suggests that Zambia can participate in geospatial, satellite, and Earth-observation literacy even without a large formal space program.
3. **Infrastructure awareness**
   Helps users understand that connectivity, broadcasting, weather, and Earth monitoring are linked to orbital systems.

### Teacher-facing framing
- What is the difference between a satellite being **overhead**, **visible**, and **useful**?
- Which satellites support communications, weather, or observation?
- Why do orbital models need updates?
- What can Zambia learn from public space data without launching anything?

---

## 2. Earth Observation / Fire Signal Panel

### What it is
A panel showing natural-event metadata and fire-related signals from NASA Earth observation sources, likely routed through EONET and informed by active fire / thermal anomaly datasets.

### Source reality
- NASA's EONET is a metadata repository of natural events exposed through web services and API endpoints. Version 3.0 is the current stable API release. citeturn124720search0turn124720search3turn124720search12
- NASA FIRMS provides near-real-time access to active fire and thermal anomaly products. citeturn124720search7turn124720search18
- NASA notes that each active fire / hotspot detection represents the center of a pixel flagged as containing one or more fires or other thermal anomalies, not necessarily the exact location of a wildfire on the ground. citeturn124720search1turn124720search4turn124720search21

### What users must **not** assume
Users should **not** read this panel as:
- confirmed on-the-ground incident reporting
- proof that all listed events are active uncontrolled wildfires
- strict Zambia-only events, unless the filter is truly Zambia-only

### What users **can** assume
Users **can** read this panel as:
- a near-real-time satellite-informed indicator of fire or thermal activity in Zambia or the surrounding region
- a regional environmental awareness signal
- a prompt to ask where seasonal burning, wildfire risk, or land stress may be occurring

### Recommended label change
If Zimbabwe or neighboring-country items may appear, rename the block from something like:
- **Open Events in Zambia Region**

to something more honest, such as:
- **Regional Fire Signals Nearby**
- **Southern Africa Fire / Thermal Events**
- **Earth Observation Signals Near Zambia**

<!-- LEVI: This label change is a one-line copy fix but it matters a lot for credibility.
The current label implies Zambia-only accuracy that the data doesn't support.
"Regional" is the honest word. Make this change before any institutional outreach. -->

### Suggested public-facing interpretive copy

**Regional Fire Signals Nearby**
These entries come from NASA Earth-observation event sources and satellite-detected fire or thermal anomaly feeds. They show where satellites have detected signs of heat or burning in or near the Zambia region.

**Important note**
These are satellite-informed signals, not ground-confirmed incident reports. A point can represent a detected hotspot or thermal anomaly, not necessarily the exact fire boundary or a confirmed wildfire on the ground. citeturn124720search1turn124720search13

### Why it matters for Zambia
- dry-season awareness
- environmental literacy
- forest and grassland fire pattern awareness
- agricultural burning discussions
- public understanding of how satellites see land stress

### Teacher-facing framing
- What is the difference between a thermal anomaly and a confirmed wildfire?
- Why might satellites detect fires in one place but not another?
- What do seasonal fire patterns reveal about land use and climate?
- How can public Earth-observation data help communities think earlier?

---

## 3. Living Archive Panel

### What it is
A participatory record of approved community contributions, archive items, and mission-related submissions.

### How to interpret it
This is not just a database count. It is the beginning of a **public memory ledger**.

If the panel says:
- `Isibalo: 0`
- `Missions: 0`

that should not feel empty or dead. It should feel like an invitation.

### Suggested public-facing interpretive copy

**Living Archive - Approved**
This is where community memory becomes part of the record. Approved submissions may include place-based history, oral memory, cultural reference points, or guided missions built from local knowledge.

**What Isibalo means here**
Isibalo is the community record layer: memory that is reviewed, placed, and made legible.

### Why it matters for Zambia
- gives people a way to contribute to national memory
- makes place knowledge visible
- creates intergenerational educational value
- turns Zambia Untold from a viewing experience into a participatory one

### Teacher-facing framing
- Ask students to document a place, story, or local memory for archive review
- Compare textbook history with local memory
- Explore how maps become richer when communities contribute

---

## 4. Present-State Sovereign Signals

This is the most important future expansion area because it creates a **reason to return**.

### Why this layer matters
Deep-time history creates awe. Present-day signals create habit.

<!-- LEVI: This is the single most important sentence in the document.
It should be on a wall somewhere.
The Present layer is not a feature addition — it is the behavioral architecture
that turns this from a one-time experience into a recurring surface.
Prioritise it accordingly in sprint sequencing. See New-Direction_Sprint-Sequence.md Sprint 0.5. -->

If Zambia Untold later shows public live-state markers such as:
- PSI / power stress
- Kariba storage
- FX pressure
- rainfall anomalies
- crop stress

then the platform becomes something users revisit, not just admire once.

### Interpretation rules for Present-state signals
Every live Zambia signal should include:
- **Current state**: what is happening
- **Trend**: getting better, worse, or stable
- **Scope**: national, basin-level, corridor-level, or regional
- **Freshness**: when updated
- **Caution**: whether it is modeled, inferred, or direct

### Example interpretive template

**Kariba Storage - 20.9%**
A low storage level can indicate strain in the hydrology-energy system, especially where reservoir conditions affect power generation.

**Why it matters**
This is not just a water number. It can shape electricity reliability, business confidence, and household experience.

### Education value
This is where Zambia Untold can become a bridge between:
- geography
- economics
- climate
- infrastructure
- civics

---

## 5. General UI Guidance for Interpretive Panels

### A. Never show a live signal without a meaning layer
Bad:
- raw count
- cryptic label
- unexplained source

Better:
- short description
- one-sentence interpretation
- source and confidence note
- why it matters

### B. Use human-readable categories
Instead of only:
- TLE
- FIRMS
- EONET
- NORAD

also say:
- orbital tracking data
- NASA event metadata
- satellite-detected fire signals
- public Earth-observation feed

### C. Always distinguish these categories
- **direct measurement**
- **modeled estimate**
- **sampled fallback**
- **community record**
- **derived interpretation**

### D. Let users go deeper
Every panel should eventually support one of:
- `Learn more`
- `How this works`
- `Why this matters`
- `View source method`

---

## 6. Candidate Public Signals to Add Next

These should be added only if they support the site's mission and can be interpreted clearly.

### A. Rainfall anomaly / drought context
**Why useful**
Makes seasonal stress legible. Helps students connect climate, agriculture, and hydrology.

**Good public sources to explore**
- CHIRPS rainfall
- FEWS NET context layers
- NASA / USGS Earth-observation products

**Interpretive angle**
"Is this season wetter or drier than normal?"

### B. Vegetation health / greenness
**Why useful**
Lets users see the landscape respond to rainfall, drought, or fire season.

**Good public sources to explore**
- Sentinel-2 derived vegetation visualizations
- NDVI-style public layers
- Digital Earth Africa products

**Interpretive angle**
"How green or stressed does this part of Zambia look right now compared with usual conditions?"

### C. Water-body change
**Why useful**
Excellent for Kariba, floodplains, wetlands, and seasonal river visualization.

**Interpretive angle**
"How is visible water extent changing over time?"

### D. Lightning / storm activity
**Why useful**
High public interest, strong classroom appeal, and immediate visual energy.

**Interpretive angle**
"What kind of weather activity is moving across the region?"

### E. Air quality / aerosol smoke context
**Why useful**
Connects fires, seasonal burning, and public health.

**Interpretive angle**
"Where might smoke or airborne particles be building up?"

### F. Night lights / electrification proxy
**Why useful**
A powerful teaching surface for infrastructure, settlement, and development patterns.

**Interpretive angle**
"How does visible night activity reflect infrastructure and economic geography?"

### G. River basin and flood watch markers
**Why useful**
Helpful for geography and water-risk education.

**Interpretive angle**
"Which river systems matter most for settlement, energy, and agriculture?"

### H. Aviation / ship corridor context
**Why useful**
Can teach trade geography, corridor logic, and regional connectivity.

**Interpretive angle**
"How do goods, people, and routes connect Zambia to the wider world?"

### I. Language and cultural geography
**Why useful**
High educational value and deeply aligned with Zambia Untold's civilizational purpose.

**Interpretive angle**
"Where are Zambia's language communities rooted, and how underrepresented are they in digital systems?"

### J. Satellite image of the day / region of the week
**Why useful**  
Creates a reason for repeat visits and classroom use.

**Interpretive angle**  
"What can we notice this week from above?"

<!-- LEVI: J is the most underrated item on this list.
"Zambia This Week" (see Section 7.2) built around a satellite image + one signal + one historical prompt
is the simplest possible habit-loop mechanism and requires no new complex infrastructure.
This should be considered for Sprint 0.5 or A as a lightweight recurring surface.
It creates editorial identity without requiring a full editorial team. -->

---

## 7. High-Value Educational Experiences to Design Around

### 1. From Space to Street
A user searches a town, sees it from orbit, and when coverage exists, drops to street level.

**Why it works**
It collapses abstraction into intimacy.

### 2. Zambia This Week
A small recurring surface showing:
- one present-state national signal
- one regional Earth observation item
- one historical prompt
- one featured place or language

**Why it works**  
It creates repeat engagement without needing a full dashboard mentality.

<!-- LEVI: This is the feature I'd build first if I were choosing a single Sprint 0.5 addition.
It's low infrastructure (mostly editorial + one cached API call per item),
high repeat-visit value, and it connects all three temporal layers (past / present / future)
in a single compact weekly surface.
The zambiamacro.ai PSI reading is a natural "present-state national signal" for this.
Could be auto-generated from live data with minimal copy — no editorial team required. -->

### 3. Classroom Missions
Examples:
- Find three visible signs of fire season and explain them
- Compare Kariba water conditions across time
- Track one satellite overhead and identify its purpose
- Document a local place for Isibalo review

### 4. Story + Signal pairings
Pair every major historical or environmental topic with a live or recent data signal.

Examples:
- river history + current water extent
- copperbelt history + present-day commodity / corridor context
- fire season traditions + current fire/thermal activity view

---

## 8. Suggested Content Labels to Use in the UI

### For fire panels
- **Signal type:** Satellite-detected fire / thermal activity
- **Interpretation:** Possible burning or heat activity in the region
- **Confidence:** Near-real-time satellite signal, not ground-confirmed incident reporting

### For satellite panels
- **Signal type:** Public orbital tracking
- **Interpretation:** Space objects currently overhead or visible from Zambia
- **Confidence:** Computed from orbital elements; may use fallback propagation if live route is unavailable

### For archive panels
- **Signal type:** Approved community record
- **Interpretation:** Reviewed public memory and mission contributions
- **Confidence:** Curated and platform-approved, not automated Earth-observation data

### For future sovereign signals
- **Signal type:** Public system-state indicator
- **Interpretation:** A contextual view of present-day Zambia conditions
- **Confidence:** Can include direct observations, derived metrics, and modeled indicators depending on the signal

---

## 9. Product Principle Going Forward

Zambia Untold should not become a dumping ground for interesting data.

It should become a place where:
- raw public signals are turned into public understanding
- history and live systems illuminate each other
- Zambia is seen as both memory and motion
- students can learn that science, maps, satellites, climate, infrastructure, and culture all belong on the same stage

The test for every future signal is simple:

> Does this help a user understand Zambia more deeply, more clearly, or more curiously than before?

If yes, it belongs. If it only adds visual noise or unexplained telemetry, it does not.

<!-- LEVI: This principle is correct and should be encoded as the feature gate doctrine
in docs/doctrine/untold-feature-gate.md (referenced in New-Direction_Sprint-Sequence.md).
The test question above should be literally the first item in that gate checklist.
The difference between a museum and a dumping ground is curation.
Curation is not taste — it's a rule, enforced consistently. -->

---

## 10. Immediate Next Build Recommendation

Before adding many more live feeds, implement an interpretive wrapper for the current panel blocks:

### Minimum viable upgrade
For each current signal block, add:
- one-line explanation
- confidence/source note
- why-it-matters sentence
- optional `Learn more`

### Best next additions after that
1. satellite classification labels
2. fire/thermal anomaly explanation tooltip
3. weekly featured signal or place
4. one classroom mission module
5. one repeat-visit surface such as **Zambia This Week**

That sequence improves usability, educational value, and return behavior without breaking the site's atmosphere.

<!-- LEVI: Full agreement with this build order.
One addition: the interpretive wrapper upgrade (Section 10, minimum viable upgrade)
should happen *before* Sprint 0 front door work, not after.
Reason: if the front door points new users to "View Live Zambia"
and they land on unexplained telemetry panels, the orientation work is wasted.
Fix the signal interpretation first, then open the front door to them.

Also — this document should be linked from New-Direction_Sprint-Sequence.md
as the interpretive governance layer. The sprint sequence tells you when to build.
This document tells you how to build it honestly. They are a pair. -->
