"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FOLK_TALES, getAllTraditions, type FolkTale } from "@/data/folkTales";
import { ChevronDivider } from "./ChevronDivider";

type FolkTalesPanelProps = {
  onClose: () => void;
  onNavigateToCoordinate?: (lat: number, lng: number, markerId?: string) => void;
};

const TIER_LABELS: Record<string, { label: string; description: string }> = {
  flagship: { label: "Flagship", description: "Major stories known across Zambia" },
  regional: { label: "Regional", description: "Traditions of specific ethnic groups" },
  urban: { label: "Urban & Living", description: "Modern and urban mythology" },
};

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    flagship: "#D4943A",
    regional: "#CC7722",
    urban: "#8E7A63",
  };
  const color = colors[tier] ?? "#8E7A63";
  return (
    <span
      className="inline-block rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}35`,
      }}
    >
      {TIER_LABELS[tier]?.label ?? tier}
    </span>
  );
}

function TraditionBadge({ tradition }: { tradition: string }) {
  return (
    <span className="inline-block rounded-sm border border-copper/20 bg-copper/5 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-copperSoft/80">
      {tradition}
    </span>
  );
}

function FolkTaleCard({
  tale,
  expanded,
  onToggle,
  onNavigate,
}: {
  tale: FolkTale;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: (lat: number, lng: number, markerId?: string) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded border border-copper/25 bg-bg/50 overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 hover:bg-copper/5 transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier={tale.tier} />
          <TraditionBadge tradition={tale.tradition} />
        </div>
        <h3 className="font-display text-[15px] leading-snug text-text">
          {tale.title}
        </h3>
        <p className="text-[11px] text-[#B8A58F] leading-relaxed mt-1 italic">
          {tale.subtitle}
        </p>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-4">
              <ChevronDivider />

              {/* Story body */}
              <div className="space-y-3">
                {tale.body.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[13px] text-[#D8C9B4] leading-[1.75]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Transmission */}
              <div className="border-l-2 border-copper/50 pl-4 py-1 mt-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-copperSoft/70 mb-1">
                  Transmission
                </p>
                <p className="font-display text-[14px] italic text-copper/90 leading-relaxed">
                  &ldquo;{tale.transmission}&rdquo;
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-copper/15">
                <p className="font-mono text-[9px] text-muted">
                  {tale.epochZone}
                </p>
                {tale.culturallyReviewed && (
                  <span className="text-[8px] uppercase tracking-[0.14em] text-[#5A9A7A]">
                    ✓ Culturally reviewed
                  </span>
                )}
                {onNavigate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(
                        tale.coordinates.lat,
                        tale.coordinates.lng,
                        tale.relatedMarkerId
                      );
                    }}
                    className="ml-auto text-[9px] uppercase tracking-[0.14em] text-copperSoft hover:text-copper transition-colors"
                  >
                    View on Globe →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function FolkTalesPanel({
  onClose,
  onNavigateToCoordinate,
}: FolkTalesPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [traditionFilter, setTraditionFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  const traditions = useMemo(() => getAllTraditions(), []);

  const filteredTales = useMemo(() => {
    let tales = FOLK_TALES;
    if (traditionFilter) {
      tales = tales.filter((t) =>
        t.tradition.toLowerCase().includes(traditionFilter.toLowerCase())
      );
    }
    if (tierFilter) {
      tales = tales.filter((t) => t.tier === tierFilter);
    }
    return tales;
  }, [traditionFilter, tierFilter]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: "-10%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-10%", transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 z-40 h-[70vh] w-full border-t border-copper/30 bg-panel/97 backdrop-blur-xl md:top-0 md:h-full md:w-[420px] md:max-w-[440px] md:border-r md:border-t-0 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-copper/20 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-copperSoft">
              Inganji · Legends Passed Down
            </p>
            <h2 className="font-display text-xl text-text mt-1 tracking-wide">
              Folk Tales & Mythology
            </h2>
            <p className="text-[10px] text-muted mt-1 leading-relaxed">
              These are not arguments. They are transmissions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-copper/40 px-2 py-1 text-xs uppercase tracking-[0.16em] text-text hover:border-copper transition-colors"
          >
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex gap-1 flex-wrap">
            {(["flagship", "regional", "urban"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
                className={`transition-colors ${tierFilter === tier ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
              >
                <TierBadge tier={tier} />
              </button>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {traditions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTraditionFilter(traditionFilter === t ? null : t)}
                className={`transition-colors ${traditionFilter === t ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
              >
                <TraditionBadge tradition={t} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto folktale-scroll px-5 py-4 space-y-3">
        {filteredTales.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[13px] text-muted">No tales match this filter.</p>
          </div>
        ) : (
          filteredTales.map((tale) => (
            <FolkTaleCard
              key={tale.id}
              tale={tale}
              expanded={expandedId === tale.id}
              onToggle={() =>
                setExpandedId(expandedId === tale.id ? null : tale.id)
              }
              onNavigate={onNavigateToCoordinate}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-copper/15 px-5 py-3 flex items-center justify-between">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted/60">
          {filteredTales.length} tales · Inganji Archive
        </p>
        <p className="font-mono text-[8px] text-copper/50">
          Zambia Untold
        </p>
      </div>
    </motion.aside>
  );
}
