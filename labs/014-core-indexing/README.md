# LAB-014: Core Indexing & The ESR Rule

Master the art of query optimization by understanding how MongoDB traverses data and how to build efficient compound indexes.

## Prerequisites
- Docker & Docker Compose installed.
- Understanding of basic CRUD operations (Module 2).

## Lab Objectives
- Differentiate between `COLLSCAN` and `IXSCAN`.
- Master the **ESR Rule** for compound indexes.
- Optimize storage with **Sparse** and **Partial** indexes.
- Automate data cleanup with **TTL**.
- Achieve maximum performance with **Covered Queries**.

---

## 1. Setup Environment

Launch the containerized MongoDB environment:
```bash
docker-compose up -d
```
*Wait ~10 seconds for the `seed.js` script to populate 5,000 synthetic orders into the database.*

## 2. Scenario 1: The Efficiency Gap

### The Problem: Collection Scans
Enter the MongoDB shell and connect to the correct database:
```javascript
// Inside mongosh
use performance_db
```

Let's find a specific order by its `orderId` and ask MongoDB to explain *how* it executed the query:
```javascript
db.orders.find({ orderId: "ORD-02500" }).explain("executionStats")
```

**🔍 Analyze the Output**: Look at `executionStats.totalDocsExamined`. It should be `5000`. 
**Why did this happen?** Because MongoDB has no "map" or "index" to find `ORD-02500`, it is forced to read every single one of the 5,000 documents from the hard drive into RAM just to check if the ID matches. This is called a **Collection Scan (COLLSCAN)**. It is extremely expensive in terms of CPU and Disk I/O.

### The Solution: B-Tree Indexes
To fix this, we create a B-Tree index on `orderId`. This index acts like a book's index, mapping the ID directly to the document's physical location on disk.
```javascript
db.orders.createIndex({ orderId: 1 }, { unique: true })
```

**🔍 Re-analyze the Output**:
Run the `explain()` query again.
`totalDocsExamined` is now `1`! MongoDB traversed the B-Tree in $O(\\log N)$ time and loaded exactly 1 document into RAM. The plan is now an **Index Scan (IXSCAN)**.

## 3. Scenario 2: Mastering the ESR Rule

### The Problem: In-Memory Sorting
Consider a query where we find shipped orders over $100 and want them sorted chronologically.
```javascript
db.orders.find(
  { status: "shipped", totalAmount: { $gt: 100 } }
).sort({ orderDate: 1 }).explain("queryPlanner")
```
Without the right index, MongoDB will find the documents, load them into RAM, and manually sort them (a `SORT` stage). In-memory sorts are slow and block the CPU.

### The Solution: ESR (Equality -> Sort -> Range)
To create the perfect compound index, the order of the fields is critical.
1. **Equality (`status`)**: Filters the B-Tree down to a single branch (only "shipped").
2. **Sort (`orderDate`)**: Ensures that within that "shipped" branch, the data is already chronologically ordered.
3. **Range (`totalAmount`)**: Scans the already filtered and sorted branch for amounts > 100.

Create the ESR-compliant index:
```javascript
db.orders.createIndex({ status: 1, orderDate: 1, totalAmount: 1 })
```

**🔍 Analyze the Output**:
Check the explain plan again. The `SORT` stage has completely disappeared! The data is retrieved naturally sorted from the B-Tree.

## 4. Scenario 3, 4 & 6: Specialized Tuning

### Sparse Indexes (Saving RAM)
If a field like `discountCode` is rarely used (e.g., only 5% of orders have one), a standard index would waste memory storing `null` for the other 95%. A **Sparse Index** only indexes documents where the field actually exists, keeping the B-Tree tiny.
```javascript
db.orders.createIndex({ discountCode: 1 }, { sparse: true })
```

### TTL Indexes (Automated Cleanup)
Instead of writing a cron-job to delete old session data, MongoDB can do it automatically. A **TTL (Time-To-Live) Index** runs a background thread that drops documents a certain number of seconds after their timestamp.
```javascript
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 })
```

### Partial Indexes (Selective Efficiency)
Similar to Sparse, but with logical conditions. If we only query `email` for active users, we can tell the index to completely ignore suspended or deleted accounts.
```javascript
db.users.createIndex(
  { email: 1 }, 
  { partialFilterExpression: { status: "active" } }
)
```

## 5. Scenario 5: Covered Queries (Zero-Fetch)

### The Holy Grail of Query Performance
Even with an `IXSCAN`, MongoDB still has to fetch the document from disk to RAM. But what if the data you requested is *already* inside the index itself?

Execute this query, where we project (`{ _id: 0, status: 1... }`) only the exact fields that exist in our ESR index:
```javascript
db.orders.find(
  { status: "shipped" }, 
  { status: 1, orderDate: 1, totalAmount: 1, _id: 0 }
).explain("executionStats")
```

**🔍 Analyze the Output**: 
`totalDocsExamined` is `0`! MongoDB returned the results directly from the B-Tree (which lives in fast RAM). It never touched the hard drive. This is called a **Covered Query**.

**💡 Why did this happen?**
Normally, MongoDB performs an `IXSCAN` (finding the location) followed by a `FETCH` (reading the document from disk). In this case, MongoDB realized it didn't need the `FETCH` stage because:
1. **Index Coverage**: All fields in the filter (`status`) and all fields in the projection (`status`, `orderDate`, `totalAmount`) are already present in our compound index.
2. **The `_id` Constraint**: By default, MongoDB always tries to return the `_id`. Since our compound index does **not** contain `_id`, we had to explicitly exclude it (`_id: 0`). If we hadn't, MongoDB would have been forced to go to disk just to retrieve the `_id`, breaking the "Covered" status.

*Result: You are reading data at the speed of RAM, bypassing the storage engine's document-level locks and disk I/O entirely.*

---

## 🛠 Command Dissection

| Command | Purpose | Educational Context |
| :--- | :--- | :--- |
| `createIndex()` | Creates a new B-Tree index | Trading write performance and storage space to gain read speed. |
| `explain("executionStats")` | Audits query execution | Used to prove performance gains (e.g. `totalDocsExamined`). |

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
