"use client";

import { useState } from "react";
export type { LayerVisibility } from "@/lib/types";
import type { LayerVisibility } from "@/lib/types";
import type { DeepTimeZone } from "@/lib/deepTime";

/** Era descriptions for hover previews */
const ERA_HINTS: Record<string, string> = {
  "DEEP TIME": "The substrate engine — 4.5 billion years of planetary memory",
  "DEEP EARTH": "Tectonic collision forged the Copperbelt",
  "ANCIENT LIFE": "Gondwana's glaciers carved the Luangwa Valley",
  "HOMINID RISE": "Stone tools on the Zambezi Plateau",
  "ZAMBIA DEEP": "Bantu expansion and early kingdoms",
  COPPER: "The mineral that shaped sovereignty",
  KINGDOM: "Lozi, Bemba, Lunda — governance before borders",
  COLONIAL: "The wound of extraction, 1890–1964",
  SOVEREIGN: "Independence and the unfinished story",
};

type LayersPanelProps = {
  visibility: LayerVisibility;
  onVisibilityChange: (v: LayerVisibility) => void;
  visitedZones?: DeepTimeZone[];
};

export function LayersPanel({
  visibility,
  onVisibilityChange,
  visitedZones = [],
}: LayersPanelProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredEra, setHoveredEra] = useState<string | null>(null);

  const toggle = (key: keyof LayerVisibility) => {
    const current = visibility[key];
    const effective = current ?? true;
    onVisibilityChange({ ...visibility, [key]: !effective });
  };

  const deepTimeEras = ["DEEP TIME", "DEEP EARTH", "ANCIENT LIFE", "HOMINID RISE", "ZAMBIA DEEP"];
  const humanTimeEras = ["COPPER", "KINGDOM", "COLONIAL", "SOVEREIGN"];

  const isVisited = (era: string): boolean => {
    const mapping: Record<string, string> = {
      "DEEP TIME": "deepTime",
      "DEEP EARTH": "deepEarth",
      "ANCIENT LIFE": "ancientLife",
      "HOMINID RISE": "hominidRise",
      "ZAMBIA DEEP": "zambiaDeep",
      COPPER: "copper",
      KINGDOM: "kingdom",
      COLONIAL: "colonial",
      SOVEREIGN: "sovereign",
    };
    return visitedZones.includes(mapping[era] as DeepTimeZone);
  };

  return (
    <aside className="pointer-events-auto absolute z-20 hidden rounded border border-copper/30 bg-bg/90 backdrop-blur-xl md:block md:left-7 md:top-24 md:w-[250px]">
      {/* Toggle header — hidden below md, visible on md+ */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="font-display flex w-full items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-copperSoft hover:bg-copper/10 transition-colors rounded-t"
      >
        Exhibit Layers
        <span className="text-muted text-xs">{collapsed ? "▾" : "▴"}</span>
      </button>

      {!collapsed && (
        <div className="border-t border-copper/20 px-4 py-3 space-y-1">
          {/* ── DEEP TIME GROUP ── */}
          <p className="text-[10px] uppercase tracking-[0.22em] text-copper/60 mb-2 font-display">
            Deep Time
          </p>
          {deepTimeEras.map((era) => (
            <div
              key={era}
              className="group relative flex items-center gap-2.5 rounded px-2 py-1.5 cursor-pointer hover:bg-copper/8 transition-colors"
              onMouseEnter={() => setHoveredEra(era)}
              onMouseLeave={() => setHoveredEra(null)}
            >
              {/* Visited indicator */}
              <div
                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${
                  isVisited(era)
                    ? "bg-copper shadow-[0_0_4px_rgba(184,115,51,0.5)]"
                    : "bg-copper/20"
                }`}
              />
              <span className="text-[11px] uppercase tracking-[0.14em] text-text/80 group-hover:text-copper transition-colors">
                {era}
              </span>
              {isVisited(era) && (
                <span className="ml-auto text-[8px] text-copper/50">✓</span>
              )}
            </div>
          ))}

          {/* Separator */}
          <div className="my-3 border-t border-copper/15" />

          {/* ── HUMAN TIME GROUP ── */}
          <p className="text-[10px] uppercase tracking-[0.22em] text-copper/60 mb-2 font-display">
            Human Time
          </p>
          {humanTimeEras.map((era) => (
            <div
              key={era}
              className="group relative flex items-center gap-2.5 rounded px-2 py-1.5 cursor-pointer hover:bg-copper/8 transition-colors"
              onMouseEnter={() => setHoveredEra(era)}
              onMouseLeave={() => setHoveredEra(null)}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${
                  isVisited(era)
                    ? "bg-copper shadow-[0_0_4px_rgba(184,115,51,0.5)]"
                    : "bg-copper/20"
                }`}
              />
              <span className="text-[11px] uppercase tracking-[0.14em] text-text/80 group-hover:text-copper transition-colors">
                {era}
              </span>
              {isVisited(era) && (
                <span className="ml-auto text-[8px] text-copper/50">✓</span>
              )}
            </div>
          ))}

          {/* Hover description tooltip */}
          {hoveredEra && ERA_HINTS[hoveredEra] && (
            <div className="mt-2 rounded border border-copper/20 bg-panel/80 px-3 py-2 animate-[fade-in_0.15s_ease-out]">
              <p className="text-[10px] leading-[1.6] text-muted italic">
                {ERA_HINTS[hoveredEra]}
              </p>
            </div>
          )}

          {/* Separator */}
          <div className="my-3 border-t border-copper/15" />

          {/* ── EXHIBIT TOGGLES ── */}
          <p className="text-[10px] uppercase tracking-[0.22em] text-copper/60 mb-2 font-display">
            Overlays
          </p>
          <label className="flex items-center gap-2.5 cursor-pointer group px-2 py-1">
            <input
              type="checkbox"
              checked={visibility.boundary}
              onChange={() => toggle("boundary")}
              className="rounded border-copper/50 bg-bg text-copper h-3.5 w-3.5"
            />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 group-hover:text-copper transition-colors">
              Zambia boundary
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group px-2 py-1">
            <input
              type="checkbox"
              checked={visibility.province}
              onChange={() => toggle("province")}
              className="rounded border-copper/50 bg-bg text-copper h-3.5 w-3.5"
            />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 group-hover:text-copper transition-colors">
              Province highlight
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group px-2 py-1">
            <input
              type="checkbox"
              checked={visibility.particles}
              onChange={() => toggle("particles")}
              className="rounded border-copper/50 bg-bg text-copper h-3.5 w-3.5"
            />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 group-hover:text-copper transition-colors">
              Cha-cha-cha swarm
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group px-2 py-1">
            <input
              type="checkbox"
              checked={visibility.zambezi !== false}
              onChange={() => toggle("zambezi")}
              className="rounded border-copper/50 bg-bg text-copper h-3.5 w-3.5"
            />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 group-hover:text-copper transition-colors">
              Zambezi evolution
            </span>
          </label>

          {/* Progress footer */}
          <div className="mt-3 pt-2 border-t border-copper/10">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                Journey Progress
              </p>
              <p className="text-[9px] text-copper/70">
                {visitedZones.length}/9 eras
              </p>
            </div>
            {/* Mini timeline spine */}
            <div className="mt-2 flex items-center gap-1">
              {[...deepTimeEras, ...humanTimeEras].map((era) => (
                <div
                  key={era}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    isVisited(era)
                      ? "bg-copper shadow-[0_0_3px_rgba(184,115,51,0.4)]"
                      : "bg-copper/10"
                  }`}
                  title={era}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
