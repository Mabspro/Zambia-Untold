# ZAMBIA UNTOLD — Comprehensive UI/UX Audit Report

> **Date**: March 5, 2026
> **Scope**: Full application critique — UI, UX, rendering, aesthetics, content depth, visual clarity
> **Verdict**: Strong foundation with a museum-grade aesthetic. Several critical issues undermine
> the core mission. Fixable in 1–2 sprints.

---

## 🏆 What's Working Well

| Element | Assessment |
|---------|-----------|
| **Concept & Philosophy** | Extraordinary. "Before there were nations, there was a substrate" is a thesis statement worthy of a Smithsonian exhibit. The sovereignty framing is intellectually rigorous and emotionally resonant. |
| **Color Palette** | The copper/dark-earth palette (`#B87333`, `#030405` bg) is cohesive, warm, and distinctly non-generic. It feels like a museum at night — exactly right. |
| **Deep Time Panel** | Content depth is exceptional. Gondwana Assembly → Copperbelt → Sovereignty is a narrative arc most Zambians have never encountered. The "So What" sections are brilliant — they answer the question before a teenager asks it. |
| **Calendar System** | 41 events with category filtering, "On This Day", and globe navigation. Rare for any country, let alone Zambia. The calendar/events/places tab system is clean. |
| **Village Search** | Nominatim integration with curated suggestions is elegant. "Why This Matters" box is a philosopher's touch. |
| **Folk Tales (Inganji)** | 9 flagship tales with tradition filtering. Nyami Nyami's narrative reads like literature, not a Wikipedia stub. |
| **Action Bar** | The bottom navigation bar with breathing indicators is a beautiful touch — it implies a living system. Tooltip hints on hover are well-executed. |
| **Typography System** | Display + body + mono + citation fonts create clear hierarchy. The uppercase tracking on labels is museum-grade. |

---

## 🔴🔴 Foundational Principle: Anchored Narrative

> *"Every experience must answer the question: Where am I in the story right now?"*

This is the single deepest finding in this audit. Everything else — panel clutter, navigation confusion, globe drift — are **symptoms** of one missing architectural principle:

**The Principle of Anchored Narrative.**

### What It Means

Think about how a physical museum works. When you walk into the Smithsonian Air & Space Museum, every exhibit quietly tells you three things:

1. **Where you are in time**
2. **Where you are in space**
3. **Why this artifact matters**

You are never floating. You are always **anchored**.

```
Gallery 3
The Age of Flight
1903–1918
```

Immediately your brain knows: time, context, theme.

### Where Zambia Untold Is Already Strong

The system already has the pieces:

- Deep Time zones (geological epochs)
- Epoch labels (era names)
- Calendar events (historical sequence)
- Narrative panels (per-marker detail)
- Globe location (lat/lng, Zambia boundary)
- Folk tale layer (oral tradition)

This is actually an **extraordinary knowledge framework**. But these are currently **parallel systems** rather than a **single narrative anchor**.

### What Happens Without Narrative Anchoring

A user might experience this sequence:

1. Globe rotating somewhere near Africa
2. Calendar opens
3. Deep Time panel opens
4. Folk tale opens
5. Narrative panel still visible

Now the brain asks: *"What am I looking at right now?"*

Is it a geological exhibit? A historical moment? A folk tale? A calendar event?

**The system knows the answer. But the user is not always reminded of it.**

### The Simple Rule

Every state of the application should quietly answer: **YOU ARE HERE**

```
You are in:
  Human Time · Kingdom Era (1500–1800)

Exhibit:
  Four Kingdoms of Zambia

Location:
  Central Africa — Zambia
```

Or:

```
You are in:
  Deep Time · Katanga Formation (880M years ago)

Location:
  Copperbelt Basin
```

Now the brain relaxes. The user knows where they are in the story of Zambia.

### The Four Layers of Understanding Place

Zambia Untold already — perhaps unintentionally — created the structure for this:

```
🪨  Earth    (Geology)     — Deep Time panel
     ↓
📅  History  (Events)      — Calendar + Narrative
     ↓
✦   Memory   (Isibalo)     — Community contributions
     ↓
🔥  Myth     (Inganji)     — Folk tales & oral tradition
```

These are **four ways humans understand place**. The missing piece is simply **reminding the user where they are inside that ladder**.

### Implementation: The Story Compass

A persistent, minimal **"You Are Here"** indicator — always visible, always accurate:

```tsx
// components/UI/StoryCompass.tsx
// Derives from current state: scrubYear, activePanel, selectedMarker

// When on Deep Time panel:
"🪨 Deep Time · Gondwana Assembly · ~880M years ago"

// When on Calendar:
"📅 History · March · Zambia's Living Calendar"

// When on Inganji:
"🔥 Oral Tradition · Tonga Cosmology · Nyami Nyami"

// When on Isibalo:
"✦ Community Memory · The Living Archive"

// When idle on globe:
"🌍 Zambia · The Unfinished Sovereign · 2,026 AD"
```

**Position**: Top-center or just below the title. Small, non-intrusive, but always present. Like the "Gallery 3" placard in a museum hallway.

### Why This Is So Powerful

Most digital maps show **places**.
Most timelines show **time**.
This platform shows **civilization across time and place**.

That's much bigger. But the brain needs a compass.

**Narrative anchoring is that compass.**

When implemented, the platform stops feeling like *a globe interface* and starts feeling like **a guided historical atlas** — which is exactly what Zambia Untold wants to be.

### Relationship to Other Audit Findings

| Symptom (Found in Audit) | Root Cause (Anchored Narrative) |
|--------------------------|-------------------------------|
| Globe drifts to Americas | User loses spatial anchor |
| Multiple panels open simultaneously | User loses contextual anchor |
| 3 time-navigation patterns | No single temporal anchor |
| No feedback on Village Search fly-to | User loses "where did I land?" anchor |
| Re-entry prompt is jarring | User loses re-orientation anchor |

**Every critical and major issue in this audit traces back to narrative anchoring.**

---

## 🔴 Critical Issues (Fix Immediately)

### 1. Globe Shows Americas/Asia, Not Africa

**The Problem**: In multiple screenshots, the globe is displaying the Americas or Asia-Pacific — not Africa. For a project called "Zambia Untold," the globe should ALWAYS open centered on southern Africa. The idle auto-rotate drifts the globe away from Zambia within seconds.

**Root Cause**: The auto-rotate speed (0.35) combined with a 15-second idle snap timer means the globe drifts for a full 15 seconds before gently returning to Africa. First impressions are ruined — a visitor sees the Americas and thinks "is this about Zambia?"

**Recommendation**:
- Reduce idle snap timer from 15s → 6s
- Lower `autoRotateSpeed` from 0.35 → 0.12 (slower drift, stays near Africa longer)
- On initial load, ensure camera starts looking directly at Zambia (-13°S, 28°E), not just "Africa center"
- Consider: disable auto-rotate entirely when no marker is selected; replace with a subtle bob/breathe animation that keeps Zambia in view

**Severity**: 🔴 **Critical** — this is the first thing every visitor sees

---

### 2. Narrative Panel Persists Across All Views

**The Problem**: The "Four Kingdoms" narrative panel on the right side stays visible even when the Calendar, Deep Time, or Village Search panels are open. This creates:
- Visual clutter (3 panels + globe visible simultaneously)
- Information overload
- Reduced globe viewport
- Confusion about what the user is "supposed" to be looking at

**Recommendation**:
- When any overlay panel (Calendar, Deep Time, Inganji, Village Search, Isibalo) opens, **hide the narrative panel**
- When overlay closes, restore the narrative panel if a marker was selected
- Alternatively: treat the narrative panel as another `activePanel` type so only one thing is open at a time

**Severity**: 🔴 **Critical** — multiple overlapping panels destroy focus

---

### 3. Zambia Boundary Barely Visible at Globe Scale

**The Problem**: The Zambia boundary outline is drawn but is nearly invisible at the default zoom level. When the globe shows Africa, users cannot see where Zambia is highlighted. The boundary only becomes apparent at close zoom.

**Recommendation**:
- Increase boundary line width / opacity
- Add a subtle Zambia fill (semi-transparent copper overlay at 10-15% opacity)
- Consider a pulsing "find me" animation on the boundary when no marker is selected
- The province highlight layer should also be more visible

**Severity**: 🔴 **Critical** — users can't find Zambia on the globe

---

## 🟠 Major Issues (Fix Soon)

### 4. Globe Limb Glow / Atmosphere Wash

**The Problem**: The globe's edge (limb) has a bright white/blue atmospheric glow that washes out at certain angles. When viewing from the default distance, the bottom hemisphere appears overly bright, competing with the earth texture detail.

**Current values**: `ATMOSPHERE_OPACITY_NEAR = 0.07`, `ATMOSPHERE_OPACITY_FAR = 0.015`

**Recommendation**:
- The atmosphere mesh color (`#050d18`) is fine but the directional lights may be too strong
- Consider reducing the secondary directional light intensity from 0.15 → 0.08
- The primary directional light (0.95 intensity) may need to be angled more towards Africa to favor that hemisphere
- Test with atmosphere opacity near 0.04 (from 0.07)

**Severity**: 🟠 **Major** — globe rendering quality

---

### 5. Exhibit Layers Panel — Cluttered and Confusing

**The Problem**: The "Exhibit Layers" dropdown expands to show:
- 5 Deep Time entries
- 4 Human Time entries
- 4 Overlay toggles
- Journey Progress bar

This is a lot of information in the top-left corner competing with the title. The distinction between "Deep Time" and "Human Time" epochs in the layers panel vs. the TimeButtons nav vs. the Deep Time panel creates three different navigation patterns for what is conceptually one thing (time navigation).

**Recommendation**:
- Consolidate time navigation: the TimeButtons under the title header should be the ONLY way to navigate eras. Remove era links from the Layers panel.
- Layers panel should ONLY contain overlay toggles (boundary, province, particles, zambezi)
- Move "Journey Progress" to the title card (below "Galleries Visited")
- Consider renaming "Exhibit Layers" → "Map Overlays" for clarity

**Severity**: 🟠 **Major** — navigation confusion

---

### 6. Mobile Action Bar Crowding

**The Problem**: With 6 buttons (Deep Time, Calendar, Inganji, Search, Isibalo) plus breathing indicators, the action bar is getting crowded on mobile. At <480px, the labels are hidden but 6 emoji icons in a row may still be tight.

**Recommendation**:
- On mobile (<480px), consider a 2-row action bar or a collapsible "more" button
- Alternatively: group Search and Isibalo under a "+" overflow menu on mobile
- Test on 375px width (iPhone SE) to verify

**Severity**: 🟠 **Major** — mobile usability

---

### 7. Deep Time Panel Opens at Full Width on Mobile

**The Problem**: The Deep Time panel takes the full left side. When combined with the globe, the globe gets squeezed. On mobile, the panel likely covers the entire screen, but closing it to see the globe means losing context.

**Recommendation**:
- On mobile: Deep Time should open as a bottom sheet (swipe up/down) rather than a side panel
- The minimize/pill feature is good — make sure it's prominent on mobile
- Consider a "peek" mode where only the current epoch shows, expandable on tap

**Severity**: 🟠 **Major** — mobile experience

---

## 🟡 Moderate Issues (Improve)

### 8. No Visual Feedback When Village Search Flies to Location

**The Problem**: When you search for "Lusaka" and click View, the panel closes and the globe flies — but there's no marker, pin, or highlight at the destination. The user sees the globe rotate to a new angle but nothing indicates "this is Lusaka."

**Recommendation**:
- Drop a temporary marker/pin at the fly-to coordinate (red pin with label)
- Show a brief toast: "📍 Lusaka — 15.4163°S, 28.2815°E"
- Pin should fade after 10 seconds or when user interacts with globe
- Eventually: show nearest existing markers and Isibalo contributions at that location

**Severity**: 🟡 **Moderate** — user feedback gap

---

### 9. Contribution Form (Isibalo) — No Confirmation State

**The Problem**: The Isibalo form collects title, type, era, location, story, name — but after submission, the confirmation feedback may be too subtle. Users need clear reassurance that their contribution was saved.

**Recommendation**:
- Add a prominent success state: "✦ Your Memory Has Been Received" with a copper glow animation
- Show the submission as a preview card
- Add "Share Another" and "View on Globe" buttons
- Consider a counter: "23 memories contributed to the Living Archive" (even if seeded)

**Severity**: 🟡 **Moderate** — user trust

---

### 10. Calendar — "On This Day" Shows Nearest Event, Not Today's

**The Problem**: The banner shows "Today — March 5" but then highlights "International Women's Day — Julia Chikamoneka" which is March 8. This is correct behavior (nearest upcoming) but the wording "On This Day" implies today specifically.

**Recommendation**:
- If today has an event: "Today — [Event]"
- If today doesn't have an event: "Coming Up — March 8 — [Event]" or "Nearest — [Event]"
- This is a small wording fix but avoids confusion

**Severity**: 🟡 **Moderate** — content accuracy

---

### 11. Stars and Sparkles — Slightly Distracting

**The Problem**: The background stars (900 count) and copper sparkles (50 count) add atmosphere but can feel slightly "glittery" at times, competing with the globe's crispness.

**Recommendation**:
- Reduce star count from 900 → 500
- Reduce sparkle count from 50 → 25
- Reduce sparkle size from 2 → 1.2
- The goal: a NASA photo backdrop, not a screensaver

**Severity**: 🟡 **Moderate** — visual polish

---

### 12. Font Rendering — Small Text on Desktop

**The Problem**: Many labels use 9px–10px text with wide tracking. While this is museum-correct on a printed label card, on screen at a normal viewing distance, some text is borderline illegible:
- Marker coordinates in search results: 9px
- "Powered by OpenStreetMap": 8px
- Calendar category filters: small chip text
- Deep Time geological note content

**Recommendation**:
- Establish a minimum readable size: 10px for decorative/metadata, 12px for actual content
- The 8px footer text is too small — bump to 10px
- Consider a global `text-base` override for reading content (13px minimum)

**Severity**: 🟡 **Moderate** — accessibility

---

## 🔵 Minor Issues (Polish)

### 13. Orbit Controls — Zoom Range Too Wide
- `minDistance: 1.12` allows clipping into the globe surface
- `maxDistance: 5` pulls so far back the globe becomes a marble
- **Recommendation**: min 1.25, max 3.8

### 14. No Loading State for Globe Texture
- If earth-night.jpg is slow to load, there's no skeleton/placeholder
- The preload screen covers initial load but subsequent visits may flash

### 15. "You left during Colonial Wound" — Jarring Phrasing
- The re-entry prompt uses zone names like "Colonial Wound" — emotionally accurate but potentially confusing without context
- **Recommendation**: Add a one-line description: "You left during The Colonial Wound (1890–1964)"

### 16. No Keyboard Navigation for Action Bar
- Tab/Enter should cycle through action bar buttons
- Escape closes panels (already works) but Tab focus isn't visually indicated

### 17. Contribution Form — Select Dropdown Styling
- The era dropdown uses a native `<select>` which breaks the copper aesthetic on some browsers
- **Recommendation**: Custom dropdown or styled select

---

## 📊 Scoring Matrix

| Dimension | Score (1-10) | Notes |
|-----------|:---:|-------|
| **Concept & Vision** | 10 | Genuinely rare. No other platform does this for any African country. |
| **Content Depth** | 8.5 | 41 calendar events, 9 tales, 9 markers. Needs 2–3x more for stickiness. |
| **Visual Identity** | 9 | Copper-on-dark is museum-grade. Cohesive across all panels. |
| **Globe Rendering** | 6.5 | Good texture, but atmosphere wash, limb glow, and not-on-Africa are issues. |
| **Marker Visibility** | 7 | Just fixed to red — verify they're visible at default zoom. |
| **Navigation/IA** | 5.5 | Three time-navigation patterns (TimeButtons, Layers eras, Deep Time panel) create confusion. |
| **Panel Layout** | 5 | Overlapping panels is the biggest UX problem. |
| **Mobile Readiness** | 6 | FOV fix is good, but action bar crowding and panel sizes need work. |
| **Performance** | 8 | 60fps WebGL, lazy-loaded, dpr-capped. Solid. |
| **Accessibility** | 4 | Small fonts, no keyboard nav, no alt-text, no screen reader support. |
| **Engagement/Stickiness** | 7.5 | Museum passport, "On This Day", Village Search are engaging hooks. |
| **Community Layer** | 7 | Isibalo form exists but no display of contributions on the globe yet. |

**Overall**: **7.0 / 10** — "Impressive proof of concept with museum-grade aesthetics. Needs navigation consolidation, panel management, and globe-centering fixes to become production-ready."

---

## 🎯 Recommended Priority Fixes

### Sprint C0 (Foundational — build first)
0. **Build the Story Compass** — a persistent "You Are Here" indicator that derives from `scrubYear`, `activePanel`, `selectedMarker`, and always answers: *Where am I in time? Where am I in space? What layer am I in?* This single component resolves the root cause of issues #1, #2, #4, #5, and #8. It transforms the interface from "exploratory chaos" into a "guided historical atlas."

### Sprint C1 (Immediate — 1 week)
1. **Fix globe to stay on Africa** — reduce idle snap, lower autoRotate, center on Zambia
2. **One-panel-at-a-time rule** — close narrative when overlay opens
3. **Make Zambia boundary visible** — thicker line, subtle copper fill
4. **Consolidate time navigation** — remove eras from Layers panel

### Sprint C2 (Soon — 2 weeks)
5. **Village Search fly-to marker** — temporary pin at destination
6. **Mobile action bar** — overflow or 2-row layout
7. **Font minimum size** — 10px floor for all text
8. **Atmosphere tuning** — reduce limb glow

### Sprint C3 (Polish — ongoing)
9. **More content** — target 80+ calendar events, 20+ folk tales, 15+ markers
10. **Accessibility pass** — keyboard nav, ARIA labels, screen reader
11. **Isibalo display on globe** — show community contributions as pins
12. **Re-entry prompt wording** — add date range to zone names

---

## 🧭 Final Thought

This project has something most tech projects lack: **a thesis**. It's not just a globe with pins — it's an argument that Zambia's story spans 900 million years and deserves to be told with the same technical sophistication that Google uses for its maps. The aesthetic is already museum-grade. The content is already deeper than most educational platforms. What's needed now is **navigation clarity** (one panel at a time, one time-nav pattern, globe always on Zambia) and **visual sharpness** (Zambia visible, markers visible, atmosphere crisp).

Fix those, and this becomes one of the most ambitious digital heritage projects in Africa.

---

*Zambia Untold · UI/UX Audit · March 2026*
