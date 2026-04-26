const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const DB_NAME = 'lab_db';
const COLLECTION_NAME = 'users';

describe('Scenario 2: Permissive Validation (Warn)', () => {
  let db;
  let collection;

  beforeAll(async () => {
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
  });

  afterAll(async () => {
    await client.close();
  });

  test('T005.1: Should verify validationAction is set to "warn"', async () => {
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
    const options = collections[0].options;
    
    // The learner must have executed collMod to change this from 'error' to 'warn'
    expect(options).toHaveProperty('validationAction', 'warn');
  });

  test('T005.2: Should allow insertion of an invalid document when action is "warn"', async () => {
    const invalidDoc = {
      username: 'rulebreaker',
      // Explicitly missing required fields: email, age, balance
    };

    // This should NOT throw an error 121 now
    const result = await collection.insertOne(invalidDoc);
    expect(result.acknowledged).toBe(true);
    
    // Verify it was actually inserted despite failing validation
    const inserted = await collection.findOne({ username: 'rulebreaker' });
    expect(inserted).not.toBeNull();
  });
});
