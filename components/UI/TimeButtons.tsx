"use client";

import {
  getZonesForNavigation,
  getZoneForYear,
  formatZoneForDisplay,
  formatDeepTimeLabel,
} from "@/lib/deepTime";

type TimeButtonsProps = {
  year: number;
  onYearChange: (year: number) => void;
  /** When true, no border/background (e.g. inside header card). */
  embedded?: boolean;
};

export function TimeButtons({ year, onYearChange, embedded }: TimeButtonsProps) {
  const zones = getZonesForNavigation();
  const currentZone = getZoneForYear(year);
  const currentIndex = zones.findIndex((z) => z.zone === currentZone);

  const goPrev = () => {
    if (currentIndex > 0) {
      onYearChange(zones[currentIndex - 1].startYear);
    }
  };

  const goNext = () => {
    if (currentIndex < zones.length - 1) {
      onYearChange(zones[currentIndex + 1].startYear);
    }
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < zones.length - 1;

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-[92vw] items-center justify-center gap-2 rounded px-3 py-2 md:w-auto md:max-w-none md:py-2 ${
        embedded ? "border-0 bg-transparent backdrop-blur-none" : "border border-copper/25 bg-bg/70 backdrop-blur-sm"
      }`}
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={!hasPrev}
        className={`min-h-11 min-w-11 flex items-center justify-center text-sm transition-colors ${
          hasPrev
            ? "text-copperSoft hover:text-copper"
            : "text-muted/70 cursor-default"
        }`}
        aria-label="Previous era"
      >
        ◂
      </button>

      <div className="flex flex-col items-center min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-copper truncate md:text-[12px]">
          {formatZoneForDisplay(currentZone)}
        </p>
        <p className="font-mono text-[11px] text-muted/80">
          {formatDeepTimeLabel(year)}
        </p>
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!hasNext}
        className={`min-h-11 min-w-11 flex items-center justify-center text-sm transition-colors ${
          hasNext
            ? "text-copperSoft hover:text-copper"
            : "text-muted/70 cursor-default"
        }`}
        aria-label="Next era"
      >
        ▸
      </button>
    </div>
  );
}
