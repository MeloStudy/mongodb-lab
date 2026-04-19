# LAB-000: Infrastructure Base Setup

## 1. Specification Overview
**Objective**: Establish the repeatable foundational architecture for all MongoDB labs. This setup acts as the template for building `LAB-001` through `LAB-017` in the curriculum.

**Context**: 
To conform to our Constitution's "Reproducible & Clean Environments" and "Robust Validation" rules, we require a template that automatically brings up a fresh instance of MongoDB, runs defined tests in JavaScript (Node.js + Jest), and cleanly destroys the environment afterward. 

## 2. Requirements

### 2.1 Infrastructure (Docker)
- **Engine**: MongoDB Community `7.0` Docker Image.
- **Access**: Container must map `27017` locally.
- **Initialization**: Support an `init.js` seed script mounted inside the container (`/docker-entrypoint-initdb.d/`) to optionally seed datasets upon startup.

### 2.2 Validation Framework (Node.js)
- **Runtime**: Node.js v20+.
- **Language**: JavaScript (CommonJS or ESModules, keeping it close to MongoDB Shell syntax).
- **Core Dependencies**: 
  - `mongodb`: Official Node.js driver to connect and query.
  - `jest`: Test runner framework.
- **Structure**: A dedicated folder for `tests/` mapping directly to the lab exercises.

### 2.3 Orchestration & Idempotency
- **Makefile**: Implement standard targets:
  - `make setup`: Builds/pulls Docker images, starts the container, runs `npm install`.
  - `make test`: Validates connection and core requirements using `npm test`.
  - `make clean`: Tears down DB containers, networks, and removes `node_modules/` ensuring Atomic Cleanup.

## 3. Desired Directory Structure for Labs
Every new lab (e.g. `LAB-XXX-slug`) should follow this exact footprint modeled in LAB-000:
```text
LAB-XXX-slug/
├── docker-compose.yml     # Local DB definition
├── init/
│   └── seed.js            # Initial data to inject (optional)
├── Makefile               # Centralized command hub
├── package.json           # Jest and MongoDB Node Driver dependencies
├── tests/
│   └── validator.test.js  # TDD validation
├── CONCEPT.md             # Theoretical explanations
├── README.md              # Practical steps
└── setup.sh / reset.sh    # Optional lower-level scripts wrapped by Make
```
