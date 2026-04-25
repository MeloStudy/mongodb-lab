# CONCEPT: Schema Evolution & Versioning

In MongoDB, "Schema-less" does not mean "Schema-free". It means **Flexible Schema**. Applications evolve, and their data structure must evolve too without causing downtime or expensive "Big Bang" migrations.

## 1. The Schema Versioning Pattern

Instead of assuming all documents in a collection have the same shape, we add a `schema_version` field. 

- **Version 1 (Implicit)**: Documents created before the pattern was implemented (usually identified by the absence of the version field).
- **Version 2**: The new structure.

This allows the application to handle documents of different shapes simultaneously.

---

## 2. Living in the Hybrid State: Polymorphism

While a collection is in a "mixed state" (V1 and V2 living together), your application and queries must be **Polymorphic** (aware of multiple forms).

**Example: Searching for a user by name**
If you don't know if the user is V1 or V2, you must search both fields:
```javascript
db.users.find({
  $or: [
    { name: "John Doe" },
    { first_name: "John", last_name: "Doe" }
  ]
})
```
### The Price of Flexibility
*   **Query Complexity**: Application code becomes harder to maintain as versions increase.
*   **Performance**: If `name` and `first_name` are indexed separately, MongoDB might need to scan multiple indices or perform a collection scan if not careful.
*   **Consistency**: Data can become fragmented if the migration is left in a "Lazy" state for too long.

---

## 3. Evolution Strategies: Lazy vs Eager

Once the pattern is implemented, you need to decide how to migrate the legacy data. There are two primary philosophies:

### A. Lazy Migration (The "Just-in-Time" approach)
The migration happens inside the **Application Code**. The database remains in a hybrid state indefinitely.
- **How it works**: When the application reads a document, it checks the `schema_version`. If it's an old version, the application transforms the object in memory and optionally saves the updated version back to the database.
- **Workflow**: `Find` -> `Check Version` -> `Transform in Memory` -> `Save (Update)`.

### B. Eager Migration (The "Bulk" approach)
The migration is a **Proactive Process** that runs across the entire collection at once, usually at the database level.
- **How it works**: A script or an aggregation pipeline is executed to find all documents that don't match the target version and update them in a single batch operation.
- **Workflow**: `Find All Old` -> `Transform All` -> `Overwrite All`.

---

### Comparison: When to use which?

| Feature | Lazy (On-the-fly) | Eager (Bulk) |
| :--- | :--- | :--- |
| **Trigger** | Upon user access (Read/Write). | Manual or scheduled batch. |
| **Complexity** | High (App must handle N versions). | Low (App only handles V-Latest). |
| **Impact** | Distributed over time. | Immediate resource spike. |
| **Data State** | Partially migrated (Hybrid). | Fully migrated (Consistent). |
| **Best for** | Massive datasets, legacy systems. | Critical schema changes, small/medium collections. |


---

## 4. Transformation Engine: Aggregation Framework

To perform an **Eager Migration** efficiently, we use the Aggregation Framework. Think of it as an **Assembly Line** (Pipeline) where documents flow through stages.

### Basic Anatomy
```javascript
db.collection.aggregate([
  { $match: { ... } },   // Stage 1: Filter
  { $addFields: { ... } }, // Stage 2: Transform
  { $merge: { ... } }    // Stage 3: Persist
])
```

### Crash Course: The Transformation Toolkit

When migrating data, we often need to perform "data surgery" using advanced operators within an aggregation pipeline.

| Operator | Purpose | Conceptual Analogy |
| :--- | :--- | :--- |
| **`$match`** | Filters documents to only process those needing migration. | The "Quality Control" gate. |
| **`$split`** | Breaks a string into an array (e.g., `name` -> `[First, Last]`). | The "Disassembler". |
| **`$arrayElemAt`** | Extracts a specific element from an array by its index. | The "Picker". |
| **`$slice`** | Returns a subset of an array (e.g., everything except the first word). | The "Trimmer". |
| **`$reduce`** | Iterates through an array to build a single result (e.g., joining name parts). | The "Accumulator". |
| **`$cond`** | Evaluates a boolean condition and returns one of two values. | The "Decision Maker" (If/Then/Else). |
| **`$concat`** | Joins multiple strings into one. | The "Gluer". |
| **`$project`** | Reshapes the document by including, excluding, or renaming fields. | The "Cleanup Crew". |
| **`$merge`** | Writes the pipeline results back into a collection atomically. | The "Final Commitment". |

---

## 5. Masterclass: Robust String Re-Assembly

In this lab, we handle names like *"Alice Van Wonderland"*. A simple split into two fields isn't enough. We must use a combination of operators:

1.  **Split**: `name` -> `["Alice", "Van", "Wonderland"]`.
2.  **First Name**: Use `$arrayElemAt` for index `0`.
3.  **Last Name**: 
    *   `$slice` the array from index `1` to the end -> `["Van", "Wonderland"]`.
    *   `$reduce` that sub-array to join them with spaces.
    *   **The `$cond` logic**: Inside `$reduce`, we check if the accumulator (`$$value`) is empty. If it is, we don't add a space; otherwise, we add a space before the next word. This prevents trailing/leading space issues.

## 6. The $merge Closer
Unlike `$out` (which replaces an entire collection), **`$merge`** allows you to:
- Target an existing collection.
- Match documents by `_id`.
- Update only the fields that changed while keeping the rest of the document intact.

This is what makes **Eager Migration** safe for production use.

