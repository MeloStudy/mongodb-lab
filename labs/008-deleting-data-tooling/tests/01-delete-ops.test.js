const { MongoClient, UUID } = require('mongodb');

/**
 * LAB-008: Deleting Data & Tooling
 * 
 * This test suite validates that the student has successfully performed 
 * surgical and bulk deletions (DML operations).
 */
describe('Scenario 1: Surgical & Bulk Deletion (DML)', () => {
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

  test('Should have removed the malfunctioning probe specifically by ID', async () => {
    const collection = db.collection('factory');
    const probeId = new UUID("00000000-0000-4000-a000-000000000001");
    
    // VALIDATION: We attempt to find the document with the specific UUID.
    // If deleteOne() was executed correctly, findOne() should return null.
    const probe = await collection.findOne({ _id: probeId });
    expect(probe).toBeNull();
  });

  test('Should have removed all garbage documents (status: "failed")', async () => {
    const collection = db.collection('factory');
    
    // VALIDATION: We count documents where status is "failed".
    // After deleteMany({ status: "failed" }), this count MUST be zero.
    const corruptedCount = await collection.countDocuments({ status: "failed" });
    expect(corruptedCount).toBe(0);
  });

  test('Should have preserved all healthy documents (status: "active")', async () => {
    const collection = db.collection('factory');
    
    // VALIDATION: It is critical to ensure that our filters were precise.
    // The 3 healthy documents (status: "active") must still exist.
    const healthyCount = await collection.countDocuments({ status: "active" });
    expect(healthyCount).toBe(3);
  });
});
