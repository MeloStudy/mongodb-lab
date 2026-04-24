# Implementation Plan: LAB-011 Schema Evolution & Versioning

This plan outlines the technical implementation of LAB-011, focusing on Schema Versioning and migration strategies.

## Phase 1: Infrastructure & Seeding

### 1.1 Directory Setup
- Create `labs/011-schema-evolution/`.
- Initialize `package.json` with `jest` and `mongodb` driver.
- Create `Makefile` with `setup`, `test`, and `clean` targets.

### 1.2 Docker & Seed
- Create `docker-compose.yml` (standard Mongo 7.0).
- Create `init/seed.js`:
  - `users` collection:
    - 3 docs: `{ "name": "Legacy User", "email": "old@example.com" }` (No version).
    - 2 docs: `{ "first_name": "New", "last_name": "User", "email": "new@example.com", "schema_version": 2 }`.

## Phase 2: Educational Content

### 2.1 CONCEPT.md
- Definition of Schema Evolution in NoSQL.
- Comparison Table: Lazy vs Eager Migration.
- Pattern Deep-dive: Schema Versioning.
- **Aggregation Framework Basics**: Explanation of Pipelines and Stages (`$match`, `$addFields`, `$merge`).

### 2.2 README.md
- Scenario 1: How to implement a "Version Aware" read in Node.js (conceptually).
- Scenario 2: Writing the Aggregation pipeline for the "Big Bang" migration.
- Command Dissection for `$merge`.

## Phase 3: Scenario Implementation

### 3.1 Scenario 1 (Lazy Migration)
- Provide a `migration-helper.js` (educational snippet) that shows the logic:
  ```javascript
  if (!doc.schema_version) { 
    // upgrade logic 
  }
  ```

### 3.2 Scenario 2 (Eager Migration)
- Guide the learner to write:
  ```javascript
  db.users.aggregate([
    { $match: { schema_version: { $exists: false } } },
    { $addFields: { ... } },
    { $merge: { into: "users", on: "_id" } }
  ])
  ```

## Phase 4: Validation (TDD)

### 4.1 tests/01-lazy-migration.test.js
- Test logic:
  - Find a V1 document.
  - Apply the application-level upgrade.
  - Check DB for persistence and correct fields.

### 4.2 tests/02-bulk-migration.test.js
- Test logic:
  - Run the aggregation script.
  - Assert `countDocuments({ schema_version: { $exists: false } }) === 0`.
  - Assert structure of all documents.

## Phase 5: Syllabus & Wrap-up
- Update `docs/syllabus.md` status.
- Final review of all instructions.
