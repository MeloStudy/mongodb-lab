# Lab Specification: LAB-018 Pipeline Fundamentals

**Feature Branch**: `018-pipeline-fundamentals`
**Created**: 2026-04-27
**Status**: READY
**Syllabus Section**: The Aggregation Framework

## Syllabus Alignment *(mandatory)*

- **Concept**: Introduction to the Aggregation Pipeline paradigm: filtering, grouping, and transforming documents in sequential stages.
- **Prerequisites**: LAB-005: Advanced Queries & Projections.
- **Learning Objectives**:
  - LO-001: Understand the "Pipeline" concept where the output of one stage is the input of the next.
  - LO-002: Efficiently filter and shape data using `$match` and `$project`.
  - LO-003: Aggregate data and use accumulators (`$sum`, `$avg`) with `$group`.
  - LO-004: Deconstruct array fields for individual processing using `$unwind`.
  - LO-005: Add computed fields and control result sets with `$addFields`, `$sort`, and `$limit`.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Precision Filter (Priority: P1)

The learner will filter a `sales` collection for specific categories and project only necessary fields, including a renamed field.

**Validation (Automated Test)**: Jest test verifying the aggregation result only contains documents from the target category and that the renamed field exists.

---

### Scenario 2 - Total Revenue Analytics (Priority: P1)

The learner will calculate the total revenue and average quantity per product using `$group`.

**Validation (Automated Test)**: Jest test checking that the result set contains one document per product with the correct mathematical totals.

---

### Scenario 3 - Array Deconstruction (Priority: P2)

The learner will take documents with a `tags` array and use `$unwind` to produce one document per tag, followed by a count of products per tag.

**Validation (Automated Test)**: Jest test ensuring the output reflects the flattened structure and correct counts per unique tag.

---

### Scenario 4 - Top Performers Report (Priority: P2)

The learner will calculate a `totalValue` field ($addFields: price * quantity), sort by it descending, and limit to the top 5 results.

**Validation (Automated Test)**: Jest test verifying the presence of the calculated field and that the results are strictly sorted and limited to 5.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: The "Sequence Matters" rule: Why `$match` should almost always be the first stage.
- **EX-002**: Accumulator operators in `$group`.
- **EX-003**: The memory footprint of `$unwind` on large arrays.
- **EX-004**: `$project` vs `$addFields`: When to use which for better readability and performance.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose**.
- **TR-002**: Lab README MUST provide native orchestration commands.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for each stage.
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly orders stages to optimize performance.
- **SC-002**: Learner successfully calculates complex aggregates.
- **SC-003**: Learner demonstrates mastery of array processing within the pipeline.

## Assumptions

- Learner understands basic find queries and document structure.
