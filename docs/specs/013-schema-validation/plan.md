# Implementation Plan: 013-schema-validation

**Branch**: `013-schema-validation` | **Date**: 2026-04-25
**Input**: Specification from `/docs/specs/013-schema-validation/spec.md`

## Summary

The learner will implement a "Security & Integrity" layer for a user management system. They will move from a schema-less approach to a strictly validated one using `$jsonSchema`, then explore how to handle legacy data using `validationLevel` and how to monitor violations with `validationAction: "warn"`.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone the base setup from `labs/000-base-setup/`.
2. **Workspace Registration**: Set `name` in `package.json` to `@mongodb-lab/013-schema-validation`.
3. **Data Requirements**: The lab will start with an empty database to demonstrate the "Create Collection with Validation" pattern.

## Phase 2: Scenario 1 - Strict Schema Enforcement
1. **Instructional Path**: 
   - Use `db.createCollection("users", { validator: { $jsonSchema: { ... } } })`.
   - Focus on `required` fields and `bsonType` validation.
2. **Testing Mechanism**: 
   - `tests/01-strict-validation.test.js`:
     - Test A: Insert invalid doc -> Expect Error 121.
     - Test B: Insert valid doc -> Expect Success.

## Phase 3: Scenario 2 - Permissive Validation & Modifying Schemas
1. **Instructional Path**:
   - Use `db.runCommand({ collMod: "users", ... })` to update validation settings.
   - Switch `validationAction` to `"warn"`.
   - Explore `validationLevel: "moderate"`.
2. **Testing Mechanism**:
   - `tests/02-permissive-validation.test.js`:
     - Test A: Update collection configuration.
     - Test B: Insert invalid doc -> Expect Success (but note the server behavior).

## Phase 4: Full Documentation & Dissection
1. Draft the `CONCEPT.md` explaining the JSON Schema subset in MongoDB.
2. Draft the `README.md` with the "User Management" narrative.
3. Apply the **Command Dissection** pattern for `collMod`, `validator`, `validationAction`, and `validationLevel`.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts abstract the orchestration.
- [x] Code comments explicitly describe what every test line validates.
- [x] Language used across all text is explicitly English.

## Open Questions
- **Decided**: We WILL include `decimal128` for the `balance` field. This reinforces the "Financial Precision" concept from LAB-002 and demonstrates how `$jsonSchema` can enforce specific BSON types that are often confused (like Double vs Decimal128).
