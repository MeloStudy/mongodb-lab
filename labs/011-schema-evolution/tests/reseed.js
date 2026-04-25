const { MongoClient, ObjectId } = require('mongodb');

async function reseed() {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const db = client.db('lab_db');

  await db.collection('users').drop();

  const legacyUsers = [
    { _id: new ObjectId(), name: "John Doe", email: "john@example.com" },
    { _id: new ObjectId(), name: "Alice Van Wonderland", email: "alice@example.com" },
    { _id: new ObjectId(), name: "Bob Builder", email: "bob@example.com" }
  ];

  const version2Users = [
    { 
      _id: new ObjectId(), 
      first_name: "Charlie", 
      last_name: "Brown", 
      email: "charlie@example.com", 
      schema_version: 2 
    },
    { 
      _id: new ObjectId(), 
      first_name: "Diana", 
      last_name: "Prince", 
      email: "diana@example.com", 
      schema_version: 2 
    }
  ];

  const allUsers = [...legacyUsers, ...version2Users];
  
  // Reset Playground
  await db.collection('users').deleteMany({});
  await db.collection('users').insertMany(allUsers);

  // Reset Eager (Isolated)
  await db.collection('users_eager').deleteMany({});
  await db.collection('users_eager').insertMany(allUsers);
  
  await client.close();
}

module.exports = reseed;
