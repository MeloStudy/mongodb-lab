const { MongoClient } = require('mongodb');

describe('Scenario 2: 1:N Embedding (One-to-Few Addresses)', () => {
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

  test('User documents should have an embedded addresses array', async () => {
    const users = await db.collection('users').find({}).toArray();
    
    users.forEach(user => {
      // LO-002: Verify that addresses is an array of documents
      expect(Array.isArray(user.addresses)).toBe(true);
      expect(user.addresses.length).toBeGreaterThan(0);
      
      // Verify structure of first address
      const addr = user.addresses[0];
      expect(addr.street).toBeDefined();
      expect(addr.city).toBeDefined();
      
      // Verify usage of NumberInt (BSON Int32) for zip_code
      expect(typeof addr.zip_code).toBe('number');
    });
  });

  test('The standalone addresses collection should be dropped', async () => {
    const collections = await db.listCollections({ name: 'addresses' }).toArray();
    expect(collections.length).toBe(0);
  });
});
