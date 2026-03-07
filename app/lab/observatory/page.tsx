import type { Metadata } from "next";
import { ObservatoryDevPanel } from "@/components/UI/ObservatoryDevPanel";

export const metadata: Metadata = {
  title: "Zambia Untold | Observatory Lab",
  description: "Internal live layer contract surface for Zambia Untold.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ObservatoryLabPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-[#f0e6d3] md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded border border-copper/25 bg-[linear-gradient(135deg,rgba(184,115,51,0.12)_0%,rgba(12,18,24,0.92)_36%,rgba(21,72,52,0.18)_100%)] px-5 py-4">
          <p className="font-display text-lg uppercase tracking-[0.2em] text-copper">Zambia Untold Observatory Lab</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#e6d7c2]">
            Internal route for validating live layer contracts, transitional fire and water feeds, and future observatory payload shape before public rollout.
          </p>
        </header>
        <ObservatoryDevPanel />
      </div>
    </main>
  );
}
