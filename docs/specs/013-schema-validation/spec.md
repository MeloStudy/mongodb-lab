# Lab Specification: 013-schema-validation

**Feature Branch**: `013-schema-validation`
**Created**: 2026-04-25
**Status**: AUDITED
**Syllabus Section**: Schema Design & Relationships

## Syllabus Alignment *(mandatory)*

- **Concept**: DBA Wrap-up: Schema Validation. Implementation of `$jsonSchema` to enforce data integrity at the database level.
- **Prerequisites**: LAB-001 through LAB-012.
- **Learning Objectives**:
  - LO-001: Implement document-level validation using the `$jsonSchema` operator.
  - LO-002: Configure `validationAction` to differentiate between "error" (strict) and "warn" (permissive) behaviors.
  - LO-003: Understand `validationLevel` (strict, moderate, off) and its impact on existing data.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - Strict Schema Enforcement (Priority: P1)

The learner will create a `users` collection with a strict `$jsonSchema` requiring specific fields (`username`, `email`, `age`, `balance`) with correct BSON types. Specifically, `balance` must be a **Decimal128** to ensure financial precision, reinforcing concepts from LAB-002.

**Validation (Automated Test)**: Jest test will attempt to insert a document missing a required field and expect a `MongoServerError` with code 121 (DocumentValidationFailure). Then it will insert a valid document and expect success.

**Acceptance Scenarios**:

1. **Given** a non-existent `users` collection, **When** the learner creates it with `$jsonSchema`, **Then** inserting `{ "username": "alpha" }` fails due to missing `email`, and inserting `{ "username": "alpha", "email": "a@b.com", "age": 25, "balance": 100.50 }` fails because `100.50` is a double, not a **Decimal128**.

---

### Scenario 2 - Permissive Validation (Warn) (Priority: P2)

The learner will modify the collection to use `validationAction: "warn"`. They will then insert an invalid document and observe that it is accepted, but would normally trigger a warning in the server logs.

**Validation (Automated Test)**: Jest test will update the collection settings, insert an invalid document, and verify that the insertion succeeds (no error thrown) despite failing the schema.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: The `$jsonSchema` operator and its subset of the JSON Schema standard.
- **EX-002**: `validationAction`: The difference between blocking writes (`error`) and just logging them (`warn`).
- **EX-003**: `validationLevel`: How to handle validation for existing documents that might already be "illegal".

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `collMod` and the `$jsonSchema` structure.
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner successfully prevents "garbage data" from entering the `users` collection.
- **SC-002**: All validation tests pass upon completion.

## Assumptions

- Learner understands basic BSON types (string, int) from LAB-002.
- Docker Desktop and Node.js v20+ are installed.
