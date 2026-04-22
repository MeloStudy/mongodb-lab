# Conceptual Guide: Atomic Operators & Array Surgery

In MongoDB, we rarely replace whole documents. Instead, we use **Update Operators** to modify specific fields atically. This is faster and prevents the "Lost Update" problem.

## 1. Atomic Arithmetic Operators

- **$inc**: Increments a numeric value by a specified amount (can be negative for decrementing). 
- **$mul**: Multiplies a value. Essential for currency conversions or percentage-based adjustments.
- **$set**: Changes the value of a field to a new value.
- **$unset**: Removes a field from a document.
- **$rename**: Renames a field name. Useful for schema migrations without rewriting the whole document.

## 2. Array Mutation Operators

Managing history or tags requires specialized array operators:
- **$push**: Adds an element to the end of an array.
- **$addToSet**: Only adds the element if it doesn't already exist (Set logic).
- **$pull**: Removes all array elements that match a specific condition.

## 3. Positional Surgery (The Mastery Level)

How do we update a nested object inside an array?

### The First Match: `$`
Updates the **first** element that matched the query condition.
`{ "tags": "old" }, { "$set": { "tags.$": "new" } }`

### The All Match: `$[]`
Updates **every** element in the array simultaneously.
`{ "$set": { "components.$[].active": true } }`

### The Specific Surgeon: `arrayFilters`
Allows you to define a filter for elements and then reference that filter by an identifier `$[<id>]`.
```javascript
db.collection.updateOne(
  { _id: 1 },
  { $set: { "sensors.$[s].active": false } },
  { arrayFilters: [ { "s.id": "sensor-123" } ] }
)
```
This is the most powerful way to perform "targeted surgery" on complex documents.

## 4. Upserts
When `upsert: true` is used, MongoDB will create the document if no target is found. This makes your update operations **idempotent**.

### $setOnInsert
When performing an upsert, you often want to set certain fields **only if the document is being created** (e.g., `created_at`). This operator ignores these fields if the document already exists.
