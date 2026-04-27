const { MongoClient } = require('mongodb');

jest.setTimeout(30000);

describe('Scenario 3: Autocomplete', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true');
    db = connection.db('search_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-006: Should suggest book titles as the user types', async () => {
    const books = db.collection('books');
    
    // We expect a separate index or a mapping in 'default' for autocomplete
    const results = await books.aggregate([
      {
        $search: {
          index: "default",
          autocomplete: {
            query: "Clean",
            path: "title"
          }
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("Clean Code");
  });
});
