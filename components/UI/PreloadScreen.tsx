"use client";

/**
 * Mwela-inspired concentric circle pre-load.
 * Reference: Appearance-Context.md — BaTwa rock art, copper on dark rock.
 */

export function PreloadScreen() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-rockDark"
      aria-hidden
    >
      <svg
        className="h-[min(80vmin,320px)] w-[min(80vmin,320px)] animate-[mwela-expand_1.5s_ease-out_forwards]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="0.4"
          className="text-copper/70"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="0.35"
          className="text-copper/55"
        />
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-copper/45"
        />
        <circle
          cx="50"
          cy="50"
          r="24"
          stroke="currentColor"
          strokeWidth="0.25"
          className="text-copper/35"
        />
        <circle
          cx="50"
          cy="50"
          r="16"
          stroke="currentColor"
          strokeWidth="0.2"
          className="text-copper/25"
        />
        <circle
          cx="50"
          cy="50"
          r="8"
          stroke="currentColor"
          strokeWidth="0.15"
          className="text-copper/20"
        />
      </svg>
    </div>
  );
}
