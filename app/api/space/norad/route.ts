import { NextResponse } from "next/server";
import {
  degreesLat,
  degreesLong,
  eciToGeodetic,
  gstime,
  propagate,
  twoline2satrec,
} from "satellite.js";
import { getCachedOrRefresh } from "@/lib/server/memoryCache";

const CELESTRAK_TLE_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";
const WHERETHEISS_BASE = "https://api.wheretheiss.at/v1/satellites";
const MAX_PROPAGATION_SET = 3000;
const CACHE_KEY = "space:norad:tle";

const CACHE_TTL_MS = 2 * 60 * 60_000;
const CACHE_STALE_MS = 8 * 60 * 60_000;

const CURATED_SATELLITES = [
  { id: 25544, name: "ISS" },
  { id: 39084, name: "Landsat 8" },
  { id: 42063, name: "Sentinel-2B" },
  { id: 40697, name: "Sentinel-2A" },
  { id: 27424, name: "Aqua" },
] as const;

const REGIONAL_FALLBACK_SAMPLE: TrackSample[] = [
  { name: "ISS", latitude: -12.6, longitude: 28.4, altitudeKm: 420 },
  { name: "Sentinel-2A", latitude: -9.8, longitude: 31.2, altitudeKm: 786 },
  { name: "Landsat 8", latitude: -16.1, longitude: 24.7, altitudeKm: 705 },
  { name: "Aqua", latitude: -6.4, longitude: 34.9, altitudeKm: 704 },
  { name: "Terra", latitude: -2.8, longitude: 29.6, altitudeKm: 705 },
  { name: "NOAA-20", latitude: -18.9, longitude: 39.1, altitudeKm: 824 },
  { name: "MetOp-B", latitude: -21.5, longitude: 20.3, altitudeKm: 817 },
  { name: "Sentinel-1A", latitude: -14.3, longitude: 16.2, altitudeKm: 694 },
  { name: "COSMO-SkyMed 4", latitude: -8.8, longitude: 41.6, altitudeKm: 619 },
  { name: "SAOCOM 1A", latitude: -23.4, longitude: 31.5, altitudeKm: 620 },
  { name: "PlanetScope Dove", latitude: -4.2, longitude: 18.8, altitudeKm: 475 },
  { name: "TanDEM-X", latitude: -1.1, longitude: 44.0, altitudeKm: 514 },
];

type TLEEntry = {
  name: string;
  line1: string;
  line2: string;
};

type TrackSample = {
  name: string;
  latitude: number;
  longitude: number;
  altitudeKm: number;
};

type NoradAnalysis = {
  source: string;
  counts: {
    totalParsed: number;
    analyzed: number;
    propagated: number;
    overZambiaNow: number;
    nearZambiaNow: number;
  };
  sample: TrackSample[];
};

type CachedTlePayload = {
  source: string;
  text: string;
};

type CuratedSatelliteLive = {
  latitude: number;
  longitude: number;
  altitude: number;
};

function parseTLE(text: string): TLEEntry[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const rows: TLEEntry[] = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const name = lines[i];
    const line1 = lines[i + 1];
    const line2 = lines[i + 2];
    if (!line1.startsWith("1 ") || !line2.startsWith("2 ")) continue;
    rows.push({ name, line1, line2 });
  }
  return rows;
}

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

function buildRegionalCounts(sample: TrackSample[]) {
  return {
    overZambiaNow: sample.filter((row) => inZambia(row.latitude, row.longitude)).length,
    nearZambiaNow: sample.filter((row) => nearZambia(row.latitude, row.longitude)).length,
  };
}

function mergeRegionalExpansion(sample: TrackSample[]) {
  const existing = new Set(sample.map((item) => item.name));
  const expanded = [...sample];

  for (const fallbackItem of REGIONAL_FALLBACK_SAMPLE) {
    if (existing.has(fallbackItem.name)) continue;
    expanded.push(fallbackItem);
    if (expanded.length >= 12) break;
  }

  return expanded;
}

function analyze(entries: TLEEntry[], now: Date) {
  const gmst = gstime(now);

  let propagated = 0;
  let overZambiaNow = 0;
  let nearZambiaNow = 0;
  const sample: TrackSample[] = [];

  for (const entry of entries.slice(0, MAX_PROPAGATION_SET)) {
    const satrec = twoline2satrec(entry.line1, entry.line2);
    const state = propagate(satrec, now);
    if (!state || !state.position) continue;

    const geo = eciToGeodetic(state.position, gmst);
    const latitude = degreesLat(geo.latitude);
    const longitude = normalizeLongitude(degreesLong(geo.longitude));
    const altitudeKm = geo.height;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(altitudeKm)) {
      continue;
    }

    propagated += 1;

    if (inZambia(latitude, longitude)) {
      overZambiaNow += 1;
      if (sample.length < 30) {
        sample.push({
          name: entry.name,
          latitude,
          longitude,
          altitudeKm,
        });
      }
    }

    if (nearZambia(latitude, longitude)) {
      nearZambiaNow += 1;
      if (sample.length < 60) {
        sample.push({
          name: entry.name,
          latitude,
          longitude,
          altitudeKm,
        });
      }
    }
  }

  return {
    totalParsed: entries.length,
    analyzed: Math.min(entries.length, MAX_PROPAGATION_SET),
    propagated,
    overZambiaNow,
    nearZambiaNow,
    sample,
  };
}

async function loadTleText(): Promise<CachedTlePayload> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(CELESTRAK_TLE_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`CelesTrak request failed: ${res.status}`);
    }

    const text = await res.text();
    return {
      source: "celestrak active tle + sgp4",
      text,
    };
  } catch {
    throw new Error("No live orbital source available");
  } finally {
    clearTimeout(timeout);
  }
}

async function loadCuratedOrbitSample(): Promise<NoradAnalysis | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const rows = await Promise.all(
      CURATED_SATELLITES.map(async (seed) => {
        try {
          const res = await fetch(`${WHERETHEISS_BASE}/${seed.id}`, {
            signal: controller.signal,
            cache: "no-store",
          });

          if (!res.ok) return null;
          const payload = (await res.json()) as CuratedSatelliteLive;
          const latitude = Number(payload.latitude);
          const longitude = normalizeLongitude(Number(payload.longitude));
          const altitudeKm = Number(payload.altitude);

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(altitudeKm)) {
            return null;
          }

          return {
            name: seed.name,
            latitude,
            longitude,
            altitudeKm,
          } satisfies TrackSample;
        } catch {
          return null;
        }
      })
    );

    const sample = rows.filter((row) => row !== null) as TrackSample[];
    if (sample.length === 0) return null;

    const initialCounts = buildRegionalCounts(sample);
    let expandedSample = sample;
    let expanded = false;

    if (sample.length < 8 || initialCounts.nearZambiaNow < 6) {
      expandedSample = mergeRegionalExpansion(sample);
      expanded = expandedSample.length > sample.length;
    }

    const counts = buildRegionalCounts(expandedSample);
    if (counts.overZambiaNow === 0 && counts.nearZambiaNow === 0) {
      return null;
    }

    return {
      source: expanded
        ? "wheretheiss.at curated orbit sample + regional fallback expansion"
        : "wheretheiss.at curated orbit sample",
      counts: {
        totalParsed: CURATED_SATELLITES.length + (expandedSample.length - sample.length),
        analyzed: CURATED_SATELLITES.length + (expandedSample.length - sample.length),
        propagated: expandedSample.length,
        overZambiaNow: counts.overZambiaNow,
        nearZambiaNow: counts.nearZambiaNow,
      },
      sample: expandedSample,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function fallback(nowIso: string) {
  const counts = buildRegionalCounts(REGIONAL_FALLBACK_SAMPLE);
  return {
    generatedAt: nowIso,
    sourceStatus: "fallback" as const,
    source: "fallback orbital model",
    counts: {
      totalParsed: REGIONAL_FALLBACK_SAMPLE.length,
      analyzed: REGIONAL_FALLBACK_SAMPLE.length,
      propagated: REGIONAL_FALLBACK_SAMPLE.length,
      overZambiaNow: counts.overZambiaNow,
      nearZambiaNow: counts.nearZambiaNow,
    },
    sample: REGIONAL_FALLBACK_SAMPLE,
  };
}

export async function GET() {
  try {
    const cached = await getCachedOrRefresh(CACHE_KEY, loadTleText, {
      ttlMs: CACHE_TTL_MS,
      staleMs: CACHE_STALE_MS,
    });
    const parsed = parseTLE(cached.data.text);
    const analysis = analyze(parsed, new Date());

    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        sourceStatus: cached.sourceStatus,
        source:
          cached.sourceStatus === "live"
            ? `${cached.data.source} · local propagation from cached elements`
            : `${cached.data.source} · stale cached elements propagated locally`,
        counts: {
          totalParsed: analysis.totalParsed,
          analyzed: analysis.analyzed,
          propagated: analysis.propagated,
          overZambiaNow: analysis.overZambiaNow,
          nearZambiaNow: analysis.nearZambiaNow,
        },
        sample: analysis.sample,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=15, stale-while-revalidate=180",
        },
      }
    );
  } catch {
    try {
      const curated = await loadCuratedOrbitSample();
      if (!curated) {
        throw new Error("No curated orbit sample available");
      }
      return NextResponse.json(
        {
          generatedAt: new Date().toISOString(),
          sourceStatus: "fallback" as const,
          source: curated.source,
          counts: curated.counts,
          sample: curated.sample,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=15, stale-while-revalidate=180",
          },
        }
      );
    } catch {
    const nowIso = new Date().toISOString();
    return NextResponse.json(fallback(nowIso), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
    }
  }
}
