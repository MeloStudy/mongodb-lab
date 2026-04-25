# LAB-011: Schema Evolution & Versioning

## Introduction
Applications are alive. They change. In this lab, you will learn how to handle data structure changes without breaking your application. We will transform a legacy system from a single `name` field to a versioned `first_name`/`last_name` structure.

In this lab, we follow an **Engineering Workflow**: you will implement your logic in dedicated `.js` files and validate them using an automated test suite.

## 1. Setup Environment
Start the container and the automatic seed process:
```bash
docker-compose up -d
```
*(Optional shortcut: `make setup`)*

### Data Strategy
This lab seeds two collections with "Legacy Debt" (versionless docs):
1. `users`: Your playground for manual testing in `mongosh`.
2. `users_eager`: Isolated collection used by the test suite to validate your bulk migration.

---

## 2. The Hybrid State: Polymorphic Search
Before we fix the data, we must know how to live with it. Currently, your collection has **V1 (legacy)** and **V2 (versioned)** documents. 

### Task
Open `mongosh`:
```bash
docker exec -it mongodb_lab_011 mongosh lab_db
```

Try to find a user without knowing if they are V1 or V2. You must search both schemas:
```javascript
db.users.find({
  $or: [
    { name: "Alice Van Wonderland" },
    { first_name: "Alice", last_name: "Van Wonderland" }
  ]
})
```

---

## 3. Scenario 1: Lazy Migration (App Logic)
In this scenario, we simulate an application that updates documents "on-the-fly" as they are accessed.

### Task: Implement the Transformation
Open [exercises/lazy_migration.js](./exercises/lazy_migration.js). 

Your task is to implement the `migrateUser` function. It receives a V1 document and must return a V2 document:
- **Input**: `{ name: "John Doe" }`
- **Output**: `{ first_name: "John", last_name: "Doe", schema_version: 2 }`

> **Note**: Be careful with multi-part names like "Alice Van Wonderland". The first word is the `first_name`, and everything else is the `last_name`.

### Validation
Run the tests to verify your logic:
```bash
npm test tests/01-lazy-migration.test.js
```

---

## 4. Scenario 2: Eager Migration (Bulk Aggregation)
Manual updates are fine for a few documents, but for a database with millions, we need the **Aggregation Framework** to perform an "Eager Migration".

### Task: The Migration Pipeline
Open [exercises/bulk_migration.js](./exercises/bulk_migration.js).

You must define an aggregation pipeline that transforms ALL remaining V1 documents to V2 at once.

| Stage | Operator | Requirement |
| :--- | :--- | :--- |
| **Stage 1** | `$match` | Filter only documents without `schema_version`. |
| **Stage 2** | `$addFields` | Split the `name` field. |
| **Stage 3** | `$addFields` | Construct `first_name` and `last_name` (using `$reduce` for the latter). |
| **Stage 4** | `$project` | Remove the legacy `name` field and any temporary variables. |
| **Stage 5** | `$merge` | Persist changes back into the collection. |

### Validation
Run the tests to verify the bulk migration against the `users_eager` collection:
```bash
npm test tests/02-bulk-migration.test.js
```

---

## 5. Summary of Validation
To run all tests at once:
```bash
npm test
```

## Solutions
Stuck? Check the [SOLUTIONS.md](./SOLUTIONS.md) for full explanations and command dissections.

## 🧹 Step 6: Atomic Cleanup
To remove the containers and the local volume:
```bash
docker-compose down -v --remove-orphans
```

> [!TIP]
> The `--remove-orphans` flag ensures that any containers from previous lab attempts or different branches are also cleaned up, keeping your Docker environment pristine.

*(Optional shortcut: `make clean`)*

