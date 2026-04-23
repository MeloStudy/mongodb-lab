# MongoDB Lab Syllabus

This document tracks the progress of the curriculum and the status of each laboratory.

## Module 1: The Core Database (Introduction & Foundation)
Focus: Understanding the ecosystem, basic connection, and how MongoDB stores data under the hood.

- [x] **LAB-001: Hello MongoDB**
  - Concepts: Basic concepts, Ecosystem, Installation (Docker), Shell vs Drivers.
  - Status: *Completed*
- [x] **LAB-002: BSON & Data Types**
  - Concepts: JSON vs BSON. Int32, Int64, Doubles and Decimal128 (Financial Precision).
  - Status: *Completed*
- [x] **LAB-003: DevOps Wrap-up: Shell & Server Config**
  - Concepts: Advanced Node configuration, `dbpath`, `logpath`, Configuration files (`.conf`).
  - Status: *Completed*

## Module 2: Complete CRUD Operations
Focus: Mastering Create, Read, Update, and Delete operations at a granular level.

- [x] **LAB-004: Advanced Inserts & Write Concerns**
  - Concepts: `insertOne`, `insertMany`, Ordered vs Unordered, `writeConcern` (w: "majority", j: true).
  - Status: *Completed*
- [x] **LAB-005: Advanced Queries & Projections**
  - Concepts: Comparison (`$gt`, `$in`), Logical (`$and`, `$or`), Element (`$exists`, `$type`), Array Operators (`$all`, `$elemMatch`, `$size`, `$expr`).
  - Status: *Completed*
- [x] **LAB-006: Updating Data & Array Surgery**
  - Concepts: `$set`, `$inc`, `$mul`, `$rename`, `$unset`, `upsert`, `$setOnInsert`, Positional Operators (`$`, `$[]`, `arrayFilters`).
  - Status: *Completed*
- [x] **LAB-007: Specialized Data & GridFS**
  - Concepts: Handling large files (>16MB) with **GridFS**, Binary Subtypes, **UUIDs**, and complex Date vs Timestamp management.
  - Status: *Completed*
- [ ] **LAB-008: Deleting Data & Tooling**
  - Concepts: `deleteOne`, `deleteMany`, `drop()`, `dropDatabase()`. GUI Exploration: **MongoDB Compass** (Schema Discovery, Visual Explain Plan).
  - Status: *Planned*

## Module 3: Schema Design & Relationships
Focus: Leaving relational habits behind. Intelligent Structuring and Data Integrity.

- [ ] **LAB-009: Document Structuring (1:1, 1:N)**
  - Concepts: **Data Types Choice & Impact** (Storage optimization). Embedding vs Referencing decision matrix. "One-to-Few" vs "One-to-Many".
  - Status: *Planned*
- [ ] **LAB-010: Modeling Patterns (N:N & Advanced)**
  - Concepts: **Extended Reference**, **Subset Pattern** (handling large arrays).
  - Status: *Planned*
- [ ] **LAB-011: Time-Series & High-Density Modeling**
  - Concepts: **Native Time-Series Collections**, Bucket Pattern, and Granularity control (seconds/minutes/hours).
  - Status: *Planned*
- [ ] **LAB-012: DBA Wrap-up: Schema Validation**
  - Concepts: `$jsonSchema` implementation, `validationAction` (warn vs error), `validationLevel`.
  - Status: *Planned*

## Module 4: Performance, Indices & Spatial Data
Focus: Making queries fast and working with location data.

- [ ] **LAB-013: Core Indexing & ESR Rule**
  - Concepts: Compound Indexes, **ESR Rule** (Equality, Sort, Range), TTL Indexes, Text Indexes, Covered Queries.
  - Status: *Planned*
- [ ] **LAB-014: Geospatial Data**
  - Concepts: GeoJSON objects, `2dsphere` indexes, `$near`, `$geoWithin`, Proximity and Polygon queries.
  - Status: *Planned*
- [ ] **LAB-015: DBA Wrap-up: Query Planning**
  - Concepts: Analyzing `explain()` output, `winningPlan` vs `rejectedPlans`, `IXSCAN` vs `COLLSCAN` detection.
  - Status: *Planned*

## Module 5: The Aggregation Framework
Focus: Complex data transformations and analytics pipelines.

- [ ] **LAB-016: Pipeline Fundamentals**
  - Concepts: `$match`, `$group`, `$project`, `$addFields`, `$unwind`, `$sort`, `$limit`.
  - Status: *Planned*
- [ ] **LAB-017: Advanced Analytics Stages**
  - Concepts: `$lookup` (Left Outer Join), `$graphLookup` (Recursive), `$facet` (Categorization), `$out` & `$merge`.
  - Status: *Planned*

## Module 6: Security & Administration
Focus: Protecting data and securing the server.

- [ ] **LAB-018: Authentication & RBAC**
  - Concepts: Creating Users, Built-in Roles, Custom Roles, Scoping access by database.
  - Status: *Planned*
- [ ] **LAB-019: DBA Wrap-up: Encryption & Network Security**
  - Concepts: Enabling Auth in `mongod.conf`, Keyfiles, SSL/TLS, Encryption at Rest (WiredTiger).
  - Status: *Planned*

## Module 7: Enterprise Integration & Transactions
Focus: Bridging the database with Java (Spring Boot) and managing ACID.

- [ ] **LAB-020: Java Enterprise: Spring Data MongoDB**
  - Concepts: `MongoRepository` vs `MongoTemplate`, Custom Conversions, `Optimistic Locking` (@Version).
  - Status: *Planned*
- [ ] **LAB-021: Secondary Languages Integration**
  - Concepts: Node.js Native Driver vs Mongoose (Middleware, Virtuals, Schemas).
  - Status: *Planned*
- [ ] **LAB-022: ACID Transactions**
  - Concepts: Multi-document transactions, `ClientSession`, `withTransaction()` pattern in Java/Node.
  - Status: *Planned*

## Module 8: High Availability & Scaling
Focus: Beyond local containers into production-grade clusters.

- [ ] **LAB-023: Replica Sets & Elections**
  - Concepts: P-S-S architecture, Election mechanics, Priority, Hidden Members, Arbiter.
  - Status: *Planned*
- [ ] **LAB-024: Scaling with Sharding**
  - Concepts: Shard Keys selection, Mongos Router, Config Servers, Chunk migration.
  - Status: *Planned*
- [ ] **LAB-025: Cloud-Native Atlas & Realm**
  - Concepts: Cluster provisioning, IP Access Lists, Database Triggers, Serverless Functions.
  - Status: *Planned*

---
**Version**: 0.5.0 | **Author**: MongoDB Lab Engineer
