const { MongoClient } = require('mongodb');

describe('Scenario 2: Area Filtering ($geoWithin)', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://127.0.0.1:27017');
    db = connection.db('geo_db');
  });

  afterAll(async () => {
    await connection.close();
  });

  test('LO-004: $geoWithin should return only cafes inside the delivery zone polygon', async () => {
    const cafes = db.collection('cafes');
    const zones = db.collection('zones');
    
    // Fetch the Miraflores zone
    const mirafloresZone = await zones.findOne({ name: "Miraflores Delivery Zone" });
    expect(mirafloresZone).toBeDefined();

    // Query cafes inside the zone
    const cafesInZone = await cafes.find({
      location: {
        $geoWithin: {
          $geometry: mirafloresZone.area
        }
      }
    }).toArray();

    // Miraflores Coffee should be inside, but Centro or Callao should not
    expect(cafesInZone.length).toBe(1);
    expect(cafesInZone[0].name).toBe('Miraflores Coffee');
  });
});
