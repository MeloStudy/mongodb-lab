# Lab Specification: LAB-010 Modeling Patterns (N:N & Advanced)

**Feature Branch**: `010-modeling-patterns`
**Created**: 2026-04-24
**Status**: AUDITED
**Syllabus Section**: Schema Design & Relationships

## Syllabus Alignment *(mandatory)*

- **Concept**: Advanced Modeling Patterns (Extended Reference & Subset Pattern).
- **Prerequisites**: LAB-001 through LAB-009 (Document Structuring Foundation).
- **Learning Objectives**:
  - LO-001: Implement the **Extended Reference Pattern** to minimize `$lookup` overhead.
  - LO-002: Implement the **Subset Pattern** to manage high-volume related data (e.g., reviews/comments).
  - LO-003: Understand the trade-off between **Data Redundancy** and **Read Performance**.
  - LO-004: Learn how to maintain data consistency when using redundant patterns.

## Interactive Scenarios & Validation *(mandatory)*

### Scenario 1 - The Extended Reference: "Fast Orders" (Priority: P1)

The learner manages an e-commerce system where `orders` frequently need to display the product name and price at the time of purchase. Instead of just storing a `product_id`, the learner will implement an **Extended Reference** by duplicating the `name` and `price` fields into the `order.items` array.

**Validation (Automated Test)**: A Jest test will:
1. Verify that `orders` documents contain an `items` array where each element has `product_id`, `name`, and `price`.
2. Verify that the `price` in the order matches the "snapshot" price provided in the exercise, even if the main `products` price changes later.

**Acceptance Scenarios**:
1. **Given** a new order, **When** processed, **Then** it must contain the product name and price as fields within the item object.
2. **Given** a product price update, **When** checking old orders, **Then** the order price MUST remain unchanged (Snapshot integrity).

---

### Scenario 2 - The Subset Pattern: "Recent Reviews" (Priority: P1)

The learner implements a product page that shows the 3 most recent reviews. To avoid loading thousands of reviews or doing a separate query, they will embed the `recent_reviews` array (subset) directly into the `product` document.

**Validation (Automated Test)**: A Jest test will:
1. Verify the `products` collection has a `recent_reviews` array limited to exactly 3 elements.
2. Verify that a separate `reviews` collection exists containing the full history (including the 3 in the subset).
3. Use `$slice` or similar logic to ensure the subset is maintained during new review insertions.

**Acceptance Scenarios**:
1. **Given** a product with 10 reviews, **When** queried, **Then** the product document must only contain the 3 most recent ones in its `recent_reviews` field.
2. **Given** a new review insertion, **When** updating the product, **Then** the `recent_reviews` array must be updated and capped at 3 using the `$each`, `$sort`, and `$slice` operators.

---

## Educational Requirements *(mandatory)*

### Concepts to Explain

- **EX-001**: **Extended Reference Pattern**: Why duplicating data is often better than joining in NoSQL.
- **EX-002**: **Subset Pattern**: Balancing the "One-to-Many" vs "One-to-Few" conflict.
- **EX-003**: **Computational Complexity**: How these patterns shift complexity from Read-time to Write-time.

### Technical Requirements

- **TR-001**: Lab MUST be containerized strictly using **Docker / Docker Compose** (MongoDB 7.0+).
- **TR-002**: Lab README MUST provide native orchestration commands step-by-step.
- **TR-003**: Lab MUST include automated validation tests (Node.js/Jest).
- **TR-004**: Lab README MUST provide a "Command Dissection" for advanced `$push` modifiers (`$slice`, `$sort`).
- **TR-005**: All testing scripts MUST be thoroughly commented.
- **TR-006**: Theoretical context MUST be provided in a `CONCEPT.md` file.
- **TR-007**: Lab MUST explicitly instruct "Atomic Cleanup" via `docker-compose down -v --remove-orphans`.

## Success Criteria *(measurable outcomes)*

- **SC-001**: Learner correctly implements data redundancy to optimize a read-heavy query.
- **SC-002**: Learner successfully applies the `$slice` operator to maintain a fixed-size subset array.
- **SC-003**: All validation tests pass.

## Assumptions

- Learner is comfortable with `$push` and basic array updates.
- Learner understands the concept of "Joining" from a relational background.
