# Lab Specification: LAB-012 Time-Series & High-Density Modeling

**Feature Branch**: `012-time-series`
**Created**: 2026-04-25
**Status**: AUDITED
**Syllabus Section**: Schema Design & Relationships

## Syllabus Alignment *(mandatory)*

- **Concept**: Native Time-Series Collections, Bucket Pattern, and Granularity control.
- **Prerequisites**: LAB-001 through LAB-011 (Aggregation basics from LAB-011 are helpful).
- **Learning Objectives**:
  - LO-001: Create a **Native Time-Series Collection** using the appropriate `timeseries` options.
  - LO-002: Understand the role of `timeField`, `metaField`, and `granularity` in time-series optimization.
  - LO-003: Perform high-density data ingestion and analyze it using **Windowed Aggregations** or `$dateTrunc`.
  - LO-004: Inspect collection metadata and stats to verify storage efficiency and bucketing behavior.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - Weather Station Network: "The Foundation" (Priority: P1)

The learner acts as a Data Engineer for a weather station network. They need to create a collection that efficiently stores temperature and humidity readings from thousands of sensors. They must decide on the correct granularity based on the frequency of the incoming data (every 10 seconds).

**Validation (Automated Test)**: A Jest test will:
1. Verify that the collection `weather_readings` exists.
2. Check `db.getCollectionInfos()` to ensure `type: "timeseries"` is present.
3. Validate that `timeField: "timestamp"` and `metaField: "metadata"` (or similar) are correctly configured.
4. Ensure `granularity: "seconds"` is applied.

**Acceptance Scenarios**:
1. **Given** a new weather project, **When** the collection is created with TS options, **Then** MongoDB must handle it as a native time-series collection.
2. **Given** incorrect TS options (e.g., missing timeField), **When** created, **Then** the system must return an error.

---

### Scenario 2 - Predictive Maintenance: "Aggregating the Noise" (Priority: P1)

The station receives thousands of data points. To make sense of it, the learner must implement an aggregation pipeline that "buckets" the data into hourly averages for a specific station.

**Validation (Automated Test)**: A Jest test will:
1. Seed the collection with a high volume of data points spread across multiple hours.
2. Execute the student's aggregation script (`exercises/hourly_averages.js`).
3. Verify that the output contains the correct average values grouped by hour and station ID.
4. Ensure the query uses `$dateTrunc` or `$group` with time-based logic.

**Acceptance Scenarios**:
1. **Given** a dense dataset, **When** the hourly average script is run, **Then** it must produce exactly one document per hour per station.
2. **Given** the aggregation pipeline, **When** executed, **Then** it must utilize the TS collection's optimizations for better performance.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **Native Time-Series Collections**: Why standard collections fail at scale for time-series data.
- **EX-002**: **The Meta-Field vs Time-Field**: How to group related data points to improve compression.
- **EX-003**: **Granularity & Bucketing**: How `seconds`, `minutes`, and `hours` affect how MongoDB physically stores data.
- **EX-004**: **Windowed Aggregations**: Introduction to `$dateTrunc` and its power in time-series analysis.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab MUST include a `seed.js` that simulates high-frequency sensor data.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab MUST provide a "Command Dissection" for `createCollection` with `timeseries` options.
- **TR-005**: Theoretical context MUST be provided in a `CONCEPT.md` file.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly configures a native time-series collection.
- **SC-002**: Learner successfully implements a windowed aggregation query.
- **SC-003**: Learner understands how to inspect TS-specific stats.

## Assumptions

- Learner understands basic document insertion and querying.
- Learner has basic knowledge of JSON/BSON types (Date objects).
