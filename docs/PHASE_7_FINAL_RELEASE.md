# Phase 7 — Final Release

## Scope

Phase 7 delivers an activity-based satisfaction assessment system for the Mahidol RAC learning/activity platform.

## Final architecture

`Activity → Activity-specific Survey → Supabase survey_responses → Event Filter → Executive Dashboard → Admin Export`

## Delivered

### 7.1 Audit
- Baseline audit of survey, dashboard, activity administration, authentication and data flow.
- Identified canonical `activity_id` as the event identity.

### 7.2 Data Contract
- Survey contract version 7.2 introduced activity context.
- Activity UUID is the canonical relationship key.

### 7.3 Supabase Persistence + Export
- Supabase is the system of record for survey responses.
- `public.survey_responses` stores the complete 14-item satisfaction response set.
- Admin-only CSV export is available at `/admin/survey-export`.
- CSV includes activity context, respondent dimensions, all ratings, feedback and PDPA consent.

### 7.4 Admin Activity / Satisfaction Control
- Admin activity-level survey controls.
- `survey_enabled` toggle.
- `survey_open_at` / `survey_close_at` response window.
- `survey_welcome_text` activity-specific welcome message.
- Database RLS enforces published activity + enabled survey + valid response window.

### 7.5 Event Filter + Executive Activity Context
- Dashboard supports activity/event filtering by `activity_id`.
- Deep link: `/dashboard?activity=<activity-id>`.
- Executive activity context shows cover image, title, date, category and response count.
- KPI and satisfaction analytics recalculate for the selected event.

### 7.6–7.9 Release Quality Gate
- Repository quality gate added at `.github/workflows/phase-7-quality.yml`.
- Every push to `main` and pull request runs:
  - `npm ci`
  - `npm run lint`
  - `npm run build`
  - `npm run smoke`
- Final release is not considered verified until the GitHub Actions run for the release commit is green.

## Supabase verification

Verified production schema contains:

- `activities.survey_enabled`
- `activities.survey_open_at`
- `activities.survey_close_at`
- `activities.survey_welcome_text`
- `survey_responses.activity_id`
- `survey_responses.contract_version`
- all 14 Likert fields
- `survey_responses.pdpa_consent`

## Deployment

The application is committed to `main`. If the repository is connected to Vercel, the `main` push is the production deployment trigger. The GitHub Quality Gate is the authoritative build/test verification layer.

A Vercel deployment URL is intentionally not hard-coded here because the repository does not expose a Vercel project URL through GitHub metadata.

## Known cleanup note

The legacy survey feature still contains the historical Google Apps Script constant in its source for compatibility with the old form implementation. The route-level bridge prevents that endpoint from being contacted for activity-scoped submissions and writes directly to Supabase. Removing the dead constant and direct legacy fetch is a follow-up code-cleanup task, not a change to the production data destination.

## Release status

**PHASE 7 IMPLEMENTATION COMPLETE**

**Production verification:** pending the GitHub Actions quality-gate result and the Vercel deployment result for the release commit.
