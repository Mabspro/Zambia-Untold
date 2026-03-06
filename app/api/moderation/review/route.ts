import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, updateSupabaseRows } from "@/lib/server/supabase";

type Body = {
  target?: "community" | "mission";
  id?: number;
  status?: "approved" | "rejected" | "pending";
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

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
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
