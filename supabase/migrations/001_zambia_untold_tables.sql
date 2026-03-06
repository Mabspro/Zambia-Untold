-- Zambia Untold — Supabase schema
-- Run this in your project's SQL Editor (Supabase Dashboard → SQL Editor → New query).
-- Creates: isibalo_submissions, space_mission_proposals, and optional notes (quickstart verification).

-- =============================================================================
-- 1. Isibalo (community contributions)
-- =============================================================================
create table if not exists public.isibalo_submissions (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  submission_type text not null default 'memory',
  epoch_zone text not null default 'UNFINISHED SOVEREIGN',
  place_name text default '',
  latitude double precision,
  longitude double precision,
  contributor_name text,
  affiliation text default '',
  is_anonymous boolean not null default false,
  moderation_status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

comment on table public.isibalo_submissions is 'Community contributions (Isibalo) — moderation queue';

alter table public.isibalo_submissions enable row level security;

-- Only backend with service_role can insert/select/update (no anon policies = secure).
-- When you add a moderation UI, use service_role or authenticated with a policy.

-- =============================================================================
-- 2. Space mission proposals
-- =============================================================================
create table if not exists public.space_mission_proposals (
  id bigint primary key generated always as identity,
  name text not null,
  mission_type text not null default 'earth-observation',
  altitude_km double precision not null default 500,
  inclination_deg double precision not null default 52,
  moderation_status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

comment on table public.space_mission_proposals is 'Space mission builder submissions — moderation queue';

alter table public.space_mission_proposals enable row level security;

-- =============================================================================
-- 3. Notes (optional — Supabase quickstart verification)
-- =============================================================================
create table if not exists public.notes (
  id bigint primary key generated always as identity,
  title text not null,
  created_at timestamptz not null default now()
);

insert into public.notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added Zambia Untold tables and queried from Next.js.'),
  ('It was awesome!');

alter table public.notes enable row level security;

-- Make notes publicly readable for the quickstart demo (anon key can read).
create policy "public can read notes"
  on public.notes
  for select
  to anon
  using (true);

-- =============================================================================
-- Optional: allow anon to insert into isibalo/space_mission (if you later
-- want to use anon key from client). Right now the app uses service_role
-- from the server, so these policies are commented out.
-- =============================================================================
-- create policy "anon can insert isibalo"
--   on public.isibalo_submissions for insert to anon with check (true);
-- create policy "anon can insert space_mission"
--   on public.space_mission_proposals for insert to anon with check (true);
