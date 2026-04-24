# Concept: Document Structuring (Embedding vs Referencing)

In MongoDB, schema design is driven by **Access Patterns**. Unlike relational databases where you normalize data into separate tables to avoid redundancy, MongoDB allows you to **Embed** related data within a single document.

## 1. Embedding (Denormalization)

Embedding is the practice of including related data (sub-documents or arrays) inside a single document.

### Advantages:
- **Performance**: You get all the data in a single read operation (no Joins).
- **Atomicity**: Updates to the document and its embedded data are atomic.
- **Locality**: Related data is stored together on disk.

### Use Cases:
- **1:1 Relationships**: When the related entity is always read with the main one (e.g., User Preferences).
- **1:N (One-to-Few)**: When the "N" is small and bounded (e.g., A user with 2-3 addresses).

---

## 2. Referencing (Normalization)

Referencing is the practice of storing data in separate collections and linking them using an identifier (usually the `_id` of the parent).

### Use Cases:
- **1:N (One-to-Many / One-to-Squillions)**: When the number of related items can grow indefinitely (e.g., A blog post with thousands of comments, or a user with millions of log entries).
- **Large Documents**: When embedding data would push the document size close to the **16MB limit**.
- **Data Deduplication**: When the related data is shared by many entities and changes frequently.

---

## 3. The 16MB Limit & `bsonsize`

Every single document in MongoDB has a hard limit of **16 Megabytes** (**16,777,216 bytes**). While this sounds like a lot for text, a document with thousands of large embedded sub-documents can hit this limit, causing `DocumentTooLarge` errors.

### Tooling: `bsonsize()`
You can measure the size of a document in bytes using the native `mongosh` helper:

```javascript
// Measure a single document
bsonsize(db.users.findOne({ username: "jdoe" }))
```

**Rule of Thumb**: If you expect an array to grow beyond a few hundred items, or if the document size starts growing uncontrollably, you MUST move that data to a separate collection using **Referencing**.

---

## 4. BSON Nesting Depth Limit

MongoDB supports a maximum nesting depth of **100 levels** for BSON documents. 

While it is very rare to reach this limit in a well-designed schema, it serves as a technical guardrail against **Deep Nesting Anti-patterns**. If your schema requires more than 100 levels, you are likely trying to model data in a way that is too hierarchical for efficient querying and should consider flattening the structure or using Referencing.

### Troubleshooting: Nesting Errors
Unlike the 16MB limit, there is no direct helper like `bsonsize` to measure depth. Validation happens at **Write-time**. If you exceed this limit, MongoDB will reject the operation and throw:
> `BSONObject too deep` or `cannot nest at this depth`

---

## 5. The Decision Matrix

| Factor | Embedding | Referencing |
| :--- | :--- | :--- |
| **Access Pattern** | Data accessed together. | Data accessed independently. |
| **Growth** | Bounded / Small list. | Unbounded / Large list. |
| **Atomicity** | Required across entities. | Not strictly required. |
| **Join Cost** | Zero (Embedded). | High (Requires `$lookup` or multiple queries). |
