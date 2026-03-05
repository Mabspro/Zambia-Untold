# ZAMBIA UNTOLD — Sprint A1 Agent Assignment Brief
## Deep Time Foundation · Segmented Scrubber · Contextual Epoch Cards · Lobby Sequence

---

## CONTEXT FOR AGENT (READ FIRST)

Sprints 1, 2, 3A, and Production Hardening are complete. The globe has:
- Six markers, time scrubber (476,000 BC → 2026 AD linear)
- X-Ray shader, Cha-cha-cha particles, Export Brief
- OrbitControls, Zambia boundary, province highlight, idle snap
- NarrativePanel with Story/Evidence tabs

**The concept is proven.** Sprint A1 transforms the scrubber from a flat timeline into a **Deep Time axis** — geological epochs as gallery wings. Every position tells a story, even when no marker is active.

**Stack:** Next.js 14, TypeScript, Three.js, React Three Fiber. Do not migrate to Cesium.

**Reference:** `docs/MUSEUM_ENHANCEMENT_PLAN.md` Part 2.5, Appendix D. `docs/Mineral_Context.md`.

---

## THE PRODUCT (Post–Sprint A1)

A scrubber that runs from **4.5 billion years ago** to **2026 AD** in **8 labeled zones**. When the visitor drags through "DEEP EARTH" or "ANCIENT LIFE," the panel shows contextual epoch cards — not a blank or stale marker. The lobby delays UI for 7 seconds so the thesis lands before a single click.

---

## SPRINT A1 — REQUIRED DELIVERABLES

### 1. SEGMENTED SCRUBBER AXIS

Replace the current linear 476K BC → 2026 scrubber with a **segmented axis** of 8 zones. Each zone gets proportional scrubber space regardless of real-time duration.

**Zone names and approximate boundaries:**

| Zone | Start | End | Scrubber % (example) |
|------|-------|-----|----------------------|
| DEEP EARTH | 4.5B BC | 540M BC | 0–12% |
| ANCIENT LIFE | 540M BC | 5M BC | 12–25% |
| HOMINID RISE | 5M BC | 476K BC | 25–35% |
| ZAMBIA DEEP | 476K BC | 1000 CE | 35–55% |
| COPPER EMPIRE | 1000 CE | 1600 CE | 55–65% |
| KINGDOM AGE | 1600 CE | 1890 | 65–75% |
| COLONIAL WOUND | 1890 | 1964 | 75–90% |
| UNFINISHED SOVEREIGN | 1964 | 2026 | 90–100% |

**Implementation:**
- Map scrubber position (0–100%) to year using a piecewise or lookup table. The exact percentages are tunable — the key is that DEEP EARTH and ANCIENT LIFE feel explorable, not compressed.
- Display zone labels on or near the scrubber track. Option: show current zone name above the thumb.
- Existing markers (Kalambo, Kabwe, Twin Rivers, Ing'ombe Ilede, Kansanshi, Lusaka) remain at their year positions. Marker click still jumps scrubber and opens narrative panel.
- Preserve `scrubYear` as the canonical state — the rest of the app (SovereigntyStack, X-Ray, etc.) continues to use it.

### 2. CONTEXTUAL EPOCH CARDS

When the scrubber is **between** named markers (or in a zone with no marker), the right panel must **not** go blank. It shows a **Contextual Epoch Card**.

**Content:** Synthesized geological/archaeological context from `MUSEUM_ENHANCEMENT_PLAN.md` Appendix D. Example for Cretaceous:

> *"You are in the Cretaceous period, approximately 90 million years ago. The landmass that will become Zambia sits within Gondwana, covered by a shallow sea. The copper ore bodies forming deep underground will not be discovered by humans for another 89.9 million years."*

**Implementation:**
- Create a data structure or module: `contextualEpochCards` — map zone or year range to card content.
- Generate copy at **build time** from Appendix D tables. No runtime API calls. You may use a static JSON/TS file with pre-written cards for each zone.
- NarrativePanel: when `marker` is null but `scrubYear` is set, render the contextual card for the current zone instead of nothing.
- Design: Same panel chrome (border, backdrop). Card typography consistent with exhibit cards. No hero image for contextual cards unless you add one.

**Zones needing cards:** DEEP EARTH, ANCIENT LIFE, HOMINID RISE, ZAMBIA DEEP (when between markers), COPPER EMPIRE, KINGDOM AGE, COLONIAL WOUND, UNFINISHED SOVEREIGN. Minimum: one card per zone. You may have multiple cards per zone keyed by sub-ranges.

### 3. LOBBY SEQUENCE

On first load (or when no `localStorage` passport exists), run the **lobby sequence**:

| Time | Action |
|------|--------|
| 0–3s | Globe only. No header, no scrubber, no Layers panel, no Sovereignty Stack. Earth from ~800km, Africa centered, Zambia boundary visible. |
| 3s | Fade in single line: *"Before there were nations, there was a substrate."* |
| 5s | Fade in: header, scrubber, Layers panel, Sovereignty Stack. |
| 7s | A single copper pulse radiates outward from Zambia's center (CSS or WebGL animation). Then UI settles. |

**Implementation:**
- Use React state or a simple `useEffect` timer. Track `lobbyPhase` (0 | 1 | 2 | 3 | done).
- Conditionally render UI elements based on phase. Use `opacity` and `transition` for fades.
- The 7s "heartbeat" can be a brief scale/opacity pulse on the Zambia boundary or a radial gradient expanding from Zambia's lat/lng. Keep it subtle — one cycle, then done.
- After lobby completes, set a flag (e.g. `localStorage` or state) so returning visitors skip or shorten the sequence. Museum Passport (Sprint A3) will handle re-entry; for A1, a simple `hasSeenLobby` in sessionStorage is sufficient.

### 4. ZONE LABEL ON SCRUBBER

The current EpochLabel shows the year (e.g. "2,026 AD"). Retain that, but also show the **zone name** when the scrubber is in a geological zone (DEEP EARTH, ANCIENT LIFE, HOMINID RISE). For human-history zones, the year may suffice. Option: show both — e.g. "ANCIENT LIFE · 90M BC" or "COPPER EMPIRE · 1,200 AD".

---

## TECHNICAL CONSTRAINTS

- **Do not remove or break:** X-Ray shader, particles, Export Brief, narrative panel, marker fly-to, OrbitControls, Zambia boundary, province highlight.
- **Year mapping:** The app uses `scrubYear` (number) everywhere. Your segmented axis must produce a valid `scrubYear` for each scrubber position. For pre-human epochs, use negative years (e.g. -4500000000 for 4.5B BC). Ensure `lib/epoch.ts` and any year utilities handle large negative values.
- **Performance:** 60fps. No new heavy assets. Contextual cards are text only.
- **Mobile:** Lobby sequence must work on touch. Scrubber remains usable.

---

## DATA FILES TO CREATE

| File | Content |
|------|---------|
| `data/contextualEpochCards.ts` | Zone → card content. Export `getContextualCardForYear(year: number): { title, body } \| null`. |
| `lib/deepTime.ts` | Zone boundaries, `scrubberPositionToYear(percent: number): number`, `yearToScrubberPosition(year: number): number`, `getZoneForYear(year: number): string`. |

---

## SUCCESS CRITERIA

- [ ] Scrubber has 8 zones. Dragging left reaches DEEP EARTH (4.5B BC). Dragging right reaches UNFINISHED SOVEREIGN (2026).
- [ ] Zone labels visible (on track or near thumb).
- [ ] No dead zones: panel always shows marker narrative OR contextual epoch card.
- [ ] Lobby: 3s no chrome, thesis line at 3s, full UI at 5s, copper pulse at 7s.
- [ ] Returning visitor (sessionStorage): lobby can be skipped or abbreviated.
- [ ] SovereigntyStack, X-Ray, markers still work correctly with extended year range.

---

## OUT OF SCOPE (Later Sprints)

- Zambezi river evolution layer (A2)
- Boundary scanline animation (A2)
- Museum Passport re-entry ("You left during...") (A3)
- CopperCloud closing frame (A3)
- Mineral layers (craton, Katanga pulse) (A2)

---

*Brief derived from docs/MUSEUM_ENHANCEMENT_PLAN.md and docs/MUSEUM_SPRINT_PLAN.md.*
