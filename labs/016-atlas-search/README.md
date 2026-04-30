# LAB-016: Atlas Search (Lucene Engine)

Welcome to the future of data retrieval. In this lab, you will move beyond standard B-Tree indexes and implement a professional-grade search engine using **Atlas Search**.

## 🏗 Understanding the Architecture (`mongot`)

Before starting, it is vital to understand that Atlas Search does NOT run inside the core `mongod` process.
- **`mongod`**: The primary database process (Handles B-Trees, CRUD, etc.).
- **`mongot`**: The search sidecar process (Handles Lucene, Inverted Indexes, etc.).

When you run a `$search` query, `mongod` proxies the request to `mongot`. If `mongot` is down, full-text search fails even if the database is running.

---

## 🚀 Environment Setup

Launch the laboratory container:
```bash
docker-compose up -d
```
*Wait ~20 seconds for the search engine to initialize.*

Enter the shell:
```bash
docker exec -it mongodb_lab_016 mongosh search_db
```

---

## 1. Creating the Search Index

Atlas Search indexes are defined using JSON. We will create a mapping that supports full-text, autocomplete, and filtering.

Run this command in `mongosh`:
```javascript
db.books.createSearchIndex("default", {
  mappings: {
    dynamic: true,
    fields: {
      title: [
        { type: "string" },
        { type: "autocomplete" }
      ],
      genre: { type: "string" },
      description: { type: "string" }
    }
  }
})
```

**🔍 Wait for the Index**:
Search indexes are built asynchronously. Check the status:
```javascript
db.books.getSearchIndexes()
```
*Continue when the status is `READY`.*

---

## 2. Scenario 1: The Library Search ($search)

### The Problem
You need to find books about "scalable high-performance" systems.

### The Solution: Full-Text Analysis
```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "high-performance scalable",
        path: ["title", "description"]
      }
    }
  }
])
```
**🔍 Analyze the Output**:
Notice that "MongoDB: The Definitive Guide" appears first due to its high relevance score (BM25).

---

## 3. Scenario 2: Handling Typos (Fuzzy)

### The Problem
A user types "Mngodb" instead of "MongoDB".

### The Solution: Levenshtein Distance
```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "Mngodb",
        path: "title",
        fuzzy: { maxEdits: 1 }
      }
    }
  }
])
```

---

## 4. Scenario 3: Real-time Autocomplete

### The Problem
As a user types "Clea", you want to suggest "Clean Code".

### The Solution: N-Grams
```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      autocomplete: {
        query: "Clea",
        path: "title"
      }
    }
  }
])
```

---

## 5. Scenario 4: Filtering results (Compound Search)

### The Problem
You want to search for "database" books but ONLY in the "Technology" genre. You don't want the genre filter to affect the relevance score.

### The Solution: The `compound` Operator
```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      compound: {
        must: [{
          text: {
            query: "database",
            path: ["title", "description"]
          }
        }],
        filter: [{
          text: {
            query: "Technology",
            path: "genre"
          }
        }]
      }
    }
  }
])
```
**🔍 Analyze the Output**:
Only "Technology" books are returned. The `filter` clause is binary (match/no-match) and doesn't change the BM25 score, unlike `must`.

---

## 6. Scenario 5: Visualizing Matches (Highlighting)

### The Problem
In a UI, you want to show snippets of text with the matching words bolded.

### The Solution: `highlight` Metadata
```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "scalable",
        path: "description"
      },
      highlight: {
        path: "description"
      }
    }
  },
  {
    $project: {
      title: 1,
      highlights: { $meta: "searchHighlights" }
    }
  }
])
```
**🔍 Analyze the Output**:
Notice the new `highlights` field. It contains an array of matches with their positions, allowing your frontend to render the bold text.

---

## 🛠 Command Dissection

| Operator / Field | Purpose | Technical Detail |
| :--- | :--- | :--- |
| `mongot` | Search Sidecar | The Java/Lucene process that powers Atlas Search. |
| `$search` | Primary Stage | Must be the first stage. Delegates to `mongot`. |
| `createSearchIndex` | Index Creation | Defines how Lucene should analyze fields. |
| `compound` | Boolean Logic | Combines `must`, `should`, and `filter` clauses. |
| `filter` | Binary Matching | Does NOT contribute to the relevance score. |
| `highlight` | Snippet Offset | Returns metadata for UI bolding. |
| `$meta: "searchHighlights"` | Projection | Accesses the internal highlight metadata from `mongot`. |

## 🧪 Validation
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v
```
