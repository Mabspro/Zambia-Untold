import { NextResponse } from "next/server";
import { countSupabaseRows, hasSupabaseServerWrite } from "@/lib/server/supabase";
import { isModerationAuthorized } from "@/lib/server/requestAuth";

const ISIBALO_TABLE = process.env.SUPABASE_ISIBALO_TABLE ?? "isibalo_submissions";
const MISSIONS_TABLE = process.env.SUPABASE_SPACE_MISSIONS_TABLE ?? "space_mission_proposals";

export async function GET(request: Request) {
  const generatedAt = new Date().toISOString();

  if (!isModerationAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized", generatedAt }, { status: 401 });
  }

  if (!hasSupabaseServerWrite()) {
    return NextResponse.json(
      {
        ok: true,
        generatedAt,
        sourceStatus: "fallback",
        source: "local",
        community: { pending: 0, rejected: 0, approved: 0 },
        missions: { pending: 0, rejected: 0, approved: 0 },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const [communityPending, communityRejected, communityApproved, missionsPending, missionsRejected, missionsApproved] =
      await Promise.all([
        countSupabaseRows(ISIBALO_TABLE, "moderation_status=eq.pending"),
        countSupabaseRows(ISIBALO_TABLE, "moderation_status=eq.rejected"),
        countSupabaseRows(ISIBALO_TABLE, "moderation_status=eq.approved"),
        countSupabaseRows(MISSIONS_TABLE, "moderation_status=eq.pending"),
        countSupabaseRows(MISSIONS_TABLE, "moderation_status=eq.rejected"),
        countSupabaseRows(MISSIONS_TABLE, "moderation_status=eq.approved"),
      ]);

    return NextResponse.json(
      {
        ok: true,
        generatedAt,
        sourceStatus: "live",
        source: "supabase",
        community: {
          pending: communityPending,
          rejected: communityRejected,
          approved: communityApproved,
        },
        missions: {
          pending: missionsPending,
          rejected: missionsRejected,
          approved: missionsApproved,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      {
        ok: true,
        generatedAt,
        sourceStatus: "fallback",
        source: "local",
        community: { pending: 0, rejected: 0, approved: 0 },
        missions: { pending: 0, rejected: 0, approved: 0 },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
