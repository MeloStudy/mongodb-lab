# Implementation Plan: LAB-009 Document Structuring (1:1, 1:N)

**Branch**: `009-document-structuring` | **Date**: 2026-04-23
**Input**: Specification from `/specs/009-document-structuring/spec.md`

## Summary

This lab focuses on the fundamental shift from Relational to Document modeling. The learner will build a schema that prioritizes **Access Patterns** over **Normalization**. They will implement 1:1 embedding for user preferences and 1:N embedding for contact information, while learning the risks of unbounded data growth.

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone `labs/000-base-setup/` to `labs/009-document-structuring/`.
2. **Workspace Registration**: Update `package.json` with the name `009-document-structuring`.
3. **Data Requirements**: Use an `init/seed.js` script to create:
   - `users`: Standard documents.
   - `preferences`: Linked by `user_id`.
   - `addresses`: Linked by `user_id`.
   - `audit_logs`: Initially empty, to be used in Scenario 3.

## Phase 2: Scenario 1 - 1:1 Embedding (Preferences)
1. **Instruction**: Guide the learner to manually "move" preferences using `db.users.updateOne()` for a specific user to understand the structure, and then use a `forEach` loop or aggregation for the rest.
2. **Cleanup**: Instruction to `drop()` the old collection.
3. **Testing**: `tests/01-one-to-one.test.js` to verify embedding and collection removal.

## Phase 3: Scenario 2 - 1:N Embedding (Addresses)
1. **Instruction**: Implement "One-to-Few" modeling. Teach the use of **Dot Notation** to query and update embedded arrays.
2. **Testing**: `tests/02-one-to-many-embedded.test.js` to verify the array of objects.

## Phase 4: Scenario 3 - Referencing & bsonsize
1. **Instruction**: Introduce `Object.bsonsize()`. Guide the student to compare a document with 1 log vs a document with 100 embedded logs. 
2. **Decision**: Implement a separate `audit_logs` collection with `user_id` as a reference.
3. **Testing**: `tests/03-referencing.test.js` to verify referencing structure.

## Phase 5: Documentation & Dissection
1. **CONCEPT.md**: Explain the "Data Access Pattern" philosophy and the 16MB limit.
2. **README.md**: Step-by-step instructions with **Command Dissections** for:
   - Dot notation (e.g., `preferences.theme`).
   - Array operators (`$push`, `$elemMatch`).
3. **Cleanup**: Standard `docker-compose down` instructions.

## Constitution Compliance Check
- [ ] No `.sh` wrapper scripts.
- [ ] Thoroughly commented tests.
- [ ] English-only content.

## Open Questions
- Should we introduce `$lookup` (Joins) here as a "what to avoid" or keep it for the Aggregation module? 
  - *Decision*: Keep it simple, focus on Schema structure first. Joins will be in LAB-018+.
