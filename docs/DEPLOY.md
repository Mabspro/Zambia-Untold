# Zambia Untold — GitHub, Vercel & Supabase setup

Reference for initial setup and for checking that everything is wired correctly.

---

## Current state (as of review)

| Item | Status |
|------|--------|
| **Supabase** | SQL migration executed — `isibalo_submissions`, `space_mission_proposals`, `notes` tables exist. |
| **Local env** | `.env.local` present (do not commit; contains Supabase URL, anon key, service_role key). |
| **Vercel** | Deployed at least once; GitHub connected; production builds from `main`. |

**Next checks (if not already done):**

- Ensure **Vercel** has the same three Supabase env vars as `.env.local` (Dashboard → Project → Settings → Environment Variables). Mark `SUPABASE_SERVICE_ROLE_KEY` as Sensitive.
- **Verify Supabase locally:** `npm run dev` → open **http://localhost:3000/notes** — should show the three sample notes (or a “Configure…” message if keys are missing).
- **Verify writes:** Submit an Isibalo contribution and a Space Mission proposal; confirm rows appear in Supabase Table Editor under `isibalo_submissions` and `space_mission_proposals`.

Optional: run `vercel env pull .env.development.local` to sync local env with Vercel (overwrites `.env.development.local`).

**Vercel env — what this app uses:** The app reads `NEXT_PUBLIC_SUPABASE_URL` (or `SUPABASE_URL`), `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `SUPABASE_ANON_KEY`), `SUPABASE_SERVICE_ROLE_KEY`, `MODERATION_API_TOKEN`, `NOMINATIM_CONTACT_EMAIL`, and `DISABLE_PWA`. The other vars (`POSTGRES_*`, `SUPABASE_PUBLISHABLE_KEY`, etc.) are from Supabase integration and are optional for this app.

---

## 1. Supabase

### 1.1 Run the schema

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor** → **New query**.
3. Paste and run the contents of **`supabase/migrations/001_zambia_untold_tables.sql`**.

This creates:

- **`isibalo_submissions`** — Isibalo (community) contributions; RLS on, server-only writes.
- **`space_mission_proposals`** — Space mission builder submissions; RLS on, server-only writes.
- **`notes`** — Optional quickstart table with sample rows and a “public can read” policy for verification.

### 1.2 Get API keys

In Supabase: **Project Settings** → **API**:

- **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL` and optionally `SUPABASE_URL`.
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for notes page / future anon reads).
- **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY` (for API route writes; never expose to client).

---

## 2. Local environment

### 2.1 Create `.env.local`

**Status:** `.env.local` is present in the repo root (confirmed). If you’re on a new machine, copy from `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 Verify Supabase

```bash
npm run dev
```

Open **http://localhost:3000/notes**. You should see the sample notes from the `notes` table. If you see the “Configure…” message, check that both URL and anon key are set and the SQL migration was run.

---

## 3. GitHub

### 3.1 Connect the repo

- Create a new repo on GitHub (or use an existing one).
- Add it as `origin` and push:

```bash
git remote add origin https://github.com/YOUR_ORG/zambia-untold.git
git branch -M main
git push -u origin main
```

### 3.2 Branch and ignores

- Default branch `main` is used for production deploys.
- `.gitignore` already excludes `.env`, `.env.local`, `.env.*.local`, and `.vercel`. Do not commit secrets.

---

## 4. Vercel

**Status:** Project has been deployed at least once; Vercel is working. Use the steps below to link a new clone or confirm env vars.

### 4.1 Link the project (if not already linked)

1. Install Vercel CLI if needed: `npm i -g vercel`.
2. Log in: `vercel login`.
3. In the project root:

```bash
cd c:\Users\mabsp\zambia-untold
vercel link
```

Choose the existing Vercel project (or create one and link it).

### 4.2 Add environment variables in Vercel

**Confirm** these exist in **Vercel Dashboard** → your project → **Settings** → **Environment Variables** (same as in `.env.local`):

| Name                           | Value                    | Environments   |
|--------------------------------|--------------------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL`     | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase anon key        | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY`    | Supabase service_role key | Production, Preview, Development |
| `MODERATION_API_TOKEN`         | Token for moderation APIs (`/api/moderation/review`, `/api/moderation/queue`) | Production, Preview, Development |
| `NOMINATIM_CONTACT_EMAIL`     | Contact email used by `/api/geocode` in Nominatim headers | Production, Preview, Development |

Mark `SUPABASE_SERVICE_ROLE_KEY` as **Sensitive**.

Optional, if you use different table names:

- `SUPABASE_ISIBALO_TABLE`
- `SUPABASE_SPACE_MISSIONS_TABLE`

### 4.3 Pull env locally (optional)

After setting variables in Vercel:

```bash
vercel env pull .env.development.local
```

This overwrites `.env.development.local` with the values from Vercel. Use it to keep local dev in sync with Vercel env (e.g. preview URLs).

### 4.4 Connect GitHub to Vercel

If the project was created without a Git repo:

- **Settings** → **Git** → **Connect Git Repository** → choose your GitHub org/repo.
- Set production branch (e.g. `main`). Pushes to that branch will trigger production deploys.

---

## 5. Post-setup checks

- **Supabase**: `/notes` shows JSON from `notes` table.
- **Isibalo**: Submit a contribution on the main app; with `SUPABASE_SERVICE_ROLE_KEY` set, it should appear in Table Editor under `isibalo_submissions`.
- **Space missions**: Submit from the Space Mission builder; rows should appear in `space_mission_proposals`.
- **Vercel**: Push to `main`; deployment should succeed and use the env vars from the dashboard.

---

## 6. Quick reference

| Step              | Command / action |
|-------------------|------------------|
| Run Supabase SQL  | SQL Editor → paste `supabase/migrations/001_zambia_untold_tables.sql` → Run ✅ (done) |
| Local env         | `.env.local` present ✅; for new clone: `cp .env.example .env.local` then edit |
| Verify Supabase   | `npm run dev` → open `/notes` |
| Link Vercel       | `vercel link` (already linked if deployed) |
| Pull Vercel env  | `vercel env pull .env.development.local` |
| Add Vercel env    | Dashboard → Settings → Environment Variables — confirm same as `.env.local` |






