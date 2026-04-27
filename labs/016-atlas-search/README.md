# LAB-016: Atlas Search (Lucene Engine)

Welcome to the future of data retrieval. In this lab, you will move beyond standard B-Tree indexes and implement a professional-grade search engine using **Atlas Search**.

## 🚀 Environment Setup

Launch the laboratory container (this uses the `atlas-local` engine):
```bash
docker-compose up -d
```
*Wait ~20 seconds for the engine to initialize.*

Enter the shell:
```bash
docker exec -it mongodb_lab_016 mongosh search_db
```

---

## 1. Creating the Search Index

Unlike standard indexes, Atlas Search indexes are defined using JSON. We will create a "Dynamic Mapping" index that automatically indexes all string fields in our `books` collection.

Run this command in `mongosh`:
```javascript
db.books.createSearchIndex("default", {
  mappings: {
    dynamic: true,
    fields: {
      title: [
        { type: "string" },
        { type: "autocomplete" }
      ]
    }
  }
})
```
*Note: We explicitly added a mapping for `title` as `autocomplete` for Scenario 3.*

**🔍 Wait for the Index**:
Search indexes are built asynchronously by a separate process. Check the status:
```javascript
db.books.getSearchIndexes()
```
*Continue when the status is `READY`.*

---

## 2. Scenario 1: The Library Search ($search)

### The Problem
You need to find books about "scalable high-performance" systems. A standard `$regex` would be slow and wouldn't rank the best match first.

### The Solution: Full-Text Analysis
We use the `$search` aggregation stage. Notice we don't need to specify the field if we use the default index, but here we explicitly target `title` and `description`:

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
Notice that "MongoDB: The Definitive Guide" appears first. Why? Because Lucene analyzed the description and found both terms, calculating a higher relevance score than other documents.

---

## 3. Scenario 2: Handling Typos (Fuzzy)

### The Problem
A user types "Mngodb" instead of "MongoDB". A standard index would return 0 results.

### The Solution: Levenshtein Distance
By adding the `fuzzy` option, we tell Atlas Search to allow for minor character differences:

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
**🔍 Analyze the Output**:
Success! The engine calculated that "Mngodb" is only 1 edit away from "MongoDB" and returned the document.

---

## 4. Scenario 3: Real-time Autocomplete

### The Problem
As a user types "Clea", you want to suggest "Clean Code" immediately.

### The Solution: N-Grams
Autocomplete works by breaking words into fragments (e.g., "Cle", "Clea", "Clean"). Since we mapped the `title` field as `autocomplete` in Step 1, we can query it now:

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

## 5. Scenario 4: Ranking & Scoring

### The Problem
You want to see *how* MongoDB decided which book was better.

### The Solution: Meta-data Projection
We can project the `searchScore` metadata into a field:

```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "software development mastery",
        path: ["title", "description"]
      }
    }
  },
  {
    $project: {
      _id: 0,
      title: 1,
      score: { $meta: "searchScore" }
    }
  }
])
```
**🔍 Analyze the Output**:
"The Pragmatic Programmer" should have the highest score. Dissect the score: it is a combination of how many times your keywords appeared (TF) and how unique those keywords are in the whole library (IDF).

---

## 🛠 Command Dissection

| Operator | Purpose | Technical Detail |
| :--- | :--- | :--- |
| `$search` | Primary Entry Point | Must be the first stage in an aggregation pipeline. |
| `text` | Keyword Search | Standard operator for finding words or phrases. |
| `fuzzy` | Error Tolerance | Uses Levenshtein algorithm. `maxEdits` can be 1 or 2. |
| `autocomplete` | Real-time Search | Requires a specific `autocomplete` mapping in the index definition. |
| `$meta: "searchScore"` | Relevance Logic | Projects the internal calculation of the BM25 algorithm. |

## 🧪 Validation
```bash
npm test
```

## 🧹 Cleanup
```bash
docker-compose down -v
```
