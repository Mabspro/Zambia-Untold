"use client";

import { useEffect, useState } from "react";
import {
  FALLBACK_PRESENT_STATE,
  fetchUntoldPresentState,
  type UntoldPresentState,
} from "@/lib/untold/present-state";

type PresentSignalStripProps = {
  active: boolean;
  mobileBottomOffset: number;
  onMobileClose?: () => void;
};

function formatNumber(value: number | null, digits = 2): string {
  if (value === null) return "—";
  return value.toFixed(digits);
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-ZM", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

function SignalBody({ data, loading }: { data: UntoldPresentState; loading: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copperSoft">
            Present Signal
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#d8c9b4]">
            Zambia macro context from zambiamacro.ai, surfaced as a quiet present-state rail.
          </p>
        </div>
        <span
          className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
            data.sourceStatus === "live"
              ? "border-[#76d7ff]/35 bg-[#76d7ff]/10 text-[#bceeff]"
              : "border-copper/30 bg-copper/10 text-copperSoft"
          }`}
        >
          {data.sourceStatus === "live" ? "Live Signal" : loading ? "Checking" : "Signal Unavailable"}
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">Power Stress</p>
          <p className="mt-1 text-[13px] text-text/85">
            {formatNumber(data.psi.value)} / {data.psi.regime ?? "—"}
          </p>
        </div>
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">Kariba Storage</p>
          <p className="mt-1 text-[13px] text-text/85">
            {data.hydrology.karibaPercent === null ? "—" : `${data.hydrology.karibaPercent.toFixed(1)}%`} / {formatHydrology(data.hydrology.status)}
          </p>
        </div>
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">FX</p>
          <p className="mt-1 text-[13px] text-text/85">
            {data.fx.pair} {formatNumber(data.fx.value)} / {formatTrend(data.fx.direction)}
          </p>
        </div>
        <div className="border border-copper/18 bg-panel/55 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-copper/85">System Health</p>
          <p className="mt-1 text-[13px] text-text/85">
            {data.railHealth.label} / {formatHealth(data.railHealth.status)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted/75">
          Last updated: {formatDate(data.psi.updatedAt)}
        </p>
        <a
          href="https://zambiamacro.ai"
          target="_blank"
          rel="noreferrer"
          className="rounded border border-copper/30 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-copperSoft transition-colors hover:border-copper/45 hover:text-copper"
        >
          Full analysis
        </a>
      </div>
    </>
  );
}

export function PresentSignalStrip({ active, mobileBottomOffset, onMobileClose }: PresentSignalStripProps) {
  const [data, setData] = useState<UntoldPresentState>(FALLBACK_PRESENT_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const next = await fetchUntoldPresentState();
      if (!cancelled) {
        setData(next);
        setLoading(false);
      }
    };

    load();
    const intervalId = setInterval(load, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <aside
        className="pointer-events-auto fixed left-7 z-20 hidden w-[280px] rounded border border-copper/25 bg-bg/78 p-3 backdrop-blur-sm md:block"
        style={{ bottom: "calc(10rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <SignalBody data={data} loading={loading} />
      </aside>
      <aside
        className="pointer-events-auto absolute left-3 right-3 z-20 rounded border border-copper/25 bg-bg/88 p-3 backdrop-blur-sm md:hidden"
        style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${mobileBottomOffset}px)` }}
      >
        {onMobileClose && (
          <div className="mb-3 flex items-center justify-end">
            <button
              type="button"
              onClick={onMobileClose}
              className="min-h-10 rounded border border-[#cf5b5b]/35 bg-[#cf5b5b]/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[#ffc1c1] transition-colors hover:border-[#e06d6d] hover:bg-[#cf5b5b]/16 hover:text-[#ffe0e0]"
            >
              Close
            </button>
          </div>
        )}
        <SignalBody data={data} loading={loading} />
      </aside>
    </>
  );
}
