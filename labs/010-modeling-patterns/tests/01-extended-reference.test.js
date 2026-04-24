const { MongoClient } = require('mongodb');

describe('Scenario 1: Extended Reference Pattern (Fast Orders)', () => {
  let client;
  let db;

  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lab_db');
  });

  afterAll(async () => {
    await client.close();
  });

  test('Order items should include redundant product name and price', async () => {
    const orders = await db.collection('orders').find({}).toArray();
    
    // LO-001: Check if orders are empty (they shouldn't be if the learner followed instructions)
    expect(orders.length).toBeGreaterThan(0);

    orders.forEach(order => {
      expect(order.items).toBeDefined();
      expect(Array.isArray(order.items)).toBe(true);
      
      order.items.forEach(item => {
        // Verify the Extended Reference fields
        expect(item.product_id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.price).toBeDefined();
        expect(typeof item.name).toBe('string');
        expect(typeof item.price).toBe('number');
      });
    });
  });

  test('Snapshot Integrity: Order price should not change when product price is updated', async () => {
    // This test assumes the learner has created an order for "Premium Coffee" at $25.00
    // Then we (the test) update the product price to $30.00 and check the order.
    
    // 1. Get the product and update its price
    await db.collection('products').updateOne(
      { name: 'Premium Coffee' },
      { $set: { price: 30.00 } }
    );

    // 2. Check the order. It should still have the original $25.00
    const order = await db.collection('orders').findOne({ "items.name": 'Premium Coffee' });
    
    expect(order).not.toBeNull();
    const coffeeItem = order.items.find(i => i.name === 'Premium Coffee');
    
    // LO-003: Verify Snapshot integrity (Redundancy benefit)
    expect(coffeeItem.price).toBe(25.00);
  });
});
