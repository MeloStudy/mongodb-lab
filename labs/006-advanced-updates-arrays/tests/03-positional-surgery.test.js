const { MongoClient } = require('mongodb');

describe('LAB-006: Positional Surgery ($[], arrayFilters)', () => {
  let client;
  let collection;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    collection = client.db('smart_home_test').collection('devices_surgery');

    await collection.deleteMany({});
    await collection.insertOne({ 
      id: "thermostat-01", 
      components: [
        { id: "temp-sensor", active: false, calibrated: false },
        { id: "wifi-modem", active: false, calibrated: true }
      ]
    });
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC007: Should update all elements with $[]', async () => {
    await collection.updateOne(
      { id: "thermostat-01" }, 
      { $set: { "components.$[].active": true } }
    );
    const doc = await collection.findOne({ id: "thermostat-01" });
    expect(doc.components.every(c => c.active === true)).toBe(true);
  });

  test('SC008: Should perform targeted surgery with arrayFilters', async () => {
    // Specifically target temp-sensor to calibrate it
    await collection.updateOne(
      { id: "thermostat-01" },
      { $set: { "components.$[comp].calibrated": true } },
      { arrayFilters: [ { "comp.id": "temp-sensor" } ] }
    );
    
    const doc = await collection.findOne({ id: "thermostat-01" });
    const sensor = doc.components.find(c => c.id === "temp-sensor");
    expect(sensor.calibrated).toBe(true);
  });
});
