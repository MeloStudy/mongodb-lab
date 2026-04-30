const { MongoClient } = require('mongodb');

describe('03: Array Deconstruction ($unwind)', () => {
  let connection;
  let db;
  let collection;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
    collection = db.collection('sales');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-008: Flattening arrays and preserving empty ones', async () => {
    // Total documents in collection
    const totalDocs = await collection.countDocuments();
    
    // Pipeline with preserveNullAndEmptyArrays: true
    const pipelinePreserve = [
      { $unwind: { path: '$tags', preserveNullAndEmptyArrays: true } }
    ];
    const resultsPreserve = await collection.aggregate(pipelinePreserve).toArray();
    
    // Pipeline with default unwind (false)
    const pipelineDefault = [
      { $unwind: '$tags' }
    ];
    const resultsDefault = await collection.aggregate(pipelineDefault).toArray();

    // Verification: The preserve results should include documents that had empty tags arrays.
    // In our seed, every 15th doc has empty tags.
    expect(resultsPreserve.length).toBeGreaterThan(resultsDefault.length);
    
    // Check for a doc with null tags in the results (from an empty array)
    const emptyTagDoc = resultsPreserve.find(doc => doc.tags === undefined || doc.tags === null);
    expect(emptyTagDoc).toBeDefined();
  });
});
