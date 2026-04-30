# Tasks: LAB-018 Pipeline Fundamentals

**Input**: Design documents from `/specs/018-pipeline-fundamentals/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: "TDD for Learning". Tests must ensure the student's pipeline outputs match the expected data transformations and operational settings.

## Phase 1: Monorepo Setup & Data Seeding
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Ensure `docker-compose.yml` uses `mongodb_lab_018`.
- [ ] T004 Implement `init/seed.js` with sales data (including refunds and empty arrays).

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T005 Write `tests/01-fundamentals.test.js` (Verification of Predicate Pushdown and $match/$project).
- [ ] T006 Write `tests/02-grouping.test.js` (Verification of $group with refunds).
- [ ] T007 Write `tests/03-arrays.test.js` (Verification of $unwind with preserveNullAndEmptyArrays).
- [ ] T008 Write `tests/04-report.test.js` ($addFields, $sort, $limit).
- [ ] T009 Write `tests/05-memory.test.js` (Verification of `allowDiskUse`).

## Phase 3: Educational Content & Hands-On Environment
- [ ] T010 Write `CONCEPT.md` (Pipeline architecture, Pushdown optimization, 100MB limit).
- [ ] T011 Write `README.md` (Step-by-step pipeline building with .explain() analysis).
- [ ] T012 Add **Command Dissection** for all 7 stages + operational options.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T013 Verify `docker-compose down -v --remove-orphans` works.
- [ ] T014 Final E2E "Learner Journey" pass.
