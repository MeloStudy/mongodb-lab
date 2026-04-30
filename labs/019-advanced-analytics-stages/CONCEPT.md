# Concept: Advanced Analytics Stages

In this lab, we move beyond basic filtering and grouping into the realm of complex data orchestration. These stages allow MongoDB to perform operations that traditionally required significant application-side logic.

## 1. Relational Joins with `$lookup`

The `$lookup` stage performs a **Left Outer Join** to an unsharded collection in the same database (or a different one on the same cluster).

### Anatomy of a Join
```javascript
{
  $lookup: {
    from: "orders",        // The collection to join
    localField: "userId",   // Field from the input documents
    foreignField: "user",   // Field from the 'from' collection
    as: "userOrders"       // Output array field
  }
}
```

### Advanced `$lookup` (Subqueries)
Since MongoDB 3.6, `$lookup` can use a `pipeline` to perform more complex joins (Uncorrelated Subqueries).
- **`let`**: Defines variables from the input document to be used in the join pipeline.
- **`pipeline`**: Runs a full aggregation pipeline on the joined collection.

### ⚠️ The Sharding Join Limitation
**Critical Concept**: `$lookup` cannot be used to join a sharded collection to another sharded collection if they are not co-located. If your dataset is sharded, you must ensure the join keys are the shard keys, or perform application-side joins.

---

## 2. Recursive Search with `$graphLookup`

`$graphLookup` performs a recursive search on a collection. This is ideal for Org Charts, Social Networks, or Bill of Materials.

*   **`startWith`**: The starting point of the search.
*   **`connectFromField`**: The field in the current document to link to the next.
*   **`connectToField`**: The field in the next document to match.
*   **`maxDepth`**: Limits the recursion level (0 = starting document only).
*   **`depthField`**: Adds a field to each found document indicating its distance from the start.

---

## 3. Multi-Dimensional Analysis with `$facet`

The `$facet` stage allows you to process the same set of input documents through multiple parallel pipelines.

*   **Use Case**: E-commerce search results where you need a count of categories, a price range breakdown, and the actual product list—all in one request.
*   **Constraint**: Each facet output is a single document containing arrays. The total size of the final document must fit within the **16MB BSON limit**.

---

## 4. Persisting Results: `$out` vs `$merge`

Aggregation is usually read-only, but these two stages allow you to save results back to the database.

| Feature | `$out` | `$merge` (Recommended) |
| :--- | :--- | :--- |
| **Action** | Replaces the entire collection. | Incremental update (upsert/merge). |
| **Atomicity** | Atomic at the collection level. | Not atomic for the whole collection. |
| **Flexibility** | Destructive. | Non-destructive. Can update specific fields. |
| **Output DB** | Same DB only. | Any DB in the same cluster. |

---

## 5. Aggregation Engine Internals

### Blocking vs Non-Blocking Stages
- **Non-Blocking**: `$match`, `$project`. They stream documents one by one.
- **Blocking**: `$sort`, `$group`, `$facet`. They must consume all input before producing the first output.

### Memory Management
- **The 100MB Limit**: Each stage is limited to 100MB of RAM.
- **`allowDiskUse: true`**: Allows blocking stages to spill to temporary files on disk. 
- **Note**: `$facet` does NOT support `allowDiskUse`. This makes `$facet` dangerous for very large result sets.
