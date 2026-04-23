# LAB-008: Deleting Data & Tooling

Master the art of data removal and explore your database visually using MongoDB Compass.

## 🎯 Objectives
- Perform surgical deletions with `deleteOne`.
- Execute bulk cleanups with `deleteMany`.
- Understand the performance benefits of `drop()`.
- Use **MongoDB Compass** to analyze your data schema.

---

## 🛠️ Step 1: Environment Setup

1. **Spin up the container**:
   ```bash
   docker-compose up -d
   ```

2. **Generate dirty data**:
   Run the seeder to populate the `factory` collection with mixed records:
   ```bash
   node generate-dirty-data.js
   ```

---

## 🧪 Step 2: Scenario 1 - Surgical & Bulk Deletion

1. **Identify the targets**:
   Connect via `mongosh` and find the corrupted documents:
   ```bash
   mongosh "mongodb://localhost:27017/lab_db"
   ```

2. **Task A: Delete by ID**:
   Remove the document with `name: "Malfunctioning-Probe"`. **Dissection**:
   ```javascript
   db.factory.deleteOne({ _id: UUID("00000000-0000-4000-a000-000000000001") })
   ```

3. **Task B: Bulk Cleanup**:
   Remove all documents with `status: "failed"`. **Dissection**:
   ```javascript
   db.factory.deleteMany({ status: "failed" })
   ```

---

## 🧪 Step 3: Scenario 2 - Total Cleanup

1. **Task C: Drop Collection**:
   Destroy the entire `factory` collection. **Dissection**:
   ```javascript
   db.factory.drop()
   ```

2. **Task D: Drop Database**:
   Destroy the whole `lab_db`. **Dissection**:
   ```javascript
   db.dropDatabase()
   ```

---

## 🧭 Step 4: Tooling - MongoDB Compass

1. **Install Compass**: Ensure you have [MongoDB Compass](https://www.mongodb.com/products/tools/compass) installed.
2. **Connect**: Open Compass and use the connection string: `mongodb://localhost:27017`.
3. **Analyze**:
   - Go to the `lab_db.factory` collection.
   - Click on the **Schema** tab.
   - Click **Analyze Schema** to see the distribution of statuses and types.

---

## ✅ Step 5: Validation

Run the TDD suite to verify your actions:
```bash
npm test
```

> [!NOTE]
> For the tests to pass, you must have completed ALL deletion and drop tasks. If the tests fail, it's likely you missed a step or the database still contains remnants.

---

## 🧹 Step 6: Atomic Cleanup
```bash
docker-compose down -v
```
