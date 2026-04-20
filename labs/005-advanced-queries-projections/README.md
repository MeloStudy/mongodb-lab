# LAB-005: Advanced Queries & Projections

Nested data is powerful, but querying it incorrectly is the #1 source of bugs in document databases. In this lab, you will learn to be precise with arrays, logic, and schema-less data.

## Phase 1: Seed Data & Environment Setup

1. Start the environment:
   ```bash
   docker-compose up -d
   ```
2. Connect to the shell:
   ```bash
   docker exec -it mongodb_lab_005 mongosh
   ```
3. **Seed the Data**: We need a diverse dataset to test advanced operators.
   **Execute the following in the shell**:
   ```javascript
   use crud_db
   db.inventory.insertMany([
     { 
       product: "Advanced Router", 
       tags: ["networking", "pro", "security"],
       shipments: [
         { warehouse: "A", status: "delivered", qty: 100 },
         { warehouse: "B", status: "pending", qty: 20 }
       ],
       warranty_notes: "3-year extended"
     },
     { 
       product: "Base Switch", 
       tags: ["networking"],
       shipments: [
         { warehouse: "A", status: "delivered", qty: 10 },
         { warehouse: "B", status: "pending", qty: 100 }
       ]
     },
     { 
       product: "Fiber Cable", 
       tags: ["accessory", "fiber"],
       shipments: [
         { warehouse: "A", status: "delivered", qty: 60 }
       ],
       special_notes: "Fragile"
     },
     {
       product: "Pro Firewall",
       tags: ["networking", "pro", "security", "enterprise"],
       shipments: [],
       warranty_notes: "LIFETIME"
     }
   ])
   ```

---

## Phase 2: Precision Filtering (The $elemMatch Trap)

**The Challenge**: Find all products that have **a single shipment** with `status: "delivered"` AND a `qty` greater than `50`.

1. **Task (The Naive approach)**: Try the following dot-notation query:
   ```javascript
   db.inventory.find({ "shipments.status": "delivered", "shipments.qty": { $gt: 50 } })
   ```
   *Observe: "Base Switch" is returned! But check its shipments... none of them satisfy both conditions simultaneously. One is delivered (but qty 10), and the other is pending (but qty 100).*

2. **Task (The Correct approach)**: Rewrite the query using `$elemMatch` to find only products where a **specific** shipment matches both criteria.
   ```javascript
   db.inventory.find({ 
     shipments: { 
       $elemMatch: { status: "delivered", qty: { $gt: 50 } } 
     } 
   })
   ```

---

## Phase 3: The Auditor Challenge (Logic & Arrays)

Now let's use advanced operators to audit our inventory requirements.

1. **Task ($all)**: Find all products that have **both** "networking" and "security" tags.
   ```javascript
   db.inventory.find({ 
     tags: { $all: ["networking", "security"] } 
   })
   ```

2. **Task ($size)**: Find all products that have **exactly 3** tags.
   ```javascript
   db.inventory.find({ 
     tags: { $size: 3 } 
   })
   ```

3. **Task ($exists)**: Find all products that do **not** have the `warranty_notes` field.
   ```javascript
   db.inventory.find({ 
     warranty_notes: { $exists: false } 
   })
   ```

4. **Task (Logical OR)**: Find products that are either tagged "accessory" OR have a shipment in warehouse "B".
   ```javascript
   db.inventory.find({ 
     $or: [ { tags: "accessory" }, { "shipments.warehouse": "B" } ] 
   })
   ```

---

## Phase 4: Projections (`driver.js`)

In production, you rarely want the whole document. Let's practice slimming down our results.

1. Open `driver.js`.
2. **Task**: Configure the `projection` object to hide the `_id` and the `internal_cost` field.
3. Run the script:
   ```bash
   node driver.js
   ```
   *Check: Does the output printed to the console contain the internal_cost? It shouldn't!*

---

## Phase 5: Validation

Run the automated validation suite to confirm all scenarios (Precision, Logic, Projections) pass.

```bash
npm test
```

## Phase 6: Atomic Cleanup

```bash
make clean
```
