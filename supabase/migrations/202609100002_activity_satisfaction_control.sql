-- Phase 7.4: activity-level satisfaction controls
-- Keeps survey configuration attached to the canonical activity UUID.

alter table public.activities
  add column if not exists survey_enabled boolean not null default true,
  add column if not exists survey_open_at timestamptz,
  add column if not exists survey_close_at timestamptz,
  add column if not exists survey_welcome_text text;

create index if not exists activities_survey_enabled_idx
  on public.activities (survey_enabled);

comment on column public.activities.survey_enabled is 'Whether the public satisfaction survey is available for this activity.';
comment on column public.activities.survey_open_at is 'Optional opening timestamp for the activity satisfaction survey.';
comment on column public.activities.survey_close_at is 'Optional closing timestamp for the activity satisfaction survey.';
comment on column public.activities.survey_welcome_text is 'Optional activity-specific welcome text shown before the satisfaction survey.';

-- Keep public activity browsing independent from survey availability.
drop policy if exists "public can read published activities" on public.activities;
create policy "public can read published activities"
  on public.activities
  for select
  to anon, authenticated
  using (status = 'published');

-- Admin users retain activity control through the role model used by AuthProvider.
drop policy if exists "admins can manage activities" on public.activities;
create policy "admins can manage activities"
  on public.activities
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.staff_profiles sp
      where sp.user_id = auth.uid()
        and sp.active = true
        and sp.role in ('admin', 'dean', 'deputy_dean', 'finance_head', 'section_head')
    )
  )
  with check (
    exists (
      select 1
      from public.staff_profiles sp
      where sp.user_id = auth.uid()
        and sp.active = true
        and sp.role in ('admin', 'dean', 'deputy_dean', 'finance_head', 'section_head')
    )
  );
