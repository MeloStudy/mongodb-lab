const { MongoClient } = require('mongodb');

describe('LAB-006: Array Mutation Operators ($push, $addToSet, $pull)', () => {
  let client;
  let collection;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    collection = client.db('smart_home_test').collection('devices_array');

    await collection.deleteMany({});
    await collection.insertOne({ 
      id: "bulb-01", 
      tags: ["living-room"],
      logs: []
    });
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC004: Should add elements with $push', async () => {
    await collection.updateOne(
      { id: "bulb-01" }, 
      { $push: { logs: { event: "on", ts: "2026-04-20" } } }
    );
    const doc = await collection.findOne({ id: "bulb-01" });
    expect(doc.logs.length).toBe(1);
    expect(doc.logs[0].event).toBe("on");
  });

  test('SC005: Should add unique elements with $addToSet', async () => {
    // Add "automated" twice
    await collection.updateOne({ id: "bulb-01" }, { $addToSet: { tags: "automated" } });
    await collection.updateOne({ id: "bulb-01" }, { $addToSet: { tags: "automated" } });
    
    const doc = await collection.findOne({ id: "bulb-01" });
    const count = doc.tags.filter(t => t === "automated").length;
    expect(count).toBe(1);
  });

  test('SC006: Should remove elements with $pull', async () => {
    await collection.updateOne({ id: "bulb-01" }, { $pull: { tags: "living-room" } });
    const doc = await collection.findOne({ id: "bulb-01" });
    expect(doc.tags).not.toContain("living-room");
  });
});
