import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, selectSupabaseRows } from "@/lib/server/supabase";

type ApprovedMissionRow = {
  id: number;
  name: string;
  mission_type: string;
  altitude_km: number;
  inclination_deg: number;
  submitted_at: string;
};

const TABLE = process.env.SUPABASE_SPACE_MISSIONS_TABLE ?? "space_mission_proposals";

export async function GET() {
  const generatedAt = new Date().toISOString();

  if (!hasSupabaseServerWrite()) {
    return NextResponse.json(
      { generatedAt, sourceStatus: "fallback", source: "local", count: 0, items: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const rows = await selectSupabaseRows<ApprovedMissionRow>(
      TABLE,
      [
        "select=id,name,mission_type,altitude_km,inclination_deg,submitted_at",
        "moderation_status=eq.approved",
        "order=submitted_at.desc",
        "limit=60",
      ].join("&")
    );

    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      missionType: row.mission_type,
      altitudeKm: Number(row.altitude_km),
      inclinationDeg: Number(row.inclination_deg),
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
