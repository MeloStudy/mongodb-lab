# MongoDB Lab Constitution

## Core Principles

### I. Developer-First with Operations Context
The laboratory is designed primarily for Backend Developers and Software Engineers. The curriculum focuses heavily on Data Modeling, the Aggregation Framework, and Application Integration (CRUD, Transactions). However, a holistic engineer must understand the infrastructure they use. Therefore, each major module MUST conclude with an "Operations & DBA" lab that explores the administrative, scaling, or performance implications of the concepts just learned.

### II. JavaScript as the Lingua Franca, Java for the Enterprise
Since MongoDB natively parses and executes JavaSript (via `mongosh` and BSON structures), the primary language for writing automated tests across the general labs will be **JavaScript (Node.js with `Jest`)**. This reduces context-switching when writing NoSQL queries. 
To serve real-world enterprise needs, the curriculum MUST include a dedicated "Application Integration" module entirely focused on **Java (Spring Data MongoDB or MongoSync Java Driver)**.

### III. Reproducible & Clean Environments
All core laboratory environments MUST be local, containerized, and portable using **Docker / Docker Compose**. A student should be able to spin up any lab environment with minimal host dependencies. Any lab completion or reset must leave no dangling containers or volumes.

### IV. Educational Clarity & Theoretical Foundation
Every lab MUST be self-explanatory and conceptually grounded. Documenting the "how" (commands/code) is insufficient. Each lab must explain the "why" and the underlying NoSQL paradigm. Theory MUST be separated into its own `CONCEPT.md` file to keep the practical README focused and clean. **Theoretical explanations MUST be technically rigorous, exploring internal database mechanics (e.g., data structures, memory implications, computational complexity) to ensure students achieve a deep engineering understanding, rather than just superficial definitions.**

### V. Robust Validation (TDD for Learning)
Each laboratory MUST include solid automated tests to verify the learner's progress and the lab's integrity. These tests serve as the validation gate passing criteria.

## Lab Design Standards

- **Spec Planning**: The mandatory initial phase of any laboratory development. It involves the generation of three base artifacts: `spec.md` (educational requirements), `plan.md` (implementation strategy), and `tasks.md` (step-by-step execution tracker). No implementation work should begin before these artifacts are reviewed and stored in the `/docs/specs/XXX-slug/` directory. **IMPORTANT**: All "Open Questions" in the `plan.md` MUST be resolved and marked as "Decided" before moving to the implementation phase.
- **Naming Convention**: All labs must follow the `XXX-slug-name` format (e.g., `001-crud-basics`).
- **Setup & Cleanup Native Execution**: Scripts like `setup.sh` and `reset.sh` are **PROHIBITED** to prevent "magic button" abstraction. The lab's `README.md` MUST explicitly guide the user to execute the underlying native tools (e.g., `docker-compose up -d`, `npm test`) so they learn the technology actively.
- **Monorepo Architecture**: Node.js and Java libraries are managed centrally at the repository root (e.g., via NPM Workspaces). Individual labs should act as sub-modules to prevent dependency bloat.
- **Data Seeding**: When a lab requires pre-existing data for querying (e.g., Aggregations), provide explicit native commands to mount init scripts or import datasets.
- **Command Dissection**: Every README must include a mapping of CLI flags and arguments for new tools introduced. Complex flags (like `--format` templates or nested query options) MUST be dissected.
- **Theoretical Foundation**: Every lab folder MUST contain a `CONCEPT.md` file explaining the core technical concepts.
- **Conceptual Gap Audit**: Before delivery, the `CONCEPT.md` MUST be audited to ensure no "orphan concepts" exist (e.g., using an operator in the README that wasn't explained in the theory). If a gap is found, a "Crash Course" section must be added.
- **Code Documentation**: All testing scripts (`.js` or `.java`) MUST include comments explaining what each step validates.
- **Makefile Standard (Optional)**: Makefiles are strictly intended as **optional** alternative wrappers holding the raw native commands as shortcuts for CI or advanced users. The lab must function perfectly without `make`.
- **Atomic Cleanup**: Every lab MUST provide instructions in the `README.md` that restore the environment to a "Not Provisioned" state by removing all associated resources (Containers, Volumes, Networks) using native commands. This ensures absolute idempotence.

## Technical Stack & Standards

- **Core Engine**: MongoDB Community Server `7.0+` (via Docker).
- **Tooling**: MongoDB Shell (`mongosh`) and MongoDB Compass (UI).
- **Core Validation Engine**: Node.js `v20+` and `Jest`.
- **Enterprise Validation Engine**: Java `21+` and `JUnit 5`.
- **Language**: All generated content (Labs, Documentation, Specs, Comments) MUST be in **English**.

## Agent Boundaries

### Always Do
- Perform **Spec Planning** (generation of `spec.md`, `plan.md`, and `tasks.md`) before implementing a new lab.
- Perform a **Conceptual Gap Audit** on the `CONCEPT.md` and `README.md` before finalizing.
- Update `tasks.md` and the central `syllabus.md` after finalizing a lab's implementation.
- Ensure all labs pass their corresponding validation tests (e.g., `npm test`, `mvn test`) before committing.
- Follow the `XXX-slug` naming convention.
- Clean up specific resources created during lab execution or testing, enforcing the Atomic Cleanup rule.

### Ask First
- Modifying the Core Principles or Curriculum Structure.
- Deleting existing laboratories.
- Introducing external system dependencies not covered by the standard stack.

### Never Do
- Ignore failing validation tests.
- Use global/destructive commands (e.g., `docker system prune`, `docker rm -f $(docker ps -aq)`) that could affect the host system's other containers or images.
- Hardcode sensitive credentials in the source code; always use environment variables or `.env` files.
- Use non-English language in any part of the repository.

## Lab Lifecycle & Statuses

To ensure quality and consistency, every laboratory must progress through the following standardized statuses:

- **`DRAFT`**: Initial specification (`spec.md`) is being drafted. Implementation is not yet planned.
- **`PLANNED`**: Artifacts (`spec.md`, `plan.md`, `tasks.md`) are created but haven't passed the technical audit.
- **`READY`**: Planning is validated. No "Open Questions" remain. Tasks are granular. Ready for coding.
- **`IMPLEMENTED`**: Code, tests, and documentation are complete. Pending final pedagogical audit.
- **`AUDITED`**: Final quality gate passed. No conceptual gaps. Syllabus updated to *Completed*.

## Workflow Automation

The laboratory uses specialized Agent Workflows to automate quality gates and implementation phases. These are invoked via `/` commands:

- **`/lab-init`**: Initiates a new lab by generating the initial `DRAFT` artifacts and folder structure.
- **`/lab-architect`**: Refines and validates planning, moving the lab from `DRAFT`/`PLANNED` to `READY`.
- **`/lab-builder`**: Executes the technical implementation (TDD, coding, and docs) for `READY` labs.
- **`/lab-auditor`**: Performs the final pedagogical gap audit and moves the lab to `AUDITED`.
- **`/lab-governor`**: Manages global changes to the Constitution and ensures cross-lab consistency.
- **`/lab-refiner`**: Retrospectively audits and upgrades an already delivered laboratory to ensure compliance with the latest standards.

### Master Workflows

For efficiency, multiple phases can be combined using macro-workflows:
- **`/lab-master-plan`**: Covers the entire design phase (Init + Architect).
- **`/lab-master-build`**: Covers the entire execution phase (Builder + Auditor).

For a visual guide of the process, refer to `docs/LAB_LIFECYCLE.md`.

## Governance

- **Version Control**: Changes to the curriculum or core principles require a MINOR version bump.
- **Quality Gates**: New labs MUST pass all validation tests and be reviewed for educational clarity before being added to the syllabus.

**Version**: 0.5.2 | **Ratified**: 2026-04-26
