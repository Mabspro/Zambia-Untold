import { NextResponse } from "next/server";

type NominatimResult = {
  name?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
  type?: string;
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function toSearchResults(rows: NominatimResult[]) {
  return rows
    .map((row) => {
      const lat = Number.parseFloat(row.lat ?? "");
      const lng = Number.parseFloat(row.lon ?? "");
      const displayName = row.display_name ?? "";
      const name = row.name?.trim() || displayName.split(",")[0]?.trim() || "Unknown";

      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !displayName) {
        return null;
      }

      return {
        name,
        displayName,
        lat,
        lng,
        type: row.type ?? "place",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2 || q.length > 80) {
    return NextResponse.json({ results: [] }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }

  const upstream = new URL(NOMINATIM_URL);
  upstream.searchParams.set("q", `${q},Zambia`);
  upstream.searchParams.set("format", "json");
  upstream.searchParams.set("limit", "8");
  upstream.searchParams.set("addressdetails", "1");
  upstream.searchParams.set("countrycodes", "zm");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(upstream.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "ZambiaUntold/1.0 (contact: zambiauntold@local)",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    const data = (await res.json()) as NominatimResult[];
    return NextResponse.json(
      { results: toSearchResults(data) },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ results: [] }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } finally {
    clearTimeout(timeout);
  }
}
