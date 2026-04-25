const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('Scenario 1: Time-Series Collection Setup', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    db = client.db('lab_db');
    // Ensure clean state
    try {
      await db.collection('weather_readings').drop();
    } catch (e) {
      // Ignore if doesn't exist
    }
  });

  afterAll(async () => {
    if (client) await client.close();
  });

  test('should create weather_readings via the student script', async () => {
    const scriptPath = path.join(__dirname, '../exercises/create_ts_collection.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    const context = {
      db: {
        createCollection: (name, options) => db.createCollection(name, options)
      }
    };
    vm.createContext(context);

    // Execute the script and await the result (the promise from createCollection)
    await vm.runInNewContext(scriptContent, context);

    // Validate with MongoDB
    const collections = await db.listCollections({ name: 'weather_readings' }).toArray();
    
    expect(collections.length).toBe(1);
    const info = collections[0];
    
    expect(info.type).toBe('timeseries');
    expect(info.options.timeseries.timeField).toBe('timestamp');
    expect(info.options.timeseries.metaField).toBe('metadata');
    expect(info.options.timeseries.granularity).toBe('seconds');
  });
});
