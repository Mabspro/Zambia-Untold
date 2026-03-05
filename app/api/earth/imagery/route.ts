import { NextResponse } from "next/server";
import { getCachedOrRefresh } from "@/lib/server/memoryCache";

const CACHE_KEY = "earth:imagery:gibs:zambia";
const CACHE_TTL_MS = 6 * 60 * 60_000;
const CACHE_STALE_MS = 48 * 60 * 60_000;

type ImageryPayload = {
  source: string;
  layer: string;
  date: string;
  imageUrl: string;
};

function buildDateString(daysBack: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysBack);
  return d.toISOString().slice(0, 10);
}

function buildGibsUrl(date: string): string {
  const params = new URLSearchParams({
    SERVICE: "WMS",
    REQUEST: "GetMap",
    VERSION: "1.3.0",
    LAYERS: "MODIS_Terra_CorrectedReflectance_TrueColor",
    STYLES: "",
    FORMAT: "image/png",
    TRANSPARENT: "true",
    HEIGHT: "512",
    WIDTH: "512",
    CRS: "EPSG:4326",
    BBOX: "-18.5,21.9,-8.1,33.7",
    TIME: date,
  });
  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`;
}

async function loadImagery(): Promise<ImageryPayload> {
  const date = buildDateString(3);
  return {
    source: "nasa gibs worldview",
    layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    date,
    imageUrl: buildGibsUrl(date),
  };
}

function fallback() {
  const date = buildDateString(5);
  return {
    generatedAt: new Date().toISOString(),
    sourceStatus: "fallback" as const,
    source: "nasa gibs worldview",
    layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    date,
    imageUrl: buildGibsUrl(date),
  };
}

export async function GET() {
  try {
    const cached = await getCachedOrRefresh(CACHE_KEY, loadImagery, {
      ttlMs: CACHE_TTL_MS,
      staleMs: CACHE_STALE_MS,
    });

    return NextResponse.json(
      {
        generatedAt: cached.generatedAt,
        sourceStatus: cached.sourceStatus,
        source: cached.data.source,
        layer: cached.data.layer,
        date: cached.data.date,
        imageUrl: cached.data.imageUrl,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(fallback(), {
      headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=3600" },
    });
  }
}
