/**
 * Epoch palette system — globe tint by scrubber year.
 * Reference: MUSEUM_ENHANCEMENT_PLAN.md Appendix A.
 */

export type EpochPalette = {
  /** Hex color for overlay tint */
  color: string;
  /** Overlay opacity 0–1 */
  opacity: number;
};

/**
 * Get globe tint for a given year.
 *
 * Design intent: the overlay should ACCENT, not OBSCURE.
 * The earth texture is the primary visual — overlays are a subtle
 * narrative signal. Keep all opacities low so the texture stays readable,
 * especially as data layers (boundaries, particles, routes) are added.
 *
 * Colonial = cool gray-blue. 1964+ = copper return. Present = clear.
 */
export function getEpochPalette(year: number): EpochPalette {
  // Pre-human / X-ray mode: no overlay (X-ray shader takes over)
  if (year < -10000) {
    return { color: "#ffffff", opacity: 0 };
  }
  // Ancient: very faint warm-earth tint
  if (year < 1000) {
    return { color: "#c4956a", opacity: 0.03 };
  }
  // Kingdom Age: barely-there amber
  if (year < 1600) {
    return { color: "#d4a84a", opacity: 0.04 };
  }
  // Pre-colonial: subtle green-earth
  if (year < 1890) {
    return { color: "#5a7a4a", opacity: 0.03 };
  }
  // Colonial Wound: cool blue-gray — the one intentionally distinctive tint
  if (year < 1964) {
    return { color: "#3a4a5c", opacity: 0.08 };
  }
  // Post-independence → present: copper whisper only; clear at 2020+
  if (year < 2020) {
    return { color: "#c8851a", opacity: 0.025 };
  }
  // 2020 AD → present: no overlay — let the globe show clean for layers
  return { color: "#c8851a", opacity: 0 };
}
