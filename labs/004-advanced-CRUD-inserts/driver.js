const { MongoClient } = require('mongodb');

/**
 * LAB-004: Advanced Inserts & Write Concerns
 * 
 * Task: Implement a durable insertion.
 */

async function run() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('crud_db');
    const collection = db.collection('durability_test');

    console.log('--- Scenario 2: Durable Insertion ---');

    // Insert the following document: { type: "durable-write", status: "safe" }
    // Requirement: Ensure the write is acknowledged by the "majority" AND is flushed to the "journal".
    
    const result = await collection.insertOne(
      { type: "durable-write", status: "safe" },
      { 
        writeConcern: { w: "majority", j: true }
      }
    );

    console.log(`Success: ${result.acknowledged}`);
  } catch (err) {
    console.error('Error during insertion:', err);
  } finally {
    await client.close();
  }
}

run();
