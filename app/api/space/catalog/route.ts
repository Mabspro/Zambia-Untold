import { NextResponse } from "next/server";

const WHERETHEISS_BASE = "https://api.wheretheiss.at/v1/satellites";

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
  };
}

function fallback(nowIso: string) {
  return {
    generatedAt: nowIso,
    sourceStatus: "fallback" as const,
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

export async function GET() {
  const nowIso = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const rows = await Promise.all(
      SATELLITES.map((seed) => fetchOne(seed, controller.signal).catch(() => null))
    );

    const satellites = rows.filter((row): row is NonNullable<typeof row> => row !== null);

    if (satellites.length === 0) {
      return NextResponse.json(fallback(nowIso), {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const over = satellites.filter((s) => s.overZambiaNow);
    const nearby = satellites.filter((s) => s.nearbyNow);

    return NextResponse.json(
      {
        generatedAt: nowIso,
        sourceStatus: "live" as const,
        source: "wheretheiss.at curated-set",
        satellites,
        counts: {
          tracked: SATELLITES.length,
          nearbyNow: nearby.length,
          overZambiaNow: over.length,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(fallback(nowIso), {
      headers: { "Cache-Control": "no-store" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
