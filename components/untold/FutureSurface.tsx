"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FALLBACK_PRESENT_STATE,
  fetchUntoldPresentState,
  type UntoldPresentState,
} from "@/lib/untold/present-state";

type FuturePillar = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

const FUTURE_PILLARS: FuturePillar[] = [
  {
    id: "sovereign-compute",
    title: "Sovereign Compute",
    description:
      "Compute capacity rooted close to the country, so infrastructure value does not always leave before it compounds.",
    href: "https://coppercloud-orchestrator.vercel.app",
  },
  {
    id: "native-data",
    title: "Native Data",
    description:
      "Public signals, archives, and operational records shaped with Zambian context rather than imported defaults.",
  },
  {
    id: "local-ai-possibility",
    title: "Local AI Possibility",
    description:
      "Applied intelligence that understands local systems, language, and stakes instead of treating Zambia as an afterthought.",
  },
] as const;

function formatNumber(value: number | null, digits = 2): string {
  if (value === null) return "—";
  return value.toFixed(digits);
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-ZM", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTrend(direction: UntoldPresentState["fx"]["direction"]): string {
  switch (direction) {
    case "up":
      return "Up";
    case "down":
      return "Down";
    case "flat":
      return "Stable";
    default:
      return "Unknown";
  }
}

function formatHydrology(status: UntoldPresentState["hydrology"]["status"]): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "stressed":
      return "Stressed";
    case "critical":
      return "Critical";
    default:
      return "Unknown";
  }
}

function formatHealth(status: UntoldPresentState["railHealth"]["status"]): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    case "stale":
      return "Stale";
    default:
      return "Unknown";
  }
}

function NativeDataCard({
  data,
  loading,
}: {
  data: UntoldPresentState;
  loading: boolean;
}) {
  return (
    <article className="rounded border border-[#76d7ff]/22 bg-[#071117]/82 px-5 py-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.18em] text-[#9fe7ff]">
            Native Data
          </p>
          <h2 className="mt-3 font-display text-2xl text-[#ecfbff]">Signals Now Live</h2>
        </div>
        <span
          className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
            data.sourceStatus === "live"
              ? "border-[#76d7ff]/35 bg-[#76d7ff]/10 text-[#bceeff]"
              : "border-copper/30 bg-copper/10 text-copperSoft"
          }`}
        >
          {data.sourceStatus === "live" ? "Live Signal" : loading ? "Checking" : "Unavailable"}
        </span>
      </div>

      <p className="mt-3 text-[14px] leading-7 text-[#c9dfe6]">
        Public signals from zambiamacro.ai are now feeding the platform. This is the first live proof
        that Future Zambia can be anchored in native data rather than generic placeholders.
      </p>

      <div className="mt-4 grid gap-2">
        <div className="border border-[#76d7ff]/16 bg-[#0b1a20]/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#9fe7ff]">Power Stress</p>
          <p className="mt-1 text-[13px] text-[#ecfbff]">
            {formatNumber(data.psi.value)} / {data.psi.regime ?? "—"}
          </p>
        </div>
        <div className="border border-[#76d7ff]/16 bg-[#0b1a20]/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#9fe7ff]">Kariba Storage</p>
          <p className="mt-1 text-[13px] text-[#ecfbff]">
            {data.hydrology.karibaPercent === null ? "—" : `${data.hydrology.karibaPercent.toFixed(1)}%`} / {formatHydrology(data.hydrology.status)}
          </p>
        </div>
        <div className="border border-[#76d7ff]/16 bg-[#0b1a20]/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#9fe7ff]">FX + Rail</p>
          <p className="mt-1 text-[13px] text-[#ecfbff]">
            {data.fx.pair} {formatNumber(data.fx.value)} / {formatTrend(data.fx.direction)} · {formatHealth(data.railHealth.status)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#a9c2c9]">
          Last updated: {formatDate(data.psi.updatedAt)}
        </p>
        <Link
          href="https://zambiamacro.ai"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded border border-[#76d7ff]/30 bg-[#76d7ff]/8 px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-[#bceeff] transition-colors hover:border-[#76d7ff]/45 hover:bg-[#76d7ff]/12"
        >
          Full analysis
        </Link>
      </div>
    </article>
  );
}

function SovereignComputeCard({ pillar }: { pillar: FuturePillar }) {
  return (
    <article className="rounded border border-copper/18 bg-[#0b0907]/76 px-5 py-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copperSoft">
            Sovereign Compute
          </p>
          <h2 className="mt-3 font-display text-2xl text-[#f0dfc3]">Infrastructure Signal</h2>
        </div>
        <span className="rounded border border-copper/24 bg-copper/8 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-copperSoft">
          Research live
        </span>
      </div>

      <p className="mt-3 text-[14px] leading-7 text-muted">
        CopperCloud frames Zambia&apos;s renewable energy advantage as the base layer for telecom,
        cloud, and AI, with a phased path from pilot validation to grid-scale sovereign compute.
      </p>

      <div className="mt-4 grid gap-2">
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">Phase I</p>
          <p className="mt-1 text-[13px] text-text/85">120MW pilot / sovereign cloud validation</p>
        </div>
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">Phase II</p>
          <p className="mt-1 text-[13px] text-text/85">200MW+ cluster / multi-site redundancy</p>
        </div>
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">Phase III</p>
          <p className="mt-1 text-[13px] text-text/85">1.6GW grid integration / distributed compute</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted/75">
          Source: coppercloud.ai roadmap + doctrine
        </p>
        {pillar.href ? (
          <Link
            href={pillar.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded border border-copper/30 bg-copper/8 px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-copper transition-colors hover:border-copper hover:bg-copper/12"
          >
            Explore CopperCloud
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function FutureSurface() {
  const [presentState, setPresentState] = useState<UntoldPresentState>(FALLBACK_PRESENT_STATE);
  const [presentLoading, setPresentLoading] = useState(true);

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
    html.classList.add("route-scroll-mode");
    body.classList.add("route-scroll-mode");

    return () => {
      html.style.overflowY = prevHtmlOverflowY;
      body.style.overflowY = prevBodyOverflowY;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
      html.classList.remove("route-scroll-mode");
      body.classList.remove("route-scroll-mode");
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setPresentLoading(true);
      const next = await fetchUntoldPresentState();
      if (!cancelled) {
        setPresentState(next);
        setPresentLoading(false);
      }
    };

    load();
    const intervalId = setInterval(load, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main className="route-scroll-surface relative isolate min-h-screen bg-[#050608] text-[#eadbc4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,115,51,0.12),_transparent_40%),linear-gradient(180deg,_rgba(6,7,9,0.92),_rgba(3,4,6,0.98))]" />
      <div className="relative mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-10">
        <section className="rounded border border-copper/22 bg-[#0b0907]/78 px-4 py-4 backdrop-blur-sm md:px-8 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="font-display text-[12px] uppercase tracking-[0.22em] text-copperSoft">
                Future Zambia
              </p>
              <h1 className="mt-3 font-display text-[2.35rem] leading-none text-copper md:text-5xl">
                The Next Layer Is Still Being Built
              </h1>
              <p className="mt-3 text-[14px] leading-7 text-[#eadbc4] md:mt-4 md:text-[16px] md:leading-8">
                This route holds the technology trajectory in view: sovereign compute, native data,
                and the possibility of local AI systems built with Zambia in mind from the start.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
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

        <section className="mt-5 grid gap-3 md:mt-8 md:gap-4 md:grid-cols-3">
          {FUTURE_PILLARS.map((pillar) => {
            if (pillar.id === "sovereign-compute") {
              return <SovereignComputeCard key={pillar.id} pillar={pillar} />;
            }

            if (pillar.id === "native-data") {
              return (
                <NativeDataCard
                  key={pillar.id}
                  data={presentState}
                  loading={presentLoading}
                />
              );
            }

            return (
              <article
                key={pillar.id}
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
            );
          })}
        </section>
      </div>
    </main>
  );
}
