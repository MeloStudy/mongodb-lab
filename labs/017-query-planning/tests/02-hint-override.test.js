const { MongoClient } = require('mongodb');

describe('Scenario 3: Manual Override with Hint', () => {
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

  test('LO-004: hint() should force the usage of a specific index', async () => {
    const query = { deviceId: 'DEV-001', status: 'idle' }; // status: 'idle' is 95% of data
    
    // 1. Force idx_status_time (which is inefficient for 'idle')
    const explainHinted = await collection.find(query).hint('idx_status_time').explain('executionStats');
    
    const winningPlan = JSON.stringify(explainHinted.queryPlanner.winningPlan);
    expect(winningPlan).toContain('idx_status_time');
    
    // Verify it actually used it
    expect(explainHinted.executionStats.totalKeysExamined).toBeGreaterThanOrEqual(1);
  });
});
