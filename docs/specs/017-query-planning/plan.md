# Implementation Plan: 017-query-planning

**Branch**: `017-query-planning` | **Date**: 2026-04-27 | **Status**: AUDITED
**Input**: Specification from `/docs/specs/017-query-planning/spec.md`

## Summary

This lab serves as the "DBA Masterclass" for query optimization. Instead of just creating indexes, the learner will dive into *why* certain indexes are chosen and how to debug the optimizer's decisions. This lab closes the loop on the Performance module.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone from `labs/000-base-setup/`.
2. **Workspace Registration**: `@mongodb-lab/017-query-planning`.
3. **Data Requirements**: 
   - Need a dataset that allows for multiple competing indexes. 
   - `init/seed.js` will generate 10,000 "Telemetry" documents with fields: `deviceId`, `timestamp`, `status`, `value`.
   - Create indexes on `{ deviceId: 1, timestamp: -1 }` and `{ status: 1, timestamp: -1 }`.

## Phase 2: Scenario 1 & 2 - Winning vs Rejected Plans
1. **Instructional Path**: 
   - Execute a query: `db.telemetry.find({ deviceId: "...", status: "active" }).sort({ timestamp: -1 })`.
   - Explain how MongoDB evaluates both available indexes.
   - Use `explain("allPlansExecution")` to show the "race" results.
2. **Testing**: 
   - `tests/01-plan-selection.test.js`: Verify that the learner can extract and verify `winningPlan` and `rejectedPlans` from the JSON output.

## Phase 3: Scenario 3 - Forcing Decisions with Hint
1. **Instructional Path**:
   - Introduce a scenario where one index is technically usable but less efficient for a specific skewed data distribution.
   - Show how `.hint({ ... })` changes the `winningPlan`.
2. **Testing**:
   - `tests/02-hint-override.test.js`: Run a query with a hint and verify that the `winningPlan.inputStage.indexName` matches the hinted index.

## Phase 4: Scenario 4 - Plan Cache Management
1. **Instructional Path**:
   - Explain that MongoDB doesn't "race" every time. It caches the winner.
   - Show `db.telemetry.getPlanCache().list()`.
   - Demonstrate `db.telemetry.getPlanCache().clear()`.
2. **Testing**:
   - `tests/03-cache-management.test.js`: Verify that the learner can interact with the plan cache commands.

## Phase 5: Scenario 5 - Restricting Choice with Index Filters
1. **Instructional Path**:
   - Introduce `planCacheSetFilter`.
   - Create a scenario where we want to "ban" a specific index for a query shape without dropping the index.
   - Show how the optimizer's choices are restricted.
2. **Testing**:
   - `tests/04-index-filters.test.js`: Set an index filter and verify that only the allowed index is used in the `explain` output.

## Phase 6: Documentation & Dissection
1. **CONCEPT.md**: Visual flowchart of the Query Optimizer (Filter -> Candidate Plans -> Race -> Cache).
2. **README.md**: Guided investigation into the "Internal Mind" of MongoDB.
3. **Dissection**: Deep dive into `explain()` levels (`queryPlanner` vs `executionStats`).

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Code comments in tests.
- [x] Language: English.

## Open Questions
- **Decided**: We WILL include **Index Filters**. This demonstrates the ultimate level of DBA control over the query environment.
- **Decided**: To simulate a "bad" choice by the optimizer, we will skew the data distribution in `seed.js` so that a field with high cardinality appears to the optimizer as low cardinality during the trial period, or by creating a situation where a Sort-heavy index is chosen over a Filter-heavy one.

## Phase 7: Retrospective Refinement
- (To be filled after `/lab-refiner` runs)
