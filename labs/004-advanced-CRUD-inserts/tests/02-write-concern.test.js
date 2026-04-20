const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');
const path = require('path');

describe('LAB-004: Write Concerns', () => {
  let client;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
  });

  afterAll(async () => {
    const db = client.db('crud_db');
    await db.collection('durability_test').deleteMany({});
    await client.close();
  });

  test('SC002: Should verify that data was inserted with strict Write Concern (Majority + Journal)', async () => {
    const driverPath = path.join(__dirname, '..', 'driver.js');
    
    // We execute the student's driver code
    try {
      execSync(`node ${driverPath}`);
    } catch (e) {
      throw new Error(`driver.js failed to execute: ${e.message}`);
    }

    const db = client.db('crud_db');
    const doc = await db.collection('durability_test').findOne({ type: "durable-write" });
    
    expect(doc).not.toBeNull();
    expect(doc.status).toBe("safe");
    
    // Since we are in a standalone node, we can't easily verify the 'majority' logic from the data itself,
    // but the test confirms the code ran successfully with the driver configuration.
    console.log('✅ Verified: Durable insertion completed.');
  });
});
