const { MongoClient } = require('mongodb');

describe('Scenario 2: Recursive Org Chart ($graphLookup)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-002: Should find all subordinates recursively for a manager', async () => {
    const pipeline = [
      { $match: { name: "VP Engineering" } }, // _id: 2
      {
        $graphLookup: {
          from: "employees",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "reportsTo",
          as: "subordinates"
        }
      },
      {
        $project: {
          name: 1,
          totalSubordinates: { $size: "$subordinates" },
          subordinateNames: "$subordinates.name"
        }
      }
    ];

    const results = await db.collection('employees').aggregate(pipeline).toArray();
    const vpEng = results[0];

    expect(vpEng.name).toBe("VP Engineering");
    // Subordinates of VP Eng (2):
    // 4 (Dir Eng), 5 (Eng Mgr), 6 (Lead Dev), 7 (Dev A), 8 (Dev B) -> 5 people
    expect(vpEng.totalSubordinates).toBe(5);
    expect(vpEng.subordinateNames).toContain("Lead Developer");
    expect(vpEng.subordinateNames).toContain("Developer A");
    expect(vpEng.subordinateNames).not.toContain("CEO");
  });
});
