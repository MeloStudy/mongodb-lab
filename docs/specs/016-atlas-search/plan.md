# Implementation Plan: LAB-016 (Atlas Search)

This plan outlines the steps to build a high-friction engineering lab focused on full-text search capabilities.

## Phase 1: Infrastructure & Engine Setup
1. **Scaffold**: Create `labs/016-atlas-search`.
2. **Engine Selection**: Use the `mongodb/mongodb-atlas-local` image which includes the Atlas Search (Lucene) process.
3. **Architecture Context**: Explain the role of `mongot` as a separate process communicating via RPC with `mongod`.
4. **Data Seeding**:
   - Create a `books` collection with rich text data (titles, summaries, authors, genres).
   - Script `init/seed.js` to populate ~50 varied documents with distinct genres.

## Phase 2: Index Definition & API
1. **Index Creation**: Implement the helper script or instructions to create the Search Index definition (JSON).
   - Include `autocomplete` for titles.
   - Include `string` for genre (filtered) and description.
2. **Search API master**: Implement basic aggregation logic for `$search`.

## Phase 3: Validation Framework (TDD)
1. **`tests/01-fulltext.test.js`**: Verify keyword matching across multiple fields.
2. **`tests/02-fuzzy.test.js`**: Verify typo tolerance (max edits).
3. **`tests/03-autocomplete.test.js`**: Verify partial string matching.
4. **`tests/04-scoring.test.js`**: Verify that documents are returned in descending order of relevance.
5. **`tests/05-compound.test.js`**: Verify `filter` logic within a `compound` search.
6. **`tests/06-highlight.test.js`**: Verify snippet highlighting metadata.

## Phase 4: Pedagogical Content
1. **CONCEPT.md**: Deep dive into Inverted Indexes, Tokenization, the Lucene engine, and the **mongot sidecar architecture**.
2. **README.md**: Interactive walkthrough following the **Pedagogical Walkthrough** standard.
   - Scenario 1: The Library Search ($search).
   - Scenario 2: Handling Typos (Fuzzy).
   - Scenario 3: Real-time Suggestions (Autocomplete).
   - Scenario 4: Compound Search (Filtering by Genre).
   - Scenario 5: Visualizing matches (Highlighting).

## Phase 5: Certification & Audit
1. Run full test suite.
2. Audit for "Constitution" compliance.
3. Update `spec.md` and `syllabus.md` to `AUDITED`.
