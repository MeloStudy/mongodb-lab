# Lab Specification: 015-geospatial-data

**Feature Branch**: `015-geospatial-data`
**Created**: 2026-04-25
**Status**: AUDITED
**Syllabus Section**: Performance, Indices & Spatial Data

## Syllabus Alignment *(mandatory)*

- **Concept**: Geospatial Data. Modeling locations using GeoJSON and querying proximity/areas using specialized spatial operators and indexes.
- **Prerequisites**: LAB-001 through LAB-005, and LAB-014 (Core Indexing).
- **Learning Objectives**:
  - LO-001: Model geographic locations using the **GeoJSON Point** format.
  - LO-002: Create and use **`2dsphere`** indexes to enable spatial query optimization.
  - LO-003: Find documents based on proximity using the **`$nearSphere`** operator.
  - LO-004: Identify documents within a specific geometric area (Polygon) using **`$geoWithin`**.
  - LO-005: Perform advanced spatial aggregations using the **`$geoNear`** stage to calculate distances.
  - LO-006: Detect overlaps between different geometric shapes (e.g., LineString and Polygon) using **`$geoIntersects`**.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Coffee Hunter (Priority: P1)

The learner will be given a collection of `cafes` with GPS coordinates. They must find the closest cafe to their current "location" (a provided coordinate) using `$nearSphere`.

**Validation (Automated Test)**: Jest test will verify that a `2dsphere` index exists on the `location` field and that the query returns the expected document based on distance calculations.

**Acceptance Scenarios**:
1. **Given** a set of cafes in a 5km radius, **When** the learner queries with `$nearSphere` and `$maxDistance`, **Then** the system returns only the cafes within that range, sorted by proximity.

---

### Scenario 2 - The Delivery Zone (Priority: P2)

The learner will define a "Delivery Zone" using a GeoJSON **Polygon**. They must then query a set of `delivery_requests` to find which ones fall inside the polygon using `$geoWithin`.

**Validation (Automated Test)**: Jest test will verify the query logic and ensure the result set matches only the points physically located inside the defined polygon.

---

### Scenario 3 - The Route Auditor (Priority: P2)

The learner will model a delivery route as a **LineString** and a "Restricted Zone" as a **Polygon**. They must find if the route intersects the zone using `$geoIntersects`.

**Validation (Automated Test)**: Jest test will verify that the intersection logic correctly identifies the overlap between the line and the area.

---

### Scenario 4 - Precise Distance Analytics (Priority: P1)

Using the **`$geoNear`** aggregation stage, the learner will generate a list of nearby stores, including a calculated field `distanceInMeters` for each result.

**Validation (Automated Test)**: Jest test will verify the presence of the calculated distance field in the aggregation output.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **GeoJSON Standard**: Why [longitude, latitude] order is mandatory in MongoDB.
- **EX-002**: **2dsphere vs 2d**: Understanding the difference between spherical geometry (Earth) and flat Euclidean geometry.
- **EX-003**: **Coordinate Precision**: The importance of using correct data types for coordinates.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for `$nearSphere`, `$geoWithin`, and `2dsphere` index creation.
- **TR-005**: All testing scripts (`.js`) MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via native commands.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner successfully finds the nearest point using spatial operators.
- **SC-002**: Learner successfully filters documents based on geometric containment (Polygon).

## Assumptions

- Learner understands basic JSON structures.
- Docker environment is stable.
