# Tasks: 015-geospatial-data

**Input**: Design documents from `/docs/specs/015-geospatial-data/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Ensure the learner can correctly model GPS data and perform efficient spatial queries using MongoDB's spherical engine.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory `labs/015-geospatial-data`.
- [ ] T002 Update `package.json` workspace identifier.
- [ ] T003 Configure `docker-compose.yml` (container name: `mongodb_lab_015`).

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T004 Write `tests/01-proximity.test.js` to verify `$nearSphere` logic and `2dsphere` index.
- [ ] T005 Write `tests/02-area.test.js` to verify `$geoWithin` polygon containment.
- [ ] T014 Write `tests/03-advanced-geo.test.js` to verify `$geoIntersects` and `$geoNear` aggregation logic.
- [ ] T006 Add thorough comments to test scripts.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T007 Write `CONCEPT.md` with GeoJSON and Spherical Geometry theory.
- [ ] T008 Implement `init/seed.js` with Points and Polygon-ready datasets.
- [ ] T009 Write `README.md` for the "Coffee Hunter" scenario ($nearSphere).
- [ ] T010 Write `README.md` for the "Delivery Zone" scenario ($geoWithin).
- [ ] T011 Inject **Command Dissection** for spatial operators.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T012 Verify Atomic Cleanup (`docker-compose down -v`).
- [ ] T013 Perform end-to-end "Learner Journey" Walkthrough.
