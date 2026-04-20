# LAB-004: Advanced Inserts & Write Concerns

In this lab, you will master bulk operations and data durability configurations.

## Phase 1: The "Battle of Order" (`mongosh`)

By default, an error in a bulk insert stops the entire process. Let's break that default behavior.

1. Start the environment:
   ```bash
   docker-compose up -d
   ```
2. Connect to the shell:
   ```bash
   docker exec -it mongodb_lab_004 mongosh
   ```
3. Create a deliberate failure by trying to insert documents with duplicate `_id` values. 
   **Execute the following command**:
   ```javascript
   use crud_db
   db.orders.insertMany([
     { _id: 1, item: "pencil", tag: "pre-error" },
     { _id: 1, item: "pen", tag: "the-error" }, // DUPLICATE ID!
     { _id: 2, item: "eraser", tag: "post-error" }
   ])
   ```
   *Observe: Only document `_id: 1` was inserted. The "eraser" is missing.*

4. **Task**: Clean the collection and try again, but this time use the **unordered** option to ensure the "eraser" gets inserted despite the error.
   ```javascript
   db.orders.deleteMany({}) // Clean up
   
   // TODO: Modify the insertMany below to include { ordered: false }
   db.orders.insertMany([
     { _id: 1, item: "pencil", tag: "pre-error" },
     { _id: 1, item: "pen", tag: "the-error" },
     { _id: 2, item: "eraser", tag: "post-error" }
   ], { ordered: false })
   ```

#### 🔍 Command Dissection: `insertMany(docs, options)`
- `docs`: An array of JSON documents.
- `ordered`: (Boolean) If `true`, stops on error. If `false`, continues processing the remaining documents in the array.

---

## Phase 2: Total Durability (`driver.js`)

Now, let's configure physical data safety using the Node.js Driver.

1. Open `driver.js`.
2. **Task**: Find the `TODO` and implement the `writeConcern` to require both `"majority"` acknowledgement and `journal` confirmation.
3. Run your script:
   ```bash
   node driver.js
   ```

#### 🔍 Command Dissection: `writeConcern`
- `w: "majority"`: Ensures the write is propagated to the calculated majority of the replica set.
- `j: true`: Ensures the write is flushed to the compute's physical disk (Journal) before returning success.

> [!TIP]
> For a deep dive into **Primary nodes**, **Replica Sets**, and how the **Journal** works on disk, read [CONCEPT.md](./CONCEPT.md) before starting this phase.

---

## Phase 3: Validation

Run the automated validation suite to confirm both scenarios reached the desired state.

```bash
npm test
```

## Phase 4: Atomic Cleanup

```bash
make clean
```
