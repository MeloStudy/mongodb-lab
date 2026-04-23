# Tasks: LAB-009 Document Structuring (1:1, 1:N)

**Input**: Design documents from `/specs/009-document-structuring/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: "Test-Driven Learning". Tests must verify the structural integrity of the documents (BSON Types and Embedding depth).

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Configure `docker-compose.yml` with container name `mongodb_lab_009` and unique ports if necessary.

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T004 Write `tests/01-one-to-one.test.js` (Checks for embedded objects).
- [ ] T005 Write `tests/02-one-to-many-embedded.test.js` (Checks for arrays of objects and dot notation queries).
- [ ] T006 Write `tests/03-referencing.test.js` (Checks for manual referencing between collections).

## Phase 3: Educational Content & Hands-On Environment
- [ ] T007 Write `CONCEPT.md` detailing "Embedding vs Referencing" and the "Decision Matrix".
- [ ] T008 Implement `init/seed.js` to provide the initial relational state (users, preferences, addresses).
- [ ] T009 Write `README.md` step-by-step guide.
- [ ] T010 Inject **Command Dissection** blocks for Dot Notation and Array Surgical updates (`$push`).

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T011 Verify `README.md` Atomic Cleanup command runs natively.
- [ ] T012 Verify `Makefile` shortcut targets.
- [ ] T013 Perform end-to-end "Learner Journey" Walkthrough.
