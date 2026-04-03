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

  const modeChrome: Record<UntoldMode, { border: string; bg: string; title: string; body: string; badge: string; badgeText: string; accentLabel: string }> = {
    "deep-time": {
      border: "border-copper/25",
      bg: "bg-bg/72",
      title: "text-copper",
      body: "text-[#d8c9b4]",
      badge: "border-copper/30 bg-copper/10",
      badgeText: "text-copperSoft",
      accentLabel: "Deep Time Active",
    },
    historical: {
      border: "border-[#d6a24a]/28",
      bg: "bg-[#120d08]/78",
      title: "text-[#f0bf72]",
      body: "text-[#e2d1bc]",
      badge: "border-[#d6a24a]/28 bg-[#d6a24a]/10",
      badgeText: "text-[#f0d19a]",
      accentLabel: "Historical Zambia",
    },
    living: {
      border: "border-[#76d7ff]/28",
      bg: "bg-[#07121a]/82",
      title: "text-[#c4f2ff]",
      body: "text-[#d4eaf2]",
      badge: "border-[#76d7ff]/35 bg-[#76d7ff]/10",
      badgeText: "text-[#bceeff]",
      accentLabel: "Live Zambia Active",
    },
    archive: {
      border: "border-[#6fd39c]/26",
      bg: "bg-[#07110b]/82",
      title: "text-[#d6f7e4]",
      body: "text-[#d7e7dd]",
      badge: "border-[#6fd39c]/28 bg-[#6fd39c]/10",
      badgeText: "text-[#aee8c7]",
      accentLabel: "Archive Mode",
    },
    future: {
      border: "border-[#9dd7ff]/24",
      bg: "bg-[#081018]/82",
      title: "text-[#d3efff]",
      body: "text-[#d5e4ef]",
      badge: "border-[#9dd7ff]/24 bg-[#9dd7ff]/10",
      badgeText: "text-[#bfe8ff]",
      accentLabel: "Future Zambia",
    },
  };
  const chrome = modeChrome[mode];

  useEffect(() => {
    if (mode === "living") {
      setShowOverview(true);
      return;
    }
    setShowOverview(false);
  }, [mode]);

  if (condensed) {
    return (
      <div className={`museum-card pointer-events-auto w-full max-w-[min(94vw,430px)] overflow-hidden rounded border backdrop-blur-sm md:w-auto md:max-w-none ${chrome.border} ${chrome.bg}`}>
        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`font-display text-[1.15rem] uppercase tracking-[0.18em] md:text-[1.3rem] ${chrome.title}`}>
                Zambia Untold
              </p>
              <p className={`mt-1 text-[11px] uppercase tracking-[0.18em] md:text-[12px] ${chrome.badgeText}`}>
                {chrome.accentLabel}
              </p>
            </div>
            <span className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] md:text-[11px] ${chrome.badge} ${chrome.badgeText}`}>
              {mode === "living" ? "Present Lens" : mode === "deep-time" ? "Substrate Lens" : "Mode Active"}
            </span>
          </div>
          <p className={`mt-2 text-[13px] leading-relaxed md:text-[14px] ${chrome.body}`}>
            {mode === "living"
              ? "Live Zambia is active. The globe is primary now, and live systems stay in view."
              : mode === "deep-time"
                ? "Deep Time is active. The globe is primary now, and the substrate journey stays in view."
                : "This route is active. The globe is primary now, and the route menu can reopen anytime."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onShowRoutes}
              className="min-h-10 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/45 hover:text-copper"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={onReturnToLanding}
              className="min-h-10 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/45 hover:text-copper"
            >
              Return to landing
            </button>
            {onEnterArchive && (
              <button
                type="button"
                onClick={onEnterArchive}
                className="min-h-10 rounded border border-copper/35 bg-copper/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copper transition-colors hover:border-copper hover:bg-copper/15"
              >
                Enter archive
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="museum-card pointer-events-auto flex max-h-full w-full max-w-[min(94vw,460px)] flex-col overflow-hidden rounded border border-copper/25 bg-bg/70 backdrop-blur-sm md:block md:w-auto md:max-w-none">
      <div className="shrink-0 border-b border-copper/16 bg-[linear-gradient(180deg,rgba(10,8,6,0.96)_0%,rgba(10,8,6,0.94)_100%)] px-5 py-4 text-center backdrop-blur-md md:border-b-0 md:bg-transparent md:text-left md:backdrop-blur-0">
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

      <div className="min-h-0 overflow-y-auto overscroll-contain scrollbar-thin md:overflow-visible">
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
    </div>
  );
}
