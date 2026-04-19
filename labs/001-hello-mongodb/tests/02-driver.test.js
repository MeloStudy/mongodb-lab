const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');
const path = require('path');

describe('Scenario 2: Node.js Driver Integration Validations', () => {
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
    // Clean up the test additions so it can be re-run cleanly
    const collection = db.collection('greetings');
    await collection.deleteOne({ msg: "Hello from Driver" });
    await client.close();
  });

  test('SC002: Should successfully execute driver.js and find the inserted document', async () => {
    // 1. Execute the learner's driver.js script
    const driverPath = path.join(__dirname, '..', 'driver.js');
    try {
      execSync(`node ${driverPath}`);
    } catch (error) {
      throw new Error(`Failed to execute driver.js. Ensure your script runs without throwing errors. Details: ${error.message}`);
    }

    // 2. Verify the script actually inserted the data into the database
    const collection = db.collection('greetings');
    const document = await collection.findOne({ msg: "Hello from Driver" });
    
    // 3. Assert the document from the driver exists
    expect(document).toBeDefined();
    expect(document).not.toBeNull();
    expect(document.msg).toBe("Hello from Driver");
  });
});
