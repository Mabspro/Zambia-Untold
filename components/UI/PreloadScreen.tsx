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
      className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(184,115,51,0.08),rgba(5,5,5,0.96)_42%,rgba(3,4,5,0.98)_100%)] transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <section className="terminal-panel relative w-[min(94vw,780px)] border border-copper/35 bg-[#0A0806]/94 px-5 py-5 text-left shadow-[0_0_36px_rgba(184,115,51,0.12)] md:px-7 md:py-6">
        <p className="font-mono text-[14px] uppercase tracking-[0.24em] text-[#d49752] md:text-[15px]">ZAMBIA UNTOLD</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9b7d60] md:text-[12px]">
          SOVEREIGN INTELLIGENCE ATLAS
        </p>

        <p className="mt-3 font-mono text-[12px] text-[#B87333]/80">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

        <div className="mt-4 space-y-2 md:space-y-2.5">
          {BOOT_LINES.map((line, i) => {
            const isDone = completed.has(i);
            const isActive = i === activeLine;
            const isHidden = i > activeLine;

            if (isHidden) return null;

            return (
              <div key={line} className="flex items-center justify-between gap-3 font-mono text-[11px] md:text-[12px]">
                <span className="text-[#d49752]">
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
                {isDone && <span className="text-[#d49752]">[OK]</span>}
              </div>
            );
          })}
        </div>

        {showFooter && (
          <>
            <p className="mt-4 font-mono text-[12px] text-[#B87333]/80">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#9b7d60] md:text-[12px]">
              POWERED BY COPPERCLOUD · ZAMBIA
            </p>
          </>
        )}
      </section>
    </div>
  );
}
