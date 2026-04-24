# LAB-009: Document Structuring (1:1, 1:N)

In this lab, you will move from a "Relational Mindset" to a "Document Mindset". You will transform a normalized schema (separate collections) into an optimized document structure using **Embedding** and **Referencing**.

## 🚀 Step 1: Spin up the environment

```bash
docker-compose up -d
```

Verify that the initial "relational" data is seeded:
```bash
docker exec -it mongodb_lab_009 mongosh lab_db --eval "db.users.find(); db.preferences.find(); db.addresses.find();"
```

---

## 🛠️ Step 2: Scenario 1 - 1:1 Embedding (Preferences)

In relational databases, `preferences` would be a separate table. In MongoDB, since preferences are almost always needed with the user, we **embed** them.

1. **Connect to the shell**:
   ```bash
   docker exec -it mongodb_lab_009 mongosh lab_db
   ```

2. **Migrate data**: Find the preferences for `jdoe` and embed them into the `users` document.
   ```javascript
   // 1. Get the preference
   const prefs = db.preferences.findOne({ user_id: db.users.findOne({username: "jdoe"})._id });
   
   // 2. Embed it using Dot Notation
   db.users.updateOne(
     { username: "jdoe" },
     { $set: { "metadata.preferences": { theme: prefs.theme, language: prefs.language } } }
   );
   ```

3. **Verify**: Check that the document now contains the nested preferences.
   ```javascript
   db.users.find({ username: "jdoe" }, { "metadata.preferences": 1 });
   ```

4. **Cleanup**: Once all users are migrated, drop the old collection. 
   
   > [!TIP]
   > **Engineering Gem: Idempotent Migration**
   > In production, migrations can fail. To make this script robust and re-runnable without overwriting newer data, use `$exists: false` to only target users that haven't been migrated yet:
   > 
   > `db.preferences.find().forEach(p => { db.users.updateOne({ _id: p.user_id, "metadata.preferences": { $exists: false } }, { $set: { "metadata.preferences": { theme: p.theme, language: p.language } } }) });`

   ```javascript
   db.preferences.drop();
   ```

### Command Dissection: Dot Notation in Updates
| Syntax | Purpose |
| :--- | :--- |
| `"metadata.preferences"` | Accesses or creates a nested object. The quotes are **mandatory** when using dot notation in keys. |
| `$set` | Adds a new field or replaces the value of an existing field. |
| `$exists: false` | Filters for documents where the specified field **does not exist**. Used here to ensure idempotency. |

---

## 🛠️ Step 3: Scenario 2 - 1:N Embedding (One-to-Few Addresses)

A user has a few addresses. Instead of a separate collection, we will use an **Array of Documents**.

1. **Migrate ALL existing addresses**: Instead of doing it one by one, we will iterate over all users to move their data from the standalone `addresses` collection into their respective `users.addresses` array.
   ```javascript
   db.users.find().forEach(user => {
     db.addresses.find({ user_id: user._id }).forEach(addr => {
       db.users.updateOne(
         { _id: user._id },
         { 
           $push: { 
             addresses: { 
               type: addr.type, 
               street: addr.street, 
               city: addr.city, 
               zip_code: addr.zip_code 
             } 
           } 
         }
       );
     });
   });
   ```

2. **Add a new address**: Now that the data is migrated, add a new one directly to the document:
   ```javascript
   db.users.updateOne(
     { username: "jdoe" },
     { $push: { addresses: { type: "vacation", street: "101 Beach Blvd", city: "Miami", zip_code: NumberInt(33101) } } }
   );
   ```

3. **Verify**: Ensure the `addresses` field is an array with the new data.
   ```javascript
   db.users.findOne({ username: "jdoe" }, { addresses: 1 });
   ```

4. **Cleanup**: Drop the redundant collection.
   ```javascript
   db.addresses.drop();
   ```

### Command Dissection: Array Operations
| Operator | Purpose |
| :--- | :--- |
| `$push` | Adds an item to an array. If the array doesn't exist, it creates it. |
| `NumberInt()` | Forces the value to be stored as a **BSON Int32**, saving space compared to the default Double. |

---

## 🛠️ Step 4: Scenario 3 - Referencing & Size Analysis (Unbounded Growth)

What happens if we embed "Audit Logs"? Every time a user logs in, the document grows. This is an **Unbounded Pattern**, which eventually breaks the 16MB limit.

1. **Measure current size**: Check how many bytes `jdoe` currently occupies:
   ```javascript
   bsonsize(db.users.findOne({ username: "jdoe" }));
   ```

2. **The "What-if" Analysis**: Imagine adding 10,000 logs. The document size would grow linearly until it reaches 16MB (16,777,216 bytes), at which point any further update would fail with a `DocumentTooLarge` error.

3. **Implement Referencing**: Instead of embedding, we create a separate collection for the logs, linking them via `user_id`.
   ```javascript
   db.audit_logs.insertOne({
     user_id: db.users.findOne({username: "jdoe"})._id,
     action: "login",
     timestamp: new Date()
   });
   ```

### Command Dissection: Utility
| Helper | Purpose |
| :--- | :--- |
| `bsonsize()` | Returns the size of a BSON document in bytes. Crucial for monitoring the 16MB limit (**16,777,216 bytes**). |

---

## ✅ Step 5: Validation

Run the automated tests to verify your new schema structure:

```bash
# From the lab directory
npm test
```

---

## 🧹 Step 6: Atomic Cleanup
```bash
docker-compose down -v --remove-orphans
```
