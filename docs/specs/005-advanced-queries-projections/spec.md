# Lab Specification: LAB-005: Advanced Queries & Projections

**Feature Branch**: `005-advanced-queries-projections`
**Status**: Draft
**Syllabus Section**: Complete CRUD Operations

## Syllabus Alignment *(mandatory)*

- **Concept**: Comparison Operators (`$gt`, `$in`), Logical (`$and`, `$or`), Array Operators (`$all`, `$elemMatch`, `$size`).
- **Prerequisites**: LAB-001, LAB-004.
- **Learning Objectives**:
  - LO-001: Use complex array filters to find specific sub-document patterns.
  - LO-002: Optimize data transfer using Projections (1/0 flags).
  - LO-003: Understand the difference between querying "any element in array" vs "one specific element satisfying all conditions" (`$elemMatch`).

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The "Review Hunter" (Priority: P1)
The learner will query a `inventory` collection where each document has a `shipments` array of objects. They must find documents where **a single shipment** has both `status: "delivered"` and `quantity: { $gt: 50 }`. 

**Validation (Automated Test)**: Verification that the student used `$elemMatch` instead of separate top-level filters (which would return false positives where one shipment satisfies `status` and *another* satisfies `quantity`).

---

### Scenario 2 - Data Slimming (Priority: P2)
The learner will perform a query that excludes large `description` fields and `_id`, simulating a REST API response for a summary list.

**Validation (Automated Test)**: A test that inspects the JSON output of a search script to ensure the forbidden fields are missing.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain
- **EX-001**: **Array Semantics**: Why `{ "array.field": X, "array.field": Y }` often yields buggy results in MongoDB.
- **EX-002**: **Projection Limits**: Rules of exclusion and inclusion (you cannot mix them except for `_id`).

### Technical Requirements
- **TR-001**: Containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Automated validation tests (Node.js/Jest).
- **TR-003**: Provide a "Command Dissection" for `$elemMatch`.

## Success Criteria *(measurable outcomes)*
- **SC-001**: Learner successfully retrieves only the target documents from a complex array structure.
- **SC-002**: Learner successfully reduces document size using projections.
