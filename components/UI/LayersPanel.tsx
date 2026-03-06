"use client";

import { useState, type CSSProperties } from "react";
export type { LayerVisibility } from "@/lib/types";
import type { LayerVisibility } from "@/lib/types";
import type { DeepTimeZone } from "@/lib/deepTime";

const ERA_HINTS: Record<string, string> = {
  "DEEP EARTH": "The substrate engine - 4.5 billion years of planetary memory",
  "ANCIENT LIFE": "Gondwana's glaciers carved the Luangwa Valley",
  "HOMINID RISE": "Stone tools on the Zambezi Plateau",
  "ZAMBIA DEEP": "Bantu expansion and early kingdoms",
  "COPPER EMPIRE": "The mineral substrate shaped sovereignty and trade",
  "KINGDOM AGE": "Lozi, Bemba, Lunda - governance before borders",
  "COLONIAL WOUND": "Extraction corridor period, 1890-1964",
  "UNFINISHED SOVEREIGN": "Independence and active rebalancing",
};

type EraItem = {
  era: DeepTimeZone;
  label: string;
  year: number;
};

const DEEP_TIME_ERAS: EraItem[] = [
  { era: "DEEP EARTH", label: "Deep Earth", year: -4_500_000_000 },
  { era: "ANCIENT LIFE", label: "Ancient Life", year: -540_000_000 },
  { era: "HOMINID RISE", label: "Hominid Rise", year: -5_000_000 },
  { era: "ZAMBIA DEEP", label: "Zambia Deep", year: -476_000 },
];

const HUMAN_TIME_ERAS: EraItem[] = [
  { era: "COPPER EMPIRE", label: "Copper Empire", year: 1000 },
  { era: "KINGDOM AGE", label: "Kingdom Age", year: 1600 },
  { era: "COLONIAL WOUND", label: "Colonial Wound", year: 1890 },
  { era: "UNFINISHED SOVEREIGN", label: "Unfinished Sovereign", year: 1964 },
];

type LayersPanelProps = {
  positionStyle?: CSSProperties;
  contentMaxHeight?: string;
  visibility: LayerVisibility;
  onVisibilityChange: (v: LayerVisibility) => void;
  onEraSelect?: (year: number) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onSelectMarker?: (markerId: string) => void;
  onOpenSpaceMission?: () => void;
  visitedZones?: DeepTimeZone[];
};

export function LayersPanel({
  positionStyle,
  contentMaxHeight,
  visibility,
  onVisibilityChange,
  onEraSelect,
  onExpandedChange,
  onSelectMarker,
  onOpenSpaceMission,
  visitedZones = [],
}: LayersPanelProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredEra, setHoveredEra] = useState<DeepTimeZone | null>(null);

  const toggle = (key: keyof LayerVisibility) => {
    const current = visibility[key];
    const effective = current ?? true;
    onVisibilityChange({ ...visibility, [key]: !effective });
  };

  const isVisited = (era: DeepTimeZone): boolean => visitedZones.includes(era);

  const renderEraRow = (item: EraItem) => (
    <button
      key={item.era}
      type="button"
      onClick={() => onEraSelect?.(item.year)}
      className="group relative flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition-colors hover:bg-copper/8"
      onMouseEnter={() => setHoveredEra(item.era)}
      onMouseLeave={() => setHoveredEra(null)}
      title={`Jump to ${item.label}`}
    >
      <div
        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${
          isVisited(item.era)
            ? "bg-copper shadow-[0_0_4px_rgba(184,115,51,0.5)]"
            : "bg-copper/20"
        }`}
      />
      <span className="text-[11px] uppercase tracking-[0.14em] text-text/80 transition-colors group-hover:text-copper">
        {item.label}
      </span>
      {isVisited(item.era) && <span className="ml-auto text-[8px] text-copper/50">✓</span>}
    </button>
  );

  return (
    <aside style={positionStyle} className="pointer-events-auto absolute z-50 rounded border border-copper/30 bg-bg/90 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => {
          const next = !collapsed;
          setCollapsed(next);
          onExpandedChange?.(!next);
        }}
        className="font-display flex w-full items-center justify-between rounded-t px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-copperSoft transition-colors hover:bg-copper/10"
      >
        Map Layers
        <span className="text-xs text-muted">{collapsed ? "▾" : "▴"}</span>
      </button>

      {!collapsed && (
        <div style={{ maxHeight: contentMaxHeight }} className="overflow-y-auto space-y-1 border-t border-copper/20 px-4 py-3">
          <p className="mb-2 font-display text-[10px] uppercase tracking-[0.22em] text-copper/60">Era Jump</p>
          {DEEP_TIME_ERAS.map(renderEraRow)}

          <div className="my-3 border-t border-copper/15" />
          {HUMAN_TIME_ERAS.map(renderEraRow)}

          {hoveredEra && ERA_HINTS[hoveredEra] && (
            <div className="mt-2 animate-[fade-in_0.15s_ease-out] rounded border border-copper/20 bg-panel/80 px-3 py-2">
              <p className="text-[10px] italic leading-[1.6] text-muted">{ERA_HINTS[hoveredEra]}</p>
            </div>
          )}

          <div className="my-3 border-t border-copper/15" />

          <p className="mb-2 font-display text-[10px] uppercase tracking-[0.22em] text-copper/60">Overlays</p>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.boundary} onChange={() => toggle("boundary")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Zambia boundary</span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.province} onChange={() => toggle("province")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Province highlight</span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.particles} onChange={() => toggle("particles")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Cha-cha-cha swarm</span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.zambezi !== false} onChange={() => toggle("zambezi")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Zambezi evolution</span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.space !== false} onChange={() => toggle("space")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Space signal (live)</span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.earthObservation !== false} onChange={() => toggle("earthObservation")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Earth observation</span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 px-2 py-1">
            <input type="checkbox" checked={visibility.liveSatellites !== false} onChange={() => toggle("liveSatellites")} className="h-3.5 w-3.5 rounded border-copper/50 bg-bg text-copper" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-text/80 transition-colors group-hover:text-copper">Live satellites</span>
          </label>

          {visibility.space !== false && (
            <>
              <div className="my-3 border-t border-copper/15" />
              <p className="mb-2 font-display text-[10px] uppercase tracking-[0.22em] text-copper/60">Space Dreams</p>
              <button type="button" onClick={() => onSelectMarker?.("nkoloso-space-academy")} className="w-full rounded border border-copper/20 bg-copper/5 px-2 py-1.5 text-left text-[10px] uppercase tracking-[0.12em] text-text/85 hover:border-copper/40">Jump to Nkoloso (1964)</button>
              <button type="button" onClick={onOpenSpaceMission} className="mt-1.5 w-full rounded border border-copper/20 bg-copper/5 px-2 py-1.5 text-left text-[10px] uppercase tracking-[0.12em] text-text/85 hover:border-copper/40">Build Zambia&apos;s Satellite</button>
            </>
          )}

          <div className="mt-3 border-t border-copper/10 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.16em] text-muted">Journey Progress</p>
              <p className="text-[9px] text-copper/70">{visitedZones.length}/8 eras</p>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[...DEEP_TIME_ERAS, ...HUMAN_TIME_ERAS].map((item) => (
                <div key={item.era} className={`h-1 flex-1 rounded-full transition-all duration-500 ${isVisited(item.era) ? "bg-copper shadow-[0_0_3px_rgba(184,115,51,0.4)]" : "bg-copper/10"}`} title={item.label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}










