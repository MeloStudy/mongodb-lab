# Tasks: LAB-006: Advanced Updates (Atomic Operators & Arrays)

**Input**: Revised specs for Full Mastery Update Operators.

## Phase 1: Environment & Scaffolding
- [ ] T001 Scaffold lab directory from `labs/000-base-setup/`.
- [ ] T002 Configure `package.json` and `docker-compose.yml` for Lab 006.

## Phase 2: Implementation of Scenarios (TDD)
- [ ] T003 Write `tests/01-field-ops.test.js`: Validating `$inc`, `$mul`, and `$set`.
- [ ] T004 Write `tests/02-array-mutation.test.js`: Validating `$push`, `$addToSet`, and `$pull`.
- [ ] T005 Write `tests/03-positional-surgery.test.js`: Validating `$[]` and `arrayFilters`.

## Phase 3: Documentation & Educational Content
- [ ] T006 Write `CONCEPT.md` detailing the transition from "Full Document Overwrite" to "Atomic Operators".
- [ ] T007 Design `README.md` with the "Smart Home" scenario.
- [ ] T008 Inject **Command Dissections** for `arrayFilters` and `writeConcern` (revisited).

## Phase 4: Verification
- [ ] T009 Ensure `make clean` works correctly.
- [ ] T010 Perform E2E walkthrough of the lab.
