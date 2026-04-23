# LAB-007: Specialized Data & GridFS

Welcome to the **Specialized Data** lab. In this session, you will master data scenarios that push the boundaries of standard BSON documents: large binary objects, UUIDs for enterprise integration, and precise temporal sequencing.

---

## 🛠️ Prerequisites

- **MongoDB 7.0+** (running via Docker)
- **Node.js v20+**
- `mongosh` installed on your host machine.

---

## 🛰️ Scenario 1: The Media Archive (GridFS)

You are engineering a satellite imaging system. High-resolution captures reach **20MB+**, exceeding the strict 16MB BSON limit.

### 1.1 Spin up the environment
```bash
docker-compose up -d
```

### 1.2 The "Large File" Challenge
A `large-file.dat` (20MB) has been pre-generated for you. Attempting to insert this directly into a standard document field will result in a `BSONObjectTooLarge` error.

### 1.3 Upload using GridFS
Instead of a standard `insertOne`, utilize the `mongofiles` utility provided by MongoDB Database Tools (pre-installed in the container).

```bash
# First, ensure the file is accessible to the container
docker cp large-file.dat mongodb_lab_007:/large-file.dat

# Execute the upload into the 'lab_db' database
docker exec -it mongodb_lab_007 mongofiles -d lab_db put /large-file.dat
```

### 1.4 Command Dissection: `mongofiles`
| Flag/Cmd | Description |
| :--- | :--- |
| `-d <db>` | Specifies the target database. |
| `put <file>` | Chunks the file and stores it in the `fs` bucket. |
| `get <file>` | Reassembles chunks and downloads the file. |
| `list` | Displays all files managed by GridFS in the database. |

### 1.5 The Programmatic Way (Native Driver)
While CLI tools are great for one-off tasks, as a developer you will often use the **Native Driver**.

We have provided a script `upload-gridfs.js` that uses the `GridFSBucket` class to stream the file into MongoDB.

```bash
# Run the programmatic upload
node upload-gridfs.js
```

> [!NOTE]
> Review `upload-gridfs.js` to see how `fs.createReadStream()` is piped into `bucket.openUploadStream()`. This is the standard pattern for handling large data without overloading the server's RAM.

---

## 🔐 Scenario 2: Secure Identity (UUIDs)

Integrate with a legacy system that requires **UUIDs** instead of MongoDB's default `ObjectIds`.

### 2.1 Insert with native UUID
Use `mongosh` to insert a document with a standard BSON UUID (Subtype 4):

```javascript
use lab_db

db.users.insertOne({
  username: "monge_engineer",
  externalId: UUID("550e8400-e29b-41d4-a716-446655440000")
})
```

### 2.2 Verify the Binary Subtype
Confirm the storage format:
```javascript
db.users.find({ username: "monge_engineer" })
```
> [!TIP]
> You will notice `BinData(4, ...)` in the output. The `4` signifies a **Standard UUID** byte ordering.

---

## ⏱️ Scenario 3: Temporal Precision

Learn the critical difference between application dates and server-side sequence markers.

### 3.1 Date vs Timestamp
Insert an event with both types:

```javascript
db.events.insertOne({
  type: "temporal_test",
  createdAt: new Date(),          // 64-bit millisecond precision
  clusterTime: new Timestamp(0, 0) // 64-bit internal server sequence
})
```

> [!IMPORTANT]
> `Timestamp` is primarily for internal orchestration (Oplog). In 99% of application logic, you should use `Date`.

---

## ✅ Validation

Verify your implementation by running the suite of automated tests:

```bash
npm test
```

## 🧹 Atomic Cleanup

Restore your environment to a pristine state:

```bash
docker-compose down -v --remove-orphans
```
