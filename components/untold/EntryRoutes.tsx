"use client";

import Link from "next/link";
import type { EntryRoute, EntryRouteItem } from "@/lib/untold/entry-routes";

type EntryRoutesLink = {
  id: string;
  label: string;
  description: string;
  href: string;
};

type EntryRoutesProps = {
  items: EntryRouteItem[];
  activeRoute: EntryRoute;
  lastEntryRoute?: EntryRoute;
  onSelect: (route: EntryRoute) => void;
  supplementalLinks?: EntryRoutesLink[];
};

export function EntryRoutes({
  items,
  activeRoute,
  lastEntryRoute,
  onSelect,
  supplementalLinks = [],
}: EntryRoutesProps) {
  const routeStyles: Record<EntryRoute, { active: string; idle: string; label: string; badge: string }> = {
    "deep-time": {
      active: "border-copper/45 bg-copper/12 shadow-[0_0_20px_rgba(184,115,51,0.08)]",
      idle: "border-copper/20 bg-bg/35 hover:border-copper/35 hover:bg-copper/8",
      label: "text-copperSoft",
      badge: "border-copper/25 text-copper/80",
    },
    "live-zambia": {
      active: "border-[#76d7ff]/45 bg-[#76d7ff]/[0.12] shadow-[0_0_22px_rgba(118,215,255,0.12)]",
      idle: "border-[#76d7ff]/20 bg-[#081118]/55 hover:border-[#76d7ff]/40 hover:bg-[#76d7ff]/[0.08]",
      label: "text-[#c4f2ff]",
      badge: "border-[#76d7ff]/25 text-[#9fe7ff]",
    },
    archive: {
      active: "border-[#6fd39c]/40 bg-[#6fd39c]/[0.11] shadow-[0_0_20px_rgba(111,211,156,0.1)]",
      idle: "border-[#6fd39c]/18 bg-[#07110b]/50 hover:border-[#6fd39c]/34 hover:bg-[#6fd39c]/[0.07]",
      label: "text-[#d6f7e4]",
      badge: "border-[#6fd39c]/22 text-[#aee8c7]",
    },
  };

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
          const style = routeStyles[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`min-h-14 rounded border px-3.5 py-3 text-left transition-colors ${
                active
                  ? style.active
                  : style.idle
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`text-[12px] uppercase tracking-[0.14em] md:text-[13px] ${style.label}`}>
                  {item.label}
                </p>
                {returning && (
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${style.badge}`}>
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
        {supplementalLinks.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block min-h-14 rounded border border-[#76d7ff]/25 bg-[#76d7ff]/[0.06] px-3.5 py-3 text-left transition-colors hover:border-[#76d7ff]/40 hover:bg-[#76d7ff]/[0.1]"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] uppercase tracking-[0.14em] text-[#c4f2ff] md:text-[13px]">
                {item.label}
              </p>
              <span className="rounded border border-[#76d7ff]/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#9fe7ff]">
                Route
              </span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#b7dce4] md:text-[13px]">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
