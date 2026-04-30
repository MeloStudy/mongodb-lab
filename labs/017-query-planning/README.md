# Lab 017: DBA Wrap-up: Query Planning

Welcome to the DBA Masterclass. In this lab, you will stop just "creating indexes" and start "auditing decisions". You will dive into the internal mechanics of the MongoDB Query Optimizer to understand how it selects plans, why it rejects others, and how to manually override its choices.

## 🎯 Learning Objectives
- Interpret `explain()` output at various verbosity levels.
- Differentiate between `winningPlan` and `rejectedPlans`.
- Force execution paths using `.hint()`.
- Manage the Query Plan Cache and Index Filters.
- **Understand the "Works" metric** and its role in the plan race.
- **Identify Covered Queries** and their performance advantage.

## 🚀 Environment Setup

1.  Start the environment:
    ```bash
    docker-compose up -d
    ```

2.  Wait for the seeding to finish (10,000 telemetry documents).

## 🛠️ Step-by-Step Scenarios

### Scenario 1: Decoding the Winning Plan & "Works"
MongoDB has multiple indexes that could satisfy a query. Let's see how it "raced" them.

1.  Run a query and explain the race:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ 
        deviceId: "DEV-001", 
        status: "active" 
      }).sort({ timestamp: -1 }).explain("allPlansExecution")
    '
    ```

2.  **Audit the output**:
    *   Find the `allPlansExecution` array.
    *   Look for the **`works`** field in each candidate. The one with the highest `works` usually didn't win—the one that returned results with the least total `works` did.

---

### Scenario 2: Manual Override with Hint
Sometimes, for a specific query, you know better than the optimizer.

1.  Force an index on status using `.hint()`:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ 
        deviceId: "DEV-001", 
        status: "idle" 
      }).hint("idx_status_time").explain("executionStats")
    '
    ```

---

### Scenario 3: The Covered Query Advantage
A "Covered Query" is the holy grail of performance because MongoDB never touches the collection—it stays entirely in the index.

1.  Run a query that requires fetching the full document:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ deviceId: "DEV-001" }).explain("queryPlanner")
    '
    ```
    *   Notice the `FETCH` stage.

2.  Now, add a **Projection** that only uses fields present in the index:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find(
        { deviceId: "DEV-001" }, 
        { deviceId: 1, timestamp: 1, _id: 0 }
      ).explain("queryPlanner")
    '
    ```
    *   **Check the stage**: It should now be `IXSCAN` without a parent `FETCH`, or explicitly labeled `PROJECTION_COVERED`.

---

### Scenario 4: Restricting Choice with Index Filters
As a DBA, you can "ban" an index for a specific **Query Shape**.

1.  Set an Index Filter to only allow `idx_status_time` for this query shape:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.runCommand({
        planCacheSetFilter: "telemetry",
        query: { deviceId: "DEV-001", status: "active" },
        indexes: [ { status: 1, timestamp: -1 } ]
      })
    '
    ```

2.  Run the explain and notice that `rejectedPlans` is now empty. The filter narrowed the optimizer's world.

---

## 📚 Decoding Explain Stats

When auditing `executionStats`, these fields are your primary indicators:

| Field | Meaning | Performance Impact |
| :--- | :--- | :--- |
| **`nReturned`** | Number of documents returned. | Target outcome. |
| **`totalKeysExamined`** | How many index entries were read. | Should be close to `nReturned`. |
| **`totalDocsExamined`** | How many documents were fetched from disk. | **High values indicate a poor index.** |
| **`works`** | Total units of logical work performed. | High values = High CPU/IO. |
| **`executionTimeMillis`** | Total time for the query. | The ultimate user metric. |

## 🧪 Validation
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v
```
