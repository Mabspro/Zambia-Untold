/**
 * Supabase server client for server-side reads (e.g. notes verification).
 * Uses anon key; RLS policies control access.
 * For writes (isibalo, space_mission) the app uses lib/server/supabase.ts with service role.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

export function createSupabaseServerClient() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
