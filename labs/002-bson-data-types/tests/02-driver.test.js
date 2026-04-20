const { MongoClient, Decimal128 } = require('mongodb');
const { execSync } = require('child_process');
const path = require('path');

describe('Scenario 2: Node.js BSON Driver Classes', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('bson_db');
  });

  afterAll(async () => {
    const collection = db.collection('invoices');
    await collection.deleteMany({}); // Delete all lab additions for idempotency
    await client.close();
  });

  test('SC002: Should execute driver.js and successfully encode Javascript Driver Classes into the DB', async () => {
    const driverPath = path.join(__dirname, '..', 'driver.js');
    try {
      execSync(`node ${driverPath}`);
    } catch (error) {
      throw new Error(`Failed to execute driver.js. Ensure your script runs without throwing errors. Details: ${error.message}`);
    }

    const collection = db.collection('invoices');
    
    // We query again explicitly specifying BSON bounds to guarantee transmission integrity
    const document = await collection.findOne({
      source: "Driver",
      price: { $type: "decimal" },
      sizeInBytes: { $type: "int" },
      internalFile: { $type: "binData" }
    });
    
    expect(document).toBeDefined();
    expect(document).not.toBeNull();
    // Prove it came back out of the DB as a Decimal128 wrapper instance in JS, not a float primitive
    expect(document.price instanceof Decimal128).toBe(true);
    expect(document.price.toString()).toBe("100.99");
  });
});
