# SOLUTIONS: LAB-011 Schema Evolution & Versioning

## Scenario 1: Lazy Migration (Node.js/Application Layer)

The solution for `exercises/lazy_migration.js` uses JavaScript string manipulation.

```javascript
function migrateUser(user) {
  // 1. Split the name by space
  const names = user.name.split(" ");
  
  // 2. Extract first and last name
  const firstName = names[0];
  const lastName = names.slice(1).join(" "); // Handles "Alice Van Wonderland" -> "Van Wonderland"
  
  // 3. Return the V2 structure
  return {
    ...user,
    first_name: firstName,
    last_name: lastName,
    schema_version: 2
  };
}
```

---

## Scenario 2: Eager Migration (Aggregation Framework)

The solution for `exercises/bulk_migration.js` uses the Aggregation Framework with `$merge`.

```javascript
module.exports = [
  // 1. Filter only documents that NEED migration
  { $match: { schema_version: { $exists: false } } },

  // 2. Prepare the split data
  { 
    $addFields: {
      temp_names: { $split: ["$name", " "] }
    } 
  },

  // 3. Extract names and set version
  {
    $addFields: {
      first_name: { $arrayElemAt: ["$temp_names", 0] },
      last_name: {
        $reduce: {
          input: { $slice: ["$temp_names", 1, { $size: "$temp_names" }] },
          initialValue: "",
          in: {
            $concat: [
              "$$value",
              { $cond: [{ $eq: ["$$value", ""] }, "", " "] },
              "$$this"
            ]
          }
        }
      },
      schema_version: 2
    }
  },

  // 4. Drop legacy fields
  { $project: { name: 0, temp_names: 0 } },

  // 5. Atomic write back to the collection
  { $merge: { into: "users_eager", on: "_id", whenMatched: "merge" } }
];
```

### Command Dissection: The Migration Pipeline

| Stage | Operator | Purpose |
| :--- | :--- | :--- |
| **Stage 1** | `$match` | **Filter**: Only selects documents where `schema_version` does not exist (V1). |
| **Stage 2** | `$addFields` | **Tokenizer**: Uses `$split` to convert the string `name` into an array `temp_names` based on spaces. |
| **Stage 3** | `$addFields` | **Transformer**: Calculates `first_name` (index 0) and reconstructs `last_name` using robust array surgery. |
| **Stage 4** | `$project` | **Cleanup**: Removes the legacy `name` field and the helper `temp_names` array. |
| **Stage 5** | `$merge` | **Persistence**: Upserts the transformed documents into `users_eager` matching by `_id`. |

### Deep Dive: Robust Name Splitting (Internal Operators)

The logic inside **Stage 3** is the "heart" of the migration. Here is how it handles complex names like *"Alice Van Wonderland"*:

| Operator | Usage | Purpose |
| :--- | :--- | :--- |
| `$arrayElemAt` | `[ "$temp_names", 0 ]` | Picks the very first element of the array as the `first_name`. |
| `$slice` | `[ "$temp_names", 1, ... ]` | Returns a sub-array starting from the 2nd element to the end. This isolates the potential "last name" parts. |
| `$size` | `{ $size: "$temp_names" }` | Dynamically calculates the length of the array to provide a limit to `$slice`. |
| `$reduce` | `input: [slice], initialValue: ""` | Iterates through the sliced array to join the parts back into a single string. |
| `$concat` | `[ "$$value", " ", "$$this" ]` | Merges the accumulated string (`$$value`) with a space and the current element (`$$this`). |
| `$cond` | `{ $eq: ["$$value", ""] }` | A ternary operator logic. It prevents adding a leading space if the initial value is empty. |

---

## Polymorphic Search (The Hybrid State)

If you need to find a user while the migration is still in progress (mixed state):

```javascript
db.users.find({
  $or: [
    { name: "Alice Van Wonderland" },
    { first_name: "Alice", last_name: "Van Wonderland" }
  ]
})
```
