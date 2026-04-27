# Tasks: LAB-018 Pipeline Fundamentals

**Input**: Design documents from `/specs/018-pipeline-fundamentals/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: "TDD for Learning". Tests must ensure the student's pipeline outputs match the expected data transformations.

## Phase 1: Monorepo Setup & Data Seeding
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Ensure `docker-compose.yml` uses `mongodb_lab_018`.
- [ ] T004 Implement `init/seed.js` with sales data (rich in arrays and decimals).

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T005 Write `tests/fundamentals.test.js` covering $match and $project.
- [ ] T006 Write `tests/grouping.test.js` covering $group and accumulators.
- [ ] T007 Write `tests/arrays.test.js` covering $unwind logic.
- [ ] T008 Write `tests/report.test.js` covering $addFields, $sort, and $limit.
- [ ] T009 Add detailed comments to all test assertions.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T010 Write `CONCEPT.md` detailing the Pipeline architecture.
- [ ] T011 Write `README.md` with step-by-step pipeline building.
- [ ] T012 Add **Command Dissection** for all 7 stages.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T013 Verify `docker-compose down -v --remove-orphans` works.
- [ ] T014 Verify `Makefile` shortcuts.
- [ ] T015 Final E2E "Learner Journey" pass.
