/**
 * Seeding script for Lab 014: Core Indexing
 * Generates 5,000 orders to demonstrate COLLSCAN vs IXSCAN
 */
const dbName = 'performance_db';
const db = db.getSiblingDB(dbName);

print('--- Starting Seeding Process ---');

// 1. Seed Orders (5,000 documents)
db.orders.drop();
const statuses = ['pending', 'shipped', 'delivered', 'cancelled'];
const orders = [];

for (let i = 1; i <= 5000; i++) {
  const orderDate = new Date();
  orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
  
  const order = {
    orderId: `ORD-${i.toString().padStart(5, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    orderDate: orderDate,
    totalAmount: parseFloat((Math.random() * 1000).toFixed(2)),
    customer: {
      name: `Customer ${i}`,
      email: `customer${i}@example.com`
    }
  };

  // Add Sparse field to only 10% of documents
  if (i % 10 === 0) {
    order.discountCode = `SAVE${i}`;
  }

  orders.push(order);

  // Bulk insert every 1000 docs for performance
  if (orders.length === 1000) {
    db.orders.insertMany(orders);
    orders.length = 0;
  }
}
print('Success: 5,000 orders seeded.');

// 2. Seed Users for Partial Index Scenario
db.users.drop();
const users = [];
for (let i = 1; i <= 100; i++) {
  users.push({
    userId: i,
    email: `user${i}@provider.com`,
    status: i <= 80 ? 'active' : 'inactive' // 80% active
  });
}
db.users.insertMany(users);
print('Success: 100 users seeded for Partial Index scenario.');

// 3. Prepare Sessions for TTL (Empty but collection initialized)
db.sessions.drop();
db.sessions.insertOne({ sessionId: "init", createdAt: new Date() });
print('Success: Sessions collection initialized.');

print('--- Seeding Completed ---');
