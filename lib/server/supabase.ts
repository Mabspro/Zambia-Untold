const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseServerConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server env is not configured");
  }
}

export function hasSupabaseServerWrite(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertSupabaseRow(table: string, row: Record<string, unknown>): Promise<void> {
  assertSupabaseServerConfig();

  const endpoint = `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${table}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Supabase insert failed");
    throw new Error(`Supabase insert failed (${response.status}): ${message}`);
  }
}

export async function selectSupabaseRows<T>(table: string, query: string): Promise<T[]> {
  assertSupabaseServerConfig();

  const endpoint = `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${table}?${query}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Supabase select failed");
    throw new Error(`Supabase select failed (${response.status}): ${message}`);
  }

  const json = (await response.json()) as unknown;
  return Array.isArray(json) ? (json as T[]) : [];
}
