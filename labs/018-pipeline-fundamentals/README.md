# Lab 018: Pipeline Fundamentals

Welcome to the world of the Aggregation Framework. In this lab, you will move beyond simple queries and start building complex analytics pipelines. You will learn how to filter, group, and transform data, while keeping performance and memory constraints in mind.

## 🎯 Learning Objectives
- Build multi-stage pipelines.
- Apply **Predicate Pushdown** for optimization.
- Handle **Memory Constraints** (100MB limit).
- Master array flattening with `$unwind`.

## 🚀 Environment Setup

1.  Start the environment:
    ```bash
    docker-compose up -d
    ```

2.  The environment seeds 100 sales records automatically, including some refunds (negative values) and empty tag arrays.

## 🛠️ Step-by-Step Scenarios

### Scenario 1: The Optimized Filter
The first rule of aggregation: Filter early.

1.  Run a pipeline that filters for 'Electronics' and projects only the product name:
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        { $match: { category: "Electronics" } },
        { $project: { item: "$productName", _id: 0 } }
      ])
    '
    ```

2.  **Audit the Plan**: Use `.explain()` to see if an index scan was used.
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        { $match: { category: "Electronics" } },
        { $project: { item: "$productName", _id: 0 } }
      ]).explain("queryPlanner")
    '
    ```

3.  **Output Dissection**:
    *   **`winningPlan.stage`**: Look for `PROJECTION_SIMPLE` or `PROJECTION_DEFAULT`.
    *   **`inputStage.stage`**: Since we haven't created an index on `category` yet, you will see `COLLSCAN`. This means MongoDB had to read every single document to find the Electronics.
    *   **Learning Moment**: In production, a `COLLSCAN` inside a pipeline is a performance killer. Always ensure your first `$match` is backed by an index.

---

### Scenario 2: Revenue Analytics (Handling Refunds)
Let's calculate total revenue per category. Remember that some quantities are negative (refunds).

1.  Group by category and sum the total value:
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        {
          $group: {
            _id: "$category",
            totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
            avgQuantity: { $avg: "$quantity" }
          }
        }
      ])
    '
    ```

2.  **Output Dissection**:
    *   **`totalRevenue`**: Notice the exactness of the numbers. Because we seeded with `NumberDecimal`, MongoDB performs decimal math, preventing floating-point errors common in financial apps.
    *   **`_id`**: The grouping key. If you wanted to group by multiple fields, you would use an object: `_id: { cat: "$category", prod: "$productName" }`.

---

### Scenario 3: Array Flattening
Our products have a `tags` array. Let's see which tags are the most popular.

1.  Deconstruct the tags array:
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    '
    ```
2.  **Edge Case**: Some documents have empty tags. To prevent them from being lost, use the advanced syntax:
    ```javascript
    { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }
    ```

3.  **Output Dissection**:
    *   Count the total documents before and after `$unwind`. You'll notice the count increases significantly because each tag becomes its own document.
    *   **Memory Warning**: `$unwind` is a "blocking" stage if followed by a sort. It can easily push you past the 100MB limit if your arrays are large.

---

### Scenario 4: Top Performers (Using $set and Sort)
Let's find the top 5 highest-value orders. We'll use **`$set`** to calculate the value on the fly.

1.  Calculate total value and sort:
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        {
          $set: {
            totalValue: { $multiply: ["$price", "$quantity"] }
          }
        },
        { $sort: { totalValue: -1 } },
        { $limit: 5 }
      ])
    '
    ```

---

### Scenario 5: The 100MB Memory Trap (Simulation)
MongoDB limits stage memory to 100MB to protect the server.

1.  **Stage Folding Analysis**:
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        { $match: { category: "Electronics" } },
        { $sort: { price: -1 } }
      ]).explain("queryPlanner")
    '
    ```
    *   **Output Dissection**: Check the `stages` list. You might see that `$match` and `$sort` are listed together. The optimizer tries to "fold" them so the filter happens while sorting.

2.  **Trigger a Memory Error (Simulated)**:
    We don't have enough data to hit 100MB naturally, so we will use a "Memory Bomb" pipeline that creates a massive array for every document.
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate([
        { $project: { bigData: { $range: [0, 1000000] } } },
        { $sort: { bigData: 1 } }
      ])
    '
    ```
    *   **Expected Result**: `Exceeded memory limit for $sort stage, but did not allow external sort. Pass allowDiskUse:true to opt in.`

3.  **Fix with allowDiskUse**:
    ```bash
    docker exec -it mongodb_lab_018 mongosh lab_db --eval '
      db.sales.aggregate(
        [
          { $project: { bigData: { $range: [0, 1000000] } } },
          { $sort: { bigData: 1 } }
        ],
        { allowDiskUse: true }
      )
    '
    ```
    *   **Learning Moment**: `allowDiskUse` is your safety valve, but it's a "code smell". It indicates that your pipeline is processing too much data in-memory and likely needs better indexing or filtering.

---

## 🧪 Validation
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v
```

---

## 📚 Command Dissection

### Pipeline Stages
| Stage | Purpose | Performance Note |
| :--- | :--- | :--- |
| **`$match`** | Filter documents (similar to `find()`). | Always place at the start to leverage indexes. |
| **`$group`** | Aggregate data. | Blocking stage. Consumes RAM for groups. |
| **`$project`** | Reshapes output. | Use early to drop large unused fields. |
| **`$set`** | Adds/Updates fields. | Alias for `$addFields`. Preferred for readability. |
| **`$unwind`** | Flattens arrays. | Can significantly increase document count. |
| **`$sort`** | Orders documents. | Blocking stage unless supported by an index. |

### Aggregation Options
| Option | Type | Description |
| :--- | :--- | :--- |
| `allowDiskUse` | Boolean | Enables spilling to disk if 100MB RAM limit is exceeded. |
| `explain` | String/Boolean | Returns the execution plan instead of the results. |
| `cursor` | Object | Specifies the initial batch size for the result cursor. |
