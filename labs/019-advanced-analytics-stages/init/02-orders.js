db = db.getSiblingDB('lab_db');

db.orders.insertMany([
  { _id: 101, customerId: 1, items: [{ prodId: 'A', q: 2 }], total: NumberDecimal("150.00"), date: new Date() },
  { _id: 102, customerId: 1, items: [{ prodId: 'B', q: 1 }], total: NumberDecimal("50.00"), date: new Date() },
  { _id: 103, customerId: 3, items: [{ prodId: 'C', q: 5 }], total: NumberDecimal("25.00"), date: new Date() },
  { _id: 104, customerId: 4, items: [{ prodId: 'A', q: 1 }], total: NumberDecimal("75.00"), date: new Date() }
]);
// Bob (2) and Edward (5) have no orders.

print('Seeded orders.');
