# Implementation Plan: 001-hello-mongodb

**Branch**: `001-hello-mongodb` | **Date**: 2026-04-19
**Input**: Specification from `/specs/001-hello-mongodb/spec.md`

## Summary

This lab will introduce the user to the foundational MongoDB interactions. We will architect a base structure where the user learns to reach MongoDB by two distinct avenues: the raw MongoDB shell (`mongosh`) and programmatic code (Node.js). 

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone the base setup from `labs/000-base-setup/` into `labs/001-hello-mongodb/`.
2. **Workspace Registration**: Rename `"name"` to `"lab-001-hello-mongodb"` in `package.json` to act as an NPM workspace member.
3. **Data Requirements**: The database will start completely blank. The user will act as the data seeder.

## Phase 2: Scenario 1 - The Command Line (mongosh)
1. **Instructional Path**: Teach the learner how to use `docker exec -it mongodb_lab_001 mongosh` to enter the shell and send `db.greetings.insertOne({ msg: "Hello from CLI" })`.
2. **Testing Mechanism**: Write `tests/01-shell.test.js` validating the document exists in the database.

## Phase 3: Scenario 2 - The Node.js Driver
1. **Instructional Path**: Provide a skeleton file `driver.js`. Guide the learner to write the Node.js boilerplate (`MongoClient.connect`, `insertOne`).
2. **Testing Mechanism**: Write `tests/02-driver.test.js` executing `driver.js` and guaranteeing success.

## Phase 4: Full Documentation & Dissection
1. Draft `CONCEPT.md` prioritizing the "Why" (The evolutionary jump from Relational SQL clients to JS-native shells).
2. Draft `README.md` step-by-step using strict **Native Execution** (`docker-compose up -d`).
3. Apply the **Command Dissection** pattern inside the `README.md` for `docker exec -it` and basic `mongosh` functions.

## Constitution Compliance Check
- [x] No `.sh` wrapper scripts abstract the orchestration.
- [x] Code comments explicitly describe what every test line validates.
- [x] Language used across all text is explicitly English.
