# Development Plan: LAB-004: Advanced Inserts & Write Concerns

## Summary
This lab moves from single inserts to batch operations and data durability configuration. It teaches the learner how to handle bulk errors gracefully and how to ensure data is safely stored on disk before a command returns success.

## Phase 1: Monorepo Infrastructure
1. **Scaffold**: Clone `labs/000-base-setup/` to `labs/004-advanced-CRUD-inserts/`.
2. **Naming**: Update `package.json` to `"name": "lab-004-advanced-CRUD-inserts"`.
3. **Naming**: Update `docker-compose.yml` to `container_name: mongodb_lab_004`.

## Phase 2: Testing & Validation
1. **Scenario 1 Assertion**: `tests/01-ordered.test.js`.
    - Verification: Attempts to find the documents that *should* have been inserted after a deliberate duplicate key error. If `ordered: false` was used, documents following the error should be present.
2. **Scenario 2 Assertion**: `tests/02-write-concern.test.js`.
    - Verification: Spies on the database operation or verifies the database collection options if possible, but mainly acts by executing a script and checking the `acknowledged: true` and specifically searching for the durability flags if the student uses the driver.

## Phase 3: Teaching Material
1. **CONCEPT.md**: 
    - Explain the "All-or-Nothing" stop of `ordered: true`.
    - Explain the concept of write acknowledgment (w) and journaling (j).
2. **README.md**: 
    - Tutorial on `db.collection.insertMany([...], { ordered: false })`.
    - Tutorial on `db.collection.insertOne({ ... }, { writeConcern: { w: "majority", j: true } })`.
3. **Dissections**: 
    - Dissect the `insertMany` result object (`insertedIds`, `writeErrors`).

## Phase 4: Verification
1. E2E check of both scenarios.
2. Cleanup sanity.
