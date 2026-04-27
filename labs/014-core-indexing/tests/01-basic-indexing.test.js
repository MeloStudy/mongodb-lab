const { MongoClient } = require('mongodb');

describe('Scenario 1: Basic Indexing (COLLSCAN vs IXSCAN)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('performance_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-001: Query on orderId should use an IXSCAN after index creation', async () => {
    const collection = db.collection('orders');
    
    // 1. Verify index exists
    const indexes = await collection.indexes();
    const hasIndex = indexes.some(idx => idx.key.orderId === 1);
    expect(hasIndex).toBe(true);

    // 2. Audit Explain Plan
    const explain = await collection.find({ orderId: 'ORD-02500' }).explain('executionStats');
    
    // In MongoDB 7.0, winningPlan might be nested in queryPlanner
    const winningPlan = explain.queryPlanner.winningPlan;
    
    // We expect an IXSCAN stage (or a SHARDING stage containing IXSCAN, but here it's standalone)
    const planString = JSON.stringify(winningPlan);
    expect(planString).toContain('IXSCAN');
    
    // 3. Performance Metric
    expect(explain.executionStats.totalDocsExamined).toBe(1);
    expect(explain.executionStats.nReturned).toBe(1);
  });
});
