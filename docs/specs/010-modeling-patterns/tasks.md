# Tasks: LAB-010 Modeling Patterns (N:N & Advanced)

**Input**: Design documents from `/specs/010-modeling-patterns/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Use TDD to ensure the learner masters the Extended Reference and Subset patterns using atomic MongoDB operators.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/`.
- [ ] T002 Update local `package.json` name to `010-modeling-patterns`.
- [ ] T003 Configure `docker-compose.yml` with container name `mongodb_lab_010`.

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T004 Create `tests/01-extended-reference.test.js` to validate redundant data in orders.
- [ ] T005 Create `tests/02-subset-pattern.test.js` to validate the capped array size and most-recent logic.
- [ ] T006 Ensure all test code is thoroughly commented for educational purposes.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T007 Write `CONCEPT.md` covering the theory of Extended Reference and Subset patterns.
- [ ] T008 Implement `init/seed.js` to populate the environment with products and reviews.
- [ ] T009 Write `README.md` with the step-by-step native command guide.
- [ ] T010 Add **Command Dissection** blocks for `$slice`, `$sort`, and `$each`.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T011 Verify atomic cleanup command: `docker-compose down -v --remove-orphans`.
- [ ] T012 Verify Makefile (optional) correctly proxies the native commands.
- [ ] T013 Final end-to-end walkthrough of the learner journey.
