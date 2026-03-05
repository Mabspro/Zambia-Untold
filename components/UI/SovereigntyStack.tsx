/**
 * SovereigntyStack — DOM overlay version.
 *
 * STATUS: ACTIVE (restored Sprint C0, March 2026)
 *
 * The WebGL HUD version (SovereigntyStackHUD.tsx) had a positioning bug —
 * it rendered 0.1 units in front of the camera creating a full-viewport tint.
 * This DOM version is the correct active implementation.
 *
 * Positioned: bottom-left, above the LayersPanel, below the header.
 * Small and non-intrusive — it whispers the argument, doesn't shout it.
 * Hidden on mobile to preserve screen real estate.
 */

import { stateFromYear } from "@/lib/sovereignty";

type SovereigntyStackProps = {
  year: number;
};

export function SovereigntyStack({ year }: SovereigntyStackProps) {
  const state = stateFromYear(year);

  return (
    <aside
      className="pointer-events-none hidden md:block fixed left-7 bottom-24 z-20 w-[220px] rounded border border-copper/25 bg-bg/75 p-2.5 text-[10px] uppercase tracking-[0.14em] text-text backdrop-blur-sm"
      aria-label="Sovereignty Stack"
    >
      <p className="mb-2 text-[8px] tracking-[0.22em] text-copper/60">
        Sovereignty Stack
      </p>
      <div className="grid gap-1.5">
        <div className="border border-copper/15 bg-panel/50 px-2 py-1.5">
          <p className="text-[8px] text-muted/70">Governance</p>
          <p className="mt-0.5 text-[9px] text-text/80">{state.governance}</p>
        </div>
        <div className="border border-copper/15 bg-panel/50 px-2 py-1.5">
          <p className="text-[8px] text-muted/70">Value Flow</p>
          <p className="mt-0.5 text-[9px] text-text/80">{state.value}</p>
        </div>
        <div className="border border-copper/15 bg-panel/50 px-2 py-1.5">
          <p className="text-[8px] text-muted/70">Infrastructure</p>
          <p className="mt-0.5 text-[9px] text-text/80">{state.infrastructure}</p>
        </div>
      </div>
    </aside>
  );
}
