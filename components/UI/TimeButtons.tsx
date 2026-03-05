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
};

export function TimeButtons({ year, onYearChange }: TimeButtonsProps) {
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
    <div className="pointer-events-auto flex w-full max-w-[92vw] items-center justify-center gap-2 rounded border border-copper/25 bg-bg/70 px-3 py-2 backdrop-blur-sm md:w-auto md:max-w-none">
      {/* Prev era */}
      <button
        type="button"
        onClick={goPrev}
        disabled={!hasPrev}
        className={`text-sm transition-colors ${
          hasPrev
            ? "text-copperSoft hover:text-copper"
            : "text-muted/30 cursor-default"
        }`}
        aria-label="Previous era"
      >
        ◂
      </button>

      {/* Current era + year */}
      <div className="flex flex-col items-center min-w-0">
        <p className="text-[10px] uppercase tracking-[0.16em] text-copper truncate md:text-[11px]">
          {formatZoneForDisplay(currentZone)}
        </p>
        <p className="font-mono text-[9px] text-muted/70">
          {formatDeepTimeLabel(year)}
        </p>
      </div>

      {/* Next era */}
      <button
        type="button"
        onClick={goNext}
        disabled={!hasNext}
        className={`text-sm transition-colors ${
          hasNext
            ? "text-copperSoft hover:text-copper"
            : "text-muted/30 cursor-default"
        }`}
        aria-label="Next era"
      >
        ▸
      </button>
    </div>
  );
}
