# Concept: MongoDB Indexing & The ESR Rule

Indexing is the single most important technique for optimizing MongoDB performance. Without indexes, MongoDB must perform a **Collection Scan (COLLSCAN)**, reading every single document from disk into memory to evaluate a query, which results in O(N) complexity and massive I/O bottlenecks.

## 1. Internal Mechanics: B-Trees & Disk I/O
MongoDB utilizes **B-Tree (Balanced Tree)** data structures to store index keys. 
- **O(log N) Complexity**: The tree structure allows the database to traverse branches logarithmically, finding documents among billions of records in a few operations.
- **Disk Page Loading**: B-Tree nodes correspond to disk pages. By navigating the B-Tree, MongoDB only loads the specific disk pages into the WiredTiger cache (RAM) that contain the matching index keys, drastically reducing Disk I/O.
- **In-Memory Sorting**: Data in a B-Tree is intrinsically sorted. Querying along an index path avoids CPU-intensive and memory-blocking in-memory sorts.

## 2. Core Index Types

### Single Field Indexes
Indexes a single field. MongoDB can traverse a single-field index in both ascending and descending order, meaning the defined direction (`1` or `-1`) generally does not matter for single fields.

### Compound Indexes
Indexes multiple fields. The structure creates a hierarchical B-Tree where the first field establishes the primary sorting, and subsequent fields sort within those primary buckets.
The direction (`1` or `-1`) **does** matter in compound indexes when sorting on multiple fields simultaneously (e.g., `{ date: 1, score: -1 }`).

### Multikey Indexes (Arrays)
When an index is placed on an array field, MongoDB automatically creates a **Multikey Index**.
- **Index Explosion**: MongoDB creates a separate index entry for *every* element in the array. 
- **Memory Impact**: Because of index explosion, Multikey indexes consume significantly more RAM and disk space. 
- **Limitation**: A compound index cannot include more than one array field, as the Cartesian product of the elements would cause an exponential explosion of index entries.

### Hashed Indexes
Calculates the hash of a field's value to store in the index.
- **Complexity**: O(1) exact match lookup instead of O(log N).
- **Limitation**: Cannot be used for range queries (`$gt`, `$lt`) because the hashing scrambles the original ordering.
- **Primary Use**: Essential for **Sharding**, ensuring an even distribution of documents across shards.

### Text Indexes
Provides advanced full-text search capabilities (Lucene-like features natively).
- **Tokenization**: It drops stop words (e.g., "the", "and") and applies language-specific stemming (e.g., storing "run" for "running").
- **Mechanics**: It creates an index of the individual tokens, mapping them back to the documents.

## 3. The ESR Rule (Equality, Sort, Range)
When creating a **Compound Index**, the order of fields is critical for performance. The golden rule is **ESR**:

1. **Equality (E)**: Fields that use exact matches (e.g., `{ status: "A" }`).
2. **Sort (S)**: The field you are sorting by (e.g., `.sort({ date: 1 })`).
3. **Range (R)**: Fields that use range operators (e.g., `{ amount: { $gt: 100 } }`).

**Why this specific structure?**
- **E** (Equality) acts as the root filter, immediately narrowing down the B-Tree search space to a specific, continuous branch.
- **S** (Sort) ensures that the documents retrieved from that specific branch are *already in the desired order*, avoiding a blocking, high-RAM in-memory sort.
- **R** (Range) must come last because once a range traversal begins, the B-Tree is scanned linearly, and any subsequent sorting rules in the index cannot be utilized sequentially. If Range comes before Sort, MongoDB finds the range, but then must perform a blocking in-memory sort.

## 4. Specialized Index Modifiers

### Sparse Indexes
Only include documents that contain the indexed field.
- **Memory Efficiency**: Saves RAM and disk space by not storing `null` entries for documents missing the field.
- **Use Case**: Indexing a field like `discountCode` that only exists in 5% of documents.

### TTL (Time-To-Live) Indexes
Automated data expiration via a background thread.
- **Mechanics**: A background thread wakes up (default every 60s) and issues a delete command for documents where the indexed Date field is older than the specified limit.
- **Use Case**: Expiring sessions, logs, or temporary caches.

### Partial Indexes (Preferred over Sparse)
Index only documents that match a specific filter expression.
- **Mechanics**: Much more flexible than Sparse indexes. You can define rules like `partialFilterExpression: { active: true }`.
- **Benefit**: Keeps the B-Tree extremely small and efficient by excluding irrelevant documents entirely.

## 5. Index Covering
A query is **covered** when *all* fields specified in the query filter AND the projection are present in the index.
- **Performance Impact**: MongoDB retrieves the data directly from the index residing in RAM and **never touches the documents on disk**.
- **Detection**: The `explain()` plan will show `totalDocsExamined: 0` and `totalKeysExamined: N`.
