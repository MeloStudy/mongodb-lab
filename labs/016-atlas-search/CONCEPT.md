# Atlas Search: Beyond B-Trees

Standard MongoDB indexes use a **B-Tree** structure. B-Trees are excellent for range queries (`age > 25`) or exact matches (`status: "shipped"`). However, they are mathematically inefficient for full-text search.

## 1. The Architectural Shift: `mongot`

Atlas Search introduces a sidecar process called **`mongot`**.
- **`mongod`**: Manages the core database engine (B-Trees, CRUD, TTL).
- **`mongot`**: A Java-based process running **Apache Lucene**. It manages the **Inverted Indexes**.

### How they communicate:
When you execute a pipeline with `$search`:
1. `mongod` receives the query.
2. `mongod` identifies that it starts with `$search` and forwards the request to `mongot` via a private RPC channel.
3. `mongot` performs the Lucene lookup and returns the matching `ObjectIds` and their **Scores**.
4. `mongod` fetches the full documents from disk and continues the pipeline.

## 2. The Inverted Index

Atlas Search is powered by **Apache Lucene**. It uses a data structure called an **Inverted Index**.

Imagine an index at the back of a textbook:
- You look for the word "Reentrancy".
- The index tells you it's on pages 45, 89, and 102.

Lucene does exactly this:
1. **Tokenization**: It breaks your text into "tokens" (words).
2. **Analysis**: It lowercases them, removes punctuation, and strips out "stop words" (like "the", "and", "is").
3. **Mapping**: It creates a table where each token points to the documents that contain it.

## 3. Analyzers: The Token Factory

An **Analyzer** is a pipeline that defines how text is processed.

| Analyzer | "The Running Men" Output | Use Case |
| :--- | :--- | :--- |
| **Standard** | `["the", "running", "men"]` | General purpose, lowercasing + punctuation removal. |
| **English** | `["run", "men"]` | Stemming (running -> run) and stop-word removal ("the"). |
| **Keyword** | `["The Running Men"]` | Exact phrase matching, treats string as one token. |

## 4. Compound Logic: Boolean Searches

Real-world search is rarely just one word. The `compound` operator allows for complex boolean logic:
- **`must`**: Clauses that MUST match. Contributes to the relevance score.
- **`mustNot`**: Clauses that MUST NOT match.
- **`should`**: Clauses that PREFERABLY match. If they do, the score increases.
- **`filter`**: Clauses that MUST match, but **do not affect the score**. Ideal for category filtering.

## 5. Highlighting: Visual Relevance

Search engines often show *why* a result was returned by highlighting the matching keywords.
Atlas Search returns **Offset Metadata** (where the word starts and ends in the string). The client uses this to wrap the matches in `<b>` or `<span>` tags.

## 6. Fuzzy Search & Scoring

Users make typos. **Fuzzy Search** uses the **Levenshtein Distance** algorithm to find words that are "close" to the query.
- Distance 1: "Mngodb" -> "MongoDB" (1 insertion).

### Relevance Scoring (BM25)
In Atlas Search, every document gets a **Score**.
- **TF (Term Frequency)**: How many times does the word appear in this document?
- **IDF (Inverse Document Frequency)**: How rare is this word across all documents?

The `$search` stage sorts results by this score automatically.
