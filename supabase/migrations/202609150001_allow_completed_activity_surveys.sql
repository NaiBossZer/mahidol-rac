-- Public satisfaction surveys may remain open after an activity is completed.
-- The explicit survey window and survey_enabled flag remain the controlling gates.

drop policy if exists "public can submit satisfaction responses" on public.survey_responses;

create policy "public can submit satisfaction responses"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (
    pdpa_consent = true
    and exists (
      select 1
      from public.activities a
      where a.id = activity_id
        and a.status in ('published', 'completed')
        and a.survey_enabled = true
        and (a.survey_open_at is null or now() >= a.survey_open_at)
        and (a.survey_close_at is null or now() <= a.survey_close_at)
    )
  );
