# LAB-015: Geospatial Data

Welcome to the Geospatial engineering masterclass. You will learn how to model real GPS data, index it using spherical mathematics, and execute proximity algorithms.

All scenarios in this lab take place in **Lima, Peru**.

## Prerequisites
- Docker & Docker Compose.
- Completion of LAB-014 (Core Indexing).

---

## 1. Environment Setup

Launch the laboratory container:
```bash
docker-compose up -d
```
*Wait ~10 seconds. The `seed.js` script will populate the `geo_db` database with cafeterias and delivery zones in Lima.*

Enter the shell:
```bash
docker exec -it mongodb_lab_015 mongosh geo_db
```

---

## 2. Scenario 1: The Coffee Hunter (`$nearSphere`)

### The Problem
You are standing near Kennedy Park in Miraflores (Longitude: `-77.0300`, Latitude: `-12.1200`) and want to find a coffee shop within a 2-kilometer radius. 

### The Solution: `2dsphere` Indexing
Spatial algorithms require massive CPU power to calculate Earth's curvature. MongoDB refuses to run `$nearSphere` queries without an index.

Let's create the spherical index on our `cafes` collection:
```javascript
db.cafes.createIndex({ location: "2dsphere" })
```

Now, execute the proximity search. We use `$nearSphere` to calculate distance over Earth's curvature, and limit the radius to 2,000 meters:
```javascript
db.cafes.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-77.0300, -12.1200]
      },
      $maxDistance: 2000
    }
  }
})
```
**🔍 Analyze the Output**:
Notice the results? MongoDB automatically sorts the output from closest to furthest. *Miraflores Coffee* appears first because it is physically closer to our origin point.

---

## 3. Scenario 2: The Delivery Zone (`$geoWithin`)

### The Problem
You have drawn a polygonal boundary representing the "Miraflores Delivery Zone" in your system. You need to find all cafes that are strictly *inside* this polygon.

### The Solution: Polygon Containment
First, let's fetch our pre-seeded zone from the database and store it in a variable for convenience:
```javascript
let zone = db.zones.findOne({ name: "Miraflores Delivery Zone" })
```

Now, we use `$geoWithin`. This operator does not sort by distance; it simply filters (returns true/false) if a point is contained inside the geometric bounds:
```javascript
db.cafes.find({
  location: {
    $geoWithin: {
      $geometry: zone.area
    }
  }
})
```
**🔍 Analyze the Output**:
Only cafes that are geographically within the bounds of the Miraflores polygon are returned. *Cafe Central*, which is in the Downtown (Centro) area, is excluded.

---

## 4. Scenario 3: The Route Auditor (`$geoIntersects`)

### The Problem
A delivery driver has a route (a line from Barranco to San Isidro). We need to know if their route crosses through our "Miraflores Delivery Zone" at any point.

### The Solution: Intersection Algorithms
We define the route as a GeoJSON `LineString`:
```javascript
let route = {
  type: "LineString",
  coordinates: [
    [-77.0210, -12.1450], // Start: Barranco
    [-77.0300, -12.1200], // Middle: Miraflores
    [-77.0322, -12.0968]  // End: San Isidro
  ]
}
```

Now, query the `zones` collection to find any zone that this line touches or crosses:
```javascript
db.zones.find({
  area: {
    $geoIntersects: {
      $geometry: route
    }
  }
})
```
**🔍 Analyze the Output**:
The query successfully returns the "Miraflores Delivery Zone" document, proving that the route physically overlaps with the polygon's area.

---

## 5. Scenario 4: Distance Analytics (`$geoNear`)

### The Problem
`$nearSphere` gave us the closest cafes, but our frontend application needs to display the *exact distance in meters* ("345m away") next to each cafe name.

### The Solution: Aggregation Pipelines
Standard `find()` queries cannot mutate documents to inject new calculated fields. For this, we must use the Aggregation Framework with the `$geoNear` stage:

```javascript
db.cafes.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [-77.0300, -12.1200] },
      distanceField: "distanceInMeters",
      spherical: true
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      distanceInMeters: { $round: ["$distanceInMeters", 0] }
    }
  }
])
```
**🔍 Analyze the Output**:
Look at the output! MongoDB calculated the exact distance using spherical geometry, injected it into a new field called `distanceInMeters`, and passed it to the `$project` stage where we rounded it to 0 decimals for a clean UI presentation.

---

## 🛠 Command Dissection

| Spatial Operator | Purpose | Technical Detail |
| :--- | :--- | :--- |
| `2dsphere` | Index Creation | Required for `$nearSphere` queries. Builds a specialized B-Tree for geometry. |
| `$nearSphere` | Proximity Search | Returns documents sorted by distance. Uses Meters for calculation. |
| `$geoWithin` | Area Filtering | Does not require an index (though highly recommended). Does not sort by distance. |
| `$geoIntersects` | Overlap Detection | Works with Lines, Polygons, and Points crossing each other. |
| `$geoNear` | Distance Analytics | MUST be the very first stage in an aggregation pipeline. Injects calculated distances. |

## 🧪 Validation
Exit `mongosh` (`exit`) and run the validation suite to prove your configurations:
```bash
npm test
```

## 🧹 Cleanup
Tear down the environment and wipe the data volumes:
```bash
docker-compose down -v --remove-orphans
```
