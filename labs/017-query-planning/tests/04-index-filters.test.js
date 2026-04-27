const { MongoClient } = require('mongodb');

describe('Scenario 5: Index Filters (Advanced)', () => {
  let connection;
  let db;
  let collection;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
    collection = db.collection('telemetry');
  });

  afterAll(async () => {
    // Cleanup filters to not affect other tests if run in suite
    await db.command({ planCacheClearFilters: 'telemetry' });
    await connection.close();
  });

  test('LO-006: planCacheSetFilter should restrict the optimizer to specific indexes', async () => {
    const query = { deviceId: 'DEV-001', status: 'active' };
    
    // 1. Set filter to ONLY allow idx_status_time for this query shape
    // Query shape is defined by the query and projection
    await db.command({
      planCacheSetFilter: 'telemetry',
      query: { deviceId: 'DEV-001', status: 'active' },
      indexes: [ { status: 1, timestamp: -1 } ] // idx_status_time
    });

    // 2. Explain the query
    const explain = await collection.find(query).explain('queryPlanner');
    
    // The winning plan MUST be idx_status_time, and NO rejected plans should involve idx_device_time
    const winningPlan = JSON.stringify(explain.queryPlanner.winningPlan);
    expect(winningPlan).toContain('idx_status_time');
    
    // Check rejected plans
    const rejectedPlans = JSON.stringify(explain.queryPlanner.rejectedPlans);
    expect(rejectedPlans).not.toContain('idx_device_time');
    
    // 3. Clear filters
    const clearResult = await db.command({ planCacheClearFilters: 'telemetry' });
    expect(clearResult.ok).toBe(1);
  });
});
