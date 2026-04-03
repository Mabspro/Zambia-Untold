# INTEGRATION_NOTES.md — zambia-untold ↔ zambiamacro.ai

_Last updated: 2026-04-02_

---

## The Concept

Zambia Untold shows where Zambia came from — 900 million years of geological, cultural, and political history mapped onto a 3D globe.

zambiamacro.ai shows where Zambia is right now — live sovereign power stress intelligence built from public data rails (rainfall, hydrology, FX, copper, grid context).

The natural bridge: the **"Unfinished Sovereign" / "Rebalancing Sovereign" epoch (2021→present)** is the live epoch in the Deep Time Panel. That's exactly where the zambiamacro signals belong.

---

## The Integration Point in Code

`lib/sovereignty.ts` already defines the present era:

```ts
// Hichilema era — SI 68 local content legislation
return {
  governance: "Independent State",
  value: "Mixed / SI 68 Era",
  infrastructure: "Rebalancing Sovereign",
};
```

These are currently static strings. A future `getSovereignLiveState()` function could fetch from zambiamacro.ai's public API and overlay real-time context on top of the static governance framing.

---

## What the Live Layer Would Add

When the user's Deep Time scrubber is at the present epoch (2021→2026):

**Globe markers:**
- Lusaka marker pulses at intensity proportional to current PSI level (0.0–1.0)
- Zambezi river overlay tints based on Kariba storage % (blue-healthy → amber-stressed)
- A "System State" tooltip on the Lusaka marker: "PSI 0.65 / Moderate — Kariba 20.9%"

**Sovereignty panel (present epoch):**
- Static governance text stays as-is
- New live strip below it:
  - Power Stress Index: [level] / [regime]
  - Kariba storage: [%]
  - FX pressure: [direction]
  - Last updated: [timestamp]
  - Link: "Full analysis → zambiamacro.ai"

**Deep Time Panel (present epoch card):**
- "So What" section could reference live system state:
  - "Today: Kariba reservoir at 20.9% — the energy constraint is also a sovereignty constraint."

---

## Data Source

zambiamacro.ai exposes public Supabase views:
- `public_psi_view` — latest PSI reading, regime, confidence
- `public_hydrology_latest_view` — Kariba storage %
- `public_boz_fx_latest_view` — ZMW/USD latest + pressure direction
- `public_rail_health_latest_view` — system health status

A future `/api/zambia-macro/state` route in zambia-untold could proxy these into a single shaped response for the globe and panel components. This keeps zambia-untold's frontend decoupled from direct Supabase calls to the signals project.

---

## Prerequisites Before Building

1. **zambiamacro.ai public API surface** — currently the data is in Supabase views but there's no formal versioned API endpoint. This is on the signals.zambia.ai post-retrain roadmap (see `docs/architecture/gated-analyst-console-spec.md` and `ROADMAP.md`).

2. **April PSI retrain** — the model should be validated before its output is embedded in another product surface. Don't pull in a pre-retrain PSI as if it's settled.

3. **CORS / public read path** — the zambiamacro Supabase anon key already allows public reads on the views listed above. A simple fetch from zambia-untold's API layer will work without additional auth.

---

## What NOT to Do

- Don't embed raw PSI numbers in globe markers before the April retrain validates the model
- Don't make the present-epoch rendering depend on the live fetch (use graceful fallback to static text if the fetch fails)
- Don't expose the signals.zambia.ai service role key in zambia-untold — anon read views only
- Don't make the connection so tight that a signals.zambia.ai outage breaks the zambia-untold globe

---

## Sequencing

| When | What |
|------|------|
| Now | Keepalive cron deployed, Supabase protected |
| April 2026 | PSI retrain — validate model accuracy |
| May–June 2026 | zambiamacro.ai public API surface + gated analyst console (Phase 1) |
| June–July 2026 | Build `/api/zambia-macro/state` proxy in zambia-untold |
| July 2026 | Wire present-epoch globe markers and sovereignty panel to live data |
| September 2026 | Demo the integrated experience at UNGA side events |

---

## Why This Matters

The combination — deep historical archive + live sovereign intelligence — is something no other platform has for Zambia.

Zambia Untold makes the country legible across time. zambiamacro.ai makes it legible in real time. Together they tell a complete story: here is where Zambia came from, here is what it is dealing with right now, and here is the infrastructure monitoring it continuously.

That's the product vision worth building toward.
