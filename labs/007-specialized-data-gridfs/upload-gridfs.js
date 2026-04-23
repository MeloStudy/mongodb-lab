const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function uploadFile() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('lab_db');

    // 1. Initialize the GridFS Bucket
    // By default, this creates 'fs.files' and 'fs.chunks' collections.
    const bucket = new GridFSBucket(db);

    const filePath = path.join(__dirname, 'large-file.dat');
    
    console.log(`=> Uploading ${filePath} to GridFS using Node.js driver...`);
    
    // 2. Create an Upload Stream
    // We give the file a name in GridFS and can attach arbitrary metadata
    // that will be stored in the 'fs.files' collection.
    const uploadStream = bucket.openUploadStream('large-file-programmatic.dat', {
      chunkSizeBytes: 255 * 1024, // Optional: default is 255KB
      metadata: { 
        source: 'node-driver-example', 
        type: 'satellite-log',
        generatedAt: new Date()
      }
    });

    // 3. Pipe the file into MongoDB
    // Using streams is CRITICAL for large files. Instead of loading 20MB into RAM,
    // we read and send small chunks sequentially.
    fs.createReadStream(filePath).pipe(uploadStream);

    // 4. Handle Lifecycle Events
    uploadStream.on('finish', async () => {
      console.log('✅ Upload successful! The file has been fragmented into chunks.');
      await client.close();
      process.exit(0);
    });

    uploadStream.on('error', (err) => {
      console.error('❌ Upload failed:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
}

uploadFile();
