const { MongoClient } = require('mongodb');

jest.setTimeout(30000);

describe('Scenario 2: Fuzzy Search (Typo Tolerance)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true');
    db = connection.db('search_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-005: Should find results even with typos using fuzzy option', async () => {
    const books = db.collection('books');
    
    const results = await books.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: "Mngodb", // Typo
            path: "title",
            fuzzy: {
              maxEdits: 1
            }
          }
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("MongoDB: The Definitive Guide");
  });
});
