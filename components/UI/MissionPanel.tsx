"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MISSIONS, type Mission } from "@/lib/missions";
import type { MissionProgress } from "@/lib/museumPassport";

type MissionPanelProps = {
  progress: MissionProgress;
  onSetActiveMission: (missionId: string) => void;
  startExpanded?: boolean;
  showPulseCue?: boolean;
};

function getMissionCompletionCount(mission: Mission, progress: MissionProgress): number {
  const completed = new Set(progress.completedSteps);
  return mission.steps.filter((step) => completed.has(step.id)).length;
}

export function MissionPanel({
  progress,
  onSetActiveMission,
  startExpanded = false,
  showPulseCue = false,
}: MissionPanelProps) {
  const [collapsed, setCollapsed] = useState(!startExpanded);
  const [showAll, setShowAll] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const currentMission = useMemo(() => {
    const preferred = MISSIONS.find((m) => m.id === progress.lastActiveMission);
    const unresolved = MISSIONS.find((m) => getMissionCompletionCount(m, progress) < m.steps.length);
    return preferred ?? unresolved ?? MISSIONS[0];
  }, [progress]);

  const currentDone = getMissionCompletionCount(currentMission, progress);
  const missionOneComplete = progress.completedMissions.includes("substrate");

  useEffect(() => {
    if (startExpanded && !userCollapsed) {
      setCollapsed(false);
    }
    if (!startExpanded) {
      setCollapsed(true);
    }
  }, [startExpanded, userCollapsed]);

  useEffect(() => {
    if (!showAll) return;

    lastActiveElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowAll(false);
        return;
      }

      if (event.key !== "Tab") return;

      const container = dialogRef.current;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastActiveElementRef.current?.focus();
    };
  }, [showAll]);

  return (
    <>
      <aside
        className="pointer-events-auto fixed left-3 right-3 z-[35] w-auto md:left-auto md:right-6 md:w-[min(300px,28vw)]"
        style={{
          bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.button
              key="collapsed"
              type="button"
              onClick={() => setCollapsed(false)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="terminal-panel w-full border border-copper/30 bg-[#0A0806]/95 px-3 py-2 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-copperSoft/85">
                  <span
                    className={
                      showPulseCue && !missionOneComplete
                        ? "inline-block animate-[mission-cue_30s_ease-in-out_infinite]"
                        : "inline-block"
                    }
                  >
                    ▶
                  </span>{" "}
                  {currentMission.title}
                </p>
                <span className="font-mono text-[11px] text-copper/80" aria-hidden>
                  ▴
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-[#7A6550]/80">
                {currentMission.description}
              </p>
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="terminal-panel max-h-[min(42vh,280px)] overflow-y-auto border border-copper/30 bg-[#0A0806]/95 px-3 py-3 md:max-h-[min(42vh,320px)] md:overflow-visible"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#7A6550]">ZAMBIA UNTOLD · MISSION SYSTEM</p>
                <button
                  type="button"
                  onClick={() => {
                    setUserCollapsed(true);
                    setCollapsed(true);
                  }}
                  className="min-h-11 border border-copper/25 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted/80 hover:text-text"
                  aria-label="Collapse mission panel"
                >
                  ▾
                </button>
              </div>
              <div className="mt-1 border-t border-copper/25" />
              <p className="mt-2 font-display text-[12px] uppercase tracking-[0.16em] text-copper">{currentMission.title}</p>
              <p className="mt-1 text-[11px] text-muted/80">{currentMission.description}</p>

              <div className="mt-2 space-y-1.5">
                {currentMission.steps.map((step) => {
                  const done = progress.completedSteps.includes(step.id);
                  return (
                    <p key={step.id} className="font-mono text-[11px] leading-[1.4] text-text/90 whitespace-pre-line">
                      <span className={done ? "text-copper" : "text-[#7A6550]"}>{done ? "[✓]" : "[·]"}</span>{" "}
                      <span className={done ? "text-muted/80" : "text-copperSoft"}>{done ? step.instruction : `> ${step.instruction}`}</span>
                    </p>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#7A6550]" aria-hidden>
                  {currentMission.steps.map((step) => (progress.completedSteps.includes(step.id) ? "[█]" : "[·]")).join(" ")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="border border-copper/30 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-copperSoft hover:border-copper"
                  aria-haspopup="dialog"
                  aria-expanded={showAll}
                >
                  All Missions
                </button>
              </div>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted/80">
                {currentDone} of {currentMission.steps.length} complete
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      <AnimatePresence>
        {showAll && (
          <motion.aside
            ref={dialogRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed left-3 right-3 z-[45] w-auto border border-copper/35 bg-panel/95 p-3 backdrop-blur md:left-auto md:right-8 md:w-[320px]"
            style={{
              bottom: "calc(7rem + env(safe-area-inset-bottom, 0px))",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mission-log-title"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between">
              <p id="mission-log-title" className="font-display text-[12px] uppercase tracking-[0.18em] text-copper">Mission Log</p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setShowAll(false)}
                className="border border-copper/25 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted/80 hover:text-text"
              >
                Close
              </button>
            </div>
            <div className="mt-2 space-y-2 max-h-[48vh] overflow-y-auto pr-1">
              {MISSIONS.map((mission) => {
                const count = getMissionCompletionCount(mission, progress);
                const done = count === mission.steps.length;
                return (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => {
                      onSetActiveMission(mission.id);
                      setShowAll(false);
                      setCollapsed(false);
                    }}
                    className="w-full border border-copper/20 bg-bg/60 px-2.5 py-2 text-left hover:border-copper/35"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-copperSoft">
                      {mission.badge} {mission.title}
                    </p>
                    <p className="mt-1 text-[11px] text-muted/80">{mission.description}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-copper/80">
                      {done ? `Badge earned: ${mission.badgeLabel}` : `${count}/${mission.steps.length} steps`}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
