db = db.getSiblingDB('lab_db');

db.products.insertMany([
  { _id: "A", name: "Laptop", category: "Electronics", price: 1200, rating: 4.5 },
  { _id: "B", name: "Mouse", category: "Electronics", price: 25, rating: 4.2 },
  { _id: "C", name: "Keyboard", category: "Electronics", price: 75, rating: 4.8 },
  { _id: "D", name: "Desk", category: "Furniture", price: 300, rating: 4.0 },
  { _id: "E", name: "Chair", category: "Furniture", price: 150, rating: 4.3 },
  { _id: "F", name: "Monitor", category: "Electronics", price: 250, rating: 4.6 },
  { _id: "G", name: "Lamp", category: "Furniture", price: 45, rating: 3.9 }
]);

print('Seeded products.');
