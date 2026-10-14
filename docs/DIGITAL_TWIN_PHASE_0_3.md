# Digital Twin MVP — Phase 0–3

Branch: `feature/digital-twin-learning-zones`

## Current findings

- The repository already contains `public/rac-room3d.glb`.
- The home page previously used `model-viewer` 3.4.0 from Google's CDN to display the model with camera controls.
- The new page reuses that GLB and browser component instead of introducing a second 3D engine.
- Runtime model bounds are read using `getDimensions()` and `getBoundingBoxCenter()` when the GLB loads. Hotspot positions are generated as relative offsets from these bounds.
- The six learning topics are structured in `src/features/digital-twin/data/zones.ts` and can be adjusted without rewriting the page.

## Calibration limitation

The GLB binary was confirmed to exist in the repository, but this source review did not decode or visually inspect its geometry, axes, camera framing, or room plan. Therefore the hotspot offsets in `zones.ts` are initial placement estimates only. Calculating a model bounding box makes the offsets scale-aware; it does not infer the semantic location of an exhibit.

Before treating this as production-ready, open the Preview URL and calibrate the `modelPosition.x`, `modelPosition.z`, and `modelPosition.height` values in `zones.ts` against the actual exhibit locations in the room model. Record the final zone mapping from a reference floor plan or an annotated screenshot.

## Phase 0 — model audit

- [x] Confirm GLB file path and existing viewer integration.
- [x] Retain the current model and avoid adding another 3D dependency.
- [x] Add runtime error/loading states and read the bounds exposed by model-viewer.
- [ ] Visually verify the real GLB and calibrate each hotspot to a known physical area.

## Phase 1 — Digital Twin viewer

- [x] Add dedicated `/digital-twin` route.
- [x] Reuse the existing model with rotation, zoom, camera controls and a reset action.
- [x] Add a clear loading state and a model-load error state.
- [x] Keep `main` unchanged; all work stays on the feature branch.

## Phase 2 — learning zones

- [x] Add a data-driven set of six zones with distinct colours, titles and icons.
- [x] Render selectable model-viewer hotspot buttons.
- [x] Add a zone gallery that can also select/focus each zone.
- [ ] Calibrate all hotspot positions in the deployed Preview.

## Phase 3 — learning journey

- [x] Show zone descriptions, recommended duration and learning outcomes.
- [x] Support selecting zones in any order.
- [x] Provide sequential next-zone navigation and an in-session completion indicator.
- [x] Label progress as session-only; no learner data is sent to Supabase or stored remotely.

## Validation before merge

1. Run `npm run typecheck`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Inspect `/digital-twin` on desktop and mobile.
5. Confirm the GLB loads and the camera works.
6. Verify hotspot alignment with the room layout and adjust the data offsets.
7. Confirm the home page's existing video and 3D tabs still work.
