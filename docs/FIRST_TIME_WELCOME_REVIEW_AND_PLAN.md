# First-Time User Welcome — Review & Implementation Plan

**Date:** March 2026  
**Scope:** Lobby sequence, onboarding alignment, and the missing guided tour / gamified intro.

---

## 1. What Exists Today — Alignment Check

### 1.1 Lobby sequence (fully in place)

| Phase    | Duration | What happens | Spec alignment |
|----------|----------|--------------|----------------|
| **preload** | 1.5s  | Mwela concentric circles (PreloadScreen), then → globe | ✅ Appearance-Context: "Pre-load screen: Full dark with single Mwela concentric circle SVG, expanding slowly, copper. No text. 1.5 seconds." |
| **globe**   | 1.5s  | Globe visible, no thesis yet | ✅ "Globe reveal" — Earth in view |
| **thesis**  | 2s    | Centered line: *"Before there were nations, there was a substrate."* | ✅ Narrative.md / Foundation thesis; correct copy |
| **ui**      | 2s    | Header, TimeButtons, action bar fade in | ✅ "UI chrome fade" |
| **pulse**   | 1s    | Copper radial gradient (`lobby-pulse`), then → done | ✅ Short transition into full UI |
| **done**    | —     | Full UI; `LOBBY_STORAGE_KEY` set; return visitors skip to here | ✅ Sprint A1 / Museum Passport re-entry |

- **Skip Intro** is available from globe → pulse (not during preload). Correct.
- **Return visitors:** If `hasSeenLobby` or passport exists, `lobbyPhase` is set to `"done"` on mount. Re-entry prompt shows "You left during {zone}" when appropriate.
- **Data sovereignty** line is in the header card: "Stored locally · No external tracking". Aligns with CTO/commentary.

### 1.2 What’s missing vs. spec

- **60-Second Guided Tour (CTO Part 7.2)**  
  After the lobby completes, first-time visitors should see a **3-step contextual hint system**:
  - Step 1 (3s): Highlight globe — *"This is 900 million years of Zambian history. Drag to explore."*
  - Step 2 (3s): Highlight scrubber — *"Move this to travel through time — from geological formation to today."*
  - Step 3 (3s): Highlight a marker — *"Click any glowing dot to open its story."*  

  **Current state:** Not implemented. The flow goes straight from lobby `done` to full UI with no post-lobby hints.

- **Gamified / scroll-of-intro**  
  There is **no scroll-based intro** and **no step progress indicator** in the codebase. The lobby is purely **time-based** (fixed delays). A “gamified” intro could mean:
  - **Variant A — Time-based with progress:** Same 3 steps, but with visible step dots (1–2–3) and optional “Next” so the user feels progression.
  - **Variant B — Interaction-driven:** Step 1 auto or tap; Step 2 advances when the user **drags the scrubber**; Step 3 advances when the user **clicks a marker**. Feels like a short “tour” they control and complete.

  Either variant would make the intro feel more intentional and “guided” than the current jump from lobby to full UI.

---

## 2. Alignment Summary

| Element | Status | Notes |
|---------|--------|--------|
| Preload (Mwela circles) | ✅ | 1.5s, copper, no text |
| Globe → thesis → UI → pulse | ✅ | Timings and copy correct |
| Skip Intro | ✅ | Shown after preload |
| Re-entry prompt | ✅ | "You left during {zone}" |
| Data sovereignty line | ✅ | In header card |
| Story Compass | ✅ | Implemented, subtle |
| **Post-lobby 3-step guided tour** | ❌ | Not built |
| **Gamified / progress feel** | ❌ | No step indicator or interaction-driven flow |

---

## 3. Implementation Plan — Post-Lobby Guided Tour

### 3.1 Goal

- Only for **first-time visitors** (lobby just finished; we can reuse or extend the same “seen once” signal).
- **No modal, no blocking overlay.** Inline tooltip-style hints that fade in/out (CTO: “museum corner label” level of weight).
- Optionally **gamified**: either time-based with step dots, or interaction-driven (scrubber drag, marker click) to advance.

### 3.2 Storage

- Reuse **`LOBBY_STORAGE_KEY`** (`zambia-untold:lobby-seen`) to mean “lobby has been seen” and **add a separate key** for the tour so we can:
  - Show the tour only **once** after the first full lobby completion.
  - Optionally later: “Replay tour” from a menu without replaying the whole lobby.

Suggested:

```ts
const TOUR_STORAGE_KEY = "zambia-untold:guided-tour-seen";
```

- When the 3-step tour **completes** (or user skips it), set `sessionStorage.setItem(TOUR_STORAGE_KEY, "1")`.
- **When to show tour:** `lobbyPhase === "done"` and `!sessionStorage.getItem(TOUR_STORAGE_KEY)`.

### 3.3 Component structure

- **New component:** `components/UI/GuidedTourHints.tsx` (or `FirstTimeTour.tsx`).
- **Props:**  
  - `active: boolean` (true when lobby is done and tour not seen).  
  - `onComplete: () => void` (mark tour seen, clear any highlight state).  
  - Optional: `mode: "time" | "interaction"` (see below).
- **Renders:**
  - A single, small tooltip-style line (positioned per step: globe center, scrubber area, marker area).
  - Optional: step indicator (e.g. three dots 1–2–3) near bottom or top corner.
  - Optional: “Skip” / “Next” for time-based mode.

### 3.4 Step content and positioning

| Step | Message | Position / target |
|------|---------|-------------------|
| 1 | "This is 900 million years of Zambian history. Drag to explore." | Center or bottom-center, pointing at globe (no DOM “highlight” of canvas; just text near globe). |
| 2 | "Move this to travel through time — from geological formation to today." | Near the TimeButtons / scrubber (left or top). |
| 3 | "Click any glowing dot to open its story." | Near globe center or a representative marker region (again, text only; no need to highlight a specific marker in DOM). |

Copy is from CTO review; keep it short so it fits one line on mobile.

### 3.5 Logic — Time-based variant (simplest)

- When `active` becomes true, start a short delay (e.g. 0.5s) then:
  - **Step 1:** Show hint 1 for 3s, then fade out.
  - **Step 2:** Show hint 2 for 3s, then fade out.
  - **Step 3:** Show hint 3 for 3s, then fade out.
  - Call `onComplete()`, set `TOUR_STORAGE_KEY`.
- Use Framer Motion or CSS: opacity 0 → 1 (0.3s) and 1 → 0 (0.3s) for each step. No layout jump; `pointer-events-none` so the user can still drag/click if they want.
- Optional: three dots (e.g. `· ● ·`) that update per step; “Skip” button sets tour seen and calls `onComplete()`.

### 3.6 Logic — Interaction-driven (gamified) variant

- **Step 1:** Show hint 1. Advance after 3s **or** on first globe drag (OrbitControls `onStart` or equivalent).
- **Step 2:** Show hint 2. Advance only when the user has **moved the scrubber** (e.g. `scrubYear` changed by user action). Optional timeout (e.g. 15s) to auto-advance so we don’t trap them.
- **Step 3:** Show hint 3. Advance when **any marker is selected** (`selectedMarkerId` set) or after timeout.
- **Completion:** On step 3 advance or skip, set `TOUR_STORAGE_KEY` and call `onComplete()`.

This requires passing **callbacks or state** from `page.tsx` into the tour component (e.g. “scrubber moved”, “marker selected”) so the tour can advance. Slightly more wiring than time-based.

### 3.7 Integration in `app/page.tsx`

- After lobby phase logic and where you set `showUI`:
  - Compute `showGuidedTour = isDone && !sessionStorage.getItem(TOUR_STORAGE_KEY)`.
  - For **first load** that just finished lobby, `isDone` is true and tour not seen, so `showGuidedTour === true`.
- Render:

```tsx
{showUI && (
  <GuidedTourHints
    active={showGuidedTour}
    onComplete={() => {
      if (typeof window !== "undefined")
        window.sessionStorage.setItem(TOUR_STORAGE_KEY, "1");
    }}
    mode="time"   // or "interaction"
    scrubYear={scrubYear}
    selectedMarkerId={selectedMarkerId}
    onScrubberInteraction={() => {}}
    onMarkerInteraction={() => {}}
  />
)}
```

- For interaction-driven mode, you’ll need to track “user has dragged scrubber” and “user has selected a marker” (e.g. refs or state) and pass them in so the tour can move from step 2 → 3 and 3 → complete.

### 3.8 Accessibility and mobile

- Use `aria-live="polite"` for the hint text so screen readers announce step changes.
- Keep hint text size readable (e.g. minimum 12px for “actual content” per audit).
- On small viewports, position hints so they don’t cover the scrubber or primary actions; prefer bottom-center or top for step 1, and near the controls for steps 2–3.

---

## 4. Recommended order of work

1. **Implement time-based 3-step tour**  
   - Add `TOUR_STORAGE_KEY`, `GuidedTourHints` component, and integration in `page.tsx`.  
   - No dependency on scrubber/marker events; quick to ship and matches CTO wording.

2. **Add step indicator (dots)**  
   - Gives a clear “1 of 3” progression and makes the intro feel more like a short guided sequence.

3. **Optional: interaction-driven mode**  
   - Add `mode="interaction"` and wire scrubber/marker events so step 2 and 3 advance on user action.  
   - Keeps “gamified” feel without adding a literal scroll (which doesn’t fit a full-screen globe app).

4. **Optional: “Replay tour”**  
   - In Layers panel or a small “?” or “Tour” link, clear `TOUR_STORAGE_KEY` and set a “replay tour” state so the same 3 steps run again without replaying the full lobby.

---

## 5. What we are *not* adding (and why)

- **Vertical scroll-through intro**  
  The app is a full-screen globe; a scroll-based intro would conflict with the current layout and with the CTO’s “inline tooltip-style hints.” A 3-step overlay with fixed positioning is a better fit.

- **Mandatory interaction to finish lobby**  
  Lobby stays time-based (with Skip). The **tour** is the right place for optional interaction-driven steps after the user is already on the main screen.

---

## 6. File checklist

| `app/page.tsx` | Add `TOUR_STORAGE_KEY`, `showGuidedTour` derived state, render `GuidedTourHints` when `showUI && showGuidedTour`. Track `hasUserDraggedGlobe`, `hasUserMovedScrubber`; pass `onUserInteract` to Globe. | ✅ Done |
| `components/UI/GuidedTourHints.tsx` | New: 3 steps, tooltip-style message, step dots, interaction-driven logic (globe drag / scrubber / marker), 15s timeout per step, `onComplete`. | ✅ Done |
| `components/Globe/Globe.tsx` | Optional callback `onUserInteract` for OrbitControls onStart (guided tour step 1). | ✅ Done |

---

*First-Time User Welcome — Review & Implementation Plan · March 2026*
