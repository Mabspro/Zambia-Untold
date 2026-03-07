import { NextResponse } from "next/server";
import { getCachedOrRefresh } from "@/lib/server/memoryCache";
import { buildFallbackLayerPayload, buildLiveLayerPayload } from "@/lib/live/payloads";

const WATER_EVENTS_URL = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=severeStorms&bbox=21.9,-18.5,33.7,-8.1&limit=20";
const CACHE_KEY = "earth:water:zambia";
const CACHE_TTL_MS = 6 * 60 * 60_000;
const CACHE_STALE_MS = 24 * 60 * 60_000;

type EonetCategory = { title: string };
type EonetGeometry = { date: string; coordinates: number[] };
type EonetEvent = {
  id: string;
  title: string;
  categories: EonetCategory[];
  geometry: EonetGeometry[];
};

type EonetResponse = { events?: EonetEvent[] };

async function loadWaterLayer() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);

  try {
    const res = await fetch(WATER_EVENTS_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Water events request failed: ${res.status}`);
    }

    const payload = (await res.json()) as EonetResponse;
    const floodLikeEvents = (payload.events ?? []).filter((event) =>
      /flood|storm|water|rain/i.test(event.title)
    );

    const highlights = floodLikeEvents.slice(0, 6).map((event) => {
      const latest = event.geometry[event.geometry.length - 1];
      const longitude = latest?.coordinates?.[0];
      const latitude = latest?.coordinates?.[1];
      return {
        id: event.id,
        title: event.title,
        summary: "Hydrology-relevant event affecting the Zambia region.",
        observedAt: latest?.date ?? new Date().toISOString(),
        lat: Number.isFinite(latitude) ? latitude : undefined,
        lng: Number.isFinite(longitude) ? longitude : undefined,
        severity: "medium" as const,
        tags: event.categories.map((category) => category.title),
      };
    });

    return buildLiveLayerPayload({
      layer: "surface-water",
      source: "nasa eonet severe storm events",
      headline: "Surface water now",
      status: highlights.length > 0 ? `${highlights.length} current hydrology-linked events in the Zambia region` : "No open hydrology-linked events in the Zambia region",
      detail: "Transitional water watch route until Digital Earth Africa WOfS and waterbody services are integrated.",
      highlights,
      cacheTtlMs: CACHE_TTL_MS,
      coverage: "Zambia region bbox",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    const cached = await getCachedOrRefresh(CACHE_KEY, loadWaterLayer, {
      ttlMs: CACHE_TTL_MS,
      staleMs: CACHE_STALE_MS,
    });

    return NextResponse.json(
      cached.data,
      { headers: { "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json(
      buildFallbackLayerPayload({
        layer: "surface-water",
        source: "nasa eonet severe storm events",
        headline: "Surface water now",
        status: "Water feed unavailable",
        detail: "Fallback only. DE Africa WOfS and waterbody monitoring should replace this transitional route.",
        cacheTtlMs: CACHE_TTL_MS,
        coverage: "Zambia region bbox",
      }),
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
