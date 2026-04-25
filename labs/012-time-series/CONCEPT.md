# CONCEPT: Time-Series & High-Density Modeling

## The Evolution of Time-Series in MongoDB

Traditionally, storing high-frequency data (like sensor readings or stock prices) in a document database required manual "bucketing" to avoid overhead. A standard collection creates a separate document for every data point, leading to:
- **Massive Storage Overhead**: Redundant metadata (field names, indices) for every single point.
- **Index Bloat**: Large indices that slow down writes and reads.

### Native Time-Series Collections (MongoDB 5.0+)

MongoDB now handles this optimization natively. When you create a collection with the `timeseries` option, MongoDB physically stores data in an optimized, columnar-like format.

#### Key Components:

1.  **timeField**: The mandatory field that contains the date/time of the reading.
2.  **metaField**: An optional but HIGHLY RECOMMENDED field for metadata that identifies the series (e.g., `sensor_id`, `station_name`). Data points with the same `metaField` value are bucketed together.
3.  **granularity**: Controls how frequently buckets are closed.
    -   `seconds`: High frequency (default).
    -   `minutes`: Medium frequency.
    -   `hours`: Low frequency.

---

## Comparison Summary

| Feature | Standard Collection | Time-Series Collection |
| :--- | :--- | :--- |
| **Storage Layout** | Document-per-point (BSON) | Columnar Buckets (Compressed) |
| **Index Efficiency** | High overhead / Bloat | Low overhead / Dense |
| **Use Case** | General Purpose | IoT, Metrics, Financial Logs |
| **Query Strength** | Random access / Point queries | Range scans & Windowed Analytics |
| **Performance** | O(N) where N is points | O(B) where B is buckets (much smaller) |

---

### The Bucket Pattern

Behind the scenes, MongoDB uses the **Bucket Pattern**. Instead of thousands of small documents, it creates large documents that hold multiple measurements in an array. 
- **Standard**: 1 Reading = 1 Document.
- **Time-Series**: 100s of Readings = 1 "Bucket" Document.

You can see the underlying storage efficiency by checking `db.collection.stats()`.

### Analyzing Time-Series Data

The Aggregation Framework is the primary tool for time-series analysis. To solve the exercises in this lab, you must master these operators:

-   **`$match`**: Filters the high-density stream. Querying on the `metaField` is extremely fast because MongoDB can identify specific buckets immediately.
-   **`$dateTrunc`**: Truncates a date to a specific unit (year, month, day, hour, etc.). It's the "secret sauce" for windowed grouping without complex math.
-   **`$group`**: Used to calculate accumulators (like **`$avg`**, `$max`, `$min`) over the truncated time windows.
-   **`$sort`**: Essential for time-series where order matters. Sorting by the `timeField` is highly optimized due to the internal storage order.
-   **Window Functions (`$setWindowFields`)**: Allows calculations across a moving window (e.g., 24-hour rolling average). *Note: We focus on basic grouping in this lab.*

---

## Deep Dive: Granularity & Bucket Mechanics

The `granularity` setting is not just a hint; it's a physical storage directive. It tells MongoDB how long to keep a bucket "open" before sealing it and starting a new one:

-   **`seconds`**: Optimized for data arriving every few seconds. Buckets typically span **1 hour** of data.
-   **`minutes`**: Optimized for data arriving every minute. Buckets typically span **24 hours**.
-   **`hours`**: Optimized for data arriving hourly or daily. Buckets can span up to **30 days**.

**Why it matters**: If you set `granularity: "hours"` but insert data every second, you'll end up with massive, unmanageable buckets. If you set `granularity: "seconds"` for daily data, you'll have too many small buckets, defeating the purpose of compression.

---

## Storage Masterclass: The "Hidden" Collection

When you create a time-series collection called `weather_readings`, MongoDB creates a system-managed collection named `system.buckets.weather_readings`. Understanding its anatomy reveals why it's so fast:

### 1. Anatomy of a Bucket Document
Instead of one document per reading, a bucket looks like this internally:

```json
{
  "_id": ObjectId("..."),
  "control": {
    "version": 1,
    "min": { "timestamp": ISODate("2024-01-01T00:00:00Z") },
    "max": { "timestamp": ISODate("2024-01-01T00:59:59Z") },
    "closed": true
  },
  "meta": { "sensor_id": "STATION_001" },
  "data": {
    "timestamp": { "0": ISODate("..."), "1": ISODate("..."), ... },
    "temp": { "0": 22.5, "1": 22.7, ... }
  }
}
```

### 2. Why Range Queries are Instant
When you run a query like `db.weather_readings.find({ timestamp: { $gt: ISODate("2024-01-01T12:00:00Z") } })`:
1.  MongoDB looks at the `system.buckets` collection.
2.  It checks the **`control.min`** and **`control.max`** fields of each bucket.
3.  If a bucket's entire time range is outside your query, MongoDB **skips it entirely** without even reading its data.
4.  This is called **Block Skipping** (or Metadata-based pruning), and it's why scanning millions of time-series points is significantly faster than a standard collection.
