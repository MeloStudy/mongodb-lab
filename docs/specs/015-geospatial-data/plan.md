# Implementation Plan: 015-geospatial-data

**Branch**: `015-geospatial-data` | **Date**: 2026-04-25
**Input**: Specification from `/docs/specs/015-geospatial-data/spec.md`

## Summary

This lab introduces the learner to the Geospatial capabilities of MongoDB. We will move away from simple numeric queries to spherical geometry, teaching how to handle real-world location data (GPS) using the GeoJSON standard.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone from `labs/000-base-setup/`.
2. **Workspace Registration**: `@mongodb-lab/015-geospatial-data`.
3. **Data Requirements**: 
   - Seed script `init/seed.js` with:
     - A `cafes` collection (Points).
     - A `requests` collection (Points).

## Phase 2: Scenario 1 - Proximity Search ($nearSphere)
1. **Instructional Path**:
   - Introduce the GeoJSON Point format: `{ type: "Point", coordinates: [lng, lat] }`.
   - Create index: `db.cafes.createIndex({ location: "2dsphere" })`.
   - Execute: `db.cafes.find({ location: { $nearSphere: { $geometry: { ... }, $maxDistance: 1000 } } })`.
2. **Testing**:
   - `tests/01-proximity.test.js`: Verify index existence and distance-based sorting.

## Phase 3: Scenario 2 - Area Filtering ($geoWithin)
1. **Instructional Path**:
   - Define a GeoJSON Polygon for a delivery zone.
   - Execute: `db.requests.find({ location: { $geoWithin: { $geometry: { type: "Polygon", coordinates: [...] } } } })`.
2. **Testing**:
   - `tests/02-area.test.js`: Verify containment logic.

## Phase 4: Scenario 3 & 4 - Advanced Logic ($geoIntersects & $geoNear)
1. **Instructional Path (Intersects)**:
   - Model a `LineString` representing a path.
   - Execute: `db.zones.find({ area: { $geoIntersects: { $geometry: routeLineString } } })`.
2. **Instructional Path (Analytics)**:
   - Use the Aggregation Pipeline.
   - Stage: `{ $geoNear: { near: { ... }, distanceField: "dist.calculated", spherical: true } }`.

## Phase 5: Full Documentation & Dissection
1. **CONCEPT.md**: Spherical geometry, GeoJSON types, and the power of spatial aggregations.
2. **README.md**: Step-by-step "Masterclass" on geospatial engineering.
3. **Command Dissection**: `$geoNear` options (`distanceMultiplier`, `maxDistance`) and `$geoIntersects`.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Code comments in tests.
- [x] Language: English.

## Open Questions
- **Decided**: We will use `$nearSphere` instead of `$near` to emphasize spherical calculations (meters) which is more standard for real GPS data.
- **Decided**: We will use a Polygon with at least 5 coordinates (closing the loop) to teach correct GeoJSON syntax.
