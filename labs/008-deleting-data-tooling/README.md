# LAB-008: Deleting Data & Tooling

Master the art of data removal and explore your database visually using MongoDB Compass. In this lab, you will learn to distinguish between surgical deletions (DML) and structural destruction (DDL).

## 🎯 Objectives
- Perform surgical deletions with `deleteOne`.
- Execute bulk cleanups with `deleteMany`.
- Understand the performance benefits of `drop()`.
- Use **MongoDB Compass** to analyze your data schema and execution plans.

---

## 🛠️ Step 1: Environment Setup

1. **Spin up the container**:
   ```bash
   docker-compose up -d
   ```

2. **Generate dirty data**:
   Run the seeder to populate the `factory` collection with mixed records (Healthy, Corrupted, and Malfunctioning):
   ```bash
   node generate-dirty-data.js
   ```

---

## 🧪 Step 2: Scenario 1 - Surgical Deletion (DML)

You have identified a specific probe (`Malfunctioning-Probe`) that is sending critical alerts and needs to be removed from the active monitoring collection.

1. **Identify the target**:
   Connect via `mongosh` and find the document to confirm its existence:
   ```bash
   docker exec -it mongodb_lab_008 mongosh "mongodb://localhost:27017/lab_db"
   ```

2. **Delete by ID**:
   Execute the deletion using its unique UUID:
   ```javascript
   db.factory.deleteOne({ _id: UUID("00000000-0000-4000-a000-000000000001") })
   ```

### 🔍 Command Dissection: `deleteOne`

| Component | Description |
| :--- | :--- |
| `db.factory` | The target collection. |
| `.deleteOne(...)` | Method that removes the **first** document matching the filter. |
| `{ _id: ... }` | The filter object. Using `_id` ensures we are surgical and don't delete other records. |
| `UUID("...")` | A BSON helper that ensures the string is treated as a Binary Subtype 4 object. |

---

## 🧪 Step 3: Scenario 2 - Bulk Cleanup (DML)

The system has flagged several documents with `status: "failed"`. These are garbage records that need to be cleared in bulk.

1. **Perform Bulk Delete**:
   ```javascript
   db.factory.deleteMany({ status: "failed" })
   ```

2. **Verify with a Count**:
   Ensure only the 3 healthy (`active`) documents remain:
   ```javascript
   db.factory.countDocuments()
   ```

### 🔍 Command Dissection: `deleteMany`

| Component | Description |
| :--- | :--- |
| `.deleteMany(...)` | Method that removes **all** documents matching the filter. |
| `{ status: "failed" }` | The filter criteria. Every document matching this will be permanently removed. |
| `{}` (Empty) | If you passed an empty object `{}`, it would remove ALL documents but keep the collection and its indexes. |

---

## ✅ Step 4: Mid-Lab Validation (DML)

Before proceeding to destroy the structures, verify that your DML operations were correct:

```bash
# Run only the DML test suite
npx jest tests/01-delete-ops.test.js
```

---

## 🧪 Step 5: Scenario 3 - Structural Destruction (DDL)

Now that you've handled data, learn how to reset the environment by destroying the collection and the database.

1. **Drop the Collection**:
   ```javascript
   db.factory.drop()
   ```

2. **Drop the Database**:
   ```javascript
   db.dropDatabase()
   ```

### 🔍 Command Dissection: DDL Operations

| Command | Description | Impact |
| :--- | :--- | :--- |
| `db.collection.drop()` | Destroys the collection and all its **indexes**. | Extremely fast. Metadata is removed. |
| `db.dropDatabase()` | Destroys the current database and **all collections** within it. | Final cleanup. Irreversible. |

---

## 🧭 Step 6: Tooling - MongoDB Compass

1. **Connect**: Open Compass and use: `mongodb://localhost:27017`.
2. **Schema Discovery**:
   - (Optional) Re-run `node generate-dirty-data.js` to have data to look at.
   - Go to `lab_db.factory` -> **Schema** tab -> **Analyze Schema**.
   - Notice how Compass visualizes the distribution of `status` (active vs failed).
3. **Visual Explain**:
   - Stay in the **Documents** tab of the `lab_db.factory` collection.
   - In the **Filter** bar, enter: `{ status: "active" }`.
   - Click the **Explain** button (found to the right of the **Filter** bar).
   - Observe the visual tree in the **Explain Plan** view showing a `COLLSCAN` (Collection Scan).

   > [!IMPORTANT]
   > A **COLLSCAN** (Collection Scan) means MongoDB had to read every single document to find the results. While fine for our tiny lab, this is extremely inefficient for production data. In **Module 4**, you will learn how to transform these into fast **IXSCAN** (Index Scans).

---

## ✅ Step 7: Final Validation

Verify that the structural destruction (DDL) was successful:

```bash
npx jest tests/02-ddl-ops.test.js
```

---

## 🧹 Step 8: Atomic Cleanup
```bash
docker-compose down -v --remove-orphans
```

> [!TIP]
> The `--remove-orphans` flag ensures that any containers from previous lab attempts or different branches are also cleaned up, keeping your Docker environment pristine.
