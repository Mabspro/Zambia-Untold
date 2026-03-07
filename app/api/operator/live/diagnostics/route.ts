import { NextResponse } from "next/server";
import { LIVE_LAYER_CONTRACTS, type LiveLayerPayload } from "@/lib/types";
import { INTERNAL_LIVE_LAYER_REGISTRY } from "@/lib/live/registry";
import { isOperatorAuthorized } from "@/lib/server/requestAuth";

type NoradPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  counts: {
    overZambiaNow: number;
    nearZambiaNow: number;
    propagated: number;
  };
};

type OperatorDiagnosticItem = {
  layer: string;
  label: string;
  endpoint: string;
  ok: boolean;
  sourceStatus: "live" | "fallback" | "error";
  generatedAt: string | null;
  headline: string;
  status: string;
  detail: string;
  coverage: string;
  upstream: string;
  stale: boolean;
  error?: string;
};

function fromSharedPayload(endpoint: string, payload: LiveLayerPayload): OperatorDiagnosticItem {
  const contract = LIVE_LAYER_CONTRACTS[payload.layer];
  return {
    layer: payload.layer,
    label: contract.label,
    endpoint,
    ok: true,
    sourceStatus: payload.sourceStatus,
    generatedAt: payload.generatedAt,
    headline: payload.summary.headline,
    status: payload.summary.status,
    detail: payload.summary.detail,
    coverage: payload.diagnostics.coverage,
    upstream: payload.source,
    stale: payload.diagnostics.stale,
  };
}

function fromNorad(endpoint: string, payload: NoradPayload): OperatorDiagnosticItem {
  const contract = LIVE_LAYER_CONTRACTS["satellite-awareness"];
  return {
    layer: "satellite-awareness",
    label: contract.label,
    endpoint,
    ok: true,
    sourceStatus: payload.sourceStatus,
    generatedAt: payload.generatedAt,
    headline: contract.publicHeadline,
    status: `${payload.counts.overZambiaNow} over Zambia now`,
    detail: `${payload.counts.nearZambiaNow} near Zambia · ${payload.counts.propagated} propagated objects`,
    coverage: "Zambia region + near-Zambia orbital sample",
    upstream: payload.source,
    stale: payload.sourceStatus === "fallback",
  };
}

export async function GET(request: Request) {
  if (!isOperatorAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const baseUrl = new URL(request.url).origin;
  const generatedAt = new Date().toISOString();

  const items = await Promise.all(
    INTERNAL_LIVE_LAYER_REGISTRY.map(async ({ layer, endpoint, kind }) => {
      try {
        const res = await fetch(`${baseUrl}${endpoint}`, {
          cache: "no-store",
          headers: {
            "x-operator-token": request.headers.get("x-operator-token") ?? "",
            authorization: request.headers.get("authorization") ?? "",
            "x-moderation-token": request.headers.get("x-moderation-token") ?? "",
          },
        });

        if (!res.ok) {
          return {
            layer,
            label: LIVE_LAYER_CONTRACTS[layer].label,
            endpoint,
            ok: false,
            sourceStatus: "error" as const,
            generatedAt: null,
            headline: LIVE_LAYER_CONTRACTS[layer].publicHeadline,
            status: `HTTP ${res.status}`,
            detail: "Upstream route returned a non-success response.",
            coverage: "unknown",
            upstream: endpoint,
            stale: true,
            error: `HTTP ${res.status}`,
          };
        }

        const payload = await res.json();
        return kind === "norad"
          ? fromNorad(endpoint, payload as NoradPayload)
          : fromSharedPayload(endpoint, payload as LiveLayerPayload);
      } catch (error) {
        return {
          layer,
          label: LIVE_LAYER_CONTRACTS[layer].label,
          endpoint,
          ok: false,
          sourceStatus: "error" as const,
          generatedAt: null,
          headline: LIVE_LAYER_CONTRACTS[layer].publicHeadline,
          status: "Fetch failed",
          detail: "Operator diagnostics could not reach the route.",
          coverage: "unknown",
          upstream: endpoint,
          stale: true,
          error: error instanceof Error ? error.message : "Fetch failed",
        };
      }
    })
  );

  return NextResponse.json(
    {
      ok: true,
      generatedAt,
      count: items.length,
      items,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
