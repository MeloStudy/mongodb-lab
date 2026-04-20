# Tasks: LAB-002 BSON & Data Types

**Input**: Design documents from `/specs/002-bson-data-types/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Tests must verify BSON structure retention directly via `$type` server-side evaluations, not just object existence.

## Phase 1: Monorepo Setup 
- [ ] T001 Clone `labs/000-base-setup/` into `labs/002-bson-data-types/`.
- [ ] T002 Update local `package.json` workspace name to `lab-002-bson-data-types`.
- [ ] T003 Ensure `docker-compose.yml` reflects container name (`mongodb_lab_002`).
- [ ] T004 Prepare the empty skeleton `driver.js` exposing the Node.js requirement to import strict BSON objects (`Decimal128`, `Int32`, `Binary`).

## Phase 2: Validation Framework Implementation
- [ ] T005 Write validation script `tests/01-shell.test.js` to assert Scenario 1 (Documents exist WITH proper BSON type encoding via strict aggregation or $type).
- [ ] T006 Write validation script `tests/02-driver.test.js` to assert Scenario 2 (Driver successfully transmitted encoded types).
- [ ] T007 Provide required codebase comments on what each validation line tests.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T008 Write the theoretical `CONCEPT.md` detailing IEEE 754 precision failures, BSON benefits, and BinData concepts.
- [ ] T009 Write the step-by-step native `README.md` guide demonstrating BSON constructor wrappers in `mongosh`.
- [ ] T010 Inject **Command Dissection** blocks into `README.md` for the queries mapping to `$type` aliases formats (`"decimal"`, `"binData"`, `"date"`).

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T011 Verify `README.md` Atomic Cleanup command runs natively (`docker-compose down -v --remove-orphans`).
- [ ] T012 Verify `Makefile` proxy bindings operate normally.
- [ ] T013 Perform end-to-end sandbox walkthrough and automated resolution.
