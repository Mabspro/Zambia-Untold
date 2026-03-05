# ZAMBIA UNTOLD — Sprint 1 Agent Assignment Brief
## Multi-Agent Build · Cursor Workflow · v1.0

---

## CONTEXT FOR CLAUDE (READ FIRST)

You are the **architect and lead engineer** on this build. You have been given
a reference file — `zambia_untold_series.jsx` — which is the content dashboard
for the ZAMBIA UNTOLD series. Read it fully before scaffolding. It contains:

- The six historical markers with their narratives (the content layer is done)
- The copper/dark aesthetic language (colors, typography, tone)
- The post structure for each epoch

Your job is not to follow instructions mechanically. **Use your own engineering
intuitions.** If you see a better architectural pattern than what is described
below, propose it and explain why. The brief is a direction, not a specification.
You have latitude on structure, component architecture, and technical choices
within the constraints stated.

AG (Antigravity) will review your animation and shader implementations and
suggest enhancements. Treat AG's suggestions as amplification opportunities,
not corrections. Accept what strengthens the experience. Push back on anything
that adds weight without adding meaning.

---

## THE PRODUCT

**Name:** ZAMBIA UNTOLD — Interactive Historical Atlas
**Tagline:** The history you were never taught.

A 3D WebGL/WebGPU globe with a time scrubber. Six historical markers spanning
476,000 BC to 2026 AD. When a user selects a marker, the camera flies to that
location and the narrative panel loads the corresponding ZAMBIA UNTOLD post.
The aesthetic is sovereign, dark, copper-toned — not academic, not tourist.

This is the Minimum Viable Build (MVB). Everything not listed below is a
**future addition**. Do not scope-creep into future additions.

---

## TECHNICAL CONSTRAINTS

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **3D Engine:** Three.js (r3f / React Three Fiber preferred — use your
  judgment on whether bare Three.js or R3F is cleaner for this use case)
- **Globe Base:** Google 3D Tiles API OR a high-quality GLTF Earth mesh as
  fallback if Tiles API key setup adds friction to Sprint 1. Propose which
  approach you recommend and why.
- **Styling:** Tailwind CSS for UI panels; custom CSS/shaders for globe effects
- **No backend required for Sprint 1.** All data is static JSON.
- **Target:** Runs cleanly in Cursor. Deployable to Vercel in one command.

---

## THE SIX MARKERS — STATIC DATA LAYER

This is the complete data set for Sprint 1. No other data is needed.

```typescript
export const MARKERS = [
  {
    id: "kalambo-falls",
    epoch: -476000,
    epochLabel: "476,000 BC",
    tag: "ARCHAEOLOGY",
    coordinates: { lat: -8.5967, lng: 31.2356, alt: 800 },
    headline: "Before the Pyramid. Before the Wheel. Before Homo Sapiens.",
    subhead: "The oldest engineered structure in human history isn't in Egypt. It's in Zambia.",
    color: "#B87333",
    accentHex: 0xb87333,
  },
  {
    id: "kabwe-skull",
    epoch: -299000,
    epochLabel: "299,000 BC",
    tag: "PALEOANTHROPOLOGY",
    coordinates: { lat: -14.4469, lng: 28.4528, alt: 1200 },
    headline: "The Face of Our Ancestor Was Found in Zambia. And Then Forgotten.",
    subhead: "One of the most complete pre-human skulls ever found. Still in London.",
    color: "#C97B3A",
    accentHex: 0xc97b3a,
  },
  {
    id: "twin-rivers",
    epoch: -400000,
    epochLabel: "400,000 BC",
    tag: "HUMAN CONSCIOUSNESS",
    coordinates: { lat: -15.3, lng: 28.2, alt: 1280 },
    headline: "The First Artist Lived in Zambia. 400,000 Years Ago.",
    subhead: "Before cave paintings in France. A hominin here collected red ochre — and made meaning.",
    color: "#D4862A",
    accentHex: 0xd4862a,
  },
  {
    id: "ingombe-ilede",
    epoch: 1450,
    epochLabel: "14th–17th Century",
    tag: "MEDIEVAL TRADE",
    coordinates: { lat: -16.6, lng: 27.7, alt: 500 },
    headline: "While Europe Had the Dark Ages, Zambia Had a Global Trade City.",
    subhead: "A commercial hub on the Zambezi connected to Arab, Swahili, and Portuguese networks.",
    color: "#C8851A",
    accentHex: 0xc8851a,
  },
  {
    id: "kansanshi",
    epoch: 1150,
    epochLabel: "12th Century",
    tag: "ECONOMIC HISTORY",
    coordinates: { lat: -12.0833, lng: 25.8667, alt: 1350 },
    headline: "Zambia Invented Copper Currency in the 12th Century.",
    subhead: "Then was told it had no economy.",
    color: "#B87333",
    accentHex: 0xb87333,
  },
  {
    id: "lusaka-independence",
    epoch: 1961,
    epochLabel: "1961–1964",
    tag: "LIBERATION",
    coordinates: { lat: -15.4167, lng: 28.2833, alt: 1280 },
    headline: "The Nonviolent Revolution That Freed a Nation — And the World Never Heard of It.",
    subhead: "Cha-cha-cha: a decentralized civil disobedience campaign that forced Britain to negotiate.",
    color: "#C8851A",
    accentHex: 0xc8851a,
  },
];
```

The full narrative body copy for each marker is in `zambia_untold_series.jsx`.
Extract it from the `posts` array in that file.

---

## SPRINT 1 — REQUIRED DELIVERABLES

### 1. Globe + Camera System
- Render a 3D Earth globe (textured, dark/night aesthetic — not blue marble,
  not political borders, not tourist-friendly)
- Six markers rendered as glowing copper point-lights on the globe surface
- On marker click: smooth camera fly-to animation (arc trajectory, not linear)
- Camera settles at marker location with slight tilt to show topography
- Background: deep space — star field, subtle ambient. Not black void.

### 2. Time Scrubber UI
- Horizontal scrubber spanning the bottom of the viewport
- Range: 476,000 BC → 2026 AD (log-scaled is fine given the extreme range)
- As user scrubs, inactive markers fade — active epoch markers pulse
- Markers within ±20,000 years of current scrubber position are "active"
  (for prehistoric markers; for historical markers use ±100 years)
- Epoch label displays current scrubber position above the track
- Scrubber jumps to a marker's epoch when that marker is clicked

### 3. Narrative Panel
- Slides in from the right on marker click (or bottom on mobile)
- Contains: epoch tag, headline, subhead, full body copy, CTA line
- Dismissable with Escape key or close button
- Does not obscure the globe — panel overlays 35% of viewport width max
- Copper left-border accent matching the marker's `color` value
- Typography: use a serif for the headline (suggest Playfair Display or
  similar weight — propose your own choice and justify it)

### 4. Visual Aesthetic (Minimum)
- Globe: dark base map, night-side cities as amber points of light
- Marker glow: copper-toned pulsing point light, radius scales on hover
- Panel: dark background (#0F0B08 from the JSX reference), copper accents
- Ambient: subtle copper particle field drifting across globe surface
  (light particle density — do not affect performance)

---

## AG ANIMATION BRIEF (Hand to AG after Claude scaffolds)

AG receives the working scaffold from Claude and focuses exclusively on:

1. **Fly-to camera arc** — Review the camera animation curve. Is it
   cinematic? Should it ease out faster, linger at destination, add a
   subtle orbital drift before settling? Push for something that feels
   like a satellite falling into orbit, not a camera moving in a line.

2. **Marker pulse shader** — The six copper markers should breathe, not
   blink. Suggest a GLSL shader approach OR a Three.js material animation
   that produces an organic pulse — like a heartbeat, not a strobe.

3. **Narrative panel entrance** — The panel slides in. Too simple?
   Propose whether a fade+slide, a reveal-from-edge, or a
   scan-line-style reveal (consistent with the spy-thriller aesthetic
   referenced in the brief) would be more appropriate. Implement the
   chosen approach.

4. **Globe rotation idle state** — When no marker is selected, the globe
   slowly rotates. What is the right speed? What easing? Should it pause
   when the cursor is near a marker? Propose and implement.

5. **Time scrubber animation** — When the scrubber jumps to a new epoch
   (on marker click), propose whether the inactive markers should fade,
   shrink, or desaturate. Implement the one that reads most clearly at
   a glance.

AG should annotate all suggestions with a one-line rationale.
Accept Claude's architectural decisions as fixed. Animate within them.

---

## FILE STRUCTURE (Proposed — Claude may revise)

```
zambia-untold/
├── app/
│   ├── page.tsx              # Root — mounts the globe
│   ├── layout.tsx            # Font loading, metadata
│   └── globals.css           # Base resets, font-face
├── components/
│   ├── Globe/
│   │   ├── Globe.tsx         # Main Three.js / R3F scene
│   │   ├── GlobeMarker.tsx   # Individual marker component
│   │   ├── CameraRig.tsx     # Fly-to camera controller
│   │   └── shaders/
│   │       ├── marker.vert
│   │       ├── marker.frag
│   │       └── atmosphere.frag
│   ├── UI/
│   │   ├── TimeScrubber.tsx  # Epoch scrubber
│   │   ├── NarrativePanel.tsx # Sliding content panel
│   │   └── EpochLabel.tsx    # Current epoch display
│   └── Layout/
│       └── CanvasWrapper.tsx  # Full-viewport canvas container
├── data/
│   ├── markers.ts            # The six markers (above)
│   └── narratives.ts         # Full post copy (extracted from JSX ref)
├── lib/
│   ├── camera.ts             # Camera math utilities
│   └── epoch.ts              # Time scrubber scale utilities
├── public/
│   └── textures/
│       ├── earth-night.jpg   # Dark earth texture
│       └── earth-specular.jpg
└── package.json
```

---

## CONSTRAINTS — DO NOT BUILD IN SPRINT 1

The following are future additions. Do not touch them:

- Live data of any kind (flights, seismic, ZESCO grid)
- Trade route particle animations
- Colonial infrastructure overlays
- Bantu migration flows
- Audio layer
- Oral history integration
- User accounts or persistence
- Multi-language support
- Mobile app

These will be added in future sprints, gated on partnership acquisition.
The architecture should make them easy to add — but do not implement them.

---

## DEFINITION OF DONE — SPRINT 1

Sprint 1 is complete when:

- [ ] Globe renders in browser without errors
- [ ] All six markers are visible and correctly positioned on globe surface
- [ ] Clicking any marker triggers smooth fly-to camera animation
- [ ] Narrative panel opens with correct content for clicked marker
- [ ] Time scrubber renders and marker states respond to scrubber position
- [ ] Aesthetic matches the copper/dark palette from `zambia_untold_series.jsx`
- [ ] AG has reviewed and applied animation enhancements
- [ ] `npm run build` completes without errors
- [ ] Deployable to Vercel via `vercel --prod`
- [ ] Runs at 60fps on a mid-range laptop (no GPU-intensive effects by default)

---

## CURSOR WORKFLOW NOTES

- Open `zambia_untold_series.jsx` in a Cursor tab as persistent reference
- Run Claude in one terminal for architecture decisions and code generation
- Run AG in a second terminal for animation review pass
- Use Cursor's inline diff to review AG's shader suggestions before applying
- `package.json` should include a `dev` script that hot-reloads on save
- If Google 3D Tiles API key setup blocks progress, Claude should scaffold
  with a high-quality offline Earth texture and flag the Tiles integration
  as a one-line swap once the key is available

---

## FIRST CLAUDE PROMPT (Copy-paste to start)

```
Read the file zambia_untold_series.jsx in this folder. 

Then read the ZAMBIA_UNTOLD_SPRINT1_AGENT_BRIEF.md file fully.

You are the architect. Before writing any code:

1. Propose whether to use bare Three.js or React Three Fiber (R3F) for this 
   build and justify your choice in 3 sentences.

2. Propose the Earth texture approach: Google 3D Tiles API or static texture 
   with a plan to swap in Tiles later. Justify in 2 sentences.

3. Identify any architectural pattern you would change from what is described 
   in the brief, and explain why your approach is better.

Then, once I confirm your architecture decisions, scaffold the full project 
structure and begin with Globe.tsx and markers.ts.

You have autonomy on implementation details. Use your best engineering judgment.
The brief is a direction. You are the builder.
```

---

## FIRST AG PROMPT (Send after Claude delivers working scaffold)

```
Claude has scaffolded the ZAMBIA UNTOLD 3D globe. The working files are in 
this folder. Read Globe.tsx, GlobeMarker.tsx, CameraRig.tsx, and 
NarrativePanel.tsx before suggesting anything.

Your role is animation amplification. The architecture is fixed.
You are here to make the experience cinematic.

Review and respond to each of the five animation briefs in 
ZAMBIA_UNTOLD_SPRINT1_AGENT_BRIEF.md under "AG ANIMATION BRIEF".

For each brief:
- State your recommendation in one sentence
- Justify it in one sentence  
- Implement it

Do not change component structure. Do not add new dependencies without 
asking first. Animate within what Claude built.
```

---

*Brief version: 1.0 · Generated for multi-terminal Cursor workflow*
*Reference file: zambia_untold_series.jsx*
*Next sprint: Trade route particle layer (gated on Northrise research partnership)*
