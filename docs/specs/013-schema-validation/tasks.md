# Tasks: 013-schema-validation

**Input**: Design documents from `/docs/specs/013-schema-validation/`
**Prerequisites**: plan.md (required), educational-spec.md (required).

**Validation Goal**: This project follows strict "TDD for Learning" (Test-Driven Learning). The automated tests (Jest) MUST ensure the learner correctly configures the `$jsonSchema` and understands the validation behaviors.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [x] T001 Scaffold lab directory `labs/013-schema-validation` by cloning `labs/000-base-setup/`.
- [x] T002 Update local `package.json` workspace identifier.
- [x] T003 Ensure `docker-compose.yml` reflects the correct container name `mongodb_lab_013`.

## Phase 2: Validation Framework Implementation (TDD)
- [x] T004 Write `tests/01-strict-validation.test.js` to verify that invalid documents are rejected with code 121.
- [x] T005 Write `tests/02-permissive-validation.test.js` to verify that `validationAction: "warn"` allows invalid inserts.
- [x] T006 Add comments to tests explaining the BSON type checks.

## Phase 3: Educational Content & Hands-On Environment
- [x] T007 Write `CONCEPT.md` detailing the `$jsonSchema` syntax and the three configuration knobs (`validator`, `validationLevel`, `validationAction`).
- [x] T008 (Optional) Implement a small `seed.js` if we want to show `validationLevel: "moderate"` on existing data. (Skipped: Decided to focus on clean slate creation and collMod instead).
- [x] T009 Write `README.md` step-by-step guide.
- [x] T010 Add **Command Dissection** blocks for the `collMod` command and its validation-related fields.

## Phase 4: Idempotency & Clean Up Verifications
- [x] T011 Verify `README.md` Atomic Cleanup command (`docker-compose down -v --remove-orphans`).
- [x] T012 Verify `Makefile` targets.
- [x] T013 Perform end-to-end "Learner Journey" Walkthrough.
