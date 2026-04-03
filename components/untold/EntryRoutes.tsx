"use client";

import type { EntryRoute, EntryRouteItem } from "@/lib/untold/entry-routes";

type EntryRoutesProps = {
  items: EntryRouteItem[];
  activeRoute: EntryRoute;
  lastEntryRoute?: EntryRoute;
  onSelect: (route: EntryRoute) => void;
};

export function EntryRoutes({
  items,
  activeRoute,
  lastEntryRoute,
  onSelect,
}: EntryRoutesProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-[12px] uppercase tracking-[0.2em] text-copper/80 md:text-[13px]">
          Start Here
        </p>
        {lastEntryRoute && (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted/70">
            Last route: {items.find((item) => item.id === lastEntryRoute)?.label ?? "Deep Time"}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        {items.map((item) => {
          const active = activeRoute === item.id;
          const returning = lastEntryRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`min-h-14 rounded border px-3.5 py-3 text-left transition-colors ${
                active
                  ? "border-copper/45 bg-copper/12"
                  : "border-copper/20 bg-bg/35 hover:border-copper/35 hover:bg-copper/8"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] uppercase tracking-[0.14em] text-copperSoft md:text-[13px]">
                  {item.label}
                </p>
                {returning && (
                  <span className="rounded border border-copper/25 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-copper/80">
                    Continue
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted/80 md:text-[13px]">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
