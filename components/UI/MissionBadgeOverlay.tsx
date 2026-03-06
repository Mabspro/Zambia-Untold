"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalText } from "@/components/UI/TerminalText";

type MissionBadgeOverlayProps = {
  visible: boolean;
  badge: string;
  badgeLabel: string;
  unlockMessage: string;
  completedMissions: number;
  totalMissions: number;
  onDone: () => void;
};

function playChime() {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  try {
    const ctx = new AudioContextCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(622, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    window.setTimeout(() => void ctx.close(), 500);
  } catch {
    // Ignore audio failures; visual overlay remains primary feedback.
  }
}

export function MissionBadgeOverlay({
  visible,
  badge,
  badgeLabel,
  unlockMessage,
  completedMissions,
  totalMissions,
  onDone,
}: MissionBadgeOverlayProps) {
  useEffect(() => {
    if (!visible) return;
    playChime();
    const id = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(id);
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[60] grid place-items-center"
        >
          <motion.div
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 8, scale: 0.99 }}
            className="terminal-panel w-[min(92vw,460px)] border border-copper/35 bg-[#0A0806]/95 px-4 py-4"
          >
            <div className="font-mono text-center text-[13px] leading-[1.6] text-copper whitespace-pre-line">
              <TerminalText
                text={`${badge}  BADGE EARNED\n\n${badgeLabel}\n\n\"${unlockMessage}\"`}
                speed={24}
                delay={60}
                color="#B87333"
                showCursor={false}
              />
            </div>
            <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-[#7A6550]">
              {completedMissions} of {totalMissions} complete
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

