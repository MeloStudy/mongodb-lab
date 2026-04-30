const { MongoClient } = require('mongodb');

jest.setTimeout(30000);

describe('Scenario 5: Search Highlighting', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true');
    db = connection.db('search_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-009: Should return highlight metadata for search matches', async () => {
    const books = db.collection('books');
    
    const results = await books.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: "scalable",
            path: "description"
          },
          highlight: {
            path: "description"
          }
        }
      },
      {
        $project: {
          title: 1,
          highlights: { $meta: "searchHighlights" }
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('highlights');
    expect(results[0].highlights[0].texts[0].type).toBeDefined();
  });
});
