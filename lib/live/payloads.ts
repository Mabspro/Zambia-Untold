import type { LiveLayerHighlight, LiveLayerId, LiveLayerPayload } from "@/lib/live/contracts";

export function buildFallbackLayerPayload(args: {
  layer: LiveLayerId;
  source: string;
  headline: string;
  status: string;
  detail: string;
  highlights?: LiveLayerHighlight[];
  cacheTtlMs: number;
  coverage: string;
  generatedAt?: string;
}): LiveLayerPayload {
  const generatedAt = args.generatedAt ?? new Date().toISOString();

  return {
    layer: args.layer,
    generatedAt,
    sourceStatus: "fallback",
    source: args.source,
    summary: {
      headline: args.headline,
      status: args.status,
      detail: args.detail,
      updatedAt: generatedAt,
    },
    highlights: args.highlights ?? [],
    diagnostics: {
      stale: true,
      cacheTtlMs: args.cacheTtlMs,
      coverage: args.coverage,
      upstream: args.source,
    },
  };
}

export function buildLiveLayerPayload(args: {
  layer: LiveLayerId;
  source: string;
  headline: string;
  status: string;
  detail: string;
  highlights?: LiveLayerHighlight[];
  cacheTtlMs: number;
  coverage: string;
  generatedAt?: string;
}): LiveLayerPayload {
  const generatedAt = args.generatedAt ?? new Date().toISOString();

  return {
    layer: args.layer,
    generatedAt,
    sourceStatus: "live",
    source: args.source,
    summary: {
      headline: args.headline,
      status: args.status,
      detail: args.detail,
      updatedAt: generatedAt,
    },
    highlights: args.highlights ?? [],
    diagnostics: {
      stale: false,
      cacheTtlMs: args.cacheTtlMs,
      coverage: args.coverage,
      upstream: args.source,
    },
  };
}
