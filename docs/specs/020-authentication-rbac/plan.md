# Implementation Plan: LAB-020 Authentication & RBAC

This plan outlines the technical steps to build the Authentication and RBAC lab.

## Phase 1: Environment & Auth Bootstrap
1. **Docker Setup**: Configure `docker-compose.yml` to use a custom `mongod.conf` with `security.authorization: enabled`.
2. **The Localhost Exception**: Document how to use the "Localhost Exception" to create the initial admin user without credentials.
3. **Seeding**: Provide a script that creates initial dummy data in `inventory_db` for testing permissions.

## Phase 2: Scenario 1 & 2 - Core RBAC
1. **Instructional Path**: Guide the learner through creating a Root User and an App User.
2. **Testing**: Implement Jest tests that verify connection strings with credentials and assert successful authentication.

## Phase 3: Scenario 3 - Custom Roles
1. **Instructional Path**: Teach the `db.createRole()` command and how to define `privileges` (actions + resources).
2. **Testing**: Implement a test that assumes the auditor role and tries to read a forbidden collection, asserting an "Unauthorized" error.

## Phase 4: Scenario 4 - Cross-DB Scoping
1. **Instructional Path**: Explain how users are "defined" in a specific database but can have roles assigned on others.
2. **Testing**: Test user access patterns across multiple namespaces.

## Phase 5: Documentation & Theory
1. **CONCEPT.md**: Deep dive into SCRAM (Salted Challenge Response Authentication Mechanism), the structure of a Role (Privileges/Actions), and the impact of the `admin` database.
2. **README.md**: Create the interactive walkthrough with command dissections for user/role management.

## Verification Plan

### Automated Tests
- `npm test` will run a suite of Jest tests:
  - `auth.test.js`: Verifies admin login.
  - `privilege.test.js`: Verifies least-privilege enforcement for app users.
  - `custom_role.test.js`: Verifies auditor restrictions.

### Manual Verification
- Verify that `mongosh` prompts for credentials when connecting to the container.
- Verify `docker-compose down -v` wipes all created users (ensuring idempotency).
