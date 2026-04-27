# Implementation Plan: LAB-019 Advanced Analytics Stages

**Branch**: `019-advanced-analytics-stages` | **Date**: 2026-04-27
**Input**: Specification from `/specs/019-advanced-analytics-stages/spec.md`

## Summary

This lab focuses on the powerful "Application-Side" logic moved into the database via the Aggregation Framework. Learners will master complex data orchestration that typically requires multiple application queries, now consolidated into single, efficient pipelines.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone the base setup from `labs/000-base-setup/` to `labs/019-advanced-analytics-stages/`.
2. **Workspace Registration**: Update `package.json` in the root and in the lab folder.
3. **Data Requirements**: 
   - `init/01-customers.js`: Seed with ~10 customers.
   - `init/02-orders.js`: Seed with orders linked by `customerId`.
   - `init/03-employees.js`: Seed with an org chart (flat collection with `reportsTo`).
   - `init/04-products.js`: Seed with a diverse set of products for faceting.
   - `init/05-global-metadata.js`: Seed a separate database `global_metadata` with a `currencies` collection.

## Phase 2: Scenario 1 & 2 - Joins and Recursion
1. **Instructional Path**: Guide the user through `$lookup` with `let` and `pipeline` (uncorrelated subqueries) for efficiency. Introduce `$graphLookup` for the employee hierarchy.
2. **Testing**: Jest tests verifying the structure of the joined arrays and the depth of the recursive search.

## Phase 3: Scenario 3 & 4 - Facets and Persistence
1. **Instructional Path**: Demonstrate `$facet` for UI-style filtering. Finally, show how to persist these complex results using `$merge` into a summary collection.
2. **Testing**: Jest tests verifying the existence of facet buckets and the incremental update behavior of `$merge`.

## Phase 4: Scenario 5 - Cross-Database Joins
1. **Instructional Path**: Explain how to use the `database` parameter in `$lookup` (MongoDB 5.1+) to reference collections in other databases on the same cluster.
2. **Testing**: Jest test performing a join between the local `orders` and `global_metadata.currencies`.

## Phase 5: Full Documentation & Dissection
1. **CONCEPT.md**: Deep dive into the Aggregation Engine's memory management (100MB limit per stage, `allowDiskUse`), and the mechanics of Joins vs Embedding.
2. **README.md**: Native walkthrough using `mongosh` inside the container.
3. **Command Dissection**: Detailed breakdown of `$lookup`, `$graphLookup`, `$facet`, `$merge`, and the `database` parameter for `$lookup`.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Detailed code comments in tests.
- [x] English language throughout.

