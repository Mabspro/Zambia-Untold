"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getAllVignettes, getVignetteForYear, type DeepTimeVignette } from "@/data/deepTimeVignettes";

type DeepTimePanelProps = {
  scrubYear: number;
  onClose: () => void;
  onNavigateToCoordinate: (lat: number, lng: number) => void;
};

function VignetteCard({
  vignette,
  isActive,
  onClick,
}: {
  vignette: DeepTimeVignette;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded border px-3 py-2.5 transition-all duration-300 ${
        isActive
          ? "border-copper/50 bg-copper/10"
          : "border-copper/15 bg-panel/50 hover:border-copper/30 hover:bg-panel/80"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: vignette.accentColor }}
        />
        <p className="text-[10px] uppercase tracking-[0.18em] text-copperSoft">
          {vignette.era}
          {vignette.period && (
            <span className="text-muted"> · {vignette.period}</span>
          )}
        </p>
      </div>
      <p className="mt-1 font-display text-sm text-text">{vignette.title}</p>
      <p className="mt-0.5 text-[10px] italic text-muted">{vignette.subtitle}</p>
    </button>
  );
}

function VignetteDetail({
  vignette,
  onNavigateToCoordinate,
}: {
  vignette: DeepTimeVignette;
  onNavigateToCoordinate: (lat: number, lng: number) => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="border-b border-copper/20 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: vignette.accentColor }}
          />
          <p className="text-[9px] uppercase tracking-[0.22em] text-copperSoft">
            {vignette.era}
            {vignette.period && ` · ${vignette.period}`}
          </p>
        </div>
        <h3 className="font-display text-lg text-copper">{vignette.title}</h3>
        <p className="mt-0.5 text-[11px] italic text-muted">{vignette.subtitle}</p>
        <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-ash">
          Paleolatitude: {vignette.paleolatitude}
        </p>
      </div>

      {/* Global Context */}
      <section>
        <button
          type="button"
          onClick={() => toggleSection("global")}
          className="flex w-full items-center justify-between text-left"
        >
          <p className="text-[9px] uppercase tracking-[0.2em] text-copperSoft">
            🌍 The World
          </p>
          <span className="text-[10px] text-muted">
            {expandedSection === "global" ? "−" : "+"}
          </span>
        </button>
        <p className={`mt-1.5 text-[11px] leading-[1.7] text-text/85 ${
          expandedSection === "global" ? "" : "line-clamp-3"
        }`}>
          {vignette.globalContext}
        </p>
      </section>

      {/* Zambia Context — always expanded, this is the star */}
      <section className="rounded border border-copper/25 bg-copper/5 px-3 py-2.5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-copper mb-1.5">
          🇿🇲 Zambia&apos;s Chapter
        </p>
        <p className="text-[11px] leading-[1.7] text-text/90">
          {vignette.zambiaContext}
        </p>
      </section>

      {/* So What */}
      <section className="rounded border-l-2 pl-3" style={{ borderColor: vignette.accentColor }}>
        <p className="text-[9px] uppercase tracking-[0.2em] text-copperGlow mb-1">
          ✦ So What
        </p>
        <p className="text-[11px] leading-[1.7] text-text font-medium italic">
          {vignette.soWhat}
        </p>
      </section>

      {/* Geological Note — collapsible */}
      <section>
        <button
          type="button"
          onClick={() => toggleSection("geology")}
          className="flex w-full items-center justify-between text-left"
        >
          <p className="text-[9px] uppercase tracking-[0.2em] text-ash">
            🔬 Geological Note
          </p>
          <span className="text-[10px] text-muted">
            {expandedSection === "geology" ? "−" : "+"}
          </span>
        </button>
        {expandedSection === "geology" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-1.5 text-[10px] leading-[1.7] text-muted"
          >
            {vignette.geologicalNote}
          </motion.p>
        )}
      </section>

      {/* Formations */}
      <section>
        <p className="text-[9px] uppercase tracking-[0.2em] text-ash mb-1.5">
          Key Formations
        </p>
        <div className="flex flex-wrap gap-1.5">
          {vignette.formations.map((f) => (
            <span
              key={f}
              className="rounded border border-copper/20 bg-panel/60 px-2 py-0.5 text-[9px] text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Modern Consequences */}
      <section>
        <p className="text-[9px] uppercase tracking-[0.2em] text-copperSoft mb-1.5">
          Modern Zambia Consequences
        </p>
        <ul className="space-y-1">
          {vignette.modernConsequences.map((c) => (
            <li key={c} className="flex items-start gap-1.5 text-[10px] text-text/80">
              <span className="mt-0.5 text-copper">→</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Navigate to coordinates */}
      <button
        type="button"
        onClick={() =>
          onNavigateToCoordinate(
            vignette.focusCoordinates.lat,
            vignette.focusCoordinates.lng
          )
        }
        className="mt-2 w-full rounded border border-copper/30 bg-copper/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-copper hover:bg-copper/20 transition-colors"
      >
        Focus Globe on This Era
      </button>
    </motion.div>
  );
}

export function DeepTimePanel({
  scrubYear,
  onClose,
  onNavigateToCoordinate,
}: DeepTimePanelProps) {
  const allVignettes = getAllVignettes();
  const autoVignette = getVignetteForYear(scrubYear);
  const [selectedId, setSelectedId] = useState<string | null>(
    autoVignette?.id ?? allVignettes[0]?.id ?? null
  );
  const [minimized, setMinimized] = useState(false);

  const selectedVignette =
    allVignettes.find((v) => v.id === selectedId) ?? allVignettes[0];

  // Minimized state: slim bar with current era
  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="absolute left-0 top-1/2 z-40 -translate-y-1/2"
      >
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-r-lg border border-l-0 border-copper/30 bg-bg/90 px-3 py-2.5 backdrop-blur-sm hover:bg-copper/10 transition-colors"
        >
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: selectedVignette?.accentColor ?? "#B87333" }}
          />
          <span className="text-[10px] uppercase tracking-[0.14em] text-copperSoft">
            {selectedVignette?.era ?? "Deep Time"}
          </span>
          <span className="text-[10px] text-muted">▸</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-40 flex flex-col md:flex-row md:inset-auto md:left-0 md:top-0 md:h-full md:max-h-screen md:w-[min(96vw,860px)]"
    >
      {/* Left: Era Timeline — horizontal scrollable on mobile, sidebar on desktop */}
      <div className="w-full flex-shrink-0 overflow-x-auto overflow-y-hidden border-b border-copper/15 bg-bg/95 p-3 backdrop-blur-sm md:w-[240px] md:overflow-x-hidden md:overflow-y-auto md:border-b-0 md:border-r md:p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-display text-sm tracking-[0.2em] text-copper">
            DEEP TIME
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="rounded border border-copper/25 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted hover:text-copperSoft transition-colors"
              title="Minimize"
            >
              ◂
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-copper/25 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted hover:text-text transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <p className="mb-4 text-[9px] italic leading-[1.6] text-muted">
          &quot;Global time, sovereign place.&quot; Each chapter shows where
          Zambia sat in the planetary story — and why it matters today.
        </p>

        {/* Geological timeline — horizontal on mobile, vertical on desktop */}
        <div className="relative flex gap-2 md:flex-col md:space-y-2 md:gap-0 md:pl-3">
          <div className="hidden md:block absolute left-[5px] top-0 h-full w-[1px] bg-copper/15" />
          {allVignettes.map((v) => (
            <div key={v.id} className="relative flex-shrink-0 w-[180px] md:w-auto">
              <div
                className="hidden md:block absolute left-[-9px] top-3 h-2 w-2 rounded-full border"
                style={{
                  backgroundColor:
                    selectedId === v.id ? v.accentColor : "transparent",
                  borderColor: v.accentColor,
                }}
              />
              <VignetteCard
                vignette={v}
                isActive={selectedId === v.id}
                onClick={() => setSelectedId(v.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Vignette Detail — fills remaining space */}
      <div className="flex-1 overflow-y-auto bg-bg/95 p-4 backdrop-blur-sm md:p-5">
        {selectedVignette && (
          <VignetteDetail
            key={selectedVignette.id}
            vignette={selectedVignette}
            onNavigateToCoordinate={onNavigateToCoordinate}
          />
        )}
      </div>
    </motion.div>
  );
}
