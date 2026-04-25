const { MongoClient } = require('mongodb');
const pipeline = require('../exercises/bulk_migration');
const reseed = require('./reseed');

describe('LAB-011: Bulk Migration Validation', () => {
  let client;
  let db;

  beforeAll(async () => {
    await reseed(); // Ensure freshness for validation
    client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    db = client.db('lab_db');
  });

  afterAll(async () => {
    if (client) await client.close();
  });

  test('Should migrate all V1 documents in users_eager using student pipeline', async () => {
    // 1. Ensure we are working on the isolated collection
    const collection = db.collection('users_eager');
    
    // 2. Execute the Student's Aggregation Pipeline
    await collection.aggregate(pipeline).toArray();

    // 3. Verify total migration in the bulk collection
    const remainingV1 = await collection.countDocuments({ schema_version: { $exists: false } });
    expect(remainingV1).toBe(0);

    // 4. Spot check a migrated doc (John Doe)
    const john = await collection.findOne({ first_name: "John" });
    expect(john.last_name).toBe("Doe");
    expect(john.schema_version).toBe(2);

    // 5. Spot check complex name (Alice Van Wonderland)
    const alice = await collection.findOne({ first_name: "Alice" });
    expect(alice.last_name).toBe("Van Wonderland");
  });
});
