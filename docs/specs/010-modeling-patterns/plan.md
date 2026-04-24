# Implementation Plan: LAB-010 Modeling Patterns (N:N & Advanced)

**Branch**: `010-modeling-patterns` | **Date**: 2026-04-24
**Input**: Specification from `/specs/010-modeling-patterns/spec.md`

## Summary

The learner will transition from basic document structuring to advanced performance-oriented patterns. They will build a system that handles e-commerce orders with historical price snapshots (Extended Reference) and manages a high-volume review system where only the most relevant data is kept in the main document (Subset Pattern).

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone the base setup from `labs/000-base-setup/` into `labs/010-modeling-patterns/`.
2. **Workspace Registration**: Update `name` in `labs/010-modeling-patterns/package.json` to `010-modeling-patterns`.
3. **Data Requirements**: Use an `init/seed.js` script to provide a base set of `products` and some initial `reviews` to demonstrate the "Subset" need.

## Phase 2: Scenario 1 - Extended Reference (Fast Orders)
1. **Instructional Path**: Guide the learner to create an order. Explain that fetching the product name via `$lookup` in every order list is expensive. Show how to `$push` an item that includes both the `product_id` AND the redundant fields (`name`, `price`).
2. **Validation**: Implement `tests/01-extended-reference.test.js`. It will check for the presence of redundant fields and verify "Temporal Consistency" (snapshotting the price).

## Phase 3: Scenario 2 - Subset Pattern (Recent Reviews)
1. **Instructional Path**: Introduce a product with many reviews. Show that embedding all of them is dangerous. Guide the learner to use the `$push` operator with `$each`, `$sort`, and `$slice: -3` to keep only the 3 most recent reviews in the `product.recent_reviews` array while inserting the full review into a separate `reviews` collection.
2. **Validation**: Implement `tests/02-subset-pattern.test.js`. It will verify that the `recent_reviews` array never exceeds 3 elements and that they are the most recent ones based on a timestamp.

## Phase 4: Full Documentation & Dissection
1. **CONCEPT.md**: Explain the "Data Redundancy" philosophy in NoSQL. Detail the "Write-side Complexity" trade-off.
2. **README.md**: Step-by-step guide focusing on native `mongosh` commands.
3. **Command Dissection**: Focus on the complex `$push` modifiers:
   - `$each`: Appending multiple items.
   - `$sort`: Ordering elements before slicing.
   - `$slice`: Capping the array size.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts abstract the orchestration.
- [x] Code comments explicitly describe what every test line validates.
- [x] Language used across all text is explicitly English.

## Open Questions
- Should we include a scenario for the **Computed Pattern** (e.g., total_spent field) or keep it focused on Relationships for now? (Decided: Keep it focused on N:N and Relationships as per Syllabus).
