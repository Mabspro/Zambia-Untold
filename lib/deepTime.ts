/**
 * Deep Time axis — segmented scrubber mapping 4.5B BC → 2026 AD.
 * Each zone gets proportional scrubber space regardless of real-time duration.
 * Reference: MUSEUM_ENHANCEMENT_PLAN.md Part 2.5, Appendix D.
 */

export const DEEP_TIME_MIN = -4_500_000_000; // 4.5B BC
export const DEEP_TIME_MAX = 2026;

export type DeepTimeZone =
  | "DEEP EARTH"
  | "ANCIENT LIFE"
  | "HOMINID RISE"
  | "ZAMBIA DEEP"
  | "COPPER EMPIRE"
  | "KINGDOM AGE"
  | "COLONIAL WOUND"
  | "UNFINISHED SOVEREIGN";

type ZoneBoundary = {
  zone: DeepTimeZone;
  startYear: number;
  endYear: number;
  scrubberStart: number; // 0-100
  scrubberEnd: number;   // 0-100
};

const ZONES: ZoneBoundary[] = [
  { zone: "DEEP EARTH", startYear: -4_500_000_000, endYear: -540_000_000, scrubberStart: 0, scrubberEnd: 12 },
  { zone: "ANCIENT LIFE", startYear: -540_000_000, endYear: -5_000_000, scrubberStart: 12, scrubberEnd: 25 },
  { zone: "HOMINID RISE", startYear: -5_000_000, endYear: -476_000, scrubberStart: 25, scrubberEnd: 35 },
  { zone: "ZAMBIA DEEP", startYear: -476_000, endYear: 1000, scrubberStart: 35, scrubberEnd: 55 },
  { zone: "COPPER EMPIRE", startYear: 1000, endYear: 1600, scrubberStart: 55, scrubberEnd: 65 },
  { zone: "KINGDOM AGE", startYear: 1600, endYear: 1890, scrubberStart: 65, scrubberEnd: 75 },
  { zone: "COLONIAL WOUND", startYear: 1890, endYear: 1964, scrubberStart: 75, scrubberEnd: 90 },
  { zone: "UNFINISHED SOVEREIGN", startYear: 1964, endYear: 2026, scrubberStart: 90, scrubberEnd: 100 },
];

/**
 * Map scrubber position (0-100) to year.
 */
export function scrubberPositionToYear(percent: number): number {
  const p = Math.max(0, Math.min(100, percent));
  for (const z of ZONES) {
    if (p >= z.scrubberStart && p <= z.scrubberEnd) {
      const t = (p - z.scrubberStart) / (z.scrubberEnd - z.scrubberStart);
      return Math.round(z.startYear + t * (z.endYear - z.startYear));
    }
  }
  return DEEP_TIME_MAX;
}

/**
 * Map year to scrubber position (0-100).
 */
export function yearToScrubberPosition(year: number): number {
  const y = Math.max(DEEP_TIME_MIN, Math.min(DEEP_TIME_MAX, year));
  for (const z of ZONES) {
    if (y >= z.startYear && y <= z.endYear) {
      const t = (y - z.startYear) / (z.endYear - z.startYear);
      return z.scrubberStart + t * (z.scrubberEnd - z.scrubberStart);
    }
  }
  return 100;
}

/**
 * Human-readable zone label for UI (e.g. "the Copper Empire").
 */
export function formatZoneForDisplay(zone: DeepTimeZone): string {
  const labels: Record<DeepTimeZone, string> = {
    "DEEP EARTH": "Deep Earth",
    "ANCIENT LIFE": "Ancient Life",
    "HOMINID RISE": "Hominid Rise",
    "ZAMBIA DEEP": "Zambia Deep",
    "COPPER EMPIRE": "the Copper Empire",
    "KINGDOM AGE": "the Kingdom Age",
    "COLONIAL WOUND": "the Colonial Wound",
    "UNFINISHED SOVEREIGN": "the Unfinished Sovereign",
  };
  return labels[zone] ?? zone;
}

/**
 * Zone list for navigation (e.g. epoch buttons).
 */
export function getZonesForNavigation(): { zone: DeepTimeZone; startYear: number }[] {
  return ZONES.map((z) => ({ zone: z.zone, startYear: z.startYear }));
}

/**
 * Get zone name for a given year.
 */
export function getZoneForYear(year: number): DeepTimeZone {
  const y = Math.max(DEEP_TIME_MIN, Math.min(DEEP_TIME_MAX, year));
  for (const z of ZONES) {
    if (y >= z.startYear && y <= z.endYear) return z.zone;
  }
  return "UNFINISHED SOVEREIGN";
}

/**
 * Format year for display in geological epochs (e.g. "4.5B BC", "90M BC").
 */
export function formatDeepTimeLabel(year: number): string {
  if (year >= 0) {
    return `${Math.round(year).toLocaleString()} AD`;
  }
  const abs = Math.abs(year);
  if (abs >= 1_000_000_000) {
    return `${(abs / 1_000_000_000).toFixed(1)}B BC`;
  }
  if (abs >= 1_000_000) {
    return `${Math.round(abs / 1_000_000)}M BC`;
  }
  if (abs >= 1_000) {
    return `${Math.round(abs / 1_000)}K BC`;
  }
  return `${Math.round(abs).toLocaleString()} BC`;
}

/**
 * Combined label for scrubber: zone + year (e.g. "ANCIENT LIFE · 90M BC").
 */
export function formatScrubberLabel(year: number): string {
  const zone = getZoneForYear(year);
  const timeLabel = formatDeepTimeLabel(year);
  const geologicalZones: DeepTimeZone[] = ["DEEP EARTH", "ANCIENT LIFE", "HOMINID RISE"];
  if (geologicalZones.includes(zone)) {
    return `${zone} · ${timeLabel}`;
  }
  return timeLabel;
}
