# Tasks: LAB-011 Schema Evolution & Versioning

## Setup & Infrastructure
- [ ] Create folder `labs/011-schema-evolution/`
- [ ] Create `package.json`
- [ ] Create `Makefile`
- [ ] Create `docker-compose.yml`
- [ ] Create `init/seed.js` with mixed-version data

## Documentation
- [ ] Create `CONCEPT.md`
  - [ ] Theory: Versioning Pattern, Lazy vs Eager
  - [ ] **Theory: Aggregation Framework Crash Course** (Pipelines & Stages)
- [ ] Create `README.md`
  - [ ] Intro & Objectives
  - [ ] Scenario 1: Lazy Migration (App Layer)
  - [ ] Scenario 2: Eager Migration (DB Layer)
  - [ ] Command Dissection for `$merge`
  - [ ] Validation instructions

## Implementation - Scenarios
- [ ] Script for Scenario 1 (Helper function logic)
- [ ] Script for Scenario 2 (Aggregation pipeline)

## Validation (Tests)
- [ ] Implement `tests/01-lazy-migration.test.js`
- [ ] Implement `tests/02-bulk-migration.test.js`
- [ ] Ensure all tests pass with the reference solutions

## Finalization
- [ ] Update `docs/syllabus.md` (Set status to "Planned/In Progress")
- [ ] Review formatting and educational tone
