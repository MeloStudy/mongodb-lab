const { MongoClient } = require('mongodb');

describe('Scenario 1: Interactive mongosh Validations', () => {
  let client;
  let db;

  // Setup: Connect to the database before tests run
  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('lab_db');
  });

  // Teardown: Close the connection
  afterAll(async () => {
    await client.close();
  });

  test('SC001: Should find the CLI inserted document in the greetings collection', async () => {
    // 1. Target the collection the learner was instructed to use
    const collection = db.collection('greetings');
    
    // 2. Query for the exact message they were supposed to insert via mongosh
    const document = await collection.findOne({ msg: "Hello from CLI" });
    
    // 3. Assert the document exists
    expect(document).toBeDefined();
    expect(document).not.toBeNull();
    expect(document.msg).toBe("Hello from CLI");
  });
});
