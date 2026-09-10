-- Phase 7.3: reliable satisfaction persistence in Supabase.
-- Survey submissions are stored here instead of Google Sheets / Apps Script.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete restrict,
  contract_version text not null default '7.3',
  submitted_at timestamptz not null default now(),
  age_group text not null,
  affiliation text not null,
  ever_joined text not null,
  channels text not null,
  p2_location smallint not null check (p2_location between 1 and 5),
  p2_schedule smallint not null check (p2_schedule between 1 and 5),
  p2_readiness smallint not null check (p2_readiness between 1 and 5),
  p2_reception smallint not null check (p2_reception between 1 and 5),
  p2_overall smallint not null check (p2_overall between 1 and 5),
  p3_interest smallint not null check (p3_interest between 1 and 5),
  p3_content smallint not null check (p3_content between 1 and 5),
  p3_clarity smallint not null check (p3_clarity between 1 and 5),
  p3_benefit smallint not null check (p3_benefit between 1 and 5),
  p3_application smallint not null check (p3_application between 1 and 5),
  p4_knowledge smallint not null check (p4_knowledge between 1 and 5),
  p4_inspiration smallint not null check (p4_inspiration between 1 and 5),
  p4_community_resource smallint not null check (p4_community_resource between 1 and 5),
  p4_future_return smallint not null check (p4_future_return between 1 and 5),
  feedback text not null default '',
  pdpa_consent boolean not null default false check (pdpa_consent = true),
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_activity_id_idx
  on public.survey_responses(activity_id);
create index if not exists survey_responses_submitted_at_idx
  on public.survey_responses(submitted_at desc);

alter table public.survey_responses enable row level security;

-- Public survey: respondents may insert a response only for a published activity.
drop policy if exists "public can submit satisfaction" on public.survey_responses;
create policy "public can submit satisfaction"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (
    pdpa_consent = true
    and exists (
      select 1
      from public.activities a
      where a.id = survey_responses.activity_id
        and a.status = 'published'
    )
  );

-- Admin analytics/export: read access is limited to active privileged staff profiles.
drop policy if exists "admins can read satisfaction" on public.survey_responses;
create policy "admins can read satisfaction"
  on public.survey_responses
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.staff_profiles p
      where p.user_id = auth.uid()
        and p.active = true
        and p.role in ('admin', 'dean', 'deputy_dean', 'finance_head', 'section_head')
    )
  );
