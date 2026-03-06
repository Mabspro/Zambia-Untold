import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Notes() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="min-h-screen bg-background p-8 font-sans">
        <h1 className="text-xl font-semibold text-foreground mb-2">Notes (Supabase check)</h1>
        <p className="text-muted-foreground">
          Configure <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
          <code className="rounded bg-muted px-1">.env.local</code>, then restart the dev server.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Run the SQL in <code className="rounded bg-muted px-1">supabase/migrations/001_zambia_untold_tables.sql</code> in
          your project&apos;s Supabase SQL Editor first.
        </p>
      </div>
    );
  }

  const { data: notes } = await supabase.from("notes").select();

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <h1 className="text-xl font-semibold text-foreground mb-4">Notes (Supabase connected)</h1>
      <pre className="rounded-lg bg-muted p-4 text-sm overflow-auto">
        {JSON.stringify(notes ?? [], null, 2)}
      </pre>
      <p className="mt-4 text-sm text-muted-foreground">
        If you see sample notes above, Supabase is wired correctly. Isibalo and Space Mission
        submissions use the service role and write to <code className="rounded bg-muted px-1">isibalo_submissions</code> and{" "}
        <code className="rounded bg-muted px-1">space_mission_proposals</code>.
      </p>
    </div>
  );
}
