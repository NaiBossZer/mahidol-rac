create or replace function public.can_submit_survey(p_activity_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.activities a
    where a.id = p_activity_id
      and a.status = any (array['published'::text, 'completed'::text])
      and a.survey_enabled = true
      and (a.survey_open_at is null or now() >= a.survey_open_at)
      and (a.survey_close_at is null or now() <= a.survey_close_at)
  );
$$;

revoke all on function public.can_submit_survey(uuid) from public;
grant execute on function public.can_submit_survey(uuid) to anon, authenticated;

drop policy if exists "public can submit satisfaction" on public.survey_responses;
drop policy if exists "public can submit satisfaction responses" on public.survey_responses;

create policy "public can submit satisfaction responses"
on public.survey_responses
for insert
to anon, authenticated
with check (
  pdpa_consent = true
  and public.can_submit_survey(activity_id)
);
