const { MongoClient } = require('mongodb');

describe('04: Reporting ($addFields, $sort, $limit)', () => {
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

  test('LO-005: Top Performers Report generation', async () => {
    const pipeline = [
      {
        $addFields: {
          totalValue: { $multiply: ['$price', '$quantity'] }
        }
      },
      { $sort: { totalValue: -1 } },
      { $limit: 5 }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    
    expect(results.length).toBe(5);
    
    // LO-010: Verify Type Integrity (Decimal128)
    expect(results[0].totalValue._bsontype).toBe('Decimal128');

    // Verify sorting
    for (let i = 0; i < 4; i++) {
      const current = parseFloat(results[i].totalValue.toString());
      const next = parseFloat(results[i+1].totalValue.toString());
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});
