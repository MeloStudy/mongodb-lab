# Tasks: LAB-016 (Atlas Search)

**Validation Goal**: Ensure the learner can implement advanced full-text search, fuzzy matching, and autocomplete using the Atlas Search engine.

## Phase 1: Monorepo Setup & Data Seeding
- [ ] T001 Scaffold lab directory `labs/016-atlas-search`.
- [ ] T002 Update `package.json` workspace identifier.
- [ ] T003 Configure `docker-compose.yml` with `mongodb/mongodb-atlas-local`.
- [ ] T004 Implement `init/seed.js` with a "Universal Library" dataset (~50 books).

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T005 Write `tests/01-fulltext.test.js` to verify basic `$search` keyword relevance.
- [ ] T006 Write `tests/02-fuzzy.test.js` to verify typo tolerance logic.
- [ ] T007 Write `tests/03-autocomplete.test.js` to verify partial match suggestions.
- [ ] T008 Write `tests/04-scoring.test.js` to verify relevance sorting and meta projection.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T009 Write `CONCEPT.md` (Inverted Indexes vs B-Trees, Analyzers, Scoring).
- [ ] T010 Write `README.md` for the "Library Search" scenario (Scenario 1).
- [ ] T011 Write `README.md` for the "Fuzzy Match" scenario (Scenario 2).
- [ ] T012 Write `README.md` for the "Autocomplete" scenario (Scenario 3).
- [ ] T013 Inject **Command Dissection** for `$search` operators.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T014 Verify Atomic Cleanup (`docker-compose down -v`).
- [ ] T015 Perform final pedagogy audit.
