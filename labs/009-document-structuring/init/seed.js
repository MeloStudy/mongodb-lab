// Seeding script for LAB-009: Relational to Document Transformation
db = db.getSiblingDB('lab_db');

// 1. Initial Users (The "Root" entity)
db.users.insertMany([
  { _id: ObjectId("60d5f2fd0f21421234567890"), username: "jdoe", email: "jdoe@example.com", created_at: new Date() },
  { _id: ObjectId("60d5f2fd0f21421234567891"), username: "asmith", email: "asmith@example.com", created_at: new Date() }
]);

// 2. Separate Preferences (Relational 1:1 style)
db.preferences.insertMany([
  { user_id: ObjectId("60d5f2fd0f21421234567890"), theme: "dark", notifications: true, language: "en" },
  { user_id: ObjectId("60d5f2fd0f21421234567891"), theme: "light", notifications: false, language: "es" }
]);

// 3. Separate Addresses (Relational 1:N style)
db.addresses.insertMany([
  { user_id: ObjectId("60d5f2fd0f21421234567890"), type: "home", street: "123 Main St", city: "New York", zip_code: NumberInt(10001) },
  { user_id: ObjectId("60d5f2fd0f21421234567890"), type: "work", street: "456 Office Rd", city: "New York", zip_code: NumberInt(10022) },
  { user_id: ObjectId("60d5f2fd0f21421234567891"), type: "home", street: "789 Pine Ave", city: "Madrid", zip_code: NumberInt(28001) }
]);

console.log("LAB-009: Seeded relational-style data successfully.");
