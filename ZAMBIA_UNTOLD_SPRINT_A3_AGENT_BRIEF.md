# ZAMBIA UNTOLD — Sprint A3 Agent Brief
## Exhibit Cards · Evidence Schema · Museum Passport · CopperCloud Closing

---

## Context

Sprint A1 and A2 are complete in the current codebase:
- Deep Time segmented scrubber and contextual cards are live
- Lobby sequence is live
- Epoch palette, boundary scanline, Zambezi layer, Katanga layer, and WebGL HUD are live

Sprint A3 is now the active sprint and focuses on museum UX completion and narrative payoff.

---

## Sprint Goal

Deliver the full museum visitor loop:
1. Better exhibit card hierarchy
2. Structured evidence with citations
3. Visitor progression persistence and re-entry
4. Final 2026 closing frame that connects substrate history to CopperCloud

---

## Required Deliverables

### 1) Exhibit Card Redesign (Placard Hierarchy)

Update `components/UI/NarrativePanel.tsx` so marker cards read like museum placards:
- Object title
- Epoch/date label
- Body blocks
- Citation block (in Evidence tab)
- Optional hero image retained

Use the existing type stack already defined in `app/layout.tsx` and `app/globals.css`.

Success checks:
- Marker cards feel editorial and intentional, not generic app cards
- Story/Evidence tabs remain usable on mobile and desktop

---

### 2) Evidence Tab Schema + Rendering

Implement Appendix B schema in `data/narratives.ts`:

```ts
type NarrativeSource = {
  url: string;
  year?: number;
  confidence?: "high" | "medium" | "disputed";
  type?: "academic" | "archival" | "oral" | "media";
  label?: string;
  region?: "Zambia" | "Southern Africa" | "Pan-African" | "Global";
};
```

Add `sources?: NarrativeSource[]` to `Narrative` and seed each existing marker with at least 1–2 placeholder or real sources.

In `NarrativePanel.tsx` Evidence tab:
- Render a structured list of sources (label, year, type, region, confidence)
- Open source links in new tab with safe rel attributes
- Remove placeholder "Sprint B" copy

Success checks:
- Evidence tab is data-backed, not stub content
- Type safety preserved for all markers

---

### 3) Museum Passport Persistence + Re-Entry

Add local persistence layer (new file `lib/museumPassport.ts` recommended):
- `lastYear`
- `lastZone`
- `visitedMarkers: string[]`
- `visitedZones: DeepTimeZone[]`
- `lastVisitedAt`

Wire persistence from `app/page.tsx`:
- Save when scrubber changes and marker is selected
- On return, restore `scrubYear` to `lastYear`
- Show re-entry prompt once: `You left during [ZONE].`

Add lightweight "Galleries Visited" indicator:
- Show count based on visited zone names
- Example: `Galleries Visited: 4/8`

Success checks:
- Refresh/reopen restores prior epoch
- Re-entry prompt appears once per session and is dismissible
- Counter updates as user explores

---

### 4) CopperCloud Closing Frame at 2026

At far-right scrubber state (`scrubYear >= 2025`), present a dedicated closing card in the right panel when no marker is selected:
- Title: final-frame style, not generic contextual card
- Body includes the substrate → structure → sovereignty line from `docs/MUSEUM_ENHANCEMENT_PLAN.md` Part 2.5
- Explicit CopperCloud next-chapter line

Implementation option:
- Extend `getContextualCardForYear` with a `finale` card variant for 2025–2026
- Or add dedicated `getClosingFrameForYear` utility used by `NarrativePanel`

Success checks:
- 2026 endpoint no longer feels like a normal historical stop
- Closing argument clearly lands and is visually distinct

---

## Constraints

- Do not regress existing marker fly-to behavior, scrubber behavior, or layer toggles
- Keep `scrubYear` as canonical timeline state
- Preserve 60fps posture (no heavy assets/dependencies)
- Keep mobile layout stable

---

## Validation

Run:
- `npm run lint`
- `npm run build` (in network-enabled environment; local sandbox may block Google Fonts fetch)

Manual QA:
- Marker and non-marker panel flows
- Re-entry after hard refresh
- 2026 closing frame visibility
- Mobile viewport checks

---

## Definition of Done

- [ ] Narrative schema includes structured `sources`
- [ ] Evidence tab renders real source entries
- [ ] Museum Passport restores previous epoch and zone
- [ ] Re-entry prompt appears with "You left during [zone]"
- [ ] Galleries Visited counter is visible
- [ ] 2026 closing frame includes CopperCloud handoff
- [ ] Lint passes, and build is validated in a network-enabled run
