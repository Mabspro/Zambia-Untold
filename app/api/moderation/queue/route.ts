import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, selectSupabaseRows } from "@/lib/server/supabase";

type CommunityQueueRow = {
  id: number;
  title: string;
  submission_type: string | null;
  epoch_zone: string | null;
  place_name: string | null;
  contributor_name: string | null;
  moderation_status: "pending" | "approved" | "rejected" | string;
  submitted_at: string;
};

type MissionQueueRow = {
  id: number;
  name: string;
  mission_type: string | null;
  altitude_km: number | null;
  inclination_deg: number | null;
  moderation_status: "pending" | "approved" | "rejected" | string;
  submitted_at: string;
};

const ISIBALO_TABLE = process.env.SUPABASE_ISIBALO_TABLE ?? "isibalo_submissions";
const MISSIONS_TABLE = process.env.SUPABASE_SPACE_MISSIONS_TABLE ?? "space_mission_proposals";
const MODERATION_API_TOKEN = process.env.MODERATION_API_TOKEN;

function isAuthorized(request: Request): boolean {
  if (!MODERATION_API_TOKEN) return false;

  const headerToken = request.headers.get("x-moderation-token")?.trim();
  if (headerToken && headerToken === MODERATION_API_TOKEN) return true;

  const bearer = request.headers.get("authorization")?.trim();
  if (bearer?.toLowerCase().startsWith("bearer ")) {
    const token = bearer.slice(7).trim();
    if (token && token === MODERATION_API_TOKEN) return true;
  }

  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const generatedAt = new Date().toISOString();
  const url = new URL(req.url);
  const target = url.searchParams.get("target");
  const status = url.searchParams.get("status") ?? "pending";
  const limitRaw = Number(url.searchParams.get("limit") ?? 20);
  const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? limitRaw : 20, 1), 60);

  if (target !== "community" && target !== "mission") {
    return NextResponse.json({ ok: false, error: "invalid_target" }, { status: 400 });
  }

  if (status !== "pending" && status !== "rejected" && status !== "approved") {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  if (!hasSupabaseServerWrite()) {
    return NextResponse.json(
      { generatedAt, sourceStatus: "fallback", source: "local", target, status, count: 0, items: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    if (target === "community") {
      const rows = await selectSupabaseRows<CommunityQueueRow>(
        ISIBALO_TABLE,
        [
          "select=id,title,submission_type,epoch_zone,place_name,contributor_name,moderation_status,submitted_at",
          `moderation_status=eq.${status}`,
          "order=submitted_at.asc",
          `limit=${limit}`,
        ].join("&")
      );

      return NextResponse.json(
        {
          generatedAt,
          sourceStatus: "live",
          source: "supabase",
          target,
          status,
          count: rows.length,
          items: rows.map((row) => ({
            id: row.id,
            title: row.title,
            submissionType: row.submission_type ?? "memory",
            epochZone: row.epoch_zone ?? "UNFINISHED SOVEREIGN",
            placeName: row.place_name ?? "",
            contributorName: row.contributor_name ?? "Anonymous",
            moderationStatus: row.moderation_status,
            submittedAt: row.submitted_at,
          })),
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = await selectSupabaseRows<MissionQueueRow>(
      MISSIONS_TABLE,
      [
        "select=id,name,mission_type,altitude_km,inclination_deg,moderation_status,submitted_at",
        `moderation_status=eq.${status}`,
        "order=submitted_at.asc",
        `limit=${limit}`,
      ].join("&")
    );

    return NextResponse.json(
      {
        generatedAt,
        sourceStatus: "live",
        source: "supabase",
        target,
        status,
        count: rows.length,
        items: rows.map((row) => ({
          id: row.id,
          name: row.name,
          missionType: row.mission_type ?? "earth-observation",
          altitudeKm: Number(row.altitude_km ?? 0),
          inclinationDeg: Number(row.inclination_deg ?? 0),
          moderationStatus: row.moderation_status,
          submittedAt: row.submitted_at,
        })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { generatedAt, sourceStatus: "fallback", source: "local", target, status, count: 0, items: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
