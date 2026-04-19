# Implementation Plan: [LAB NUMBER & NAME]

**Branch**: `[###-lab-name]` | **Date**: [DATE]
**Input**: Specification from `/specs/[###-lab-name]/educational-spec.md`

## Summary

[Summary of what the learner will build, aligning explicitly with the MongoDB Curriculum expectations.]

## Phase 1: Monorepo Infrastructure (Base Setup Cloning)
1. **Scaffold**: Clone the base setup from `labs/000-base-setup/`.
2. **Workspace Registration**: Rename the sub-module identifier in `package.json` to act as an NPM workspace member (or standard Maven structure if Java).
3. **Data Requirements**: Decide if this lab requires seeding via an `init.js` script mounted into the container (`/docker-entrypoint-initdb.d`), or if the database starts completely blank.

## Phase 2: Scenario 1 - [First Educational Focus]
1. Define the instructional path (e.g., executing a command or establishing a connection).
2. Establish the exact Testing mechanism (e.g., a Jest module or JUnit test verifying dataset presence).

## Phase 3: Scenario 2 - [Second Educational Focus]
1. Define the instructional path (e.g. advanced NoSQL querying or Aggregation execution).
2. Establish the exact Testing validation mechanism.

## Phase 4: Full Documentation & Dissection
1. Draft the `CONCEPT.md` outlining the theoretical concepts comprehensively, prioritizing the "Why".
2. Draft the `README.md` step-by-step guide enforcing strict **Native Execution** (`docker-compose up -d`) logic.
3. Apply the **Command Dissection** pattern inside the `README.md` for ANY new CLI flag or MongoSH method introduced.

## Constitution Compliance Check
- [ ] No `.sh` wrapper scripts abstract the orchestration.
- [ ] Code comments explicitly describe what every test line validates.
- [ ] Language used across all text is explicitly English.

## Open Questions
- [Any specific query for the reviewer before implementation?]
