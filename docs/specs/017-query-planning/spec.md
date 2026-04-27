# Lab Specification: 017-query-planning

**Feature Branch**: `017-query-planning`
**Created**: 2026-04-27
**Status**: AUDITED
**Syllabus Section**: Performance, Indices & Spatial Data

## Syllabus Alignment *(mandatory)*

- **Concept**: DBA Wrap-up: Query Planning. Mastering the internal mechanics of the MongoDB Query Optimizer.
- **Prerequisites**: Module 4 (Core Indexing & ESR Rule).
- **Learning Objectives**:
  - LO-001: Interpret `explain()` output at various verbosity levels (`queryPlanner`, `executionStats`, `allPlansExecution`).
  - LO-002: Differentiate between `winningPlan` and `rejectedPlans` to understand why the optimizer chose a specific path.
  - LO-003: Identify performance bottlenecks like `COLLSCAN`, `FETCH`, and `SORT` stages.
  - LO-004: Force specific index usage via `hint()` and observe the performance impact.
  - LO-005: Understand the **Query Plan Cache** and how to clear it to re-trigger plan selection.
  - LO-006: Implement **Index Filters** to restrict the optimizer's choices for specific query patterns.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - Decoding the Winning Plan (Priority: P1)

The learner will be given a query that could potentially use multiple indexes. They will use `explain("queryPlanner")` to identify the `winningPlan` and analyze why it was chosen over others.

**Validation (Automated Test)**: Jest test will verify that the learner can correctly identify the stage type (e.g., `IXSCAN`) of the winning plan.

---

### Scenario 2 - The Race: Rejected Plans (Priority: P1)

The learner will create two competing indexes for a specific query pattern. They will use `explain("allPlansExecution")` to see how MongoDB "raced" both plans and why one was rejected (e.g., higher `totalDocsExamined`).

**Validation (Automated Test)**: Jest test will verify the existence of at least two indexes that could satisfy the query and check the `explain` output for `rejectedPlans` presence.

---

### Scenario 3 - Manual Override with Hint (Priority: P2)

The learner will observe a case where the optimizer makes a sub-optimal choice (simulated) and manually override it using the `.hint()` operator. They will compare the `executionTimeMillis` between the optimizer's choice and their hint.

**Validation (Automated Test)**: Jest test will verify that a query using `.hint()` is executed and results in a specific index scan.

---

### Scenario 4 - Plan Cache Management (Priority: P2)

The learner will learn how to view and clear the query plan cache using `db.collection.getPlanCache()` and `db.collection.clearPlanCache()`.

**Validation (Automated Test)**: Jest test will verify that the plan cache is cleared during the lab exercise.

---

### Scenario 5 - Restricting Choice: Index Filters (Priority: P3)

The learner will implement an **Index Filter** for a specific query shape. They will verify that even if a better-suited index exists, the optimizer is forced to only consider the indexes specified in the filter.

**Validation (Automated Test)**: Jest test will verify the creation of an index filter using `planCacheSetFilter` and ensure the `winningPlan` respects the filter.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **The Query Optimizer Lifecycle**: How MongoDB selects a plan (Candidate plans -> Trial period -> Winning plan).
- **EX-002**: **Stage Analysis**: What `COLLSCAN`, `IXSCAN`, `FETCH`, `SORT`, and `PROJECTION_COVERED` mean in practical terms.
- **EX-003**: **The Cost of Sorting**: Why `SORT` stages are often the primary cause of query latency.
- **EX-004**: **Plan Cache Persistence**: How long plans stay in cache and what triggers a re-evaluation.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `explain()`, `hint()`, and Plan Cache commands.
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly identifies the `winningPlan` stage for a multi-index query.
- **SC-002**: Learner demonstrates the ability to force an index scan via `hint()`.
- **SC-003**: Learner successfully retrieves and interprets `rejectedPlans` data.

## Assumptions

- Learner has completed LAB-014 (Core Indexing).
- Learner understands basic B-Tree index structures.
