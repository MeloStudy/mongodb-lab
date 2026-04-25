# SOLUTIONS: LAB-012 Time-Series & High-Density Modeling

## Exercise 1: create_ts_collection.js

```javascript
db.createCollection(
  "weather_readings",
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "seconds"
    }
  }
);
```

### Dissection:
- **`timeField`**: The primary axis for time-series data.
- **`metaField`**: Groups readings from the same sensor together for efficient bucketing.
- **`granularity`**: Set to `"seconds"` because readings arrive every 10 seconds.

---

## Exercise 2: hourly_averages.js

```javascript
db.weather_readings.aggregate([
  {
    $match: {
      "metadata.sensor_id": "STATION_001"
    }
  },
  {
    $group: {
      _id: {
        $dateTrunc: {
          date: "$timestamp",
          unit: "hour"
        }
      },
      avgTemp: { $avg: "$temp" }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);
```

### Stage Dissection:
1.  **`$match`**: Filters the stream for the target station using the metaField.
2.  **`$group`**: Uses `$dateTrunc` to align timestamps to the hour and `$avg` for the temperature.
3.  **`$sort`**: Orders the results chronologically.
