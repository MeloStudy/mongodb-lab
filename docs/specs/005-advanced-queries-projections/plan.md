# Development Plan: LAB-005: Advanced Queries & Projections

## Summary
In this lab, learners will stop treating query results as "lucky guesses" and start using precise operators for nested data. We will also learn how to optimize network bandwidth using projections.

## Phase 1: Monorepo Infrastructure
1. **Scaffold**: Clone `labs/000-base-setup/` to `labs/005-advanced-queries-projections/`.
2. **Naming**: Update `package.json` to `"name": "lab-005-advanced-queries-projections"`.
3. **Naming**: Update `docker-compose.yml` to `container_name: mongodb_lab_005`.

## Phase 2: Testing & Validation
1. **Scenario 1 Assertion**: `tests/01-queries.test.js`.
    - Seed data with tricky documents (cross-matching components).
    - Test that the student's query returns exactly the number of results expected if `$elemMatch` is used.
2. **Scenario 2 Assertion**: `tests/02-projections.test.js`.
    - Verify that a search output (from a student script) does not contain restricted fields.

## Phase 3: Teaching Material
1. **CONCEPT.md**: 
    - Explaining the "OR semantics" of querying arrays without `$elemMatch`.
    - Rules of inclusion/exclusion in projections.
2. **README.md**: 
    - Scenario 1: Finding an inventory shipment with precise status and quantity.
    - Scenario 2: Projecting fields for a "card view" of a product.
3. **Dissections**: 
    - Breakdown of `$elemMatch` vs multiple filters.

## Phase 4: Final Verification
1. E2E check of query precision.
2. Check for "mixed projection" errors (learning moment).
3. Cleanup.
