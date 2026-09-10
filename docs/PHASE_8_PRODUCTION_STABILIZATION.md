# Phase 8 — RAC Production Stabilization

## Scope

Phase 8 stabilizes Mahidol RAC after the Phase 7 central-admin handoff. The goal is to keep RAC focused on public learning, activity presentation, survey submission, and executive read-only analysis while administration remains in Mahidol Lampang Portal.

## 8.1 Code and architecture audit

- Central activity identity remains `public.activities.id`.
- RAC consumes canonical activity fields: `activity_date`, `featured_image`, `status`.
- RAC no longer writes activity content from its browser UI.
- RAC admin routes are removed from the application route table and `/admin/*` is redirected to `/login`.
- A source-level Phase 8 audit is enforced in CI.

## 8.2 Supabase boundary

- Browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only.
- Survey submissions use `public.survey_responses` directly under Supabase RLS.
- Satisfaction analytics remain read-only application functionality; administration is owned by Portal.
- No Supabase service-role/database credential is permitted in RAC browser source.

## 8.3 Canonical activity schema

RAC presentation code now uses a typed model backed by:

- `activities.id`
- `activities.title`
- `activities.activity_date`
- `activities.category`
- `activities.featured_image`
- `activities.images`
- `activities.status`

The old `date` / `cover_image` activity contract is no longer used by active RAC application code.

## 8.4 Survey persistence

The legacy Google Apps Script transport has been removed from the active survey flow. The survey now builds a validated submission payload and calls the central Supabase repository directly.

The survey requires:

- activity context from `?activity=<UUID>`
- PDPA consent
- required respondent fields
- all Likert ratings

Database errors return a user-visible failure state instead of treating a `no-cors` request as successful.

## 8.5 Admin boundary

The RAC application no longer exposes activity-management, satisfaction-admin, or CSV-export admin pages. The intended administrator flow is:

`Portal /login → Portal /admin/lac-satisfaction → RAC /survey?activity=<UUID>`

## 8.6 Quality gate

`.github/workflows/phase-7-quality.yml` is now the Phase 8 Quality Gate and runs:

1. lockfile synchronization
2. clean dependency installation
3. Phase 8 architecture/security audit
4. ESLint
5. production build
6. smoke tests

## 8.7 Deployment note

Vercel has previously reported a build-rate-limit status for this repository. That is an infrastructure/plan limitation and is not treated as a code-quality pass or fail.

Production is considered verified only when the Phase 8 GitHub quality gate is green and the deployed RAC public routes are manually smoke-tested.

## Exit criteria

- [x] RAC admin boundary handed to Portal
- [x] Canonical activity schema adopted by active application code
- [x] Legacy Apps Script survey transport removed
- [x] Legacy RAC admin route implementations removed
- [x] Browser service-role credential guard added to CI audit
- [x] Phase 8 quality workflow added
- [ ] Latest Phase 8 CI run green
- [ ] Central Supabase production schema/RLS independently verified against the live project
- [ ] Vercel production deployment verified without build-rate-limit blockage
