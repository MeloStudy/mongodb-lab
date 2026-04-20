# Development Plan: LAB-003: DevOps Wrap-up: Shell & Server Config

## Summary

This lab transitions the learner from using dynamic Docker arguments to explicit Configuration File Management (the standard for production MongoDB database clusters). It teaches the student to override the default behavior of the `mongod` engine.

## Phase 1: Monorepo Infrastructure 
1. **Scaffold**: Clone base setup from `labs/000-base-setup/` into `labs/003-server-config/`.
2. **Naming**: Update `package.json` to `"name": "lab-003-server-config"`. Update `docker-compose.yml` to `container_name: mongodb_lab_003`.
3. **Skeleton Configs**: Construct an empty `mongod.conf` file for the student to populate. Update `docker-compose.yml` to map this file to `/etc/mongod.conf`, and to provide a `/data/db` volume and `/var/log/mongodb` volume mapping if necessary (though the `mongod.conf` internal mappings are the focus). Modify docker invocation command to `command: ["-f", "/etc/mongod.conf"]`.

## Phase 2: Testing & Validation
1. **Shell Assertion**: Create `tests/01-config.test.js`. Have Jest execute the `{ getCmdLineOpts: 1 }` or `{ serverStatus: 1 }` command within MongoDB.
2. **Assertion Check**: Validate that `parsed.storage.dbPath` is present and matches the configured path in the lab instructions, and that `parsed.systemLog.path` is explicitly set.

## Phase 3: Teaching Material
1. **CONCEPT.md**: Explain the architecture of `mongod` execution phases and the migration towards YAML configuration syntax. 
2. **README.md**: Create the step-by-step tutorial.
    - Write the YAML `mongod.conf` properties.
    - Run `docker-compose up -d`.
    - Drop into `mongosh` and use `db.serverCmdLineOpts()` to verify.
    - Run validation (`npm test`).
3. **Dissections**: Dissect `db.serverCmdLineOpts()`.

## Phase 4: Verification
1. Run E2E locally to guarantee Jest accurately asserts internal `dbPath`.
2. Assure idempotency (`make clean` / `docker-compose down -v`).
