import { NextResponse } from "next/server";

const WHERETHEISS_BASE = "https://api.wheretheiss.at/v1/satellites";
const CACHE_KEY = "catalog";
const TTL_MS = 60_000;

type SatelliteSeed = {
  id: number;
  name: string;
  operator: string;
};

type SatelliteLive = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
};

type CatalogSatellite = {
  id: number;
  name: string;
  operator: string;
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKmh: number;
  visibility: string;
  overZambiaNow: boolean;
  nearbyNow: boolean;
};

type SpaceCatalogPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  satellites: CatalogSatellite[];
  counts: {
    tracked: number;
    nearbyNow: number;
    overZambiaNow: number;
  };
};

type SpaceCatalogCountsPayload = {
  totalTracked: number;
  overZambia: number;
  timestamp: string;
  cached: boolean;
};

const SATELLITES: SatelliteSeed[] = [
  { id: 25544, name: "ISS", operator: "International" },
  { id: 20580, name: "Hubble", operator: "NASA/ESA" },
  { id: 39084, name: "Landsat 8", operator: "USGS/NASA" },
  { id: 41866, name: "GOES-16", operator: "NOAA" },
  { id: 27424, name: "Aqua", operator: "NASA" },
  { id: 25994, name: "Terra", operator: "NASA" },
  { id: 29155, name: "MetOp-A", operator: "EUMETSAT" },
  { id: 43013, name: "Sentinel-5P", operator: "ESA" },
  { id: 42063, name: "Sentinel-2B", operator: "ESA" },
  { id: 40697, name: "Sentinel-2A", operator: "ESA" },
];

const cache = new Map<string, { data: SpaceCatalogPayload; timestamp: number }>();
let inFlight: Promise<SpaceCatalogPayload> | null = null;

function normalizeLongitude(lng: number): number {
  if (lng > 180) return lng - 360;
  if (lng < -180) return lng + 360;
  return lng;
}

function inZambia(lat: number, lng: number): boolean {
  const normalized = normalizeLongitude(lng);
  return lat >= -18.5 && lat <= -8.1 && normalized >= 21.9 && normalized <= 33.7;
}

function nearZambia(lat: number, lng: number): boolean {
  const normalized = normalizeLongitude(lng);
  return lat >= -25 && lat <= 0 && normalized >= 12 && normalized <= 45;
}

async function fetchOne(seed: SatelliteSeed, signal: AbortSignal) {
  const res = await fetch(`${WHERETHEISS_BASE}/${seed.id}`, {
    signal,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const row = (await res.json()) as SatelliteLive;

  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  const alt = Number(row.altitude);
  const vel = Number(row.velocity);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(alt) || !Number.isFinite(vel)) {
    return null;
  }

  const overNow = inZambia(lat, lng);
  const nearbyNow = nearZambia(lat, lng);

  return {
    id: seed.id,
    name: seed.name,
    operator: seed.operator,
    latitude: lat,
    longitude: normalizeLongitude(lng),
    altitudeKm: alt,
    velocityKmh: vel,
    visibility: row.visibility,
    overZambiaNow: overNow,
    nearbyNow,
  } satisfies CatalogSatellite;
}

function fallback(nowIso: string): SpaceCatalogPayload {
  return {
    generatedAt: nowIso,
    sourceStatus: "fallback",
    source: "wheretheiss.at curated-set",
    satellites: [
      {
        id: 25544,
        name: "ISS",
        operator: "International",
        latitude: -12.6,
        longitude: 28.4,
        altitudeKm: 420,
        velocityKmh: 27600,
        visibility: "daylight",
        overZambiaNow: true,
        nearbyNow: true,
      },
    ],
    counts: {
      tracked: SATELLITES.length,
      nearbyNow: 1,
      overZambiaNow: 1,
    },
  };
}

async function fetchCatalogPayload(nowIso: string): Promise<SpaceCatalogPayload> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const rows = await Promise.all(
      SATELLITES.map((seed) => fetchOne(seed, controller.signal).catch(() => null))
    );

    const satellites = rows.filter((row): row is NonNullable<typeof row> => row !== null);

    if (satellites.length === 0) {
      return fallback(nowIso);
    }

    const over = satellites.filter((s) => s.overZambiaNow);
    const nearby = satellites.filter((s) => s.nearbyNow);

    return {
      generatedAt: nowIso,
      sourceStatus: "live",
      source: "wheretheiss.at curated-set",
      satellites,
      counts: {
        tracked: SATELLITES.length,
        nearbyNow: nearby.length,
        overZambiaNow: over.length,
      },
    };
  } catch {
    return fallback(nowIso);
  } finally {
    clearTimeout(timeout);
  }
}

function toCountsPayload(payload: SpaceCatalogPayload, cached: boolean): SpaceCatalogCountsPayload {
  return {
    totalTracked: payload.counts.tracked,
    overZambia: payload.counts.overZambiaNow,
    timestamp: payload.generatedAt,
    cached,
  };
}

function withCacheHeader(
  payload: SpaceCatalogPayload,
  cacheState: "HIT" | "MISS" | "STALE",
  countsOnly: boolean
) {
  const responseBody = countsOnly ? toCountsPayload(payload, cacheState !== "MISS") : payload;
  return NextResponse.json(responseBody, {
    headers: {
      "Cache-Control": "no-store",
      "X-Cache": cacheState,
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countsOnly = searchParams.get("counts") === "true";
  const cached = cache.get(CACHE_KEY);
  const nowMs = Date.now();

  if (cached && nowMs - cached.timestamp < TTL_MS) {
    return withCacheHeader(cached.data, "HIT", countsOnly);
  }

  try {
    if (!inFlight) {
      inFlight = fetchCatalogPayload(new Date().toISOString());
    }

    const fresh = await inFlight;
    cache.set(CACHE_KEY, { data: fresh, timestamp: Date.now() });
    return withCacheHeader(fresh, "MISS", countsOnly);
  } catch {
    if (cached) {
      return withCacheHeader(cached.data, "STALE", countsOnly);
    }

    const fallbackPayload = fallback(new Date().toISOString());
    cache.set(CACHE_KEY, { data: fallbackPayload, timestamp: Date.now() });
    return withCacheHeader(fallbackPayload, "MISS", countsOnly);
  } finally {
    inFlight = null;
  }
}
