/**
 * Scenario 2: Eager Migration (Bulk Aggregation)
 * 
 * Your task is to implement an aggregation pipeline that transforms 
 * ALL remaining V1 documents in the 'users_eager' collection to V2.
 * 
 * The pipeline should:
 * 1. Match documents without 'schema_version'
 * 2. Split the 'name' field
 * 3. Handle multi-part last names robustly
 * 4. Project away legacy fields
 * 5. Merge results back into 'users_eager'
 */

const pipeline = [
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

module.exports = pipeline;
