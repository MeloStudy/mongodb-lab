const { MongoClient, ObjectId } = require('mongodb');

describe('Scenario 3: Referencing (One-to-Many Audit Logs)', () => {
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

  test('The audit_logs collection should exist separately', async () => {
    const collections = await db.listCollections({ name: 'audit_logs' }).toArray();
    expect(collections.length).toBe(1);
  });

  test('Audit logs should contain a user_id reference', async () => {
    const log = await db.collection('audit_logs').findOne({});
    
    if (log) {
      // LO-003: Verify that we are using manual referencing
      expect(log.user_id).toBeDefined();
      expect(log.user_id instanceof ObjectId).toBe(true);
    } else {
      console.warn("Manual check: Please insert at least one log to fully pass this validation.");
    }
  });

  test('The users document should NOT contain an audit_logs array', async () => {
    const user = await db.collection('users').findOne({});
    // Educational Goal: Ensuring they didn't embed something that should be referenced
    expect(user.audit_logs).toBeUndefined();
  });
});
