const { MongoClient } = require('mongodb');

describe('Scenario 2: Compound Indexes & ESR Rule', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('performance_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-002: Compound index should follow ESR rule (status, orderDate, totalAmount)', async () => {
    const collection = db.collection('orders');
    
    // 1. Verify exact index order
    const indexes = await collection.indexes();
    const esrIndex = indexes.find(idx => 
      idx.key.status === 1 && 
      idx.key.orderDate === 1 && 
      idx.key.totalAmount === 1
    );
    expect(esrIndex).toBeDefined();

    // 2. Audit Explain Plan for SORT stage
    const explain = await collection
      .find({ status: 'shipped', totalAmount: { $gt: 100 } })
      .sort({ orderDate: 1 })
      .explain('executionStats');
    
    const planString = JSON.stringify(explain.queryPlanner.winningPlan);
    
    // Efficient indexing means NO 'SORT' stage (in-memory sort)
    expect(planString).not.toContain('"stage":"SORT"');
    expect(planString).toContain('IXSCAN');
  });
});
