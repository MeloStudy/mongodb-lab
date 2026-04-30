# Implementation Plan: LAB-018 Pipeline Fundamentals

**Branch**: `018-pipeline-fundamentals` | **Date**: 2026-04-30
**Input**: Specification from `/specs/018-pipeline-fundamentals/spec.md`

## Summary

This lab introduces the Aggregation Framework, moving from simple queries to multi-stage transformations. Refined to focus on optimization (Predicate Pushdown) and operational constraints (Memory limits).

## Phase 1: Monorepo Infrastructure
1. **Workspace Registration**: `@mongodb-lab/018-pipeline-fundamentals`.
2. **Data Requirements**: 
   - `init/01-sales.js`: Seed with ~100 sales records.
   - Include **Refunds** (negative `price` or `quantity`) to test accumulator robustness.
   - Ensure a "skewed" document exists with an empty `tags` array to test `$unwind`.

## Phase 2: Scenario 1 & 2 - Optimization and Grouping
1. **Instructional Path**: 
   - Emphasize starting with `$match` (Predicate Pushdown).
   - Use `$group` for revenue calculation. Handle negative values correctly.
2. **Testing**: 
   - Verify that `$match` is the first stage in the pipeline.
   - Verify math totals including potential refunds.

## Phase 3: Scenario 3 & 4 - Advanced Unwinding and Reporting
1. **Instructional Path**: 
   - Use `$unwind` with `preserveNullAndEmptyArrays: true`.
   - Chain `$addFields`, `$sort`, and `$limit`.
2. **Testing**: 
   - Count documents after `$unwind` (ensure empty arrays aren't dropped).

## Phase 4: Scenario 5 - Memory Management
1. **Instructional Path**: 
   - Force a large sort. Explain the 100MB limit.
   - Show how to enable `allowDiskUse`.
2. **Testing**:
   - `tests/memory.test.js`: Verify `allowDiskUse` flag in the command.

## Phase 5: Documentation & Dissection
1. **CONCEPT.md**: Visual diagram of "Predicate Pushdown" and the "Stream" nature of the pipeline.
2. **README.md**: Step-by-step investigation using `.explain()` on the pipeline.
3. **Command Dissection**: Detailed breakdown of 7 stages + `allowDiskUse` option.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Detailed code comments in tests.
- [x] English language throughout.
