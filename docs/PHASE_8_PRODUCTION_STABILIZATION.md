# Phase 8 — RAC Production Stabilization

## Scope

Phase 8 stabilizes Mahidol RAC after the Phase 7 central-admin handoff. RAC remains focused on public learning, activity presentation, survey submission, and executive read-only analysis while administration remains in Mahidol Lampang Portal.

## Completed implementation

### 8.1 Code and architecture audit

- Central activity identity remains `public.activities.id`.
- RAC consumes canonical activity fields: `activity_date`, `featured_image`, `status`.
- RAC no longer writes activity content from its browser UI.
- RAC admin implementations for activity management, satisfaction administration, and survey export were removed.
- `/admin/*` is no longer an RAC feature route and is redirected to `/login`.
- A source-level Phase 8 architecture/security audit is enforced in CI.

### 8.2 Supabase boundary

- Browser client uses public Supabase configuration only.
- Survey submissions use `public.survey_responses` under Supabase RLS.
- Satisfaction administration remains owned by Portal.
- No Supabase service-role/database credential is permitted in RAC browser source.

### 8.3 Canonical activity schema

The shared central Supabase project was verified and migrated from the legacy activity columns to:

- `activities.id`
- `activities.title`
- `activities.activity_date`
- `activities.category`
- `activities.featured_image`
- `activities.images`
- `activities.status`

The live database now reports `activity_date` and `featured_image`; the legacy `date` and `cover_image` columns are absent.

### 8.4 Survey persistence

The active survey flow no longer uses Google Apps Script. It validates the activity context and required respondent/rating fields, then submits directly to the central Supabase repository.

The database enforces that public submissions have PDPA consent and belong to a published, survey-enabled activity within the configured survey window.

### 8.5 Admin boundary

The intended administrator flow is:

`Portal /login → Portal /admin/lac-satisfaction → RAC /survey?activity=<UUID>`

There is no second RAC admin password or browser service-role credential.

### 8.6 Quality gate

`.github/workflows/phase-7-quality.yml` is now the Phase 8 Quality Gate and runs lockfile synchronization, clean dependency installation, architecture/security audit, ESLint, production build, and smoke tests.

## Live Supabase verification

The shared Supabase project was checked after the Phase 8 migration:

- Project status: `ACTIVE_HEALTHY`.
- Applied migration: `canonical_activity_schema_phase_8`.
- `activities` has `activity_date` and `featured_image`.
- `activities` no longer has `date` or `cover_image`.
- Public activity reads are restricted to `status = 'published'`.
- Public survey inserts are restricted by PDPA consent and activity survey-window rules.
- No published activities currently exist in the live database, so public activity/survey testing requires an administrator to publish an activity first.

## Security findings

Supabase security advisors no longer report the activity trigger's mutable search-path warning after the Phase 8 hardening migration.

The shared central project still reports pre-existing warnings for several `SECURITY DEFINER` RPC functions and for leaked-password protection being disabled. These functions belong to the shared Facility/Safety platform and were not changed as part of RAC Phase 8 because changing their execution model could break other domain workflows. They should be handled in the central security-hardening phase.

## Deployment status

Vercel has reported a build-rate-limit status for this repository. This is an infrastructure/plan limitation and is not evidence of a source-code build failure.

The Phase 8 implementation is complete. Final production sign-off remains conditional on a green GitHub Quality Gate and a successful Vercel deployment/public-route smoke test.

## Exit criteria

- [x] RAC admin boundary handed to Portal
- [x] Canonical activity schema adopted by active application code
- [x] Legacy Apps Script survey transport removed from active flow
- [x] Legacy RAC admin route implementations removed
- [x] Browser service-role credential guard added to CI audit
- [x] Phase 8 quality workflow added
- [x] Central Supabase activity schema/RLS verified live
- [x] Activity trigger search path hardened
- [ ] Latest Phase 8 CI run green
- [ ] Vercel production deployment verified without build-rate-limit blockage
