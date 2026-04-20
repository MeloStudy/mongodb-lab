const { MongoClient } = require('mongodb');

describe('Scenario 1: BSON Mappings in mongosh', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('bson_db');
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC001: Should find the CLI document heavily encoded with explicit BSON Types', async () => {
    const collection = db.collection('invoices');
    
    // We are deliberately querying the database server to verify how it stored the data.
    // If the learner used a standard number like `{ price: 100.99 }`, it stores as a 'double'.
    // If they correctly used `{ price: NumberDecimal("100.99") }`, it returns as a 'decimal'.
    const document = await collection.findOne({
      source: "CLI",
      price: { $type: "decimal" },       // BSON alias for Decimal128
      sizeInBytes: { $type: "int" },     // BSON alias for Int32
      internalFile: { $type: "binData" } // BSON alias for Binary
    });
    
    expect(document).toBeDefined();
    expect(document).not.toBeNull();
    // Validate value equality over the parsed object wrapper
    expect(document.price.toString()).toBe("100.99");
    expect(document.sizeInBytes).toBe(4096);
  });
});
