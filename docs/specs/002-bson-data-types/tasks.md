# Tasks: LAB-002 BSON & Data Types

**Input**: Design documents from `/specs/002-bson-data-types/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Tests must verify BSON structure retention directly via `$type` server-side evaluations, not just object existence.

## Phase 1: Monorepo Setup 
- [x] T001 Clone `labs/000-base-setup/` into `labs/002-bson-data-types/`.
- [x] T002 Update local `package.json` workspace name to `lab-002-bson-data-types`.
- [x] T003 Ensure `docker-compose.yml` reflects container name (`mongodb_lab_002`).
- [x] T004 Prepare the empty skeleton `driver.js` exposing the Node.js requirement to import strict BSON objects (`Decimal128`, `Int32`, `Binary`).

## Phase 2: Validation Framework Implementation
- [x] T005 Write validation script `tests/01-shell.test.js` to assert Scenario 1 (Documents exist WITH proper BSON type encoding via strict aggregation or $type).
- [x] T006 Write validation script `tests/02-driver.test.js` to assert Scenario 2 (Driver successfully transmitted encoded types).
- [x] T007 Provide required codebase comments on what each validation line tests.

## Phase 3: Educational Content & Hands-On Environment
- [x] T008 Write the theoretical `CONCEPT.md` detailing IEEE 754 precision failures, BSON benefits, and BinData concepts.
- [x] T009 Write the step-by-step native `README.md` guide demonstrating BSON constructor wrappers in `mongosh`.
- [x] T010 Inject **Command Dissection** blocks into `README.md` for the queries mapping to `$type` aliases formats (`"decimal"`, `"binData"`, `"date"`).

## Phase 4: Idempotency & Clean Up Verifications
- [x] T011 Verify `README.md` Atomic Cleanup command runs natively (`docker-compose down -v --remove-orphans`).
- [x] T012 Verify `Makefile` proxy bindings operate normally.
- [x] T013 Perform end-to-end sandbox walkthrough and automated resolution.
