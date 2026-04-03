import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, updateSupabaseRows } from "@/lib/server/supabase";
import { isModerationAuthorized } from "@/lib/server/requestAuth";

type Body = {
  target?: "community" | "mission";
  id?: number;
  status?: "approved" | "rejected" | "pending";
};

const ISIBALO_TABLE = process.env.SUPABASE_ISIBALO_TABLE ?? "isibalo_submissions";
const MISSIONS_TABLE = process.env.SUPABASE_SPACE_MISSIONS_TABLE ?? "space_mission_proposals";
export async function POST(req: Request) {
  if (!isModerationAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseServerWrite()) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as Body;
    const target = body.target;
    const id = Number(body.id);
    const status = body.status;

    if ((target !== "community" && target !== "mission") || !Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ ok: false, error: "invalid_target_or_id" }, { status: 400 });
    }

    if (status !== "approved" && status !== "rejected" && status !== "pending") {
      return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
    }

    const table = target === "community" ? ISIBALO_TABLE : MISSIONS_TABLE;
    await updateSupabaseRows(table, `id=eq.${id}`, { moderation_status: status });

    return NextResponse.json({ ok: true, target, id, status });
  } catch {
    return NextResponse.json({ ok: false, error: "moderation_update_failed" }, { status: 500 });
  }
}
