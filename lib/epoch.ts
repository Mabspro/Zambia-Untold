/**
 * epoch.ts — marker-activation helper.
 *
 * HISTORY:
 *   Sprint 1–2: This file provided the full timeline mapping for the scrubber
 *   (asinh-scaled, -476K BC → 2026 AD).
 *
 * CURRENT STATE (post Sprint A1):
 *   The scrubber and deep-time axis have moved entirely to lib/deepTime.ts,
 *   which uses an 8-zone segmented model (4.5B BC → 2026 AD).
 *
 *   Only `isMarkerActive` is actively consumed (by TimeScrubber + GlobeMarker).
 *   It has been updated to delegate to yearToScrubberPosition from deepTime.ts
 *   so it is consistent with the new axis model.
 *
 *   All other exports below are DEPRECATED and unused by the current codebase.
 *   They are retained for one sprint to avoid any accidental external references,
 *   then should be removed entirely.
 *
 * TODO (next cleanup pass): delete EPOCH_MIN, EPOCH_MAX, SCALE, yearToNormalized,
 *   normalizedToYear, yearToSlider, sliderToYear, formatEpochLabel,
 *   markerPositionOnTrack, and the minMapped/maxMapped constants.
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

// ---------------------------------------------------------------------------
// DEPRECATED — old asinh-scale model, Sprint 1–2. NOT used by any component.
// Remove in next cleanup pass.
// ---------------------------------------------------------------------------

/** @deprecated Use DEEP_TIME_MIN / DEEP_TIME_MAX from lib/deepTime.ts */
export const EPOCH_MIN = -476000;
/** @deprecated Use DEEP_TIME_MIN / DEEP_TIME_MAX from lib/deepTime.ts */
export const EPOCH_MAX = 2026;

/** @deprecated Internal to old asinh model. */
const SCALE = 12000;
/** @deprecated Internal to old asinh model. */
const _minMapped = Math.asinh(EPOCH_MIN / SCALE);
/** @deprecated Internal to old asinh model. */
const _maxMapped = Math.asinh(EPOCH_MAX / SCALE);
/** @deprecated Internal to old asinh model. */
const _mappedRange = _maxMapped - _minMapped;

/** @deprecated Old asinh-scale normalizer. Use yearToScrubberPosition from deepTime.ts. */
export function yearToNormalized(year: number): number {
  const mapped = Math.asinh(year / SCALE);
  return (mapped - _minMapped) / _mappedRange;
}

/** @deprecated Old asinh-scale inverse. Use scrubberPositionToYear from deepTime.ts. */
export function normalizedToYear(normalized: number): number {
  const mapped = _minMapped + normalized * _mappedRange;
  return Math.round(Math.sinh(mapped) * SCALE);
}

/** @deprecated Old slider helper. No longer used by TimeScrubber. */
export function yearToSlider(year: number, sliderMax = 1000): number {
  return Math.round(yearToNormalized(year) * sliderMax);
}

/** @deprecated Old slider helper. No longer used by TimeScrubber. */
export function sliderToYear(slider: number, sliderMax = 1000): number {
  return normalizedToYear(slider / sliderMax);
}

/** @deprecated Use formatDeepTimeLabel / formatScrubberLabel from deepTime.ts. */
export function formatEpochLabel(year: number): string {
  if (year < 0) {
    return `${Math.abs(Math.round(year)).toLocaleString()} BC`;
  }
  return `${Math.round(year).toLocaleString()} AD`;
}

/** @deprecated No longer used. Marker track position now comes from yearToScrubberPosition. */
export function markerPositionOnTrack(marker: { epoch: number }): number {
  return yearToNormalized(marker.epoch) * 100;
}
