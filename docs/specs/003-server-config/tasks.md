# Tasks: LAB-003: DevOps Wrap-up: Shell & Server Config

**Input**: Design documents from `/specs/003-server-config/`

**Validation Goal**: Tests must verify configuration overriding not by reading the local file, but by directly extracting the internal memory state from the `mongod` process via the `getCmdLineOpts` system command.

## Phase 1: Monorepo Setup (Clone & Prepare)
- [ ] T001 Scaffold lab directory by cloning `labs/000-base-setup/` to `labs/003-server-config/`.
- [ ] T002 Update local `package.json` workspace identifier.
- [ ] T003 Ensure `docker-compose.yml` reflects the correct container name format (`mongodb_lab_003`) and explicitly mounts `/etc/mongod.conf` with a custom `command: ["-f", "/etc/mongod.conf"]`.
- [ ] T004 Create the `mongod.conf` skeleton file. 

## Phase 2: Validation Framework Implementation (TDD)
- [ ] T005 Write validation script logic (`tests/01-server.test.js`) pulling `{ getCmdLineOpts: 1 }` through the MongoDB Driver and asserting that `parsed.storage.dbPath` aligns with the explicit lab config.
- [ ] T006 Provide required codebase comments explaining what `getCmdLineOpts` checks dynamically.

## Phase 3: Educational Content & Hands-On Environment
- [ ] T007 Write the theoretical `CONCEPT.md` detailing the YAML syntax structure for MongoDB configuration engines.
- [ ] T008 Write the step-by-step native `README.md` guide including overriding the conf file and querying it.
- [ ] T009 Inject **Command Dissection** blocks into `README.md` for `db.serverCmdLineOpts()`.

## Phase 4: Idempotency & Clean Up Verifications
- [ ] T010 Verify `README.md` Atomic Cleanup command runs natively without errors (`docker-compose down -v --remove-orphans`).
- [ ] T011 Verify `Makefile` shortcut targets operate purely as optional proxies.
- [ ] T012 Perform end-to-end "Learner Journey" Walkthrough ensuring no permission errors on custom dbPath routing for Docker.
