# Conceptual Guide: Advanced Queries

## 1. The Array Matching Trap

When querying an array of objects, like `shipments: [{status: "A", qty: 10}, {status: "B", qty: 100}]`:

- **Dot Notation (`"shipments.status": "A", "shipments.qty": 100`)**: MongoDB looks for *any* element with status "A" and *any* element with qty 100. They don't have to be the same element!
- **$elemMatch**: Forces MongoDB to find a **single** element that satisfies all conditions inside the block.

## 2. Advanced Array Operators

### $all
Equivalent to an `$and` operation on a single field. It ensures that the array contains **all** specified elements, regardless of order or other elements present.
*Usage*: `{ tags: { $all: ["networking", "security"] } }`

### $size
Matches documents where an array has exactly the specified number of elements.
> [!WARNING]
> `$size` only accepts exact numbers. You cannot use it for ranges like `{ $size: { $gt: 5 } }`. For ranges, you would typically need a calculated `size` field or a `$where` clause (not recommended for performance).

## 3. Logical Operators

- **$and**: Used to join query clauses with a logical AND. Usually implicit, but required when you have multiple conditions on the same field name.
- **$or**: Joins clauses with a logical OR. Useful for matching disparate conditions.
- **$in**: Shorthand for an `$or` on a single field. `{ status: { $in: ["A", "B"] } }` is cleaner than `{ $or: [{status: "A"}, {status: "B"}] }`.

## 4. Schema Flexibility ($exists & $type)

In a document database, not all documents have the same fields.
- **$exists**: Checks if a field is present (`true`) or absent (`false`).
- **$type**: Checks if a field matches a specific BSON type (e.g., `string`, `number`, `array`). This is vital for data cleaning scripts.

## 5. Projections

Projections allow you to limit the data returned by the server. 
- **Inclusion (1)**: Only return these fields.
- **Exclusion (0)**: Return everything *except* these fields.
- **Rule**: You cannot mix inclusion and exclusion in the same projection, with the sole exception of the `_id` field.
