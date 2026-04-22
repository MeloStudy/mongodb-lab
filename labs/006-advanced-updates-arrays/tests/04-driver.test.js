const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');
const path = require('path');

describe('LAB-006: Driver Validation', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('smart_home_test');

    // Reset database to initial state
    await db.collection('devices').deleteMany({});
    await db.collection('devices').insertMany([
      { 
        id: "thermostat-01", 
        type: "hvac",
        metadata: { model: "T-1000", voltage: 5, consumption: 1.2 },
        reboots: 10,
        tags: ["home-office"],
        components: [
          { id: "temp-sensor", active: true, calibrated: false },
          { id: "wifi-modem", active: true, calibrated: true }
        ],
        logs: []
      },
      { 
        id: "bulb-01", 
        type: "lighting",
        metadata: { model: "L-X", voltage: 110, consumption: 9.5 },
        reboots: 2,
        tags: ["living-room"],
        components: [
          { id: "led-strip", active: false, calibrated: true }
        ],
        logs: []
      }
    ]);

    // Run the driver with the test database environment variable
    const driverPath = path.join(__dirname, '..', 'driver.js');
    execSync(`node ${driverPath}`, { env: { ...process.env, DB_NAME: 'smart_home_test' } });
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC001: Should verify atomic field updates and $unset', async () => {
    const thermostat = await db.collection('devices').findOne({ id: "thermostat-01" });
    expect(thermostat.reboots).toBe(11);
    expect(thermostat.metadata.v_input).toBe(5);
    
    const bulb = await db.collection('devices').findOne({ id: "bulb-01" });
    expect(bulb.reboots).toBeUndefined();
  });

  test('SC002: Should verify array management from driver', async () => {
    const bulb = await db.collection('devices').findOne({ id: "bulb-01" });
    expect(bulb.tags).toContain("automated");
    expect(bulb.logs.length).toBe(1);
    expect(bulb.logs[0].event).toBe("manual_override");
  });

  test('SC003: Should verify surgical updates ($ and arrayFilters)', async () => {
    const thermostat = await db.collection('devices').findOne({ id: "thermostat-01" });
    
    // Check Positional $ (first uncalibrated should be active: false)
    const sensor = thermostat.components.find(c => c.id === "temp-sensor");
    expect(sensor.active).toBe(false);
    expect(sensor.calibrated).toBe(true); // Should be calibrated by arrayFilters task later
  });

  test('SC004: Should verify upsert from driver', async () => {
    const hub = await db.collection('devices').findOne({ id: "hub-01" });
    expect(hub).not.toBeNull();
    expect(hub.type).toBe("gateway");
    expect(hub.status).toBe("ready");
  });
});
