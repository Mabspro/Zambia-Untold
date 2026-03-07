"use client";

import { useEffect, useState } from "react";
import { LIVE_LAYER_CONTRACTS, type LiveLayerId, type LiveLayerPayload } from "@/lib/types";
import { INTERNAL_LIVE_LAYER_REGISTRY } from "@/lib/live/registry";

type PanelState = {
  loading: boolean;
  payload: LiveLayerPayload | null;
  error: string | null;
};

type NoradPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  counts: {
    overZambiaNow: number;
    nearZambiaNow: number;
    propagated: number;
  };
  sample: Array<{ name: string; latitude: number; longitude: number; altitudeKm: number }>;
};

function normalizeNorad(payload: NoradPayload): LiveLayerPayload {
  return {
    layer: "satellite-awareness",
    generatedAt: payload.generatedAt,
    sourceStatus: payload.sourceStatus,
    source: payload.source,
    summary: {
      headline: LIVE_LAYER_CONTRACTS["satellite-awareness"].publicHeadline,
      status: `${payload.counts.overZambiaNow} over Zambia now`,
      detail: `${payload.counts.nearZambiaNow} near Zambia · ${payload.counts.propagated} propagated objects`,
      updatedAt: payload.generatedAt,
    },
    highlights: payload.sample.slice(0, 5).map((item) => ({
      id: `${item.name}-${item.latitude.toFixed(2)}-${item.longitude.toFixed(2)}`,
      title: item.name,
      summary: `${Math.round(item.altitudeKm)} km altitude`,
      observedAt: payload.generatedAt,
      lat: item.latitude,
      lng: item.longitude,
      severity: "low",
      tags: ["NORAD"],
    })),
    diagnostics: {
      stale: payload.sourceStatus === "fallback",
      cacheTtlMs: 60_000,
      coverage: "Zambia region + near-Zambia orbital sample",
      upstream: payload.source,
    },
  };
}

export function ObservatoryDevPanel() {
  const [layers, setLayers] = useState<Record<LiveLayerId, PanelState>>(() => ({
    "surface-water": { loading: true, payload: null, error: null },
    "fire-hotspots": { loading: true, payload: null, error: null },
    "satellite-awareness": { loading: true, payload: null, error: null },
    "vegetation-anomaly": { loading: false, payload: null, error: null },
    "eo-imagery": { loading: false, payload: null, error: null },
    "air-quality": { loading: false, payload: null, error: null },
    geohazard: { loading: false, payload: null, error: null },
  }));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await Promise.all(
        INTERNAL_LIVE_LAYER_REGISTRY.map(async ({ layer, endpoint, kind }) => {
          try {
            const res = await fetch(endpoint, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = (await res.json()) as LiveLayerPayload | NoradPayload;
            const payload = kind === "norad"
              ? normalizeNorad(raw as NoradPayload)
              : (raw as LiveLayerPayload);

            if (cancelled) return;
            setLayers((prev) => ({
              ...prev,
              [layer]: { loading: false, payload, error: null },
            }));
          } catch (error) {
            if (cancelled) return;
            setLayers((prev) => ({
              ...prev,
              [layer]: {
                loading: false,
                payload: null,
                error: error instanceof Error ? error.message : "Load failed",
              },
            }));
          }
        })
      );
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="rounded border border-copper/25 bg-[#0A0806]/90 p-4">
        <p className="font-display text-[12px] uppercase tracking-[0.2em] text-copper">Observatory Lab</p>
        <p className="mt-2 text-sm leading-relaxed text-[#d8c9b4]">
          Internal contract surface for validating live layer payloads before they reach the public observatory.
        </p>
        <div className="mt-4 space-y-3 text-[11px] uppercase tracking-[0.14em] text-muted/80">
          {INTERNAL_LIVE_LAYER_REGISTRY.map(({ layer }) => {
            const contract = LIVE_LAYER_CONTRACTS[layer];
            return (
              <div key={layer} className="rounded border border-copper/15 bg-bg/50 px-3 py-2">
                <p className="text-copperSoft">{contract.label}</p>
                <p className="mt-1 text-muted/70">{contract.publicEntry} · {contract.updateCadence}</p>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="grid gap-4 xl:grid-cols-2">
        {INTERNAL_LIVE_LAYER_REGISTRY.map(({ layer }) => {
          const contract = LIVE_LAYER_CONTRACTS[layer];
          const state = layers[layer];
          return (
            <article key={layer} className="rounded border border-copper/25 bg-[rgba(10,8,6,0.92)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copper">{contract.label}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted/70">{contract.sourceLabel}</p>
                </div>
                <span className="rounded border border-copper/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-copperSoft">
                  {contract.bandwidth}
                </span>
              </div>

              {state.loading ? (
                <p className="mt-4 text-sm text-muted/80">Loading...</p>
              ) : state.error ? (
                <p className="mt-4 text-sm text-[#efb5ad]">{state.error}</p>
              ) : state.payload ? (
                <>
                  <div className="mt-4 rounded border border-copper/15 bg-bg/45 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-copperSoft">{state.payload.summary.headline}</p>
                    <p className="mt-1 text-sm text-[#f3e5cf]">{state.payload.summary.status}</p>
                    <p className="mt-1 text-sm text-muted/80">{state.payload.summary.detail}</p>
                  </div>

                  <div className="mt-4 grid gap-2 text-[11px] uppercase tracking-[0.12em] text-muted/80 sm:grid-cols-2">
                    <div className="rounded border border-copper/15 bg-bg/45 px-3 py-2">
                      <p>Source status</p>
                      <p className="mt-1 text-copperSoft">{state.payload.sourceStatus}</p>
                    </div>
                    <div className="rounded border border-copper/15 bg-bg/45 px-3 py-2">
                      <p>Coverage</p>
                      <p className="mt-1 text-copperSoft">{state.payload.diagnostics.coverage}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-copper/80">Highlights</p>
                    <div className="mt-2 space-y-2">
                      {state.payload.highlights.length > 0 ? state.payload.highlights.map((highlight) => (
                        <div key={highlight.id} className="rounded border border-copper/15 bg-bg/45 px-3 py-2">
                          <p className="text-sm text-[#f3e5cf]">{highlight.title}</p>
                          <p className="mt-1 text-sm text-muted/80">{highlight.summary}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-copperSoft/80">
                            {new Date(highlight.observedAt).toLocaleString()}
                          </p>
                        </div>
                      )) : (
                        <p className="text-sm text-muted/80">No highlights in current payload.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
