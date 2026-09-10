-- Phase 7.4: enforce per-activity survey availability at the database boundary.

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
        and a.status = 'published'
        and a.survey_enabled = true
        and (a.survey_open_at is null or now() >= a.survey_open_at)
        and (a.survey_close_at is null or now() <= a.survey_close_at)
    )
  );
