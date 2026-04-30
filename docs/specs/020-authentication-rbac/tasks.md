# Tasks: LAB-020 Authentication & RBAC

**Input**: Design documents from `/specs/020-authentication-rbac/`
**Prerequisites**: plan.md (required), spec.md (required).

## Phase 1: Environment Setup
- [ ] T001 Scaffold lab directory `labs/020-authentication-rbac/`.
- [ ] T002 Create `mongod.conf` with `security.authorization: disabled` (Initial State).
- [ ] T003 Create `docker-compose.yml` mounting the config file.
- [ ] T004 Implement `init/seed_data.js` to populate `inventory_db` with dummy products.

## Phase 2: Core Auth Implementation
- [ ] T005 Write `tests/auth.test.js` (Failing state: no users).
- [ ] T006 Write instructions for creating the Admin User via Localhost Exception.
- [ ] T007 Update `mongod.conf` to `security.authorization: enabled`.
- [ ] T008 Write instructions for creating the `inventoryAppUser` with `readWrite` on `inventory_db`.

## Phase 3: Custom Roles & Granularity
- [ ] T009 Write `tests/privilege.test.js` to verify app user restrictions.
- [ ] T010 Implement instructions for `db.createRole()` to create `inventoryAuditor`.
- [ ] T011 Write `tests/custom_role.test.js` to verify auditor cannot read `orders`.

## Phase 4: Instructional Content
- [ ] T012 Write `CONCEPT.md` focusing on SCRAM and Role structure.
- [ ] T013 Write `README.md` with the 4-scenario walkthrough.
- [ ] T014 Add **Command Dissection** for `db.createUser`, `db.createRole`, and `db.auth()`.

## Phase 5: Verification & Cleanup
- [ ] T015 Verify `docker-compose down -v` successfully wipes the security state.
- [ ] T016 Final pass of the "Learner Journey" and Pedagogical Audit.
