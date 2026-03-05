"use client";

import { MARKERS } from "@/data/markers";
import {
  scrubberPositionToYear,
  yearToScrubberPosition,
  formatScrubberLabel,
} from "@/lib/deepTime";
import { isMarkerActive } from "@/lib/epoch";
import { EpochLabel } from "./EpochLabel";

const SLIDER_MAX = 1000;

type TimeScrubberProps = {
  year: number;
  onYearChange: (year: number) => void;
  onMarkerClick: (id: string) => void;
};

function yearToSlider(year: number): number {
  return Math.round(yearToScrubberPosition(year) * (SLIDER_MAX / 100));
}

function sliderToYear(slider: number): number {
  const percent = (slider / SLIDER_MAX) * 100;
  return scrubberPositionToYear(percent);
}

export function TimeScrubber({
  year,
  onYearChange,
  onMarkerClick,
}: TimeScrubberProps) {
  const positionPercent = yearToScrubberPosition(year);
  const sliderValue = yearToSlider(year);

  return (
    <div className="pointer-events-auto relative w-full max-w-5xl overflow-visible rounded-xl border border-copper/30 bg-bg/90 px-4 pt-14 pb-5 shadow-[0_0_30px_rgba(184,115,51,0.15)] backdrop-blur-xl md:px-6">
      <div className="relative mb-6 flex h-4 items-center">
        <EpochLabel
          label={formatScrubberLabel(year)}
          leftPercent={positionPercent}
        />
        {/* Core track line */}
        <div className="absolute left-0 right-0 h-[2px] rounded bg-zinc-800" />
        {/* Glowing active progress line */}
        <div 
          className="absolute left-0 h-[2px] rounded bg-gradient-to-r from-copper/20 to-copperSoft shadow-[0_0_10px_#B87333]"
          style={{ width: `${positionPercent}%` }}
        />

        <input
          type="range"
          min={0}
          max={SLIDER_MAX}
          value={sliderValue}
          onChange={(event) =>
            onYearChange(sliderToYear(Number(event.target.value)))
          }
          className="time-slider absolute inset-0 w-full cursor-col-resize appearance-none bg-transparent opacity-0 z-10"
          aria-label="Deep time timeline scrubber"
        />

        {/* The active draggable 'thumb' UI overlaid */}
        <div 
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 rounded-full border border-copper bg-panel shadow-[0_0_15px_rgba(200,133,26,0.6)] flex items-center justify-center transition-transform"
          style={{ left: `${positionPercent}%` }}
        >
          <div className="h-2 w-2 rounded-full bg-copperSoft" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {MARKERS.map((marker) => {
            const active = isMarkerActive(marker.epoch, year);
            return (
              <button
                key={marker.id}
                type="button"
                aria-label={`Jump to ${marker.headline}`}
                onClick={() => onMarkerClick(marker.id)}
                className="pointer-events-auto absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out hover:scale-150"
                style={{
                  left: `${yearToScrubberPosition(marker.epoch)}%`,
                  backgroundColor: marker.color,
                  opacity: active ? 1 : 0.4,
                  boxShadow: active
                    ? `0 0 16px ${marker.color}, 0 0 4px ${marker.color}`
                    : "none",
                  transform: `translate(-50%, -50%) scale(${active ? 1.4 : 1})`,
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="font-mono flex justify-between pt-1 text-[10px] uppercase tracking-[0.2em] text-muted/90 md:text-[11px]">
        <span>4.5B BC</span>
        <span>2026 AD</span>
      </div>
    </div>
  );
}
