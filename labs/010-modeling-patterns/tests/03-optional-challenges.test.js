const { MongoClient } = require('mongodb');

describe('LAB-010: Optional Challenges Validation', () => {
  let client;
  let db;

  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lab_db');
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  describe('Challenge 1: Double-Write Simulation', () => {
    it('should have archived "Eve" and updated the product subset correctly', async () => {
      const product = await db.collection('products').findOne({ name: "Premium Coffee" });
      const archiveCount = await db.collection('reviews').countDocuments({ user: "Eve" });

      // Verification: Eve must be in the archive
      expect(archiveCount).toBeGreaterThan(0);

      // Verification: Eve must be in the subset
      expect(product.recent_reviews).toBeDefined();
      const hasEve = product.recent_reviews.some(r => r.user === "Eve");
      expect(hasEve).toBe(true);

      // Verification: Subset must remain capped at 3
      expect(product.recent_reviews.length).toBeLessThanOrEqual(3);

      // Verification: Alice (oldest) should be gone from the subset if Eve was added correctly
      const hasAlice = product.recent_reviews.some(r => r.user === "Alice");
      expect(hasAlice).toBe(false);
    });
  });

  describe('Challenge 2: Cascade Delete', () => {
    it('should have removed "Bob" from both archive and subset', async () => {
      const archiveMatch = await db.collection('reviews').findOne({ user: "Bob" });
      const product = await db.collection('products').findOne({ name: "Premium Coffee" });

      // Verification: Bob must be gone from archive
      expect(archiveMatch).toBeNull();

      // Verification: Bob must be gone from the subset
      if (product.recent_reviews) {
        const hasBob = product.recent_reviews.some(r => r.user === "Bob");
        expect(hasBob).toBe(false);
      }
    });
  });
});
