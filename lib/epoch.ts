/**
 * epoch.ts — marker-activation helper.
 *
 * HISTORY:
 *   Sprint 1–2: This file provided the full timeline mapping for the scrubber
 *   (asinh-scaled, -476K BC → 2026 AD).
 *
 * CURRENT STATE (post Sprint A1 / TD-01 cleanup March 2026):
 *   The scrubber and deep-time axis have moved entirely to lib/deepTime.ts,
 *   which uses an 8-zone segmented model (4.5B BC → 2026 AD).
 *
 *   Only `isMarkerActive` is actively consumed (by TimeScrubber + GlobeMarker).
 *   All deprecated asinh-scale exports removed as part of TD-01 cleanup.
 */

import { yearToScrubberPosition } from "./deepTime";

// ---------------------------------------------------------------------------
// ACTIVE EXPORT — used by TimeScrubber.tsx and GlobeMarker.tsx
// ---------------------------------------------------------------------------

/**
 * Returns true when the marker's epoch is visually close to the scrubber year.
 * Comparison is in normalised scrubber-position space (0-100) to handle the
 * non-linear segmented axis correctly.
 */
export function isMarkerActive(markerEpoch: number, scrubYear: number): boolean {
  const markerNorm = yearToScrubberPosition(markerEpoch);
  const scrubNorm = yearToScrubberPosition(scrubYear);
  return Math.abs(markerNorm - scrubNorm) <= 1.5; // ~1.5% of track width
}
