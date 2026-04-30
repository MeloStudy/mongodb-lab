const { MongoClient } = require('mongodb');

describe('Scenario 1: Customer-Orders Join ($lookup)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-001: Should perform a Left Outer Join between customers and orders', async () => {
    const pipeline = [
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'customerId',
          as: 'orderHistory'
        }
      },
      {
        $project: {
          name: 1,
          orderCount: { $size: '$orderHistory' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await db.collection('customers').aggregate(pipeline).toArray();

    // Alice (1) has 2 orders
    expect(results.find(c => c._id === 1).orderCount).toBe(2);
    // Bob (2) has 0 orders (Left Outer Join preserves Bob)
    expect(results.find(c => c._id === 2).orderCount).toBe(0);
    // Charlie (3) has 1 order
    expect(results.find(c => c._id === 3).orderCount).toBe(1);
  });
});
