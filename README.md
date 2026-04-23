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

| Module | focus |
| :--- | :--- |
| **01: Foundations** | Environment, BSON Types, and Server Configuration. |
| **02: CRUD Mastery** | Advanced Querying, Projections, and Array Surgery. |
| **03: Specialized Data** | GridFS, Binary Data, and Temporal precision. |
| **04: Performance** | Indexes, Explain Plans, and Profiling. |
| **05: Modeling** | Schema Design, Patterns, and Relationships. |
| **06: Aggregation** | The Pipeline Framework and Data Processing. |
| **07: Integration** | Node.js Driver, Streams, and Transaction management. |
| **08: Scale** | Replica Sets, Sharding, and High Availability. |

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

## 📜 Contribution & Rules
Please read our [Constitution](docs/constitution.md) before contributing or attempting to automate the learning process. We value precision and manual mastery over convenience.

---
*Created by the MongoDB Masterclass Team.*
