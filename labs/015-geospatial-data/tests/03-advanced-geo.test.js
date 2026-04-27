const { MongoClient } = require('mongodb');

describe('Scenario 3 & 4: Advanced Geometry ($geoIntersects & $geoNear)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017');
    db = connection.db('geo_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-006: $geoIntersects should detect if a delivery route crosses a specific zone', async () => {
    const zones = db.collection('zones');
    
    // Delivery route from Barranco to San Isidro crossing through Miraflores
    const deliveryRoute = {
      type: "LineString",
      coordinates: [
        [-77.0210, -12.1450], // Barranco
        [-77.0300, -12.1200], // Through Miraflores
        [-77.0322, -12.0968]  // San Isidro
      ]
    };

    const crossedZones = await zones.find({
      area: {
        $geoIntersects: {
          $geometry: deliveryRoute
        }
      }
    }).toArray();

    expect(crossedZones.length).toBe(1);
    expect(crossedZones[0].name).toBe("Miraflores Delivery Zone");
  });

  test('LO-005: $geoNear should calculate and output exact distance in meters', async () => {
    const cafes = db.collection('cafes');
    
    const userLocation = [-77.0300, -12.1200];
    
    const results = await cafes.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: userLocation },
          distanceField: "distanceInMeters",
          spherical: true
        }
      }
    ]).toArray();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].distanceInMeters).toBeDefined();
    expect(typeof results[0].distanceInMeters).toBe('number');
  });
});
