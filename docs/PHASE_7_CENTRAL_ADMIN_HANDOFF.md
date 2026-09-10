# Phase 7 — Central Admin Handoff

## Decision

Lac Learning Game no longer treats its own `/admin/*` UI as the primary administration surface.

The primary administrator entry point is the **Mahidol Lampang Portal Admin**. The Portal already owns the administrator authentication boundary and the canonical Social Engagement `activities` table in the shared Supabase PostgreSQL database.

## Canonical flow

```text
Mahidol Lampang Portal
  /login
     ↓
Portal Admin Session
     ↓
Portal /admin/lac-satisfaction
     ├─ Activity selection
     ├─ Survey enable/disable
     ├─ Open/close window
     ├─ Welcome text
     ├─ Response count
     └─ CSV export
             ↓
shared public.activities.id
             ↓
Lac /survey?activity=<UUID>
             ↓
public.survey_responses
```

## Important schema correction

The central Portal activity model uses:
- `activities.id`
- `activities.activity_date`
- `activities.featured_image`
- `activities.status` (`draft`, `published`, `archived`)

The older Lac activity reference used legacy fields such as `date` and `cover_image`. New Lac code must use the canonical Portal activity identity/schema and must not create another activity identity.

## Security

The public survey can submit responses under the database rules already defined for published/active survey events. Satisfaction analytics and export are administrator-only.

Do not add a second Lac admin password. Do not expose the Supabase service/database credential to the browser.

## Remaining deployment requirement

The Portal deployment must have its existing `ADMIN_PASSWORD` and `DATABASE_URL` configured. The central admin page is protected by the Portal's existing server-side admin session (`/api/auth/me`).
