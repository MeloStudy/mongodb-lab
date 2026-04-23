# Development Plan: LAB-007: Specialized Data & GridFS

## Summary
This lab introduces the learner to data types and storage strategies that go beyond simple JSON-like documents. We will master GridFS for large files, explore Binary Data for UUIDs and blobs, and clarify the distinction between Dates and Timestamps.

## Phase 1: Monorepo Infrastructure
1. **Scaffold**: Clone `labs/000-base-setup/` to `labs/007-specialized-data-gridfs/`.
2. **Naming**: Update `package.json` to `"name": "lab-007-specialized-data-gridfs"`.
3. **Naming**: Update `docker-compose.yml` to `container_name: mongodb_lab_007`.
4. **Tools**: Ensure the Docker image used or the environment has access to `mongofiles`.

## Phase 2: Testing & Validation (TDD)
1. **Scenario 1 Assertion**: `tests/01-gridfs.test.js`.
    - Verification: Uses `GridFSBucket` to check for the uploaded file's metadata and ensures the total size of chunks matches the original file.
2. **Scenario 2 Assertion**: `tests/02-binary-uuid.test.js`.
    - Verification: Inserts documents with `BSON.UUID` and verifies they can be queried back using the same type.
3. **Scenario 3 Assertion**: `tests/03-temporal.test.js`.
    - Verification: Checks the type of stored date fields and verifies that a `Timestamp` extracted from a server command has the correct BSON type.

## Phase 3: Teaching Material
1. **CONCEPT.md**: 
    - Explaining the BSON document size limit (16MB).
    - GridFS Architecture: `fs.files` (metadata) and `fs.chunks` (data blocks).
    - UUID Subtypes: Why "Standard" (Subtype 4) is the modern way to go.
    - Date (UTC) vs Timestamp (Server-side).
2. **README.md**: 
    - Step-by-step using `mongofiles` for the 25MB image challenge.
    - Scripting UUID inserts with the Node.js driver.
3. **Dissections**: 
    - Breakdown of `mongofiles` flags.
    - Breakdown of `BinData(subtype, base64)` structure.

## Phase 4: Final Verification
1. E2E check of GridFS upload/download.
2. E2E check of UUID queries.
3. Atomic Cleanup validation (`docker-compose down -v`).
