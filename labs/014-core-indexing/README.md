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
*Wait ~10 seconds for the `seed.js` script to populate 5,000 orders.*

## 2. Scenario 1: The Efficiency Gap

Find an order by `orderId` and analyze its performance:
```javascript
// Inside mongosh
db.orders.find({ orderId: "ORD-02500" }).explain("executionStats")
```
**Observation**: Look at `executionStats.totalDocsExamined`. It should be 5,000 (**COLLSCAN**).

**Fix it**:
```javascript
db.orders.createIndex({ orderId: 1 }, { unique: true })
```
Run the explain again. `totalDocsExamined` is now 1 (**IXSCAN**).

## 3. Scenario 2: Mastering the ESR Rule

Query: Find shipped orders with amount > 100, sorted by date.
```javascript
db.orders.find(
  { status: "shipped", totalAmount: { $gt: 100 } }
).sort({ orderDate: 1 }).explain("queryPlanner")
```

**Apply ESR (Equality -> Sort -> Range)**:
```javascript
db.orders.createIndex({ status: 1, orderDate: 1, totalAmount: 1 })
```
Check the explain plan. The `SORT` stage should have disappeared.

## 4. Scenario 3, 4 & 6: Specialized Tuning

### Sparse Index
```javascript
db.orders.createIndex({ discountCode: 1 }, { sparse: true })
```

### TTL Index (Session Cleanup)
```javascript
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 })
```

### Partial Index (Selective Efficiency)
```javascript
db.users.createIndex(
  { email: 1 }, 
  { partialFilterExpression: { status: "active" } }
)
```

## 5. Scenario 5: Covered Queries (Zero-Fetch)

Execute a query where only index fields are requested:
```javascript
db.orders.find(
  { status: "shipped" }, 
  { status: 1, orderDate: 1, totalAmount: 1, _id: 0 }
).explain("executionStats")
```
**Victory**: `totalDocsExamined` is 0. Data was served entirely from RAM.

---

## 🛠 Command Dissection

| Command | Purpose | Key Options |
| :--- | :--- | :--- |
| `createIndex()` | Creates a new B-Tree index | `unique`, `sparse`, `expireAfterSeconds`, `partialFilterExpression` |
| `explain()` | Audits query execution | `"queryPlanner"`, `"executionStats"`, `"allPlansExecution"` |
| `getIndexes()` | Lists all collection indexes | N/A |

## 🧪 Validation
Verify your work with the automated test suite:
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v
```
