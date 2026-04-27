# Lab Specification: LAB-019 Advanced Analytics Stages

**Feature Branch**: `019-advanced-analytics-stages`
**Created**: 2026-04-27
**Status**: READY
**Syllabus Section**: The Aggregation Framework

## Syllabus Alignment *(mandatory)*

- **Concept**: Advanced data transformations including joins, recursive queries, categorization, and persistence of results.
- **Prerequisites**: LAB-018: Pipeline Fundamentals, LAB-009: Document Structuring.
- **Learning Objectives**:
  - LO-001: Perform Left Outer Joins between collections using `$lookup`.
  - LO-002: Traverse recursive hierarchical data structures with `$graphLookup`.
  - LO-003: Execute multi-dimensional analysis in a single pass using `$facet`.
  - LO-004: Materialize and update aggregation results into collections using `$out` and `$merge`.
  - LO-005: Execute cross-database joins within the same cluster.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Customer-Orders Join (Priority: P1)

The learner will join a `customers` collection with an `orders` collection to calculate the total spent per customer, including those without orders.

**Validation (Automated Test)**: Jest test verifying that the aggregation result contains a `totalSpent` field and correctly includes customers with empty order arrays.

**Acceptance Scenarios**:
1. **Given** a customer "Alice" with 2 orders and "Bob" with 0 orders, **When** the learner runs the `$lookup` pipeline, **Then** Alice should have a list of orders and Bob should have an empty list.

---

### Scenario 2 - Recursive Org Chart (Priority: P1)

The learner will use `$graphLookup` to find all subordinates of a given manager in a flat `employees` collection where each document has a `reportsTo` field.

**Validation (Automated Test)**: Jest test checking that the recursive search correctly identifies all levels of the hierarchy for a specific employee ID.

---

### Scenario 3 - E-commerce Facets (Priority: P2)

The learner will use `$facet` to generate multiple result sets for a search (e.g., categories count, price ranges, and top-rated products) in a single aggregation pipeline.

**Validation (Automated Test)**: Jest test ensuring the output document contains the three expected facet keys with correct sub-counts.

---

### Scenario 4 - Materializing Results (Priority: P2)

The learner will use `$merge` to upsert the results of a daily sales aggregation into a `sales_report` collection, ensuring that existing reports are updated rather than overwritten.

**Validation (Automated Test)**: Jest test verifying that the `sales_report` collection contains the expected documents after the pipeline execution and that a second run updates the totals correctly.

---

### Scenario 5 - The Global Reference Join (Priority: P2)

The learner will join their local `orders` collection with a `currencies` collection located in a separate `global_metadata` database to calculate order totals in multiple currencies.

**Validation (Automated Test)**: Jest test verifying the pipeline correctly references the `global_metadata.currencies` namespace and returns the converted amounts.

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: The "Sharding Join" limitation: Why `$lookup` cannot join sharded collections (and how to work around it).
- **EX-002**: Recursion depth and `maxDepth` in `$graphLookup`.
- **EX-003**: Pipeline efficiency: Why `$facet` can be expensive and when to use it vs multiple queries.
- **EX-004**: The difference between `$out` (replacement) and `$merge` (incremental update/upsert).

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `$lookup`, `$graphLookup`, `$facet`, and `$merge`.
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly implements a join that handles missing matches.
- **SC-002**: Learner successfully navigates a 3-level deep hierarchy.
- **SC-003**: Learner produces a faceted output with at least 2 distinct analytics buckets.
- **SC-004**: Learner demonstrates incremental data updates using `$merge`.

## Assumptions

- Learner is familiar with the Aggregation Pipeline fundamentals (`$match`, `$group`, `$project`).
- Docker Desktop and Node.js are installed.
