# LAB-013: DBA Wrap-up: Schema Validation

In this lab, you will take on the role of a Database Administrator (DBA) tasked with securing a User Management system. You will move from a completely flexible "schema-less" collection to one that enforces strict data types and required fields.

## Prerequisites
- Docker & Docker Compose installed.
- Node.js v20+ installed.

---

## Scenario 1: Implementing Strict Validation

Your goal is to create a `users` collection that requires a `username`, `email`, `age`, and `balance`. The `balance` field MUST be a **Decimal128** to avoid floating-point errors.

### 1. Start the Environment
```bash
docker-compose up -d
```

### 2. Create the Collection with a Validator
Connect to your instance using `mongosh`:

```bash
docker exec -it mongodb_lab_013 mongosh
```

Once inside the shell, execute the following command to switch to the lab database:

```javascript
use lab_db
```

Then, create the collection with the validator:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "age", "balance"],
      properties: {
        username: { bsonType: "string" },
        email: { bsonType: "string" },
        age: { bsonType: "int" },
        balance: { bsonType: "decimal" }
      }
    }
  }
})
```

### 3. Verify Strict Enforcement
Try to insert a document missing the `email` field:
```javascript
db.users.insertOne({ username: "fail_test", age: 30, balance: NumberDecimal("100.00") })
// Should return: WriteError: Document failed validation
```

Try to insert a valid document:
```javascript
db.users.insertOne({ 
  username: "jdoe", 
  email: "jdoe@example.com", 
  age: 30, 
  balance: NumberDecimal("150.75") 
})
```

### 4. Run Validation Tests (Scenario 1)
```bash
npm test tests/01-strict-validation.test.js
```

---

## Scenario 2: Permissive Validation (Warn Mode)

Sometimes you want to add validation to an existing collection without breaking your application immediately. In this scenario, you will change the validation behavior to "warn".

### 1. Modify the Collection Settings
Use the `collMod` command to change the `validationAction` to `"warn"`.

```javascript
db.runCommand({
  collMod: "users",
  validationAction: "warn"
})
```

### 2. Verify "Warn" Behavior
Try to insert an invalid document (e.g., missing all fields except username). It should now SUCCEED, even though it fails the schema.

```javascript
db.users.insertOne({ username: "rulebreaker" })
// Should return: { acknowledged: true, ... }
```

#### Where is the warning?
Since the `validationAction` is set to `warn`, MongoDB accepts the write but logs the failure. In our containerized environment, you can see this warning in the container logs.

Open a **new terminal** and run one of these commands to filter the logs:

```bash
# For PowerShell:
docker logs mongodb_lab_013 2>&1 | Select-String "Document would fail validation"

# For Linux/macOS or Git Bash:
docker logs mongodb_lab_013 2>&1 | grep "Document would fail validation"
```

You are looking for a log entry with `"s":"W"` (Severity: Warning). It will look similar to this:
`{"t":{...},"s":"W", "c":"STORAGE", "id":20294, "ctx":"conn...", "msg":"Document would fail validation", "attr":{"namespace":"lab_db.users", ...}}`

### 3. Run Validation Tests (Scenario 2)
```bash
npm test tests/02-permissive-validation.test.js
```

---

## Command Dissection

| Command / Option | Purpose |
| :--- | :--- |
| `docker exec -it <name> mongosh` | Enters the interactive MongoDB Shell inside a running container. |
| `use <db>` | Switches the current database context in `mongosh`. |
| `validator` | Specifies the validation rules for the collection. |
| `$jsonSchema` | The operator used to define rules using JSON Schema syntax. |
| `bsonType` | Enforces a specific BSON data type (e.g., `decimal`, `int`). |
| `collMod` | Command used to **MOD**ify the **coll**ection settings (like validators). |
| `validationAction: "warn"` | Changes behavior from blocking writes (`error`) to just logging them. |
| `NumberDecimal("...")` | Explicitly creates a Decimal128 BSON type in the shell. |

---

## Cleanup
To stop and remove all resources:
```bash
docker-compose down -v --remove-orphans
```
