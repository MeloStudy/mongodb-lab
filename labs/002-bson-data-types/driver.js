const { MongoClient } = require('mongodb');
// Ensure to demand BSON native wrapper classes from the driver package
const { Decimal128, Int32, Binary } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'bson_db';

async function main() {
  try {
    // 1. Connect to the database
    await client.connect();

    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('invoices');

    // 2. Wrap primitive data using the strict BSON wrappers
    // Instantiate the custom BSON variables for insertion:
    const explicitPrice = new Decimal128("100.99");
    const explicitSize = new Int32(4096);
    const explicitBinary = new Binary(Buffer.from("YmFzZTY0c2FtcGxl", "base64"), 0);
    
    // 3. Insert the document
    // Write insertion code wrapping the explicit types in the document:
    await collection.insertOne({ 
      source: "Driver",
      price: explicitPrice,
      sizeInBytes: explicitSize,
      internalFile: explicitBinary
    });

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
