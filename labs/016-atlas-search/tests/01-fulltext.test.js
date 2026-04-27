const { MongoClient } = require('mongodb');

jest.setTimeout(30000);

describe('Scenario 1: Full-Text Search ($search)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true');
    db = connection.db('search_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-003: Should perform basic full-text search on title and description', async () => {
    const books = db.collection('books');
    
    // We expect the index 'default' to exist.
    // Note: In a real lab, the student creates this index.
    const results = await books.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: "high-performance scalable",
            path: ["title", "description"]
          }
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("MongoDB");
  });
});
