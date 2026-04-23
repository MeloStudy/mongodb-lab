# Lab Specification: LAB-008 Deleting Data & Tooling

**Feature Branch**: `008-deleting-data-tooling`
**Created**: 2026-04-23
**Status**: Draft
**Syllabus Section**: Complete CRUD Operations

## Syllabus Alignment

- **Concept**: Data Removal strategies and GUI-based inspection tools.
- **Prerequisites**: LAB-004 to LAB-007 (Basic and Advanced CRUD).
- **Learning Objectives**:
  - LO-001: Mastering `deleteOne` and `deleteMany` for precise and bulk data removal.
  - LO-002: Understanding the irreversible nature of `drop()` and `dropDatabase()`.
  - LO-003: Utilizing **MongoDB Compass** for schema analysis and visual execution plan inspection.

## Interactive Scenarios & Validation

### Scenario 1 - Surgical Deletion (Priority: P1)

The learner must identify and remove specific "corrupted" documents from a collection without affecting healthy records, using unique identifiers and filter criteria.

**Validation (Automated Test)**: Jest test verifying that documents matching the "corrupted" criteria are no longer present in the collection, while the "healthy" count remains unchanged.

**Acceptance Scenarios**:
1. **Given** a collection with mixed status records, **When** `deleteOne` or `deleteMany` is executed with targeted filters, **Then** only the matching records are removed.

---

### Scenario 2 - Total Cleanup (Priority: P2)

The learner must demonstrate the difference between clearing data (deleteMany) and destroying the container (drop). They must drop a collection and then an entire database to reset the environment.

**Validation (Automated Test)**: Jest test verifying that the collection is no longer listed in `listCollections()` and the database is absent from `listDatabases()`.

---

### Scenario 3 - Visual Inspection (Priority: P3)

The learner must connect MongoDB Compass to their local Docker container and perform a "Schema Analysis" to identify field outliers and data distributions.

**Validation (Manual)**: The student will follow a walkthrough in the README to visualize their data distribution in Compass.

---

## Educational Requirements

### Concepts to Explain

- **EX-001**: Difference between deleting documents (DML) and dropping collections/databases (DDL).
- **EX-002**: Performance implications of `deleteMany({})` vs `drop()`.
- **EX-003**: The role of GUI tools (Compass) in "Schema Discovery" and visual debugging.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `deleteOne`, `deleteMany`, and `drop`.
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via `docker-compose down -v`.

## Success Criteria

- **SC-001**: Learner successfully removes targeted data using filters.
- **SC-002**: Learner successfully drops a collection and database.
- **SC-003**: All validation tests pass upon completion.

## Assumptions

- Learner has MongoDB Compass installed on their host machine.
- Learner understands how to use `$in` or other operators for filtering.
