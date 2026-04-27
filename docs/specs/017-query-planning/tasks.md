# Tasks: 017-query-planning

**Input**: Design documents from `/docs/specs/017-query-planning/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Ensure the learner can audit and control the MongoDB Query Optimizer.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory `labs/017-query-planning`.
- [ ] T002 Update `package.json` workspace identifier.
- [ ] T003 Configure `docker-compose.yml` (container name: `mongodb_lab_017`).

## Phase 2: Data Seeding & Index Setup
- [ ] T004 Implement `init/seed.js` to generate 10,000 telemetry documents with skewed data.
- [ ] T005 Implement `init/indexes.js` to create competing indexes for the scenarios.
- [ ] T006 Verify data and indexes are available upon `docker-compose up`.

## Phase 3: Validation Framework (TDD)
- [ ] T007 Write `tests/01-plan-selection.test.js` (Audit `winningPlan` and `rejectedPlans`).
- [ ] T008 Write `tests/02-hint-override.test.js` (Verify `.hint()` functionality).
- [ ] T009 Write `tests/03-cache-management.test.js` (Verify Plan Cache commands).
- [ ] T010 Write `tests/04-index-filters.test.js` (Verify Index Filter functionality).

## Phase 4: Educational Content
- [ ] T011 Write `CONCEPT.md` with the Query Optimizer lifecycle diagram.
- [ ] T012 Write `README.md` with step-by-step "Investigation" scenarios.
- [ ] T013 Add Command Dissection for `explain()` output fields and Plan Cache methods.

## Phase 5: Finalization
- [ ] T014 Verify Atomic Cleanup (`docker-compose down -v`).
- [ ] T015 Perform "Learner Journey" walkthrough and verify all tests pass.
