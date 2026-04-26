const { MongoClient, Decimal128 } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const DB_NAME = 'lab_db';
const COLLECTION_NAME = 'users';

describe('Scenario 1: Strict Schema Enforcement', () => {
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

  test('T004.1: Should verify the "users" collection has a $jsonSchema validator with required fields', async () => {
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
    
    // Ensure collection exists
    expect(collections.length).toBe(1);
    
    const options = collections[0].options;
    
    // Ensure validator is set
    expect(options).toHaveProperty('validator');
    expect(options.validator).toHaveProperty('$jsonSchema');
    
    const schema = options.validator.$jsonSchema;
    // Check for required fields including the newly added 'balance'
    expect(schema.required).toContain('username');
    expect(schema.required).toContain('email');
    expect(schema.required).toContain('age');
    expect(schema.required).toContain('balance');
  });

  test('T004.2: Should reject insertion of a document missing a required field (email)', async () => {
    const invalidDoc = {
      username: 'jdoe',
      age: 30,
      balance: Decimal128.fromString('100.00')
    };

    // Code 121 is DocumentValidationFailure
    await expect(collection.insertOne(invalidDoc))
      .rejects.toThrow(/Document failed validation/);
  });

  test('T004.3: Should reject "balance" if it is a Double (not Decimal128)', async () => {
    const invalidDoc = {
      username: 'jdoe',
      email: 'jdoe@example.com',
      age: 30,
      balance: 100.50 // JS numbers are Doubles by default
    };

    await expect(collection.insertOne(invalidDoc))
      .rejects.toThrow(/Document failed validation/);
  });

  test('T004.4: Should accept a valid document with Decimal128 balance', async () => {
    const validDoc = {
      username: 'jdoe',
      email: 'jdoe@example.com',
      age: 30,
      balance: Decimal128.fromString('100.50')
    };

    const result = await collection.insertOne(validDoc);
    expect(result.acknowledged).toBe(true);
  });
});
