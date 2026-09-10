-- ============================================================
-- Mahidol RAC activity schema reference
-- ============================================================
-- The canonical Supabase project is the shared Facility-Safety
-- project. Activity administration is owned by Mahidol Lampang
-- Portal. This file documents the canonical shape for reference;
-- production schema changes must be applied in the central DB.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  activity_date date not null,
  category text,
  featured_image text,
  images jsonb not null default '[]'::jsonb,
  objective text not null default '',
  key_activities jsonb not null default '[]'::jsonb,
  outcomes text not null default '',
  participants text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_status_activity_date_idx
  on public.activities (status, activity_date desc);

create or replace function public.set_activities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at
before update on public.activities
for each row execute function public.set_activities_updated_at();

alter table public.activities enable row level security;

drop policy if exists "published activities are public" on public.activities;
create policy "published activities are public"
on public.activities
for select
to anon, authenticated
using (status = 'published');

-- Administrative writes are intentionally not granted here to RAC.
-- Portal/server-side admin owns activity mutations in the central system.

insert into storage.buckets (id, name, public)
values ('activity-images', 'activity-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can view activity images" on storage.objects;
create policy "public can view activity images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'activity-images');
