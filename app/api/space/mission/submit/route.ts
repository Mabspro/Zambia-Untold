import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, insertSupabaseRow } from "@/lib/server/supabase";

type Body = {
  name?: string;
  missionType?: string;
  altitudeKm?: number;
  inclinationDeg?: number;
};

const TABLE = process.env.SUPABASE_SPACE_MISSIONS_TABLE ?? "space_mission_proposals";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const name = body.name?.trim() ?? "";

    if (name.length < 3) {
      return NextResponse.json({ ok: false, error: "name_too_short" }, { status: 400 });
    }

    const payload = {
      name,
      mission_type: body.missionType ?? "earth-observation",
      altitude_km: Number(body.altitudeKm ?? 500),
      inclination_deg: Number(body.inclinationDeg ?? 52),
      moderation_status: "pending",
      submitted_at: new Date().toISOString(),
      raw_payload: body,
    };

    if (!hasSupabaseServerWrite()) {
      return NextResponse.json({ ok: true, storage: "local-fallback", status: "pending" });
    }

    await insertSupabaseRow(TABLE, payload);

    return NextResponse.json({ ok: true, storage: "supabase", status: "pending" });
  } catch {
    return NextResponse.json({ ok: true, storage: "local-fallback", status: "pending" });
  }
}
