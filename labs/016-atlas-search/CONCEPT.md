# Atlas Search: Beyond B-Trees

Standard MongoDB indexes use a **B-Tree** structure. B-Trees are excellent for range queries (`age > 25`) or exact matches (`status: "shipped"`). However, they are mathematically inefficient for full-text search.

## 1. The Inverted Index

Atlas Search is powered by **Apache Lucene**. It uses a data structure called an **Inverted Index**.

Imagine an index at the back of a textbook:
- You look for the word "Reentrancy".
- The index tells you it's on pages 45, 89, and 102.

Lucene does exactly this:
1. **Tokenization**: It breaks your text into "tokens" (words).
2. **Analysis**: It lowercases them, removes punctuation, and strips out "stop words" (like "the", "and", "is").
3. **Mapping**: It creates a table where each token points to the documents that contain it.

*Result*: Searching for a word in 10 million documents becomes a single O(1) lookup.

## 2. Analyzers

An **Analyzer** is a pipeline that defines how text is processed.
- **Standard Analyzer**: The default. Good for most Western languages.
- **Language Analyzers**: Handle stemming (e.g., "running" becomes "run" so a search for "run" finds "running").
- **Keyword Analyzer**: Treats the entire string as a single token.

## 3. Fuzzy Search

Users make typos. **Fuzzy Search** uses the **Levenshtein Distance** algorithm to find words that are "close" to the query.
- Distance 1: "Mngodb" -> "MongoDB" (1 insertion).
- Distance 2: "Kat" -> "Cat" (1 substitution).

## 4. Relevance Scoring (BM25)

In a standard index search, a document either matches or it doesn't. 
In Atlas Search, every document gets a **Score**.
- **TF (Term Frequency)**: How many times does the word appear in this document?
- **IDF (Inverse Document Frequency)**: How rare is this word across all documents? (A match on "Quantum" is worth more than a match on "the").

The `$search` stage sorts results by this score automatically.
