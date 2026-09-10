# Phase 7.2 — Satisfaction Data Contract + Activity ID

## Canonical relationship

```text
Activity (activities.id)
        │
        └── Survey URL: /survey?activity=<activities.id>
                         │
                         └── Survey submission
                              ├── activity_id
                              ├── survey_contract=7.2
                              ├── submitted_at
                              └── pdpa_consent
```

The activity UUID is the canonical event identity. Activity title/date must not be used as the primary join key.

## Frontend contract

`src/features/survey/surveyDataContract.ts` defines:

- `SURVEY_CONTRACT_VERSION` = `7.2`
- `SurveyActivityContext`
- `SurveySubmissionContract`
- `getSurveyActivityId()`
- `withSurveyActivityContext()`

## Current submission bridge

The existing survey still posts to the Google Apps Script endpoint. Phase 7.2 keeps that transport unchanged and adds the canonical event context at the route boundary so the existing questionnaire does not need to be rewritten in this phase.

When the survey is opened with `?activity=<uuid>`, the route adds:

- `activity_id=<uuid>`
- `survey_contract=7.2`
- `submitted_at=<ISO timestamp>`
- `pdpa_consent=true`

This creates a stable data contract for the next analytics/dashboard phases.

## Activity-specific URL

Example:

```text
/survey?activity=<ACTIVITY_UUID>
```

The UUID must come from `activities.id`.

## Backward compatibility

A survey opened without `activity` is still rendered by the current UI. It does not receive an `activity_id` automatically. New activity QR codes/links should always use the activity-specific URL.

## Next phase dependency

Phase 7.3 should update the submission transport/backend so `activity_id` is persisted as a first-class field and can be queried directly by the dashboard. Phase 7.4 can then calculate satisfaction metrics per activity/event without matching on activity titles.
