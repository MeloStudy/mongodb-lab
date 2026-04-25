const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const reseed = require('./reseed');

describe('Scenario 2: Windowed Aggregation', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    db = client.db('lab_db');

    // Ensure collection exists (as TS)
    try {
      await db.createCollection("weather_readings", {
        timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "seconds"
        }
      });
    } catch (e) {
      // Ignore
    }

    await reseed();
  });

  afterAll(async () => {
    if (client) await client.close();
  });

  test('should calculate hourly averages via the student aggregation script', async () => {
    const scriptPath = path.join(__dirname, '../exercises/hourly_averages.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    const context = {
      db: {
        weather_readings: {
          aggregate: (pipeline) => db.collection('weather_readings').aggregate(pipeline).toArray()
        }
      }
    };
    vm.createContext(context);

    // Execute script
    const results = await vm.runInNewContext(scriptContent, context);

    // Print results for the student
    console.log('\n--- Hourly Averages Results ---');
    console.table(results.map(r => ({
      hour: r._id.toISOString(),
      avgTemp: r.avgTemp.toFixed(2)
    })));
    console.log('-------------------------------\n');

    // Check results
    expect(results).toBeDefined();
    expect(results.length).toBe(2);

    results.forEach(res => {
      expect(res).toHaveProperty('avgTemp');
    });
    
    // Verify sorting
    const hours = results.map(r => r._id.getTime());
    expect(hours[1]).toBeGreaterThan(hours[0]);
  });
});
