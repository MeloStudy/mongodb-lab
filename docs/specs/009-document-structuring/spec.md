# Lab Specification: LAB-009 Document Structuring (1:1, 1:N)

**Feature Branch**: `009-document-structuring`
**Created**: 2026-04-23
**Status**: Draft
**Syllabus Section**: Schema Design & Relationships

## Syllabus Alignment *(mandatory)*

- **Concept**: Document Structuring (Embedding vs Referencing Decision Matrix).
- **Prerequisites**: LAB-001 through LAB-008 (CRUD Mastery).
- **Learning Objectives**:
  - LO-001: Implement **1:1 Relationships** using Embedded Documents.
  - LO-002: Implement **1:N Relationships (One-to-Few)** using Arrays of Documents.
  - LO-003: Understand the **Decision Matrix**: Atomicity, Access Patterns, and Data Growth.
  - LO-004: Recognize the impact of the **16MB Document Limit** in schema design.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The 1:1 "User Profile" Consolidation (Priority: P1)

The learner starts with a relational-style setup: a `users` collection and a `preferences` collection. The task is to migrate the specific preference fields into a single embedded object `metadata.preferences` within the `users` document using `mongosh`.

**Validation (Automated Test)**: A Jest test will:
1. Verify that `users` documents contain the embedded `metadata.preferences` object.
2. Verify that the `preferences` collection has been dropped (`db.preferences.drop()`).

**Acceptance Scenarios**:
1. **Given** a user document, **When** queried, **Then** it must contain an embedded `metadata.preferences` object.
2. **Given** the migration task, **When** completed, **Then** the `preferences` collection MUST NOT exist.

---

### Scenario 2 - The 1:N "One-to-Few" Addresses (Priority: P1)

The learner models a `customer` who has multiple `shipping_addresses`. Instead of a foreign key, they must implement an array of objects within the `customer` document.

**Validation (Automated Test)**: A Jest test will verify that the `customers` collection contains documents where `addresses` is an `Array` of at least 2 objects, ensuring proper BSON type usage.

**Acceptance Scenarios**:
1. **Given** a customer, **When** adding an address, **Then** it must be an atomic `$push` operation into an internal array.
2. **Given** the schema, **When** analyzed, **Then** `addresses` must be an array of documents, not just strings.

---

### Scenario 3 - Identifying the 1:N "One-to-Many" Boundary (Priority: P2)

The learner identifies that "Audit Logs" grow indefinitely. They will use `Object.bsonsize()` to see how document size increases with embedding and conclude that a **Reference** (separate collection) is required to avoid the 16MB limit and fragmentation.

**Validation (Automated Test)**: A Jest test will verify:
1. The creation of a separate `audit_logs` collection.
2. That logs contain a `user_id` field of type `ObjectId` (Manual Reference).

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **Embedding vs Referencing**: The core trade-off (Read speed vs Data integrity/Growth).
- **EX-002**: **Atomicity**: How embedding allows atomic updates to related data without transactions.
- **EX-003**: **Data Growth & 16MB Limit**: Why "One-to-Squillions" should never be embedded.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `$push` and dot-notation updates.
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via `docker-compose down -v --remove-orphans`.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner successfully transforms a relational schema into an embedded one.
- **SC-002**: Learner correctly identifies when to use referencing to avoid the 16MB limit.
- **SC-003**: All validation tests pass.

## Assumptions

- Learner understands basic JSON/BSON structures.
- Learner is familiar with basic CRUD operations from previous labs.
