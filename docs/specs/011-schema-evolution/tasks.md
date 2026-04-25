# Tasks: LAB-011 Schema Evolution & Versioning

## Setup & Infrastructure
- [x] Create folder `labs/011-schema-evolution/`
- [x] Create `package.json`
- [x] Create `Makefile`
- [x] Create `docker-compose.yml`
- [x] Create `init/seed.js` with mixed-version data

## Documentation
- [x] Create `CONCEPT.md`
  - [x] Theory: Versioning Pattern, Lazy vs Eager
  - [x] **Theory: Aggregation Framework Crash Course** (Pipelines & Stages)
- [x] Create `README.md`
  - [x] Intro & Objectives
  - [x] Scenario 1: Lazy Migration (App Layer)
  - [x] Scenario 2: Eager Migration (DB Layer)
  - [x] Command Dissection for `$merge`
  - [x] Validation instructions

## Implementation - Scenarios
- [x] Script for Scenario 1 (Helper function logic)
- [x] Script for Scenario 2 (Aggregation pipeline)

## Validation (Tests)
- [x] Implement `tests/01-lazy-migration.test.js`
- [x] Implement `tests/02-bulk-migration.test.js`
- [x] Ensure all tests pass with the reference solutions

## Finalization
- [x] Update `docs/syllabus.md`
- [x] Review formatting and educational tone
