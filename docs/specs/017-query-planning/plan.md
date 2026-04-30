# Implementation Plan: 017-query-planning

**Branch**: `017-query-planning` | **Date**: 2026-04-30 | **Status**: PLANNED (Refinement)
**Input**: Specification from `/docs/specs/017-query-planning/spec.md`

## Summary

This lab serves as the "DBA Masterclass" for query optimization. Instead of just creating indexes, the learner will dive into *why* certain indexes are chosen and how to debug the optimizer's decisions.

## Phase 1: Monorepo Infrastructure
1. **Workspace Registration**: `@mongodb-lab/017-query-planning`.
2. **Data Requirements**: 
   - `init/seed.js` will generate 10,000 "Telemetry" documents.
   - Create competing indexes to trigger the "Race".

## Phase 2: Scenario 1 & 2 - Winning vs Rejected Plans
1. **Instructional Path**: 
   - Execute a query and use `explain("allPlansExecution")`.
   - Explain the **`works`** metric and the Trial Period.
2. **Testing**: 
   - `tests/01-plan-selection.test.js`: Verify stage types and works presence.

## Phase 3: Scenario 3 - Forcing Decisions with Hint
1. **Testing**:
   - `tests/02-hint-override.test.js`: Verify hinted index usage.

## Phase 4: Scenario 4 - Plan Cache & Index Filters
1. **Testing**:
   - `tests/03-cache-management.test.js`.
   - `tests/04-index-filters.test.js`.

## Phase 5: Scenario 5 - Covered Query Advantage
1. **Instructional Path**:
   - Show how a "covered" index wins even if it's "wider" than a non-covered candidate.
2. **Testing**:
   - `tests/05-covered-query.test.js`: Verify absence of `FETCH` stage.

## Phase 6: Documentation & Dissection
1. **CONCEPT.md**: Define **Query Shapes** and the **Works** metric.
2. **README.md**: Field-by-field breakdown of `explain()` stats (`totalDocsExamined`, `totalKeysExamined`, etc.).

## Phase 7: Retrospective Refinement
- Refined to include "Works" metric and "Query Shape" definitions to meet Constitution v0.5.2 standards.
