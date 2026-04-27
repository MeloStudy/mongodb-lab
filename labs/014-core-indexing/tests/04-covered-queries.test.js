const { MongoClient } = require('mongodb');

describe('Scenario 5: Covered Queries (Zero-Fetch)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('performance_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-005: Query should be covered by the index (totalDocsExamined: 0)', async () => {
    const collection = db.collection('orders');
    
    // The query must only request fields present in the index AND exclude _id
    const explain = await collection
      .find(
        { status: 'shipped' }, 
        { projection: { status: 1, orderDate: 1, totalAmount: 1, _id: 0 } }
      )
      .explain('executionStats');
    
    expect(explain.executionStats.totalDocsExamined).toBe(0);
    expect(explain.executionStats.totalKeysExamined).toBeGreaterThan(0);
  });
});
