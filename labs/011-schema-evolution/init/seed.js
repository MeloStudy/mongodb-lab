db = db.getSiblingDB('lab_db');

db.users.drop();
db.users_bulk.drop();

/**
 * SEED DATA: Mixed Schema Versions
 * This simulates a database that has evolved over time.
 */

const legacyUsers = [
  { _id: ObjectId(), name: "John Doe", email: "john@example.com" },
  { _id: ObjectId(), name: "Alice Van Wonderland", email: "alice@example.com" },
  { _id: ObjectId(), name: "Bob Builder", email: "bob@example.com" }
];

const version2Users = [
  { 
    _id: ObjectId(), 
    first_name: "Charlie", 
    last_name: "Brown", 
    email: "charlie@example.com", 
    schema_version: 2 
  },
  { 
    _id: ObjectId(), 
    first_name: "Diana", 
    last_name: "Prince", 
    email: "diana@example.com", 
    schema_version: 2 
  }
];

const allUsers = [...legacyUsers, ...version2Users];

// Seed the Playground/Lazy collection
db.users.insertMany(allUsers);

// Seed the Eager/Bulk collection (isolated for testing)
db.users_eager.insertMany(allUsers);

print("LAB-011: Database seeded.");
print(" - Collection 'users' ready for Lazy Migration.");
print(" - Collection 'users_eager' ready for Eager Migration.");
