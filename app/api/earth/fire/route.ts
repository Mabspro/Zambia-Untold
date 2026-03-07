import { NextResponse } from "next/server";
import { getCachedOrRefresh } from "@/lib/server/memoryCache";
import { buildFallbackLayerPayload, buildLiveLayerPayload } from "@/lib/live/payloads";

const FIRE_EVENTS_URL = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires&bbox=21.9,-18.5,33.7,-8.1&limit=20";
const CACHE_KEY = "earth:fire:zambia";
const CACHE_TTL_MS = 2 * 60_000;
const CACHE_STALE_MS = 20 * 60_000;

type EonetCategory = { title: string };
type EonetGeometry = { date: string; coordinates: number[] };
type EonetEvent = {
  id: string;
  title: string;
  categories: EonetCategory[];
  geometry: EonetGeometry[];
};

type EonetResponse = { events?: EonetEvent[] };

async function loadFireLayer() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);

  try {
    const res = await fetch(FIRE_EVENTS_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Fire events request failed: ${res.status}`);
    }

    const payload = (await res.json()) as EonetResponse;
    const highlights = (payload.events ?? []).slice(0, 6).map((event) => {
      const latest = event.geometry[event.geometry.length - 1];
      const longitude = latest?.coordinates?.[0];
      const latitude = latest?.coordinates?.[1];
      return {
        id: event.id,
        title: event.title,
        summary: "Recent fire activity detected in the Zambia region.",
        observedAt: latest?.date ?? new Date().toISOString(),
        lat: Number.isFinite(latitude) ? latitude : undefined,
        lng: Number.isFinite(longitude) ? longitude : undefined,
        severity: "medium" as const,
        tags: event.categories.map((category) => category.title),
      };
    });

    return buildLiveLayerPayload({
      layer: "fire-hotspots",
      source: "nasa eonet wildfire events",
      headline: "Active fire hotspots",
      status: highlights.length > 0 ? `${highlights.length} recent fire events in the Zambia region` : "No open fire events in the Zambia region",
      detail: "Transitional fire signal using NASA event feeds until FIRMS hotspot ingestion is added.",
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
    const cached = await getCachedOrRefresh(CACHE_KEY, loadFireLayer, {
      ttlMs: CACHE_TTL_MS,
      staleMs: CACHE_STALE_MS,
    });

    return NextResponse.json(
      cached.data,
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json(
      buildFallbackLayerPayload({
        layer: "fire-hotspots",
        source: "nasa eonet wildfire events",
        headline: "Active fire hotspots",
        status: "Fire feed unavailable",
        detail: "Fallback only. FIRMS-backed hotspot ingestion should replace this transitional route.",
        cacheTtlMs: CACHE_TTL_MS,
        coverage: "Zambia region bbox",
      }),
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
