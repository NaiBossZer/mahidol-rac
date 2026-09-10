# Phase 7.5 — Event Filter + Activity Context + Executive Dashboard

## Status

IMPLEMENTED — GitHub

## Objective

Make the satisfaction dashboard usable for executive review at both portfolio level and individual activity/event level.

## Implemented

### Event Filter

`/dashboard?activity=<activity_id>` is the canonical deep-link for an individual activity.

The dashboard route provides an activity selector with:

- all activities / all events
- individual activity/event
- clear filter action

The existing dashboard analytics continue to consume the same `activity_id` query context.

### Executive Activity Context

When an activity is selected, the dashboard displays:

- activity cover image
- activity title
- activity date
- category
- response count
- canonical activity UUID
- executive context label

When no activity is selected, the context card becomes an overall portfolio view and shows the total response count.

### Response Count

The route queries `survey_responses` with an exact count and applies `activity_id` when an event is selected. This keeps the executive context count aligned with the selected event.

### Architecture

```text
Activity Filter
      ↓
activity_id (UUID)
      ↓
Executive Activity Context
      ↓
Base Satisfaction Dashboard
      ↓
KPI / Category / Affiliation / Feedback analytics
```

## Files

- `src/routes/dashboard.tsx`
- `src/features/dashboard/components/ExecutiveActivityContext.tsx`
- `src/features/dashboard/hooks/useDashboardData.ts`

## Notes

This phase does not introduce a second analytics data source. Supabase remains the source of satisfaction responses.

Production build and browser end-to-end verification still need to be run before declaring the phase production-verified.
