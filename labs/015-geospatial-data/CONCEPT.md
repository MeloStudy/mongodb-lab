# Geospatial Engineering in MongoDB

Handling location data is fundamentally different from handling standard strings or numbers. The Earth is a sphere, meaning Euclidean (flat) geometry is mathematically incorrect for calculating distances between GPS coordinates.

## 1. The GeoJSON Standard

MongoDB uses the industry-standard **GeoJSON** format to store spatial data.

### ⚠️ The Golden Rule: Longitude First
The most common mistake engineers make is inserting coordinates in `[Latitude, Longitude]` order (which is how Google Maps displays them). 
GeoJSON **strictly dictates** the order must be `[Longitude, Latitude]`.

Think of it like an X, Y graph:
- **Longitude** is the X-axis (East/West).
- **Latitude** is the Y-axis (North/South).
*Math always demands (X, Y).*

```json
{
  "location": {
    "type": "Point",
    "coordinates": [-77.0428, -12.0464] // [Lng, Lat] for Lima, Peru
  }
}
```

### Supported Shapes
MongoDB supports various GeoJSON objects:
- **Point**: A single coordinate (e.g., a Cafe).
- **LineString**: An array of coordinates forming a path (e.g., a Delivery Route).
- **Polygon**: A closed array of coordinates (the first and last point must be identical) forming an area (e.g., a Delivery Zone).

## 2. The Spherical Engine: `2dsphere` vs `2d`

MongoDB offers two types of geospatial indexes:

1. **`2dsphere` (Modern)**: Calculates geometries on an Earth-like sphere. Distances are calculated in **Meters**. This is what you should use 99% of the time.
2. **`2d` (Legacy)**: Calculates geometries on a flat, Euclidean plane. Used mostly for 2D game grids or flat architectural plans.

### The Mathematics of Spherical Distortion
Why is `2dsphere` necessary? Because the distance between two lines of longitude at the Equator is roughly 111 km, but at the poles, the distance is 0 km. A flat `2d` calculation would assume the distance is identical everywhere, causing massive routing errors in production apps.

## 3. Spatial Operators

- **`$nearSphere`**: Sorts documents from nearest to farthest. Requires a geospatial index.
- **`$geoWithin`**: Filters documents that are completely enclosed within a given geometry (like a Polygon).
- **`$geoIntersects`**: Filters documents whose geometry overlaps with another geometry in any way.
- **`$geoNear`**: An Aggregation Pipeline stage that acts like `$nearSphere` but allows you to output the exact calculated distance into a new field.
