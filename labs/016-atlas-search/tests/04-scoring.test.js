const { MongoClient } = require('mongodb');

jest.setTimeout(30000);

describe('Scenario 4: Relevance Scoring', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true');
    db = connection.db('search_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-007: Should project and verify relevance scores', async () => {
    const books = db.collection('books');
    
    const results = await books.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: "software development mastery",
            path: ["title", "description"]
          }
        }
      },
      {
        $project: {
          title: 1,
          score: { $meta: "searchScore" }
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].score).toBeDefined();
    expect(results[0].score).toBeGreaterThan(0);
    // The Pragmatic Programmer should be top or near top
    expect(results[0].title).toBe("The Pragmatic Programmer");
  });
});
