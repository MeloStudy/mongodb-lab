const { MongoClient, Timestamp } = require('mongodb');

describe('Scenario 3: Date vs Timestamp - Temporal Precision', () => {
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

  test('Should differentiate between Date and Timestamp types', async () => {
    const collection = db.collection('events');
    const event = await collection.findOne({ type: 'temporal_test' });
    
    expect(event).toBeDefined();
    
    // Date field
    expect(event.createdAt instanceof Date).toBe(true);
    
    // Timestamp field (simulated or captured from oplog/metadata)
    expect(event.clusterTime instanceof Timestamp).toBe(true);
  });
});
