const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function uploadFile() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('lab_db');
    const bucket = new GridFSBucket(db);

    const filePath = path.join(__dirname, 'large-file.dat');
    
    console.log(`=> Uploading ${filePath} to GridFS using Node.js driver...`);
    
    const uploadStream = bucket.openUploadStream('large-file-programmatic.dat', {
      metadata: { source: 'node-driver-example', type: 'satellite-log' }
    });

    fs.createReadStream(filePath).pipe(uploadStream);

    uploadStream.on('finish', async () => {
      console.log('✅ Upload successful!');
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
