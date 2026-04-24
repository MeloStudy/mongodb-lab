const { MongoClient } = require('mongodb');

// Connection URL - no auth defined aligning with standard Docker image defaults
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

describe('LAB-000 Base Setup Validation', () => {
  let db;

  beforeAll(async () => {
    // Connect to the MongoDB server
    await client.connect();
    db = client.db('admin'); // 'admin' is a built-in DB that always has ping available
  });

  afterAll(async () => {
    // Cleanly close the connection after tests are done
    await client.close();
  });

  test('Should successfully ping the MongoDB database to confirm connectivity', async () => {
    const pingResult = await db.command({ ping: 1 });
    expect(pingResult).toHaveProperty('ok', 1);
  });

  test('Should verify the MongoDB server version is 7.0+', async () => {
    const buildInfo = await db.command({ buildInfo: 1 });
    const versionStr = buildInfo.version;
    const majorVersion = parseInt(versionStr.split('.')[0], 10);
    
    expect(majorVersion).toBeGreaterThanOrEqual(7);
  });
});
