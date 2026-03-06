"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalText } from "@/components/UI/TerminalText";

type GuidedTourLayout = {
  width: number;
  height: number;
  isDesktop: boolean;
  sideInset: number;
  topInset: number;
  bottomInset: number;
  headerBottom: number;
};

const TOUR_STEP_TIMEOUT_MS = 15000;

type Step = 1 | 2 | 3 | 4;

const STEPS: Record<Step, string> = {
  1: "> SYSTEM INITIALIZED.\n  900 million years of Zambian substrate detected.\n  Drag globe to begin.",
  2: "> TEMPORAL AXIS ACTIVE.\n  476,000 BC -> 2026 AD.\n  Move scrubber to travel through time.",
  3: "> 6 HISTORICAL NODES IDENTIFIED.\n  Select any glowing marker\n  to open its intelligence file.",
  4: "> BRIEFING COMPLETE.\n  You are inside the museum now.",
};

type GuidedTourHintsProps = {
  active: boolean;
  onComplete: () => void;
  userHasDraggedGlobe: boolean;
  userHasMovedScrubber: boolean;
  hasSelectedMarker: boolean;
  layout: GuidedTourLayout;
};

export function GuidedTourHints({
  active,
  onComplete,
  userHasDraggedGlobe,
  userHasMovedScrubber,
  hasSelectedMarker,
  layout,
}: GuidedTourHintsProps) {
  const [step, setStep] = useState<Step>(1);
  const [textDone, setTextDone] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  const clearTourTimeout = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleNextTimeout = useCallback(() => {
    if (stepRef.current >= 4) return;
    clearTourTimeout();
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      const currentStep = stepRef.current;
      if (currentStep < 3) setStep((currentStep + 1) as Step);
      else setStep(4);
    }, TOUR_STEP_TIMEOUT_MS);
  }, [clearTourTimeout]);

  useEffect(() => {
    if (!active) return;
    setStep(1);
    setTextDone(false);
    scheduleNextTimeout();
    return clearTourTimeout;
  }, [active, scheduleNextTimeout, clearTourTimeout]);

  useEffect(() => {
    if (!active) return;
    setTextDone(false);
    scheduleNextTimeout();
    return clearTourTimeout;
  }, [active, step, scheduleNextTimeout, clearTourTimeout]);

  useEffect(() => {
    if (!active || step !== 1 || !userHasDraggedGlobe) return;
    clearTourTimeout();
    setStep(2);
  }, [active, step, userHasDraggedGlobe, clearTourTimeout]);

  useEffect(() => {
    if (!active || step !== 2 || !userHasMovedScrubber) return;
    clearTourTimeout();
    setStep(3);
  }, [active, step, userHasMovedScrubber, clearTourTimeout]);

  useEffect(() => {
    if (!active || step !== 3 || !hasSelectedMarker) return;
    clearTourTimeout();
    setStep(4);
  }, [active, step, hasSelectedMarker, clearTourTimeout]);

  useEffect(() => {
    if (!active || step !== 4 || !textDone) return;
    const id = window.setTimeout(onComplete, 900);
    return () => window.clearTimeout(id);
  }, [active, step, textDone, onComplete]);

  const handleSkip = useCallback(() => {
    clearTourTimeout();
    onComplete();
  }, [clearTourTimeout, onComplete]);

  if (!active) return null;

  const panelStyle: React.CSSProperties = layout.isDesktop
    ? {
        left: "50%",
        transform: "translateX(-50%)",
        top: Math.max(layout.topInset + 12, 76),
        width: Math.min(420, layout.width - layout.sideInset * 2),
        maxWidth: `calc(100vw - ${layout.sideInset * 2}px)`,
      }
    : {
        left: layout.sideInset,
        right: layout.sideInset,
        top: step === 2 ? Math.min(layout.headerBottom + 8, layout.height - 220) : undefined,
        bottom: step === 2 ? undefined : Math.max(layout.bottomInset + 84, 102),
      };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      aria-live="polite"
      aria-label="Guided tour"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24 }}
          style={panelStyle}
          className="terminal-panel pointer-events-auto absolute border border-[rgba(184,115,51,0.3)] bg-[#0A0806]/95 px-4 py-3"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7A6550]">ZAMBIA UNTOLD · SYSTEM v1.0</p>
          <div className="mt-1 border-t border-copper/30" />

          <div className="mt-2 min-h-[74px] font-mono text-[11px] leading-[1.5] text-[#B87333] md:text-[12px]">
            <TerminalText
              key={`tour-${step}`}
              text={STEPS[step]}
              speed={36}
              delay={80}
              color="#B87333"
              showCursor={step !== 4}
              onComplete={() => setTextDone(true)}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="font-mono text-[11px] tracking-[0.14em] text-[#7A6550]" aria-hidden>
              <span>{step === 1 ? "[█]" : "[·]"}</span>{" "}
              <span>{step === 2 ? "[█]" : "[·]"}</span>{" "}
              <span>{step >= 3 ? (step === 3 ? "[█]" : "[·]") : "[·]"}</span>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="font-mono border border-copper/35 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#B87333] hover:border-copper hover:text-[#d49752]"
            >
              SKIP BRIEFING
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}







