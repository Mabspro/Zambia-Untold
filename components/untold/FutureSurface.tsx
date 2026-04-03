"use client";

import Link from "next/link";
import { useEffect } from "react";

type FuturePillar = {
  title: string;
  description: string;
  href?: string;
};

const FUTURE_PILLARS: FuturePillar[] = [
  {
    title: "Sovereign Compute",
    description:
      "Compute capacity rooted close to the country, so infrastructure value does not always leave before it compounds.",
    href: "https://coppercloud-orchestrator.vercel.app",
  },
  {
    title: "Native Data",
    description:
      "Public signals, archives, and operational records shaped with Zambian context rather than imported defaults.",
  },
  {
    title: "Local AI Possibility",
    description:
      "Applied intelligence that understands local systems, language, and stakes instead of treating Zambia as an afterthought.",
  },
] as const;

export function FutureSurface() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflowY = html.style.overflowY;
    const prevBodyOverflowY = body.style.overflowY;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    html.style.overflowY = "auto";
    body.style.overflowY = "auto";
    html.style.height = "auto";
    body.style.height = "auto";

    return () => {
      html.style.overflowY = prevHtmlOverflowY;
      body.style.overflowY = prevBodyOverflowY;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
    };
  }, []);

  return (
    <main className="relative isolate min-h-screen bg-[#050608] text-[#eadbc4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,115,51,0.12),_transparent_40%),linear-gradient(180deg,_rgba(6,7,9,0.92),_rgba(3,4,6,0.98))]" />
      <div className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <section className="rounded border border-copper/22 bg-[#0b0907]/78 px-6 py-6 backdrop-blur-sm md:px-8 md:py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="font-display text-[12px] uppercase tracking-[0.22em] text-copperSoft">
                Future Zambia
              </p>
              <h1 className="mt-3 font-display text-4xl text-copper md:text-5xl">
                The Next Layer Is Still Being Built
              </h1>
              <p className="mt-4 text-[15px] leading-8 text-[#eadbc4] md:text-[16px]">
                This route holds the technology trajectory in view: sovereign compute, native data,
                and the possibility of local AI systems built with Zambia in mind from the start.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="min-h-11 rounded border border-copper/30 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-copperSoft transition-colors hover:border-copper/45 hover:text-copper"
              >
                Return to Museum
              </Link>
              <Link
                href="/archive"
                className="min-h-11 rounded border border-copper/20 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-copperSoft transition-colors hover:border-copper/35 hover:text-copper"
              >
                Open Archive
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {FUTURE_PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded border border-copper/18 bg-[#0b0907]/76 px-5 py-5 backdrop-blur-sm"
            >
              <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copperSoft">
                Coming soon
              </p>
              <h2 className="mt-3 font-display text-2xl text-[#f0dfc3]">{pillar.title}</h2>
              <p className="mt-3 text-[14px] leading-7 text-muted">{pillar.description}</p>
              {pillar.href ? (
                <Link
                  href={pillar.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center rounded border border-copper/30 bg-copper/8 px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-copper transition-colors hover:border-copper hover:bg-copper/12"
                >
                  Explore CopperCloud
                </Link>
              ) : (
                <span className="mt-5 inline-flex min-h-11 items-center rounded border border-copper/18 px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-muted/75">
                  Coming soon
                </span>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
