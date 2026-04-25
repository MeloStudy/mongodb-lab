// Seed Sensors Metadata
db.sensors.insertMany([
  { sensor_id: "STATION_001", type: "temperature", unit: "celsius", location: "London" },
  { sensor_id: "STATION_002", type: "temperature", unit: "celsius", location: "Paris" }
]);

print("Seeded sensors metadata.");
