db = db.getSiblingDB('lab_db');

// Clear existing data
db.products.drop();
db.orders.drop();
db.reviews.drop();

// Seed Products
const product1 = {
  _id: ObjectId("60d5f2fd0f214212345678a1"),
  name: "Premium Coffee",
  price: 25.00,
  stock: 100
};

const product2 = {
  _id: ObjectId("60d5f2fd0f214212345678a2"),
  name: "Organic Tea",
  price: 15.00,
  stock: 200
};

db.products.insertMany([product1, product2]);

// Seed initial reviews for Product 1 (to demonstrate subset)
const initialReviews = [
  { _id: ObjectId(), product_id: product1._id, user: "Alice", comment: "Great coffee!", rating: 5, date: new Date("2026-01-01") },
  { _id: ObjectId(), product_id: product1._id, user: "Bob", comment: "A bit expensive.", rating: 4, date: new Date("2026-01-02") },
  { _id: ObjectId(), product_id: product1._id, user: "Charlie", comment: "Best morning ever.", rating: 5, date: new Date("2026-01-03") },
  { _id: ObjectId(), product_id: product1._id, user: "Dave", comment: "Okayish.", rating: 3, date: new Date("2026-01-04") }
];

db.reviews.insertMany(initialReviews);

// Initially, the product document DOES NOT have the recent_reviews array.
// The learner will have to add it using the Subset Pattern logic.

print("LAB-010: Database seeded successfully.");
