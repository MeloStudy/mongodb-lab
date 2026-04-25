const { MongoClient } = require('mongodb');
const migrateUser = require('../exercises/lazy_migration');
const reseed = require('./reseed');

describe('LAB-011: Lazy Migration Validation', () => {
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

  test('Should transform a Legacy (V1) document to V2 using student exercise', async () => {
    // 1. Prepare a mock legacy user
    const legacyUser = { 
      _id: "test_id", 
      name: "Alice Van Wonderland", 
      email: "alice@example.com" 
    };

    // 2. Execute Student's Logic
    const updated = migrateUser({ ...legacyUser });

    // 3. Verify Logic
    expect(updated.schema_version).toBe(2);
    expect(updated.first_name).toBe("Alice");
    expect(updated.last_name).toBe("Van Wonderland");
    expect(updated.name).toBeUndefined();
  });
});
