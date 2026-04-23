# Tasks: LAB-007: Specialized Data & GridFS

**Input**: New specs for Specialized Data & GridFS.

## Phase 1: Environment & Scaffolding
- [x] T001 Scaffold lab directory from `labs/000-base-setup/`.
- [x] T002 Configure `package.json` and `docker-compose.yml` for Lab 007.
- [x] T003 Prepare a >16MB sample file (e.g., a large image or dummy data) for the lab.

## Phase 2: Implementation of Scenarios (TDD)
- [x] T004 Write `tests/01-gridfs.test.js`: Validating file upload/download and chunking logic.
- [x] T005 Write `tests/02-binary-uuid.test.js`: Validating UUID storage and binary subtype handling.
- [x] T006 Write `tests/03-temporal.test.js`: Validating `Date` vs `Timestamp` behavior.

## Phase 3: Documentation & Educational Content
- [x] T007 Write `CONCEPT.md`: Detailing BSON limits, GridFS architecture, and UUID/Binary subtypes.
- [x] T008 Design `README.md`: Using the "Media Archive" and "Secure Identity" scenarios.
- [x] T009 Inject **Command Dissections**: Covering `mongofiles` and BSON type markers.

## Phase 4: Verification
- [x] T010 Ensure `make clean` (if applicable) or manual cleanup works correctly.
- [x] T011 Perform E2E walkthrough of the lab.
- [x] T012 Update central `syllabus.md` to mark LAB-007 as "In Progress" or "Completed" (if fully implemented).
