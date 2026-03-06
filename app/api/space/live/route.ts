import { NextResponse } from "next/server";

const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";
const AU_KM = 149_597_870.7;
const CACHE_KEY = "live";
const TTL_MS = 30_000;

type IssResponse = {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  velocity?: number;
};

type SpaceLivePayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  iss: {
    latitude: number;
    longitude: number;
    altitudeKm: number;
    velocityKmh: number;
    overheadZambia: boolean;
  };
  earthMarsDistanceKm: number;
  satellitesOverZambiaEstimate: number;
};

const cache = new Map<string, { data: SpaceLivePayload; timestamp: number }>();
let inFlight: Promise<SpaceLivePayload> | null = null;

function normalizeLongitude(lng: number): number {
  if (lng > 180) return lng - 360;
  if (lng < -180) return lng + 360;
  return lng;
}

function isOverZambia(lat: number, lng: number): boolean {
  const long = normalizeLongitude(lng);
  return lat >= -18.5 && lat <= -8.1 && long >= 21.9 && long <= 33.7;
}

function estimateEarthMarsDistanceKm(now: Date): number {
  const start = Date.UTC(2026, 0, 1);
  const days = (now.getTime() - start) / 86_400_000;
  const earthTheta = (2 * Math.PI * days) / 365.256;
  const marsTheta = (2 * Math.PI * days) / 686.98 + 1.1;

  const earthX = Math.cos(earthTheta);
  const earthY = Math.sin(earthTheta);
  const marsRadius = 1.523679;
  const marsX = marsRadius * Math.cos(marsTheta);
  const marsY = marsRadius * Math.sin(marsTheta);

  const dx = marsX - earthX;
  const dy = marsY - earthY;
  return Math.sqrt(dx * dx + dy * dy) * AU_KM;
}

function fallbackPayload(now: Date): SpaceLivePayload {
  const earthMarsDistanceKm = estimateEarthMarsDistanceKm(now);
  return {
    generatedAt: now.toISOString(),
    sourceStatus: "fallback",
    iss: {
      latitude: -12.7,
      longitude: 28.2,
      altitudeKm: 420,
      velocityKmh: 27_600,
      overheadZambia: true,
    },
    earthMarsDistanceKm,
    satellitesOverZambiaEstimate: 5,
  };
}

async function fetchLivePayload(now: Date): Promise<SpaceLivePayload> {
  const fallback = fallbackPayload(now);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch(ISS_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) return fallback;

    const iss = (await res.json()) as IssResponse;
    const latitude = Number(iss.latitude);
    const longitude = Number(iss.longitude);
    const altitudeKm = Number(iss.altitude);
    const velocityKmh = Number(iss.velocity);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(altitudeKm) ||
      !Number.isFinite(velocityKmh)
    ) {
      return fallback;
    }

    const overhead = isOverZambia(latitude, longitude);

    return {
      generatedAt: now.toISOString(),
      sourceStatus: "live",
      iss: {
        latitude,
        longitude: normalizeLongitude(longitude),
        altitudeKm,
        velocityKmh,
        overheadZambia: overhead,
      },
      earthMarsDistanceKm: estimateEarthMarsDistanceKm(now),
      satellitesOverZambiaEstimate: overhead ? 6 : 4,
    };
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

function withCacheHeader(data: SpaceLivePayload, cacheState: "HIT" | "MISS" | "STALE") {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
      "X-Cache": cacheState,
    },
  });
}

export async function GET() {
  const nowMs = Date.now();
  const cached = cache.get(CACHE_KEY);

  if (cached && nowMs - cached.timestamp < TTL_MS) {
    return withCacheHeader(cached.data, "HIT");
  }

  try {
    if (!inFlight) {
      inFlight = fetchLivePayload(new Date());
    }

    const fresh = await inFlight;
    cache.set(CACHE_KEY, { data: fresh, timestamp: Date.now() });
    return withCacheHeader(fresh, "MISS");
  } catch {
    if (cached) {
      return withCacheHeader(cached.data, "STALE");
    }

    const fallback = fallbackPayload(new Date());
    cache.set(CACHE_KEY, { data: fallback, timestamp: Date.now() });
    return withCacheHeader(fallback, "MISS");
  } finally {
    inFlight = null;
  }
}
