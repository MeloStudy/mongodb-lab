# Tasks: LAB-019 Advanced Analytics Stages

**Input**: Design documents from `/specs/019-advanced-analytics-stages/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: "TDD for Learning". The Jest tests must strictly validate the output of the complex pipelines taught in the README.

## Phase 1: Monorepo Setup & Data Seeding
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Ensure `docker-compose.yml` uses `mongodb_lab_019`.
- [ ] T004 Implement `init/seed.js` with customers, orders, employees, and products.
- [ ] T004.1 Implement `init/global_seed.js` for `global_metadata` database.

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T005 Write `tests/joins.test.js` for Scenario 1 ($lookup).
- [ ] T006 Write `tests/recursion.test.js` for Scenario 2 ($graphLookup).
- [ ] T007 Write `tests/analytics.test.js` for Scenario 3 ($facet) and 4 ($merge).
- [ ] T008 Write `tests/cross_db.test.js` for Scenario 5 (Cross-Database Join).
- [ ] T009 Add detailed comments to tests explaining the validation logic.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T010 Write `CONCEPT.md` focusing on Aggregation Engine internals.
- [ ] T011 Write `README.md` with the 5-scenario walkthrough.
- [ ] T012 Add **Command Dissection** for all 5 advanced stages.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T013 Verify `docker-compose down -v --remove-orphans` works.
- [ ] T014 Verify `Makefile` shortcuts.
- [ ] T015 Final E2E "Learner Journey" pass.
