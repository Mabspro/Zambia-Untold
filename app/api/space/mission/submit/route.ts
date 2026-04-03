import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, insertSupabaseRow } from "@/lib/server/supabase";
import { applyIpRateLimit, parseJsonBodyWithLimit, PublicRouteError } from "@/lib/server/publicRouteGuards";

type Body = {
  name?: string;
  missionType?: string;
  altitudeKm?: number;
  inclinationDeg?: number;
};

const TABLE = process.env.SUPABASE_SPACE_MISSIONS_TABLE ?? "space_mission_proposals";
const MAX_MISSION_BODY_BYTES = 4_096;

export async function POST(req: Request) {
  const rateLimit = applyIpRateLimit(req, "mission-submit", 8, 10 * 60_000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: {
          ...rateLimit.headers,
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await parseJsonBodyWithLimit<Body>(req, MAX_MISSION_BODY_BYTES);
    const name = body.name?.trim() ?? "";
    const missionType = (body.missionType ?? "earth-observation").trim().slice(0, 48) || "earth-observation";
    const altitudeKm = Number(body.altitudeKm ?? 500);
    const inclinationDeg = Number(body.inclinationDeg ?? 52);

    if (name.length < 3 || name.length > 80) {
      return NextResponse.json({ ok: false, error: "name_too_short" }, { status: 400, headers: rateLimit.headers });
    }

    if (!Number.isFinite(altitudeKm) || altitudeKm < 100 || altitudeKm > 50_000) {
      return NextResponse.json({ ok: false, error: "invalid_altitude" }, { status: 400, headers: rateLimit.headers });
    }

    if (!Number.isFinite(inclinationDeg) || inclinationDeg < 0 || inclinationDeg > 180) {
      return NextResponse.json({ ok: false, error: "invalid_inclination" }, { status: 400, headers: rateLimit.headers });
    }

    const payload = {
      name,
      mission_type: missionType,
      altitude_km: altitudeKm,
      inclination_deg: inclinationDeg,
      moderation_status: "pending",
      submitted_at: new Date().toISOString(),
      raw_payload: body,
    };

    if (!hasSupabaseServerWrite()) {
      return NextResponse.json({ ok: true, storage: "local-fallback", status: "pending" }, { headers: rateLimit.headers });
    }

    await insertSupabaseRow(TABLE, payload);

    return NextResponse.json({ ok: true, storage: "supabase", status: "pending" }, { headers: rateLimit.headers });
  } catch (error) {
    if (error instanceof PublicRouteError) {
      return NextResponse.json({ ok: false, error: error.code }, { status: error.status, headers: rateLimit.headers });
    }
    return NextResponse.json({ ok: true, storage: "local-fallback", status: "pending" }, { headers: rateLimit.headers });
  }
}
