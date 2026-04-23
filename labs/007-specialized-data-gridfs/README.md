# LAB-007: Specialized Data & GridFS

Welcome to the **Specialized Data** lab. In this session, you will master data scenarios that push the boundaries of standard BSON documents: large binary objects, UUIDs for enterprise integration, and precise temporal sequencing.

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

### 1.2 Generate the Large File
Since large binary files are ignored by version control, run the provided generator script to create your test file:

```bash
node generate-sample.js
```

Attempting to insert this file (`large-file.dat`) directly into a standard MongoDB document field will result in a `BSONObjectTooLarge` error because it exceeds the 16MB limit.

### 1.3 The Programmatic Way (Native Driver)
As a developer, you will typically interact with GridFS through the official driver. We have provided a script `upload-gridfs.js` that uses the `GridFSBucket` API to stream the file into MongoDB.

```bash
node upload-gridfs.js
```

> [!NOTE]
> Review the code in `upload-gridfs.js`. Notice how `fs.createReadStream()` is piped into `bucket.openUploadStream()`. This ensures that even a 20MB (or 2GB) file doesn't overload your application's RAM, as data is processed in small chunks.

### 1.4 Inspecting the "Bucket"
GridFS stores data in two collections: `fs.files` (metadata) and `fs.chunks` (binary blocks). Use `mongosh` inside the container to see how MongoDB fragmented your file:

```bash
# Connect to the shell inside the container
docker exec -it mongodb_lab_007 mongosh "mongodb://localhost:27017/lab_db"
```

Once inside the shell, run these queries to inspect the internals:

```javascript
// 1. Find the file metadata
db.fs.files.find()

// 2. See the actual chunks (usually 255KB each)
db.fs.chunks.find({}, { data: 0 }).limit(5) // Hiding binary data for clarity
```

### 1.5 CLI Utility: `mongofiles` (Alternative)
MongoDB also provides a command-line tool called `mongofiles` for quick file management. This tool is pre-installed in your Docker container.

```bash
# Upload via CLI with custom metadata
docker cp large-file.dat mongodb_lab_007:/large-file.dat
docker exec -it mongodb_lab_007 mongofiles -d lab_db --metadata='{"source": "cli-tool", "priority": "high"}' put /large-file.dat
```

> [!TIP]
> Notice that while the Node.js driver allows you to pass a native JavaScript object for metadata, `mongofiles` requires a **JSON-formatted string**.

### 1.6 Command Dissection: Bridge to Container
Interacting with tools inside a container requires understanding the "bridge" between your host and Docker:

| Command Part | Purpose |
| :--- | :--- |
| `docker cp` | Copies the file from your **Host OS** to the **Container's filesystem**. |
| `docker exec -it` | Executes a command **inside** the running container interactively. |
| `mongofiles` | The specific binary tool being called inside the container. |
| `-d lab_db` | Target database for the GridFS bucket. |
| `--metadata='...'` | Attaches a JSON document to the file entry in `fs.files`. |
| `put <path>` | Instruction to chunk and store the file. |

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

> [!NOTE]
> In modern `mongosh`, you will see `externalId: UUID("...")`. This is a "helper" that indicates MongoDB is using **Binary Subtype 4** (the standard for UUIDs).

To explicitly verify the internal BSON subtype, you can use **Canonical EJSON**. This format "unmasks" the BSON types to show exactly how they are stored:

```javascript
// Run this in mongosh to see the raw BSON representation
const user = db.users.findOne({ username: "monge_engineer" });
EJSON.stringify(user, { relaxed: false })
```

> [!TIP]
> In the output, you will see `"subType": "04"`. This confirms that the `UUID()` helper created a **Binary Subtype 4** object.

### 2.3 Digital Signatures (Generic Binary)
While UUIDs have their own subtype, other binary data (like encrypted strings or signatures) use the **Generic Subtype (0)**.

Use `mongosh` to store a mock digital signature:

```javascript
db.signatures.insertOne({
  owner: "monge_engineer",
  data: new Binary(Buffer.from("MOCKED_DIGITAL_SIGNATURE_DATA"), 0)
})
```
> [!NOTE]
> Notice the `0` in `new Binary(..., 0)`. This explicitly sets the BSON subtype to Generic. If you don't specify it, MongoDB defaults to 0.

Para verificar que este binario es de **Subtipo 0 (Generic)**:

```javascript
const sig = db.signatures.findOne({ owner: "monge_engineer" });
EJSON.stringify(sig, { relaxed: false })
```

> [!TIP]
> Verás `"subType": "00"` en el campo `data`. Este es el valor por defecto para la mayoría de los blobs binarios que no son UUIDs ni hashes MD5.

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

### 3.2 Verify Temporal Types
Just like with UUIDs, `mongosh` uses helpers (`ISODate` and `Timestamp`). Use Canonical EJSON to see the underlying BSON structure:

```javascript
const event = db.events.findOne({ type: "temporal_test" });
EJSON.stringify(event, { relaxed: false })
```

> [!TIP]
> - `createdAt` will show as **`$date`**: A 64-bit integer representing milliseconds since the Unix epoch.
> - `clusterTime` will show as **`$timestamp`**: Two 32-bit integers (`t` for seconds, `i` for increment).

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
