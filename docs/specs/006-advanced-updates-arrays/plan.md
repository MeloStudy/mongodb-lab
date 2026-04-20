# Development Plan: LAB-006: Advanced Updates (Atomic Operators & Arrays)

## Summary
Building on querying, this lab teaches how to modify data safely and precisely. We focus on atomic operations to avoid "Read-Modify-Write" race conditions and advanced array surgery to handle nested structures.

## Phase 1: Monorepo Infrastructure
1. **Scaffold**: Clone `labs/000-base-setup/` to `labs/006-advanced-updates-arrays/`.
2. **Naming**: Update `package.json` to `"name": "lab-006-advanced-updates-arrays"`.
3. **Naming**: Update `docker-compose.yml` to `container_name: mongodb_lab_006`.

## Phase 2: Testing & Validation
1. **Scenario 1 Assertion**: `tests/01-atomic.test.js`.
    - Verification: Runs a series of increments and checks if the final document exists (upsert) and has the correct mathematical sum.
2. **Scenario 2 Assertion**: `tests/02-arrays.test.js`.
    - Verification: Seeds a complex user document. Asserts that an update targeting a specific subscription ID works regardless of positional index.

## Phase 3: Teaching Material
1. **CONCEPT.md**: 
    - Explaining the "Lost Update" problem in RDBMS/Standard logic and how `$inc` solves it.
    - Anatomy of an `update` with `arrayFilters`.
2. **README.md**: 
    - Step-by-step using `mongosh` for `$inc`.
    - Creating a `driver.js` script for the `arrayFilters` challenge.
3. **Dissections**: 
    - Breakdown of `$[<elem>]` syntax inside the update object.

## Phase 4: Final Verification
1. E2E check of atomic safety.
2. E2E check of nested updates.
3. Cleanup.
