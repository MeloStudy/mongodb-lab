# Implementation Plan: LAB-000 Base Setup

## Phase 1: Docker Native Setup Definition
1. Define a standard `docker-compose.yml` specifying MongoDB 7.0 natively.
2. Ensure no overlapping volumes impact the host system (ephemeral by default).
3. **Authentication Rule**: Utilize a simple unauthenticated `localhost:27017` connection to accelerate the learning curve for basic labs. Authentication mechanisms are strictly deferred until the Security Module.
4. Prepare a local `init/` folder mapping for DB initialization.

## Phase 2: Monorepo Node.js & Jest Integration
1. Structure the lab as a Workspace member (`"name": "lab-000-base-setup"`) consuming dependencies centrally from the `/package.json` root.
2. Write a base `validator.test.js` evaluating Jest's ability to seamlessly ping the unauthenticated local MongoDB server and assert version 7.0+ exists natively.

## Phase 3: Workflow Standardization (Native-First)
1. Delete auxiliary proxies like `setup.sh` and `reset.sh`.
2. Standardize `Makefile` purely as an optional, auxiliary shortcut router holding native commands.
3. Ensure the "Atomic Cleanup" requirement is completely fulfilled via the native command `docker-compose down -v --remove-orphans`.

## Phase 4: Documentation
1. Create a `README.md` exhibiting the **Command Dissection** pattern.
2. Teach the underlying native Docker Compose and NPM validation layers as the official learning path.
