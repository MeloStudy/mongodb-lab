# Tasks: 014-core-indexing

**Input**: Design documents from `/docs/specs/014-core-indexing/`
**Prerequisites**: plan.md (required), spec.md (required).

**Validation Goal**: Ensure the learner understands why index order matters and how to audit performance via `explain()`.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory `labs/014-core-indexing`.
- [ ] T002 Update `package.json` workspace identifier.
- [ ] T003 Configure `docker-compose.yml` (container name: `mongodb_lab_014`).

## Phase 2: Data Seeding (Large Dataset)
- [ ] T004 Implement `init/seed.js` using a loop to generate 5,000 documents.
- [ ] T005 Verify data is correctly mounted and available upon `docker-compose up`.

## Phase 3: Validation Framework (TDD)
- [ ] T006 Write `tests/01-basic-indexing.test.js` (COLLSCAN vs IXSCAN).
- [ ] T007 Write `tests/02-compound-esr.test.js` (Field order and Sort stage audit).
- [ ] T008 Write `tests/03-sparse-ttl.test.js` (Sparse and TTL logic).
- [ ] T009 Write `tests/04-covered-queries.test.js` (Verify `totalDocsExamined: 0`).

## Phase 4: Educational Content
- [ ] T010 Write `CONCEPT.md` with ESR rule diagrams and Indexing theory.
- [ ] T011 Write `README.md` with step-by-step performance scenarios.
- [ ] T012 Add Command Dissection for `createIndex()` options and `explain()` output levels.

## Phase 5: Finalization
- [ ] T013 Verify Atomic Cleanup (`docker-compose down -v`).
- [ ] T014 Perform "Learner Journey" walkthrough and verify all tests pass.
