# Concept: Specialized Data & GridFS

In most cases, MongoDB documents are small, but real-world engineering often requires handling large files, precise unique identifiers, and complex temporal data. This lab explores how to handle these "Specialized" data scenarios.

## 1. The 16MB Wall & GridFS

MongoDB limits the size of a single BSON document to **16 Megabytes**. This ensures that documents don't consume excessive RAM during processing or cause latency in network transmission.

### When to use GridFS?
If you need to store files (images, videos, PDFs) that exceed 16MB, **GridFS** is the native solution. 

### How GridFS works:
GridFS doesn't store the file in one piece. It divides the file into chunks:
- **`fs.files`**: Stores the file metadata (filename, upload date, total length, contentType).
- **`fs.chunks`**: Stores the actual binary data in blocks (default chunk size is 255KB).

When you query a file via GridFS, the driver automatically reassembles the chunks into a stream for your application.

## 2. Binary Data & UUIDs

MongoDB supports storing raw binary data using the `BinData` type. This is much more efficient than storing base64 strings.

### UUIDs (Universally Unique Identifiers)
While MongoDB's `ObjectId` is great, many systems use UUIDs for integration.
- **Subtype 4 (Standard)**: The modern, platform-independent BSON UUID.
- **Subtype 3 (Legacy)**: Used by older drivers (Java, C#, Python) which had different byte orderings. **Always prefer Subtype 4 for new projects.**

## 3. Date vs. Timestamp

These two types are often confused but serve very different purposes.

| Feature | `Date` (BSON Type 9) | `Timestamp` (BSON Type 17) |
| :--- | :--- | :--- |
| **Usage** | Application data (Birthdays, CreatedAt, etc.) | Internal MongoDB operations (Oplog, Sharding) |
| **Precision** | 64-bit integer (milliseconds since epoch) | 64-bit value (seconds + increment counter) |
| **Behavior** | Standard date/time object | Always unique within a second for the server |

**Rule of thumb**: If you are writing application code, you want `Date`. If you are building database tools or analyzing the oplog, you might encounter `Timestamp`.
