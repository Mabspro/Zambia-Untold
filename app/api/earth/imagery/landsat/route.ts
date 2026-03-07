import { NextRequest, NextResponse } from "next/server";
import { getCachedOrRefresh } from "@/lib/server/memoryCache";

/**
 * NASA Earth Imagery API (Landsat 8) — optional higher-res imagery for Zambia.
 * When NASA_API_KEY is set, this route returns a Landsat 8 image URL for the given
 * date and center (default: Zambia). Client can try this first and fall back to
 * /api/earth/imagery (GIBS MODIS) when 503 or when no key is configured.
 *
 * API: https://api.nasa.gov/planetary/earth/assets
 * Docs: https://github.com/nasa/earth-imagery-api
 */

const ZAMBIA_CENTER_LAT = -13.2;
const ZAMBIA_CENTER_LON = 27.9;
const CACHE_TTL_MS = 6 * 60 * 60_000;
const CACHE_STALE_MS = 48 * 60 * 60_000;

type NasaAssetResource = {
  dataset?: string;
  planet?: string;
};

type NasaAsset = {
  date: string;
  id?: string;
  resource?: NasaAssetResource;
  url?: string;
};

type NasaAssetsResponse = {
  count?: number;
  results?: NasaAsset[];
};

type LandsatPayload = {
  source: string;
  date: string;
  imageUrl: string;
  id?: string;
};

function buildDateString(daysBack: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysBack);
  return d.toISOString().slice(0, 10);
}

async function loadLandsatForDate(date: string, lat: number, lon: number, apiKey: string): Promise<LandsatPayload> {
  const params = new URLSearchParams({
    lon: String(lon),
    lat: String(lat),
    date,
    dim: "0.5",
    api_key: apiKey,
  });
  const url = `https://api.nasa.gov/planetary/earth/assets?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) {
      throw new Error(`NASA assets API ${res.status}`);
    }
    const data = (await res.json()) as NasaAssetsResponse;
    const results = data.results ?? [];
    const asset = results.find((a) => a.url) ?? results[0];
    if (!asset?.url) {
      throw new Error("No image URL in NASA assets response");
    }
    return {
      source: "nasa landsat 8",
      date: asset.date ?? date,
      imageUrl: asset.url,
      id: asset.id,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NASA_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "NASA_API_KEY not configured", useGibs: true },
      { status: 503, headers: { "Cache-Control": "public, max-age=60" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const date = dateParam ?? buildDateString(3);
  const lat = latParam != null ? Number(latParam) : ZAMBIA_CENTER_LAT;
  const lon = lonParam != null ? Number(lonParam) : ZAMBIA_CENTER_LON;

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "Invalid lat or lon" },
      { status: 400 }
    );
  }

  const cacheKey = `earth:imagery:landsat:${date}:${lat.toFixed(2)}:${lon.toFixed(2)}`;

  try {
    const cached = await getCachedOrRefresh(
      cacheKey,
      () => loadLandsatForDate(date, lat, lon, apiKey),
      { ttlMs: CACHE_TTL_MS, staleMs: CACHE_STALE_MS }
    );

    return NextResponse.json(
      {
        generatedAt: cached.generatedAt,
        sourceStatus: cached.sourceStatus,
        source: cached.data.source,
        date: cached.data.date,
        imageUrl: cached.data.imageUrl,
        id: cached.data.id,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Landsat imagery unavailable", useGibs: true },
      { status: 503, headers: { "Cache-Control": "public, max-age=60" } }
    );
  }
}
