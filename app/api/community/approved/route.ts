import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, selectSupabaseRows } from "@/lib/server/supabase";

type ApprovedContributionRow = {
  id: number;
  title: string;
  place_name: string | null;
  latitude: number | null;
  longitude: number | null;
  epoch_zone: string | null;
  submitted_at: string;
};

const TABLE = process.env.SUPABASE_ISIBALO_TABLE ?? "isibalo_submissions";

export async function GET() {
  const generatedAt = new Date().toISOString();

  if (!hasSupabaseServerWrite()) {
    return NextResponse.json(
      { generatedAt, sourceStatus: "fallback", source: "local", count: 0, items: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const rows = await selectSupabaseRows<ApprovedContributionRow>(
      TABLE,
      [
        "select=id,title,place_name,latitude,longitude,epoch_zone,submitted_at",
        "moderation_status=eq.approved",
        "latitude=not.is.null",
        "longitude=not.is.null",
        "order=submitted_at.desc",
        "limit=120",
      ].join("&")
    );

    const items = rows
      .filter((row) => Number.isFinite(row.latitude) && Number.isFinite(row.longitude))
      .map((row) => ({
        id: row.id,
        title: row.title,
        placeName: row.place_name ?? "",
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        epochZone: row.epoch_zone ?? "UNFINISHED SOVEREIGN",
        submittedAt: row.submitted_at,
      }));

    return NextResponse.json(
      {
        generatedAt,
        sourceStatus: "live",
        source: "supabase",
        count: items.length,
        items,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { generatedAt, sourceStatus: "fallback", source: "local", count: 0, items: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
