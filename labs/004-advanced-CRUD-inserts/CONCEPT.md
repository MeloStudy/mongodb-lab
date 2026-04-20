# Concept: Acknowledgement vs Physical Persistence

In MongoDB, writing data is a multi-step handshake between the client application and the server nodes. Understanding the "Write Concern" is the difference between a high-performance system and a data-safe system.

## 1. Batch Execution: Ordered vs Unordered

When you use `insertMany()`, you are sending a batch of documents. MongoDB offers two modes of execution:

- **Ordered (Default)**: MongoDB inserts documents one by one. If an error occurs (e.g., Duplicate Key), the process **stops immediately**. Any documents remaining in the array are **not** processed.
- **Unordered (`{ ordered: false }`)**: MongoDB attempts to insert all documents in the batch, even if some fail. It will collect all errors and report them at the end. Use this for high-throughput migrations where partial failures shouldn't stop the whole train.

---

## 2. Infrastructure Context: The Replica Set

Although this lab uses a **Standalone** container, Write Concerns are designed for **Replica Sets** (the production standard).

- **Primary Node**: The only node that receives write operations. It records all changes in its `oplog`.
- **Secondary Nodes**: Replicate the Primary's `oplog` and apply the changes to their own data sets.
- **Voting Members**: Nodes that participate in elections to choose a new Primary if the current one fails.

### Write Concern Options (w)
- **`w: 1`**: (Default) Basic acknowledgement from the **Primary Node** (or Standalone instance). It confirms the data was received in memory.
- **`w: "majority"`**: Acknowledgement that the write has been propagated to the calculated majority of voting nodes in the cluster (e.g., 2 out of 3).

> [!NOTE]
> Even if you are in a Standalone server (like this lab), using `w: "majority"` is valid and will wait for acknowledgement from the single node (since 1 is the majority of 1).

---

## 3. The Durability Lifecycle: Memory vs. Disk

When a write command arrives at the server, it follows this path:

1.  **In-Memory**: The data is written to the private view of the WiredTiger storage engine in RAM. This is extremely fast but volatile.
2.  **The Journal (On-Disk)**: Before the data is permanently merged into the data files, it is recorded in a sequential "Journal" file. 
    - If `j: false`: MongoDB returns success as soon as the data is in memory. If the power cuts out 1ms later, the data is lost.
    - If `j: true`: MongoDB waits until the write is physically flushed to the journal on the disk. Even if the server crashes, MongoDB can "replay" the journal on reboot to recover the data.

---

## 4. The Engineering Trade-off

| Setting | Performance | Safety | Use Case |
| :--- | :--- | :--- | :--- |
| `{ w: 1, j: false }` | Very High | Low | IoT Sensors, non-critical logs. |
| `{ w: "majority", j: true }` | Moderate | Very High | Financial transactions, user profiles. |
