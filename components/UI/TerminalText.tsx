"use client";

import { useEffect, useRef, useState } from "react";

type TerminalTextProps = {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
};

export function TerminalText({
  text,
  speed = 45,
  delay = 0,
  color = "#B87333",
  showCursor = true,
  onComplete,
  className = "",
}: TerminalTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);
  const startAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const completeCalledRef = useRef(false);

  useEffect(() => {
    setVisibleCount(0);
    setDone(false);
    completeCalledRef.current = false;
    startAtRef.current = null;
  }, [text, speed, delay]);

  useEffect(() => {
    const tick = (ts: number) => {
      if (startAtRef.current === null) {
        startAtRef.current = ts + delay;
      }

      if (ts < startAtRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = ts - startAtRef.current;
      const nextCount = Math.min(text.length, Math.floor(elapsed / speed));
      setVisibleCount((prev) => (prev === nextCount ? prev : nextCount));

      if (nextCount >= text.length) {
        setDone(true);
        if (!completeCalledRef.current) {
          completeCalledRef.current = true;
          onComplete?.();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [text, speed, delay, onComplete]);

  const shown = text.slice(0, visibleCount);
  const shouldShowCursor = showCursor && visibleCount > 0 && !done;

  return (
    <span className={className} style={{ color, whiteSpace: "pre-line" }}>
      {shown}
      {shouldShowCursor ? (
        <span
          className="animate-[terminal-cursor_1s_steps(1,end)_infinite]"
          aria-hidden
        >
          █
        </span>
      ) : null}
    </span>
  );
}
