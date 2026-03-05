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
const MAX_PROPAGATION_SET = 3000;
const CACHE_KEY = "space:norad:analysis";

const CACHE_TTL_MS = 60_000;
const CACHE_STALE_MS = 6 * 60_000;

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

async function loadNoradAnalysis(): Promise<NoradAnalysis> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7_500);

  try {
    const res = await fetch(CELESTRAK_TLE_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`CelesTrak request failed: ${res.status}`);
    }

    const text = await res.text();
    const parsed = parseTLE(text);
    const analysis = analyze(parsed, new Date());

    return {
      source: "celestrak active tle + sgp4",
      counts: {
        totalParsed: analysis.totalParsed,
        analyzed: analysis.analyzed,
        propagated: analysis.propagated,
        overZambiaNow: analysis.overZambiaNow,
        nearZambiaNow: analysis.nearZambiaNow,
      },
      sample: analysis.sample,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function fallback(nowIso: string) {
  return {
    generatedAt: nowIso,
    sourceStatus: "fallback" as const,
    source: "celestrak active tle + sgp4",
    counts: {
      totalParsed: 0,
      analyzed: 0,
      propagated: 0,
      overZambiaNow: 0,
      nearZambiaNow: 0,
    },
    sample: [] as TrackSample[],
  };
}

export async function GET() {
  try {
    const cached = await getCachedOrRefresh(CACHE_KEY, loadNoradAnalysis, {
      ttlMs: CACHE_TTL_MS,
      staleMs: CACHE_STALE_MS,
    });

    return NextResponse.json(
      {
        generatedAt: cached.generatedAt,
        sourceStatus: cached.sourceStatus,
        source: cached.data.source,
        counts: cached.data.counts,
        sample: cached.data.sample,
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
