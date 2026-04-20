# Tasks: LAB-004: Advanced Inserts & Write Concerns

**Input**: Design documents from `/specs/004-advanced-CRUD-inserts/`

**Validation Goal**: The tests must confirm the use of `ordered: false` by verifying the count of documents after a partial failure, and `writeConcern` adherence by checking the success of a "majority" write request.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory from `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Ensure `docker-compose.yml` reflects `mongodb_lab_004`.

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T004 Write `tests/01-ordered.test.js` asserting that exactly X documents were inserted despite errors in the set.
- [ ] T005 Write `tests/02-write-concern.test.js` validating the server's acknowledgment of a majority write.
- [ ] T006 Provide code comments explaining the `WriteError` object structure in tests.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T007 Write the theoretical `CONCEPT.md` detailing "Acknowledgement vs Durability".
- [ ] T008 Write the step-by-step native `README.md` guide for Scenario 1 (Ordered/Unordered) and Scenario 2 (WriteConcern).
- [ ] T009 Inject **Command Dissection** for `writeConcern: { w: "majority", j: true }`.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T010 Verify `make clean` / `docker-compose down -v` works.
- [ ] T011 Perform E2E learner path walkthrough.
