# MongoDB Lab Syllabus

This document tracks the progress of the curriculum and the status of each laboratory.

## Module 1: The Core Database (Introduction & Foundation)
Focus: Understanding the ecosystem, basic connection, and how MongoDB stores data under the hood.

- [x] **LAB-001: Hello MongoDB**
  - Concepts: Basic concepts, Ecosystem, Installation (Docker), Shell vs Drivers.
  - Status: *Completed*
- [ ] **LAB-002: BSON & Data Types**
  - Concepts: JSON vs BSON. Int32, Int64, Doubles and Decimal128 (Financial Precision).
  - Status: *Planned*
- [ ] **LAB-003: DevOps Wrap-up: Shell & Server Config**
  - Concepts: Advanced Node configuration, `dbpath`, `logpath`, Configuration files (`.cfg`).
  - Status: *Planned*

## Module 2: Complete CRUD Operations
Focus: Mastering Create, Read, Update, and Delete operations at a granular level.

- [ ] **LAB-004: Creating Data**
  - Concepts: `insert()`, Ordered Inserts, Write Concern, Atomicity, and Data Import.
  - Status: *Planned*
- [ ] **LAB-005: Reading Data**
  - Concepts: Query selectors, Logical/Comparison Operators, Cursors, Sorting, and Projections.
  - Status: *Planned*
- [ ] **LAB-006: Updating Data**
  - Concepts: `$set`, `$inc`, `$mul`, `$min`/`$max`, `upsert`, Array Updates (filters and `$addToSet`).
  - Status: *Planned*
- [ ] **LAB-007: Deleting Data & Tooling**
  - Concepts: `deleteOne`, `deleteMany`, Collection cleanup. Visual Exploration using **MongoDB Compass**.
  - Status: *Planned*

## Module 3: Schema Design & Relationships
Focus: Leaving relational habits behind. Intelligent Structuring and Data Integrity.

- [ ] **LAB-008: Document Structuring & 1:1, 1:N Relationships**
  - Concepts: Data types application, Structuring, Embedded vs Reference models.
  - Status: *Planned*
- [ ] **LAB-009: N:N Relationships & Advanced Modeling**
  - Concepts: Handling unbounded arrays, Many-to-Many strategies.
  - Status: *Planned*
- [ ] **LAB-010: DBA Wrap-up: Schema Validation**
  - Concepts: Enforcing strict schema rules at the database level to prevent bad data.
  - Status: *Planned*

## Module 4: Performance, Indices & Spatial Data
Focus: Making queries fast and working with location data.

- [ ] **LAB-011: Core Indexing**
  - Concepts: Compound Indexes, TTL Indexes, Text Indexes, Covered Queries.
  - Status: *Planned*
- [ ] **LAB-012: Geospatial Data**
  - Concepts: GeoJSON, Geospatial Indexes, Proximity and Polygon queries.
  - Status: *Planned*
- [ ] **LAB-013: DBA Wrap-up: Query Planning & Diagnostics**
  - Concepts: Using `explain()`, execution stats, Index intersections, and Profiling.
  - Status: *Planned*

## Module 5: The Aggregation Framework
Focus: Complex data transformations and analytics pipelines.

- [ ] **LAB-014: Pipeline Fundamentals**
  - Concepts: Essential stages (`$match`, `$group`, `$project`).
  - Status: *Planned*
- [ ] **LAB-015: Advanced Pipeline Stages**
  - Concepts: Data transformation (`$unwind`, `$bucket`, `$geoNear`, `$out`).
  - Status: *Planned*

## Module 6: Security & Administration
Focus: Protecting data and securing the server.

- [ ] **LAB-016: Authentication & RBAC**
  - Concepts: Users, Roles, Role-Based Access Control configuration.
  - Status: *Planned*
- [ ] **LAB-017: DBA Wrap-up: Encryption & Network Security**
  - Concepts: SSL/TLS concepts, Encryption at Rest.
  - Status: *Planned*

## Module 7: Enterprise Integration & Transactions
Focus: Bridging the database with real application logic, with a strong primary focus on Java (Spring Boot/Data MongoDB or Sync Driver).

- [ ] **LAB-018: Java Enterprise Integration (Primary)**
  - Concepts: Real implementation in Java: Connection Pooling, Domain Modeling (POJOs), Repositories, Pagination, and Auth.
  - Status: *Planned*
- [ ] **LAB-019: Secondary Languages Integration (Node.js/Others)**
  - Concepts: Brief implementation in Node.js (Mongoose/Driver) or similar frameworks for architectural contrast.
  - Status: *Planned*
- [ ] **LAB-020: Working with Transactions**
  - Concepts: ACID compliance, multi-document transactions managed within Java code.
  - Status: *Planned*

## Module 8: Cloud-Native, High Availability & Ecosystem
Focus: Beyond local containers into production-grade systems.

- [ ] **LAB-021: High Availability & Scaling**
  - Concepts: Replica Sets (Elections), Capped Collections, and Sharding fundamentals.
  - Status: *Planned*
- [ ] **LAB-022: Managing MongoDB Atlas (Cloud)**
  - Concepts: Atlas provisioning, IP filtering, Data API integration.
  - Status: *Planned*
- [ ] **LAB-023: MongoDB Realm (Stitch) & Serverless**
  - Concepts: Access Rules, Auth (Email/Pass), Functions, and Triggers.
  - Status: *Planned*

---
**Version**: 0.2.0 | **Author**: MongoDB Lab Engineer
