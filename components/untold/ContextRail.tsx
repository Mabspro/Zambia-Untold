"use client";

import type { EntryRoute } from "@/lib/untold/entry-routes";
import { getModeDescription, getModeLabel, type UntoldMode } from "@/lib/untold/ui-mode";

type ContextRailProps = {
  mode: UntoldMode;
  preferredRoute: EntryRoute;
  onSelectRoute: (route: EntryRoute) => void;
};

const NEXT_ROUTE_LABELS: Record<EntryRoute, string> = {
  "deep-time": "Start with Deep Time",
  "live-zambia": "View Live Zambia",
  archive: "Enter the Archive",
};

export function ContextRail({
  mode,
  preferredRoute,
  onSelectRoute,
}: ContextRailProps) {
  return (
    <aside className="pointer-events-auto absolute right-4 top-[6.5rem] z-20 hidden w-[min(360px,32vw)] overflow-hidden border border-copper/35 bg-[linear-gradient(135deg,rgba(184,115,51,0.12)_0%,rgba(12,18,24,0.92)_36%,rgba(21,72,52,0.22)_100%)] px-4 py-4 shadow-[0_0_24px_rgba(184,115,51,0.12)] backdrop-blur-md md:block">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-copper via-[#d6a24a] to-[#2d8a57]" />
      <p className="font-display text-[12px] uppercase tracking-[0.18em] text-[#f0bf72]">
        {getModeLabel(mode)}
      </p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[#f3e5cf]">
        {getModeDescription(mode)}
      </p>
      <button
        type="button"
        onClick={() => onSelectRoute(preferredRoute)}
        className="mt-4 min-h-11 rounded border border-copper/45 bg-[rgba(184,115,51,0.08)] px-3.5 py-2 text-[12px] uppercase tracking-[0.14em] text-[#f0bf72] transition-colors hover:border-[#d6a24a] hover:bg-[rgba(184,115,51,0.14)]"
      >
        {NEXT_ROUTE_LABELS[preferredRoute]}
      </button>
    </aside>
  );
}
