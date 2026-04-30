const { MongoClient } = require('mongodb');

jest.setTimeout(30000);

describe('Scenario 4: Compound Search (Must + Filter)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true');
    db = connection.db('search_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-008: Should search for keywords and filter by genre using compound operator', async () => {
    const books = db.collection('books');
    
    const results = await books.aggregate([
      {
        $search: {
          index: "default",
          compound: {
            must: [{
              text: {
                query: "database",
                path: ["title", "description"]
              }
            }],
            filter: [{
              text: {
                query: "Technology",
                path: "genre"
              }
            }]
          }
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    results.forEach(book => {
      expect(book.genre).toBe("Technology");
    });
  });
});
