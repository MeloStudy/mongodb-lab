const { MongoClient } = require('mongodb');

describe('Scenario 4: Plan Cache Management', () => {
  let connection;
  let db;
  let collection;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
    collection = db.collection('telemetry');
    
    // Ensure the cache is populated by running a query multiple times
    // Note: In 7.0, a plan is cached only after it is chosen as the winner in a trial period
    for(let i=0; i<5; i++) {
        await collection.find({ deviceId: 'DEV-001' }).toArray();
    }
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-005: Should be able to list and clear the plan cache', async () => {
    // 1. List Plan Cache using $planCacheStats aggregation
    const stats = await collection.aggregate([ { $planCacheStats: {} } ]).toArray();
    
    // It might be empty if the trial period didn't finish or cache was already cleared,
    // but the stage should be supported.
    expect(Array.isArray(stats)).toBe(true);
    
    // 2. Clear Plan Cache
    const clear = await db.command({
      planCacheClear: 'telemetry'
    });
    
    expect(clear.ok).toBe(1);

    // 3. Verify it is empty (or at least that the clear command worked)
    const statsAfter = await collection.aggregate([ { $planCacheStats: {} } ]).toArray();
    expect(statsAfter.length).toBe(0);
  });
});
