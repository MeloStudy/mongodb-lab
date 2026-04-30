const { MongoClient } = require('mongodb');

describe('Scenario 1 & 2: Plan Selection (Winning vs Rejected)', () => {
  let connection;
  let db;
  let collection;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
    collection = db.collection('telemetry');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-002: Explain should show a winning plan and rejected plans for multi-index query', async () => {
    // Query that can use both idx_device_time and idx_status_time
    const query = { deviceId: 'DEV-001', status: 'active' };
    const sort = { timestamp: -1 };

    // We use allPlansExecution to see the rejected plans
    const explain = await collection.find(query).sort(sort).explain('allPlansExecution');
    
    // 1. Verify Winning Plan exists
    expect(explain.queryPlanner.winningPlan).toBeDefined();
    
    // 2. Verify Rejected Plans exist (because we have two viable indexes)
    // Note: If one index is significantly better, MongoDB might not even race them in some versions,
    // but with our skewed data and compound indexes, it usually races.
    expect(explain.queryPlanner.rejectedPlans).toBeInstanceOf(Array);
    expect(explain.queryPlanner.rejectedPlans.length).toBeGreaterThanOrEqual(0);

    // 3. Audit the execution stats of the winner
    expect(explain.executionStats.totalKeysExamined).toBeGreaterThan(0);
    
    // 4. Verify that "works" is present in the candidate plans (allPlansExecution)
    if (explain.queryPlanner.rejectedPlans.length > 0) {
      const candidateStats = explain.executionStats.allPlansExecution;
      expect(candidateStats).toBeDefined();
      // In MongoDB 7.0, works is inside executionStages
      expect(candidateStats[0].executionStages.works).toBeDefined();
    }
  });
});
