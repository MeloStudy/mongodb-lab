const { MongoClient } = require('mongodb');

describe('Scenario 1: 1:1 Embedding (Preferences)', () => {
  let client;
  let db;

  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lab_db');
  });

  afterAll(async () => {
    await client.close();
  });

  test('User documents should have an embedded metadata.preferences object', async () => {
    const users = await db.collection('users').find({}).toArray();
    
    users.forEach(user => {
      // LO-001: Verify that preferences are now embedded under metadata
      expect(user.metadata).toBeDefined();
      expect(user.metadata.preferences).toBeDefined();
      expect(typeof user.metadata.preferences).toBe('object');
      
      // Verify specific expected fields from the seeding script
      expect(user.metadata.preferences.theme).toBeDefined();
      expect(user.metadata.preferences.language).toBeDefined();
    });
  });

  test('The standalone preferences collection should be dropped', async () => {
    const collections = await db.listCollections({ name: 'preferences' }).toArray();
    // TR-007: Verify cleanup of old relational collections
    expect(collections.length).toBe(0);
  });
});
