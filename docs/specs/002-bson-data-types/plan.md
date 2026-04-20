# Implementation Plan: 002-bson-data-types

**Branch**: `002-bson-data-types` | **Date**: 2026-04-19
**Input**: Specification from `/specs/002-bson-data-types/spec.md`

## Summary

This lab deliberately exposes the flaw of native primitive types in programming languages (like floating point rounding issues) and trains the student to rigorously clamp down schema integrity by using explicit BSON Wrapper classes both in `mongosh` and Driver code.

## Phase 1: Monorepo Infrastructure 
1. **Scaffold**: Clone base setup from `labs/000-base-setup/` into `labs/002-bson-data-types/`.
2. **Workspace Registration**: Add `"lab-002-bson-data-types"` to root configuration (or keep dynamic resolution, then update its inner `package.json` uniquely).
3. **Container Designation**: Map `docker-compose.yml` to `mongodb_lab_002`.

## Phase 2: Scenario 1 - The Interactive Shell (mongosh)
1. **Instructional Path**: Teach the learner how to explicitly wrap data:
   - `{ price: NumberDecimal("19.99"), sizeInBytes: NumberInt(4096), timestamp: new ISODate(), internalFile: BinData(0, "U1RVTUI=") }`.
2. **Testing Mechanism**: Write `tests/01-shell.test.js`. Crucially, this test won't just pull the document, it will explicitly query the database using `{ price: { $type: "decimal" }, sizeInBytes: { $type: "int" } }` to ensure the server physically stored it this way.

## Phase 3: Scenario 2 - The Node.js Driver
1. **Instructional Path**: Skeleton `driver.js` will force the user to import `{ Decimal128, Int32, Binary }` from the `mongodb` native package, wrap primitives, and construct the document application-side.
2. **Testing Mechanism**: `tests/02-driver.test.js` replicates the strict Type checking logic.

## Phase 4: Full Documentation & Dissection
1. Draft `CONCEPT.md` detailing the mechanics of BSON limits (16MB document cap limit), `BinData` storage implications, and financial Decimal128 strictness vs IEEE 754 float flaws.
2. Draft `README.md` step-by-step applying **Command Dissection** pattern inside the `README.md` highlighting the `$type` query syntax.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts abstract the orchestration.
- [x] Code comments explicitly describe what every test line validates.
- [x] Language used across all text is explicitly English.
