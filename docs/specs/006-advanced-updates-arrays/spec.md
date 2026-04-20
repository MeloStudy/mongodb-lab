# Lab Specification: LAB-006: Advanced Updates (Atomic Operators & Arrays)

**Feature Branch**: `006-advanced-updates-arrays`
**Status**: Revised (Full Mastery)
**Syllabus Section**: Complete CRUD Operations

## Syllabus Alignment *(mandatory)*

- **Concept**: Atomic Field Operators (`$set`, `$inc`, `$mul`, `$rename`, `$unset`), Array Mutation (`$push`, `$addToSet`, `$pull`), and Positional Surgery (`$[]`, `arrayFilters`).
- **Prerequisites**: LAB-005.
- **Learning Objectives**:
  - LO-001: Perform atomic mathematical updates to avoid race conditions and ensure numeric consistency.
  - LO-002: Manage array membership using idempotent (`$addToSet`) and non-idempotent (`$push`) operators.
  - LO-003: Execute surgical updates on nested array elements using `arrayFilters` and `$[<identifier>]`.
  - LO-004: Apply transformations to all elements in an array simultaneously using `$[]`.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Infrastructure Admin (Field Ops)
The learner manages a set of "Smart Devices". 
- **Task A**: Use `$inc` to update a reboot counter.
- **Task B**: Use `$mul` to adjust power consumption values globally.
- **Task C**: Use `$set` to update a nested object metadata.

---

### Scenario 2 - The Logistics Manager (Array Growth/Shrink)
Managing a "Device History" array.
- **Task A**: Use `$push` to add a new event log.
- **Task B**: Use `$addToSet` to add a tag ensuring no duplicates.
- **Task C**: Use `$pull` to remove a specific error log by its code.

---

### Scenario 3 - The Surgeon (Positional Precision)
Updating complex nested structures.
- **Task A**: Change the status of ALL components to "active" using `$[]`.
- **Task B**: Update ONLY the component with `id: "main-sensor"` to set `calibrated: true` using `arrayFilters`.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain
- **EX-001**: **Atomicity**: Why update operators are safer and faster than a full document replace.
- **EX-002**: **Positional Operators**: The difference between the first-match `$`, the all-match `$[]`, and the filtered-match `$[<identifier>]`.

## Success Criteria
- **SC-001**: Learner correctly differentiates when to use `$push` vs `$addToSet`.
- **SC-002**: Learner successfully performs an update that targets a nested item without knowing its index.
