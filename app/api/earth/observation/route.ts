import { NextResponse } from "next/server";
import { getCachedOrRefresh } from "@/lib/server/memoryCache";

const EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&bbox=21.9,-18.5,33.7,-8.1&limit=12";
const CACHE_KEY = "earth:observation:eonet:zambia";
const CACHE_TTL_MS = 2 * 60_000;
const CACHE_STALE_MS = 20 * 60_000;

type EONETCategory = { id: string; title: string };
type EONETGeometry = { date: string; type: string; coordinates: number[] };
type EONETEvent = {
  id: string;
  title: string;
  categories: EONETCategory[];
  geometry: EONETGeometry[];
};

type EONETResponse = {
  events?: EONETEvent[];
};

type EarthObservationData = {
  source: string;
  count: number;
  events: Array<{ id: string; title: string; categories: string[]; latestDate: string }>;
};

async function loadEonet(): Promise<EarthObservationData> {
  const nowIso = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);

  try {
    const res = await fetch(EONET_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`EONET request failed: ${res.status}`);
    }

    const payload = (await res.json()) as EONETResponse;
    const events = (payload.events ?? []).map((event) => ({
      id: event.id,
      title: event.title,
      categories: event.categories.map((category) => category.title),
      latestDate: event.geometry[event.geometry.length - 1]?.date ?? nowIso,
    }));

    return {
      source: "nasa eonet",
      count: events.length,
      events,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function fallback(nowIso: string) {
  return {
    generatedAt: nowIso,
    sourceStatus: "fallback" as const,
    source: "nasa eonet",
    events: [],
    count: 0,
  };
}

export async function GET() {
  try {
    const cached = await getCachedOrRefresh(CACHE_KEY, loadEonet, {
      ttlMs: CACHE_TTL_MS,
      staleMs: CACHE_STALE_MS,
    });

    return NextResponse.json(
      {
        generatedAt: cached.generatedAt,
        sourceStatus: cached.sourceStatus,
        source: cached.data.source,
        count: cached.data.count,
        events: cached.data.events,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    const nowIso = new Date().toISOString();
    return NextResponse.json(fallback(nowIso), {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
