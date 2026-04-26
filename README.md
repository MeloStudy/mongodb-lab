# 🍃 MongoDB Masterclass Laboratory

Welcome to the **MongoDB Masterclass Repository**. This is a premium, engineering-focused curriculum designed to take you from basic document storage to mastery of distributed clusters, advanced modeling, and the Aggregation Framework.

---

## 🧠 The "High Friction" Philosophy

This repository is built on the **High Friction Learning** principle. Unlike other tutorials that hide complexity behind "magic scripts," we require you to interact directly with the tools.

- **No Magic Scripts**: We do not use `setup.sh` or `reset.sh`. You will use `docker-compose`, `npm`, and `mongosh` directly.
- **TDD-Driven**: Each lab is a puzzle. You are given a specification and a failing test suite; you succeed only when your database state satisfies the code's expectations.
- **Atomic & Ephemeral**: Every lab runs in an isolated Docker container. When you're done, you destroy the environment to keep your system clean.

---

## 🗺️ Curriculum Overview

The journey is divided into 8 Progressive Modules. For the full roadmap, see [docs/syllabus.md](docs/syllabus.md).

| Module | Focus |
| :--- | :--- |
| **01: Foundations** | Core Engine, BSON Types, and Server Configuration. |
| **02: CRUD Mastery** | Advanced Operations, Write Concerns, and Specialized Data (GridFS). |
| **03: Schema Design** | Relationships, Advanced Patterns, and Schema Evolution/Versioning. |
| **04: Performance** | Core Indexing (ESR), Geospatial, and Atlas Search. |
| **05: Aggregation** | The Pipeline Framework, Analytics, and Data Transformations. |
| **06: Security** | Authentication, RBAC, and Encryption at Rest. |
| **07: Integration** | Java/Node Drivers, Real-time Change Streams, and ACID Transactions. |
| **08: Scale** | Replica Sets, Sharding, and Cloud-Native Atlas. |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Docker & Docker Compose**
- **Node.js (v18+) & NPM**
- **MongoDB Database Tools** (mongodump, mongorestore, mongofiles)

### 2. Global Installation
Run this once at the root to prepare the workspaces:
```bash
npm install
```

### 3. Lab Workflow

The standard educational path is to navigate into each laboratory directory, study the theory, and execute the implementation steps manually. **Makefiles are provided as optional utility shortcuts for experienced users but are not mandatory.**

#### Standard Path (Manual)
1.  **Understand**: Enter the lab folder (e.g., `cd labs/007-specialized-data-gridfs`) and read `CONCEPT.md`.
2.  **Setup**: Follow the `README.md` instructions to spin up the environment:
    ```bash
    docker-compose up -d
    ```
3.  **Implement**: Solve the challenges described in the README.
4.  **Validate**: Run the tests locally:
    ```bash
    npm test
    ```
5.  **Cleanup**: Tear down the environment:
    ```bash
    docker-compose down -v
    ```

#### Alternative Path (Makefile Shortcuts)
From the root directory, you can use these shortcuts:
- `make setup LAB=007`
- `make test LAB=007`
- `make clean LAB=007`

---

## 🤖 Agent Workflows (Automation & Quality)

If you are using an AI coding assistant (like Antigravity), this repository includes native **Agent Workflows** to automate quality gates and implementation steps. These are invoked via `/` commands:

-   **/lab-init**: Initiates a new laboratory by generating `DRAFT` artifacts and folder structure.
-   **/lab-architect**: Validates planning artifacts (`spec`, `plan`, `tasks`). Moves a lab to `READY` status.
-   **/lab-builder**: Automates the technical implementation (TDD, scaffolding, and docs) based on an approved plan.
-   **/lab-auditor**: Performs a final pedagogical review to detect conceptual gaps before marking a lab as `Completed`.
-   **/lab-governor**: Manages global changes to the [Constitution](docs/constitution.md) and ensures consistency across all labs.

### Master Workflows (Full Cycles)
-   **/lab-master-plan**: Executes the full design cycle (Init + Architect) to reach `READY` status.
-   **/lab-master-build**: Executes the full implementation cycle (Builder + Auditor) to reach `AUDITED` status.

For a detailed example of the workflow in action, see [docs/LAB_LIFECYCLE.md](docs/LAB_LIFECYCLE.md).

---


## 📜 Contribution & Rules
Please read our [Constitution](docs/constitution.md) before contributing or attempting to automate the learning process. We value precision and manual mastery over convenience.

---
*Created by the MongoDB Masterclass Team.*
