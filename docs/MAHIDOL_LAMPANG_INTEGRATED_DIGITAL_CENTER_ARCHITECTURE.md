# Mahidol Lampang Integrated Digital Center — Architecture & Prototype

Branch: `feat/whole-site-digital-twin-prototype`

## Product intent

Build a whole-site, realistic-looking, interactive 3D model as the visual control surface for the center. The first deliverable is a browser-based concept model with working orbit/zoom, selectable site locations, search and category filters. It is a hybrid-ready prototype: simulated visuals and data first, with real operational data connected incrementally.

## Existing source material discovered

The repository already contains:
- `public/map-sobprab.png`: the existing site plan used by the public-facing site.
- `src/features/map/zones.ts`: 25 named site locations with normalized 0–100 x/y positions.
- `public/rac-room3d.glb`: a separate 3D model of the integrated lac learning room.
- `src/features/knowledge/KnowledgeHubPage.tsx`: the existing six-zone learning-room viewer.

The 25 named site locations have been carried into the whole-site prototype. Their normalized map positions are treated as approximate layout anchors only. They are not surveyed geographic coordinates and must be calibrated against the site plan and on-site measurements before engineering, safety, navigation or asset-location use.

## Phase 1 — interactive whole-site concept

Route: `/campus-digital-twin`

Implementation:
- React Three Fiber / Three.js, reusing dependencies already installed in the repository.
- Isometric oblique camera with orbit, zoom, damping and selection.
- Conceptual terrain, access paths, pond, tree canopy, garden plots, greenhouses and building massing.
- 25 selectable location markers.
- Search and category filters; selected-place detail panel.
- Toggle for marker labels.
- Responsive dashboard layout and links to the existing learning-room Digital Twin.

## Site location taxonomy

| Category | Included site locations |
|---|---|
| Buildings | Office, guest house, learning laboratory / meeting yard, accommodation |
| Greenhouses | Raised vegetable beds, nursery 1, nursery 2 |
| Agricultural plots | Seasonal vegetables, kitchen garden / herbs |
| Gardens / tree plots | Teak, eucalyptus, mixed fruit, tamarind, rain tree, bamboo, Siamese rosewood, banana, cacao, cashew |
| Water | Pond |
| Security | Entrance guard post |
| Utilities | Air-quality station, workshop / tool store, agricultural goods store, compost facility |

## Phase 2 — site-accurate geometry

Required inputs:
1. Latest high-resolution site plan (north arrow, scale, boundary, roads, building footprints).
2. Surveyed building dimensions and positions, preferably DWG/DXF, IFC or Revit export; alternatively dimensioned drawings and site photographs.
3. Terrain elevations / contours if available.
4. Building names, floor counts and floor plans.
5. Confirmation of the 25 location labels and their current positions.

The model should then be rebuilt from actual footprints and dimensions. The conceptual meshes in Phase 1 must not be treated as measured geometry.

## Phase 3 — hybrid live data

Keep the 3D scene independent of business systems. Use stable site IDs and adapters to existing sources:

- Facility-Safety: building / area inspections, checklist results, corrective actions, risk status.
- Smart Farm / V-NET2.0: sensor readings, device health and historical trends.
- CCTV: camera inventory and authorized live links; do not embed credentials or expose camera streams publicly.
- Portal: central identity, roles and system registry.
- Activities & Surveys: scheduled activities and engagement indicators.

Only operational APIs should provide live values. Do not duplicate operational records in the Digital Twin database. The Digital Twin may own spatial metadata such as `site_locations`, `building_levels`, `spatial_assets` and source-to-location mappings.

## Proposed logical architecture

```text
Portal Central Admin / SSO
          |
          v
Digital Twin Web (React + React Three Fiber)
          |
          +-- Spatial Registry (site IDs, footprints, levels, coordinates)
          |
          +-- Facility-Safety API
          +-- Smart Farm / V-NET2.0 API
          +-- CCTV integration (authorized only)
          +-- Activity & Survey API
          |
          v
Supabase Auth / RBAC + source-owned data
```

## Acceptance criteria for Phase 1

- [x] Whole-site route exists.
- [x] 25 known places are selectable from the scene and list.
- [x] Search and category filters work.
- [x] 3D camera can orbit and zoom.
- [x] Selected place details update.
- [x] Marker labels can be toggled.
- [x] Existing learning-room viewer remains separate and linked.
- [ ] Validate build, typecheck and lint.
- [ ] Compare site placement with the original high-resolution site plan.
- [ ] Replace conceptual building massing with measured geometry.

## Explicit limitations

This is a visual concept model, not a survey-grade Digital Twin yet. Building footprints, dimensions, heights, tree positions, paths, terrain and marker coordinates are schematic. No live Facility-Safety, V-NET2.0, CCTV or Supabase operational values are shown in this phase.
