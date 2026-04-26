# Concept: Schema Validation in MongoDB

In MongoDB, "Schema-less" doesn't mean "unstructured". While the database is flexible by nature, production environments often require data integrity constraints to prevent application bugs from corrupting the dataset.

## The `$jsonSchema` Operator

Since MongoDB 3.6, the primary way to enforce schemas is through the `$jsonSchema` operator. This allows you to define a schema using a subset of the [JSON Schema standard](https://json-schema.org/).

### Basic Structure
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email"],
      properties: {
        username: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+$",
          description: "must be a valid email string"
        },
        age: {
          bsonType: "int",
          minimum: 18,
          description: "must be an integer and at least 18"
        }
      }
    }
  }
})
```

### Key Keywords:
- `bsonType`: Specifies the exact BSON type (e.g., `string`, `int`, `long`, `decimal`, `bool`, `date`).
- `required`: An array of field names that MUST be present in every document.
- `properties`: A map defining validation rules for specific fields.
- `pattern`: Regular expression validation for strings.

---

## Validation Action (`validationAction`)

This setting determines what happens when a document fails validation:

1. **`error` (Default)**: MongoDB rejects the write operation and returns a `DocumentValidationFailure` (Code 121).
2. **`warn`**: MongoDB accepts the write operation but logs the validation failure in the server's log file. This is useful for "Dry Run" testing of new schemas on live data.

---

## Validation Level (`validationLevel`)

This determines how strictly the rules are applied to existing data:

1. **`strict` (Default)**: Applies validation rules to all inserts and all updates.
2. **`moderate`**: Applies validation rules to inserts and to updates on documents that *already fulfill* the validation criteria. Updates to documents that were already "illegal" before the schema was applied are allowed (unless the update makes them fail even more rules).
3. **`off`**: No validation occurs.

---

## Financial Precision: Decimal128

In this lab, we use `bsonType: "decimal"` for the `balance` field. 
**Why?** Because standard JavaScript numbers (and MongoDB "double" type) use floating-point math, which can lead to rounding errors like `0.1 + 0.2 = 0.30000000000000004`. 
For money, we must use **Decimal128** to ensure 100% precision.

```javascript
// In mongosh:
db.users.insertOne({
  username: "rich_user",
  balance: NumberDecimal("100.50") // Correct
})
```
