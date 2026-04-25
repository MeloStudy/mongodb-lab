const { MongoClient } = require('mongodb');

async function reseed() {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const db = client.db('lab_db');

  // 1. Reset Metadata
  await db.collection('sensors').deleteMany({});
  await db.collection('sensors').insertMany([
    { sensor_id: "STATION_001", type: "temperature", unit: "celsius", location: "London" },
    { sensor_id: "STATION_002", type: "temperature", unit: "celsius", location: "Paris" }
  ]);

  // 2. Clear readings (but don't drop if we want to preserve TS settings)
  // Actually, for the setup test, we might want to DROP it first so the student's script can create it.
  // But for the analytics test, we want it to EXIST and have data.
  
  // Let's create a helper to generate data
  const generateData = (sensorId, startHour, count) => {
    const data = [];
    let currentTime = new Date(startHour);
    for (let i = 0; i < count; i++) {
      data.push({
        timestamp: new Date(currentTime),
        metadata: { sensor_id: sensorId },
        temp: 20 + Math.random() * 5
      });
      // Increment by 10 seconds
      currentTime.setSeconds(currentTime.getSeconds() + 10);
    }
    return data;
  };

  // Populate data for STATION_001 (approx 2 hours of data)
  const readings = generateData("STATION_001", "2024-01-01T00:00:00Z", 720);
  
  // We only insert if the collection exists (or let it auto-create if not TS yet)
  // The tests will handle the logic of when to call this.
  await db.collection('weather_readings').deleteMany({});
  await db.collection('weather_readings').insertMany(readings);

  await client.close();
}

module.exports = reseed;
