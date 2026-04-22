const { MongoClient } = require('mongodb');

describe('LAB-006: Field Operations ($inc, $mul, $set)', () => {
  let client;
  let collection;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    collection = client.db('smart_home_test').collection('devices_field');

    await collection.deleteMany({});
    await collection.insertOne({ 
      id: "thermostat-01", 
      reboots: 10,
      metadata: { consumption: 1.0, voltage: 5 }
    });
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC001: Should perform atomic increment ($inc)', async () => {
    await collection.updateOne({ id: "thermostat-01" }, { $inc: { reboots: 1 } });
    const doc = await collection.findOne({ id: "thermostat-01" });
    expect(doc.reboots).toBe(11);
  });

  test('SC002: Should perform atomic multiplication ($mul)', async () => {
    await collection.updateOne({ id: "thermostat-01" }, { $mul: { "metadata.consumption": 1.1 } });
    const doc = await collection.findOne({ id: "thermostat-01" });
    expect(doc.metadata.consumption).toBeCloseTo(1.1);
  });

  test('SC003: Should combine $set and $rename', async () => {
    // Note: Rename is often a separate task in practice, but we can combine many operators
    await collection.updateOne(
      { id: "thermostat-01" }, 
      { 
        $set: { status: "updated" },
        $rename: { "metadata.voltage": "metadata.v_input" }
      }
    );
    const doc = await collection.findOne({ id: "thermostat-01" });
    expect(doc.status).toBe("updated");
    expect(doc.metadata.v_input).toBe(5);
    expect(doc.metadata.voltage).toBeUndefined();
  });
});
