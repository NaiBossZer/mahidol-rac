-- ============================================================
-- Activity Content schema
-- NOTE: The canonical Supabase project is the Facility-Safety
-- project (rdnbodadxvvykfrxmeqn). This migration is kept here
-- only as a schema reference for the Mahidol RAC application.
-- Apply the canonical shared migration from Facility-Safety to
-- the central project instead of creating a separate project.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  category text,
  cover_image text,
  images jsonb not null default '[]'::jsonb,
  objective text not null default '',
  key_activities jsonb not null default '[]'::jsonb,
  outcomes text not null default '',
  participants text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_status_date_idx
  on public.activities (status, date desc);

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

drop policy if exists "authenticated users manage activities" on public.activities;
create policy "authenticated users manage activities"
on public.activities
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('activity-images', 'activity-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can view activity images" on storage.objects;
create policy "public can view activity images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'activity-images');

drop policy if exists "authenticated can upload activity images" on storage.objects;
create policy "authenticated can upload activity images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'activity-images');

drop policy if exists "authenticated can update activity images" on storage.objects;
create policy "authenticated can update activity images"
on storage.objects
for update
to authenticated
using (bucket_id = 'activity-images')
with check (bucket_id = 'activity-images');

drop policy if exists "authenticated can delete activity images" on storage.objects;
create policy "authenticated can delete activity images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'activity-images');
