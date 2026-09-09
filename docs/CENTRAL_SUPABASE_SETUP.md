# Mahidol RAC — Central Supabase setup

Mahidol RAC is a client of the same Supabase project used by Facility-Safety.

## Environment

Create `.env.local` locally (never commit it):

```env
VITE_SUPABASE_URL=https://rdnbodadxvvykfrxmeqn.supabase.co
VITE_SUPABASE_ANON_KEY=<client anon key>
```

## Authentication

Login uses Supabase Email/Password Auth. User records are created in Supabase Authentication and linked to `public.staff_profiles`.

Role is read from `staff_profiles.role`; browser metadata and localStorage are not trusted for authorization.

## Protected routes

- `/dashboard` — authenticated users
- `/admin/activity` — active manager roles only

The Activity CMS UI guard is convenience only. Database and Storage RLS are the final security boundary.

## Central migrations

The canonical migration files live in Facility-Safety:

1. `001_init_schema.sql`
2. `002_shared_activity_content.sql`
3. `003_supabase_auth_profiles.sql`
4. `004_production_security.sql`
5. `005_shared_activity_admin_rls.sql`

Apply them to the central Supabase project before production use.

## Activity CMS

Activities are stored in `public.activities` and media in the `activity-images` bucket. Public users can read published content; manager roles can manage content.

## Facility data

Mahidol RAC now has a shared Facility data repository for buildings, work orders, and inspections. Existing survey Dashboard analytics remain on their current data source until the survey schema is migrated deliberately.
