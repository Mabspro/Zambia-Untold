# CopperCloud Integration Brief — zambia-untold
**For:** Cursor alignment sprint before Sprint 7.5  
**Goal:** Every Isibalo archive write routes through CopperCloud and produces a sovereignty receipt. The receipt ID is stored alongside the Supabase row. Static/public operations are optionally routed for cross-jurisdiction proof.  
**Do not touch:** Archive content logic, Supabase schema structure (additive only), Next.js routing, existing env vars, `docs/direction/`, `docs/doctrine/`.

---

## What This Project Becomes

The Isibalo community archive gains a sovereignty receipt for every submission. Each piece of contributed content has a verifiable chain of custody: submitted at this timestamp, stored on sovereign infrastructure in Zambia, by this contributor. The receipt is stored as a `coppercloud_receipt_id` field on the submission row.

This is technically simple. It is strategically significant: it is the identical primitive as a land registry entry, an academic credential write, or a health record update — processed on the same infrastructure that would govern those national systems.

**Prerequisite:** Add the pending Vercel env vars that are already in the project backlog:
- `ZAMBIAMACRO_SUPABASE_URL`
- `ZAMBIAMACRO_SUPABASE_ANON_KEY`
- `MODERATION_API_TOKEN`

These must be added to Vercel before the CopperCloud integration goes live.

---

## Sensitivity Classification Map

| Operation | Route | Sensitivity | Node | Receipt type |
|-----------|-------|-------------|------|--------------|
| Isibalo submission write | `app/api/isibalo/` or equivalent | `INTERNAL` | ZM nodes only | Sovereignty receipt + jurisdiction attestation |
| Archive integrity check (daily) | `scripts/` or cron | `INTERNAL` | ZM nodes only | Sovereignty receipt |
| Static page build | Build pipeline | `PUBLIC` | Any node incl. embassy | Execution receipt |
| Present signals fetch (from zambiamacro) | `app/api/zambia-macro/state/` | `PUBLIC` | Any node | Execution receipt |

---

## What to Build

### 1. CopperCloud client module

Create `lib/coppercloud.ts`:

```typescript
const ORCHESTRATOR_URL = process.env.COPPERCLOUD_ORCHESTRATOR_URL!;
const SUBMIT_KEY = process.env.COPPERCLOUD_WORKLOAD_SUBMIT_KEY!;
const READ_KEY = process.env.COPPERCLOUD_READ_KEY!;
const TENANT_ID = process.env.COPPERCLOUD_TENANT_ID ?? "internal-ops";

export interface WorkloadResult {
  job_id: string;
  classification: string;
  routing_decision: {
    success: boolean;
    target_node: string | null;
    node_location: string;
    reason: string;
  };
  receipt_endpoint: string;
}

/**
 * Submit a workload to CopperCloud.
 * failOpen=true (default): on any error, log and return null — caller continues.
 * failOpen=false: throw on error — use only where a missing receipt is unacceptable.
 */
export async function submitWorkload(
  params: {
    workloadType: string;
    dataSensitivity: string;
    jobName?: string;
    ndaRequired?: boolean;
    requestedResources?: Record<string, number>;
  },
  failOpen = true
): Promise<WorkloadResult | null> {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/api/workload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUBMIT_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workload_type: params.workloadType,
        data_sensitivity: params.dataSensitivity,
        nda_required: params.ndaRequired ?? false,
        tenant_id: TENANT_ID,
        job_name: params.jobName,
        requested_resources: params.requestedResources ?? {
          cpu_cores: 1,
          ram_gb: 1,
          storage_gb: 1,
        },
      }),
    });
    if (!res.ok) throw new Error(`CopperCloud submit failed: ${res.status}`);
    return res.json();
  } catch (e) {
    if (failOpen) {
      console.warn("[coppercloud] workload submission failed (non-blocking):", e);
      return null;
    }
    throw e;
  }
}

export async function getReceipt(
  jobId: string,
  failOpen = true
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/api/jobs/${jobId}/receipt`, {
      headers: { Authorization: `Bearer ${READ_KEY}` },
    });
    if (!res.ok) throw new Error(`CopperCloud receipt fetch failed: ${res.status}`);
    return res.json();
  } catch (e) {
    if (failOpen) {
      console.warn("[coppercloud] receipt fetch failed (non-blocking):", e);
      return null;
    }
    throw e;
  }
}
```

### 2. Isibalo write path integration

Find the API route that handles Isibalo/community submissions (likely in `app/api/` — check `supabase/` schema for the submissions table name). Add the CopperCloud submission **before** the Supabase write:

```typescript
// In the Isibalo submission API route handler
import { submitWorkload, getReceipt } from "@/lib/coppercloud";

// Submit to CopperCloud BEFORE writing to Supabase
const workloadResult = await submitWorkload({
  workloadType: "GENERAL",
  dataSensitivity: "INTERNAL",
  jobName: `isibalo-submission-${Date.now()}`,
});

// Write to Supabase — include the job_id for receipt linkage
const { error } = await supabase
  .from("isibalo_submissions")  // adjust table name to actual
  .insert({
    ...submissionData,
    coppercloud_job_id: workloadResult.job_id,
    coppercloud_node: workloadResult.routing_decision.target_node,
  });

// Fetch receipt async (non-blocking — job_id is enough for audit trail)
// Optionally: store receipt_json in a separate table or update the row
```

### 3. Supabase — additive columns only

Add two columns to the existing submissions table (do not recreate or alter existing columns):

```sql
-- Migration: add CopperCloud receipt linkage to submissions table
ALTER TABLE isibalo_submissions   -- adjust to actual table name
  ADD COLUMN IF NOT EXISTS coppercloud_job_id text,
  ADD COLUMN IF NOT EXISTS coppercloud_node text;

-- Optional receipts table for full receipt storage
CREATE TABLE IF NOT EXISTS coppercloud_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL UNIQUE,
  entity_type text NOT NULL,   -- 'isibalo_submission', 'archive_check', etc.
  entity_id text,
  receipt_json jsonb NOT NULL,
  node_id text,
  sovereignty_enforced boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 4. Vercel env vars — add all at once

In Vercel project settings, add:
- `ZAMBIAMACRO_SUPABASE_URL` — (pending, already in backlog)
- `ZAMBIAMACRO_SUPABASE_ANON_KEY` — (pending, already in backlog)
- `MODERATION_API_TOKEN` — (pending, already in backlog)
- `COPPERCLOUD_ORCHESTRATOR_URL` = `https://coppercloud-orchestrator.vercel.app`
- `COPPERCLOUD_WORKLOAD_SUBMIT_KEY` — (from orchestrator env)
- `COPPERCLOUD_READ_KEY` — (from orchestrator env)
- `COPPERCLOUD_TENANT_ID` = `internal-ops`

Also add to `.env.example` (not `.env.local`) for documentation.

---

## What NOT to Touch

- Globe/3D visualization code
- `/discover`, `/future`, `/archive` route logic
- Remotion video project (`zambiamacro-brief/`)
- `docs/direction/` or `docs/doctrine/` files
- Any existing Supabase table structure (additive only)
- Existing keepalive cron (`isibalo_submissions` ping)

---

## Verification Checklist

- [ ] Isibalo submission creates a row with `coppercloud_job_id` populated
- [ ] Job ID resolves to a receipt at `/api/jobs/{job_id}/receipt`
- [ ] Receipt shows `node_identity.node_location` in Zambia
- [ ] Receipt `data_sensitivity: INTERNAL`, `sovereignty_enforced: true`
- [ ] Submission still works if CopperCloud is unreachable (graceful degradation — don't block the write)

**Note on graceful degradation:** The CopperCloud submission should not block or fail the archive write if the orchestrator is unreachable. Wrap in try/catch — if submission fails, log the error, write to Supabase anyway, and set `coppercloud_job_id: null`. A missed receipt is better than a failed submission.

---

## CopperCloud Orchestrator Reference

- URL: `https://coppercloud-orchestrator.vercel.app`
- Workload submit: `POST /api/workload` — Bearer WORKLOAD_SUBMIT_KEY
- Receipt retrieve: `GET /api/jobs/{job_id}/receipt` — Bearer READ_KEY
- API contract: `coppercloud-orchestrator/docs/API-CONTRACTS.md`
