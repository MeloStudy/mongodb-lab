const { MongoClient } = require('mongodb');

describe('Scenario 1: Proximity Search ($nearSphere)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017');
    db = connection.db('geo_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-002: Should verify that a 2dsphere index exists on the location field', async () => {
    const collection = db.collection('cafes');
    const indexes = await collection.indexes();
    const has2dSphere = indexes.some(idx => idx.key.location === '2dsphere');
    expect(has2dSphere).toBe(true);
  });

  test('LO-003: $nearSphere should return cafes sorted by distance within maxDistance', async () => {
    const collection = db.collection('cafes');
    
    // Simulating user location near Kennedy Park, Miraflores (Lima)
    const userLocation = [-77.0300, -12.1200];
    
    const nearbyCafes = await collection.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: userLocation
          },
          $maxDistance: 2000 // 2 km
        }
      }
    }).toArray();

    // Should find Miraflores Coffee first as it is closest
    expect(nearbyCafes.length).toBeGreaterThan(0);
    expect(nearbyCafes[0].name).toBe('Miraflores Coffee');
  });
});
