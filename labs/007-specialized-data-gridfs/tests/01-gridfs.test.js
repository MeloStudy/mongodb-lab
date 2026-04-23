const { MongoClient, GridFSBucket } = require('mongodb');

describe('Scenario 1: GridFS - The Media Archive', () => {
  let client;
  let db;

  beforeAll(async () => {
    const uri = 'mongodb://localhost:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lab_db');
  });

  afterAll(async () => {
    await client.close();
  });

  test('Should have a file larger than 16MB stored in GridFS and readable via stream', async () => {
    const bucket = new GridFSBucket(db);
    const files = await db.collection('fs.files').find().toArray();
    
    // We expect at least one file to be present
    expect(files.length).toBeGreaterThan(0);
    
    const largeFile = files.find(f => f.length > 16 * 1024 * 1024);
    expect(largeFile).toBeDefined();
    
    // Programmatic check: Try to open a download stream
    const downloadStream = bucket.openDownloadStream(largeFile._id);
    expect(downloadStream).toBeDefined();
    
    // Verify chunks metadata
    const chunksCount = await db.collection('fs.chunks').countDocuments({ files_id: largeFile._id });
    const expectedChunks = Math.ceil(largeFile.length / largeFile.chunkSize);
    expect(chunksCount).toBe(expectedChunks);
  });
});
