# Lab Specification: [LAB NAME]

**Feature Branch**: `[###-lab-name]`
**Created**: [DATE]
**Status**: Draft
**Syllabus Section**: [e.g., Basics / Advanced Basics / Orchestration / Advanced Orchestration]

## Syllabus Alignment *(mandatory)*

- **Concept**: [What concept from the syllabus is being taught here?]
- **Prerequisites**: [What other labs/concepts must be completed before this one?]
- **Learning Objectives**:
  - LO-001: [Objective 1]
  - LO-002: [Objective 2]

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - [Brief Title] (Priority: P1)

[Describe the interactive lab exercise for this scenario]

**Validation (Automated Test)**: [How will the system automatically verify the learner completed this correctly? e.g., "Check if container 'nginx-lab' is running and bound to port 8080"]

**Acceptance Scenarios**:

1. **Given** [initial lab state], **When** [learner performs action], **Then** [system reflects success via test]

---

### Scenario 2 - [Brief Title] (Priority: P2)

[Describe the interactive lab exercise for this scenario]

**Validation (Automated Test)**: [Describe the validation test]

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: [Concept 1, e.g., "How namespaces isolate processes"]
- **EX-002**: [Concept 2, e.g., "The difference between an image and a container"]

### Technical Requirements

- **TR-001**: Lab MUST be containerized (Docker/Podman).
- **TR-002**: Lab MUST provide a reset script.
- **TR-003**: Lab MUST include automated validation tests.
- **TR-004**: Lab README MUST provide a "Command Dissection" for any new command or flag introduced, including complex templates.
- **TR-005**: All scripts and tests MUST be thoroughly commented to explain their purpose.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file within the lab directory.
- **TR-007**: Lab MUST be "Cleanable" via a `reset.sh` script, returning it to a "Not Provisioned" state.

## Success Criteria *(measurable outcomes)*

- **SC-001**: [e.g., Learner successfully configures a multi-container network]
- **SC-002**: [e.g., All validation tests pass upon completion]

## Assumptions

- [e.g., Learner has basic Linux CLI knowledge]
- [e.g., Docker Desktop or equivalent is installed]

