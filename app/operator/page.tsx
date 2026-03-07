import type { Metadata } from "next";
import { OperatorWorkbench } from "@/components/UI/OperatorWorkbench";

export const metadata: Metadata = {
  title: "Zambia Untold | Operator",
  description: "Internal operator console for Zambia Untold live diagnostics and submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OperatorPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-[#f0e6d3] md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded border border-copper/25 bg-[linear-gradient(135deg,rgba(184,115,51,0.12)_0%,rgba(12,18,24,0.92)_36%,rgba(21,72,52,0.18)_100%)] px-5 py-4">
          <p className="font-display text-lg uppercase tracking-[0.2em] text-copper">Zambia Untold Operator</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#e6d7c2]">
            Protected internal surface for live-layer diagnostics, moderation counts, and pending submissions. This is the correct operator-facing convergence point, not the public homepage.
          </p>
        </header>
        <OperatorWorkbench />
      </div>
    </main>
  );
}
