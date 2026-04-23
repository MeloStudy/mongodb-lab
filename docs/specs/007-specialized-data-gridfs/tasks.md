# Tasks: LAB-007: Specialized Data & GridFS

**Input**: New specs for Specialized Data & GridFS.

## Phase 1: Environment & Scaffolding
- [ ] T001 Scaffold lab directory from `labs/000-base-setup/`.
- [ ] T002 Configure `package.json` and `docker-compose.yml` for Lab 007.
- [ ] T003 Prepare a >16MB sample file (e.g., a large image or dummy data) for the lab.

## Phase 2: Implementation of Scenarios (TDD)
- [ ] T004 Write `tests/01-gridfs.test.js`: Validating file upload/download and chunking logic.
- [ ] T005 Write `tests/02-binary-uuid.test.js`: Validating UUID storage and binary subtype handling.
- [ ] T006 Write `tests/03-temporal.test.js`: Validating `Date` vs `Timestamp` behavior.

## Phase 3: Documentation & Educational Content
- [ ] T007 Write `CONCEPT.md`: Detailing BSON limits, GridFS architecture, and UUID/Binary subtypes.
- [ ] T008 Design `README.md`: Using the "Media Archive" and "Secure Identity" scenarios.
- [ ] T009 Inject **Command Dissections**: Covering `mongofiles` and BSON type markers.

## Phase 4: Verification
- [ ] T010 Ensure `make clean` (if applicable) or manual cleanup works correctly.
- [ ] T011 Perform E2E walkthrough of the lab.
- [ ] T012 Update central `syllabus.md` to mark LAB-007 as "In Progress" or "Completed" (if fully implemented).
