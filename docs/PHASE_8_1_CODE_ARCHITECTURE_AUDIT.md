# Phase 8.1 — RAC Code & Architecture Audit

**Repository:** `NaiBossZer/mahidol-rac`  
**Audit baseline:** `main` @ `d489c078976367d4b1522c8acafd8faeaab13a7d`  
**Scope:** code architecture, Supabase boundary, activity schema, admin boundary, legacy integrations, and production-readiness risks.

## 1. Executive result

Phase 8.1 has started with a repository-wide static audit. The application has already moved its intended administration boundary to the Mahidol Lampang Portal, but the RAC repository still contains legacy admin routes, legacy activity field usage, and a historical Google Apps Script URL/compatibility bridge.

**Decision:** do not add new RAC feature scope until the remaining Phase 8 stabilization items are resolved and verified.

## 2. Architecture findings

### A. Central administration boundary — PARTIAL

The Phase 7 handoff correctly identifies the Portal as the primary administration surface. However, `src/main.tsx` still exposes three RAC admin routes:

- `/admin/activity`
- `/admin/activity-satisfaction`
- `/admin/survey-export`

These routes are guarded by `AdminRoute`, but their continued presence conflicts with the intended single-admin-boundary architecture unless they are explicitly retained as transitional compatibility routes.

**Action for Phase 8.2/8.5:** decide and implement one of:
1. redirect/deprecate the RAC admin routes to the Portal; or
2. formally document them as temporary compatibility surfaces with a removal target.

### B. Canonical activity schema — FAIL / LEGACY USAGE REMAINS

The canonical Portal activity schema uses:

- `activities.id`
- `activities.activity_date`
- `activities.featured_image`
- `activities.status`

The RAC codebase still contains legacy `date` and `cover_image` usage in dashboard/export/activity repository code. This creates a schema-drift risk and can break against the central activity table.

Observed locations include:

- `src/features/activity/data/activityRepository.ts`
- `src/features/dashboard/hooks/useDashboardData.ts`
- `src/features/dashboard/SurveyExportAdminPage.tsx`
- `src/features/activity/ActivitySatisfactionAdminPage.tsx`
- `src/features/dashboard/components/ExecutiveActivityContext.tsx`

**Action for Phase 8.3:** remove legacy field dependencies and map all RAC activity reads/writes to the canonical shared schema.

### C. Local RAC activity migration — HIGH RISK / REFERENCE-ONLY INTENT NOT ENFORCED

`supabase/migrations/202609090001_activity_content.sql` explicitly says the canonical Supabase project is the Facility-Safety/central project and that this migration is only a schema reference. Nevertheless, the SQL still defines a separate-style `public.activities` schema using legacy fields and broad authenticated CRUD policies.

This is dangerous if someone applies the migration directly to the central database because it can recreate or conflict with the canonical activity model and security boundary.

**Action for Phase 8.2/8.3:** mark the file as reference-only in a way that cannot be mistaken for an apply-ready migration, and ensure the canonical migration lives in the central Supabase repository.

### D. Google Apps Script dependency — LEGACY CODE REMAINS

The repository still contains a hard-coded Google Apps Script URL in `src/features/survey/SurveyPage.tsx`. `src/routes/survey.tsx` contains a compatibility interception that prevents requests to the historical URL from reaching Google and persists the response directly to Supabase.

This is a successful compatibility transition conceptually, but the stale URL and interception increase complexity and make it easy to misunderstand the real persistence path.

**Action for Phase 8.4:** remove the historical URL and compatibility interception after confirming no supported flow depends on it.

### E. Supabase client boundary — GOOD BASELINE

`src/lib/supabase.ts` creates the browser client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. The static audit found no `service_role`, `DATABASE_URL`, or equivalent server credential reference in the RAC repository search.

This is consistent with the intended security boundary: browser code must never receive privileged database credentials.

**Action:** retain this boundary and add no privileged credentials to RAC frontend code.

### F. Survey persistence — GOOD BASELINE, SECURITY MUST BE VERIFIED

The survey repository inserts into `public.survey_responses`, and the latest RLS migration defines public submission rules with activity/window constraints. Dashboard and export paths query the same table.

The architecture is consistent with the Phase 7 design, but actual central Supabase application of the migrations must be verified separately before production sign-off.

## 3. Production-readiness checklist

| Area | Status | Phase |
|---|---|---|
| Portal is intended primary admin boundary | PASS | 7 |
| RAC legacy admin routes removed/redirected | OPEN | 8.5 |
| Canonical `activities` schema used everywhere | FAIL | 8.3 |
| Legacy Google Apps Script code removed | OPEN | 8.4 |
| Browser uses anon Supabase key only | PASS (static audit) | 8.2 |
| Central Supabase migrations applied | NOT VERIFIED | 8.2 |
| Survey RLS verified in real DB | NOT VERIFIED | 8.2 |
| Build/lint/smoke on current HEAD | NOT VERIFIED | 8.7 |
| Vercel production deployment | BLOCKED/UNVERIFIED | 8.8 |

## 4. Security conclusions

1. No privileged Supabase credential was found by the targeted repository search.
2. The browser-side Supabase client uses the anon key boundary.
3. The remaining major security/architecture concern is **duplicate administration surfaces**, not credential exposure.
4. The legacy activity migration contains an overly broad authenticated management policy and must not be treated as the canonical central migration.
5. RLS must remain the final enforcement layer; frontend route guards are not sufficient.

## 5. Phase 8.1 exit criteria

Phase 8.1 is considered **audit-complete, not production-complete** when this document is committed and the findings are converted into the Phase 8.2–8.8 implementation/verification sequence.

### Recommended execution order

1. **8.2 Supabase boundary + central DB verification**
2. **8.3 Canonical activity schema cleanup**
3. **8.4 Remove Google Apps Script compatibility remnants**
4. **8.5 Deprecate/redirect RAC admin surfaces**
5. **8.6 Auth/RLS boundary audit**
6. **8.7 Build + lint + smoke verification**
7. **8.8 Production/Vercel verification**

No new Learning Center feature work should bypass this stabilization sequence.
