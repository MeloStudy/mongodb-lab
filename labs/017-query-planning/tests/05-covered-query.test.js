const { MongoClient } = require('mongodb');

describe('Scenario 5: Covered Query Advantage', () => {
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

  test('LO-009: Query with projection should be covered by index (no FETCH stage)', async () => {
    const query = { deviceId: 'DEV-001' };
    const projection = { deviceId: 1, timestamp: 1, _id: 0 };

    const explain = await collection.find(query, { projection }).explain('queryPlanner');
    
    // In a covered query, the winning plan should NOT have a FETCH stage at the top.
    // It should be an IXSCAN or a PROJECTION_COVERED stage.
    
    const winningPlan = explain.queryPlanner.winningPlan;
    
    // Recursively check for FETCH stage
    const hasFetchStage = (stage) => {
      if (stage.stage === 'FETCH') return true;
      if (stage.inputStage) return hasFetchStage(stage.inputStage);
      if (stage.inputStages) return stage.inputStages.some(hasFetchStage);
      return false;
    };

    expect(hasFetchStage(winningPlan)).toBe(false);
  });
});
