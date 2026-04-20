# Lab Specification: LAB-003: DevOps Wrap-up: Shell & Server Config

**Feature Branch**: `003-server-config`
**Status**: Draft
**Syllabus Section**: The Core Database

## Syllabus Alignment *(mandatory)*

- **Concept**: Advanced Node configuration, `dbpath`, `logpath`, Configuration files (`.cfg` or `.conf`).
- **Prerequisites**: LAB-001 (Docker concepts), LAB-002.
- **Learning Objectives**:
  - LO-001: Configure a MongoDB instance using a declarative YAML configuration file (`mongod.conf`).
  - LO-002: Understand how the MongoDB daemon (`mongod`) bootstraps and parse command-line options via `mongosh`.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - Bootstrapping with a `.conf` file (Priority: P1)

The learner will modify a `docker-compose.yml` to bind-mount a physical `mongod.conf` file into the container, replacing the default runtime arguments. They will define explicit directories for the `dbpath` and `logpath`, instructing the process to write structured logs.

**Validation (Automated Test)**: A Node.js/Jest test that authenticates against the database, executes the `getCmdLineOpts` administrative command, and verifies that the `parsed` object explicitly lists the custom paths.

**Acceptance Scenarios**:

1. **Given** an empty Docker state, **When** the learner provisions the container with the `mongod.conf` bound as a volume, **Then** the `db.serverCmdLineOpts()` command reflects those exact overrides instead of the Docker image's defaults.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: The difference between the `mongosh` (shell) and `mongod` (daemon).
- **EX-002**: Configuration File Format (YAML vs Legacy).
- **EX-003**: Log routing and Database pathing (`storage.dbPath` vs `/data/db`).

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest by default).
- **TR-004**: Lab README MUST provide a "Command Dissection" for any new command or flag introduced.
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner effectively overrides the Docker image defaults via explicit configuration files.
- **SC-002**: Validation tests pass upon completion validating `systemLog.path` and `storage.dbPath`.

## Assumptions

- Learner understands Docker volume bindings (`-v` or `volumes:` array).
- Docker Desktop and Node.js v20+ are installed.
