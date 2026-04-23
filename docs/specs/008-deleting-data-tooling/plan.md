# Implementation Plan: LAB-008 Deleting Data & Tooling

**Branch**: `008-deleting-data-tooling` | **Date**: 2026-04-23
**Input**: Specification from `docs/specs/008-deleting-data-tooling/spec.md`

## Summary

In this lab, the learner will master data removal strategies and visual database inspection. The focus is on moving from granular document deletion (`deleteOne`/`deleteMany`) to structural destruction (`drop`/`dropDatabase`), while using MongoDB Compass for schema discovery and visual execution plan analysis.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone core structure from `labs/000-base-setup/` to `labs/008-deleting-data-tooling`.
2. **Workspace Registration**: Update `package.json` with name `lab-008-deleting-data-tooling` and update `docker-compose.yml` with container `mongodb_lab_008`.
3. **Data Requirements**: Implement `generate-dirty-data.js` to seed the `factory` collection with targeted "corrupted" documents and "healthy" records to enable high-friction deletion tasks.

## Phase 2: Scenario 1 - Surgical & Bulk Deletion (DML)
1. **Instructional Path**: Guide the learner through using `deleteOne` with unique filters and `deleteMany` with bulk criteria (e.g., status flags).
2. **Validation**: Implement `tests/01-delete-ops.test.js` using Jest to verify that specific documents are gone while ensuring zero collateral damage to healthy data.

## Phase 3: Scenario 2 - Collection & Database Destruction (DDL)
1. **Instructional Path**: Demonstrate the use of `db.collection.drop()` and `db.dropDatabase()` as high-performance alternatives to bulk deletes when destroying entire datasets.
2. **Validation**: Implement `tests/02-ddl-ops.test.js` to verify the absence of collections and database metadata after execution.

## Phase 4: Full Documentation & Dissection
1. **Theory**: Draft `CONCEPT.md` explaining the performance trade-offs of `drop()` vs `delete` and the internal mechanics of how MongoDB reclaims space.
2. **Guide**: Draft `README.md` with strict **Native Execution** instructions.
3. **Tooling**: Include a specific section for **MongoDB Compass** integration, showing how to connect and use the Schema Visualizer.
4. **Command Dissection**: Provide detailed breakdowns for `deleteOne`, `deleteMany`, and `drop()`.

## Constitution Compliance Check
- [ ] No `.sh` wrapper scripts abstract the orchestration.
- [ ] Code comments explicitly describe what every test line validates.
- [ ] Language used across all text is explicitly English.

## Open Questions
- Should we include a task for "Capped Collections" deletion restrictions, or keep it for the advanced modeling lab? (Currently excluded for simplicity).
