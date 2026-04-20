const { MongoClient } = require('mongodb');

/**
 * LAB-005: Projection Optimization
 * 
 * Task: Retrieve a document while excluding sensitive fields.
 */

async function run() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('crud_db');
    const collection = db.collection('inventory');

    // Seeding a sample document for this exercise
    await collection.updateOne(
      { product: "Advanced Router" },
      { $set: { internal_cost: 450.50, stock_id: "W1-X99" } },
      { upsert: true }
    );

    console.log('--- Scenario 2: Data Projection ---');

    /**
     * Find the document with product "Advanced Router".
     * Requirement: 
     *  1. Exclude the '_id' field.
     *  2. Exclude the 'internal_cost' field.
     *  3. Use findOne() and print the result as JSON.
     */
    const result = await collection.findOne(
      { product: "Advanced Router" },
      { 
        projection: {
          _id: 0, 
          internal_cost: 0
        }
      }
    );

    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error during projection:', err);
  } finally {
    await client.close();
  }
}

run();
