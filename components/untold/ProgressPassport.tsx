"use client";

import { formatDistanceToNowLabel } from "@/components/untold/timeUtils";
import type { UntoldMode } from "@/lib/untold/ui-mode";

type ProgressPassportProps = {
  mode: UntoldMode;
  visitedGalleries: number;
  totalGalleries: number;
  lastViewedLiveStateAt?: string;
  archiveUnlocked: boolean;
};

type ProgressItem = {
  id: string;
  label: string;
  value: string;
  active: boolean;
};

export function ProgressPassport({
  mode,
  visitedGalleries,
  totalGalleries,
  lastViewedLiveStateAt,
  archiveUnlocked,
}: ProgressPassportProps) {
  const items: ProgressItem[] = [
    {
      id: "history",
      label: "Historical Explorer",
      value: `${visitedGalleries} of ${totalGalleries} galleries`,
      active: mode === "deep-time" || mode === "historical",
    },
    {
      id: "live",
      label: "Live Zambia",
      value: lastViewedLiveStateAt
        ? `Last checked ${formatDistanceToNowLabel(lastViewedLiveStateAt)}`
        : "Not opened yet",
      active: mode === "living",
    },
    {
      id: "archive",
      label: "Archive Path",
      value: archiveUnlocked ? "Mission pathway unlocked" : "Unlock by exploring the museum",
      active: mode === "archive",
    },
  ];

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded border px-3 py-2.5 ${
            item.active ? "border-copper/35 bg-copper/8" : "border-copper/12 bg-bg/35"
          }`}
        >
          <p className="font-display text-[11px] uppercase tracking-[0.16em] text-copper/75 md:text-[12px]">
            {item.label}
          </p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted/85 md:text-[12px]">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
