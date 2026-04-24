# SOLUTIONS: Optional Challenges

This document provides the reference solutions for the optional challenges in LAB-010, focusing on real-world maintenance of optimized patterns.

---

## 1. Challenge: Double-Write Simulation

When using the **Subset Pattern**, the application is responsible for keeping the subset in the "parent" document synchronized with the "source of truth" (the separate collection).

### Step 0: Discovery (Dynamic ID)
First, find the product we want to review. In this lab, it is **"Premium Coffee"**:
```javascript
const coffee = db.products.findOne({ name: "Premium Coffee" });
const coffeeId = coffee._id;
```

### Step 1: Archive the full review (Source of Truth)
We insert the complete review into the `reviews` collection.
```javascript
db.reviews.insertOne({
  product_id: coffeeId,
  user: "Eve",
  rating: 5,
  comment: "Actually, this is the best!",
  date: new Date()
});
```

### Step 2: Rotate the subset (Optimized View)
We update the product to include the new review in the `recent_reviews` array, while keeping it capped at 3 items and sorted by date.
```javascript
db.products.updateOne(
  { _id: coffeeId },
  { 
    $push: { 
      recent_reviews: { 
        $each: [{ 
          user: "Eve", 
          rating: 5, 
          comment: "Actually, this is the best!", 
          date: new Date() 
        }],
        $sort: { date: -1 },
        $slice: 3
      }
    }
  }
);
```

---

## 2. Challenge: Cascade Delete

If a review is deleted (e.g., for moderation or GDPR), we must ensure it's also removed from the product's `recent_reviews` subset to avoid "ghost" data.

### Step 0: Discovery
Let's find the review we want to delete (e.g., Bob's review):
```javascript
const reviewToDelete = db.reviews.findOne({ user: "Bob" });
const targetProductId = reviewToDelete.product_id;
```

### Step 1: Delete from the source
```javascript
db.reviews.deleteOne({ _id: reviewToDelete._id });
```

### Step 2: Surgical removal from the subset
Using the `$pull` operator allows us to remove the specific item from the array in the product document.
```javascript
db.products.updateOne(
  { _id: targetProductId },
  { 
    $pull: { 
      recent_reviews: { user: "Bob" } 
    } 
  }
);
```

> [!IMPORTANT]
> **The Reconciliation Gap**: After a `$pull`, the subset might only have 2 items. In a high-traffic production system, you might trigger a "Reconciliation Job" that fetches the 3rd most recent review from the `reviews` collection and pushes it into the product to refill the subset.

---

## 3. Bonus: Professional Consistency with Transactions

In distributed systems or high-integrity apps, you want the **Archive** and **Rotate** operations to be **Atomic** (both happen, or neither happens).

### Node.js Implementation (ACID Transaction)

You can find a complete, executable version of this logic in **`bonus.js`**. To run it, execute:

```bash
node bonus.js
```

#### Code Snippet:
```javascript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    const reviewData = {
      product_id: coffeeId, // Previously found
      user: "Eve",
      rating: 5,
      comment: "Atomic review!",
      date: new Date()
    };

    // 1. Write to Source of Truth
    await db.collection('reviews').insertOne(reviewData, { session });
    
    // 2. Update Optimized Subset
    await db.collection('products').updateOne(
      { _id: coffeeId },
      { 
        $push: { 
          recent_reviews: { 
            $each: [reviewData], 
            $sort: { date: -1 }, 
            $slice: 3 
          } 
        } 
      },
      { session }
    );
  });
  console.log("Transaction committed successfully!");
} catch (error) {
  console.error("Transaction aborted due to error: ", error);
} finally {
  await session.endSession();
}
```
