# Lab Specification: LAB-001 Hello MongoDB

**Feature Branch**: `001-hello-mongodb`
**Created**: 2026-04-19
**Status**: Draft
**Syllabus Section**: The Core Database

## Syllabus Alignment *(mandatory)*

- **Concept**: Ecosistema, Instalación (Docker), Shell vs Drivers.
- **Prerequisites**: LAB-000 Base Setup (Underlying Docker structure).
- **Learning Objectives**:
  - LO-001: Comprehend how to spin up MongoDB natively and connect to its built-in interactive shell (`mongosh`).
  - LO-002: Contrast the interactive shell with programmatic interaction using the Node.js MongoDB Native Driver.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Command Line (mongosh) (Priority: P1)

The learner will execute queries interactively by attaching to the MongoDB container and using `mongosh`. They will run a basic connection test (`db.adminCommand("ping")`) and insert a dummy document to prove CLI capabilities.

**Validation (Automated Test)**: A Node.js Jest test `shell_evaluation.test.js` checking if a document was successfully created in the `lab_db` by the user via the CLI.

**Acceptance Scenarios**:

1. **Given** a cleanly launched MongoDB setup, **When** the learner uses `mongosh` to insert `{ msg: "Hello from CLI" }` into collection `greetings`, **Then** the Jest script finds the document successfully.

---

### Scenario 2 - The Node.js Driver (Priority: P2)

The learner will transition from `mongosh` to writing their own simple JavaScript file. They will use the `mongodb` native driver to connect, ping the database, and write a document programmatically.

**Validation (Automated Test)**: A Node.js Jest test `driver_evaluation.test.js` executing the student's script and verifying the programmatic document `{ msg: "Hello from Driver" }` exists in the database.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: Exploring what `mongosh` is and how it interprets JavaScript syntax natively.
- **EX-002**: Contrasting CLI exploration against application integration (what a "Driver" actually does).

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest by default).
- **TR-004**: Lab README MUST provide a "Command Dissection" for any new command or flag introduced (`docker exec -it ... mongosh`).
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands (e.g. `docker-compose down -v --remove-orphans`).
- **TR-008**: An optional Makefile MAY be provided strictly as an automated shortcut container.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner successfully manipulates their local MongoDB database via interactive Shell and Node Driver.
- **SC-002**: All validation tests perfectly pass, confirming the learner executed both paths.

## Assumptions

- Learner understands basic JavaScript syntax.
- Docker Desktop and Node.js v20+ are installed.
