# Concept: MongoDB Indexing & The ESR Rule

Indexing is the single most important technique for optimizing MongoDB performance. Without indexes, MongoDB must perform a **Collection Scan (COLLSCAN)**, reading every single document to find those that match a query.

## 1. How B-Tree Indexes Work
MongoDB uses **B-Tree** structures to store index keys. This allows for:
- **O(log N)** search time (instead of O(N)).
- Efficient range queries.
- Ordered data retrieval (avoiding in-memory sorts).

## 2. The ESR Rule (Equality, Sort, Range)
When creating a **Compound Index**, the order of fields is critical. The golden rule is **ESR**:

1. **Equality (E)**: Fields that use exact matches (e.g., `{ status: "A" }`).
2. **Sort (S)**: The field you are sorting by (e.g., `.sort({ date: 1 })`).
3. **Range (R)**: Fields that use range operators (e.g., `{ amount: { $gt: 100 } }`).

**Why this order?**
- **E** narrows down the search space to a specific branch of the B-Tree.
- **S** ensures the documents in that branch are already in the order you need.
- **R** allows for a linear scan of the remaining documents.

If you put Range before Sort, MongoDB will find all documents in the range but then must perform a **blocking in-memory sort** because they are not contiguous in the index order.

## 3. Specialized Index Types

### Sparse Indexes
Only include documents that contain the indexed field.
- **Use Case**: A field like `discountCode` that only exists in 5% of documents.
- **Benefit**: Saves RAM and disk space.

### TTL (Time-To-Live) Indexes
Automated data expiration.
- **Use Case**: Sessions, logs, or temporary caches.
- **How it works**: A background thread (every 60s) removes expired documents based on a Date field.

### Partial Indexes
Index only documents that match a specific filter expression.
- **Use Case**: Indexing `email` only for `active: true` users.
- **Benefit**: Much smaller than Sparse indexes if the filter is restrictive.

## 4. Index Covering
A query is **covered** when all requested fields are part of the index.
- **Impact**: MongoDB retrieves the data directly from the index in RAM and **never touches the documents on disk**.
- **Detection**: `totalDocsExamined: 0` in the explain plan.
