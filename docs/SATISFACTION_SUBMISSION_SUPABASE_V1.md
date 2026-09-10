# Phase 7.3 — Satisfaction Submission / Data Persistence

## Decision

The satisfaction system now uses **Supabase as the system of record**.
Google Sheets / Google Apps Script is no longer the persistence destination.

## Data flow

```text
/survey?activity=<activities.id>
        ↓
existing survey UI
        ↓
Phase 7.3 compatibility bridge
        ↓
Supabase `survey_responses`
        ↓
Admin Dashboard / Admin CSV Export
```

The canonical activity identity is `activities.id` (UUID). The activity title/date are descriptive fields only and are not used as the join key.

## Persistence table

`public.survey_responses`

Required controls:

- `activity_id` foreign key → `public.activities.id`
- `contract_version`
- `submitted_at`
- 14 Likert fields, each constrained to 1–5
- `feedback`
- `pdpa_consent = true`
- indexes for activity and submission date
- RLS enabled

## RLS

### Public submission

Anonymous and authenticated respondents may insert only when:

- PDPA consent is true
- the referenced activity exists
- the activity status is `published`

### Admin read/export

Read access is restricted to active `staff_profiles` with one of:

- `admin`
- `dean`
- `deputy_dean`
- `finance_head`
- `section_head`

## Admin export

Protected route:

`/admin/survey-export`

Capabilities:

- filter by activity
- filter by year
- preview response rows
- export UTF-8 CSV with BOM for Excel/Thai compatibility
- include activity title/date and all survey fields

## Reliability notes

The current survey component is a large legacy UI that still calls its historical Apps Script URL. Phase 7.3 intercepts that request at the route boundary and writes directly to Supabase; the Apps Script endpoint is not contacted.

This is intentionally a compatibility bridge so the questionnaire UI can migrate without a large visual rewrite. A later cleanup can remove the obsolete Apps Script constant and call `saveSurveySubmission()` directly from the form component.

## Verification

Migration `202609100001_satisfaction_responses.sql` was applied to the configured Supabase project and the `survey_responses` table, indexes, foreign key, and RLS policies were verified in the live schema.
