const { MongoClient } = require('mongodb');

describe('Scenario 3, 4 & 6: Specialized Indexes (Sparse, TTL, Partial)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017');
    db = connection.db('performance_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-003: Sparse index on discountCode should exist', async () => {
    const indexes = await db.collection('orders').indexes();
    const sparseIdx = indexes.find(idx => idx.key.discountCode === 1);
    expect(sparseIdx).toBeDefined();
    expect(sparseIdx.sparse).toBe(true);
  });

  test('LO-004: TTL index on createdAt should expire documents after 60s', async () => {
    const indexes = await db.collection('sessions').indexes();
    const ttlIdx = indexes.find(idx => idx.key.createdAt === 1);
    expect(ttlIdx).toBeDefined();
    expect(ttlIdx.expireAfterSeconds).toBe(60);
  });

  test('LO-006: Partial index on email for active users only', async () => {
    const indexes = await db.collection('users').indexes();
    const partialIdx = indexes.find(idx => idx.key.email === 1);
    expect(partialIdx).toBeDefined();
    expect(partialIdx.partialFilterExpression).toEqual({ status: 'active' });
  });
});
