# Lab Specification: LAB-020 Authentication & RBAC

**Feature Branch**: `020-authentication-rbac`
**Created**: 2026-04-30
**Status**: READY
**Syllabus Section**: Security & Administration

## Syllabus Alignment *(mandatory)*

- **Concept**: Introduction to Role-Based Access Control (RBAC) and user authentication in MongoDB.
- **Prerequisites**: LAB-003: Server Config (understanding mongod.conf).
- **Learning Objectives**:
  - LO-001: Enable internal authentication on a standalone MongoDB instance.
  - LO-002: Create a Root User for administrative tasks.
  - LO-003: Implement the Principle of Least Privilege using built-in roles (`read`, `readWrite`).
  - LO-004: Create and assign Custom Roles for specialized access patterns.
  - LO-005: Scope user access across multiple databases within the same cluster.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Gatekeeper (Priority: P1)

The learner will enable authentication in the MongoDB configuration and create the first "User Administrator" in the `admin` database.

**Validation (Automated Test)**: Jest test attempting to connect without credentials (should fail) and then connecting with the new admin credentials (should succeed).

**Acceptance Scenarios**:
1. **Given** a fresh MongoDB instance, **When** the learner enables `--auth` and creates a root user, **Then** all subsequent non-authenticated requests must be rejected.

---

### Scenario 2 - The Application Service Account (Priority: P1)

The learner will create a user for a specific application database (`inventory_db`) with `readWrite` permissions.

**Validation (Automated Test)**: Jest test connecting as the app user and verifying it can write to `inventory_db` but NOT to `admin`.

---

### Scenario 3 - The Granular Auditor (Priority: P2)

The learner will create a **Custom Role** named `inventoryAuditor` that allows `find` operations on the `products` collection but forbids access to `orders`.

**Validation (Automated Test)**: Jest test verifying the custom role permissions by attempting unauthorized reads.

---

### Scenario 4 - Scoping and DB Restrictions (Priority: P2)

The learner will verify that a user created in `db_a` cannot access `db_b` unless explicitly granted.

**Validation (Automated Test)**: Jest test asserting "Unauthorized" error when switching databases.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: The **Bootstrap Paradox**: How to create the first user when auth is enabled.
- **EX-002**: Built-in Roles vs Custom Roles: When to use each.
- **EX-003**: The **`admin` Database**: Why it's special for user management.
- **EX-004**: Privilege Inheritance and Role Scoping.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `db.createUser()` and `db.createRole()`.
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner successfully secures a MongoDB instance from unauthorized access.
- **SC-002**: Learner demonstrates ability to create granular, least-privilege users.
- **SC-003**: All validation tests pass.

## Assumptions

- Learner understands basic CLI usage and Docker.
- Node.js v20+ is installed.
