# Lab Specification: 014-core-indexing

**Feature Branch**: `014-core-indexing`
**Created**: 2026-04-25
**Status**: Draft
**Syllabus Section**: Performance, Indices & Spatial Data

## Syllabus Alignment *(mandatory)*

- **Concept**: Core Indexing & ESR Rule. Understanding how to optimize queries using B-Tree indexes and the Equality-Sort-Range rule.
- **Prerequisites**: Module 1 and 2 (Basic CRUD and Data Types).
- **Learning Objectives**:
  - LO-001: Differentiate between a Collection Scan (COLLSCAN) and an Index Scan (IXSCAN) using `explain()`.
  - LO-002: Implement compound indexes following the **ESR Rule** (Equality, Sort, Range).
  - LO-003: Implement **Sparse Indexes** to optimize storage for optional fields.
  - LO-004: Understand and implement **TTL (Time-To-Live) Indexes** for automated data expiration.
  - LO-005: Identify **Covered Queries** where the index satisfies the entire query without touching the documents.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Efficiency Gap (Priority: P1)

The learner will be given a large dataset (e.g., 5,000 orders) and asked to find a specific order by `orderId`. They will observe a slow query and then fix it by creating a unique index.

**Validation (Automated Test)**: Jest test will verify that an index exists on `orderId` and that an `explain()` output for a query on `orderId` shows a `winningPlan` of type `IXSCAN`.

**Acceptance Scenarios**:
1. **Given** a collection with 5k documents, **When** the learner runs a query on an unindexed field, **Then** `explain().executionStats.totalDocsExamined` equals `totalKeysExamined` (COLLSCAN). After index creation, `totalDocsExamined` should be 1.

---

### Scenario 2 - Mastering the ESR Rule (Priority: P1)

The learner will optimize a complex query that filters by `status` (equality), sorts by `orderDate` (sort), and ranges over `totalAmount` (range). They must create the compound index in the correct order: `(status, orderDate, totalAmount)`.

**Validation (Automated Test)**: Jest test will check for a compound index matching the exact ESR order. It will then run the complex query and verify it is an efficient IXSCAN without a memory sort (`SORT` stage).

---

### Scenario 3 - Sparse Indexes for Optional Data (Priority: P2)

The learner will identify a field that is rarely present (e.g., `discountCode`) and create a **Sparse Index**. They will verify that the index size is smaller than a standard index because it only includes documents where the field exists.

**Validation (Automated Test)**: Jest test will verify the existence of an index on `discountCode` with the `sparse: true` property.

---

### Scenario 4 - Automated Cleanup with TTL (Priority: P2)

The learner will create a `logs` collection where documents automatically disappear 60 seconds after their `createdAt` timestamp.

**Validation (Automated Test)**: Jest test will verify the existence of a TTL index on the `createdAt` field with `expireAfterSeconds: 60`.

---

### Scenario 5 - Zero-Fetch: Covered Queries (Priority: P2)

The learner will execute a projection query that only requests fields present in an existing index. They will verify that `totalDocsExamined` is 0, meaning MongoDB never touched the disk to fetch documents.

**Validation (Automated Test)**: Jest test will run a projected query and verify `explain().executionStats.totalDocsExamined === 0`.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **The Indexing Mindset**: Trading write performance and storage for read speed.
- **EX-002**: **ESR Rule**: Why the order `Equality -> Sort -> Range` is the golden rule for compound indexes.
- **EX-003**: **Sparse Indexes**: When to use them to save memory and storage on nullable fields.
- **EX-004**: **Index Covering**: When the index becomes the data source, avoiding document fetches.
- **EX-005**: **TTL Mechanics**: How the background TTL thread works in MongoDB.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `createIndex()`, `explain()`, and index properties.
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands (e.g. `docker-compose down -v --remove-orphans`).
- **TR-008**: An optional Makefile MAY be provided strictly as an automated shortcut container.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner reduces `totalDocsExamined` from 5,000 to 1 for a specific lookup.
- **SC-002**: Learner successfully implements a compound index that avoids a "Sort Stage" in execution.
- **SC-003**: Learner achieves `totalDocsExamined: 0` for a covered query.

## Assumptions

- Learner is familiar with the `mongosh` environment.
- Docker environment is already stable from previous labs.
