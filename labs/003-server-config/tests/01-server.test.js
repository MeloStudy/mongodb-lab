const { MongoClient } = require('mongodb');

describe('LAB-003: DevOps & Server Config Validation', () => {
  let client;

  beforeAll(async () => {
    // Note: We use the admin database as getCmdLineOpts is an administrative command
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC001: Should verify the server is using a custom dbPath via mongod.conf', async () => {
    const admin = client.db('admin');
    
    // getCmdLineOpts retrieves the configuration used to start the mongod process
    const config = await admin.command({ getCmdLineOpts: 1 });
    
    expect(config.ok).toBe(1);
    
    // We expect the student to have set storage.dbPath to "/data/db"
    // parsed.storage.dbPath is the physical path the daemon is using in memory
    const actualDbPath = config.parsed.storage.dbPath;
    
    expect(actualDbPath).toBe('/data/db');
    console.log(`✅ Verified dbPath: ${actualDbPath}`);
  });

  test('SC002: Should verify log appending is enabled in configuration', async () => {
    const admin = client.db('admin');
    const config = await admin.command({ getCmdLineOpts: 1 });

    // The student should have set systemLog.logAppend: true in the YAML
    expect(config.parsed.systemLog.logAppend).toBe(true);
    expect(config.parsed.systemLog.destination).toBe('file');
  });
});
