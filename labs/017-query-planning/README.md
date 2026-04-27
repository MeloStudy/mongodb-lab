# Lab 017: DBA Wrap-up: Query Planning

Welcome to the DBA Masterclass. In this lab, you will stop just "creating indexes" and start "auditing decisions". You will dive into the internal mechanics of the MongoDB Query Optimizer to understand how it selects plans, why it rejects others, and how to manually override its choices.

## 🎯 Learning Objectives
- Interpret `explain()` output at various verbosity levels.
- Differentiate between `winningPlan` and `rejectedPlans`.
- Force execution paths using `.hint()`.
- Manage the Query Plan Cache and Index Filters.

## 🚀 Environment Setup

1.  Start the environment:
    ```bash
    docker-compose up -d
    ```

2.  Wait for the seeding to finish (10,000 telemetry documents).

## 🛠️ Step-by-Step Scenarios

### Scenario 1: Decoding the Winning Plan
MongoDB has multiple indexes that could satisfy a query. Let's see which one it picks.

1.  Run a query for a specific device and status, and explain the plan:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ 
        deviceId: "DEV-001", 
        status: "active" 
      }).sort({ timestamp: -1 }).explain("queryPlanner")
    '
    ```

2.  **Audit the output**:
    *   Find the `winningPlan` stage. Which index did it pick? `idx_device_time` or `idx_status_time`?
    *   Look for `rejectedPlans`. Why was the other index rejected?

---

### Scenario 2: The Race (allPlansExecution)
To see the actual performance metrics of the candidate plans during the "race", use `allPlansExecution`.

1.  Run the query again with higher verbosity:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ 
        deviceId: "DEV-001", 
        status: "active" 
      }).sort({ timestamp: -1 }).explain("allPlansExecution")
    '
    ```

2.  **Analyze**:
    *   Compare `executionStats.totalDocsExamined` across the different plan candidates in the `allPlansExecution` section.

---

### Scenario 3: Manual Override with Hint
Sometimes, for a specific query, you know better than the optimizer.

1.  Run a query that targets `status: "idle"`. Since 95% of our data is "idle", an index on status might be inefficient. Force it anyway using `.hint()`:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ 
        deviceId: "DEV-001", 
        status: "idle" 
      }).hint("idx_status_time").explain("executionStats")
    '
    ```

2.  **Observe**:
    *   Verify that `winningPlan` now explicitly uses `idx_status_time`.
    *   Check `executionTimeMillis`. Is it slower than the default?

---

### Scenario 4: Restricting Choice with Index Filters
As a DBA, you can "ban" an index for a specific query pattern without deleting it.

1.  Set an Index Filter to only allow `idx_status_time` for this specific query shape:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.runCommand({
        planCacheSetFilter: "telemetry",
        query: { deviceId: "DEV-001", status: "active" },
        indexes: [ { status: 1, timestamp: -1 } ]
      })
    '
    ```

2.  Run the explain again:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.telemetry.find({ 
        deviceId: "DEV-001", 
        status: "active" 
      }).explain("queryPlanner")
    '
    ```
    *   Notice that `rejectedPlans` is now empty. The optimizer was not allowed to even consider `idx_device_time`.

3.  Clear the filters:
    ```bash
    docker exec -it mongodb_lab_017 mongosh lab_db --eval '
      db.runCommand({ planCacheClearFilters: "telemetry" })
    '
    ```

---

## 🧪 Validation

Run the automated tests to certify your mastery:
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v
```

---

## 📚 Command Dissection

| Command | Usage |
| :--- | :--- |
| `.explain("executionStats")` | Shows the winner and its performance metrics. |
| `.explain("allPlansExecution")` | Shows metrics for all "raced" candidates. |
| `.hint(indexName)` | Forces the use of a specific index. |
| `$planCacheStats` (Agg) | Lists all currently cached query plans. |
| `planCacheClear` | Wipes the cache for a collection. |
| `planCacheSetFilter` | Restricts allowed indexes for a query shape. |
