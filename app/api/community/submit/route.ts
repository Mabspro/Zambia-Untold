import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, insertSupabaseRow } from "@/lib/server/supabase";

type Body = {
  title?: string;
  content?: string;
  type?: string;
  epochZone?: string;
  placeName?: string;
  lat?: string;
  lng?: string;
  contributorName?: string;
  affiliation?: string;
  isAnonymous?: boolean;
};

const TABLE = process.env.SUPABASE_ISIBALO_TABLE ?? "isibalo_submissions";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const title = body.title?.trim() ?? "";
    const content = body.content?.trim() ?? "";

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "title_and_content_required" }, { status: 400 });
    }

    const payload = {
      title,
      content,
      submission_type: body.type ?? "memory",
      epoch_zone: body.epochZone ?? "UNFINISHED SOVEREIGN",
      place_name: body.placeName ?? "",
      latitude: body.lat ? Number(body.lat) : null,
      longitude: body.lng ? Number(body.lng) : null,
      contributor_name: body.isAnonymous ? null : (body.contributorName ?? ""),
      affiliation: body.affiliation ?? "",
      is_anonymous: Boolean(body.isAnonymous),
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
