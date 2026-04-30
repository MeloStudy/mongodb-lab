# Lab 019: Advanced Analytics Stages

Move beyond basic pipelines and master the "Relational" and "Recursive" capabilities of MongoDB. In this lab, you will perform complex joins, traverse hierarchies, and materialize analytics results.

## 🎯 Learning Objectives
- Perform Left Outer Joins with **`$lookup`**.
- Traverse recursive structures with **`$graphLookup`**.
- Run parallel analytics with **`$facet`**.
- Persist results incrementally with **`$merge`**.
- Execute cross-database joins.

## 🚀 Environment Setup

1.  Start the environment:
    ```bash
    docker-compose up -d
    ```

2.  The environment seeds multiple collections and a separate `global_metadata` database automatically.

---

## 🛠️ Step-by-Step Scenarios

### Scenario 1: The Customer-Orders Join
In a relational world, you join tables. In MongoDB, we use `$lookup`.

1.  Join `customers` with their `orders`:
    ```bash
    docker exec -it mongodb_lab_019 mongosh lab_db --eval '
      db.customers.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "customerId",
            as: "orders"
          }
        },
        {
          $project: {
            name: 1,
            orderCount: { $size: "$orders" }
          }
        }
      ])
    '
    ```
2.  **Output Dissection**:
    *   Notice **Bob** and **Edward**. They are included even though they have 0 orders. This is the **Left Outer Join** behavior.

---

### Scenario 2: Recursive Org Chart
How do you find all employees who report to the CEO, including their subordinates' subordinates?

1.  Find all subordinates of the "VP Engineering" (ID: 2):
    ```bash
    docker exec -it mongodb_lab_019 mongosh lab_db --eval '
      db.employees.aggregate([
        { $match: { _id: 2 } },
        {
          $graphLookup: {
            from: "employees",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "reportsTo",
            as: "subordinates"
          }
        },
        {
          $project: {
            name: 1,
            subordinateNames: "$subordinates.name"
          }
        }
      ])
    '
    ```
2.  **Output Dissection**:
    *   **`subordinates`**: This array contains everyone from the Director down to the Developers.
    *   **Recursive Power**: One stage replaces what would normally be multiple application loops.

---

### Scenario 3: E-commerce Facets
Generate a category count and a price range breakdown in a single pass.

1.  Run parallel analytics on products:
    ```bash
    docker exec -it mongodb_lab_019 mongosh lab_db --eval '
      db.products.aggregate([
        {
          $facet: {
            "byCategory": [
              { $group: { _id: "$category", count: { $sum: 1 } } }
            ],
            "byPrice": [
              { $bucket: { groupBy: "$price", boundaries: [0, 100, 500, 2000], output: { count: { $sum: 1 } } } }
            ]
          }
        }
      ])
    '
    ```

---

### Scenario 4: Materializing Results with $merge
Let's save a "Customer Value" report. Unlike `$out`, `$merge` allows us to update the collection without deleting it.

1.  Aggregate and upsert into `customer_reports`:
    ```bash
    docker exec -it mongodb_lab_019 mongosh lab_db --eval '
      db.orders.aggregate([
        {
          $group: {
            _id: "$customerId",
            totalSpent: { $sum: "$total" },
            lastOrder: { $max: "$date" }
          }
        },
        {
          $merge: {
            into: "customer_reports",
            whenMatched: "merge"
          }
        }
      ])
    '
    ```
2.  **Verification**: Check the new collection: `db.customer_reports.find()`.

---

### Scenario 5: Cross-Database Join
Join local data with a "Global Reference" database.

1.  Join `orders` with `currencies` from `global_metadata`:
    ```bash
    docker exec -it mongodb_lab_019 mongosh lab_db --eval '
      db.orders.aggregate([
        { $match: { _id: 101 } },
        {
          $lookup: {
            from: "currencies",
            db: "global_metadata",
            pipeline: [ { $match: { code: "EUR" } } ],
            as: "rate"
          }
        }
      ])
    '
    ```

---

## 🧪 Validation
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v --remove-orphans
```

---

## 📚 Command Dissection

| Stage | Purpose | Key Parameter |
| :--- | :--- | :--- |
| **`$lookup`** | Join collections. | `from`, `as`, `db` (for cross-db). |
| **`$graphLookup`** | Recursive search. | `connectFromField`, `connectToField`. |
| **`$facet`** | Parallel pipelines. | Object where keys are result arrays. |
| **`$merge`** | Upsert results. | `into`, `on`, `whenMatched`. |
| **`$bucket`** | Categorize by range. | `boundaries`, `output`. |
