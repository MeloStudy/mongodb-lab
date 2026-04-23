const { MongoClient } = require('mongodb');

/**
 * LAB-008: Deleting Data & Tooling
 * 
 * This test suite validates the destruction of structural components 
 * (DDL operations) such as collections and databases.
 */
describe('Scenario 2: Collection & Database Destruction (DDL)', () => {
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

  test('Should have dropped the "factory" collection completely', async () => {
    // VALIDATION: We list collections with a specific filter.
    // If the collection was dropped using db.factory.drop(), it should not appear here.
    const collections = await db.listCollections({ name: 'factory' }).toArray();
    
    // If this test runs but the DB was dropped, it will also be empty, which is fine 
    // but the specific drop collection command is what we want to verify.
    expect(collections.length).toBe(0);
  });

  test('Should have dropped the "lab_db" database completely', async () => {
    // VALIDATION: listDatabases() returns metadata about all databases in the cluster.
    // After db.dropDatabase(), "lab_db" should no longer be present in the metadata.
    const dbs = await client.db().admin().listDatabases();
    const labDbExists = dbs.databases.some(d => d.name === 'lab_db');
    
    expect(labDbExists).toBe(false);
  });
});
