"use client";

import { useMemo, useState } from "react";
import { TerminalText } from "@/components/UI/TerminalText";

const BOOT_LINES = [
  "Initializing substrate layer...",
  "Loading geological record: 4.5B BC...",
  "Calibrating temporal axis...",
  "Positioning over Zambia...",
  "Connecting sovereign infrastructure...",
] as const;

type PreloadScreenProps = {
  visible: boolean;
};

export function PreloadScreen({ visible }: PreloadScreenProps) {
  const [activeLine, setActiveLine] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  const completed = useMemo(() => {
    return new Set(Array.from({ length: completedCount }, (_, i) => i));
  }, [completedCount]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-[#050505]/95 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <section className="terminal-panel relative w-[min(94vw,760px)] border border-copper/30 bg-[#0A0806]/92 px-4 py-4 text-left md:px-6 md:py-5">
        <p className="font-mono text-[13px] uppercase tracking-[0.24em] text-[#B87333]">ZAMBIA UNTOLD</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#7A6550] md:text-[11px]">
          SOVEREIGN INTELLIGENCE ATLAS
        </p>

        <p className="mt-2 font-mono text-[11px] text-[#B87333]/70">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

        <div className="mt-3 space-y-1.5 md:space-y-2">
          {BOOT_LINES.map((line, i) => {
            const isDone = completed.has(i);
            const isActive = i === activeLine;
            const isHidden = i > activeLine;

            if (isHidden) return null;

            return (
              <div key={line} className="flex items-center justify-between gap-3 font-mono text-[10px] md:text-[11px]">
                <span className="text-[#B87333]">
                  &gt;{" "}
                  {isActive && !isDone ? (
                    <TerminalText
                      text={line}
                      speed={14}
                      showCursor
                      onComplete={() => {
                        setCompletedCount((prev) => Math.max(prev, i + 1));
                        setTimeout(() => {
                          if (i + 1 < BOOT_LINES.length) {
                            setActiveLine(i + 1);
                          } else {
                            setShowFooter(true);
                          }
                        }, 120);
                      }}
                    />
                  ) : (
                    <span>{line}</span>
                  )}
                </span>
                {isDone && <span className="text-[#B87333]">[OK]</span>}
              </div>
            );
          })}
        </div>

        {showFooter && (
          <>
            <p className="mt-3 font-mono text-[11px] text-[#B87333]/70">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7A6550] md:text-[11px]">
              POWERED BY COPPERCLOUD · ZAMBIA
            </p>
          </>
        )}
      </section>
    </div>
  );
}
