# LAB-012: Time-Series & High-Density Modeling

Welcome to the Weather Station Network project. In this lab, you will learn how to handle high-frequency data using MongoDB's Native Time-Series collections and perform windowed analytics.

## Scenario

You are the Lead Data Engineer for a global sensor network. Thousands of stations report temperature data every 10 seconds. Using a standard collection would be inefficient for storage and analysis. Your goal is to optimize this ingestion and provide hourly analytics.

## Prerequisites

- MongoDB 7.0+ (via Docker)
- Node.js v20+
- Basic understanding of the Aggregation Framework.

---

## Step 1: Spin up the Environment

Start the MongoDB container:

```bash
docker-compose up -d
```

Verify that the `sensors` metadata collection is seeded:

```bash
mongosh "mongodb://localhost:27017/lab_db" --eval "db.sensors.find()"
```

## Step 2: Create the Time-Series Collection

Edit `exercises/create_ts_collection.js`. Your goal is to write the full `db.createCollection()` command with the correct `timeseries` configuration.

**Command Dissection: `createCollection` for Time-Series**

| Argument | Description |
| :--- | :--- |
| `name` | The name of the collection to create. |
| `options.timeseries` | Object containing TS configuration. |
| `timeField` | The field containing the timestamp (Must be a Date). |
| `metaField` | Field used for grouping (e.g. `metadata`). |
| `granularity` | Bucketing interval (`seconds`, `minutes`, `hours`). |

Run the validation test:

```bash
npm test tests/01-setup.test.js
```

## Step 3: High-Density Analytics

Now that the collection is ready, we need to calculate hourly averages for a specific station.

Edit `exercises/hourly_averages.js`. Your goal is to write the full `db.weather_readings.aggregate()` command using `$match`, `$group` with `$dateTrunc`, and `$sort`.

Run the validation test:

```bash
npm test tests/02-analytics.test.js
```

---

## Educational Summary

- **Native Time-Series**: Reduces storage by up to 90% compared to standard collections for metrics.
- **Granularity**: Selecting the right granularity (`seconds` for 10s intervals) is key to optimal bucketing.
- **$dateTrunc**: A powerful operator for "snapping" timestamps to the nearest hour/day/etc. for grouping.

## Atomic Cleanup

To clean up the environment and remove all data:

```bash
docker-compose down -v --remove-orphans
```
