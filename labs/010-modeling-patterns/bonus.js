const { MongoClient } = require('mongodb');

/**
 * ============================================================================
 * BONUS: DATA INTEGRITY & CONSISTENCY PATTERNS
 * ============================================================================
 * 
 * CONCEPT: When using the SUBSET PATTERN, we create a redundancy. 
 * Redundancy requires synchronization. This script demonstrates 
 * how to handle "Double-Writes" to maintain integrity between:
 * 
 * 1. SOURCE OF TRUTH (Collection: 'reviews'): The full archive of reviews.
 * 2. OPTIMIZED VIEW  (Collection: 'products'): A subset of the 3 latest reviews.
 * 
 * ============================================================================
 * COMMAND DISSECTION: $push with Modifiers
 * ============================================================================
 * | Modifier | Purpose in this Script                                       |
 * | :---     | :---                                                         |
 * | $each    | Injects the new review document into the array.              |
 * | $sort    | Re-orders the array by date (descending) before slicing.      |
 * | $slice   | ENFORCES the limit (3). Discards the oldest if exceeded.      |
 * ============================================================================
 */

async function main() {
  // Connection setup for our local Docker container
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('lab_db');
    
    console.log("--- STEP 1: DYNAMIC DISCOVERY ---");
    // We avoid hardcoded IDs. We find the product by name to get its current context.
    const coffee = await db.collection('products').findOne({ name: "Premium Coffee" });
    if (!coffee) {
      console.error("❌ Product not found! Ensure the lab setup and Scenario 2 were completed.");
      return;
    }
    const coffeeId = coffee._id;
    console.log(`📍 Found Product: ${coffee.name} [ID: ${coffeeId}]`);

    const newReview = {
      product_id: coffeeId,
      user: "Frank (Bonus)",
      rating: 5,
      comment: "Atomic operations are key to consistency!",
      date: new Date()
    };

    console.log("\n--- STEP 2: STRATEGY SELECTION & INFRASTRUCTURE CHECK ---");
    /**
     * NOTE: ACID Transactions in MongoDB REQUIRE a Replica Set topolgy.
     * Standalone instances (common in dev) don't support multi-document atomicity.
     */
    const isReplicaSet = (await db.admin().command({ isMaster: 1 })).setName !== undefined;

    if (isReplicaSet) {
      console.log("✅ Replica Set detected. Executing ACID Transaction...");
      await executeWithTransaction(client, db, coffeeId, newReview);
    } else {
      console.log("⚠️ Standalone mode detected.");
      console.log("👉 Performing Sequential Double-Write (Manual maintenance).");
      await executeDoubleWrite(db, coffeeId, newReview);
    }

    console.log("\n--- STEP 3: FINAL VERIFICATION & DATA INTEGRITY CHECK ---");
    // Fetch the product to see if the 'recent_reviews' subset is capped and sorted correctly
    const updatedProduct = await db.collection('products').findOne({ _id: coffeeId });
    
    console.log("\n[PRODUCT DOCUMENT] Current Subset (recent_reviews):");
    console.table(updatedProduct.recent_reviews.map(r => ({
      user: r.user,
      rating: r.rating,
      comment: r.comment.substring(0, 25) + "...",
      date: r.date.toISOString().split('T')[0]
    })));

    // Verify the Source of Truth is still complete
    const totalCount = await db.collection('reviews').countDocuments({ product_id: coffeeId });
    console.log(`\n[REVIEWS COLLECTION] Total items in Archive: ${totalCount}`);
    console.log("💡 Notice: The Archive grows, but the Product document stays lean (3 items).");

  } catch (err) {
    console.error("💥 Critical Failure:", err);
  } finally {
    await client.close();
  }
}

/**
 * IMPLEMENTATION: ACID Transaction
 * Ensures both writes succeed or both fail.
 */
async function executeWithTransaction(client, db, productId, reviewData) {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Archive the full review (Source of Truth)
      await db.collection('reviews').insertOne(reviewData, { session });
      
      // 2. Rotate the subset in the Product (Optimized View)
      await db.collection('products').updateOne(
        { _id: productId },
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
    console.log("✨ ATOMIC SUCCESS: Both documents synchronized via Transaction.");
  } finally {
    await session.endSession();
  }
}

/**
 * IMPLEMENTATION: Sequential Double-Write
 * Standard approach for standalone or eventually consistent systems.
 */
async function executeDoubleWrite(db, productId, reviewData) {
  console.log("   -> Write A: Updating 'reviews' archive...");
  await db.collection('reviews').insertOne(reviewData);

  console.log("   -> Write B: Updating 'products' subset...");
  await db.collection('products').updateOne(
    { _id: productId },
    { 
      $push: { 
        recent_reviews: { 
          $each: [reviewData], 
          $sort: { date: -1 }, 
          $slice: 3 
        } 
      } 
    }
  );
  console.log("✨ SEQUENTIAL SUCCESS: Subset maintenance completed.");
}

main();
