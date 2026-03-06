const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseServerConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server env is not configured");
  }
}

function getSupabaseUrl(pathAndQuery: string): string {
  return `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${pathAndQuery}`;
}

function getSupabaseAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
    ...extra,
  };
}

export function hasSupabaseServerWrite(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertSupabaseRow(table: string, row: Record<string, unknown>): Promise<void> {
  assertSupabaseServerConfig();

  const response = await fetch(getSupabaseUrl(table), {
    method: "POST",
    headers: getSupabaseAuthHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
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

  const response = await fetch(getSupabaseUrl(`${table}?${query}`), {
    method: "GET",
    headers: getSupabaseAuthHeaders({ Accept: "application/json" }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Supabase select failed");
    throw new Error(`Supabase select failed (${response.status}): ${message}`);
  }

  const json = (await response.json()) as unknown;
  return Array.isArray(json) ? (json as T[]) : [];
}

export async function countSupabaseRows(table: string, filtersQuery: string): Promise<number> {
  assertSupabaseServerConfig();

  const query = `select=id${filtersQuery ? `&${filtersQuery}` : ""}`;
  const response = await fetch(getSupabaseUrl(`${table}?${query}`), {
    method: "HEAD",
    headers: getSupabaseAuthHeaders({
      Prefer: "count=exact",
      Range: "0-0",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Supabase count failed");
    throw new Error(`Supabase count failed (${response.status}): ${message}`);
  }

  const range = response.headers.get("content-range") ?? "";
  const totalRaw = range.split("/")[1] ?? "0";
  const total = Number(totalRaw);
  return Number.isFinite(total) ? total : 0;
}

export async function updateSupabaseRows(
  table: string,
  filtersQuery: string,
  patch: Record<string, unknown>
): Promise<void> {
  assertSupabaseServerConfig();

  const response = await fetch(getSupabaseUrl(`${table}?${filtersQuery}`), {
    method: "PATCH",
    headers: getSupabaseAuthHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    body: JSON.stringify(patch),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Supabase update failed");
    throw new Error(`Supabase update failed (${response.status}): ${message}`);
  }
}
