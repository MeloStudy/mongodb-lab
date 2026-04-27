# Implementation Plan: LAB-016 (Atlas Search)

This plan outlines the steps to build a high-friction engineering lab focused on full-text search capabilities.

## Phase 1: Infrastructure & Engine Setup
1. **Scaffold**: Create `labs/016-atlas-search`.
2. **Engine Selection**: Use the `mongodb/mongodb-atlas-local` image which includes the Atlas Search (Lucene) process.
3. **Data Seeding**:
   - Create a `books` collection with rich text data (titles, summaries, authors, genres).
   - Script `init/seed.js` to populate ~50 varied documents.

## Phase 2: Index Definition & API
1. **Index Creation**: Implement the helper script or instructions to create the Search Index definition (JSON).
2. **Search API**: Implement basic aggregation logic for `$search`.

## Phase 3: Validation Framework (TDD)
1. **`tests/01-fulltext.test.js`**: Verify keyword matching across multiple fields.
2. **`tests/02-fuzzy.test.js`**: Verify typo tolerance (max edits).
3. **`tests/03-autocomplete.test.js`**: Verify partial string matching.
4. **`tests/04-scoring.test.js`**: Verify that documents are returned in descending order of relevance.

## Phase 4: Pedagogical Content
1. **CONCEPT.md**: Deep dive into Inverted Indexes, Tokenization, and the Lucene engine.
2. **README.md**: Interactive walkthrough following the **Pedagogical Walkthrough** standard.
   - Scenario 1: The Library Search ($search).
   - Scenario 2: Handling Typos (Fuzzy).
   - Scenario 3: Real-time Suggestions (Autocomplete).
   - Scenario 4: Ranking Results (Scoring).

## Phase 5: Certification & Audit
1. Run full test suite.
2. Audit for "Constitution" compliance.
3. Update `spec.md` and `syllabus.md` to `READY` (then `AUDITED` after build).
