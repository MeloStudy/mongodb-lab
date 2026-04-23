const { MongoClient, UUID, Binary } = require('mongodb');

describe('Scenario 2: UUIDs & Binary Data - Secure Identity', () => {
  let client;
  let db;

  beforeAll(async () => {
    const uri = 'mongodb://localhost:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lab_db');
  });

  afterAll(async () => {
    await client.close();
  });

  test('Should store and query documents using BSON UUIDs', async () => {
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    
    expect(users.length).toBeGreaterThan(0);
    
    // Check if at least one user has a UUID as _id or in a specific field
    const userWithUuid = users.find(u => u.externalId instanceof UUID || u._id instanceof UUID);
    expect(userWithUuid).toBeDefined();
  });

  test('Should store binary blobs correctly', async () => {
    const collection = db.collection('signatures');
    const sig = await collection.findOne({});
    
    expect(sig).toBeDefined();
    expect(sig.data.buffer).toBeDefined();
    expect(sig.data instanceof Binary).toBe(true);
  });
});
