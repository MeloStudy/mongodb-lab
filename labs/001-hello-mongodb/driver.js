const { MongoClient } = require('mongodb');

// This is the URI pointing to your local MongoDB container
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'lab_db';

async function main() {
  try {
    // 1. Connect to the database
    await client.connect();

    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('greetings');

    // 2. Insert a document into the 'greetings' collection
    const result = await collection.insertOne({ msg: "Hello from Driver" });
    console.log(`Inserted document with ID: ${result.insertedId}`);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // 3. Ensure the client is closed when you finish
    await client.close();
  }
}

// Execute the main function
main().catch(console.error);
