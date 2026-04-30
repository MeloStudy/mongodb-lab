# Concept: The MongoDB Query Optimizer

In MongoDB, writing a query is only the first half of the journey. The second half is handled by the **Query Optimizer**, which decides the most efficient way to retrieve your data.

## 1. The Query Lifecycle

When you execute a query, MongoDB follows a specific lifecycle:

1.  **Incoming Query**: The server receives the query.
2.  **Query Shape Identification**: MongoDB generates a "Query Shape" hash based on the query predicate, projection, and sort order (but ignoring the specific values).
3.  **Plan Selection**:
    *   **If a cached plan exists**: MongoDB uses the cached plan.
    *   **If NO cached plan exists**:
        *   **Candidate Plans**: Identifies all indexes that could satisfy the query.
        *   **The Trial Period (Race)**: Runs candidates in parallel.
        *   **The Winner**: The plan that performs best is selected.
4.  **Execution**: The winning plan is used.

## 2. The "Works" Metric: Measuring Cost

During the Trial Period, MongoDB doesn't just measure "time". It uses a logical unit called **`works`**.
A `works` unit is a single operation performed by the execution engine, such as:
- Examining a single index key.
- Fetching a single document from disk.
- Performing a single comparison.

The plan that completes the trial period with the highest "productivity" (e.g., returning results with the fewest `works`) becomes the winner.

## 3. Decoding the Explain Output

| Level | Description |
| :--- | :--- |
| `queryPlanner` | Shows the `winningPlan` and `rejectedPlans` without execution. |
| `executionStats` | Provides metrics like `executionTimeMillis` and `totalDocsExamined`. |
| `allPlansExecution` | Shows metrics (including `works`) for all candidate plans. |

### Stage Analysis & FETCH
*   **COLLSCAN**: Collection Scan (Reading every document).
*   **IXSCAN**: Index Scan.
*   **FETCH**: Retrieving the full document after finding the key in the index.
*   **PROJECTION_COVERED**: The index contains ALL requested fields. No `FETCH` stage is needed. This is the "gold standard" for performance.

## 4. Manual Control: Hint & Index Filters

### The `.hint()` Operator
Forces a specific index for a single query.

### Index Filters (`planCacheSetFilter`)
Restricts the optimizer's choices for a specific **Query Shape**. 
- **Important**: These are stored **In-Memory only**. They disappear if the server restarts.

## 5. Formalizing "Query Shape"
A Query Shape is defined by:
1.  The fields in the `find()` predicate.
2.  The fields in the `sort()`.
3.  The fields in the `projection()`.

*Example*: 
`find({ age: 25 }).sort({ name: 1 })` and `find({ age: 40 }).sort({ name: 1 })` share the **same Query Shape**. 
`find({ age: 25 })` (no sort) is a **different Query Shape**.
