const { MongoClient } = require('mongodb');

describe('Scenario 5: Uncorrelated Join ($lookup pipeline)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-005: Should join orders with discounts based on total value range', async () => {
    const pipeline = [
      {
        $lookup: {
          from: "discounts",
          let: { orderTotal: "$total" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: ["$$orderTotal", "$minSpent"] },
                    { $lte: ["$$orderTotal", "$maxSpent"] }
                  ]
                }
              }
            }
          ],
          as: "tier"
        }
      },
      { $unwind: "$tier" },
      { $project: { _id: 1, total: 1, tierLabel: "$tier.label" } },
      { $sort: { _id: 1 } }
    ];

    const results = await db.collection('orders').aggregate(pipeline).toArray();

    // Order 101: 150.00 -> Gold
    expect(results.find(o => o._id === 101).tierLabel).toBe("Gold");
    // Order 102: 50.00 -> Bronze
    expect(results.find(o => o._id === 102).tierLabel).toBe("Bronze");
    // Order 103: 25.00 -> Bronze
    expect(results.find(o => o._id === 103).tierLabel).toBe("Bronze");
    // Order 104: 75.00 -> Silver
    expect(results.find(o => o._id === 104).tierLabel).toBe("Silver");
  });
});
