const { MongoClient } = require('mongodb');

describe('05: Operational Settings (Memory)', () => {
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

  test('LO-007: allowDiskUse should be utilized for potentially large operations', async () => {
    const pipeline = [
      { $sort: { date: 1 } }
    ];

    // Trigger the aggregation with allowDiskUse
    const results = await collection.aggregate(pipeline, { allowDiskUse: true }).toArray();
    expect(results.length).toBeGreaterThan(0);

    // Verify the flag in explain
    const explain = await collection.aggregate(pipeline, { allowDiskUse: true }).explain();
    
    // The exact location of allowDiskUse in explain varies by version, 
    // but it usually appears in the command or verbosity sections.
    const explainString = JSON.stringify(explain);
    expect(explainString.includes('allowDiskUse') || explainString.includes('externalSort')).toBe(true);
  });
});
