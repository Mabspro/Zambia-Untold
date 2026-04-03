"use client";

import { useEffect, useState, type ReactNode } from "react";
import { EntryRoutes } from "@/components/untold/EntryRoutes";
import { ProgressPassport } from "@/components/untold/ProgressPassport";
import { WhyThisSignal } from "@/components/untold/WhyThisSignal";
import { ENTRY_ROUTE_ITEMS, type EntryRoute } from "@/lib/untold/entry-routes";
import type { UntoldMode } from "@/lib/untold/ui-mode";

type HeroIntroCardProps = {
  mode: UntoldMode;
  activeRoute: EntryRoute;
  lastEntryRoute?: EntryRoute;
  visitedGalleries: number;
  totalGalleries: number;
  lastViewedLiveStateAt?: string;
  archiveUnlocked: boolean;
  showReplay: boolean;
  showWhyThisSignal: boolean;
  condensed?: boolean;
  onEntryRouteSelect: (route: EntryRoute) => void;
  onReplayIntro: () => void;
  onToggleWhyThisSignal: () => void;
  onShowRoutes?: () => void;
  onHideRoutes?: () => void;
  onReturnToLanding?: () => void;
  onEnterArchive?: () => void;
  timeControls: ReactNode;
};

export function HeroIntroCard({
  mode,
  activeRoute,
  lastEntryRoute,
  visitedGalleries,
  totalGalleries,
  lastViewedLiveStateAt,
  archiveUnlocked,
  showReplay,
  showWhyThisSignal,
  condensed = false,
  onEntryRouteSelect,
  onReplayIntro,
  onToggleWhyThisSignal,
  onShowRoutes,
  onHideRoutes,
  onReturnToLanding,
  onEnterArchive,
  timeControls,
}: HeroIntroCardProps) {
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    if (mode === "living") {
      setShowOverview(true);
      return;
    }
    setShowOverview(false);
  }, [mode]);

  if (condensed && mode === "living") {
    return (
      <div className="museum-card pointer-events-auto w-full max-w-[min(94vw,430px)] overflow-hidden rounded border border-copper/25 bg-bg/72 backdrop-blur-sm md:w-auto md:max-w-none">
        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[1.15rem] uppercase tracking-[0.18em] text-copper md:text-[1.3rem]">
                Zambia Untold
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-copperSoft/85 md:text-[12px]">
                Live Zambia Active
              </p>
            </div>
            <span className="rounded border border-[#76d7ff]/35 bg-[#76d7ff]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#bceeff] md:text-[11px]">
              Satellites On
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[#d8c9b4] md:text-[14px]">
            You are inside the observatory now. Live satellite tracks are already enabled over Zambia.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onShowRoutes}
              className="min-h-10 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/45 hover:text-copper"
            >
              Show routes
            </button>
            <button
              type="button"
              onClick={onReturnToLanding}
              className="min-h-10 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/45 hover:text-copper"
            >
              Return to landing
            </button>
            <button
              type="button"
              onClick={onEnterArchive}
              className="min-h-10 rounded border border-copper/35 bg-copper/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copper transition-colors hover:border-copper hover:bg-copper/15"
            >
              Enter archive
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="museum-card pointer-events-auto w-full max-w-[min(94vw,460px)] overflow-hidden rounded border border-copper/25 bg-bg/70 backdrop-blur-sm md:w-auto md:max-w-none">
      <div className="sticky top-0 z-10 border-b border-copper/16 bg-[linear-gradient(180deg,rgba(10,8,6,0.96)_0%,rgba(10,8,6,0.94)_100%)] px-5 py-4 text-center backdrop-blur-md md:static md:border-b-0 md:bg-transparent md:text-left md:backdrop-blur-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[1.75rem] tracking-[0.2em] text-copper md:text-[2.15rem] lg:text-[2.45rem]">
              ZAMBIA UNTOLD
            </p>
          </div>
          {mode === "living" && onHideRoutes && (
            <button
              type="button"
              onClick={onHideRoutes}
              className="min-h-10 shrink-0 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/40 hover:text-copper"
            >
              Hide routes
            </button>
          )}
        </div>
        {mode === "living" && onReturnToLanding && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onReturnToLanding}
              className="block min-h-10 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/40 hover:text-copper"
            >
              Return to landing
            </button>
          </div>
        )}
        <p className="mt-1.5 text-[12px] uppercase tracking-[0.22em] text-muted md:text-[13px] lg:text-[14px]">
          The history you were never taught
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[#d8c9b4] md:text-[14px]">
          Explore Zambia through deep history, living systems, and cultural memory.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70 md:text-[12px]">
          Stored locally · No external tracking
        </p>
        {showReplay && (
          <button
            type="button"
            onClick={onReplayIntro}
            className="mt-3 block min-h-11 w-full rounded border border-copper/20 bg-transparent px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-copper/75 transition-colors hover:border-copper/40 hover:text-copper/90"
          >
            Play intro
          </button>
        )}
      </div>

      <div className="px-4 py-4 md:border-t md:border-copper/20">
        <EntryRoutes
          items={ENTRY_ROUTE_ITEMS}
          activeRoute={activeRoute}
          lastEntryRoute={lastEntryRoute}
          onSelect={onEntryRouteSelect}
          supplementalLinks={[
            {
              id: "discover-zambia",
              label: "Discover Zambia",
              description: "Open the curated places route: falls, wetlands, caves, ceremonies, and landmarks.",
              href: "/discover",
            },
            {
              id: "future-zambia",
              label: "Future Zambia",
              description: "Preview the technology layer: sovereign compute, native data, and local AI possibility.",
              href: "/future",
            },
          ]}
        />
      </div>

      <div className="border-t border-copper/20 px-4 py-3">
        <button
          type="button"
          onClick={() => setShowOverview((prev) => !prev)}
          className="flex min-h-10 w-full items-center justify-between rounded border border-copper/15 bg-bg/30 px-3 py-2 text-left transition-colors hover:border-copper/30 hover:bg-copper/6"
        >
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-copperSoft/85">
            {showOverview ? "Hide Overview" : "Show Overview"}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/75">
            {showOverview ? "Collapse" : "Expand"}
          </span>
        </button>
      </div>

      {showOverview && (
        <div className="border-t border-copper/20 px-4 py-4">
          <ProgressPassport
            mode={mode}
            visitedGalleries={visitedGalleries}
            totalGalleries={totalGalleries}
            lastViewedLiveStateAt={lastViewedLiveStateAt}
            archiveUnlocked={archiveUnlocked}
          />
        </div>
      )}

      {showOverview && mode === "living" && (
        <div className="border-t border-copper/20 px-4 py-4">
          <WhyThisSignal open={showWhyThisSignal} onToggle={onToggleWhyThisSignal} />
        </div>
      )}

      {showOverview && (
        <div className="border-t border-copper/20 px-4 py-3">
          {timeControls}
        </div>
      )}
    </div>
  );
}
