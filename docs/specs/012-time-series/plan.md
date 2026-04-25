# Implementation Plan: LAB-012 Time-Series & High-Density Modeling

## Phase 1: Environment & Scaffolding

### 1.1 Infrastructure
- Create `labs/012-time-series/docker-compose.yml` with MongoDB 7.0.
- Create `labs/012-time-series/package.json` for Jest tests.

### 1.2 Data Seeding
- Create `labs/012-time-series/init/seed.js`.
- Logic:
  - Insert metadata documents (Sensors).
  - Loop to generate readings (timestamp, value, sensor_id).
  - Use a high enough volume (e.g., 5000+ points) to justify time-series.

## Phase 2: Exercise Development

### 2.1 Exercise 1: Collection Setup
- File: `labs/012-time-series/exercises/create_ts_collection.js`.
- Task: Use `db.createCollection()` with `timeseries` options.

### 2.2 Exercise 2: Analytics Query
- File: `labs/012-time-series/exercises/hourly_averages.js`.
- Task: Aggregation pipeline using `$match`, `$group`, and `$dateTrunc`.

## Phase 3: Validation (Tests)

### 3.1 Test 1: Configuration Validation
- Verify `timeseries` options in `weather_readings` collection.
- Check granularity and field names.

### 3.2 Test 2: Data Integrity & Query Accuracy
- Run the aggregation script.
- Compare result counts and average values against a pre-calculated reference.

## Phase 4: Documentation & Polish

### 4.1 CONCEPT.md
- Explanation of Columnar storage (briefly).
- Comparison: Standard vs Time-Series.
- The "Hidden" system buckets collection.

### 4.2 README.md
- Clear instructions on how to run.
- Command dissection for `createCollection`.

### 4.3 SOLUTIONS.md
- Complete code for the exercises.
- Explanations of why specific choices (like granularity) were made.
