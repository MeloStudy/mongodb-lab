# Tasks: LAB-016 (Atlas Search)

**Validation Goal**: Ensure the learner can implement advanced full-text search, fuzzy matching, and autocomplete using the Atlas Search engine.

## Phase 1: Monorepo Setup & Data Seeding
- [x] T001 Scaffold lab directory `labs/016-atlas-search`.
- [x] T002 Update `package.json` workspace identifier.
- [x] T003 Configure `docker-compose.yml` with `mongodb/mongodb-atlas-local`.
- [x] T004 Implement `init/seed.js` with a "Universal Library" dataset (~50 books).

## Phase 2: Validation Framework Implementation (TDD)
- [x] T005 Write `tests/01-fulltext.test.js` to verify basic `$search` keyword relevance.
- [x] T006 Write `tests/02-fuzzy.test.js` to verify typo tolerance logic.
- [x] T007 Write `tests/03-autocomplete.test.js` to verify partial match suggestions.
- [x] T008 Write `tests/04-scoring.test.js` to verify relevance sorting and meta projection.
- [x] T008b Write `tests/05-compound.test.js` for filtering logic.
- [x] T008c Write `tests/06-highlight.test.js` for snippet highlighting.

## Phase 3: Educational Content & Hands-On Environment
- [x] T009 Write `CONCEPT.md` (Inverted Indexes vs B-Trees, Analyzers, Scoring, **mongot architecture**).
- [x] T010 Write `README.md` for the "Library Search" scenario (Scenario 1).
- [x] T011 Write `README.md` for the "Fuzzy Match" scenario (Scenario 2).
- [x] T012 Write `README.md` for the "Autocomplete" scenario (Scenario 3).
- [x] T012b Write `README.md` for the "Compound Search" scenario (Scenario 4).
- [x] T012c Write `README.md` for the "Highlighting" scenario (Scenario 5).
- [x] T013 Inject **Command Dissection** for `$search` operators and index definitions.

## Phase 4: Idempotency & Clean Up Verifications
- [x] T014 Verify Atomic Cleanup (`docker-compose down -v`).
- [x] T015 Perform final pedagogy audit.
