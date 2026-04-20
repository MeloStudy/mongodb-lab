# Lab Specification: LAB-005: Advanced Queries & Projections (Expanded)

**Feature Branch**: `005-advanced-queries-projections`
**Status**: Revised
**Syllabus Section**: Complete CRUD Operations

## Syllabus Alignment *(mandatory)*

- **Concept**: Logical Operators (`$and`, `$or`, `$in`), Schema/Element Checks (`$exists`, `$type`), Array Precision (`$all`, `$size`), and Projections.
- **Prerequisites**: LAB-004.
- **Learning Objectives**:
  - LO-001: Query nested arrays using `$elemMatch` to handle independent element conditions.
  - LO-002: Use logical operators to combine multiple search criteria.
  - LO-003: Query by array size and subset presence.
  - LO-004: Detect missing or inconsistent fields using `$exists` and `$type`.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Precision Filter (Trap)
Targeting the common mistake of naive dot-notation on arrays. 
**Validation**: Test passes only if `$elemMatch` is used.

### Scenario 2 - The Auditor (Auditing & Logic)
Find products that match complex business rules:
- Must have "networking" and "security" tags (`$all`).
- Must have exactly 3 tags (`$size`).
- Must have a `warranty_notes` field present (`$exists`).
- Matching either "A" or "B" in warehouses (`$in`).

---

## Educational Requirements *(mandatory)*

### Concepts to Explain
- **EX-001**: Difference between `$in` (any of these) and `$all` (all of these).
- **EX-002**: The `$size` limitation (only exact matches, no ranges).
- **EX-003**: Projection inclusion vs exclusion rules (cannot mix except for `_id`).

### Success Criteria
- **SC-001**: Learner differentiates between array-level and element-level matching.
- **SC-002**: Learner successfully audits a collection for specific field existence.
