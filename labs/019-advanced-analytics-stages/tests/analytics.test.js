const { MongoClient } = require('mongodb');

describe('Scenario 3 & 4: Facets and Persistence ($facet, $merge)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-003: Should generate faceted results for products', async () => {
    const pipeline = [
      {
        $facet: {
          categories: [
            { $group: { _id: "$category", count: { $sum: 1 } } }
          ],
          priceRanges: [
            {
              $bucket: {
                groupBy: "$price",
                boundaries: [0, 50, 200, 2000],
                default: "Other",
                output: { count: { $sum: 1 } }
              }
            }
          ],
          topRated: [
            { $sort: { rating: -1 } },
            { $limit: 2 },
            { $project: { name: 1, rating: 1 } }
          ]
        }
      }
    ];

    const results = await db.collection('products').aggregate(pipeline).toArray();
    const facets = results[0];

    expect(facets.categories.length).toBe(2); // Electronics, Furniture
    expect(facets.priceRanges.length).toBe(3);
    expect(facets.topRated[0].name).toBe("Keyboard"); // Rating 4.8
  });

  test('LO-004: Should materialize results into a report collection using $merge', async () => {
    // Clear existing report if any
    await db.collection('sales_report').drop().catch(() => {});

    const pipeline = [
      {
        $group: {
          _id: "$customerId",
          totalOrders: { $sum: 1 },
          lastOrderDate: { $max: "$date" }
        }
      },
      {
        $merge: {
          into: "sales_report",
          on: "_id",
          whenMatched: "replace",
          whenNotMatched: "insert"
        }
      }
    ];

    await db.collection('orders').aggregate(pipeline).toArray();

    const report = await db.collection('sales_report').find().toArray();
    // Orders from customers 1, 3, 4 -> 3 report entries
    expect(report.length).toBe(3);
    expect(report.find(r => r._id === 1).totalOrders).toBe(2);

    // Run again with an update
    await db.collection('orders').insertOne({ _id: 105, customerId: 1, total: 100, date: new Date() });
    await db.collection('orders').aggregate(pipeline).toArray();

    const updatedReport = await db.collection('sales_report').find({ _id: 1 }).toArray();
    expect(updatedReport[0].totalOrders).toBe(3);

    // Cleanup for other tests
    await db.collection('orders').deleteOne({ _id: 105 });
  });
});
