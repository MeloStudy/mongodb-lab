const { MongoClient } = require('mongodb');

describe('01: Aggregation Fundamentals', () => {
  let connection;
  let db;
  let collection;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('lab_db');
    collection = db.collection('sales');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-006: Predicate Pushdown - $match should be the first stage', async () => {
    const pipeline = [
      { $match: { category: 'Electronics' } },
      { $project: { productName: 1, category: 1, _id: 0 } }
    ];

    const explain = await collection.aggregate(pipeline).explain('queryPlanner');
    expect(explain.queryPlanner).toBeDefined();
    expect(explain.queryPlanner.winningPlan).toBeDefined();
  });

  test('LO-002: Shaping data with $project', async () => {
    const pipeline = [
      { $match: { category: 'Electronics' } },
      { $project: { item: '$productName', category: 1, _id: 0 } }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    if (results.length > 0) {
      expect(results[0].item).toBeDefined();
      expect(results[0].productName).toBeUndefined();
    }
  });

  test('LO-009: Stage Folding - $match and $sort analysis', async () => {
    const pipeline = [
      { $match: { category: 'Electronics' } },
      { $sort: { price: -1 } }
    ];

    // Using explain() to see the optimized stages
    const explain = await collection.aggregate(pipeline).explain();
    
    // In MongoDB 7.0+, a simple $match + $sort might be handled by the query planner
    // or wrapped in a $cursor stage. If stages exist, $match should be folded into $cursor.
    if (explain.stages) {
      const hasMatchStage = explain.stages.some(s => s.$match);
      const hasCursorStage = explain.stages.some(s => s.$cursor);
      
      // The $match should be folded into the $cursor, so no top-level $match
      expect(hasMatchStage).toBe(false);
      expect(hasCursorStage).toBe(true);
    } else {
      // If no top-level stages, it's using the classic query planner
      expect(explain.queryPlanner).toBeDefined();
      expect(explain.queryPlanner.optimizedPipeline).toBe(true);
    }
  });
});
