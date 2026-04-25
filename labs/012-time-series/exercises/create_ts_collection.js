/**
 * TASK: Create a Native Time-Series collection named 'weather_readings'.
 * 
 * Your task is to write the full db.createCollection command.
 * 
 * Requirements:
 * 1. name: "weather_readings"
 * 2. timeField: "timestamp"
 * 3. metaField: "metadata"
 * 4. granularity: "seconds"
 * 
 * Documentation: https://www.mongodb.com/docs/manual/core/timeseries-collections/
 */

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
