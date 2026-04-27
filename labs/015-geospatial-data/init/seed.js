db = db.getSiblingDB('geo_db');

// Explicitly creating 2dsphere indexes is part of the lab instructions, 
// but we create one for zones here so intersections work if needed directly, 
// though the learner will create the cafe index in Scenario 1. 
// We will drop the cafe index so the learner can create it.
db.zones.createIndex({ area: "2dsphere" });

// Seed Cafes in Lima (Longitude, Latitude)
db.cafes.insertMany([
  { name: "Cafe Central (Centro)", location: { type: "Point", coordinates: [-77.0428, -12.0464] }, rating: 4.5 },
  { name: "Miraflores Coffee", location: { type: "Point", coordinates: [-77.0282, -12.1211] }, rating: 4.8 },
  { name: "Barranco Roasters", location: { type: "Point", coordinates: [-77.0210, -12.1450] }, rating: 4.7 },
  { name: "San Isidro Brew", location: { type: "Point", coordinates: [-77.0322, -12.0968] }, rating: 4.2 },
  { name: "Surco Espresso", location: { type: "Point", coordinates: [-76.9942, -12.1388] }, rating: 4.0 },
  { name: "Callao Port Coffee", location: { type: "Point", coordinates: [-77.1400, -12.0500] }, rating: 3.9 }
]);

// Seed Zones (Polygons for Delivery Zones)
db.zones.insertMany([
  {
    name: "Miraflores Delivery Zone",
    area: {
      type: "Polygon",
      coordinates: [
        [
          [-77.0400, -12.1100],
          [-77.0150, -12.1100],
          [-77.0150, -12.1350],
          [-77.0400, -12.1350],
          [-77.0400, -12.1100] // Close the loop
        ]
      ]
    }
  },
  {
    name: "Centro Historico Zone",
    area: {
      type: "Polygon",
      coordinates: [
        [
          [-77.0500, -12.0300],
          [-77.0300, -12.0300],
          [-77.0300, -12.0600],
          [-77.0500, -12.0600],
          [-77.0500, -12.0300] // Close the loop
        ]
      ]
    }
  }
]);

print("✅ Geospatial data seeded successfully for Lima, Peru in geo_db.");
