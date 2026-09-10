-- Phase 8: canonical activity contract
-- Applied to the shared central Supabase project.
-- RAC does not own activity administration.

alter table public.activities rename column date to activity_date;
alter table public.activities rename column cover_image to featured_image;

create index if not exists activities_status_activity_date_idx
  on public.activities (status, activity_date desc);
