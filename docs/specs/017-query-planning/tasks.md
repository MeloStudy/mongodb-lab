# Tasks: 017-query-planning

**Input**: Design documents from `/docs/specs/017-query-planning/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Ensure the learner can audit and control the MongoDB Query Optimizer.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [x] T001 Scaffold lab directory `labs/017-query-planning`.
- [x] T002 Update `package.json` workspace identifier.
- [x] T003 Configure `docker-compose.yml` (container name: `mongodb_lab_017`).

## Phase 2: Data Seeding & Index Setup
- [x] T004 Implement `init/seed.js` to generate 10,000 telemetry documents with skewed data.
- [x] T005 Implement `init/indexes.js` to create competing indexes for the scenarios.
- [x] T006 Verify data and indexes are available upon `docker-compose up`.

## Phase 3: Validation Framework (TDD)
- [x] T007 Write `tests/01-plan-selection.test.js` (Audit `winningPlan` and `rejectedPlans`).
- [x] T008 Write `tests/02-hint-override.test.js` (Verify `.hint()` functionality).
- [x] T009 Write `tests/03-cache-management.test.js` (Verify Plan Cache commands).
- [x] T010 Write `tests/04-index-filters.test.js` (Verify Index Filter functionality).
- [ ] T010b Write `tests/05-covered-query.test.js` (Verify Covered Query advantage).

## Phase 4: Educational Content
- [/] T011 Write `CONCEPT.md` (Query Shapes, **The Works Metric**, Stages).
- [/] T012 Write `README.md` (Scenarios, **Explain Field Dissection**).
- [ ] T013 Add Command Dissection for `explain()` output fields and Plan Cache methods.

## Phase 5: Finalization
- [ ] T014 Verify Atomic Cleanup (`docker-compose down -v`).
- [ ] T015 Perform "Learner Journey" walkthrough and verify all tests pass.
