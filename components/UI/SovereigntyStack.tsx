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
      className="group pointer-events-auto hidden md:block fixed left-7 bottom-24 z-20 w-[220px] rounded border border-copper/25 bg-bg/75 p-2.5 text-[11px] uppercase tracking-[0.14em] text-text backdrop-blur-sm"
      aria-label="Sovereignty Stack"
    >
      <p className="mb-2 text-[11px] tracking-[0.22em] text-copper/80">
        Sovereignty Stack
      </p>
      <div className="museum-tooltip absolute -top-16 left-0 w-[280px] border border-copper/30 bg-[#0A0806] px-2 py-1.5 text-[11px] leading-relaxed text-copperSoft whitespace-pre-line">
        {"How power, value, and infrastructure\nhave moved through this epoch."}
      </div>
      <div className="grid gap-1.5">
        <div className="border border-copper/15 bg-panel/50 px-2 py-1.5">
          <p className="text-[11px] text-muted/80">Governance</p>
          <p className="mt-0.5 text-[11px] text-text/80">{state.governance}</p>
        </div>
        <div className="border border-copper/15 bg-panel/50 px-2 py-1.5">
          <p className="text-[11px] text-muted/80">Value Flow</p>
          <p className="mt-0.5 text-[11px] text-text/80">{state.value}</p>
        </div>
        <div className="border border-copper/15 bg-panel/50 px-2 py-1.5">
          <p className="text-[11px] text-muted/80">Infrastructure</p>
          <p className="mt-0.5 text-[11px] text-text/80">{state.infrastructure}</p>
        </div>
      </div>
    </aside>
  );
}
