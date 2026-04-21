const { MongoClient } = require('mongodb');

describe('LAB-005: Advanced Query Precision', () => {
  let client;
  let collection;

  beforeAll(async () => {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    collection = client.db('crud_db').collection('inventory');

    // Seeding data with traps/decoys
    await collection.deleteMany({});
    await collection.insertMany([
      { 
        product: "Advanced Router", 
        tags: ["networking", "pro", "security"],
        shipments: [
          { warehouse: "A", status: "delivered", qty: 100 },
          { warehouse: "B", status: "pending", qty: 20 }
        ],
        warranty_notes: "3-year extended"
      },
      { 
        product: "Base Switch", 
        tags: ["networking"],
        shipments: [
          { warehouse: "A", status: "delivered", qty: 10 },
          { warehouse: "B", status: "pending", qty: 100 }
        ]
      },
      { 
        product: "Fiber Cable", 
        tags: ["accessory", "fiber"],
        shipments: [
          { warehouse: "A", status: "delivered", qty: 60 }
        ],
        special_notes: "Fragile"
      },
      {
        product: "Pro Firewall",
        tags: ["networking", "pro", "security", "enterprise"],
        shipments: [],
        warranty_notes: "LIFETIME"
      }
    ]);
  });

  afterAll(async () => {
    await client.close();
  });

  test('SC001: Precision Filtering ($elemMatch)', async () => {
    const results = await collection.find({
      shipments: { 
        $elemMatch: { status: "delivered", qty: { $gt: 50 } } 
      }
    }).toArray();

    expect(results.length).toBe(2);
    expect(results.map(r => r.product)).toContain("Advanced Router");
    expect(results.map(r => r.product)).toContain("Fiber Cable");
  });

  test('SC002: Logical Array Subset ($all)', async () => {
    // Find products having BOTH networking and security
    const results = await collection.find({
      tags: { $all: ["networking", "security"] }
    }).toArray();

    expect(results.length).toBe(2);
    expect(results.map(r => r.product)).toContain("Advanced Router");
    expect(results.map(r => r.product)).toContain("Pro Firewall");
  });

  test('SC003: Array Length Matching ($size)', async () => {
    // Exactly 3 tags: Advanced Router
    const results = await collection.find({
      tags: { $size: 3 }
    }).toArray();

    expect(results.length).toBe(1);
    expect(results[0].product).toBe("Advanced Router");
  });

  test('SC006: Range Array Length Matching ($expr + $size)', async () => {
    // More than 2 tags: Advanced Router (3), Pro Firewall (4)
    const results = await collection.find({
      $expr: { $gt: [{ $size: "$tags" }, 2] }
    }).toArray();

    expect(results.length).toBe(2);
    expect(results.map(r => r.product)).toContain("Advanced Router");
    expect(results.map(r => r.product)).toContain("Pro Firewall");
  });

  test('SC004: Schema Check ($exists)', async () => {
    // Does NOT have warranty_notes: Base Switch and Fiber Cable
    const results = await collection.find({
      warranty_notes: { $exists: false }
    }).toArray();

    expect(results.length).toBe(2);
    expect(results.map(r => r.product)).toContain("Base Switch");
    expect(results.map(r => r.product)).toContain("Fiber Cable");
  });

  test('SC005: Logical OR ($or)', async () => {
    // Tagged "accessory" OR having a shipment in warehouse "B"
    // accessory: Fiber Cable
    // warehouse B: Advanced Router, Base Switch
    const results = await collection.find({
      $or: [
        { tags: "accessory" },
        { "shipments.warehouse": "B" }
      ]
    }).toArray();

    expect(results.length).toBe(3);
    expect(results.map(r => r.product)).toContain("Fiber Cable");
    expect(results.map(r => r.product)).toContain("Advanced Router");
    expect(results.map(r => r.product)).toContain("Base Switch");
  });
});
