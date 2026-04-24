# LAB-010: Advanced Modeling Patterns

Learn how to optimize MongoDB performance using **Extended Reference** and **Subset Patterns**.

## Prerequisites
- Docker & Docker Compose installed.
- Understanding of basic CRUD operations.

---

## 1. Setup Environment

Launch the containerized environment:

```bash
docker-compose up -d
```

Verify that the database is seeded:

```bash
docker exec -it mongodb_lab_010 mongosh lab_db --eval "db.products.find()"
```

---

## 2. Scenario 1: Extended Reference (Fast Orders)

The `products` collection has items with prices. We want to create an `orders` collection where each order has a snapshot of the product name and price to avoid expensive joins.

### Task
First, enter the interactive MongoDB shell:

```bash
docker exec -it mongodb_lab_010 mongosh lab_db
```

Inside the shell (`lab_db >`), let's find our product and create an order using its current data:

```javascript
// 1. Find the product to get its current price and ID
const coffee = db.products.findOne({ name: "Premium Coffee" });

// 2. Create the order with the "Extended Reference" (Snapshot)
db.orders.insertOne({
  customer: "John Doe",
  date: new Date(),
  items: [
    {
      product_id: coffee._id,
      name: coffee.name,
      price: coffee.price,
      quantity: 1
    }
  ]
})
```

### Why do this?
Even if the price of "Premium Coffee" changes tomorrow in the `products` collection, this order will always show the price the customer actually paid.

---

## 3. Scenario 2: Subset Pattern (Recent Reviews)

We want to keep only the **3 most recent** reviews inside the product document to keep the document size small and queries fast.

### Task
If you exited the shell, enter it again:
```bash
docker exec -it mongodb_lab_010 mongosh lab_db
```

Inside the shell, we will fetch the ID of our coffee and use it to find the latest reviews to embed:

```javascript
// 1. Get the product ID
const coffeeId = db.products.findOne({ name: "Premium Coffee" })._id;

// 2. Fetch the 3 most recent reviews from the archive
const topReviews = db.reviews.find({ product_id: coffeeId })
                             .sort({ date: -1 })
                             .limit(3)
                             .toArray();

// 3. Push them into the product document as a "Subset"
db.products.updateOne(
  { _id: coffeeId },
  { 
    $push: { 
      recent_reviews: { 
        $each: topReviews,
        $sort: { date: -1 },
        $slice: 3
      }
    }
  }
)
```

### Command Dissection: `$push` Modifiers

| Modifier | Description |
| :--- | :--- |
| `$each` | Allows pushing multiple documents into an array at once. |
| `$sort` | Orders the array elements AFTER pushing the new ones but BEFORE slicing. |
| `$slice` | Capped array limit. If positive, keeps the first N. If negative, keeps the last N. |

> [!TIP]
> **Performance Note**: By using `$slice`, you prevent documents from growing indefinitely, keeping them well below the **16MB BSON limit**.

---

## 4. Validation

Exit the MongoDB shell (type `exit` or `Ctrl+C`) and run the automated tests from your terminal:

```bash
npm test
```

---

## 5. Optional Challenge: Simulate a Double-Write

Can you implement a script that adds a new review to the `reviews` collection and simultaneously updates the `product.recent_reviews` subset while maintaining the cap of 3?

- Add a review from "Eve" with date `2026-05-01`.
- Verify that "Alice" (the oldest) is removed from the subset in `products`, but remains in `reviews`.

## 6. Optional Challenge: Cascade Delete

What if a review is deleted? Implement a process that:
- Deletes a specific review from the `reviews` collection.
- Automatically removes it from the `product.recent_reviews` array if it exists there.

> [!TIP]
> You can find the reference solutions for these challenges in **[SOLUTIONS.md](./SOLUTIONS.md)**.

### Validate Optional Challenges
To verify your solutions for the optional challenges, run:
```bash
npm run test:optional
# or
make test-optional
```

---

## 7. Atomic Cleanup

Remove all resources created during this lab:

```bash
docker-compose down -v --remove-orphans
```
