# Implementation Plan: LAB-018 Pipeline Fundamentals [REFINED]

**Branch**: `018-pipeline-fundamentals` | **Date**: 2026-04-30
**Input**: Specification from `/specs/018-pipeline-fundamentals/spec.md`

## Summary

Refined to include a deep dive into stage anatomy for beginners, while maintaining the advanced optimization and memory management topics.

## Phase 1: Monorepo Infrastructure
1. **Data Requirements**: 
   - Seed with sales data. Ensure **Decimal128** is used for all currency fields to validate type integrity.

## Phase 2: Stage Anatomy & Fundamentals
1. **Instructional Path**: 
   - Crash Course on `$match`, `$group`, `$project`, `$sort`, and **`$set`**.
   - Explain `$set` as the preferred modern alias for adding fields.
2. **Testing**: 
   - Verify `$set` usage in the report scenario.
   - Assert `Decimal128` type in aggregation results.

## Phase 3: Advanced Optimization & Operational Rigor
1. **Instructional Path**: 
   - **Stage Folding**: Show how the optimizer merges stages.
   - **Memory**: Force sort errors and fix with `allowDiskUse`.
2. **Testing**:
   - `tests/01-fundamentals.test.js`: Check explain output for folded stages.
   - `tests/05-memory.test.js`: Verify operational flags.

## Phase 4: Documentation
1. **CONCEPT.md**: Visual breakdown of stage syntax (Anatomy).
2. **README.md**: Step-by-step tutorial format with "Learning Moments".

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts.
- [x] Detailed code comments in tests.
- [x] English language throughout.
