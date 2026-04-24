# Lab Specification: LAB-011 Schema Evolution & Versioning

**Feature Branch**: `011-schema-evolution`
**Created**: 2026-04-24
**Status**: Draft
**Syllabus Section**: Schema Design & Relationships

## Syllabus Alignment *(mandatory)*

- **Concept**: Schema Versioning Pattern, Polymorphic data handling, and Lazy vs Eager Migration.
- **Prerequisites**: LAB-001 through LAB-010.
- **Learning Objectives**:
  - LO-001: Implement the **Schema Versioning Pattern** to track the structure version of each document.
  - LO-002: Implement a **Lazy Migration** strategy where documents are updated individually as they are read or written by the application.
  - LO-003: Perform an **Eager Migration** using the Aggregation Framework (`$merge`) to update the entire collection in bulk.
  - LO-004: Understand how to query **Polymorphic Data** (different versions) reliably.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - Lazy Migration: "The Adaptive Application" (Priority: P1)

The learner manages a `users` collection that started with a simple `name` field (V1). As the application evolves, they need to split `name` into `first_name` and `last_name` (V2). In this scenario, they will simulate an application that detects "Legacy" documents during a read operation and updates them to the current schema.

**Validation (Automated Test)**: A Jest test will:
1. Seed a document without a `schema_version` (Legacy).
2. Execute a "Read & Process" function that identifies the document as V1.
3. Verify that after processing, the document in the DB has `first_name`, `last_name`, and `schema_version: 2`.

**Acceptance Scenarios**:
1. **Given** a Legacy document, **When** processed by the app, **Then** it must be transformed to the latest schema version.
2. **Given** a document already at V2, **When** processed, **Then** it must remain unchanged (No redundant writes).

---

### Scenario 2 - Eager Migration: "The Bulk Standardizer" (Priority: P1)

Sometimes "Lazy" is not enough, and the DBA needs to ensure 100% of the data is consistent (e.g., before adding a mandatory index on a new field). The learner will use the Aggregation Framework to transform all remaining V1 documents into V2.

**Validation (Automated Test)**: A Jest test will:
1. Verify that BEFORE migration, there are documents with `schema_version: { $exists: false }`.
2. Execute an aggregation pipeline using `$addFields`, `$project`, and `$merge`.
3. Verify that AFTER migration, `db.users.countDocuments({ schema_version: { $exists: false } })` returns 0.

**Acceptance Scenarios**:
1. **Given** a collection with mixed versions, **When** the migration script is run, **Then** all documents must comply with the V2 schema.
2. **Given** the migration script, **When** executed, **Then** it must use `$merge` to update the existing collection without creating a new one.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **Schema Versioning Pattern**: The importance of a metadata field to track document state.
- **EX-002**: **Lazy Migration vs Eager Migration**: When to choose one over the other (Performance vs Consistency).
- **EX-003**: **Handling Polymorphism**: How NoSQL flexibility allows "living with the past" during transitions.
- **EX-004**: **Aggregation Framework Fundamentals**: A "Crash Course" on pipelines, stages, and how documents flow through operators like `$match` and `$addFields`.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab MUST include a `seed.js` that populates the DB with "Legacy Debt".
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab MUST demonstrate the use of `$merge` for in-place aggregation updates.
- **TR-005**: Lab MUST provide a "Command Dissection" for the migration pipeline (Stages anatomy).
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly implements logic to detect and update versionless documents.
- **SC-002**: Learner successfully executes a bulk migration using an aggregation pipeline.
- **SC-003**: All validation tests pass.

- Learner understands basic string manipulation (for splitting names).
- **Note**: The lab will provide the necessary foundation for the Aggregation Framework used in the exercise.
