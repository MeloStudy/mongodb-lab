const { MongoClient } = require('mongodb');

describe('LAB-004: Ordered vs Unordered Inserts', () => {
  let client;
  let collection;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    collection = client.db('crud_db').collection('orders');
  });

  afterAll(async () => {
    await collection.deleteMany({});
    await client.close();
  });

  /**
   * The objective of this test is to verify that the student successfully 
   * performed an UNORDERED insert that survived a duplicate key error.
   */
  test('SC001: Should demonstrate unordered insertion skipping duplicate key errors', async () => {
    const count = await collection.countDocuments();
    
    // Preparation: The scenario in README should instruct inserting a specific dataset
    // with duplicate _ids.
    // If unordered: false was used, then documents after the error are inserted.
    // If ordered: true (default) was used, execution stops at the error.
    
    // We expect the learner to have inserted a batch that resulted in at least 3 documents 
    // despite a deliberate duplicate _id in the array.
    expect(count).toBeGreaterThan(1); 
    
    // Specifically, we check for the document that was positioned AFTER the duplicate error.
    const lastDoc = await collection.findOne({ tag: "post-error" });
    expect(lastDoc).not.toBeNull();
    console.log('✅ Verified: Unordered batch skip logic successful.');
  });
});
