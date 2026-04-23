const { MongoClient, UUID } = require('mongodb');

async function seed() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('lab_db');
    const collection = db.collection('factory');

    // Reset collection
    await collection.deleteMany({});

    const documents = [
      // Healthy documents
      { name: "Unit-A1", status: "active", type: "sensor", reading: 42 },
      { name: "Unit-A2", status: "active", type: "sensor", reading: 45 },
      { name: "Unit-B1", status: "active", type: "actuator", reading: 10 },
      
      // Corrupted documents (targeted for deleteMany)
      { name: "Unknown", status: "failed", error_code: 500, type: "garbage" },
      { name: "Unknown", status: "failed", error_code: 501, type: "garbage" },
      { name: "Unknown", status: "failed", error_code: 502, type: "garbage" },
      
      // Specific document for deleteOne (using a unique identifier)
      { 
        _id: new UUID("00000000-0000-4000-a000-000000000001"), 
        name: "Malfunctioning-Probe", 
        status: "critical", 
        type: "probe" 
      }
    ];

    await collection.insertMany(documents);
    console.log(`✅ Seeded ${documents.length} documents into 'factory' collection.`);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
