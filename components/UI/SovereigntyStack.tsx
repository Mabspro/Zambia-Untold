/**
 * SovereigntyStack — DOM overlay version.
 *
 * STATUS: UNUSED / SUPERSEDED
 *
 * The active implementation is `components/Globe/SovereigntyStackHUD.tsx`,
 * which renders the Sovereignty Stack as an in-geometry WebGL HUD via
 * Drei `Html` — consistent with the "shaders and instanced meshes over DOM
 * overlays" mandate from MUSEUM_ENHANCEMENT_PLAN.md Appendix C.
 *
 * This file is retained as a DOM-render fallback in case a future use case
 * (e.g. screenshot export, accessibility mode) requires a non-WebGL version.
 * If no such use case materialises, delete this file on the next cleanup pass.
 *
 * TD-03 — tracked in TECH_AUDIT_MATRIX.md.
 */

import { stateFromYear } from "@/lib/sovereignty";

type SovereigntyStackProps = {
  year: number;
};

export function SovereigntyStack({ year }: SovereigntyStackProps) {
  const state = stateFromYear(year);

  return (
    <aside className="pointer-events-none absolute right-4 top-24 z-20 w-[270px] rounded border border-copper/35 bg-bg/70 p-3 text-[10px] uppercase tracking-[0.16em] text-text backdrop-blur-xl md:right-7 md:top-6">
      <p className="mb-3 text-[9px] tracking-[0.22em] text-copperSoft">Sovereignty Stack</p>

      <div className="grid gap-2">
        <div className="border border-copper/25 bg-panel/70 px-2 py-2">
          <p className="text-[9px] text-muted">Governance Layer</p>
          <p className="mt-1 text-[10px] text-text">{state.governance}</p>
        </div>
        <div className="border border-copper/25 bg-panel/70 px-2 py-2">
          <p className="text-[9px] text-muted">Value Layer</p>
          <p className="mt-1 text-[10px] text-text">{state.value}</p>
        </div>
        <div className="border border-copper/25 bg-panel/70 px-2 py-2">
          <p className="text-[9px] text-muted">Infrastructure Layer</p>
          <p className="mt-1 text-[10px] text-text">{state.infrastructure}</p>
        </div>
      </div>
    </aside>
  );
}
