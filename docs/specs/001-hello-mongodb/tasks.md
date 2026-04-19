# Tasks: LAB-001 Hello MongoDB

**Input**: Design documents from `/specs/001-hello-mongodb/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: This project follows strict "TDD for Learning" (Test-Driven Learning). The automated tests (Jest/JUnit) MUST ensure exactly what the README teaches.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier to `lab-001-hello-mongodb`.
- [ ] T003 Ensure `docker-compose.yml` reflects the correct container name format (`mongodb_lab_001`).
- [ ] T004 Prepare the empty skeleton `driver.js` script for Student usage in Phase 2.

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T005 Write validation script `tests/01-shell.test.js` to assert Scenario 1 (Document exists via Shell query).
- [ ] T006 Write validation script `tests/02-driver.test.js` to assert Scenario 2 (Document exists via Driver query).
- [ ] T007 Provide required codebase comments on what each test step validates.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T008 Write the theoretical `CONCEPT.md` detailing "Why" JS and JSON/BSON form the backbone of Mongo's shell.
- [ ] T009 Write the step-by-step native `README.md` guide for Scenario 1 and 2.
- [ ] T010 Inject **Command Dissection** blocks into `README.md` for `docker exec` and basic `insertOne`.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T011 Verify `README.md` Atomic Cleanup command runs natively without errors (`docker-compose down -v --remove-orphans`).
- [ ] T012 Verify `Makefile` shortcut targets operate purely as optional proxies handling `01-shell` and `02-driver` tests.
- [ ] T013 Perform end-to-end "Learner Journey" Walkthrough.
