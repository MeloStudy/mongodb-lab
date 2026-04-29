# Implementation Plan: 014-core-indexing

**Branch**: `014-core-indexing` | **Date**: 2026-04-25
**Input**: Specification from `/docs/specs/014-core-indexing/spec.md`

## Summary

This lab focuses on the "Query Performance" aspect of the DBA role. The learner will transform slow, unindexed queries into high-performance operations. The highlight of the lab is the **ESR Rule**, which is a fundamental concept for any MongoDB developer working with compound indexes.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone from `labs/000-base-setup/`.
2. **Workspace Registration**: `@mongodb-lab/014-core-indexing`.
3. **Data Requirements**: 
   - We need a significant amount of data to make `COLLSCAN` look bad. 
   - **NEW**: Implement an `init/seed.js` that generates 5,000 synthetic orders with varying status, dates, and amounts.

## Phase 2: Scenario 1 - COLLSCAN vs IXSCAN
1. **Instructional Path**: 
   - Demonstrate `db.orders.find({ orderId: "..." }).explain("executionStats")`.
   - Point out `totalDocsExamined` vs `nReturned`.
   - Create index: `db.orders.createIndex({ orderId: 1 }, { unique: true })`.
   - Explain the `{ unique: true }` constraint and how it enforces data integrity for order IDs.
2. **Testing**: 
   - `tests/01-basic-indexing.test.js`: Check for index presence and `IXSCAN` plan.

## Phase 3: Scenario 2 - ESR Rule & Compound Indexes
1. **Instructional Path**:
   - Query: `{ status: "shipped", totalAmount: { $gt: 500 } }` sorted by `orderDate`.
   - Show how a naive index like `(status, totalAmount)` fails to optimize the sort.
   - Implement the ESR-compliant index: `{ status: 1, orderDate: 1, totalAmount: 1 }`.
2. **Testing**:
   - `tests/02-compound-esr.test.js`: Verify the exact field order in the compound index and ensure no `SORT` stage appears in the explain plan.

## Phase 4: Scenario 3, 4 & 6 - Sparse, TTL & Partial
1. **Instructional Path (Sparse)**:
   - Identify rarely present `discountCode`.
   - Create index: `db.orders.createIndex({ discountCode: 1 }, { sparse: true })`.
2. **Instructional Path (TTL)**:
   - Create `sessions` collection.
   - `db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 })`.
3. **Instructional Path (Partial)**:
   - Introduce `partialFilterExpression`.
   - Index: `db.users.createIndex({ email: 1 }, { partialFilterExpression: { status: "active" } })`.
4. **Testing**:
   - `tests/03-sparse-ttl-partial.test.js`: Verify index properties for all three cases.

## Phase 5: Scenario 5 - Covered Queries
1. **Instructional Path**:
   - Use the ESR index from Scenario 2.
   - Run query with projection: `db.orders.find({ status: "shipped" }, { status: 1, orderDate: 1, totalAmount: 1, _id: 0 })`.
   - Observe `totalDocsExamined: 0`.
2. **Testing**:
   - `tests/04-covered-queries.test.js`: Run projected query and verify zero document fetches.

## Phase 6: Index Lifecycle Management
1. **Instructional Path**:
   - Demonstrate `db.orders.getIndexes()` to view existing indexes.
   - Demonstrate `db.orders.hideIndex("index_name")` to temporarily disable an index for performance testing without dropping it.
   - Demonstrate `db.orders.dropIndex("index_name")` to delete an index.

## Phase 7: Documentation & Dissection
1. **CONCEPT.md**: Visual explanation of B-Tree indexing, unique constraints, and the ESR diagram.
2. **README.md**: Step-by-step performance tuning guide including index management and index hiding.
3. **Dissection**: `createIndex` options (`unique`, `expireAfterSeconds`, `sparse`), `explain()` verbosity levels, `getIndexes()`, `hideIndex()`, and `dropIndex()`.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Code comments in tests.
- [x] Language: English.

## Open Questions
- **Decided**: We WILL include **Sparse Indexes**. This adds value by teaching how to save index space when a field (e.g., `discountCode`) is only present in a fraction of the documents.
- **Decided**: We WILL use a synthetic dataset of 5,000 orders generated via `init/seed.js` to ensure the learner can observe the impact of index selection on `COLLSCAN` vs `IXSCAN` and the ESR rule.

## Phase 7: Retrospective Refinement (Pedagogical Upgrade)
- **Trigger**: `/lab-refiner` identified that `README.md` lacked educational depth.
- **Action**: Rewrite the entire `README.md` to act as an interactive tutorial, explaining the *why* before executing commands and analyzing the `executionStats` after.
