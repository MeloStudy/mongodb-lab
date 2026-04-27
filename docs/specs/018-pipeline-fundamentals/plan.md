# Implementation Plan: LAB-018 Pipeline Fundamentals

**Branch**: `018-pipeline-fundamentals` | **Date**: 2026-04-27
**Input**: Specification from `/specs/018-pipeline-fundamentals/spec.md`

## Summary

This lab introduces the Aggregation Framework, moving from simple queries to multi-stage transformations. The focus is on the foundational stages that form the backbone of almost all MongoDB analytics.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone from `labs/000-base-setup/` to `labs/018-pipeline-fundamentals/`.
2. **Workspace Registration**: Update root and local `package.json`.
3. **Data Requirements**: 
   - `init/01-sales.js`: Seed with ~50 sales records. Each record should have:
     - `productName` (String)
     - `category` (String)
     - `price` (Decimal128)
     - `quantity` (Int32)
     - `tags` (Array of Strings)
     - `date` (ISODate)

## Phase 2: Scenario 1 & 2 - Filtering and Grouping
1. **Instructional Path**: Start with `$match` and `$project`. Then move to `$group` to show how data is reduced. Emphasize the `_id` field in `$group`.
2. **Testing**: Jest tests to verify field presence after projection and mathematical accuracy of the `$group` output.

## Phase 3: Scenario 3 & 4 - Arrays and Sorting
1. **Instructional Path**: Introduce `$unwind` for handling the `tags` array. Then chain `$addFields`, `$sort`, and `$limit` for a "Top Sellers" report.
2. **Testing**: Jest tests to verify the number of documents after `$unwind` and the order/limit of the final report.

## Phase 4: Full Documentation & Dissection
1. **CONCEPT.md**: Explain the Aggregation Engine's data flow, "Stream" processing, and basic optimization (early filtering).
2. **README.md**: Interactive walkthrough using `mongosh`.
3. **Command Dissection**: Breakdown of all 7 stages introduced.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Detailed code comments in tests.
- [x] English language throughout.
