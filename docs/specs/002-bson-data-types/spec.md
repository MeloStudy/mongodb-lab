# Lab Specification: LAB-002 BSON & Data Types

**Feature Branch**: `002-bson-data-types`
**Created**: 2026-04-19
**Status**: AUDITED
**Syllabus Section**: The Core Database

## Syllabus Alignment *(mandatory)*

- **Concept**: JSON vs BSON differences. `Int32`, `Long` (Int64), `Double`, `Decimal128` (Financial Precision), `ISODate`, and `BinData` (Binary Data).
- **Prerequisites**: LAB-001 Hello MongoDB (Ability to connect via CLI and Node.js).
- **Learning Objectives**:
  - LO-001: Understand that native JavaScript implicitly treats all numbers as double-precision floats, which destroys precise financial data.
  - LO-002: Master overriding primitive JavaScript types using MongoDB's exact BSON constructors wrappers explicitly in both the shell and driver.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - Shell Type Interception (Priority: P1)

The learner will execute a manual insert in `mongosh` containing strict BSON mappings (`NumberInt`, `NumberLong`, `NumberDecimal`, `ISODate`, `BinData`). They will then query documents filtering by `$type`.

**Validation (Automated Test)**: A Node.js Jest test `shell_evaluation.test.js` checking if an inserted document in `bson_db` under collection `invoices` contains the exact strict types, verifying using the MongoDB `$type` operator.

**Acceptance Scenarios**:

1. **Given** an empty `bson_db`, **When** the learner uses `mongosh` to insert an invoice using `NumberDecimal("100.99")` and `BinData(0, "YmFzZTY0c2FtcGxl")`, **Then** the Jest script finds the document perfectly categorized as `decimal` and `binData`.

---

### Scenario 2 - Driver BSON Class Constructors (Priority: P2)

The learner will replicate the exact same scenario from Node.js programmatically. Because Node.js doesn't natively have `Decimal128` primitives, the learner must import those classes from the MongoDB driver package wrapper.

**Validation (Automated Test)**: A Node.js Jest test `driver_evaluation.test.js` executing the student's script and checking the MongoDB server-side to guarantee the exact BSON signatures were transmitted over the network correctly.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: "Why not just use `float` for money?" and the float rounding error flaw.
- **EX-002**: What constitutes `BinData` in a database context (e.g., storing a small avatar image, or an encrypted chunk).
- **EX-003**: The mapping overlap between Node.js Driver classes (e.g. `const { Decimal128 } = require('mongodb')`) and mongosh classes (`NumberDecimal()`).

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest by default).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `$type` query filters.
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands (e.g. `docker-compose down -v --remove-orphans`).
- **TR-008**: An optional Makefile MAY be provided strictly as an automated shortcut container.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly encodes a document in `mongosh` that passes a strict structural type test.
- **SC-002**: Learner successfully writes Node.js code that casts plain Objects into BSON constructors.

## Assumptions

- Learner understands Node.js structural imports (`require('mongodb')`).
- Learner understands the concept of floating-point inaccuracies.
