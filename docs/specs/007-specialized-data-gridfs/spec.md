# Lab Specification: LAB-007: Specialized Data & GridFS

**Feature Branch**: `007-specialized-data-gridfs`
**Created**: 2026-04-22
**Status**: AUDITED
**Syllabus Section**: Complete CRUD Operations

## Syllabus Alignment *(mandatory)*

- **Concept**: Handling large files (>16MB) with **GridFS**, Binary Subtypes, **UUIDs**, and complex Date vs Timestamp management.
- **Prerequisites**: LAB-006.
- **Learning Objectives**:
  - LO-001: Understand the 16MB BSON document limit and when to utilize GridFS for large object storage.
  - LO-002: Implement GridFS operations (upload, download, delete) using `mongofiles` and the native driver.
  - LO-003: Correctfully handle Binary data types (BinData) and UUIDs (Standard vs Legacy) for external system integration.
  - LO-004: Differentiate between the `Date` type (user-facing time) and the `Timestamp` type (internal server operations/oplog).

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Media Archive (GridFS) (Priority: P1)

The learner must store a large high-resolution satellite image (approx. 25MB) that exceeds the standard BSON limit.
- **Task A**: Use `mongofiles` to upload the image into a `satellite_images` bucket.
- **Task B**: Verify the existence of chunks in `fs.chunks` and metadata in `fs.files`.
- **Task C**: Download the file back to the local system to ensure integrity.

**Validation (Automated Test)**: Node.js/Jest test using the MongoDB driver's `GridFSBucket` to check if the file exists, has the correct metadata, and consists of multiple chunks.

---

### Scenario 2 - Secure Identity (UUIDs & Binary) (Priority: P2)

Generating and storing unique identifiers for a global user base.
- **Task A**: Insert documents using BSON UUIDs (subtype 4).
- **Task B**: Query documents using a binary UUID filter.
- **Task C**: Store a small binary blob (e.g., a thumbnail or a signature) using a specific BinData subtype.

**Validation (Automated Test)**: Jest test checking if the `_id` or specified field is an instance of `BSON.UUID` and that binary data matches the source.

---

### Scenario 3 - Temporal Precision (Date vs Timestamp) (Priority: P2)

Differentiating application-level events from database-level sequencing.
- **Task A**: Store a "Transaction Date" using the standard `Date` object.
- **Task B**: Observe and extract a `Timestamp` from a change stream or oplog entry to understand its structure (seconds + increment).

**Validation (Automated Test)**: Test comparing the behavior of `Date` (which can be modified) vs `Timestamp` (which is often server-generated).

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **The 16MB Wall**: Why the limit exists and the architecture of GridFS (splitting files into `fs.files` and `fs.chunks`).
- **EX-002**: **BSON Subtypes**: The importance of subtypes in BinData, especially for UUID interoperability between different drivers.
- **EX-003**: **Epochs and Precision**: How MongoDB stores dates (UTC milliseconds since epoch) and why `Timestamp` is NOT for application dates.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `mongofiles` and its flags (`-d`, `-b`, `put`, `get`).
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner successfully uploads a >16MB file and understands how chunks are distributed.
- **SC-002**: Learner correctly identifies the difference between `Date` and `Timestamp` in the context of their use cases.
- **SC-003**: All validation tests pass.

## Assumptions

- Learner has completed LAB-006 and understands basic CRUD.
- Docker and Node.js v20+ are installed.
- Access to `mongofiles` (part of MongoDB Database Tools) is available via the container.
