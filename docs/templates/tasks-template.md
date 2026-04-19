---

description: "Task list template for feature implementation"
---

# Tasks: [LAB NAME]

**Input**: Design documents from `/specs/[###-lab-name]/`
**Prerequisites**: plan.md (required), spec.md (required for scenarios), research.md

**Validation**: This project follows strict Automated Validation. Tests for each scenario MUST be written before or alongside the lab implementation.

## Phase 1: Lab Infrastructure (Shared)

- [ ] T001 Setup lab directory and base container configuration (Docker/Podman)
- [ ] T002 Implement Makefile or document native reset commands to ensure clean state
- [ ] T003 Create validation test framework for the lab

---

## Phase 2: Scenario 1 - [Title] (Priority: P1) 🎯 Core Objective

**Goal**: [What the learner will achieve in this scenario]

### Validation for Scenario 1
- [ ] T004 Implement automated validation test for scenario 1
- [ ] T005 [P] Document expected success state and common failure modes

### Implementation for Scenario 1
- [ ] T006 Create lab environment for scenario 1
- [ ] T007 Write "Self-Explanatory" guide/readme for scenario 1
- [ ] T008 [P] Add interactive hints/feedback scripts

---

## Phase 3: Scenario 2 - [Title] (Priority: P2)

### Validation for Scenario 2
- [ ] T009 Implement automated validation test for scenario 2

### Implementation for Scenario 2
- [ ] T010 Create lab environment for scenario 2
- [ ] T011 Write documentation for scenario 2 concepts
- [ ] T012 Integrate with Scenario 1 (ensure progression)

---

## Phase N: Educational Polish & Final Validation

- [ ] TXXX [P] Review all documentation for "Educational Clarity"
- [ ] TXXX Verify lab reset script works correctly
- [ ] TXXX Perform end-to-end "Learner Journey" walkthrough
- [ ] TXXX [P] Final syllabus alignment check
