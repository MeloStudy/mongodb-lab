const { MongoClient } = require('mongodb');

describe('Scenario 2: Subset Pattern (Recent Reviews)', () => {
  let client;
  let db;

  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lab_db');
  });

  afterAll(async () => {
    await client.close();
  });

  test('Products should only store a subset of 3 most recent reviews', async () => {
    const products = await db.collection('products').find({ recent_reviews: { $exists: true } }).toArray();
    
    // LO-002: Verify subset pattern implementation
    expect(products.length).toBeGreaterThan(0);

    products.forEach(product => {
      expect(Array.isArray(product.recent_reviews)).toBe(true);
      // TR-004: Verify the $slice: -3 constraint
      expect(product.recent_reviews.length).toBeLessThanOrEqual(3);
    });
  });

  test('Full history should exist in a separate reviews collection', async () => {
    const products = await db.collection('products').find({ recent_reviews: { $exists: true } }).toArray();
    
    for (const product of products) {
      const fullReviews = await db.collection('reviews').find({ product_id: product._id }).toArray();
      
      // If the learner added more than 3 reviews, fullReviews should be more than the subset
      if (fullReviews.length > 3) {
        expect(product.recent_reviews.length).toBe(3);
        
        // Verify that the subset contains the MOST RECENT ones (simplified check)
        const sortedFull = [...fullReviews].sort((a, b) => b.date - a.date);
        const top3Ids = sortedFull.slice(0, 3).map(r => r._id.toString());
        const subsetIds = product.recent_reviews.map(r => r._id.toString());
        
        // This ensures the subset is actually the "Top" one
        expect(subsetIds).toEqual(expect.arrayContaining(top3Ids));
      }
    }
  });
});
