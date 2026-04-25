/**
 * TASK: Calculate the hourly average temperature for 'STATION_001'.
 * 
 * Your task is to write the full db.weather_readings.aggregate command.
 * 
 * Requirements:
 * 1. Filter by metadata.sensor_id: "STATION_001"
 * 2. Group by hour using $dateTrunc (or similar)
 * 3. Calculate the average of 'temp' (temperature) field as 'avgTemp'.
 * 4. Sort results by time ascending.
 * 
 * Documentation: https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateTrunc/
 */

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
