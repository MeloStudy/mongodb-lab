# Lab Specification: 016-atlas-search

**Feature Branch**: `016-atlas-search`
**Created**: 2026-04-27
**Status**: READY
**Syllabus Section**: Performance, Indices & Spatial Data

## Syllabus Alignment *(mandatory)*

- **Concept**: Full-Text Search (Atlas Search / Lucene). Learning to move beyond standard regex/index searches to professional text analysis and relevance scoring.
- **Prerequisites**: LAB-001 through LAB-005, and LAB-014 (Core Indexing).
- **Learning Objectives**:
  - LO-001: Distinguish between MongoDB standard indexes (B-Tree) and Atlas Search indexes (Inverted/Lucene).
  - LO-002: Create an Atlas Search index with multiple field mappings.
  - LO-003: Implement basic full-text queries using the **`$search`** aggregation stage.
  - LO-004: Configure and use different **Analyzers** to process text (Tokenization, Lowercasing, Stop-words).
  - LO-005: Implement **Fuzzy Search** to handle user typos using Levenshtein distance.
  - LO-006: Build an **Autocomplete** feature using specialized index mappings.
  - LO-007: Analyze and sort results by **Relevance Score**.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Universal Library (Priority: P1)

The learner will be given a `books` collection. They must implement a search bar that looks into `title` and `description` fields simultaneously, returning results that match relevant keywords (not just exact matches).

**Validation (Automated Test)**: Jest test will verify that the `$search` stage is used and that it returns documents based on keyword relevance rather than regex matches.

---

### Scenario 2 - The "Did you mean?" Feature (Priority: P2)

Learners must enable `fuzzy` options in their query to handle typos (e.g., searching for "Mngodb" should return "MongoDB").

**Validation (Automated Test)**: Jest test will perform a search with common typos and verify that the correct documents are still retrieved.

---

### Scenario 3 - Real-time Autocomplete (Priority: P2)

Learners will modify the search index to support the `autocomplete` type and implement a query that suggests book titles as the user types the first few characters.

**Validation (Automated Test)**: Jest test will simulate partial string inputs and verify that the expected book titles are returned in the result set.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **The Inverted Index**: How Lucene breaks text into tokens and why it's faster than `$regex` for large text bodies.
- **EX-002**: **Analyzers & Tokenizers**: The "factory" that processes text before indexing (Standard vs English).
- **EX-003**: **Scoring (TF-IDF / BM25)**: Why some results appear higher than others.

### Technical Requirements

- **TR-001**: Lab MUST be containerized. *Note: Since Atlas Search is typically a cloud feature, we will use the `mongodb/mongodb-atlas-local` Docker image to simulate the search engine locally.*
- **TR-002**: Lab README MUST follow the **Pedagogical Walkthrough** pattern (Explain Why -> Dissect Results).
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Theoretical context MUST be provided in a `CONCEPT.md` file.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly identifies why a `$search` query is more efficient than a `$regex` scan.
- **SC-002**: Learner successfully implements a search index that supports both fuzzy matching and autocomplete.
- **SC-003**: Learner understands how to project and interpret the `score` metadata.
