# Tasks: LAB-005: Advanced Queries & Projections

**Input**: Design documents from `/specs/005-advanced-queries-projections/`

**Validation Goal**: Tests must fail if the student uses simple dot-notation for multi-criteria array searches, as this causes "false positive" matches.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory from `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Ensure `docker-compose.yml` reflects `mongodb_lab_005`.

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T004 Write `tests/01-queries.test.js` asserting correct count on nested array filtering.
- [ ] T005 Write `tests/02-projections.test.js` checking that output JSON excludes `_id` and `internal_code`.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T006 Write `CONCEPT.md` detailing "Array Query Semantics".
- [ ] T007 Write the step-by-step native `README.md` guide for `$elemMatch` and Projections.
- [ ] T008 Inject **Command Dissection** for `$elemMatch` and Projection objects.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T009 Verify `make clean` works.
- [ ] T010 Perform E2E learner path walkthrough.
