import { NextResponse } from "next/server";
import { hasSupabaseServerWrite, insertSupabaseRow } from "@/lib/server/supabase";
import { applyIpRateLimit, parseJsonBodyWithLimit, PublicRouteError } from "@/lib/server/publicRouteGuards";

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
const MAX_COMMUNITY_BODY_BYTES = 8_192;

export async function POST(req: Request) {
  const rateLimit = applyIpRateLimit(req, "community-submit", 8, 10 * 60_000);
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
    const body = await parseJsonBodyWithLimit<Body>(req, MAX_COMMUNITY_BODY_BYTES);

    const title = body.title?.trim() ?? "";
    const content = body.content?.trim() ?? "";
    const submissionType = (body.type ?? "memory").trim().slice(0, 40) || "memory";
    const epochZone = (body.epochZone ?? "UNFINISHED SOVEREIGN").trim().slice(0, 80) || "UNFINISHED SOVEREIGN";
    const placeName = (body.placeName ?? "").trim().slice(0, 120);
    const contributorName = (body.contributorName ?? "").trim().slice(0, 120);
    const affiliation = (body.affiliation ?? "").trim().slice(0, 120);

    if (!title || !content || title.length > 120 || content.length < 10 || content.length > 4_000) {
      return NextResponse.json({ ok: false, error: "invalid_submission" }, { status: 400, headers: rateLimit.headers });
    }

    const latitude = body.lat === undefined || body.lat === "" ? null : Number(body.lat);
    const longitude = body.lng === undefined || body.lng === "" ? null : Number(body.lng);

    if ((latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
        (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))) {
      return NextResponse.json({ ok: false, error: "invalid_coordinates" }, { status: 400, headers: rateLimit.headers });
    }

    const payload = {
      title,
      content,
      submission_type: submissionType,
      epoch_zone: epochZone,
      place_name: placeName,
      latitude,
      longitude,
      contributor_name: body.isAnonymous ? null : contributorName,
      affiliation,
      is_anonymous: Boolean(body.isAnonymous),
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
