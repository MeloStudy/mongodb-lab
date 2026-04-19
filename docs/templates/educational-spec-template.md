# Lab Specification: [LAB NAME]

**Feature Branch**: `[###-lab-name]`
**Created**: [DATE]
**Status**: Draft
**Syllabus Section**: [e.g., The Core Database / Complete CRUD Operations / Schema Design / Performance & Indices / The Aggregation Framework / Security & Administration / Enterprise Integration]

## Syllabus Alignment *(mandatory)*

- **Concept**: [What concept from the syllabus is being taught here?]
- **Prerequisites**: [What other labs/concepts must be completed before this one?]
- **Learning Objectives**:
  - LO-001: [Objective 1]
  - LO-002: [Objective 2]

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - [Brief Title] (Priority: P1)

[Describe the interactive lab exercise for this scenario]

**Validation (Automated Test)**: [How will the system automatically verify the learner completed this correctly? e.g., "Jest test connecting to mongodb://localhost:27017 and finding the newly inserted document"]

**Acceptance Scenarios**:

1. **Given** [initial DB state], **When** [learner performs query/action], **Then** [system reflects success via test]

---

### Scenario 2 - [Brief Title] (Priority: P2)

[Describe the interactive lab exercise for this scenario]

**Validation (Automated Test)**: [Describe the Validation test (e.g. Node.js Jest or Java JUnit)]

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: [Concept 1, e.g., "JSON versus BSON structural differences"]
- **EX-002**: [Concept 2, e.g., "The MongoDB Aggregation Pipeline paradigm"]

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step. Bash scripts as wrappers are PROHIBITED.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest by default, or Java/JUnit for enterprise modules).
- **TR-004**: Lab README MUST provide a "Command Dissection" for any new command or flag introduced, including complex query structures.
- **TR-005**: All testing scripts (`.js` or `.java`) MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands (e.g. `docker-compose down -v --remove-orphans`).
- **TR-008**: An optional Makefile MAY be provided strictly as an automated shortcut container.

## Success Criteria *(measurable outcomes)*

- **SC-001**: [e.g., Learner successfully manipulates their local MongoDB database via queries]
- **SC-002**: [e.g., All validation tests pass upon completion]

## Assumptions

- [e.g., Learner understands basic JavaScript syntax or basic database principles]
- [e.g., Docker Desktop and Node.js v20+ are installed]

