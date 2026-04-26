# Laboratory Lifecycle Example

This document illustrates the full journey of a laboratory, from its conception in the Syllabus to its final certification, using the **Agent Workflows**.

## The Scenario
We want to create **LAB-015: Geospatial Data**.

---

### Step 1: Planning (Phase A)
**Command**: ` /lab-master-plan for Lab 015`

1. **`Init`**: The agent reads the Syllabus (LOs: GeoJSON, 2dsphere, $near) and templates. It creates `docs/specs/015-geospatial-data/`.
2. **`Drafting`**: The agent generates a proposal.
   - *Example Scenario*: "Calculate the distance between a user and the nearest coffee shop."
3. **`Architect`**: The agent checks the plan. 
   - *Audit*: "Wait, TR-004 Command Dissection is missing for `$geoWithin`." -> **Agent fixes it automatically.**
4. **Result**: Status changes to **`READY`**.

---

### Step 2: Execution (Phase B)
**Command**: ` /lab-master-build`

1. **`Builder`**:
   - **Scaffold**: Creates `labs/015-geospatial-data/`.
   - **TDD**: Writes `tests/geo.test.js`.
   - **Implementation**: Writes the seeding script with coffee shop coordinates.
   - **Documentation**: Generates `README.md` and `CONCEPT.md` explaining 2D vs 2DSphere.
2. **`Auditor`**:
   - **Gap Check**: "You used `minDistance` in the README but didn't explain it in CONCEPT.md." -> **Agent adds the explanation.**
3. **Result**: Status changes to **`AUDITED`**.

---

### Summary of Status Transitions
```mermaid
graph LR
    S[Syllabus] -->|/lab-init| D[DRAFT]
    D -->|Refinement| P[PLANNED]
    P -->|/lab-architect| R[READY]
    R -->|/lab-builder| I[IMPLEMENTED]
    I -->|/lab-auditor| A[AUDITED]
    A -->|Done| C[Completed in Syllabus]
```

## How to use Master Workflows
If you prefer a hands-off approach, use these two commands:

1. ` /lab-master-plan`: Get the design done and approved.
2. ` /lab-master-build`: Get the code done and certified.
