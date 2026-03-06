"use client";

/**
 * StoryCompass — persistent "You Are Here" context indicator.
 *
 * Anchors the visitor in the four-layer experience without over-explaining.
 * Designed to be a whisper, not a headline — museum corner label aesthetic.
 * Low contrast, peripheral, always accurate.
 *
 * Sprint C0 · March 2026
 */

import { useMemo } from "react";
import {
  getZoneForYear,
  formatDeepTimeLabel,
  type DeepTimeZone,
} from "@/lib/deepTime";
import type { Marker } from "@/data/markers";

type StoryCompassProps = {
  scrubYear: number;
  selectedMarker: Marker | null;
  activePanel: string | null;
};

const LAYER_LABELS: Record<string, string> = {
  deepTime: "🪨 Deep Time",
  calendar: "📅 Living Calendar",
  folkTales: "🔥 Oral Tradition · Inganji",
  villageSearch: "📍 Geographic Search",
  contribute: "✦ Community Archive · Isibalo",
};

const ZONE_LABELS: Record<DeepTimeZone, string> = {
  "DEEP EARTH": "Deep Earth",
  "ANCIENT LIFE": "Ancient Life",
  "HOMINID RISE": "Hominid Rise",
  "ZAMBIA DEEP": "Zambia Deep",
  "COPPER EMPIRE": "Copper Empire",
  "KINGDOM AGE": "Kingdom Age",
  "COLONIAL WOUND": "Colonial Wound",
  "UNFINISHED SOVEREIGN": "Unfinished Sovereign",
};

export function StoryCompass({
  scrubYear,
  selectedMarker,
  activePanel,
}: StoryCompassProps) {
  const label = useMemo(() => {
    // Active overlay panel takes priority
    if (activePanel && LAYER_LABELS[activePanel]) {
      return LAYER_LABELS[activePanel];
    }
    // Selected marker
    if (selectedMarker) {
      return `${selectedMarker.tag} · ${selectedMarker.epochLabel}`;
    }
    // Default: Deep Time zone + formatted year
    const zone = getZoneForYear(scrubYear);
    const timeLabel = formatDeepTimeLabel(scrubYear);
    return `${ZONE_LABELS[zone]} · ${timeLabel}`;
  }, [scrubYear, selectedMarker, activePanel]);

  return (
    // Positioned below the header on desktop, above the action bar on mobile.
    // text-muted/50 = half opacity of the muted token — a whisper.
    <div
      className="pointer-events-none fixed bottom-[4.5rem] left-1/2 z-20 w-[min(92vw,460px)] -translate-x-1/2 px-2 md:bottom-auto md:top-7 md:left-auto md:right-5 md:w-[min(42vw,460px)] md:translate-x-0 md:px-0"
      aria-live="polite"
      aria-label="Current exhibit context"
    >
      <p className="block truncate text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted/50 md:text-right">
        {label}
      </p>
    </div>
  );
}

