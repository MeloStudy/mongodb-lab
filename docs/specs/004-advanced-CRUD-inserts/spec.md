# Lab Specification: LAB-004: Advanced Inserts & Write Concerns

**Feature Branch**: `004-advanced-CRUD-inserts`
**Status**: Draft
**Syllabus Section**: Complete CRUD Operations

## Syllabus Alignment *(mandatory)*

- **Concept**: Atomic operations, Ordered vs Unordered inserts, Write Concerns (w, j, wtimeout).
- **Prerequisites**: LAB-001, LAB-002, LAB-003.
- **Learning Objectives**:
  - LO-001: Execute bulk inserts and understand how the `ordered` flag affects execution flow upon duplicate key errors.
  - LO-002: Configure `writeConcern` to balance performance vs. data durability.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The "Battle of Order" (Priority: P1)
The learner will perform an `insertMany` with a set of documents containing a deliberate duplicate `_id` in the middle of the array. They must observe the difference in behavior when `ordered` is `true` (execution stops) vs `false` (execution continues).

**Validation (Automated Test)**: A Jest test that counts the remaining documents in the collection after a failed bulk insert to verify if the student correctly applied the `ordered: false` flag.

---

### Scenario 2 - Total Durability (Priority: P2)
The learner will perform an insertion with a strict `writeConcern` requiring acknowledgement from the majority of the replica set (simulated in standalone) and explicit journaling.

**Validation (Automated Test)**: A Node.js driver test that inspects the acknowledgment object returned by the server, ensuring `w: "majority"` and `j: true` were correctly passed in the options.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain
- **EX-001**: **Ordered vs Unordered**: How MongoDB handles batch processing and error propagation.
- **EX-002**: **Write Concerns**: The "Acknowledgement" vs "Journaling" (the `j` flag) handshake.

### Technical Requirements
- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `insertMany` options.
- **TR-005**: All testing scripts MUST be thoroughly commented.

## Success Criteria *(measurable outcomes)*
- **SC-001**: Learner demonstrates ability to successfully complete a batch insert even when errors are present in the middle of the set.
- **SC-002**: Learner successfully requests a durable write confirmation from the server.

## Assumptions
- Learner understands basic JSON array syntax.
- Docker and Node.js environment is already verified from Lab 003.
