const { MongoClient } = require('mongodb');

describe('02: Grouping and Accumulators', () => {
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

  test('LO-003: Aggregating revenue with refunds handled correctly', async () => {
    const pipeline = [
      {
        $group: {
          _id: '$category',
          totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgQuantity: { $avg: '$quantity' },
          count: { $sum: 1 }
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(res => {
      expect(res.totalRevenue).toBeDefined();
      // LO-010: Ensure Decimal128 type is preserved during sum
      // In Node driver, this is an object with _bsontype: 'Decimal128'
      expect(res.totalRevenue._bsontype).toBe('Decimal128');
      
      expect(res.avgQuantity).toBeDefined();
      expect(res.count).toBeDefined();
    });
  });
});
